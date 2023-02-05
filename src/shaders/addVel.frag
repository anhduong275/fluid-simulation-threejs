varying vec2 vUv;
uniform sampler2D velocity;
uniform vec2 velocAdded;
uniform vec2 vUvAdded;

void main() {
    vec4 oldVel = texture2D(velocity, vUv);
    if (vUv == vUvAdded) {
        gl_FragColor = vec4(oldVel.xy + velocAdded, 0.0, 1.0);
    } else {
        gl_FragColor = oldVel;
    }
}