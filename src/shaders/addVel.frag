varying vec2 vUv;
uniform sampler2D velocity;
uniform vec2 velocAdded;
uniform vec2 vUvAdded;
uniform float pixelSize;

bool compare(float fragUv, float mouseInput) {
    return fragUv >= mouseInput - pixelSize / 2.0 && fragUv <= mouseInput + pixelSize / 2.0;
}

void main() {
    vec4 oldVel = texture2D(velocity, vUv);
    if (compare(vUv.x, vUvAdded.x) && compare(vUv.y, vUvAdded.y)) {
        gl_FragColor = vec4(oldVel.xy + velocAdded, 0.0, 1.0);
    } else {
        gl_FragColor = oldVel;
    }
}