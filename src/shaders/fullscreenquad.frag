precision highp float;

varying vec2 vUv;
uniform sampler2D fboTexture;

void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // gl_FragColor = vec4(2.0, 2.0, 0.0, 1.0);

    vec4 mapTexel = texture2D( fboTexture, vUv.xy );
    gl_FragColor = mapTexel;

//     vec2 vel = texture2D(fboTexture, vUv).xy;
//     float len = length(vel);
//     vel = vel * 0.5 + 0.5;
    
//     vec3 color = vec3(vel.x, vel.y, 1.0);
//     color = mix(vec3(1.0), color, len);

//     gl_FragColor = vec4(color,  1.0);
}