precision highp float;

varying vec2 vUv;
uniform sampler2D fboTexture;

void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // gl_FragColor = vec4(2.0, 2.0, 0.0, 1.0);

    float force = 1.2;

    vec4 mapTexel = texture2D( fboTexture, vUv.xy );
    vec2 velocWithForce = mapTexel.xy * force;
    // float color = length(velocWithForce) * 0.75;
    gl_FragColor = vec4(velocWithForce, 0.2, 1.0);

    // vec2 vel = texture2D(fboTexture, vUv).xy;
    // float len = length(vel);
    // vel = vel * 0.5 + 0.5;    
    // vec3 color = vec3(vel.x, vel.y, 1.0);
    // color = mix(vec3(1.0), color, len);

    // gl_FragColor = vec4(color,  1.0);
}