precision highp float;

varying vec2 vUv;

uniform float dt;
uniform sampler2D velocity;

void main() {
    vec2 oldVelocity = texture2D(velocity, vUv).xy;
    vec2 newUv = vUv - oldVelocity * dt;
    vec2 newVelocity = texture2D(velocity, newUv).xy;
    gl_FragColor = vec4(newVelocity, 0.0, 1.0);
}