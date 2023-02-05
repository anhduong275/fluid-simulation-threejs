import { Camera, ShaderMaterial, Scene, PlaneGeometry, Mesh } from "three";
import pressureFrag from "./shaders/pressure.frag";
import divergenceFrag from "./shaders/divergence.frag";
import projectFrag from "./shaders/project.frag";
import settingPressureFrag from "./shaders/settingPressure.frag";
import fullscreenVert from "./shaders/fullscreenquad.vert";
import Settings from "./settings";
import Common from "./common";

/*
When creating an instance of this class, create only 1 for both x & y directions
*/
class Project {
  /**
   *
   * @param {*} veloc an FBO
   * @param {*} p an FBO
   * @param {*} div an FBO
   * @param {*} iter int number of iterations
   * @param {*} boundaryIndex int boundary index
   */
  constructor(veloc, p, div, iter, boundaryIndex) {
    this.veloc = veloc;
    this.p = p;
    this.div = div;
    this.iter = iter;
    this.boundaryIndex = boundaryIndex;

    this.setCorners = 0;
    this.setBound = 0;

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
        xTexture: { value: this.p.texture },
        x0Texture: { value: this.div.texture },
        a: { value: 1 },
        c: { value: 6 },
        cellScale: { value: Settings.cellScale },
        setBound: { value: this.setBound },
        boundaryIndex: { value: this.boundaryIndex },
      },
      vertexShader: fullscreenVert,
      fragmentShader: pressureFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.divergenceMaterial = new ShaderMaterial({
      uniforms: {
        veloc: { value: this.veloc.texture },
        cellScale: { value: Settings.cellScale },
        N: { value: Settings.sideLength },
        div: { value: this.div.texture },
        setCorners: { value: this.setCorners },
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

    // creating setting pressure scene // set pressure to 0
    this.settingPressureScene = new Scene();
    this.settingPressureMaterial = new ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: settingPressureFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.settingPressureQuad = new Mesh(
      this.geometry,
      this.settingPressureMaterial
    );
    this.settingPressureScene.add(this.settingPressureQuad);

    // creating project scene
    this.projectScene = new Scene();
    this.projectMaterial = new ShaderMaterial({
      uniforms: {
        p: { value: this.p.texture },
        veloc: { value: this.veloc.texture },
        cellScale: { value: Settings.cellScale },
        N: { value: Settings.sideLength },
        setBound: { value: this.setBound },
      },
      vertexShader: fullscreenVert,
      fragmentShader: projectFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.projectQuad = new Mesh(this.geometry, this.projectMaterial);
    this.projectScene.add(this.projectQuad);
  }

  render() {
    // set p to 0
    Common.renderer.setRenderTarget(this.p);
    Common.renderer.render(this.settingPressureScene, this.camera);
    Common.renderer.setRenderTarget(null);

    this.setBound = 0;
    this.setCorners = 0;

    // rendering div
    for (let i = 0; i < this.iter * 2; i++) {
      Common.renderer.setRenderTarget(this.div);
      Common.renderer.render(this.divergenceScene, this.camera);
      Common.renderer.setRenderTarget(null);

      this.setCorners++;
      this.setCorners = this.setCorners % 2;
      this.divergenceQuad.material.uniforms.setCorners.value = this.setCorners;
    }

    // rendering p
    for (let i = 0; i < this.iter * 3; i++) {
      Common.renderer.setRenderTarget(this.p);
      Common.renderer.render(this.pressureScene, this.camera);
      Common.renderer.setRenderTarget(null);

      this.setBound++;
      this.setBound = this.setBound % 3;
      this.pressureQuad.material.uniforms.setBound.value = this.setBound;
    }

    this.setBound = 0;
    this.setCorners = 0;

    // rendering project
    for (let i = 0; i < this.iter * 3; i++) {
      Common.renderer.setRenderTarget(this.veloc);
      Common.renderer.render(this.projectScene, this.camera);
      Common.renderer.setRenderTarget(null);

      this.setBound++;
      this.setBound = this.setBound % 3;
      this.projectQuad.material.uniforms.setBound.value = this.setBound;
    }
  }
}

export default Project;
