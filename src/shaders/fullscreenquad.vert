precision highp float;

uniform float pixelSize;

varying vec2 vUv;

void main() {
    float scale = 1.0 - pixelSize * 2.0; // boundary = size of a pixel
    vec3 newPos = vec3(position.xy * scale, position.z);
    vUv = vec2(0.5) + (newPos.xy) * 0.5; // not sure why I can't do uv * scale
    gl_Position = vec4(newPos, 1.0);
}