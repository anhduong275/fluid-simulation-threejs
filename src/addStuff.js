import {
  Camera,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
} from "three";
import fullscreenVert from "./shaders/fullscreenquad.vert";
import addDyeFrag from "./shaders/addDye.frag";
import fullScreenFrag from "./shaders/fullscreenquad.frag";
import Common from "./common";

class AddStuff {
  /**
   *
   * @param {*} densityFbo
   * @param {*} tempDensityFbo
   * @param {*} velocityFbo
   */
  constructor(densityFbo, tempDensityFbo, velocityFbo) {
    this.densityFbo = densityFbo;
    this.tempDensityFbo = tempDensityFbo;
    this.velocityFbo = velocityFbo;

    this.init();
  }

  init() {
    this.camera = new Camera();
    this.geometry = new PlaneGeometry(2, 2);

    // create add dye scene
    this.addDyeScene = new Scene();
    this.addDyeMaterial = new ShaderMaterial({
      uniforms: {
        density: { value: this.tempDensityFbo.texture },
        amount: { value: 0 },
        vUvAdded: { value: new Vector2(2, 2) },
        init: { value: true },
      },
      vertexShader: fullscreenVert,
      fragmentShader: addDyeFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.addDyeQuad = new Mesh(this.geometry, this.addDyeMaterial);
    this.addDyeScene.add(this.addDyeQuad);

    // render temp density 1st time
    Common.renderer.setRenderTarget(this.densityFbo);
    Common.renderer.render(this.addDyeScene, this.camera);
    Common.renderer.setRenderTarget(null);

    // create add velocity scene
    this.addVelScene = new Scene();
    this.addVelMaterial = new ShaderMaterial({
      uniforms: {
        velocity: { value: this.velocityFbo.texture },
        velocAdded: { value: new Vector2(0.0, 0.0) },
        vUvAdded: { value: new Vector2(2.0, 2.0) },
      },
      vertexShader: fullscreenVert,
      fragmentShader: addDyeFrag,

      depthWrite: false,
      depthTest: false,
    });
    this.addVelQuad = new Mesh(this.geometry, this.addVelMaterial);
    this.addVelScene.add(this.addVelQuad);
  }

  /**
   *
   * @param {*} amount is a float
   * @param {*} vUvAdded the place where dye is added
   */
  addDye(amount, vUvAdded) {
    this.addDyeQuad.material.uniforms.density.value = this.densityFbo.texture;
    this.addDyeQuad.material.uniforms.amount.value = amount;
    this.addDyeQuad.material.uniforms.vUvAdded.value = vUvAdded;
    this.addDyeQuad.material.uniforms.init.value = false;
    Common.renderer.setRenderTarget(this.tempDensityFbo);
    Common.renderer.render(this.addDyeScene, this.camera);
    Common.renderer.setRenderTarget(null);

    // switching the FBOs
    let temp = this.densityFbo;
    this.densityFbo = this.tempDensityFbo;
    this.tempDensityFbo = temp;
  }

  renderDye() {
    Common.renderer.render(this.addDyeScene, this.camera);
  }

  /**
   *
   * @param {*} velocAdded velocity vec2
   * @param {*} vUvAdded the place where dye is added
   */
  addVelocity(velocAdded, vUvAdded) {
    this.addVelQuad.material.uniforms.velocAdded = velocAdded;
    this.addVelQuad.material.uniforms.vUvAdded = vUvAdded;
    Common.renderer.setRenderTarget(this.velocityFbo);
    Common.renderer.render(this.addVelScene, this.camera);
    Common.renderer.setRenderTarget(null);
  }
}

export default AddStuff;
