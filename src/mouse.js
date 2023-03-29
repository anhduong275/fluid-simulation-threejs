import Settings from "./settings.js";
import { Vector2 } from "three";

class Mouse {
  init() {
    this.isMouseDown = false;
    this.mousePos = new Vector2(-1, -1);
    this.prevMousePos = new Vector2(-1, -1);
    document.body.addEventListener("mousedown", () => {
      this.onDocumentMouseDown();
    });
    document.body.addEventListener("mouseup", () => {
      this.onDocumentMouseUp();
    });
    document.body.addEventListener("mousemove", (event) => {
      this.onDocumentMouseMove(event);
    });
  }

  onDocumentMouseDown() {
    console.log("mouse is down");
    this.isMouseDown = true;
  }
  onDocumentMouseUp() {
    this.isMouseDown = false;
    this.mousePos = new Vector2(-1, -1);
  }
  onDocumentMouseMove(event) {
    if (this.isMouseDown) {
      let tempWidth = window.innerWidth;
      let tempHeight = window.innerHeight;
      const extraLength =
        tempWidth <= tempHeight
          ? tempHeight - tempWidth
          : tempWidth - tempHeight;
      let mousePosX =
        tempWidth <= tempHeight
          ? event.pageX * Settings.cellScale * 2 - 1
          : (event.pageX - extraLength) * Settings.cellScale * 2 - 1;
      if (mousePosX < Settings.sideLength + extraLength / 2) {
        mousePosX =
          tempWidth <= tempHeight
            ? event.pageX * Settings.cellScale * 2 - 1
            : (event.pageX - extraLength / 2) * Settings.cellScale * 2 - 1;
      }
      let mousePosY =
        tempWidth <= tempHeight
          ? (event.pageY - extraLength) * Settings.cellScale * 2 - 1
          : event.pageY * Settings.cellScale * 2 - 1;
      if (mousePosY < Settings.sideLength + extraLength / 2) {
        mousePosY =
          tempWidth <= tempHeight
            ? (event.pageY - extraLength / 2) * Settings.cellScale * 2 - 1
            : event.pageY * Settings.cellScale * 2 - 1;
      }
      // flip y
      mousePosY = -mousePosY;

      // convert to range(0,1)
      mousePosX = (mousePosX + 1) / 2;
      mousePosY = (mousePosY + 1) / 2;

      const tempMousePos = this.mousePos;
      this.mousePos = new Vector2(mousePosX, mousePosY);
      // if this is the first move after mouse down
      if (tempMousePos.x == -1 && tempMousePos.y == -1) {
        this.prevMousePos = this.mousePos;
      } else {
        this.prevMousePos = this.tempMousePos;
      }

      console.log("mouse x ", this.mousePos.x, ", mouse y ", this.mousePos.y);
      return this.mousePos;
    } else {
      return new Vector2(-1, -1);
    }
  }
}

export default new Mouse();
