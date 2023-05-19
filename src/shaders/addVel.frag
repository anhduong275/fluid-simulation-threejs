precision highp float;

varying vec2 vUv;
uniform sampler2D velocity;
uniform vec2 velocAdded;
uniform vec2 vUvAdded;
uniform float pixelSize;
uniform float dt;

bool compare(float fragUv, float mouseInput) {
    return fragUv >= mouseInput - pixelSize / 2.0 && fragUv <= mouseInput + pixelSize / 2.0;
}

void main() {
    // vec4 oldVel = texture2D(velocity, vUv);
    // if (compare(vUv.x, vUvAdded.x) && compare(vUv.y, vUvAdded.y)) {
    //     gl_FragColor = vec4(oldVel.xy + velocAdded * dt, 0.0, 1.0);
    // } else {
    //     gl_FragColor = oldVel;
    // }
    float force = 2.0;
    vec4 oldVelocity = texture2D(velocity, vUv);
    if (compare(vUv.x, vUvAdded.x) && compare(vUv.y, vUvAdded.y)) {
        vec2 distanceVec = vUv - vUvAdded;
        float intensity = max(pixelSize / 2.0 - length(distanceVec), 0.0) / pixelSize * 2.0;
        vec2 newVelocity =  oldVelocity.xy + velocAdded * intensity * force; // oldVelocity.xy + 
        gl_FragColor = vec4(newVelocity, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(oldVelocity.xy, 1.0, 1.0);
    }
}