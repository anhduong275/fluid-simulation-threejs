precision highp float;

varying vec2 vUv;
uniform sampler2D density;
uniform float amount;
uniform vec2 vUvAdded;
uniform float pixelSize;

bool compare(float fragUv, float mouseInput) {
    return fragUv >= mouseInput - pixelSize / 2.0 && fragUv <= mouseInput + pixelSize / 2.0;
}

void main() {
    vec4 oldDensity = texture2D(density, vUv);
    if (compare(vUv.x, vUvAdded.x) && compare(vUv.y, vUvAdded.y)) {
        // float newDensity = clamp(oldDensity.x + amount, 0.0, 1.0);
        float newDensity = oldDensity.x + amount;
        gl_FragColor = vec4(newDensity, newDensity, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(oldDensity.x,oldDensity.x,1.0,1.0);
    }
}