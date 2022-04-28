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

function plotLine(points, scale, graphics) {
    // for (let i = 1; i < points.length; ++i) {
    //   plotPoint([points[i][0], points[i][1]], scale, graphics);
    // }
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

    graphics.setStrokeStyle(1);
    graphics.beginStroke('#00f');
    graphics.moveTo(x-5,y);
    graphics.lineTo(x+5,y);
    graphics.moveTo(x,y-5);
    graphics.lineTo(x,y+5);
    graphics.endFill();
    // graphics.moveTo(x - scale * 2, y - scale * 2);
    // graphics.lineTo(x + scale * 2, y + scale * 2);
    // graphics.moveTo(x - scale * 2, y + scale * 2);
    // graphics.lineTo(x + scale * 2, y - scale * 2);
}


// [center_line, inner_border, outer_border].forEach(arr => arr.forEach(pt => {
//   pt[0] += .1;
//   pt[1] = 10 - pt[1];
// }));

let centerS = new createjs.Shape();
centerS.graphics.setStrokeStyle(1);
centerS.graphics.beginStroke("#a0a0a0");
// plotLine(center_line, 100, centerS.graphics);
//
// centerS.graphics.setStrokeStyle(5);
// centerS.graphics.beginStroke("#803000");
// plotLine(inner_border, 100, centerS.graphics);
// centerS.graphics.beginStroke("#803000");
// plotLine(outer_border, 100, centerS.graphics);
//
// console.log(minX, minY, "    ", maxX, maxY);
centerS.x = -minX + 250;
centerS.y = -minY + 50;

// let carC = new createjs.Container();
// carC.x = centerS.x;
// carC.y = centerS.y;
//
// let leaderC = new createjs.Container();
// leaderC.x = 50;
// leaderC.y = centerS.y;

stage.addChild(centerS);
// stage.addChild(carC);
// stage.addChild(leaderC);
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

function makeRaceLine() {
    console.log("making...", TRACK_ITERATIONS);
    let new_line = center_line.concat();

    while (TRACK_ITERATIONS-- > 0) {
        new_line = improveRaceLine(new_line, inner_border, outer_border);
    }
    centerS.graphics.setStrokeStyle(5);
    centerS.graphics.beginStroke("#0000ff");
    new_line.push([new_line[0][0], new_line[0][1]]);
    plotLine(new_line, 100, centerS.graphics);
    stage.update();
    console.log("...making");
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
        console.log(walls[i]);
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
