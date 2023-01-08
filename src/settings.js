class Settings {
  constructor(dt, diff, visc) {
    let tempWidth = window.innerWidth;
    let tempHeight = window.innerHeight;
    this.sideLength = tempWidth <= tempHeight ? tempWidth : tempHeight;

    this.dt = dt;
    this.diff = diff;
    this.visc = visc;
    this.cellScale = 1 / this.sideLength;
  }

  resize(newSideLength) {
    this.sideLength = newSideLength;
  }
}

export default new Settings(0.2, 0, 0.0000001);
// numbers taken from https://editor.p5js.org/codingtrain/sketches/9kVfB4BF2
