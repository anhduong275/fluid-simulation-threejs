precision highp float;

varying vec2 vUv;
uniform sampler2D density;
uniform float amount;
uniform vec2 vUvAdded;
uniform float pixelSize;
// uniform vec2 pixelSize2;

bool compare(float fragUv, float mouseInput) {
    return fragUv >= mouseInput - pixelSize / 2.0 && fragUv <= mouseInput + pixelSize / 2.0;
}

void main() {
    vec4 oldDensity = texture2D(density, vUv);
    if (compare(vUv.x, vUvAdded.x) && compare(vUv.y, vUvAdded.y)) {
        // float newDensity = oldDensity.x + amount;
        // gl_FragColor = vec4(newDensity, newDensity, 1.0, 1.0);
        vec2 distanceVec = vUv - vUvAdded;
        float intensity = max(pixelSize - length(distanceVec), 0.0) / pixelSize;
        vec2 newDensity = oldDensity.xy + amount * intensity;
        gl_FragColor = vec4(newDensity, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(oldDensity.x,oldDensity.x,1.0,1.0);
    }

    // TREATING DENSITY LIKE VELOCITY
    // vec2 circle = (vUvAdded - 0.5) * 2.0;
    // float d = 1.0-min(length(circle), 1.0);
    // d *= d;
    // // gl_FragColor = vec4(force * d, 0, 1);
    // // float intensity = 1.0 - min(length(vUvAdded * 2.0 - 1.0), 1.0);
    // vec2 newDensity = oldDensity.xy + amount * d;
    // gl_FragColor = vec4(newDensity, 1.0, 1.0);
}