let bestLapFontStyles = ['24px Helvetica', '24px Helvetica', '24px Helvetica'];
let fontName = 'Tix';


function setupLeaderboard() {
    lapsC = new createjs.Container();

    let labelH = 0;
    let labelW = 0;
    let numLaps = 0;
    for (let i = 0; i < teams.length; ++i) {
        let teamLabel = new createjs.Text(teams[i].name, '20px ${fontName}', '#fff');
        labelW = 210;//Math.max(labelW, teamLabel.getMeasuredWidth());
        labelH = 40;//Math.max(labelH, teamLabel.getMeasuredLineHeight());
        // numLaps = Math.max(numLaps, teams[i].lapData.times.length);
        numLaps = Math.max(numLaps, teams[i].totalLaps);//lapData.times.length);
    }
    rowH = labelH * 1.5;
    lapGraphRowH = rowH;

    let teamNumBlockW = rowH * 1.1;
    let labelX = teamNumBlockW + 10;
    let teamW = labelW + labelX;
    if (fontName == 'Tix') teamW *= .85;
    let accY = 0;
    let carW = rowH * 1.5;
    colW = 100;
    lapGraphCarW = carW;

    let teamS;
    teams.sort((a, b) => {
        return parseInt(a.id) < parseInt(b.id) ? -1 : 1;
    });
    allTeamGraphsC = new createjs.Container();
    let teamGraphs = new createjs.Container();
    for (let i = 0; i < teams.length; ++i) {
        let team = teams[i];
        let teamC = new createjs.Container();
        teamS = new createjs.Shape();
        let teamLabel = new createjs.Text(team.name, `20px ${fontName}`, '#fff');
        teamLabel.textBaseline = 'middle';

        let teamNumC = new createjs.Container();
        // let numTf = new createjs.Text(teams[i].names[0], `40px ${fontName}`, "#000000");
        // let numTf2 = new createjs.Text(teams[i].names[0], `38px ${fontName}`, "#ffffff");
        // let numTf3 = new createjs.Text(teams[i].names[1], `38px ${fontName}`, "#ffffff");
        // numTf3.x = 1;
        // numTf3.y = 1;
        // numTf2.x = 1;
        // numTf2.y = 1;
        // teamNumC.addChild(numTf3);
        // teamNumC.addChild(numTf2);
        // teamNumC.addChild(numTf);
        let labelTf = new createjs.Text(team.id, "20px Helvetica", "#000");
        labelTf.textAlign = 'center';
        labelTf.textBaseline = 'middle';
        labelTf.y = 1;
        let labelS = new zim.Shape();

        labelS.graphics.beginFill('#fff');
        labelS.graphics.drawCircle(0, 0, 16);
        labelS.graphics.endFill();
        teamNumC.addChild(labelS, labelTf);



        let thumb = new createjs.Container();
        let racerThumb = new createjs.Shape();
        let teamGraphC = new createjs.Container();

        racerThumb.graphics.setStrokeStyle('2');
        racerThumb.graphics.beginStroke('#000');
        // racerThumb.graphics.beginFill(team.racer.color);
        let c = argbStruct(team.racer.color);
        // c.a = 128;
        c.a = 255;
        c = rgbaString(c, true);
        racerThumb.graphics.beginFill(c);
        // racerThumb.graphics.drawRect(carW * .2, rowH * .1, carW * .8, rowH * .8);
        racerThumb.graphics.drawRect(-carW, rowH * .1, carW, rowH * .8);
        racerThumb.graphics.endFill();
        // racerThumb.alpha = .5;
        // let racerThumbInfo = new createjs.Text("", '18px Helvetica', team.racer.invcolor);
        // racerThumbInfo.textAlign = 'center';
        // racerThumbInfo.x = -carW / 2;// * .6;
        let racerThumbInfo = new createjs.Text("", `22px ${fontName}`, '#000');
        racerThumbInfo.textBaseline = 'middle';
        racerThumbInfo.lineHeight = 23;
        racerThumbInfo.textAlign = 'left';
        racerThumbInfo.x = 10;// * .6;
        racerThumbInfo.y = rowH / 2;
        thumb.addChild(racerThumb);
        thumb.addChild(racerThumbInfo);


        let graphBmMask = new createjs.Shape();
        graphBmMask.graphics.beginFill('#000').drawRect(-carW, rowH * .1, carW, rowH * .8).endFill();
        let graphBm = new createjs.Bitmap();
        // graphBm.alpha = .7;
        // graphBm.setMask(graphBmMask);
        // graphBm.y = 0;
        // graphBm.x = 0;
        // teamGraphC.addChild(graphBm);
        teamGraphC.addChild(thumb);


        let lapGraphS = new createjs.Shape();
        lapGraphS.y = accY;

        teamGraphC.y = accY;
        teamGraphs.addChild(teamGraphC);
        teamGraphs.addChild(lapGraphS);


        let bestLapTf = new createjs.Text("-", `24px ${fontName}`, '#000');
        bestLapTf.textAlign = "center";
        bestLapTf.textBaseline = "middle";
        bestLapTf.x = teamW + colW
        bestLapTf.y = rowH / 2;//(rowH - labelH) / 1.1;

        let mostLapTf = new createjs.Text("-", `24px ${fontName}`, '#000');
        mostLapTf.textAlign = "center";
        mostLapTf.textBaseline = "middle";
        mostLapTf.x = teamW + colW + colW;
        mostLapTf.y = rowH / 2;//(rowH - labelH) / 1.1;

        teamLabel.x = labelX;
        teamLabel.y = rowH / 2;
        // teamNumC.x = (teamNumBlockW - 34) / 2 + 1;
        // teamNumC.y = (rowH - 36) / 2;
        teamNumC.x = teamNumBlockW / 2;
        teamNumC.y = rowH / 2;

        teamS.graphics.setStrokeStyle(2);
        teamS.graphics.beginStroke('#000');
        teamS.graphics.beginFill('#000');
        teamS.graphics.drawRect(1, 1, teamW - 2, rowH - 2);
        teamS.graphics.endFill();
        teamS.graphics.setStrokeStyle();
        teamS.graphics.beginFill(team.racer.color);
        // teamS.graphics.drawRect(1, 1, rowH * 2 - 2, rowH - 2);
        teamS.graphics.drawRect(1, 1, teamNumBlockW - 2, rowH - 2);
        teamS.graphics.endFill();
        teamC.addChild(teamS);
        teamC.addChild(teamNumC);
        teamC.addChild(teamLabel);
        teamC.addChild(bestLapTf);
        teamC.addChild(mostLapTf);
        teamC.y = accY;
        teamC.name = team.id;

        lapsC.addChild(teamC);
        accY += (rowH + 5);

        bestLapTfByTeamId[team.id] = bestLapTf;
        mostLapTfByTeamId[team.id] = mostLapTf;

        team.racer.stats = {
            frac: 0,
            teamGraphC: teamGraphC,
            thumb: thumb,//teamGraphNode,
            racerThumbInfo: racerThumbInfo,
            bestLapTf: bestLapTf,
            mostLapTf: mostLapTf,
            lapGraphS: lapGraphS,
            lastLapIdxGraphed: -1,
            lapSlowFastRange: 0,
            graphBm: graphBm
        };
        racers.push(team.racer);
    }
    lapsC.addChild(teamGraphs);
    accY -= 5;

    lapGraphH = accY;
    let checkSize = lapGraphH / 31;

    // scale = usableW / xmax;
    document.getElementById('statsCanvas').height = accY + rowH + rowH;

    let finishS = new createjs.Shape();
    // finishS.graphics.setStrokeStyle(checkSize, 'butt');
    // finishS.graphics.beginStroke("#000");
    // drawDashedLine(checkSize * .5, 0, checkSize * .5, lapGraphH, checkSize, 1, true, finishS.graphics);
    // drawDashedLine(checkSize * 1.5, 0, checkSize * 1.5, lapGraphH, checkSize, 1, false, finishS.graphics);
    // finishS.x = teamW + carW + carW;

    let teamTitleTf = new createjs.Text('Team', `20px ${fontName}`, '#000');
    let bestLapTitleTf = new createjs.Text('Best Lap', `20px ${fontName}`, '#000');
    bestLapTitleTf.textAlign = 'center';
    let lapCountTitleTf = new createjs.Text('Laps', `20px ${fontName}`, '#000');
    lapCountTitleTf.textAlign = 'center';
    let positionTitleTf = new createjs.Text('Position', `20px ${fontName}`, '#000');

    teamTitleTf.x = 0;
    bestLapTitleTf.x = teamW + colW;
    lapCountTitleTf.x = bestLapTitleTf.x + colW;
    positionTitleTf.x = lapCountTitleTf.x + colW;

    let headersC = new createjs.Container();
    headersC.addChild(teamTitleTf);
    headersC.addChild(bestLapTitleTf);
    headersC.addChild(lapCountTitleTf);
    headersC.addChild(positionTitleTf);
    headersC.y = 9;

    bestLapRankTags[0] = makeRankTag2(0, rowH, colW + 10, true, '#fff', '#000');
    bestLapRankTags[1] = makeRankTag2(1, rowH, colW + 10, true, '#fff', '#000');
    bestLapRankTags[2] = makeRankTag2(2, rowH, colW + 10, true, '#fff', '#000');//𐬽𐬼⸬⸭
    mostLapRankTags[0] = makeRankTag2(0, rowH, colW + 2, false, '#fff', '#000');
    mostLapRankTags[1] = makeRankTag2(1, rowH, colW + 2, false, '#fff', '#000');
    mostLapRankTags[2] = makeRankTag2(2, rowH, colW + 2, false, '#fff', '#000');//⸟⸟
    // bestLapRankTags[0] = makeRankTag2(0, rowH, colW+10, true, '#000', '#000');
    // bestLapRankTags[1] = makeRankTag2(1, rowH, colW+10, true, '#aaa', '#000');
    // bestLapRankTags[2] = makeRankTag2(2, rowH, colW+10, true, '#fff', '#000');//𐬽𐬼⸬⸭
    // mostLapRankTags[0] = makeRankTag2(0, rowH, colW, false, '#000', '#000');
    // mostLapRankTags[1] = makeRankTag2(1, rowH, colW, false, '#aaa', '#000');
    // mostLapRankTags[2] = makeRankTag2(2, rowH, colW, false, '#fff', '#000');//⸟⸟

    let graphX = lapCountTitleTf.x + carW;
    teamGraphs.x = graphX;
    lapGraphW = statsCanvas.canvas.width - graphX - 100;//teamW - carW - carW;

    racers.forEach(racer => racer.stats.lapGraphS.setBounds(0, 0, lapGraphW, rowH));

    finishS.graphics.setStrokeStyle(2, 'butt');
    finishS.graphics.beginStroke("#888");
    // drawDashedLine(0, 0, 0, lapGraphH, lapGraphH / 41, 1, true, finishS.graphics);
    drawDashedLine(0, 0, 0, lapGraphH, 2, 1, true, finishS.graphics);
    drawDashedLine(lapGraphW, 0, lapGraphW, lapGraphH, 2, 1, true, finishS.graphics);
    finishS.x = graphX;//teamW + carW + carW - 1;

    lapGraphC = new createjs.Container();
    lapGraphC.x = graphX;//lapsT.x + carW;//teamW + carW + carW;
    allTeamGraphsC.x = graphX;
    lapsC.addChildAt(finishS, 0);
    lapsC.addChildAt(lapGraphC, 0);
    lapsC.addChildAt(allTeamGraphsC, 0)

    lapsC.y = rowH + 5;
    leaderC.addChild(headersC);
    leaderC.addChild(lapsC);
    updateLeaderboard();
    updateTotempole();
    statsCanvas.update();
}

// function makeRankTag(idx, side, bg24, fg24) {
//   let s = new createjs.Shape();
//   s.graphics.beginFill('#000').drawCircle(0, 0, side / 2.5).endFill();
//   if (idx == 0) {
//     s.graphics.beginFill('#fff').drawCircle(0, 0, side / 5).endFill();
//   } else if (idx == 1) {
//     s.graphics.beginFill('#fff').drawCircle(-side / 8, -side / 8, side / 9).endFill();
//     s.graphics.beginFill('#fff').drawCircle(side / 8, side / 8, side / 9).endFill();
//   } else {
//     let len = side / 6;
//     let offset = Math.PI * 2 * (1 / 12);
//     let x = Math.cos(Math.PI * 2 * (1 / 3) + offset);
//     let y = Math.sin(Math.PI * 2 * (1 / 3) + offset);
//     s.graphics.beginFill('#fff').drawCircle(len * x, len * y, side / 12).endFill();
//     x = Math.cos(Math.PI * 2 * (2 / 3) + offset);
//     y = Math.sin(Math.PI * 2 * (2 / 3) + offset);
//     s.graphics.beginFill('#fff').drawCircle(len * x, len * y, side / 12).endFill();
//     x = Math.cos(Math.PI * 2 * (3 / 3) + offset);
//     y = Math.sin(Math.PI * 2 * (3 / 3) + offset);
//     s.graphics.beginFill('#fff').drawCircle(len * x, len * y, side / 12).endFill();
//   }
//
//   let tag = new createjs.Container();
//   tag.addChild(s);
//   return tag;
// }

function makeRankTag2(idx, side, w, idxOnLeft, bg24, fg24) {
    let s = new createjs.Shape();
    if (idxOnLeft) {
        s.graphics.beginFill(bg24).drawRect(-w, -side / 2, w, side);
    } else {
        s.graphics.beginFill(bg24).drawRect(0, -side / 2, w, side);
    }

    let cx = idxOnLeft ? -w : w;
    s.graphics.beginFill(bg24).drawCircle(cx, 0, side / 2).endFill();
    if (idx == 0) {
        s.graphics.beginFill(fg24).drawCircle(cx, 0, side / 5).endFill();
    } else if (idx == 1) {
        s.graphics.beginFill(fg24).drawCircle(cx + -side / 8, -side / 8, side / 9).endFill();
        s.graphics.beginFill(fg24).drawCircle(cx + side / 8, side / 8, side / 9).endFill();
    } else {
        let len = side / 6;
        let offset = Math.PI * 2 * (1 / 12);
        let x = Math.cos(Math.PI * 2 * (1 / 3) + offset);
        let y = Math.sin(Math.PI * 2 * (1 / 3) + offset);
        s.graphics.beginFill(fg24).drawCircle(cx + len * x, len * y, side / 12).endFill();
        x = Math.cos(Math.PI * 2 * (2 / 3) + offset);
        y = Math.sin(Math.PI * 2 * (2 / 3) + offset);
        s.graphics.beginFill(fg24).drawCircle(cx + len * x, len * y, side / 12).endFill();
        x = Math.cos(Math.PI * 2 * (3 / 3) + offset);
        y = Math.sin(Math.PI * 2 * (3 / 3) + offset);
        s.graphics.beginFill(fg24).drawCircle(cx + len * x, len * y, side / 12).endFill();
    }

    let tag = new createjs.Container();
    tag.addChild(s);
    return tag;
}

function updateLeaderboard(timestamp) {
    let sorted = racers.concat();
    sorted.sort((a, b) => {
        let lapIdxA = Math.min(a.team.totalLaps, a.lapIdx);
        let lapIdxB = Math.min(b.team.totalLaps, b.lapIdx);
        if (lapIdxA < lapIdxB) return 1;
        if (lapIdxA > lapIdxB) return -1;
        return (a.linePos < b.linePos) ? 1 : -1;

        // let alap = Math.min(a.lapIdx * 2800 + a.linePos);
        // let blap = Math.min(b.lapIdx * 2800 + b.linePos);
        // if (alap < blap) return 1;
        // if (alap > blap) return -1;
        // if (a.linePos < b.linePos) return 1;
        // return -1;

        // if (a.lapIdx < b.lapIdx) return 1;
        // if (a.lapIdx > b.lapIdx) return -1;
        // if (a.linePos < b.linePos) return 1;
        // return -1;
    });

    // main track hack:
    // for (let i = 0; i < Math.min(rankingS.length, sorted.length); ++i) {
    for (let i = 0, rank = 0; i < sorted.length; ++i) {
        let racer = sorted[i];
        if (racer.isPitLine) {
            // console.log("skipping", racer.team.name, "in pits");
            continue;
        }
        if (rank < rankingS.length) {
            rankingS[rank].x = racer.sprite.x;
            rankingS[rank].y = racer.sprite.y;
            // rankingS[i].scaleX = racer.sprite.rotation < -90 || racer.sprite.rotation > 90 ? 1 : -1;
            if (racer.stats.finished) {
                rankingS[rank].parent?.removeChild(rankingS[rank]);
            } else {
                carOutlineC.addChild(rankingS[rank]);
                carC.addChildAt(racer.sprite, 0);
            }
            ++rank;
        } else if (!racer.stats.finished) {
            carC.addChildAt(racer.sprite, 0);
        }
    }

    // if (!((++step % 3) === 0)) return;

    let maxPlaceFrac = 0;
    sorted.forEach(racer => {
        racer.stats.placeFrac = racer.lapIdx + (isNaN(racer.stats.lapFrac) ? 0 : racer.stats.lapFrac);
        if (racer.stats.placeFrac > maxPlaceFrac) maxPlaceFrac = racer.stats.placeFrac;
    });
    maxPlaceFrac += .75;

    let bestLapChanged = false;

    sorted.forEach((racer, idx) => {
        let teamPos = Math.min(racer.team.totalLaps * precalculatedRacingLines[0].length, racer.lapIdx * precalculatedRacingLines[0].length + racer.linePos);
        // place car
        racer.stats.thumb.x = lapGraphW * (racer.stats.placeFrac / maxPlaceFrac);
        // if (racer.stats.graphBm?.image != null) {
        //     racer.stats.graphBm.scaleX = racer.stats.thumb.x / racer.stats.graphBm.image.width;
        // }

        let lapIdx = racer.lapIdx === 0 ? '' : Math.min(racer.team.totalLaps, racer.lapIdx);

        if (!racer.stats.leaderBoardFinished && racer.stats.racerThumbInfo.text !== String(lapIdx)) {
            if (racer.lapIdx > 0) {
                let bestLap = Math.min(...racer.team.lapData.times.slice(0, Math.min(racer.team.totalLaps, racer.lapIdx)));
                mostLaps[racer.team.id] = racer;//{team: racer.team, lapIdx: Math.min(racer.team.totalLaps, racer.lapIdx), linePos: racer.linePos, lapStartTs: racer.lapStartTs};
                bestLaps[racer.team.id] = {team: racer.team, time: bestLap};
                racer.stats.bestLapTf.text = '' + bestLap.toFixed(2);
                racer.stats.bestLap = bestLap;
                racer.stats.mostLapTf.text = '' + Math.min(racer.team.totalLaps, racer.lapIdx);
                bestLapChanged = true;
            }
            racer.stats.racerThumbInfo.text = String(Math.min(racer.team.totalLaps, racer.lapIdx));
        }
        if (racer.stats.finished) {
            if (!racer.stats.leaderBoardFinished) {
                racer.stats.leaderBoardFinished = true;
                racer.stats.racerThumbInfo.text = Math.min(racer.team.totalLaps, racer.lapIdx) + " laps";
                // racer.stats.racerThumbInfo.y *= .45;
                // racer.stats.racerThumbInfo.text = finishData[racer.team.lapData.finish_type_id].type + '\n' + lapIdx + " laps";
                let anim = getFinishAnimation(racer.team.lapData.finish_type_id, racer.stats.thumb.width, racer.stats.thumb.width);
                racer.stats.finishAnim = anim;
                anim.cont.x = racer.stats.thumb.x;
                racer.stats.teamGraphC.addChild(anim.cont);
            }
            if (racer.stats.finishAnim != null) {
                // racer.stats.finishAnim.tick(timestamp)
            }
            return;
        }
    });

    if (bestLapChanged) {
        let bestLapsArr = [];
        let mostLapsArr = [];
        for (let teamId in bestLaps) {
            bestLapsArr.push(bestLaps[teamId]);
            mostLapsArr.push(mostLaps[teamId]);
        }
        bestLapsArr.sort((a, b) => a.time < b.time ? -1 : 1);
        for (let i = 0; i < bestLapsArr.length; ++i) {
            let lapInfo = bestLapsArr[i];
            let bestLapTf = bestLapTfByTeamId[lapInfo.team.id];
            // bestLapTf.color = i < 3 ? '#fff' : '#000';//font = bestLapFontStyles[i] ?? '20px Helvetica';
            bestLapTf.color = '#000';//font = bestLapFontStyles[i] ?? '20px Helvetica';
            bestLapTf.font = i < 3 ? `24px ${fontName}` : `20px ${fontName}`;
            if (bestLapRankTags[i] != null) {
                // bestLapRankTags[i].x = bestLapTf.x - colW / 1.75;// - colW;
                bestLapRankTags[i].x = bestLapTf.x + colW / 2 + 2;// - colW;
                bestLapRankTags[i].y = bestLapTf.y;// - colW;
                let p = lapsC.getChildByName(lapInfo.team.id);
                p.addChildAt(bestLapRankTags[i], 0);
            }
        }
        // racer a, b
        mostLapsArr.sort((a, b) => {
            let lapIdxA = Math.min(a.team.totalLaps, a.lapIdx);
            let lapIdxB = Math.min(b.team.totalLaps, b.lapIdx);
            if (lapIdxA < lapIdxB) return 1;
            if (lapIdxA > lapIdxB) return -1;
            return (a.linePos < b.linePos) ? 1 : -1;

            // if (a.lapIdx < b.lapIdx) return 1;
            // if (a.lapIdx > b.lapIdx) return -1;
            // return (a.linePos < b.linePos ? 1 : -1);
        });
        for (let i = 0; i < mostLapsArr.length; ++i) {
            let racer = mostLapsArr[i];
            let mostLapTf = mostLapTfByTeamId[racer.team.id];
            // mostLapTf.color = i < 3 ? '#fff' : '#000';//// mostLapTf.font = bestLapFontStyles[i] ?? '20px Helvetica';
            mostLapTf.color = '#000';//// mostLapTf.font = bestLapFontStyles[i] ?? '20px Helvetica';
            mostLapTf.font = i < 3 ? `24px ${fontName}` : `20px ${fontName}`;
            if (mostLapRankTags[i] != null) {
                // mostLapRankTags[i].x = mostLapTf.x + colW / 2.5;// + colW;//mostLapTf.getMeasuredWidth() + 20;
                mostLapRankTags[i].x = mostLapTf.x - colW / 2 - 1;// + colW;//mostLapTf.getMeasuredWidth() + 20;
                mostLapRankTags[i].y = mostLapTf.y;// + colW;//mostLapTf.getMeasuredWidth() + 20;
                let p = lapsC.getChildByName(racer.team.id);
                p.addChildAt(mostLapRankTags[i], 0);
            }
        }
    }

    if (raceStarted) {
        // if ((step++ % 3) == 0) {
        buildLapTimeGraphs();
        // }
    }

    let graphStep = lapGraphW / maxPlaceFrac;
    let graphLine;
    for (let x = graphStep, i = 0; x < lapGraphW; x += graphStep, ++i) {
        graphLine = lapGraphLines[i];
        if (graphLine == null) {
            let graphLineS = new createjs.Shape();
            graphLineS.graphics.setStrokeStyle(1, 'butt');
            graphLineS.graphics.beginStroke(['#a8a8b0', '#b0a8a8'][i % 2]);
            graphLineS.graphics.moveTo(0, 0);
            graphLineS.graphics.lineTo(0, lapGraphH);
            graphLineS.cache(-1, -1, 2, lapGraphH + 2, 2);

            graphLine = new zim.Container();
            let graphLineLabel = new createjs.Text(`${i + 1}`, `13px ${fontName}`, '#888');
            let graphLineLabel2 = new createjs.Text(`${i + 1}`, `13px ${fontName}`, '#888');
            graphLineLabel.textAlign = 'center';
            graphLineLabel.x = 0;
            graphLineLabel.y = -graphLineLabel.getMeasuredHeight() * (((i + 1) % 2) * 1.7 + 1) - 8;
            graphLineLabel2.textAlign = 'center';
            graphLineLabel2.x = 0;
            graphLineLabel2.y = lapGraphH + graphLineLabel.getMeasuredHeight() * (((i + 1) % 2) * 1.7 + 1) - 3;
            graphLine.addChild(graphLineLabel);
            graphLine.addChild(graphLineLabel2);
            graphLine.addChild(graphLineS);
            lapGraphLines[i] = {line: graphLineS, label: graphLine};
            lapGraphC.addChild(graphLineS);
            lapGraphC.addChild(graphLine);

            graphLine = lapGraphLines[i];
        }
        graphLine.line.x = x - 1;
        graphLine.label.x = x - 1 - graphStep / 2;
    }
    // for (let x = graphStep, i = 0; x < lapGraphW; x += graphStep, ++i) {
    //     graphLine = lapGraphLines[i];
    //     if (graphLine == null) {
    //         let graphLineS = new createjs.Shape();
    //         graphLineS.graphics.setStrokeStyle(1, 'butt');
    //         graphLineS.graphics.beginStroke(['#a8a8b0', '#989898'][i%2]);
    //         // drawDashedLine(0, 0, 0, lapGraphH, lapGraphH / 82, 1, true, graphLineS.graphics);
    //         graphLineS.graphics.moveTo(0, 0);
    //         graphLineS.graphics.lineTo(0, lapGraphH);
    //         graphLine = new zim.Container();
    //
    //         let graphLineLabel = new createjs.Text(`${i + 1}`, `13px ${fontName}`, '#888');
    //         let graphLineLabel2 = new createjs.Text(`${i + 1}`, `13px ${fontName}`, '#888');
    //         graphLineLabel.textAlign = 'center';
    //         graphLineLabel.x = 0;
    //         graphLineLabel.y = -graphLineLabel.getMeasuredHeight() * (((i + 1) % 2) * 1.7 + 1) - 8;
    //         graphLineLabel2.textAlign = 'center';
    //         graphLineLabel2.x = 0;
    //         graphLineLabel2.y = lapGraphH + graphLineLabel.getMeasuredHeight() * (((i + 1) % 2) * 1.7 + 1) - 3;
    //         graphLine.addChild(graphLineLabel);
    //         graphLine.addChild(graphLineLabel2);
    //         graphLine.addChild(graphLineS);
    //         // graphLine.cache(-10, graphLineLabel.y - 5, 20, lapGraphH + -graphLineLabel.y, 2);
    //         graphLine.cache(-10, graphLineLabel.y - 5, 20, -graphLineLabel.y + graphLineLabel2.y + 20, 2);
    //         lapGraphLines[i] = graphLine;
    //         lapGraphC.addChild(graphLine);
    //     }
    //     graphLine.x = x - 1;
    // }

    if (!statsCanvas.viewInitialized) {
        leaderC.visible = false;
        statsCanvas.viewInitialized = true;
        setTimeout(() => updateLeaderboard(), 500);
    } else {
        leaderC.visible = true;
    }


    statsCanvas.update();
}

function setupTimer() {
    raceTimeSecs = raceData[raceIdx].raceTimeSecs;
    updateTimer(0, true);
}


function updateTimer(raceMs, force) {
    if (!force && (raceMs - lastRaceMs < 100)) return;
    lastRaceMs = raceMs;
    // let pct = Math.floor((internalTimestamp - startTimestamp) / 1000) / raceTimeSecs;
    // if (pct > 1) pct = 1;

    // let timerSecs = Math.ceil(raceTimeSecs * (1 - pct));
    let timerSecs = Math.max(0, raceTimeSecs - Math.floor(raceMs / 1000));

    let ss = timerSecs % 60;
    let mm = Math.floor(timerSecs / 60);
    // let timeDiv;
    // timeDiv = document.getElementById('m0');
    // timeDiv.innerText = '' + Math.floor(mm / 10);
    // timeDiv = document.getElementById('m1');
    // timeDiv.innerText = '' + (mm % 10);
    // timeDiv = document.getElementById('s0');
    // timeDiv.innerText = '' + Math.floor(ss / 10);
    // timeDiv = document.getElementById('s1');
    // timeDiv.innerText = '' + (ss % 10);
    //
    //

    if (m0 != null) {
        m0.text = '' + Math.floor(mm / 10);
        m1.text = '' + (mm % 10);
        s0.text = '' + Math.floor(ss / 10);
        s1.text = '' + (ss % 10);
    }
    totemCanvas.update();


    return timerSecs === 0;
}


function fit3(str) {
    while (str.length < 4) str = " " + str;
    return str;
}


function buildLapTimeGraphs() {

    // Find most laps completed so far
    // for (let i = 0; i < racers.length; ++i) {
    //     if (racers[i].lapIdx > maxGraphLap) {
    //         maxGraphLap = racers[i].lapIdx;
    //     }
    // }


    let lapTimes = [];
    for (let i = racers.length - 1; i >= 0; --i) {
        let teamTimes = racers[i].team.lapData.times.concat();
        teamTimes.length = racers[i].team.totalLaps;
        teamTimes = teamTimes.splice(0, racers[i].lapIdx);
        lapTimes.push(...teamTimes);
        // teamTimes.sort();
        // while (teamTimes.length) lapTimes.push(teamTimes.pop());
    }
    lapTimes.sort();
    let avgTimes = lapTimes.concat();
    let allAvgLap = avgTimes.reduce((acc, time) => acc + time, 0) / (Math.max(avgTimes.length, 1));
    let bestLap = Math.min(...lapTimes);
    let worstLap = Math.max(...lapTimes);

    let bestRange = allAvgLap - bestLap;
    let worstRange = bestRange;//-(avgLap - worstLap);
    let top10Time = lapTimes[Math.min(10, lapTimes.length)];


    // if (maxGraphLap != lastMaxGraphLap) {
    //
    //     console.log(`${maxGraphLap}  arrLen ${avgTimes.length}   best avg worst   ${bestLap.toFixed(2)} ${allAvgLap.toFixed(2)} ${worstLap.toFixed(2)}`);
    //     // console.log(`${maxGraphLap}\n${avgTimes.join('\t')}`);
    //
    //     lastMaxGraphLap = maxGraphLap;
    // }


    // this lap
    racers.forEach((racer, idx) => {
        // if (racer.team.id != 1) return;
        // Copy racers array for destruction, and clear graphics
        let graphS = racer.stats.lapGraphS;
        let g = graphS.graphics;
        g.clear();

        let graphW = racer.stats.thumb.x;
        let graphH = graphS.getBounds().height;
        let exactLap = racer.lapIdx + racer.stats.lapFrac;
        // let stepX = Math.min(graphW, graphW / exactLap);
        let stepX = graphW / exactLap;

        let leftFastX = 0;
        let rightFastX = 0;
        let aggLapTime = 0;
        // let devMids = [];
        for (let lapi = 0; lapi < Math.min(racer.team.totalLaps, racer.lapIdx); ++lapi) {
            let lapTime = racer.team.lapData.times[lapi];
            // devMids.push((lapTime - allAvgLap) * (lapTime - allAvgLap));

            aggLapTime += lapTime;
            let medianRange = allAvgLap - lapTime;

            let myPercentile;
            // faster
            if (lapTime < allAvgLap) {
                myPercentile = medianRange / bestRange;
            } else {
                myPercentile = medianRange / worstRange;
            }

            // console.log(lapi, myPercentile.toFixed(2), lapTime.toFixed(2), median.toFixed(2));
            // let racerRange = worstLap - lapTime;
            // let rangeFrac = Math.max(0, allRange == 0 ? 1 : racerRange / allRange);

            let leftX = lapi * stepX;
            let rightX = leftX + stepX;//Math.min(graphW, leftX + stepX) - 1;
            if (rightX > graphW) rightX = graphW;
            --rightX;

            let leftY = graphH / 2 + -(graphH / 2 * myPercentile);//Math.max(0, graphH / 2 + -(graphH / 2 * myPercentile)) - 1;
            if (leftY < 0) leftY = 0;
            --leftY;

            // leftY = Math.min(leftY, graphH);
            if (leftY > graphH) leftY = graphH;
            let rightY = leftY;

            if (racer.team.lapData.pits[lapi] > 0) {
                g.beginFill('#000000');
            } else if (myPercentile < 0) {
                g.beginFill('#e0e0e0')
            } else {
                g.beginFill('#ffffff')
                if (lapTime < top10Time) {
                    g.beginFill('#ffd090');
                }
            }

            g.moveTo(leftX, leftY);
            g.lineTo(rightX - 1, rightY);
            g.lineTo(rightX - 1, graphH / 2);
            g.lineTo(leftX, graphH / 2);
            g.endFill();

            if (lapTime === racer.stats.bestLap) {
                rightFastX = rightX;
                leftFastX = leftX;
                // let halfX = (rightX - leftX) / 2;
                // let cx = leftX + halfX;
                // let dw = 13;//10 < halfX ? 8 : halfX - 2;//Math.min(8, halfX - 2);
                // let cy = graphH / 2;
                // g.beginFill('#f06');
                // g.moveTo(leftX - 1, cy - dw);
                // g.lineTo(rightX, cy);
                // g.lineTo(leftX - 1, cy + dw);

                // g.lineTo(cx, cy + dw);
                // g.moveTo(cx - dw, cy);
                // g.lineTo(cx, cy - dw);
                // g.lineTo(cx + dw, cy);
                // g.lineTo(cx, cy + dw);
            }
        }

        g.setStrokeStyle(1);
        g.beginStroke('#000');
        g.moveTo(0, graphH / 2);
        g.lineTo(graphW, graphH / 2);
        g.endStroke();

        g.beginFill('#f38');
        g.moveTo(leftFastX - 1, graphH / 2 - 13);
        g.lineTo(rightFastX, graphH / 2);
        g.lineTo(leftFastX - 1, graphH / 2 + 13);

        // // show your avg line
        // let devMidsAvg = devMids.reduce((acc, time) => acc + time, 0) / (Math.max(devMids.length, 1));
        // let stdDev = Math.sqrt(devMidsAvg);
        // if (idx === 0) {
        //     console.log("???", stdDev, devMidsAvg, allAvgLap);
        // }
        //
        //
        // let medianRange = allAvgLap - stdDev;
        //
        // let topPct = stdDev / bestRange;
        // let botPct = -stdDev / worstRange;
        // let topY = Math.max(0, graphH / 2 + -(graphH / 2 * topPct)) - 1;
        // let botY = Math.max(0, graphH / 2 + -(graphH / 2 * botPct)) - 1;
        //
        // g.setStrokeStyle(1);
        // g.beginStroke('#ff7000');
        // g.beginFill('rgba(255, 255, 0, .5');
        // g.moveTo(0, topY);
        // g.lineTo(graphW, topY);
        // g.lineTo(graphW, botY);
        // g.lineTo(0, botY);
        // g.lineTo(0, topY);
        // g.endStroke();


        // let medianRange = allAvgLap - lapAvgTime;
        //
        // let myPercentile;
        // if (lapAvgTime < allAvgLap) {
        //     myPercentile = medianRange / bestRange;
        // } else {
        //     myPercentile = medianRange / worstRange;
        // }
        // let leftY = Math.max(0, graphH / 2 + -(graphH / 2 * myPercentile)) - 1;
        // leftY = Math.min(leftY, graphH);
        // let rightY = leftY;
        //
        // g.setStrokeStyle(1);
        // g.beginStroke('#707');
        // g.moveTo(0, leftY);
        // g.lineTo(graphW, rightY);
        // g.endStroke();
    });

    // racers.forEach(racer => {
    //     let graphS = racer.stats.lapGraphS;
    //     let graphW = racer.stats.thumb.x;
    //     let graphH = graphS.getBounds().height;
    //     graphS.cache(0, 0, graphW, graphH);
    //     let bm = new createjs.Bitmap(graphS.cacheCanvas);
    //     racer.stats.graphBm.image = bm.image;
    //     graphS.uncache();
    //     bm.x = 0;
    // });
}


// finishTypeId
function getFinishAnimation(id, w, h) {
    function drawCircles(s) {
        for (let i = 0; i < 5; ++i) {
            let r = ~~(Math.random() * 128 + 128);
            let g = ~~(Math.random() * 128 + 128);
            let b = ~~(Math.random() * 128 + 128);
            s.graphics.beginFill(`rgba(${r}, ${g}, ${b}, 1)`);
            s.graphics.drawCircle(Math.random() * w, Math.random() * h, Math.random() * (r / 2) + r / 2);
            s.graphics.endFill();
        }
    }

    let f1 = new createjs.Shape();
    drawCircles(f1);
    let f2 = new createjs.Shape();
    drawCircles(f2);
    let f3 = new createjs.Shape();
    drawCircles(f3);
    let f4 = new createjs.Shape();
    drawCircles(f4);
    let f5 = new createjs.Shape();
    drawCircles(f5);
    let cont = new createjs.Container();
    cont.addChild(f1);
    cont.addChild(f2);
    cont.addChild(f3);
    cont.addChild(f4);
    cont.addChild(f5);

    let anim = {
        frameIdx: 0,
        frames: [f1, f2, f3, f4, f5],
        cont: cont,
        tick: function (timestamp) {
            anim.lastTimestamp ??= timestamp;
            if (timestamp - anim.lastTimestamp > 500) {
            }
            anim.frameIdx = (anim.frameIdx + 1) % anim.frames.length;
            anim.cont.removeAllChildren();
            anim.cont.addChild(frames[anim.frameIdx]);
            anim.ccc = anim.cont;
        }
    }

    return anim;
}


function highlightHeatIndex(isHot) {
    if (totemHeatTf != null) {
        totemHeatTf.set({color: isHot ? '#ff0000' : '#03a'});
    }
    totemCanvas.update();
}

function highlightRaceIndex(isHot) {
    if (totemRaceTf != null) {
        totemRaceTf.set({color: isHot ? '#ff0000' : '#03a'});
    }
    totemCanvas.update();
}

function setHeatIndex(idx) {
    if (!hasRaceData(raceIdx, idx)) {
        highlightHeatIndex(false);
        return;
    }
    raceFinished = true;
    heatIdx = idx;
    totemHeatTf.text = `${idx}`;
    totemCanvas.update();
    setTimeout(() => {
        if (raceIdx != null) {
            // generateRaceData(raceIdx, heatIdx);
            highlightHeatIndex(false);
            highlightRaceIndex(false);
            setupRace();
        }
    }, 100);
}

function setRaceIndex(idx) {
    if (!hasRaceData(idx, 1)) {
        highlightRaceIndex(false);
        return;
    }
    raceFinished = true;
    raceIdx = idx;
    heatIdx = 1;
    totemRaceTf.text = `${idx}`;
    totemHeatTf.text = `${heatIdx}`;
    highlightHeatIndex(true);
    setTimeout(() => {
        // generateRaceData(raceIdx, heatIdx);
        highlightHeatIndex(false);
        highlightRaceIndex(false);
        setupRace();
    }, 100);
    totemCanvas.update();
}

function updateTotempole(timestamp) {
    let sorted = racers.concat();
    sorted.sort((a, b) => {
        let lapIdxA = Math.min(a.team.totalLaps, a.lapIdx);
        let lapIdxB = Math.min(b.team.totalLaps, b.lapIdx);
        if (lapIdxA < lapIdxB) return 1;
        if (lapIdxA > lapIdxB) return -1;
        return (a.linePos < b.linePos) ? 1 : -1;
        // let alap = Math.min(a.team.totalLaps, a.lapIdx);
        // let blap = Math.min(b.team.totalLaps, b.lapIdx);
        // if (alap < blap) return 1;
        // if (alap > blap) return -1;
        // if (a.linePos < b.linePos) return 1;
        // return -1;
    });

    totemW = document.getElementById('totemCanvas').width;
    totemH = document.getElementById('totemCanvas').height;

    if (primeTotem) {
        primeTotem = false;

        let fontPrimer = new createjs.Text('♦', '200px Tix', '#a0f0ff');
        fontPrimer.textAlign = 'center';
        fontPrimer.x = totemW / 2;
        fontPrimer.y = totemH / 3;
        totemC.addChild(fontPrimer);
        setTimeout(() => updateTotempole(), 250);
    } else if (reorgTotem) {
        reorgTotem = false;

        let pw = totemW / 2 - totemW / 3 - 12;
        let panel24 = '#a0f0ff';
        totemRaceTf = new createjs.Text(raceIdx, '44px Tix', '#03a');
        totemHeatTf = new createjs.Text(heatIdx, '44px Tix', '#03a');
        totemRaceTf.textAlign = 'center';
        totemHeatTf.textAlign = 'center';
        totemRaceTf.x = totemW / 2 - 27;
        totemRaceTf.y = 10;
        totemHeatTf.x = totemW / 2 + 30;
        totemHeatTf.y = 10;
        let labelRaceTf = new createjs.Text('RACE', '24px Tix', '#000');
        let labelHeatTf = new createjs.Text('HEAT', '24px Tix', '#000');
        labelRaceTf.textAlign = 'right';
        labelRaceTf.x = totemW / 3;
        labelRaceTf.y = 20;
        labelHeatTf.x = totemW / 3 * 2;
        labelHeatTf.y = 20;
        ledgerY = totemHeatTf.y + 45;
        labelHeatTf.mouseEnabled = false;
        labelRaceTf.mouseEnabled = false;


        // race heat panels
        let rhPanels = new zim.Shape();
        rhPanels.addEventListener('click', () => {
            console.log("FILE CLICK");
            document.getElementById("file-input").click();
        });
        rhPanels.f(panel24).dr(totemW / 3 + 10, 0, pw, ledgerY - 0);
        rhPanels.f(panel24).dr(totemW / 3 * 2 - 10 - pw, 0, pw, ledgerY - 0);


        totemRowsByTeamId = {};
        let ledger = new createjs.Shape();
        let colorsA = ['#eff', '#e0f0ff'];
        let colorsB = ['#fff8e8', '#feb'];
        for (let i = 0; i < racers.length; ++i) {
            if (i < 3) {
                ledger.graphics.beginFill(colorsA[i % 2]);
            } else {
                ledger.graphics.beginFill(colorsB[i % 2]);
            }
            ledger.graphics.drawRect(0, ledgerY + ledgerLineH * (i + 1), totemW, ledgerLineH);
            ledger.graphics.endFill();
            totemC.addChild(ledger);
        }

        let nameTf = new createjs.Text('TEAM', '16px Tix', '#000');
        let lapIdxTf = new createjs.Text('LAPS', '16px Tix', '#000');
        let lapTimeTf = new createjs.Text('LAP TIME', '16px Tix', '#000');
        lapIdxTf.textAlign = 'center';
        lapTimeTf.textAlign = 'center';
        nameTf.x = 60;
        lapIdxTf.x = 300;
        lapTimeTf.x = 370;
        nameTf.y = lapIdxTf.y = lapTimeTf.y = ledgerY + (ledgerLineH - nameTf.getMeasuredHeight()) / 2 + 1;

        clockC = new zim.Container();
        m0 = new createjs.Text('0', '48px Tix', '#000');
        m1 = new createjs.Text('0', '48px Tix', '#000');
        let c0 = new createjs.Text(':', '48px Tix', '#000');
        c0.y = -7;
        s0 = new createjs.Text('0', '48px Tix', '#000');
        s1 = new createjs.Text('0', '48px Tix', '#000');
        let accX = 0;
        // let layout = firstTime ? [m0, m1, -3, c0, 8, s0, s1] : [m0, m1, 0, c0, 0, s0, s1];
        let layout = [m0, m1, 0, c0, 0, s0, s1];
        layout.forEach(sym => {
            if (isNaN(sym)) {
                sym.x = accX;
                clockC.addChild(sym);
                accX += sym.getMeasuredWidth();
            } else {
                accX += sym;
            }
        });

        clockC.x = (totemW - accX) / 2;
        clockC.y = totemH - 50;

        let raceTitleTf = new createjs.Text(raceData[raceIdx].title, '24px Tix', '#000');
        raceTitleTf.x = (totemW - raceTitleTf.getMeasuredWidth()) / 2;
        raceTitleTf.y = clockC.y - raceTitleTf.getMeasuredHeight() - 10 - 20;


        rhPanels.f(panel24).dr(clockC.x - 20, clockC.y - 10, accX + 40, totemH - clockC.y + 10);

        totemC.visible = false;
        totemC.addChild(rhPanels, totemRaceTf, totemHeatTf, labelRaceTf, labelHeatTf, nameTf, lapIdxTf, lapTimeTf, clockC, raceTitleTf);

        setTimeout(() => updateTotempole());
        updateTimer(0, true);
    } else {
        totemC.visible = true;
    }

    // let timerSecs = Math.max(0, raceTimeSecs - Math.floor(raceMs / 1000));
    //
    // let ss = timerSecs % 60;
    // if (ss != lastClockSecs) {
    //     lastClockSecs = ss;
    //
    //     let mm = Math.floor(timerSecs / 60);
    //     m0.text = '' + Math.floor(mm / 10);
    //     m1.text = '' + (mm % 10);
    //     s0.text = '' + Math.floor(ss / 10);
    //     s1.text = '' + (ss % 10);
    // }

    if (totemRowsByTeamId != null) {
        // let teamStr = "# ";
        // sorted.forEach(racer => {
        //     teamStr += racer.team.id + "(" + racer.lapIdx+"." + racer.linePos + ")  ";
        // });
        // console.log(teamStr);

        sorted.forEach((racer, idx) => {
            let totem = totemRowsByTeamId[racer.team.id];
            if (totem == null) {
                totem = new createjs.Container();
                let tag = new createjs.Shape();
                tag.graphics.setStrokeStyle(1);
                tag.graphics.beginStroke('#000');
                tag.graphics.beginFill(racer.color);
                tag.graphics.drawRect(0, 0, ledgerLineH * .6, ledgerLineH * .6);
                tag.graphics.endFill();
                let nameText = (racer.team.id.length == 1) ? ` ${racer.team.id}` : racer.team.id;
                let nameTf = new createjs.Text(nameText + '  ' + racer.team.name, '22px Tix', '#000');
                nameTf.textBaseline = 'middle';
                nameTf.set({crispEdges: true});
                let lapIdxTf = new createjs.Text('--', '22px Tix', '#000');
                lapIdxTf.textBaseline = 'middle';
                lapIdxTf.set({crispEdges: true});
                let lapTimeTf = new createjs.Text('--.--', '22px Tix', '#000');
                lapTimeTf.textBaseline = 'middle';
                lapTimeTf.set({crispEdges: true});

                lapIdxTf.name = 'lapIdx';
                lapTimeTf.name = 'lapTime';
                lapIdxTf.textAlign = 'center';
                lapTimeTf.textAlign = 'center';

                tag.x = 20;
                nameTf.x = 60;
                lapIdxTf.x = 300;
                lapTimeTf.x = 370;
                totem.addChild(tag);
                totem.addChild(nameTf);
                totem.addChild(lapIdxTf);
                totem.addChild(lapTimeTf);
                tag.y = (ledgerLineH - ledgerLineH * .6) / 2;
                nameTf.y = lapIdxTf.y = lapTimeTf.y = ledgerLineH / 2;//(lineH - nameTf.getMeasuredHeight()) / 2 + 1;
                totem.curPlace = idx;
                totemRowsByTeamId[racer.team.id] = totem;
            }
            let y = ledgerY + (idx + 1) * ledgerLineH;
            if (totem.parent == null) {
                totem.y = y;
                totemC.addChild(totem);
            } else {
                let lapIdxTf = totem.getChildByName('lapIdx');
                lapIdxTf.text = `${racer.lapIdx == 0 ? '--' : Math.min(racer.team.totalLaps, racer.lapIdx)}`
                let lapTimeTf = totem.getChildByName('lapTime');
                lapTimeTf.text = `${racer.lapIdx == 0 ? '--.--' : racer.team.lapData.times[Math.min(racer.team.totalLaps - 1, racer.lapIdx - 1)].toFixed(2)}`
                totem.curPlace = idx;
                totem.y = y;
            }

        });
    }
    totemCanvas.update();
}
