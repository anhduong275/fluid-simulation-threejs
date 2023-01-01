import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import fullscreenquadVert from "./shaders/fullscreenquad.vert";
import fullscreenquadFrag from "./shaders/fullscreenquad.frag";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

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
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * FBO
 */

const type = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
  ? THREE.HalfFloatType
  : THREE.FloatType;
let testFbo = new THREE.WebGLRenderTarget(
  // testFbo.x,
  sizes.width,
  // testFbo.y,
  sizes.height,
  {
    type: type,
  }
);

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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.setRenderTarget(testFbo);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  renderer.render(fsquadScene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
