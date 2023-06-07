precision highp float;

varying vec2 vUv;
uniform sampler2D fboTexture;

void main() {
    // CHOOSE BETWEEN EITHER

    // OPTION 1:
    // float force = 2.0;
    // vec4 mapTexel = texture2D( fboTexture, vUv.xy );
    // vec2 velocWithForce = mapTexel.xy * force;
    // gl_FragColor = vec4(velocWithForce, 0.2, 1.0);

    // OPTION 2:
    // vec2 vel = texture2D(fboTexture, vUv).xy;
    // float len = length(vel);
    // vel = vel * 0.5 + 0.5;    
    // vec3 color = vec3(vel.x, vel.y, 1.0);
    // color = mix(vec3(1.0), color, len);
    // gl_FragColor = vec4(color,  1.0);

    // OPTION 3 (4 INCLUDED)
    float force = 2.0;
    vec4 mapTexel = texture2D( fboTexture, vUv.xy );
    vec2 velocWithForce = mapTexel.xy * force;
    float averagedValue = abs((velocWithForce.x + velocWithForce.y) / 2.0);
    float len = length(velocWithForce);
    vec3 color = vec3(averagedValue, averagedValue, 0.0);
    color = mix(vec3(1.0), color, len); // comment this line to get the white canvas version
    color = vec3(1.0) - color;
    gl_FragColor = vec4(color, 1.0);
}