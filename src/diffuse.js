import { Camera, Mesh, PlaneGeometry, Scene, ShaderMaterial } from "three";
import fullscreenVert from "./shaders/fullscreenquad.vert";
import diffuseFrag from "./shaders/diffuse.frag";
import Settings from "./settings";
import Common from "./common";

/*
This is the code in Mike Ash's article:
diffuse(1, Vx0, Vx, visc, dt, 4, N);
diffuse(2, Vy0, Vy, visc, dt, 4, N);
diffuse(3, Vz0, Vz, visc, dt, 4, N);
...
diffuse(0, s, density, diff, dt, 4, N);

I have 2 choices:
- create 4 diffuse objects, each for a certain task, and keep diffuse general
- or try to combine all into 1 object
I personally think the 1st option is better
*/

// DO WE NEED TO INITIALIZE X & X0 IN THE MAIN FUNCTION IN ANY WAY?
class Diffuse {
  /**
   *
   * @param {*} boundaryIndex int
   * @param {*} x v_x0 | v_y0, the fbo
   * @param {*} x0 v_x | v_y, the fbo
   * @param {*} diff float
   * @param {*} iter int number of iterations
   */
  constructor(boundaryIndex, x, x0, diff, iter) {
    this.boundaryIndex = boundaryIndex;
    this.x = x;
    this.x0 = x0;
    this.diff = diff;
    this.dt = Settings.dt;
    this.iter = iter;
    this.sideLength = Settings.sideLength;
    this.setBound = 0;

    this.init();
  }

  init() {
    // creates a scene
    const a =
      this.dt * this.diff * (this.sideLength - 2) * (this.sideLength - 2);
    const c = 1 + 6 * a;
    this.diffuseScene = new Scene();
    this.camera = new Camera();
    this.material = new ShaderMaterial({
      uniforms: {
        xTexture: { value: this.x.texture },
        x0Texture: { value: this.x0.texture },
        a: { value: a },
        c: { value: c },
        cellScale: { value: Settings.cellScale },
        setBound: { value: this.setBound },
        boundaryIndex: { value: this.boundaryIndex },
      },
      vertexShader: fullscreenVert,
      fragmentShader: diffuseFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.geometry = new PlaneGeometry(2, 2);
    this.diffuseQuad = new Mesh(this.geometry, this.material);
    this.diffuseScene.add(this.diffuseQuad);

    // init render
    Common.renderer.setRenderTarget(this.x);
    Common.renderer.render(this.diffuseScene, this.camera);
  }

  render() {
    this.setBound = 0;

    // let fbo_0 = x;
    // let fbo_1 = x0;
    // let temp_fbo;

    // Tripling the iterations to account for set boundary
    for (let i = 0; i < this.iter * 3; i++) {
      // Common.renderer.setRenderTarget(fbo_0);
      // // update material fbo
      // this.diffuseQuad.material.uniforms.xTexture.value = fbo_0.texture;
      // this.diffuseQuad.material.uniforms.x0Texture.value = fbo_1.texture;
      // Common.renderer.render(this.diffuseScene, this.camera);
      // Common.renderer.setRenderTarget(null);

      // // switching the fbos
      // temp_fbo = fbo_0;
      // fbo_0 = fbo_1;
      // fbo_1 = temp_fbo;

      // In Mike Ash's version, he didn't switch
      // might need to look further. Mike might have missed some steps
      Common.renderer.setRenderTarget(this.x);
      Common.renderer.render(this.diffuseScene, this.camera);
      Common.renderer.setRenderTarget(null);

      this.setBound++;
      this.setBound = this.setBound % 3;
      this.diffuseQuad.material.uniforms.setBound.value = this.setBound;
    }
  }

  /**
   *
   * @param {*} b int - not sure what for TODO
   * @param {*} x
   * @param {*} x0
   * @param {*} a float - not sure what for TODO
   * @param {*} c float - not sure what for TODO
   * @param {*} iter
   */
  // linAlg(b, x, x0, a, c, iter) {}
  // THIS FUNCTION NEEDS TO BE INSIDE THE SHADER!

  // TODO:
  // - create shaders (vert & frag) for linalg
  // - because this function is called by both diffuse & project (check) =>
  // it should be at the global level => should move this linalg thing into a new file,
  // and call this in the main func
  // - QUESTION: how to factorize setbounds & linalg? bc setbounds is used both inside & outside linalg
  // - ANSWER: I think the only thing we can do now is rewrite these funcs wherever we see them
}

export default Diffuse;
