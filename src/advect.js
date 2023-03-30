import { Camera, Mesh, PlaneGeometry, Scene, ShaderMaterial } from "three";
import advectFrag from "./shaders/advect.frag";
import fullscreenVert from "./shaders/fullscreenquad.vert";
import Settings from "./settings";
import Common from "./common";

// Step 2: Advect (or Transport)
// In this simulation we would use the Semi-Lagrangian method, instead of the BFECC method
// proposed here: https://mofu-dev.com/en/blog/stable-fluids/#advection, which is argued
// to be better
class Advect {
  constructor(velocFbo, tempVelocFbo) {
    this.dt = Settings.dt;
    this.velocFbo = velocFbo;
    this.tempVelocFbo = tempVelocFbo;

    this.init();
  }

  init() {
    this.camera = new Camera();
    this.geometry = new PlaneGeometry(2, 2);

    this.advectScene = new Scene();
    this.advectMaterial = new ShaderMaterial({
      uniforms: {
        pixelSize: { value: Settings.pixelSize },
        dt: { value: Settings.dt },
        velocity: { value: this.velocFbo.texture },
      },
      vertexShader: fullscreenVert,
      fragmentShader: advectFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.advectQuad = new Mesh(this.geometry, this.advectMaterial);
    this.advectScene.add(this.advectQuad);
  }

  render() {
    this.advectQuad.material.uniforms.velocity.value = this.velocFbo.texture;

    Common.renderer.setRenderTarget(this.tempVelocFbo);
    Common.renderer.render(this.advectScene, this.camera);
    Common.renderer.setRenderTarget(null);

    // switching the FBOs
    let temp = this.velocFbo;
    this.velocFbo = this.tempVelocFbo;
    this.tempVelocFbo = temp;
  }
}

export default Advect;
