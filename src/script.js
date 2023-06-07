import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import Settings from "./settings.js";
import Common from "./common";
import Diffuse from "./diffuse";
import AddStuff from "./addStuff";
import { Vector2 } from "three";
import mouse from "./mouse";
import Advect from "./advect";
import Project from "./project";

// Debug
const gui = new dat.GUI();

/**
 * Sizes
 */
let tempWidth = window.innerWidth;
let tempHeight = window.innerHeight;
const sideLength = tempWidth <= tempHeight ? tempWidth : tempHeight;
const sizes = {
  width: sideLength,
  height: sideLength,
};

/**
 * Renderer
 */
Common.updateRenderer(sizes);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = sideLength;
  sizes.height = sideLength;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  Common.updateRenderer(sizes);

  // Update settings
  Settings.resize(sideLength);
});

/**
 * FBO
 */

const type = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
  ? THREE.HalfFloatType
  : THREE.FloatType;
const fboIds = {
  s: 0,
  density: 0,
  tempDensity: 0,

  veloc: 0,
  tempVeloc: 0,

  diffuseFbo1: 0,
  diffuseFbo2: 0,

  divergence: 0,
  pressureFbo1: 0,
  pressureFbo2: 0,
};
for (let key in fboIds) {
  fboIds[key] = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
    type: type,
  });
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;

// GUI
var props = {
  colorOptions: "Black/White/Blue",
};

const colorFolder = gui.addFolder("Color Options");
let colors = colorFolder
  .add(props, "colorOptions", [
    "Black/Red/Green",
    "White/Blue/Purple",
    "Black/White/Blue",
    "White/Blue",
  ])
  .name("Color Options")
  .listen();
colors.onChange((newValue) => {
  let option = 0;
  console.log(newValue);
  switch (newValue) {
    case "Black/Red/Green":
      option = 0;
      break;
    case "White/Blue/Purple":
      option = 1;
      break;
    case "Black/White/Blue":
      option = 2;
      break;
    case "White/Blue":
      option = 3;
      break;
  }
  project.changeColorOption(option);
  mouse.onDocumentMouseUp();
});

/**
 * Initializing action objects
 */

// addStuff
const addStuff = new AddStuff(
  fboIds.density,
  fboIds.tempDensity,
  fboIds.veloc,
  fboIds.tempVeloc
);

// advect
const advect = new Advect(fboIds.veloc, fboIds.tempVeloc);

// diffuse
const diffuseVeloc = new Diffuse(
  fboIds.veloc,
  fboIds.diffuseFbo1,
  fboIds.diffuseFbo2
);

// project
const project = new Project(
  fboIds.veloc,
  fboIds.tempVeloc,
  fboIds.divergence,
  fboIds.pressureFbo1,
  fboIds.pressureFbo2
);

/**
 * Mouse Controls
 */
mouse.init();

let notFirstTick = 0;
let lastOutputtedVelocFbo;
let lastOutputtedTempVelocFbo;
let dyeAdded = false;

const tick = () => {
  // Render
  // render advect. Not sure why it has to be before addStuff, but it works.
  if (notFirstTick) {
    advect.velocFbo = lastOutputtedVelocFbo;
    advect.tempVelocFbo = lastOutputtedTempVelocFbo;
  }
  advect.render();

  // adding user interactivity
  if (mouse.isMouseDown && mouse.mousePos.x != -1 && mouse.mousePos.y != -1) {
    addStuff.velocityFbo = advect.velocFbo;
    addStuff.tempVelocityFbo = advect.tempVelocFbo;

    // addStuff.addDye(0.1, mouse.mousePos);
    const veloc = new Vector2(
      mouse.mousePos.x - mouse.prevMousePos.x,
      mouse.mousePos.y - mouse.prevMousePos.y
    );
    addStuff.addVelocity(veloc, mouse.mousePos);

    dyeAdded = true;
  }

  // render diffuse & project
  if (dyeAdded) {
    // render diffuse. TEMPORARILY LOCKED
    diffuseVeloc.velocFbo = addStuff.velocityFbo;
    // diffuseVeloc.render();
    // render project
    project.velocFbo = addStuff.velocityFbo;
    project.tempVelocFbo = addStuff.tempVelocityFbo;
    project.render();

    // reset dyeAdded to false
    dyeAdded = false;
  } else {
    // render diffuse. TEMPORARILY LOCKED
    diffuseVeloc.velocFbo = advect.velocFbo;
    // diffuseVeloc.render();
    // render project
    project.velocFbo = advect.velocFbo;
    project.tempVelocFbo = advect.tempVelocFbo;
    project.render();
  }

  project.renderVelocity();

  lastOutputtedVelocFbo = project.velocFbo;
  lastOutputtedTempVelocFbo = project.tempVelocFbo;
  notFirstTick = 1;

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
