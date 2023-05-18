precision highp float;

varying vec2 vUv;

uniform float pixelSize;
uniform sampler2D velocity;

void main() {
  float up = texture2D(velocity, vUv + vec2(0.0, pixelSize)).y;
  float down = texture2D(velocity, vUv + vec2(0.0, -pixelSize)).y;
  float left = texture2D(velocity, vUv + vec2(-pixelSize, 0.0)).x;
  float right = texture2D(velocity, vUv + vec2(pixelSize, 0.0)).x;
  float currentDivergence = (up - down + right - left) / 2.0; 
  gl_FragColor = vec4(currentDivergence, 0.0, 0.0, 1.0);
}