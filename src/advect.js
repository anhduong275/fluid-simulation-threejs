import { Camera, Mesh, PlaneGeometry, Scene, ShaderMaterial } from "three";
import advectFrag from "./shaders/advect.frag";
import fullscreenVert from "./shaders/fullscreenquad.vert";
import Settings from "./settings";

// Step 2: Advect (or Transport)
// In this simulation we would use the Semi-Lagrangian method, instead of the BFECC method
// proposed here: https://mofu-dev.com/en/blog/stable-fluids/#advection, which is argued
// to be better
class Advect {
  constructor(advectFbo, tempAdvectFbo) {
    this.dt = Settings.dt;
    this.advectFbo = advectFbo;
    this.tempAdvectFbo = tempAdvectFbo;

    this.init();
  }

  init() {
    this.camera = new Camera();
    this.geometry = new PlaneGeometry(2, 2);

    this.advectScene = new Scene();
    this.advectMaterial = new ShaderMaterial({
      uniforms: {
        pixelSize: { value: Settings.pixelSize },
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
    //
  }
}

export default Advect;
