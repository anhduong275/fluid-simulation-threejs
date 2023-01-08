varying vec2 vUv;

// COPIED FROM FULLSCREENQUAD.VERT
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}