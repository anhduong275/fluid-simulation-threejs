varying vec2 vUv;
uniform sampler2D density;
uniform float amount;
uniform vec2 vUvAdded;
uniform bool init;

bool compare(float a, float b) {
    return round(a * 100.0) == round(b * 100.0);
}

void main() {
    vec4 oldDensity;
    oldDensity = texture2D(density, vUv);
    if (init) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        if (compare(vUv.x, vUvAdded.x) && compare(vUv.y, vUvAdded.y)) {
            float newDensity = clamp(oldDensity.x + amount, 0.0, 1.0);
            gl_FragColor = vec4(newDensity, 0.0, 0.0, 1.0);
            // gl_FragColor = vec4(1.0);
        } else {
            gl_FragColor = oldDensity;
        }
    }
    
    // if (compare(vUv.x, vUvAdded.x) && compare(vUv.y, vUvAdded.y)) {
    //     // gl_FragColor = vec4(oldDensity.x + amount, 0.0, 0.0, 1.0);
    //     gl_FragColor = vec4(1.0);
    // } //else {
    //     gl_FragColor = oldDensity;
    // }
}