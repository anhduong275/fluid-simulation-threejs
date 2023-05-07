precision highp float;

varying vec2 vUv;
uniform sampler2D fboTexture;

void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

    vec4 mapTexel = texture2D( fboTexture, vUv.xy );
    gl_FragColor = mapTexel;
}