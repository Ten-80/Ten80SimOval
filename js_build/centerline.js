function loadFile(path, onData) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", path, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        onData(xhr.responseText);
      } else {
        console.error(xhr.statusText);
      }
    }
  }
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  }
  xhr.send();
}

function loadTrack() {

}


// def plot_coords(ax, ob):
// x, y = ob.xy
// ax.plot(x, y, '.', color='#999999', zorder=1)
//
// def plot_bounds(ax, ob):
// x, y = zip(*list((p.x, p.y) for p in ob.boundary))
// ax.plot(x, y, '.', color='#000000', zorder=1)
//
// def plot_line(ax, ob):
// x, y = ob.xy
// ax.plot(x, y, color='cyan', alpha=0.7, linewidth=3, solid_capstyle='round', zorder=2)
//
// def print_border(ax, waypoints, inner_border_waypoints, outer_border_waypoints):
// line = LineString(waypoints)
// plot_coords(ax, line)
// plot_line(ax, line)
//
// line = LineString(inner_border_waypoints)
// plot_coords(ax, line)
// plot_line(ax, line)
//
// line = LineString(outer_border_waypoints)
// plot_coords(ax, line)
// plot_line(ax, line)


let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0;

function plotWalls(pointPairs, scale, graphics) {
  for (let i = 0; i < pointPairs.length; ++i) {
    plotLine([[pointPairs[i][0], pointPairs[i][1]], [pointPairs[i][2], pointPairs[i][3]]], scale, graphics);
  }
}

function plotLine(points, scale, graphics) {
  for (let i = 1; i < points.length; i += 9) {
    plotPoint([points[i][0], points[i][1]], scale, graphics);
  }
  // return;

  graphics.moveTo(points[0][0] * scale, points[0][1] * scale);
  for (let i = 1; i < points.length; ++i) {
    let x = points[i][0] * scale;
    let y = points[i][1] * scale;
    minX = Math.min(x, minX);
    minY = Math.min(y, minY);
    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
    graphics.lineTo(x, y);
  }
}

function plotPoint(p, scale, graphics) {
  let x = p[0] * scale;
  let y = p[1] * scale;

  graphics.setStrokeStyle(null);
  graphics.beginFill('#ff0000');
  graphics.drawCircle(x, y, 2);
  graphics.endFill();
  // graphics.moveTo(x - scale * 2, y - scale * 2);
  // graphics.lineTo(x + scale * 2, y + scale * 2);
  // graphics.moveTo(x - scale * 2, y + scale * 2);
  // graphics.lineTo(x + scale * 2, y - scale * 2);
}


let centerS = new zim.Shape();
// centerS.graphics.setStrokeStyle(1);
// centerS.graphics.beginStroke("#a0a0a0");
// centerS.x = -minX + 250;
// centerS.y = -minY + 50;
stage.addChild(centerS);
stage.update();


function isClose(a, b, threshold) {
  let val = a - b;
  return (val < 0 ? -val : val) <= threshold;
}


function mengerCurvature(pt1, pt2, pt3, atol = 1e-3) {
  let vec21 = [pt1[0] - pt2[0], pt1[1] - pt2[1]];
  let vec23 = [pt3[0] - pt2[0], pt3[1] - pt2[1]];
  let norm21 = math.norm(vec21);
  let norm23 = math.norm(vec23);
  let dot = math.dot(vec21, vec23);
  let mul = math.multiply(norm21, norm23);
  let dotOverMul = math.divide(dot, mul);
  let theta = Math.acos(dotOverMul);
  if (isClose(theta - Math.PI, 0.0, atol)) {
    theta = 0;
  }
  let dist13 = math.norm(math.subtract(vec21, vec23));

  return 2 * Math.sin(theta) / dist13;
}

function pointInPoly(pt, poly) {
  let x = pt[0];
  let y = pt[1];
  let last_x = poly[poly.length - 1][0];
  let last_y = poly[poly.length - 1][1];
  let inside = false;
  let eps = 0.0000000001;
  for (let i = 0; i < poly.length; ++i) {
    let curr_x = poly[i][0];
    let curr_y = poly[i][1];

    // if y is between curr_y and last_y, and
    // x is to the right of the boundary created by the line
    if ((curr_y - y > eps) != (last_y - y > eps) &&
      (last_x - curr_x) * (y - curr_y) / (last_y - curr_y) + curr_x - x > eps)
      inside = !inside

    last_x = curr_x;
    last_y = curr_y;
  }
  return inside;
}

function segmentIntersectsPoly(pt1, pt2, poly) {
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let polyPt1X = poly[j][0];
    let polyPt1Y = poly[j][1];
    let polyPt2X = poly[i][0];
    let polyPt2Y = poly[i][1];

    if (intersects(pt1[0], pt1[1], pt2[0], pt2[1], polyPt1X, polyPt1Y, polyPt2X, polyPt2Y)) {
      // console.log("INTERSECTS", j, i);
      return true;
    }
  }

  return false;
}

function polyPolyIntersectionIndices(poly, poly2) {
  let indices = [];
  let num = 0;
  let close = .015;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let polyPt1X = poly[j][0];
    let polyPt1Y = poly[j][1];
    let polyPt2X = poly[i][0];
    let polyPt2Y = poly[i][1];

    for (let i2 = 0, j2 = poly2.length - 1; i2 < poly2.length; j2 = i2++) {
      let poly2Pt1X = poly2[j2][0];
      let poly2Pt1Y = poly2[j2][1];
      let poly2Pt2X = poly2[i2][0];
      let poly2Pt2Y = poly2[i2][1];

      let x1 = Math.abs(polyPt1X - poly2Pt1X);
      let y1 = Math.abs(polyPt1Y - poly2Pt1Y);
      let x2 = Math.abs(polyPt2X - poly2Pt2X);
      let y2 = Math.abs(polyPt2Y - poly2Pt2Y);
      if (x1 < close && y1 < close && x2 < close && y2 < close) {
        ++num;
        i2 += 20;
        j2 += 20;
        indices.push({a: i, b: i2});
        // break;
      }
      // let x2 = Math.abs(polyPt2X - poly2Pt2X);
      // let y2 = Math.abs(polyPt2Y - poly2Pt2Y);
      // if (x2 < .0015 && y2 < .0015) {
      //   ++num;
      //   indices.push({a: i, b: i2});
      // }
      // if (intersects(poly2Pt1X, poly2Pt1Y, poly2Pt2X, poly2Pt2Y, polyPt1X, polyPt1Y, polyPt2X, polyPt2Y)) {
      //   indices.push({a: j, b: j2});
      // }
    }
  }
  // console.log(num, 'intersections');

  return indices;
}

function intersects(a, b, c, d, p, q, r, s) {
  let det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};

function improveRaceLine(old_line, inner_border, outer_border) {
  let new_line = old_line.concat();
  let npoints = new_line.length;
  for (let i = 0, prevI = npoints - 1; i < npoints; prevI = i++) {
    let xi = new_line[i];
    let prevprev = (i - 2 + npoints) % npoints;
    let prev = (i - 1 + npoints) % npoints;
    let next = (i + 1 + npoints) % npoints;
    let nextnext = (i + 2 + npoints) % npoints;
    // let ci = mengerCurvature(new_line[prev], xi, new_line[next]);
    let c1 = mengerCurvature(new_line[prevprev], new_line[prev], xi);
    let c2 = mengerCurvature(xi, new_line[next], new_line[nextnext]);
    let target_ci = math.divide(math.add(c1, c2), 2);
    let xi_bound1 = [
      new_line[i][0],
      new_line[i][1]];
    let xi_bound2 = [
      (new_line[next][0] + new_line[prev][0]) / 2,
      (new_line[next][1] + new_line[prev][1]) / 2];
    let p_xi = [xi[0], xi[1]];//.concat();
    for (let j = 0; j < XI_ITERATIONS; ++j) {
      let p_ci = mengerCurvature(new_line[prev], p_xi, new_line[next]);
      if (isClose(p_ci, target_ci)) {
        break;
      }
      if (p_ci < target_ci) {
        xi_bound2 = [p_xi[0], p_xi[1]];//p_xi.concat();
        let new_p_xi = [
          (xi_bound1[0] + p_xi[0]) / 2,
          (xi_bound1[1] + p_xi[1]) / 2
        ];
        if (pointInPoly(new_p_xi, inner_border) || !pointInPoly(new_p_xi, outer_border) || segmentIntersectsPoly(new_p_xi, new_line[prevI], inner_border)) {
          xi_bound1 = [new_p_xi[0], new_p_xi[1]];//new_p_xi.concat();
        } else {
          p_xi = new_p_xi;
        }
      } else {
        xi_bound1 = [p_xi[0], p_xi[1]];//p_xi.concat();
        let new_p_xi = [
          (xi_bound2[0] + p_xi[0]) / 2,
          (xi_bound2[1] + p_xi[1]) / 2
        ];
        if (pointInPoly(new_p_xi, inner_border) || !pointInPoly(new_p_xi, outer_border) || segmentIntersectsPoly(new_p_xi, new_line[prevI], inner_border)) {
          xi_bound2 = [new_p_xi[0], new_p_xi[1]];//new_p_xi.concat();
        } else {
          p_xi = new_p_xi;
        }
      }
    }
    let new_xi = p_xi;
    new_line[i] = new_xi;
  }

  return new_line;
}


let XI_ITERATIONS = 20;
let TRACK_ITERATIONS = 3;
let same = 0;
let diff = 0;

function drawCurrentRacingLines() {
  let w = track_width_3;
  let h = track_height_3;
  let unitSize = center_line_3_scale;
  let scaledW = w * unitSize;
  let scaledH = h * unitSize;
  let scale = Math.min(stage.canvas.width / scaledW, stage.canvas.height / scaledH);

  let elem = document.getElementById('laneIdx');
  let laneIdx = parseInt(elem.value);

  precalculatedRacingLines = JSON.parse(JSON.stringify(__precalculatedRacingLines));
  precalculatedRacingLines.forEach((line, idx) => {
    centerS.graphics.setStrokeStyle(1);
    centerS.graphics.beginStroke(idx === laneIdx ? '#f00' : 'rgba(0, 0, 255, .3)');
    plotLine(line, scale, centerS.graphics);
  });
}

function makeRaceLine() {
  _makeRaceLine(
    track_width_3,
    track_height_3,
    center_line_3,
    inner_line_3,
    outer_line_3,
    walls_3,
    center_line_3_scale,
    50)
}

function _makeRaceLine(w, h, centerLine, innerBorder, outerBorder, walls, unitSize, iterations) {

  let center1 = JSON.parse(JSON.stringify(centerLine));
  let center2 = JSON.parse(JSON.stringify(centerLine));
  let center3 = JSON.parse(JSON.stringify(centerLine));
  let center4 = JSON.parse(JSON.stringify(centerLine));
  let center5 = JSON.parse(JSON.stringify(centerLine));

  /* let offsetX = [
    [-.015, -.03, -.03, -.015, 0, 0, 0, 0, 0, 0, 0],
    [-.033, -.066, -.066, -.033, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
  let offsetY = [
    [0, 0, -.1, -.2, -.3, -.4, -.4, -.3, -.2, -.1, 0],
    [0, 0, -.05, -.1, -.15, -.2, -.2, -.15, -.1, -.05, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [.05, .1, .15, .2, .2, .2, .2, .15, .1, .05, 0],
    // [.1, .2, .28, .35, .4, .4, .4, .3, .2, .1, 0],
    [.1, .15, .2, .23, .25, .4, .4, .3, .2, .1, 0],
  ] */

  let offsetX = [
    [.15, .3, .3, .15, 0, 0, 0, 0, 0, 0, 0],
    [.33, .66, .66, .33, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]

  let offsetY = [
    [0, 0, -1, -2, -3, -4, -4, -3, -2, -1, 0],
    [0, 0, -.5, -1, -1.5, -2, -2, -1.5, -1, -.5, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [.5, 1, 1.5, 2, 2, 2, 2, 1.5, 1, 0.5, 0],
    // [.1, .2, .28, .35, .4, .4, .4, .3, .2, .1, 0],
    [1, 1.5, 2, 2.3, 2.5, 4, 4, 3, 2, 1, 0],
  ] 


  let arrs = [center1, center2, center3, center4, center5];

  // starting line spread
  for (let o = 0; o < offsetX.length; ++o) {
    let ox = offsetX[o];
    let oy = offsetY[o];
    let arr = arrs[o];

    for (let i = 0; i < 11; ++i) {
      let idx = (arr.length - 5 + i) % arr.length;
      arr[idx][0] += ox[i];
      arr[idx][1] += oy[i] * .75;
    }
  }

  // run spread
  [center1, center2, center3, center4, center5].forEach(arr => {
    // [ center3].forEach(arr => {
    let numPts = center1.length;
    let maxNumDriftPts = ~~(numPts * (1 / 7));
    let startIdx = ~~(numPts * (1 / 11));
    let endIdx = numPts - ~~(numPts * (1 / 7));
    let drifting = false;
    let targetDriftX = 0;
    let targetDriftY = 0;
    let numDriftPts = 0;
    let startDriftIdx = 0;
    for (let i = startIdx; i < endIdx; ++i) {
      if (!drifting) {
        if (Math.random() > .75) {
          drifting = true;
          targetDriftX = Math.random() * .8 - .4;
          targetDriftY = Math.random() * .8 - .4;
          numDriftPts = maxNumDriftPts;//~~(Math.random() * Math.max(10, maxNumDriftPts));
          startDriftIdx = i;
        }
      } else {
        if (i >= startDriftIdx + numDriftPts) {
          drifting = false;
        } else {
          let frac = (i - startDriftIdx) / numDriftPts;
          frac = Math.sin(frac * Math.PI);
          let pt = arr[i];
          pt[0] += targetDriftX * frac;
          pt[1] += targetDriftY * frac;
        }
      }
    }
  });
  console.log("makeRaceLine: running", iterations, "iterations");

  let elem = document.getElementById('laneIdx');
  let laneIdx = parseInt(elem.value);
  let center = [center1, center2, center3, center4, center5][laneIdx];
  __makeRaceLine(w, h, center, innerBorder, outerBorder, walls, unitSize)
  // __makeRaceLine(w, h, center1, innerBorder, outerBorder, walls, unitSize, iterations);
  // __makeRaceLine(w, h, center2, innerBorder, outerBorder, walls, unitSize, iterations);
  // __makeRaceLine(w, h, center3, innerBorder, outerBorder, walls, unitSize, iterations);
  // __makeRaceLine(w, h, center4, innerBorder, outerBorder, walls, unitSize, iterations);
  // __makeRaceLine(w, h, center5, innerBorder, outerBorder, walls, unitSize, iterations);
}

function __makeRaceLine(w, h, centerLine, innerBorder, outerBorder, walls, unitSize) {
  let scaledW = w * unitSize;
  let scaledH = h * unitSize;
  let maxX = 0;
  let maxY = 0;
  centerLine = JSON.parse(JSON.stringify(centerLine));
  innerBorder = JSON.parse(JSON.stringify(innerBorder));
  outerBorder = JSON.parse(JSON.stringify(outerBorder));

  // scale up to feet
  [centerLine, innerBorder, outerBorder].forEach((arr, aidx) => {
    let lastPt = [arr[arr.length - 1][0], arr[arr.length - 1][1]];
    lastPt[0] *= unitSize;
    lastPt[1] *= unitSize;
    arr.forEach((pt, idx) => {
      pt[0] *= unitSize;
      pt[1] *= unitSize;
      if (maxX < pt[0]) maxX = pt[0];
      if (maxY < pt[1]) maxY = pt[1];
      lastPt = pt;
    })
  })

  walls = JSON.parse(JSON.stringify(walls));
  walls.forEach(ptPair => {
    ptPair[0] *= unitSize;
    ptPair[1] *= unitSize;
    ptPair[2] *= unitSize;
    ptPair[3] *= unitSize;
  })

  console.log(`unit size (ft): ${unitSize}`)
  console.log(`    units w, h: ${w}, ${h}`);
  console.log(`  scaled w x h: ${scaledW} x ${scaledH}`);
  console.log(`      max x, y: ${maxX}, ${maxY}`);

  let centerSmooth = smoothLine(centerLine, 200);
  innerBorder = increaseResolution(innerBorder, 1);
  let innerSmooth = smoothLine(innerBorder, 100);
  outerBorder = increaseResolution(outerBorder, 1);
  let outerSmooth = smoothLine(outerBorder, 100);

  let newCenter = JSON.parse(JSON.stringify(centerSmooth));
  let iterations = 200;

  // let savePoints = [100, 75, 50, 25];
  let savePoints = [1];
  let raceLines = [];

  function improve() {
    console.log("fit iterations remaining:", iterations);
    setTimeout(() => {
      newCenter = improveRaceLine(newCenter, innerBorder, outerBorder);
      if (savePoints.indexOf(iterations) >= 0) {
        // raceLines.push(JSON.parse(JSON.stringify(newCenter)));
        raceLines.push(smoothLine(newCenter, 2800));
      }
      --iterations;
      if (iterations > 0) {
        improve();
      } else {
        fixSeam();
        present();
      }
    });
  }

  function fixSeam() {
    raceLines.forEach(line => {
      let len = line.length;
      let ptA = [line[len-2][0], line[len-2][1]];
      let ptB = [line[len-1][0], line[len-1][1]];
      let dist = distance(ptA, ptB);

      let pt0 = [line[line.length - 1][0], line[line.length - 1][1]];
      let pt1 = [line[0][0], line[0][1]];
      let longDist = distance(pt0, pt1);

      let numSteps = ~~(longDist / dist / 2);
      let xstep = (pt1[0] - pt0[0]) / numSteps;
      let ystep = (pt1[1] - pt0[1]) / numSteps;

      for (let i = 1; i < numSteps; ++i) {
        line.push([pt0[0] + xstep * i, pt0[1] + ystep * i]);
      }
    });
  }

  function present() {
    let scale = Math.min(stage.canvas.width / scaledW, stage.canvas.height / scaledH);
    stage.addChild(centerS);

    drawCurrentRacingLines();

    centerS.graphics.setStrokeStyle(10, "round");
    centerS.graphics.beginStroke("#000");
    plotWalls(walls, scale, centerS.graphics);
    centerS.graphics.setStrokeStyle(2);
    centerS.graphics.beginStroke("#ff0000");
    // plotLine(innerSmooth, scale, centerS.graphics);
    centerS.graphics.setStrokeStyle(2);
    centerS.graphics.beginStroke("#00ff00");
    // plotLine(outerSmooth, scale, centerS.graphics);

    // centerSmooth.pop();
    centerS.graphics.setStrokeStyle(2);
    centerS.graphics.beginStroke("#0000ff");
    plotLine(centerSmooth, scale, centerS.graphics);

    centerS.graphics.setStrokeStyle(1);
    centerS.graphics.beginStroke("#fff");
    for (let i = 0; i < raceLines.length; ++i) {
      let line = raceLines[i];
      reducePrecision(line, 4);
      saveLine(line, "racingLine_" + i);
      line.push([line[0][0], line[0][1]]);
      plotLine(line, scale, centerS.graphics);
      stage.update();
    }

  }

  improve();

//
//     while (iterations-- > 0) {
//         centerLine = improveRaceLine(centerLine, innerBorder, outerBorder);
//     }
//
//
//     let scale = Math.min(stage.canvas.width / scaledW, stage.canvas.height / scaledH);
//     console.log(scale, "SCALE");
//
//
//     stage.addChild(centerS);
//     centerS.f('#333').dr(0, 0, 300, 300).ef();
//     centerS.graphics.setStrokeStyle(5);
//     centerS.graphics.beginStroke("#0000ff");
//     centerLine.push([centerLine[0][0], centerLine[0][1]]);
//     plotLine(centerLine, scale, centerS.graphics);
//     stage.update();
//     console.log("...making");
//
//     centerS.graphics.setStrokeStyle(2);
//     centerS.graphics.beginStroke("#ff0000");
//     let smoothed = smoothLine(centerLine, 2000);
//     plotLine(smoothed,scale, centerS.graphics);
//     stage.update();
}


function smoothLine(ptsArr, numPts) {
  let pts = ptsArr.map(pt => new THREE.Vector2(pt[0], pt[1]));
  let spline = new THREE.SplineCurve(pts);
  let vecPts = spline.getPoints(numPts);
  let smoothed = vecPts.map(vpt => [vpt.x, vpt.y]);

  return smoothed;
}

// assumes looping points
function increaseResolution(ptsArr, res) {
  let newPts = [];
  for (let i = 1; i <= ptsArr.length; ++i) {
    let pt0 = ptsArr[i - 1];
    let pt1 = ptsArr[i % ptsArr.length];
    let slopeX = pt1[0] - pt0[0];
    let slopeY = pt1[1] - pt0[1];
    let stepX = slopeX / res;
    let stepY = slopeY / res;
    for (let j = 0; j < res; ++j) {
      newPts.push([pt0[0] + stepX * j, pt0[1] + stepY * j]);
    }
  }
  return newPts;
}

function reducePrecision(ptsArr, prec) {
  let coeff = Math.pow(10, prec);
  ptsArr.forEach(pt => {
    pt[0] = (~~(pt[0] * coeff)) / coeff;
    pt[1] = (~~(pt[1] * coeff)) / coeff;
  })
}

function distance(pt1, pt2) {
  let a = pt2[0] - pt1[0];
  let b = pt2[1] - pt1[1];
  return Math.sqrt(a * a + b * b);
}

function sanitize(val) {
  if (val > 0) {
    if (val - ~~val < .000001) return ~~val;
  } else {
    if (val - ~~val < -.000001) return ~~val;
  }
  return val;
}


function calculateLinePts(startX, startY, endX, endY, numPts) {
  let totalX = endX - startX;
  let totalY = endY - startY;
  let line = [];
  for (let i = 0; i < numPts; ++i) {
    let t = i / numPts;
    let ease = t * t;
    let travelX = totalX * t;
    let travelY = totalY * ease;
    line[i] = [startX + travelX, startY + travelY];
  }
  return line;
}

function calculateEdgePts(cpt, radius, fromAngle, sweep, resolution) {
  let d2r = Math.PI / 180;

  let stepPt = cpt;
  let angle = fromAngle
  let pts = [];
  let startRad = angle * d2r;
  let sweepRad = sweep * d2r;

  // unit travel, meaning "1" is a step (apx 8"?)
  let circumference = radius * 2 * Math.PI;
  let travelledCircumference = sweep / 360 * circumference;

  // FIXME only accounts for stepping on curve, not how that merges with the next segment
  let radSteps = Math.abs(travelledCircumference) * resolution;//Math.abs(Math.ceil(travelledCircumference));
  let radStep = sweepRad == 0 ? 0 : sweepRad / radSteps;
  let radIdx = 0;

  do {
    let a = startRad + radStep * radIdx;
    let x = Math.cos(a) * (radius);
    let y = Math.sin(a) * (radius);
    let lanePt = [stepPt[0] + x, stepPt[1] + y];
    pts.push(lanePt);
  } while (++radIdx < radSteps);

  return pts;
}


function calculateLineOnly(line_steps) {
  let d2r = Math.PI / 180;

  let lastPt = null;// [center_steps[0][0], center_steps[0][1]];
  let pts = [];

  // let lastExitIdx = -1;
  for (let i = 0; i < line_steps.length; ++i) {
    let step = line_steps[i];
    let stepPt = [step[0], step[1]];
    let radius = step[2];
    let angle = step[3];
    let sweep = step[4];
    let curvePts = [];
    let startRad = angle * d2r;
    let sweepRad = sweep * d2r;

    // unit travel, meaning "1" is a step (apx 8"?)
    let circumference = radius * 2 * Math.PI;
    let travelledCircumference = sweep / 360 * circumference;

    // FIXME only accounts for stepping on curve, not how that merges with the next segment
    let radSteps = Math.abs(travelledCircumference);//Math.abs(Math.ceil(travelledCircumference));
    let radStep = sweepRad == 0 ? 0 : sweepRad / radSteps;
    let radIdx = 0;

    let calcEntryIntoCurve = true;
    do {
      // for (let ri = 0; ri < racingLines.length; ++ri) {
      let ri = 0;
      {
        let a = startRad + radStep * radIdx;
        // let x = sanitize(Math.cos(a) * (radius + radiusOffset));
        // let y = sanitize(Math.sin(a) * (radius + radiusOffset));
        let x = Math.cos(a) * (radius);
        let y = Math.sin(a) * (radius);
        let lanePt = [stepPt[0] + x, stepPt[1] + y];

        if (calcEntryIntoCurve === true) {
          let lastExitPt = pts[pts.length - 1];
          if (lastExitPt != null) {
            let xdiff = lanePt[0] - lastExitPt[0];
            let ydiff = lanePt[1] - lastExitPt[1];
            let dist = distance(lastExitPt, lanePt);
            if (dist < 1) continue;
            for (let di = 1; di < dist; di += 1) {
              let frac = di / dist;
              let pt = [lastExitPt[0] + xdiff * frac, lastExitPt[1] + ydiff * frac];
              pts.push(pt);
            }
          }
        }
        pts.push(lanePt);
      }
      calcEntryIntoCurve = false;
    } while (++radIdx < radSteps);
  }

  return pts;
}


function calculateCenterLines(iterations) {
  let d2r = Math.PI / 180;

  let lastPt = null;// [center_steps[0][0], center_steps[0][1]];
  let pts = [];

  // the number of racing lines on each side of the center line
  // 2 alts means 5 lines (left, left, center, right, right)
  // 1 alt means 3 lines (left, center, right)
  let numAlts = 4;
  let racingLines = [pts];
  for (let alt = 0; alt < numAlts; ++alt) {
    racingLines.push([]);
    racingLines.unshift([]);
  }

  // let lastExitIdx = -1;
  for (let i = 0; i < center_steps.length; ++i) {
    let step = center_steps[i];
    let stepPt = [step[0], step[1]];
    let radius = step[2];
    let angle = step[3];
    let sweep = step[4];
    let curvePts = [];
    let startRad = angle * d2r;
    let sweepRad = sweep * d2r;

    // unit travel, meaning "1" is a step (apx 8"?)
    let circumference = radius * 2 * Math.PI;
    let travelledCircumference = sweep / 360 * circumference;

    // FIXME only accounts for stepping on curve, not how that merges with the next segment
    let radSteps = Math.abs(travelledCircumference);//Math.abs(Math.ceil(travelledCircumference));
    let radStep = sweepRad == 0 ? 0 : sweepRad / radSteps;
    let radIdx = 0;

    let calcEntryIntoCurve = true;
    do {
      for (let ri = 0; ri < racingLines.length; ++ri) {
        let radiusIdx;
        if (sweep < 0) {
          radiusIdx = racingLines.length - ri - 1;
        } else {
          radiusIdx = ri;
        }
        let radiusOffset = (ri - numAlts) / 2;
        let a = startRad + radStep * radIdx;
        // let x = sanitize(Math.cos(a) * (radius + radiusOffset));
        // let y = sanitize(Math.sin(a) * (radius + radiusOffset));
        let x = Math.cos(a) * (radius + radiusOffset);
        let y = Math.sin(a) * (radius + radiusOffset);
        let lanePt = [stepPt[0] + x, stepPt[1] + y];

        if (calcEntryIntoCurve === true) {
          let lastExitPt = racingLines[radiusIdx][racingLines[radiusIdx].length - 1];
          if (lastExitPt != null) {
            let xdiff = lanePt[0] - lastExitPt[0];
            let ydiff = lanePt[1] - lastExitPt[1];
            let dist = distance(lastExitPt, lanePt);
            if (dist < 1) continue;
            for (let di = 1; di < dist; di += 1) {
              let frac = di / dist;
              let pt = [lastExitPt[0] + xdiff * frac, lastExitPt[1] + ydiff * frac];
              racingLines[radiusIdx].push(pt);
            }
            // if (dist < 1) continue;
            // for (let di = 1; di < dist; ++di) {
            //   let frac = di / dist;
            //   let pt = [lastExitPt[0] + xdiff * frac, lastExitPt[1] + ydiff * frac];
            //   racingLines[radiusIdx].push(pt);
            // }
          }
        }
        racingLines[radiusIdx].push(lanePt);
      }
      calcEntryIntoCurve = false;
    } while (++radIdx < radSteps);
  }

  centerS.graphics.setStrokeStyle(0);
  centerS.graphics.beginFill('#000000');
  centerS.graphics.drawRect(0, 0, 71 * 10, 49 * 10)
  centerS.graphics.endFill();
  let outerBounds = racingLines[racingLines.length - 1];
  let innerBounds = racingLines[1];
  centerS.graphics.beginStroke('#ff0000');
  plotLine(outerBounds, 10, centerS.graphics);
  centerS.graphics.beginStroke('#0000ff');
  plotLine(innerBounds, 10, centerS.graphics);

  centerS.graphics.setStrokeStyle(7);
  let chanStep = 4;//255 / racingLines.length;
  for (let i = 1; i < racingLines.length; ++i) {
    // if (i == numAlts) {
    //   centerS.graphics.beginStroke("#000000");
    // } else {
    let chan = (24 + chanStep * (Math.abs(i - numAlts))).toString(16);
    if (chan.length == 1) chan = '0' + chan;
    let color = '#' + chan + chan + chan;

    centerS.graphics.beginStroke(color);
    // }
    plotLine(racingLines[i], 10, centerS.graphics);
    // break;
  }

  // render walls
  centerS.graphics.setStrokeStyle(10, 'round');
  centerS.graphics.beginStroke("#d0e8ff");
  for (let i = 0; i < walls.length; ++i) {
    plotLine([[walls[i][0], walls[i][1]], [walls[i][2], walls[i][3]]], 10, centerS.graphics);
  }

  centerS.graphics.setStrokeStyle(2);

  let newLine;

  // let lanes = [numAlts + 2, numAlts + 3, numAlts + 5];
  // let lanes = [0, 1, 2];
  let lanes = [0, 1, 2, 3, 4, 5];
  let colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  for (let i = 0; i < lanes.length; ++i) {
    newLine = racingLines[lanes[i]];
    for (let it = 0; it < iterations; ++it) {
      newLine = improveRaceLine(newLine, innerBounds, outerBounds);
      console.log("it" + i, "iterations", iterations);
    }
    newLine.push([newLine[0][0], newLine[0][1]]);
    console.log("it" + i, "iterations", iterations, "length", newLine.length);
    centerS.graphics.beginStroke(colors[i]);
    plotLine(newLine, 10, centerS.graphics);
    saveLine(newLine, 'line' + i);
  }

  // newLine = racingLines[numAlts];
  // for (let i = 0; i < iterations; ++i) {
  //   newLine = improveRaceLine(newLine, innerBounds, outerBounds);
  //   console.log("it0 ", (i + 1), "of", iterations);
  // }

  // newLine.push([newLine[0][0], newLine[0][1]]);
  // centerS.graphics.beginStroke('#ff0000');
  // plotLine(newLine, 10, centerS.graphics);
  // saveLine(newLine, 'line0');
  //
  // newLine = racingLines[numAlts - 3];
  // for (let i = 0; i < iterations; ++i) {
  //   newLine = improveRaceLine(newLine, innerBounds, outerBounds);
  //   console.log("it1 ", (i + 1), "of", iterations);
  // }
  // newLine.push([newLine[0][0], newLine[0][1]]);
  // centerS.graphics.beginStroke('#00ff00');
  // plotLine(newLine, 10, centerS.graphics);
  // saveLine(newLine, 'line1');
  //
  // newLine = racingLines[numAlts + 3];
  // for (let i = 0; i < iterations; ++i) {
  //   newLine = improveRaceLine(newLine, innerBounds, outerBounds);
  //   console.log("it2 ", (i + 1), "of", iterations);
  // }
  // newLine.push([newLine[0][0], newLine[0][1]]);
  // centerS.graphics.beginStroke('#00ffff');
  // plotLine(newLine, 10, centerS.graphics);
  // saveLine(newLine, 'line2');

  stage.update();

  console.log("DONE");
}


function saveLine(points, newId) {
  let ta = document.createElement('textarea');
  let lines = document.getElementById('racingLines');
  let pointsStr = '[' + points.join('], [') + ']';
  ta.innerText = 'let ' + newId + ' = [\n' + pointsStr + '];\n';
  lines.appendChild(ta);
}
