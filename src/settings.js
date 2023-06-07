import { Vector2 } from "three";

class Settings {
  constructor(dt, diff, visc) {
    let tempWidth = window.innerWidth;
    let tempHeight = window.innerHeight;
    this.sideLength = tempWidth <= tempHeight ? tempWidth : tempHeight;
    this.width = tempWidth;
    this.height = tempHeight;

    this.dt = dt;
    this.diff = diff;
    this.visc = visc;
    this.resolution = 1;
    this.cellScale = 1 / this.sideLength;
    this.cellScale2 = new Vector2(1 / this.width, 1 / this.height);
    this.pixelSize = this.cellScale * this.resolution;
    this.pixelSize2 = this.cellScale2 * this.resolution;
    this.diffuseIterations = 8;
    this.projectIterations = 8;
  }

  resize(newSideLength) {
    this.sideLength = newSideLength;
  }

  resize2(newWidth, newHeight) {
    this.width = newWidth;
    this.height = newHeight;
  }
}

export default new Settings(0.2, 0, 0.0000001);
// numbers taken from https://editor.p5js.org/codingtrain/sketches/9kVfB4BF2
