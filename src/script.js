import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import fullscreenquadVert from "./shaders/fullscreenquad.vert";
import fullscreenquadFrag from "./shaders/fullscreenquad.frag";
import Settings from "./settings.js";
import Common from "./common";
import Diffuse from "./diffuse";
import AddStuff from "./addStuff";
import { Vector2 } from "three";
import mouse from "./mouse";
import { convertToNormalizeCoords } from "./utils";
import Advect from "./advect";
import Project from "./project";
import FBOHelper from "three.fbo-helper";

// Debug
const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();
const fsquadScene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

// Materials

const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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

let testFbo = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
  type: type,
});

// Fullscreen Quad
var quad = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    uniforms: { fboTexture: { value: testFbo.texture } },
    vertexShader: fullscreenquadVert,
    fragmentShader: fullscreenquadFrag,

    depthWrite: false,
    depthTest: false,
  })
);
fsquadScene.add(quad);

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
// scene.add(camera);
// fsquadScene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// GUI
const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", 0, 10);
cameraFolder.add(camera.position, "y", 0, 10);
cameraFolder.add(camera.position, "z", 0, 10);
cameraFolder.open();

/**
 * Animate
 */

const clock = new THREE.Clock();

/**
 * Initializing action objects
 */

// addStuff
// const addStuff = new AddStuff(
//   fboIds.density,
//   fboIds.tempDensity,
//   fboIds.veloc,
//   fboIds.tempVeloc
// );
const addStuff = new AddStuff(
  fboIds.veloc,
  fboIds.tempVeloc,
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
 * FBOHelper
 */
// let helper = new FBOHelper(Common.renderer);
// helper.setSize(Settings.sideLength, Settings.sideLength);
// helper.attach(fboIds.veloc, "Velocity FBO", function (d) {
//   return `Color: (${d.r}, ${d.g}, ${d.b})`;
// });

/**
 * Mouse Controls
 */
mouse.init();

let notFirstTick = 0;
let lastOutputtedVelocFbo;
let lastOutputtedTempVelocFbo;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  // Update Orbital Controls
  // controls.update()

  // Render
  // Common.renderer.setRenderTarget(testFbo);
  // Common.renderer.render(scene, camera);
  // Common.renderer.setRenderTarget(null);

  // Common.renderer.render(fsquadScene, camera);

  // temp
  // TODO: change addStuff's density to veloc
  if (notFirstTick) {
    addStuff.densityFbo = lastOutputtedVelocFbo;
    addStuff.tempDensityFbo = lastOutputtedTempVelocFbo;
  } else {
    console.log("tick num", notFirstTick);
    console.log("addStuff.densityFbo", addStuff.densityFbo.texture.id);
    console.log("addStuff.tempDensityFbo", addStuff.tempDensityFbo.texture.id);
  }

  // adding user interactivity
  if (mouse.isMouseDown && mouse.mousePos.x != -1 && mouse.mousePos.y != -1) {
    addStuff.addDye(0.4, mouse.mousePos);
    // const veloc = new Vector2(
    //   mouse.mousePos.x - mouse.prevMousePos.x,
    //   mouse.mousePos.y - mouse.prevMousePos.y
    // );
    // addStuff.addVelocity(veloc, mouse.mousePos);
    console.log("tick num", notFirstTick);
    console.log("addStuff.densityFbo", addStuff.densityFbo.texture.id);
    console.log("addStuff.tempDensityFbo", addStuff.tempDensityFbo.texture.id);
  }

  // render density
  // addStuff.renderDye();

  // render advect
  // NOTE: for now advect ONLY advects for VELOCITY! We have to create another
  // version that can advects for the dye as well!
  // advect.velocFbo = addStuff.velocityFbo;
  // advect.tempVelocFbo = addStuff.tempVelocityFbo;

  // temp
  // if (!notFirstTick || mouse.isMouseDown) {
  //   console.log("tick num", notFirstTick);
  //   console.log("advect.velocFbo", advect.velocFbo.texture.id);
  //   console.log("advect.tempVelocFbo", advect.tempVelocFbo.texture.id);
  // }
  // advect.velocFbo = addStuff.densityFbo;
  // advect.tempVelocFbo = addStuff.tempDensityFbo;
  // if (!notFirstTick || mouse.isMouseDown) {
  //   console.log("tick num", notFirstTick);
  //   console.log("advect.velocFbo", advect.velocFbo.texture.id);
  //   console.log("advect.tempVelocFbo", advect.tempVelocFbo.texture.id);
  // }
  // advect.render();
  // if (!notFirstTick || mouse.isMouseDown) {
  //   console.log("tick num", notFirstTick);
  //   console.log("advect.velocFbo", advect.velocFbo.texture.id);
  //   console.log("advect.tempVelocFbo", advect.tempVelocFbo.texture.id);
  // }

  // render diffuse
  // NOTE: also NO DYE VERSION YET!
  // diffuseVeloc.velocFbo = advect.velocFbo;
  diffuseVeloc.velocFbo = addStuff.densityFbo; // for diffuse only
  diffuseVeloc.render();
  // render project
  project.velocFbo = diffuseVeloc.velocFbo;
  // project.tempVelocFbo = advect.tempVelocFbo;
  project.tempVelocFbo = addStuff.tempDensityFbo; // for diffuse + project only
  project.render();

  // temp
  // if (!notFirstTick || mouse.isMouseDown) {
  //   console.log("tick num", notFirstTick);
  //   console.log("project.velocFbo", project.velocFbo.texture.id);
  //   console.log("project.tempVelocFbo", project.tempVelocFbo.texture.id);
  // }
  // project.velocFbo = advect.velocFbo;
  // project.tempVelocFbo = advect.tempVelocFbo;
  // project.velocFbo = diffuseVeloc.velocFbo; // for diffuse only
  // project.tempVelocFbo = addStuff.tempDensityFbo; // for diffuse only
  project.renderVelocity();
  // if (!notFirstTick || mouse.isMouseDown) {
  //   console.log("tick num", notFirstTick);
  //   console.log("project.velocFbo", project.velocFbo.texture.id);
  //   console.log("project.tempVelocFbo", project.tempVelocFbo.texture.id);
  // }
  lastOutputtedVelocFbo = project.velocFbo;
  lastOutputtedTempVelocFbo = project.tempVelocFbo;
  notFirstTick += 1;

  // helper.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
