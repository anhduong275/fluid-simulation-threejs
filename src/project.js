import { Camera, ShaderMaterial, Scene, PlaneGeometry, Mesh } from "three";
import pressureFrag from "./shaders/pressure.frag";
import divergenceFrag from "./shaders/divergence.frag";
import projectFrag from "./shaders/project.frag";
import fullscreenVert from "./shaders/fullscreenquad.vert";
import fullscreenFrag from "./shaders/fullscreenquad.frag";
import Settings from "./settings";
import Common from "./common";

/*
When creating an instance of this class, create only 1 for both x & y directions
*/
class Project {
  /**
   *
   * @param {*} velocFbo velocity FBO
   * @param {*} tempVelocFbo temporary velocity FBO
   * @param {*} divergenceFbo divergenceFbo FBO
   * @param {*} pressureFbo1 pressure FBO 1
   * @param {*} pressureFbo2 pressure FBO 2
   */
  constructor(
    velocFbo,
    tempVelocFbo,
    divergenceFbo,
    pressureFbo1,
    pressureFbo2
  ) {
    this.velocFbo = velocFbo;
    this.tempVelocFbo = tempVelocFbo;
    this.divergenceFbo = divergenceFbo;

    this.pressureFbo1 = pressureFbo1;
    this.pressureFbo2 = pressureFbo2;

    this.init();
  }

  init() {
    // create a scene
    this.pressureScene = new Scene();
    this.divergenceScene = new Scene();

    this.camera = new Camera();
    this.geometry = new PlaneGeometry(2, 2);

    this.pressureMaterial = new ShaderMaterial({
      uniforms: {
        pixelSize: { value: Settings.pixelSize },
        pressure: { value: this.pressureFbo1.texture },
        dt: { value: Settings.dt },
        divergence: { value: this.divergenceFbo.texture },
      },
      vertexShader: fullscreenVert,
      fragmentShader: pressureFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.divergenceMaterial = new ShaderMaterial({
      uniforms: {
        velocity: { value: this.velocFbo.texture },
        pixelSize: { value: Settings.pixelSize },
      },
      vertexShader: fullscreenVert,
      fragmentShader: divergenceFrag,

      depthWrite: false,
      depthTest: false,
    });

    this.pressureQuad = new Mesh(this.geometry, this.pressureMaterial);
    this.pressureScene.add(this.pressureQuad);
    this.divergenceQuad = new Mesh(this.geometry, this.divergenceMaterial);
    this.divergenceScene.add(this.divergenceQuad);

    // creating project scene
    this.projectScene = new Scene();
    this.projectMaterial = new ShaderMaterial({
      uniforms: {
        velocity: { value: this.velocFbo.texture },
        pressure: { value: this.pressureFbo2.texture },
        dt: { value: Settings.dt },
        pixelSize: { value: Settings.pixelSize },
      },
      vertexShader: fullscreenVert,
      fragmentShader: projectFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.projectQuad = new Mesh(this.geometry, this.projectMaterial);
    this.projectScene.add(this.projectQuad);

    // creating render scene
    this.renderScene = new Scene();
    this.renderMaterial = new ShaderMaterial({
      uniforms: {
        fboTexture: { value: this.velocFbo.texture },
        pixelSize: { value: Settings.pixelSize },
      },
      vertexShader: fullscreenVert,
      fragmentShader: fullscreenFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.renderQuad = new Mesh(this.geometry, this.renderMaterial);
    this.renderScene.add(this.renderQuad);
  }

  renderDivergence() {
    this.divergenceQuad.material.uniforms.velocity.value =
      this.velocFbo.texture;

    Common.renderer.setRenderTarget(this.divergenceFbo);
    Common.renderer.render(this.divergenceScene, this.camera);
    Common.renderer.setRenderTarget(null);
  }

  renderPressure() {
    let temp;
    // render pressure using Jacobi iterative method
    // start with pressureFbo1
    for (let i = 0; i < Settings.projectIterations; i++) {
      // render onto pressureFbo2
      Common.renderer.setRenderTarget(this.pressureFbo2);
      // this currently hold pressureFbo1
      Common.renderer.render(this.pressureScene, this.camera);
      Common.renderer.setRenderTarget(null);

      // switch between pressureFbo1 & pressureFbo2
      temp = this.pressureFbo2; // temp is now newly rendered
      this.pressureFbo2 = this.pressureFbo1; // pressureFbo2 is now not rendered
      this.pressureFbo1 = temp; // pressureFbo1 is now newly rendered
    }

    // now, pressureFbo2 is always going to be the final result
  }

  renderProject() {
    this.projectQuad.material.uniforms.velocity.value = this.velocFbo.texture;

    // calculate final velocity
    Common.renderer.setRenderTarget(this.tempVelocFbo);
    // this scene's velocity uniform currently holds the OG velocity FBO (velocFbo)
    Common.renderer.render(this.projectScene, this.camera);
    Common.renderer.setRenderTarget(null);

    // switch tempVelocFbo with velocFbo -- DO WE REALLY SWITCH OR JUST ASSIGNING THIS IS ENOUGH?
    let temp = this.velocFbo;
    this.velocFbo = this.tempVelocFbo;
    this.tempVelocFbo = temp;
  }

  render() {
    // render divergence to divergenceFbo
    this.renderDivergence();

    // render pressure
    this.renderPressure();

    // render project
    // final velocity should be velocFbo
    this.renderProject();
  }

  renderVelocity() {
    this.renderQuad.material.uniforms.fboTexture.value = this.velocFbo.texture;
    Common.renderer.render(this.renderScene, this.camera);
  }
}

export default Project;
