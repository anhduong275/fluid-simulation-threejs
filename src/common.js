import * as THREE from "three";

class Common {
  constructor() {
    const canvas = document.querySelector("canvas.webgl");
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  updateRenderer(sizes) {
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

export default new Common();
