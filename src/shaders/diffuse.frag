precision highp float;

varying vec2 vUv;

uniform sampler2D velocity;
uniform sampler2D new_velocity;
uniform float dt;
uniform float pixelSize;
uniform float viscosity;

void main() {
  vec2 oldVelocity = texture2D(velocity, vUv).xy;
  vec2 newVelocityRight = texture2D(new_velocity, vUv + vec2(pixelSize * 2.0, 0)).xy;
  vec2 newVelocityLeft = texture2D(new_velocity, vUv + vec2(-pixelSize * 2.0, 0)).xy;
  vec2 newVelocityUp = texture2D(new_velocity, vUv + vec2(0, pixelSize * 2.0)).xy;
  vec2 newVelocityDown = texture2D(new_velocity, vUv + vec2(0, -pixelSize * 2.0)).xy;

  vec2 newVelocityCalculated = (4.0 * oldVelocity + viscosity * dt * (newVelocityRight + newVelocityLeft + newVelocityUp + newVelocityDown)) / (4.0 + 4.0 * viscosity * dt);
  gl_FragColor = vec4(newVelocityCalculated, 0.0, 1.0);
}