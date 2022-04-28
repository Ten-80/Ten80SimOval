// Globals

let lapData = [];
let teamNamesById = {};

teamMetadata.forEach(team => {
    teamNamesById[team.id] = team.name;
});


function loadTeamFile(path, onData) {
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

/*
function buildLapData(teamsRaceData, onLapDataReady) {
    let filesToLoad = [];

    function checkIfComplete() {
        if (filesToLoad.length == 0) {
            clearTimeout(failTimer);
            console.log('...ALL FILES LOADED');
            if (errors.length === 0) {
                console.log('...NO ERRORS');
            } else {
                console.error('ALL ERRORS:\n' + errors.join("\n"));
            }
            setTimeout(() => onLapDataReady());
        }
    }

    teamsRaceData.forEach(teamData => {
        teamData.raceFiles.forEach(raceFile => {
            filesToLoad.push(raceFile);
        });
    });

    let total = filesToLoad.length;
    let failTimer = setInterval(checkFail, 1000);
    let errors = [];

    function checkFail() {
        console.log(`*** PROGRESS ${total - filesToLoad.length} of ${total} processed ***`);
    }

    teamsRaceData.forEach(teamData => {
        let teamId = teamData.teamId;
        let teamName = teamNamesById[teamId];
        let heatId = teamData.heatId;
        let raceFiles = teamData.raceFiles;
        raceFiles.forEach((raceFile, raceIdx) => {
            let pathParts = raceFile.split("/");
            let fileLabel = pathParts.pop();
            console.log("Loading team file...", raceFile);
            loadTeamFile(raceFile, (csvData) => {
                let csvRows = $.csv.toArrays(csvData);
                let inLapTimes = false;
                let inPitInfo = false;
                let raceId;
                let finishTypeId;
                let lapTimes = [];
                let pits = [];
                csvRows.forEach(row => {
                    if (inLapTimes) {
                        if (row[0] === '') {
                            if (lapTimes.length === 0) {
                                let error = `...WARNING ${teamName} (${teamId}): NO VALID LAP TIMES in race ${raceId} heat ${heatId}`;
                                errors.push(error);
                                console.error(error);
                            } else {
                                console.log(`...${teamName} (${teamId}): ${lapTimes.length} valid lap times in race ${raceId} heat ${heatId}`);
                            }
                            inLapTimes = false;
                        } else {
                            let lapTime = parseFloat(row[1]);
                            if (isNaN(lapTime)) {
                                // skip it and end lap import for team
                                let error = `${teamName} (${teamId}): INVALID LAP TIME: '${row[1]}' at lap '${row[0]}' in race ${raceId} heat ${heatId}: `;
                                errors.push(error);
                                console.error(error);
                                error = `...${teamName} (${teamId}): has ${lapTimes.length} valid lap times in race ${raceId} heat ${heatId}`;
                                errors.push(error);
                                console.error(error);
                                inLapTimes = false;
                            } else {
                                lapTimes.push(parseFloat(row[1]));
                            }
                        }
                    } else if (inPitInfo) {
                        if (row[0] === '') {
                            inPitInfo = false;
                        } else {
                            let pitLapIdx = parseInt(row[0]);
                            if (isNaN(pitLapIdx)) {
                                // skip it
                                let error = `${teamName} (${teamId}): INVALID PIT LAP: '${row[0]}' in race ${raceId} heat ${heatId}, IGNORED`
                                errors.push(error);
                                console.error(error);
                            } else {
                                pits[pitLapIdx] = pitIdByPitType[row[1]];
                            }
                        }
                    }

                    if (row[0] === 'Lap Number') {
                        inLapTimes = true;
                        inPitInfo = false;
                    } else if (row[0] === 'Pit Stop Laps & Reasons') {
                        inLapTimes = false;
                        inPitInfo = true;
                    } else if (row[0] === 'Race Type (dropdown)') {
                        let raceType = row[1];
                        raceId = raceIdByRaceType[raceType];
                    } else if (row[0] === 'If DNF, why? (dropdown)') {
                        let finishType = row[1];
                        finishTypeId = finishIdByType[finishType];
                    }
                });

                for (let i = 0; i < lapTimes.length; ++i) {
                    if (pits[i] == null) pits[i] = 0;
                }

                let teamData = {
                    team_id: teamId,
                    race_id: raceId,
                    heat_id: heatId,
                    track_id: 1,
                    finish_type_id: finishTypeId,
                    times: lapTimes,
                    pits: pits,
                    src: raceFile,
                }
                lapData.push(teamData);

                // if (teamId == 9) {
                //     console.log(teamData);
                // }
                // console.log('   ' + fileLabel + ' loaded');
                let idx = filesToLoad.indexOf(raceFile);
                filesToLoad.splice(idx, 1);
                checkIfComplete();
            });
        });
    });
}
*/


function getRow(rows, key) {
    let row = rows.find(row => row[0] === key);
    return row;
}

function getRowIndex(rows, key) {
    let idx = rows.findIndex(row => row[0] === key);
    return idx;
}

function getKeyValue(rows, key) {
    return getRow(rows, key)?.[1];
}

function getColumn(rows, idx) {
    let col = [];
    rows.forEach(row => col.push(row[idx]));
    return col;
}

function buildLapData2(csvText) {
    lapData.length = 0;

    let csvRows = $.csv.toArrays(csvText);

    let errors = [];

    let teamNamesIndex = getRowIndex(csvRows, 'Team Name');
    if (teamNamesIndex === -1) {
        errors.push(`'Team Name' row is missing`);
    }
    let teamIdsIndex = getRowIndex(csvRows, 'Team ID');
    if (teamIdsIndex === -1) {
        errors.push(`'Team ID' row is missing`);
    }
    let raceTypeIndex = getRowIndex(csvRows, 'Race Type');
    if (raceTypeIndex === -1) {
        errors.push(`'Race Type' row is missing`);
    }
    let heatNumberIndex = getRowIndex(csvRows, 'Heat Number');
    if (heatNumberIndex === -1) {
        errors.push(`'Heat Number' row is missing`);
        return;
    }
    let lapLabelIndex = getRowIndex(csvRows, 'Lap #');
    if (lapLabelIndex === -1) {
        errors.push(`'Lap #' row is missing`);
    }
    let firstLapIndex = getRowIndex(csvRows, '1');
    if (firstLapIndex === -1) {
        errors.push(`'1' (first lap) row is missing`);
    }

    let numCols = csvRows[0].length;
    if (numCols <= 1) {
        errors.push(`Race data is missing`);
    } else if ((numCols % 2) === 0) {
        errors.push(`Race data is malformed: each team must have two columns, one for identity and lap times, and the other for pit stop data`);
    }

    if (errors.length > 0) {
        console.error("METADATA ERRORS:\n" + errors.join("\n"));
        return;
    }

    // find last lap row
    let lapLabels = getColumn(csvRows, 0);
    let lastLapIdx = firstLapIndex;
    for (let i = 1; lastLapIdx < lapLabels.length; ++lastLapIdx, ++i) {
        if (lapLabels[lastLapIdx] === `${i}`) continue;
        break;
    }

    // column 0 is headers/labels
    // column 1 is the first data column
    let tempLapData = [];
    let tempTeamIdToTeamName = {};
    let tempTeamNameToTeamId = {};
    let tempTeamMetadata = [];
    for (let colIdx = 1; colIdx < numCols; colIdx += 2) {
        let lapCol = getColumn(csvRows, colIdx);
        let pitCol = getColumn(csvRows, colIdx + 1);

        let teamName = lapCol[teamNamesIndex];
        if (teamName == null || teamName.length === 0) {
            errors.push(`Invalid 'Team Name' found in column ${colIdx + 1} row ${teamNamesIndex}`);
            continue;
        }
        let teamId = parseInt(lapCol[teamIdsIndex]);
        if (teamId == null || isNaN(teamId)) {
            errors.push(`Team '${teamName}' has an invalid 'Team ID': '${lapCol[teamIdsIndex]}'`);
            continue;
        }

        let existingId = tempTeamNameToTeamId[teamName];
        let existingName = tempTeamIdToTeamName[teamId];
        if (existingId == null && existingName == null) {
            tempTeamIdToTeamName[teamId] = teamName;
            tempTeamNameToTeamId[teamName] = teamId;
            tempTeamMetadata.push({
                id: teamId,
                name: teamName,
            })
        } else if (tempTeamNameToTeamId[teamName] !== teamId || tempTeamIdToTeamName[teamId] !== teamName) {
            errors.push(`All teams must be assigned both unique 'Team ID' and 'Team Name' values`);
            errors.push(`Found problems with 'Team Name': '${teamName} and 'Team ID': ${teamId}`);
        }

        let raceId = raceIdByRaceType[lapCol[raceTypeIndex]];
        if (raceId == null) {
            errors.push(`Team '${teamName}' has an invalid 'Race Type': '${lapCol[raceTypeIndex]}'`);
            continue;
        }
        let heatId = parseInt(lapCol[heatNumberIndex]);
        if (heatId == null || isNaN(heatId)) {
            errors.push(`Team '${teamName}' has an invalid 'Heat Number': '${lapCol[heatNumberIndex]}'`);
            continue;
        }

        let times = [];
        let pits = [];
        for (let lapIdx = firstLapIndex; lapIdx <= lastLapIdx; ++lapIdx) {
            let time = parseFloat(lapCol[lapIdx]);
            if (time == null || isNaN(time)) {
                break;
            }
            times.push(time);
            let pitType = pitCol[lapIdx];
            if (pitType == null || pitType === '') {
                pits.push(0);
            } else {
                pits.push(pitIdByPitType[pitType] ?? 1);
            }
        }

        let teamRaceData = {
            team_name: teamName,
            team_id: teamId,
            race_id: raceId,
            heat_id: heatId,
            track_id: 1,
            finish_type_id: 1,
            times: times,
            pits: pits,
        };

        console.log(`Loaded '${teamName}' (${teamId}) for race ${raceId} heat ${heatId}`);
        tempLapData.push(teamRaceData);
    }

    if (errors.length > 0) {
        console.error("TEAM DATA ERRORS:\n" + errors.join("\n"));
        return;
    }

    lapData = tempLapData;
    teamMetadata = tempTeamMetadata;
    teamNamesById = {};
    teamMetadata.forEach(team => {
        teamNamesById[team.id] = team.name;
    });
    console.log("Import finished");
}