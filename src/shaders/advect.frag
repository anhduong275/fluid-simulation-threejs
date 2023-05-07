precision highp float;

varying vec2 vUv;

uniform float dt;
uniform sampler2D velocity;

void main() {
    vec2 oldVelocity = texture2D(velocity, vUv).xy;
    vec2 newUv = vUv - oldVelocity * dt;
    vec2 newVelocity = texture2D(velocity, newUv).xy;
    // gl_FragColor = vec4(newVelocity, 0.0, 1.0);
    if (newVelocity.x == 0.0 && newVelocity.y == 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(newVelocity, 1.0, 1.0);
    }
    // gl_FragColor = vec4(oldVelocity, 1.0, 1.0);
}