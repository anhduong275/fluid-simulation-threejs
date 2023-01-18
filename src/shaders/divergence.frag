varying vec2 vUv;
uniform sampler2D veloc;
uniform float cellScale;
uniform int N;
uniform sampler2D div;
uniform int setCorners;

float f1 = 1 - cellScale;
float f2 = 1 - 2 * cellScale;

void set_bnd(int b, sampler2D texture) {
  float boundaryVal;
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

  if (vUv.y == 0 || vUv.y == f1 || vUv.x == 0 || vUv.x == f1) {
    gl_FragColor = vec4(boundaryVal, 0.0, 0.0, 1.0);
  } else {
    // if not a boundary cell, keep it the way it is!
    gl_FragColor = texture2D(texture, vUv);
  }
}

void set_corners(sampler2D texture) {
  /*
  x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
  x[IX(0, N - 1)] = 0.5 * (x[IX(1, N - 1)] + x[IX(0, N - 2)]);
  x[IX(N - 1, 0)] = 0.5 * (x[IX(N - 2, 0)] + x[IX(N - 1, 1)]);
  x[IX(N - 1, N - 1)] = 0.5 * (x[IX(N - 2, N - 1)] + x[IX(N - 1, N - 2)]);
  */

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
    if (setCorners == 0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        if (vUv.x == 0 || vUv.y == 0 || vUv.x == 1 - cellScale || vUv.y == 1 - cellScale) {
            // set bounds
            set_bnd(0, div);
        } else {
            float x1 = vUv.x + cellScale;
            float x2 = vUv.x - cellScale;
            float y1 = vUv.y + cellScale;
            float y2 = vUv.y - cellScale;
            float calcColor = (-0.5 *
                texture2D(veloc, vec2(x1, vUv.y)).x
                - texture2D(veloc, vec2(x2, vUv.y)).x
                + texture2D(veloc, vec2(vUv.x, y1)).y
                - texture2D(veloc, vec2(vUv.x, y2)).y
            ) / N;
            gl_FragColor = vec4(calcColor, 0.0, 0.0, 1.0)
        }
    } else { // setCorners == 1
        set_corners(div);
    }
}