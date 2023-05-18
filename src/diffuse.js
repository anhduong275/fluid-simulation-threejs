import { Camera, Mesh, PlaneGeometry, Scene, ShaderMaterial } from "three";
import fullscreenVert from "./shaders/fullscreenquad.vert";
import diffuseFrag from "./shaders/diffuse.frag";
import fullscreenFrag from "./shaders/fullscreenquad.frag";
import Settings from "./settings";
import Common from "./common";

class Diffuse {
  /**
   *
   * @param {*} velocFbo the velocity FBO
   * @param {*} diffuseFbo1 diffuse FBO number 1
   * @param {*} diffuseFbo2 diffuse FBO number 2
   */
  constructor(velocFbo, diffuseFbo1, diffuseFbo2) {
    this.velocFbo = velocFbo;

    this.diffuseFbo1 = diffuseFbo1;
    this.diffuseFbo2 = diffuseFbo2;

    this.new_velocity = this.diffuseFbo1;
    this.rendertarget = this.diffuseFbo2;

    this.init();
  }

  init() {
    // creates a scene
    this.diffuseScene = new Scene();
    this.camera = new Camera();
    this.material = new ShaderMaterial({
      uniforms: {
        velocity: { value: this.velocFbo.texture },
        new_velocity: { value: this.new_velocity.texture },
        pixelSize: { value: Settings.pixelSize },
        dt: { value: Settings.dt },
        viscosity: { value: Settings.visc },
      },
      vertexShader: fullscreenVert,
      fragmentShader: diffuseFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.geometry = new PlaneGeometry(2, 2);
    this.diffuseQuad = new Mesh(this.geometry, this.material);
    this.diffuseScene.add(this.diffuseQuad);

    // creating render scene
    this.renderScene = new Scene();
    this.renderMaterial = new ShaderMaterial({
      uniforms: {
        fboTexture: { value: this.new_velocity.texture },
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

  render() {
    this.diffuseQuad.material.uniforms.velocity.value = this.velocFbo.texture;
    // The linear solver we use is Jacobi iterative solver, following Mofu-dev
    let temp;
    for (let i = 0; i < Settings.diffuseIterations; i++) {
      this.diffuseQuad.material.uniforms.new_velocity.value =
        this.new_velocity.texture;
      // render
      Common.renderer.setRenderTarget(this.rendertarget);
      Common.renderer.render(this.diffuseScene, this.camera);
      Common.renderer.setRenderTarget(null);

      // switch between diffuseFbo1 and diffuseFbo2
      temp = this.new_velocity; // if new vel is dif1
      this.new_velocity = this.rendertarget; // new vel is dif 2 now, rendertarget is dif2
      this.rendertarget = temp; // rendertarget is now dif1
    }

    this.renderQuad.material.uniforms.fboTexture.value =
      this.new_velocity.texture;
    Common.renderer.setRenderTarget(this.velocFbo);
    Common.renderer.render(this.renderScene, this.camera);
    Common.renderer.setRenderTarget(null);
  }
}

export default Diffuse;
