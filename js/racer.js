// LEADERBOARD
////////////// visuals
let firstTime = false;
let primeTotem;
let reorgTotem;

let allTeamGraphsC;
let lapGraphC;
let lapGraphW;
let lapGraphH;
let lapGraphLines;
let lapGraphRowH;
let lapGraphCarW;
let racers;
let bestLaps;
let mostLaps;
let bestLapTfByTeamId;
let mostLapTfByTeamId;
let bestLapRankTags;
let mostLapRankTags;
let lapsC;
let colW;
let rowH;

/////////////// update timer

let raceStartTs;
let raceTimeSecs;
let lastRaceMs;

////////////////////// total

let totemRowsByTeamId;
let totemW;
let m0;
let m1;
let s0;
let s1;
let clockC;
let ledgerY;
let ledgerLineH = 35;


let totemRaceTf;
let totemHeatTf;

let heatIdx = 1;
let raceIdx = 1;

let keypressSetsHeatIndex;
let keypressSetsRaceIndex;

let wallWidth;
let scale;
let timeSpeed;

let groundS;
let trackS;
let carC;
let carOutlineC;
let trackC;
let leaderC;
let totemC;


// let racers = [];
let precalculatedRacingLines;
let raceStarted;
let raceFinished;
let intersections;
let racersStats;
let rankingS;
let pitPt;

///// onRaceFrame
let lastTimestamp;
let internalTimestamp;
let startTimestamp;
let tidx;

// finish data
let outgoingRacers;    // containers
let animatingOutgoing;

let teamsById;
let teams;

function hasRaceData(raceIdx, heatIdx) {
    let found = false;
    lapData.forEach(teamLapData => {
        if (teamLapData.race_id === raceIdx && teamLapData.heat_id === heatIdx) {
            found = true;
        }
    });
    if (found) {
        return true;
    }
    alert("NO race data for\n\nRace " + raceIdx + "\nHeat " + heatIdx);
    return false;
}

function generateRaceData(raceIdx, heatIdx) {
    teams = JSON.parse(JSON.stringify(teamMetadata));
    teamsById = {};
    teams.forEach(team => {
        team.lapData = {times: []};
        teamsById[team.id] = team;
    });
    lapData.forEach(teamLapData => {
        teamLapData = JSON.parse(JSON.stringify((teamLapData)));
        if (teamLapData.race_id === raceIdx && teamLapData.heat_id === heatIdx) {
            found = true;
            teamsById[teamLapData.team_id].lapData = teamLapData;
        }
    });
    console.log(`Race ${raceIdx} Heat ${heatIdx} generated`);
}

function reset() {
    // LEADERBOARD
    ////////////// visuals
    primeTotem = true;
    reorgTotem = true;

    lapGraphLines = [];
    lapGraphRowH = 0;
    lapGraphCarW = 0;
    racers = [];
    bestLaps = {};
    mostLaps = {};
    bestLapTfByTeamId = {};
    mostLapTfByTeamId = {};
    bestLapRankTags = [];
    mostLapRankTags = [];

    teams = [];
    totemRowsByTeamId = null;

    /////////////// update timer

    raceStartTs = 0;
    raceTimeSecs = 0;
    lastRaceMs = 0;

    // heatIdx = null;
    // raceIdx = null;
    keypressSetsHeatIndex = false;
    keypressSetsRaceIndex = false;


    stage.removeAllChildren();
    statsCanvas.removeAllChildren();
    totemCanvas.removeAllChildren();

    groundS = new createjs.Shape();
    trackS = new createjs.Shape();
    carC = new createjs.Container();
    carOutlineC = new createjs.Container();
    trackC = new createjs.Container();
    trackC.addChild(groundS);
    trackC.addChild(trackS);
    trackC.addChild(carC);
    trackC.addChild(carOutlineC);
    trackC.x = 23;
    trackC.y = 80;

    leaderC = new createjs.Container();
    leaderC.x = 7;
    leaderC.y = 3;

    totemC = new createjs.Container();
    totemC.x = 0;
    totemC.y = 0;

    stage.addChild(trackC);
    statsCanvas.addChild(leaderC);
    totemCanvas.addChild(totemC);

    stage.update();
    statsCanvas.update();
    totemCanvas.update();


    wallWidth = 6;
    scale = 1;
    timeSpeed = 1;

    // precalculatedRacingLines;
    raceStarted = false;
    raceFinished = false;
    intersections = [];
    racersStats = {};
    rankingS = [];

    lastTimestamp = null;
    internalTimestamp = null
    startTimestamp = null
    tidx = 0;

    outgoingRacers = [];    // containers
    animatingOutgoing = false;
}

function setupRace() {
    reset();
    if (!hasRaceData(raceIdx, heatIdx)) {
        return;
    }

    // precalculatedRacingLines = __precalculatedRacingLines;//getPrecalculatedRacingLines();//JSON.parse(JSON.stringify(__precalculatedRacingLines));
    precalculatedRacingLines = JSON.parse(JSON.stringify(__precalculatedRacingLines));
    precalculatedRacingLines.forEach(line => line.pop());

    generateRaceData(raceIdx, heatIdx);

    drawTrack();

    let gridPos = 0;
    for (let teamId in teamsById) {
        let team = teamsById[teamId];
        let numLapsReported = team.lapData.times.length;
        adjustTeamLaps(team);
        let numLapsHonored = team.lapData.times.length;
        if (numLapsReported > numLapsHonored) {
            console.log(`WARNING: ${team.name} reported ${numLapsReported} laps but only ${numLapsHonored}(${team.totalLaps}) are within time limits`);
        }
        team.racer = setRacerOnLine(team, gridPos++);
        if (team.racer.color == null) {
            let stop = 1;
        }
        team.racer.team = team;
    }
    setupLeaderboard();

    setupTimer();

    firstTime = false;
}

function resetRace() {
    raceFinished = true;
    setTimeout(() => {
        setupRace();
    }, 250);
}


function drawDashedLine(x1, y1, x2, y2, dashLen, scale, startWithGap, graphics) {
    x1 *= scale;
    x2 *= scale;
    y1 *= scale;
    y2 *= scale;
    dashLen *= scale;

    graphics.moveTo(x1, y1);

    let dX = x2 - x1;
    let dY = y2 - y1;
    let dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    let dashX = dX / dashes;
    let dashY = dY / dashes;

    let q = startWithGap ? 1 : 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        graphics[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    graphics[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
    return this;
}

function drawRacingLines() {
    precalculatedRacingLines.forEach(line => {
        trackS.graphics.setStrokeStyle(1);
        trackS.graphics.beginStroke('#f00');
        plotLine(line, scale, trackS.graphics);
    });
    stage.update();
}

function plotLinePos(pos) {
    precalculatedRacingLines.forEach(line => {
        trackS.graphics.setStrokeStyle(1);
        trackS.graphics.beginStroke('#f00');
        plotPoint([line[pos][0], line[pos][1]], scale, trackS.graphics);
    });
    stage.update();
}

function drawTrack() {
    let xmin = walls[0][0];
    let xmax = xmin;
    let ymin = walls[0][1];
    let ymax = ymin;
    for (let i = 0; i < walls.length; ++i) {
        let x1 = walls[i][0];
        let y1 = walls[i][1];
        let x2 = walls[i][2];
        let y2 = walls[i][3];
        if (x1 < xmin) xmin = x1;
        if (x2 < xmin) xmin = x2;
        if (x1 > xmax) xmax = x1;
        if (x2 > xmax) xmax = x2;
        if (y1 < ymin) ymin = y1;
        if (y2 < ymin) ymin = y2;
        if (y1 > ymax) ymax = y1;
        if (y2 > ymax) ymax = y2;
    }

    let w = stage.canvas.width;
    let usableW = w - trackC.x * 2;

    let canvasYmax = Math.max(ledgerLineH * teams.length + 95, ymax * scale, 640);

    scale = usableW / xmax;
    document.getElementById('canvas').height = canvasYmax + trackC.y + trackC.x;
    document.getElementById('totemCanvas').height = canvasYmax + trackC.y + trackC.x;
    let usableH = document.getElementById('canvas').height - 20;


    let rankS;
    [['#ffffff', '#000', 1, 1], ['#ffffff', '#000', 1, 2], ['#ffffff', '#000', 1, 3]].forEach((color, idx) => {
        let tag = makeRankTag2(idx, scale * 1.5, 0, false, color[0], color[1]);
        rankS = new createjs.Shape();
        rankS.graphics.beginStroke('#000');
        rankS.graphics.moveTo(0, 0);
        rankS.graphics.lineTo(0, -scale * 2);

        // rankS = new createjs.Shape();
        // rankS.alpha = color[2];
        // rankS.graphics.beginFill(color[0]);
        // rankS.graphics.moveTo(0, -scale * 3);
        // rankS.graphics.lineTo(scale * 1.5, -scale * 2.25);
        // rankS.graphics.lineTo(0, -scale * 1.5);
        // rankS.graphics.endFill();
        // rankS.graphics.setStrokeStyle(1);
        // rankS.graphics.beginStroke('#000');
        // rankS.graphics.moveTo(0, 0);
        // rankS.graphics.lineTo(0, -scale * 3);
        //
        // let stepX = scale * .25;
        // let accX = scale * .7 - stepX * color[3] / 2;
        // let ty = -scale * 2.5;
        // let by = -scale * 2;
        // rankS.graphics.setStrokeStyle('1', 'butt');
        // rankS.graphics.beginStroke(color[1]);
        // for (let i = 0; i < color[3]; ++i) {
        //   rankS.graphics.moveTo(accX, ty);
        //   rankS.graphics.lineTo(accX, by);
        //   accX += stepX;
        // }
        // rankingS.push(rankS);

        let flag = new createjs.Container();
        flag.addChild(rankS);
        tag.y = -scale * 2;
        flag.addChild(tag);
        rankingS.push(flag);
    });

    // Walls
    wallWidth = scale * .6 / 2;
    let checkSize = wallWidth / scale;
    let wallInset = checkSize / 2;

    groundS.graphics.beginFill('#d8d8d0');
    groundS.graphics.drawRect(xmin * scale, ymin * scale, (xmax - xmin) * scale, (ymax - ymin) * scale);
    groundS.graphics.endFill();

    trackS.graphics.setStrokeStyle(wallWidth, 'round');
    trackS.graphics.beginStroke("#e0f0ff");
    for (let i = 0; i < walls.length; ++i) {
        let x1 = walls[i][0];
        let y1 = walls[i][1];
        let x2 = walls[i][2];
        let y2 = walls[i][3];
        plotLine([[x1, y1], [x2, y2]], scale, trackS.graphics);
    }

    trackS.graphics.setStrokeStyle(wallWidth, 'butt');
    trackS.graphics.beginStroke("#000");
    drawDashedLine(startingLine[0], startingLine[1] + wallInset, startingLine[2], startingLine[3] - wallInset, checkSize, scale, true, trackS.graphics);
    drawDashedLine(startingLine[0] - checkSize, startingLine[1] + wallInset, startingLine[2] - checkSize, startingLine[3] - wallInset, checkSize, scale, false, trackS.graphics);
    trackS.graphics.setStrokeStyle(wallWidth, 'butt');
    trackS.graphics.beginStroke("#ffffff");
    drawDashedLine(startingLine[0], startingLine[1] + wallInset, startingLine[2], startingLine[3] - wallInset, checkSize, scale, false, trackS.graphics);
    drawDashedLine(startingLine[0] - checkSize, startingLine[1] + wallInset, startingLine[2] - checkSize, startingLine[3] - wallInset, checkSize, scale, true, trackS.graphics);


    // FIXME hack to increase resolution of racing lines
    // for (let j = 0; j < 3; ++j) {
    //     precalculatedRacingLines.forEach((line) => {
    //         for (let i = line.length - 1; i >= 0; --i) {
    //             let pt1 = line[i];
    //             let pt2 = line[(i + 1) % line.length];
    //             let mid = [(pt1[0] + pt2[0]) / 2, (pt1[1] + pt2[1]) / 2];
    //             line.splice(i + 1, 0, mid);
    //         }
    //     });
    // }

    // test closeness
    // for (let a = 0; a < precalculatedRacingLines.length - 1; ++a) {
    //     for (let b = a + 1; b < precalculatedRacingLines.length; ++b) {
    //         let indices = polyPolyIntersectionIndices(precalculatedRacingLines[a], precalculatedRacingLines[b]);
    //         indices.forEach(posPair => {
    //             intersections[posPair.a] ??= {};
    //             intersections[posPair.a][a] ??= {};
    //             intersections[posPair.a][a][b] = posPair.b;
    //             intersections[posPair.b] ??= {};
    //             intersections[posPair.b][b] ??= {};
    //             intersections[posPair.b][b][a] = posPair.a;
    //         });
    //     }
    // }
    // intersections.length = Math.floor(intersections.length * .72);

    // trackS.graphics.setStrokeStyle('5');
    // trackS.graphics.beginStroke('#ff0000');
    // for (let i = 0; i < intersections.length; ++i) {
    //   let srcLine = intersections[i];
    //   if (srcLine == null) continue;
    //   for (let lineIdx in srcLine) {
    //     // console.log(precalculatedRacingLines[lineIdx][i], "!!!!");
    //     plotPoint(precalculatedRacingLines[lineIdx][i], 10, trackS.graphics);
    //   }
    // }
    //
    // console.log(intersections);


    stage.update();
}

function drawRacingLine(idx) {
    trackS.graphics.setStrokeStyle(1);
    // trackS.graphics.beginStroke('#' + Math.floor(Math.random() * 256 * 256 * 256).toString(16));
    trackS.graphics.beginStroke('#c0c0c0');
    plotLine(precalculatedRacingLines[idx], scale, trackS.graphics);
    stage.update();
}

function drawLine(pts) {
    trackS.graphics.setStrokeStyle(1);
    // trackS.graphics.beginStroke('#' + Math.floor(Math.random() * 256 * 256 * 256).toString(16));
    trackS.graphics.beginStroke('#ff0000');
    plotLine(pts, scale, trackS.graphics);
    stage.update();
}


function adjustTeamLaps(team) {
    let secsElapsed = 0;
    let lapIdx = 0;
    for (; lapIdx < team.lapData.times.length; ++lapIdx) {
        let lapTimeSecs = team.lapData.times[lapIdx];
        // if (secsElapsed + lapTimeSecs > raceData[raceIdx].raceTimeSecs) break;
        if (secsElapsed > raceData[raceIdx].raceTimeSecs) break;
        secsElapsed += lapTimeSecs;
    }
    team.totalLaps = Math.max(0, lapIdx - 1);
    team.lapData.times.length = lapIdx;
    team.maxRacePos = lapIdx * precalculatedRacingLines[0].length;
}

function peek(arr) {
    return arr[arr.length - 1];
}

function lpt(arr) {
    if (arr.length === 0) {
        var stop = 1;
    }
    let pos = arr.length - 1;
    return [arr[pos][0], arr[pos][1]];
}

function fpt(arr) {
    return [arr[0][0], arr[0][1]];
}

function buildPitLine(racer, lapIdx) {
    let handoffX = racer.line[0][0];
    let handoffY = racer.line[0][1];

    let numInPts = 250;

    let pitX = 25 + racer.team.id * 2;
    let maxPitX = 25 + racers.length * 2;
    let idx = 100;
    for (; idx < 300; ++idx) {
        if (racer.line[idx][0] > maxPitX + 3) {
            break;
        }
    }
    // let pitPt = [racer.line[idx][0], racer.line[idx][1]];
    let pitPt = [racer.line[idx][0] + 3, racer.line[idx][1]];
    pitPt[1] = 1.5 / 2;
    // let pitPt = [racer.line[idx][0] + 3, racer.line[idx][1]];
    // pitPt[1] = 1.5 / 2;

    let totalInX = pitPt[0] - handoffX;
    let intoLine = calculateLinePts(handoffX, handoffY, pitPt[0], pitPt[1], numInPts);
    let curveIntoPit = calculateEdgePts([pitPt[0], 0], 1.5 / 2, 90, -180, 24);
    let curveOutPit = calculateEdgePts([46.5, 2], 2 / 2, 270, -90, 18);
    let curveIntoTrack = calculateEdgePts([46.5, 2], 2 / 2, 180, -90, 18);
    let lastCurveX = curveIntoTrack[curveIntoTrack.length - 1][0];
    let lastCurveY = curveIntoTrack[curveIntoTrack.length - 1][1];

    let startX = racer.startingLine[0][0];
    let totalOutX = startX - lastCurveX;
    let outofLine = calculateLinePts(lastCurveX, lastCurveY, handoffX, handoffY, ~~(totalOutX / totalInX * numInPts))

    let numPitPts = racer.startingLine.length - (intoLine.length + curveIntoPit.length + curveOutPit.length + curveIntoTrack.length + outofLine.length);

    let distToPitX = pitPt[0] - pitX;
    let distToExit = pitPt[0] - 27;

    let pitToPark = calculateLinePts(
        curveIntoPit[curveIntoPit.length - 1][0], curveIntoPit[curveIntoPit.length - 1][1],
        pitX, curveIntoPit[curveIntoPit.length - 1][1],
        numPitPts / 3 * (distToPitX / distToExit)
    );
    if (pitToPark.length === 0) {
        pitToPark = calculateLinePts(
            curveIntoPit[curveIntoPit.length - 1][0], curveIntoPit[curveIntoPit.length - 1][1],
            pitX, curveIntoPit[curveIntoPit.length - 1][1],
            numPitPts / 3 * (distToPitX / distToExit)
        );
    }
    let inA = lpt(pitToPark);
    --inA[1];// y up
    let pitA = calculateEdgePts(inA, 1, 90, 90, 24);
    let inB = lpt(pitA);
    --inB[0];// x left
    let pitB = calculateEdgePts(inB, 1, 0, -90, 24);

    let inY = lpt(pitB);
    ++inY[1];// y down
    let pitY = calculateEdgePts(inY, 1, 270, -90, 18);
    let inZ = lpt(pitY);
    --inZ[0];// x left
    let pitZ = calculateEdgePts(inZ, 1, 0, 90, 18);

    let outZ = lpt(pitZ);
    let pitFromPark = calculateLinePts(
        // peek(pitToPark)[0], peek(pitToPark)[1],
        outZ[0], outZ[1],
        curveOutPit[0][0], curveOutPit[0][1],
        numPitPts / 3 * ((pitX - 20) / distToExit)
    );

    // let parkPt = peek(pitToPark);
    let parkPt = lpt(pitB);
    for (let i = 0; i < numPitPts - pitToPark.length - pitFromPark.length; ++i) {
        pitB.push(parkPt);
    }

    let pitStop = [...pitToPark, ...pitA, ...pitB, ...pitY, ...pitZ, ...pitFromPark];

    racer.lineIdx = ~~(Math.random() * precalculatedRacingLines.length);
    let newStartingLine = buildStartRacingLine(
        outofLine[outofLine.length - 1][0],
        outofLine[outofLine.length - 1][1],
        precalculatedRacingLines[racer.lineIdx],
        192);
    outofLine.pop();

    let line = [...intoLine, ...curveIntoPit, ...pitStop, ...curveOutPit, ...curveIntoTrack, ...outofLine];

    racer.startingLine = newStartingLine;
    racer.pitLine = line;
    return line;
}

function buildStartRacingLine(startX, startY, trueLine, rejoinIndex) {
    let onramp = trueLine.concat();
    let totalX = trueLine[rejoinIndex][0] - startX;
    let totalY = trueLine[rejoinIndex][1] - startY;
    for (let i = 0; i < rejoinIndex; ++i) {
        let t = i / rejoinIndex;
        let ease = t;
        let travelX = totalX * t;
        let travelY = totalY * ease;
        onramp[i] = [startX + travelX, startY + travelY];
    }

    return onramp;
}


function setRacerOnLine(team, gridPos) {
    let carS = new createjs.Shape();
    let outlineS = new createjs.Shape();
    let colors = [
        '#ff0000', '#209420', '#ffe100', '#0000ff',
        '#ffa000', '#30c0d0', '#b0f0ff', '#bfef45',
        '#ff00c7', '#facee4', '#911eb4', '#8a8300',
        '#ffffff', '#c06030', '#404040', '#a0a0a0'];
    let invcolors = [
        '#fff', '#fff', '#000', '#fff',
        '#fff', '#fff', '#000', '#fff',
        '#000', '#000', '#fff', '#fff',
        '#000', '#fff', '#fff', '#000'];

    let color = colors[gridPos % colors.length];
    let invcolor = invcolors[gridPos % invcolors.length];

    let pix = scale / 1.1;// / 1.25;
    outlineS.graphics.setStrokeStyle(1);
    outlineS.graphics.beginStroke('#000');
    outlineS.graphics.drawRect(-pix, -pix / 2, pix * 2, pix);

    carS.graphics.beginFill(color);
    carS.graphics.drawRect(-pix, -pix / 2, pix * 2, pix);
    // carS.graphics.drawCircle(0, 0, 3);
    carS.graphics.endFill();

    // let names = {
    //     '1': ['➊', '➀'],
    //     '2': ['➋', '➁'],
    //     '3': ['➌', '➂'],
    //     '4': ['➍', '➃'],
    //     '5': ['➎', '➄'],
    //     '6': ['➏', '➅'],
    //     '7': ['➐', '➆'],
    //     '8': ['➑', '➇'],
    //     '9': ['➒', '➈'],
    //     '10': ['➓', '➉'],
    // }[team.id];
    // team.names = names;
    // let labelTf = new createjs.Text(names[0], "20px Georgia", "#000000");
    // let labelTf2 = new createjs.Text(names[0], "20px Georgia", "#ffffff");
    // let labelTf3 = new createjs.Text(names[1], "20px Georgia", "#ffffff");
    // let label = new createjs.Container();
    // label.addChild(labelTf3);
    // label.addChild(labelTf2);
    // label.addChild(labelTf);

    let fontSize = 13 - ("" + team.id).length;
    let labelTf = new createjs.Text(team.id, fontSize + "px Helvetica", "#fff");
    labelTf.textAlign = 'center';
    labelTf.textBaseline = 'middle';
    labelTf.x = 9;
    labelTf.y = 9;
    let labelS = new zim.Shape();

    labelS.graphics.beginFill('#000');
    labelS.graphics.drawCircle(9, 8, 8);
    labelS.graphics.endFill();
    let label = new createjs.Container();
    label.addChild(labelS, labelTf);


    // let labelBg = new createjs.Text(nameBg, "20px Georgia", "#ffffff");
    let pitTf = new createjs.Text("PIT", "14px Helvetica", "#ffffff");
    let pw = pitTf.getMeasuredWidth() + 10;
    let ph = pitTf.getMeasuredHeight() + 6;
    pitTf.textAlign = 'center';
    let pitS = new createjs.Shape();
    pitS.setBounds(0, 0, pw, ph);
    pitS.graphics.beginFill('#000');
    pitS.graphics.drawRect(0, 0, pw, ph);
    let pitC = new createjs.Container();
    pitTf.x = pw / 2;
    pitTf.y = (ph - pitTf.getMeasuredHeight()) / 2;
    pitC.addChild(pitS);
    pitC.addChild(pitTf);
    pitC.cache(0, 0, pw, ph, 2);
    let pitLabel = new createjs.Bitmap(pitC.cacheCanvas);
    pitLabel.scaleX = pitLabel.scaleY = .5;
    // let pitLabel = pitC;


    pitS.graphics.clear();
    pitS.graphics.beginStroke('#000');
    pitS.graphics.moveTo(0, 0);
    pitS.graphics.lineTo(0, -pix * 2);
    pitS.graphics.beginFill('#000');
    pitS.graphics.drawRect(0, -pix * 2.5, pix * 3.5, pix * 1.4);
    pitS.graphics.endFill();
    let flag = new createjs.Container();
    flag.addChild(pitS);
    pitTf.x = pix * 2 + 2;
    pitTf.y = -pix * 2.5 + 2;//(pix * 1.3 - pitTf.getMeasuredHeight()) / 2;
    flag.addChild(pitTf);
    pitLabel = flag;


    // how many on current line
    let lineIdx = gridPos % precalculatedRacingLines.length;
    let startX = startingLine[0];
    let rangeY = (startingLine[3] - startingLine[1]) - 2;
    let startY = startingLine[1] + (rangeY / Math.max(1, precalculatedRacingLines.length - 1)) * lineIdx;
    let line = buildStartRacingLine(startX - 1 - wallWidth / scale * 2, startY, precalculatedRacingLines[lineIdx], 150);
    let linePos = 0;
    let racer = {
        lapStartTs: null,
        lapIdx: 0,
        line: line,
        startingLine: line,
        lastLaneChangePos: 0,
        anglePosLead: 15 + Math.floor(Math.random() * Math.random() * 40),
        lineIdx: lineIdx,
        linePos: linePos,
        sprite: carS,
        outline: outlineS,
        label: label,
        pitLabel: pitLabel,
        pitTf: pitTf,
        color: color,
        invcolor: invcolor,
        shouldRejoinLine: true,
        rejoinLineIndex: 200,
        name: name,
    };
    let linePt = racer.line[(racer.linePos + 1) % racer.line.length];
    // let tailPt = racer.line[racer.linePos];
    racer.sprite.x = linePt[0] * scale;
    racer.sprite.y = linePt[1] * scale;
    racer.outline.x = linePt[0] * scale;
    racer.outline.y = linePt[1] * scale;
    racer.label.x = linePt[0] * scale;
    racer.label.y = linePt[1] * scale;

    carC.addChild(carS);
    carOutlineC.addChildAt(outlineS, 0);
    // carC.addChild(labelBg);
    carOutlineC.addChild(label);
    // carOutlineC.addChild(pitLabel);
    stage.update();

    return racer;
}

function runRace() {
    // let input = document.getElementById('startRaceInput');
    // input.value = 'RESET RACE';
    // input.onclick.text = 'location.reload()';
    raceStarted = true;
    timeSpeed = .5;
    window.requestAnimationFrame(onRunRace);
}

function onRunRace(timestamp) {
    for (let id in teamsById) {
        let team = teamsById[id];
        team.racer.lapStartTs = timestamp;
        raceStartTs = timestamp;


        // is first lap a pit?
        if (team.lapData.pits?.[team.racer.lapIdx] > 0 ?? false) {
            team.racer.shouldRejoinLine = false;
            team.racer.line = buildPitLine(team.racer);
            team.racer.isPitLine = true;
            carOutlineC.addChildAt(team.racer.pitLabel, 0);
        }
    }

    updateTimer(timestamp - raceStartTs);

    // racers.forEach((racer) => {
    //   // racer.lapStartTs = timestamp - (racer.lapTime * (racer.linePos / racer.line.length));
    //   racer.lapStartTs = timestamp;
    // });
    stage.update();
    window.requestAnimationFrame(onRaceFrame);
}

function smoothLine(ptsArr, numPts) {
    let pts = ptsArr.map(pt => new THREE.Vector2(pt[0], pt[1]));
    let spline = new THREE.SplineCurve(pts);
    let vecPts = spline.getPoints(numPts);
    let smoothed = vecPts.map(vpt => [vpt.x, vpt.y]);

    return smoothed;
}


function onRaceFrame(timestamp) {
    if (raceFinished) return;

    lastTimestamp ??= timestamp;
    internalTimestamp ??= timestamp;
    startTimestamp ??= timestamp;

    let diff = timestamp - lastTimestamp;
    diff *= timeSpeed;
    internalTimestamp += diff;
    lastTimestamp = timestamp;
    timestamp = internalTimestamp;
    if (timeSpeed < 1) timeSpeed += .01;

    // console.log(tidx, internalTimestamp, 'onframe');


    // for (let i = racers.length - 1; i >= 0; --i) {
    //   let racer = racers[i];
    let numStillRacing = 0;
    for (let id in teamsById) {
        let team = teamsById[id];
        let racer = team.racer;
        if (racer.stats.finished) continue;
        ++numStillRacing;

        racer.lapStartTs ??= timestamp;
        // let lapTimes = racer.team.lapData.times;
        let lapTimes = team.lapData.times;
        if (racer.lapIdx >= lapTimes.length) {
            // if (racer.lapIdx >= racer.team.totalLaps) {
            finishRaceForRacer(racer);
            racer.stats.finished = true;
            continue;
        }
        // let lapTime = lapTimes[racer.lapIdx] * 1000 / timeSpeed;
        let lapTime = lapTimes[racer.lapIdx] * 1000;
        let lapElapsed = timestamp - racer.lapStartTs;
        let t = lapElapsed / lapTime;
        racer.stats.lapFrac = t;
        // = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        let linePos = Math.floor(racer.line.length * t);//(lapElapsed / lapTime));
        if (racer.shouldRejoinLine && linePos > racer.rejoinLineIndex) {
            racer.shouldRejoinLine = false;
            racer.line = precalculatedRacingLines[racer.lineIdx];
        }

        // switch lanes
        // if (linePos >= 2498 && linePos <= 2510 && !racer.switchedLanes) {
        if (linePos >= 1858 && linePos <= 1870 && !racer.switchedLanes && !racer.isPitLine) {
            // console.log(racer.team.id + " LANE CHANGE");
            racer.switchedLanes = true;
            racer.lineIdx = ~~(precalculatedRacingLines.length * Math.random());
            racer.line = precalculatedRacingLines[racer.lineIdx];
        }

        if (linePos > racer.line.length - 1) {
            racer.switchedLanes = false;
            racer.lastLaneChangePos = 0;
            linePos = 0;//Math.ceil(racer.line.length * pctOverflow);
            // get off the startRacingLine. if we were on it
            // racer.line = precalculatedRacingLines[racer.lineIdx];
            racer.lapStartTs = timestamp;// - lapTime * pctOverflow;
            racer.stats.lapFrac = 0;
            ++racer.lapIdx;

            if (racer.team.lapData.pits?.[racer.lapIdx] > 0 ?? false) {
                racer.line = buildPitLine(racer);
                racer.isPitLine = true;
                carOutlineC.addChildAt(racer.pitLabel, 0);
            } else {
                if (racer.isPitLine) {
                    racer.isPitLine = false;
                    // racer.pitLabel.parent?.removeChild(racer.pitLabel);
                    carOutlineC.removeChild(racer.pitLabel);
                    racer.line = racer.startingLine;
                    racer.shouldRejoinLine = true;
                }
            }

            racer.linePos = 0;
            updateTotempole();
        }
        racer.linePos = linePos;
        if (Math.random() > .99) racer.anglePosLead = 15 + Math.floor(Math.random() * Math.random() * 30);
        let linePt = racer.line[(racer.linePos + 1) % racer.line.length];
        let tailPt = racer.line[racer.linePos];
        let anglePt = racer.line[(racer.linePos + racer.anglePosLead) % racer.line.length];

        let rot = Math.atan2(anglePt[1] - tailPt[1], anglePt[0] - tailPt[0]);
        let rotD = rot * (180 / Math.PI);

        racer.sprite.x = linePt[0] * scale;
        racer.sprite.y = linePt[1] * scale;
        racer.outline.x = linePt[0] * scale;
        racer.outline.y = linePt[1] * scale;
        racer.label.x = linePt[0] * scale;
        racer.label.y = linePt[1] * scale;
        if (tailPt[0] < linePt[0]) {
            racer.stats.testFlipCount ??= 0;
            --racer.stats.testFlipCount;
            if (racer.stats.testFlipCount < -4) {
                racer.stats.testFlipCount = 0;
                racer.pitLabel.scaleX = -1;
                racer.pitTf.scaleX = -1;
            }
        } else {
            racer.stats.testFlipCount ??= 0;
            ++racer.stats.testFlipCount;
            if (racer.stats.testFlipCount > 4) {
                racer.stats.testFlipCount = 0;
                racer.pitLabel.scaleX = 1;
                racer.pitTf.scaleX = 1;
            }
        }
        racer.pitLabel.x = linePt[0] * scale;
        racer.pitLabel.y = linePt[1] * scale;

        // racer.labelBg.x = linePt[0] * scale;
        // racer.labelBg.y = linePt[1] * scale;

        // calc angle
        // if (racer.sprite.rotation !== racer.sprite.targetRot) {
        //     racer.sprite.rotation += (racer.sprite.targetRot - racer.sprite.rotation) * .8;
        // }
        // if (racer.outline.rotation !== racer.outline.targetRot) {
        //     racer.outline.rotation += (racer.outline.targetRot - racer.outline.rotation) * .8;
        // }


        racer.sprite.rotation = rotD;
        racer.outline.rotation = rotD;
    }

    updateLeaderboard(timestamp);
    let timeFinished = updateTimer(timestamp - raceStartTs);

    stage.update();

    if (!raceFinished && numStillRacing > 0) {
        window.requestAnimationFrame(onRaceFrame);
    }
}


function finishRaceForRacer(racer) {
    let outgoing = new createjs.Container();
    outgoing.name = racer.team.id;
    outgoing.addChild(racer.sprite);
    outgoing.addChild(racer.outline);
    outgoing.addChild(racer.label);
    carOutlineC.addChild(outgoing);
    outgoingRacers.push(outgoing);
    tweenOutFinishedRacer();
    console.log("race done for", racer.team.name);
}

function tweenOutFinishedRacer() {
    if (outgoingRacers.length == 0) {
        return;
    }
    if (animatingOutgoing) return;
    animatingOutgoing = true;
    while (outgoingRacers.length > 0) {
        let outgoing = outgoingRacers.shift();

        console.log("tweenout BEGIN", outgoing.name);
        (outgoing => createjs.Tween.get(outgoing)
            .wait(500)
            .to({alpha: 0, visible: false}, 500)
            .call(() => {
                stage.update();
                console.log("tweenout END", outgoing.name);
                outgoing.parent.removeChild(outgoing)
                animatingOutgoing = false;
                window.requestAnimationFrame(tweenOutFinishedRacer);
            }))(outgoing);
    }
    window.requestAnimationFrame(tweenOutFinishedRacer);
}



