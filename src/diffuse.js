import { Camera, Mesh, PlaneGeometry, Scene, ShaderMaterial } from "three";
import fullscreenVert from "./shaders/fullscreenquad.vert";
import diffuseFrag from "./shaders/diffuse.frag";
import Settings from "./settings";
import Common from "./common";

class Diffuse {
  /**
   *
   * @param {*} boundaryIndex int
   * @param {*} velocFbo the velocity FBO
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
  }

  render() {
    // The linear solver we use is Jacobi iterative solver, following Mofu-dev
    let temp;
    for (let i = 0; i < Settings.diffuseIterations; i++) {
      // render
      Common.renderer.setRenderTarget(this.rendertarget);
      Common.renderer.render(this.diffuseScene, this.camera);
      Common.renderer.setRenderTarget(null);

      // switch between diffuseFbo1 and diffuseFbo2
      temp = this.new_velocity; // if new vel is dif1
      this.new_velocity = this.rendertarget; // new vel is dif 2 now, rendertarget is dif2
      this.rendertarget = temp; // rendertarget is now dif1
    }

    this.velocFbo = this.rendertarget;
  }
}

export default Diffuse;
