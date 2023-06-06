precision highp float;

varying vec2 vUv;
uniform sampler2D velocity;
uniform vec2 velocAdded;
uniform vec2 vUvAdded;
uniform float pixelSize;

float force = 10.0;
float radiusMultiplier = 100.0;

void main() {
    vec4 oldVelocity = texture2D(velocity, vUv);
    vec2 distanceVec = vUv - vUvAdded;
    float intensity = max(radiusMultiplier * pixelSize / 2.0 - length(distanceVec), 0.0) / (radiusMultiplier * pixelSize / 2.0);
    vec2 newVelocity =  oldVelocity.xy + velocAdded * intensity * force; // oldVelocity.xy + 
    gl_FragColor = vec4(newVelocity, 1.0, 1.0);
}