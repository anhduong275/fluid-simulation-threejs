varying vec2 vUv;
uniform sampler2D xTexture;
uniform sampler2D x0Texture;
uniform float a;
uniform float c;
uniform int N;
uniform float cellScale;
uniform bool setBound;
uniform int boundaryIndex;

/*
function set_bnd(b, x) {
  for (let i = 1; i < N - 1; i++) {
    x[IX(i, 0)] = b == 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
    x[IX(i, N - 1)] = b == 2 ? -x[IX(i, N - 2)] : x[IX(i, N - 2)];
  }
  for (let j = 1; j < N - 1; j++) {
    x[IX(0, j)] = b == 1 ? -x[IX(1, j)] : x[IX(1, j)];
    x[IX(N - 1, j)] = b == 1 ? -x[IX(N - 2, j)] : x[IX(N - 2, j)];
  }

  x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
  x[IX(0, N - 1)] = 0.5 * (x[IX(1, N - 1)] + x[IX(0, N - 2)]);
  x[IX(N - 1, 0)] = 0.5 * (x[IX(N - 2, 0)] + x[IX(N - 1, 1)]);
  x[IX(N - 1, N - 1)] = 0.5 * (x[IX(N - 2, N - 1)] + x[IX(N - 1, N - 2)]);
}
*/

void set_bnd(int b, sampler2D texture) {
  float boundaryVal;
  if (vUv.y == 0) {
    float neighborVar = texture2D(texture, vec2(vUv.x, 1)).x;
    boundaryVal = (b == 2) ? -neighborVar : neighborVar;
  } else if (vUv.y == N - 1) {
    float neighborVar = texture2D(texture, vec2(vUv.x, N-2)).x;
    boundaryVal = (b == 2) ? -neighborVar : neighborVar;
  }

  if (vUv.x == 0) {
    float neighborVar = texture2D(texture, vec2(1, vUv.y)).x;
    boundaryVal = (b == 1) ? -neighborVar : neighborVar;
  } else if (vUv.x == N - 1) {
    float neighborVar = texture2D(texture, vec2(N-2, vUv.y)).x;
    boundaryVal = (b == 1) ? -neighborVar : neighborVar;
  }

  if (vUv.y == 0 || vUv.y == N - 1 || vUv.x == 0 || vUv.x == N - 1) {
    gl_FragColor = vec4(boundaryVal, 0.0, 0.0, 0.0);
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
      texture2D(texture, vec2(1,0))
      + texture2D(texture, vec2(0,1))
    );
  } else if (vUv.x == 0 && vUv.y == N - 1) {
    gl_FragColor = 0.5 * (
      texture2D(texture, vec2(1,N - 1))
      + texture2D(texture, vec2(0,N - 2))
    );
  } else if (vUv.x == N - 1 && vUv.y == 0) {
    gl_FragColor = 0.5 * (
      texture2D(texture, vec2(N - 2,0))
      + texture2D(texture, vec2(N - 1,1))
    );
  } else if (vUv.x == N - 1 && vUv.y == N - 1) {
    gl_FragColor = 0.5 * (
      texture2D(texture, vec2(N - 2,N - 1))
      + texture2D(texture, vec2(N - 1,N - 2))
    );
  }
}

// COPIED FROM FULLSCREENQUAD.FRAG
void main() {
    // DEFINE SET_BND HERE
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    float cRecip = 1.0 / c;
    float calcX;
    if (setBound == 0) {
      calcX = (texture2D(x0Texture, vUv.xy).x 
            + a * (
                texture2D(xTexture, vec2(vUv.x + cellScale, vUv.y)).x 
                + texture2D(xTexture, vec2(vUv.x - cellScale, vUv.y)).x
                + texture2D(xTexture, vec2(vUv.x, vUv.y + cellScale)).x
                + texture2D(xTexture, vec2(vUv.x, vUv.y - cellScale)).x
                )) * cRecip;
      gl_FragColor = vec4(calcX, 0.0, 0.0, 0.0);
    }
    else if (setBound == 1) {
      set_bnd(boundaryIndex, xTexture);
    } else if (setBound == 2) {
      set_corners(xTexture);
    }
}