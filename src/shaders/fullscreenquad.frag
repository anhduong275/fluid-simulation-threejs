precision highp float;

varying vec2 vUv;
uniform sampler2D fboTexture;
uniform int option;

void main() {
    if (option == 0) {
        // "Black/Red/Green"
        float force = 2.0;
        vec4 mapTexel = texture2D( fboTexture, vUv.xy );
        vec2 velocWithForce = mapTexel.xy * force;
        gl_FragColor = vec4(velocWithForce, 0.0, 1.0);
    } else if (option == 1) {
        // "White/Blue/Purple"
        vec2 vel = texture2D(fboTexture, vUv).xy;
        float len = length(vel);
        vel = vel * 0.5 + 0.5;    
        vec3 color = vec3(vel.x, vel.y, 1.0);
        color = mix(vec3(1.0), color, len);
        gl_FragColor = vec4(color,  1.0);
    } else if (option == 2) {
        // "Black/White/Blue"
        float force = 2.0;
        vec4 mapTexel = texture2D( fboTexture, vUv.xy );
        vec2 velocWithForce = mapTexel.xy * force;
        float averagedValue = abs((velocWithForce.x + velocWithForce.y) / 2.0);
        float len = length(velocWithForce);
        vec3 color = vec3(averagedValue, averagedValue, 0.0);
        color = mix(vec3(1.0), color, len);
        color = vec3(1.0) - color;
        gl_FragColor = vec4(color, 1.0);
    } else {
        // "White/Blue"
        float force = 2.0;
        vec4 mapTexel = texture2D( fboTexture, vUv.xy );
        vec2 velocWithForce = mapTexel.xy * force;
        float averagedValue = abs((velocWithForce.x + velocWithForce.y) / 2.0);
        vec3 color = vec3(averagedValue, averagedValue, 0.0);
        color = vec3(1.0) - color;
        gl_FragColor = vec4(color, 1.0);
    }
}