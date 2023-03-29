varying vec2 vUv;
uniform sampler2D velocity;
uniform vec2 velocAdded;
uniform vec2 vUvAdded;
uniform bool init;

bool compare(float a, float b) {
    return round(a * 100.0) == round(b * 100.0);
}

void main() {
    if (init) {
        gl_FragColor = vec4(0.0);
    } else {
        vec4 oldVel = texture2D(velocity, vUv);
        if (compare(vUv.x, vUvAdded.x) && compare(vUv.y, vUvAdded.y)) {
            gl_FragColor = vec4(oldVel.xy + velocAdded, 0.0, 1.0);
        } else {
            gl_FragColor = oldVel;
        }
    }
}