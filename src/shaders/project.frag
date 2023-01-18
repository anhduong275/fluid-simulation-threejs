varying vec2 vUv;
uniform float cellScale;
uniform sampler2D p;
uniform sampler2D veloc;
uniform int N;
uniform int setBound;

float f1 = 1 - cellScale;
float f2 = 1 - 2 * cellScale;

float set_bnd_vec(int b, sampler2D texture) {
    float boundaryVal = 0;
    if (vUv.y == 0) {
        float neighborVar = texture2D(texture, vec2(vUv.x, cellScale)).x;
        boundaryVal = (b == 2) ? -neighborVar : neighborVar;
    } else if (vUv.y == f1) {
        float neighborVar = texture2D(texture, vec2(vUv.x, f2)).x;
        boundaryVal = (b == 2) ? -neighborVar : neighborVar;
    }

    if (vUv.x == 0) {
        float neighborVar = texture2D(texture, vec2(cellScale, vUv.y)).x;
        boundaryVal = (b == 1) ? -neighborVar : neighborVar;
    } else if (vUv.x == f1) {
        float neighborVar = texture2D(texture, vec2(f2, vUv.y)).x;
        boundaryVal = (b == 1) ? -neighborVar : neighborVar;
    }
    
    return boundaryVal;
}

void set_corners(sampler2D texture) {
  if (vUv.x == 0 && vUv.y == 0) {
    gl_FragColor = 0.5 * (
      texture2D(texture, vec2(cellScale,0))
      + texture2D(texture, vec2(0,cellScale))
    );
  } else if (vUv.x == 0 && vUv.y == f1) {
    // float y1 = 1 - cellScale;
    // float y2 = 1 - 2 * cellScale;
    gl_FragColor = 0.5 * (
      texture2D(texture, vec2(cellScale, f1))
      + texture2D(texture, vec2(0,f2))
    );
  } else if (vUv.x == f1 && vUv.y == 0) {
    gl_FragColor = 0.5 * (
      texture2D(texture, vec2(f2,0))
      + texture2D(texture, vec2(f1,cellScale))
    );
  } else if (vUv.x == f1 && vUv.y == f1) {
    gl_FragColor = 0.5 * (
      texture2D(texture, vec2(f2,f1))
      + texture2D(texture, vec2(f1,f2))
    );
  } else {
    // if not a corner cell, keep it the way it is!
    gl_FragColor = texture2D(texture, vUv);
  }
}

void main() {
    if (setBound == 0) {
        vec2 currentVal = texture2D(veloc, vUv).xy;
        float xSub = -0.5 * (
            texture2D(p, vec2(vUv.x + cellScale, vUv.y)).x
            - texture2D(p, vec2(vUv.x - cellScale, vUv.y)).x
        ) * N;
        float ySub = -0.5 * (
            texture2D(p, vec2(vUv.x, vUv.y + cellScale)).x
            - texture2D(p, vec2(vUv.x, vUv.y - cellScale)).x
        ) * N;
        float xVal = currentVal.x + xSub;
        float yVal = currentVal.y + ySub;
        gl_FragColor = vec4(xVal, yVal, 0.0, 1.0);
    } else if (setBound == 1) {
        float boundX = set_bnd_vec(1, veloc);
        float boundY = set_bnd_vec(2, veloc);
        if (vUv.y == 0 || vUv.y == f1 || vUv.x == 0 || vUv.x == f1) {
            gl_FragColor = vec4(boundX, boundY, 0.0, 1.0);
        } else {
            // if not a boundary cell, keep it the way it is!
            gl_FragColor = texture2D(texture, vUv);
        }
    } else { // setBound == 2
        set_corners(veloc);
    }
}