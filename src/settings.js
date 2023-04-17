class Settings {
  constructor(dt, diff, visc) {
    let tempWidth = window.innerWidth;
    let tempHeight = window.innerHeight;
    this.sideLength = tempWidth <= tempHeight ? tempWidth : tempHeight;

    this.dt = dt;
    this.diff = diff;
    this.visc = visc;
    this.resolution = 4;
    this.cellScale = 1 / this.sideLength;
    this.pixelSize = this.cellScale * this.resolution;

    this.diffuseIterations = 4;
    this.projectIterations = 4;
  }

  resize(newSideLength) {
    this.sideLength = newSideLength;
  }
}

export default new Settings(0.2, 0, 0.0000001);
// numbers taken from https://editor.p5js.org/codingtrain/sketches/9kVfB4BF2
