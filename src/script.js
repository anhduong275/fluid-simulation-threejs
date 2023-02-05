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
  veloc0: 0,
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
// const diffuseX = new Diffuse(1, fboIds.v_x0, fboIds.v_x, Settings.visc, 4);
// const diffuseY = new Diffuse(2, fboIds.v_y0, fboIds.v_y, Settings.visc, 4);

// const step = () => {
//   diffuseX.render();
//   diffuseY.render();
// };

// addStuff
const addStuff = new AddStuff(fboIds.density, fboIds.tempDensity, fboIds.veloc);
// is veloc0 even used?

addEventListener("mousedown", (event) => {
  let tempWidth = window.innerWidth;
  let tempHeight = window.innerHeight;
  const extraLength =
    tempWidth <= tempHeight ? tempHeight - tempWidth : tempWidth - tempHeight;
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

  const mousePos = new Vector2(mousePosX, mousePosY);
  addStuff.addDye(0.2, mousePos);
});

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

  // render density
  addStuff.renderDye();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
