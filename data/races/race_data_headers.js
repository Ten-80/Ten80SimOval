/*


    These tables MUST MATCH the text in the .csv files (the dropdowns) or else data can't be correlated


 */

let raceIdByRaceType = {
    '5-Min Best Lap': 1,
    '5-Min Consistency': 2,
    '10-Min Most Laps': 3,
    '30-Min Most Laps': 4,
};

let raceData = {
    [1]: {
        raceTimeSecs: 300,
        title: '5 Minute Best Lap'
    },
    [2]: {
        raceTimeSecs: 300,
        title: '5 Minute Consistency'
    },
    [3]: {
        raceTimeSecs: 600,
        title: '10 Minute Most Laps'
    },
    [4]: {
        raceTimeSecs: 1800,
        title: '30 Minute Most Laps'
    },
};

let finishIdByType = {
    '(N/A - Finished)': 1,
    'Dead Battery': 2,
    'Blown Motor': 3,
    'Wheel Problem': 4,
    'Electrical Problem': 5,
    'General Mechanical': 6,
    'Other': 7,
    'Unknown': 8
}

let pitIdByPitType = {
    'Unknown': 1,
    'Tires': 2,
    'Battery': 3,
    'General Repair': 4,
};

let teamMetadata = [];
//     {
//         id: 1,
//         name: 'Lethal Racers'
//     },
//     {
//         id: 2,
//         name: 'Swamp Shifters'
//     },
//     {
//         id: 3,
//         name: 'Beast XLR8'
//     },
//     {
//         id: 4,
//         name: 'MicroBeast'
//     },
//     {
//         id: 5,
//         name: 'Viper Nation'
//     },
//     {
//         id: 6,
//         name: 'Ruff Riders'
//     },
//     {
//         id: 7,
//         name: 'Racing Royals'
//     },
//     {
//         id: 8,
//         name: 'Astro Racing'
//     },
//     {
//         id: 9,
//         name: 'King Clam'
//     },
//     {
//         id: 10,
//         name: 'RC Lions'
//     },
//     {
//         id: 11,
//         name: 'Ram Tech 59'
//     },
//     {
//         id: 12,
//         name: 'Ram Racing 5'
//     },
//     {
//         id: 13,
//         name: 'Viper Tech'
//     },
//     {
//         id: 14,
//         name: 'Talledega Trojans'
//     },
//     {
//         id: 15,
//         name: 'Iditarod Racing'
//     },
//     {
//         id: 16,
//         name: 'Crimson Bolt'
//     },
// ];

let allTeamsRaceData = [];
//     {
//         teamId: 1,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data Lethal Racers v4.csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data Lethal Racers v4.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data Lethal Racers v4.csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data Lethal Racers v4.csv',
//         ]
//     },
//     {
//         teamId: 2,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data (Swamp Shifters) v4 (1).csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data (Swamp Shifters) v4.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data (Swamp Shifters) v4 (2).csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data (Swamp Shifters) v4.csv',
//         ]
//     },
//     {
//         teamId: 3,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data (Beast XLR8) - real.csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data (Beast XLR8) v2.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data (Beast XLR8).csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data (Beast XLR8) v2.csv',
//         ]
//     },
//     {
//         teamId: 4,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data (Micro Beast) v2.csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data (microBeast) v4.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data (MicroBeast).csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data (Microbeast) v2.csv',
//         ]
//     },
//     {
//         teamId: 5,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data (Viper Nation) v4 (1).csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data (Viper Nation) v4.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data (Viper Nation) v4 (2).csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data (Viper Nation) v4.csv',
//         ]
//     },
//     {
//         teamId: 6,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data (Ruff Riders) v4 (1).csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data (Ruff Riders) v4.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data (Ruff Riders) v4 (2).csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data (Ruff Riders) v4.csv',
//         ]
//     },
//     {
//         teamId: 7,
//         heatId: 1,
//         raceFiles: []
//     },
//     {
//         teamId: 8,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data (Piedmont Motorsports) v4.csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data (Piedmont Motosports) v4.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data (Piedmont Motorsports) v4.csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data (Piedmont Motorsports) v4.csv',
//         ]
//     },
//     {
//         teamId: 9,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data king clam.csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data king clam.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data King Clam.csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data King Clam.csv',
//         ]
//     },
//     {
//         teamId: 10,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data (RL Turner_METSA) April 23rd .csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data (RL Turner HS_METSA) April 23rd.csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data (RL Turner HS_METSA) June 23rd.csv',
//         ]
//     },
//     {
//         teamId: 11,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data (RamTech59) v4 (1).csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data (Ram Tech 59) v4.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data (Ram Tech 59) v4 (2).csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data (Ram Tech59) v4.csv',
//         ]
//     },
//     {
//         teamId: 12,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data (Ram Racing) v4 (1).csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data (Ram Racing) v4.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data (Ram Racing) v4 (2).csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data (Ram Racing) v4.csv',
//         ]
//     },
//     {
//         teamId: 13,
//         heatId: 1,
//         raceFiles: []
//     },
//     {
//         teamId: 14,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data Talledega Trojans.csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data Talledega Trojans.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data Talledega Trojans  v4.csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data Talledega Trojans.csv',
//         ]
//     },
//     {
//         teamId: 15,
//         heatId: 1,
//         raceFiles: [
//             './data/races/race_data_2021may/10minMost/10 Minute Most Laps Official Data Iditarod Racing v4.csv',
//             './data/races/race_data_2021may/30minMost/30 Minute Most Laps Official Data Iditarod Racing v4.csv',
//             './data/races/race_data_2021may/5minBest/5 Minute Best Lap Official Data Iditarod Racing v4.csv',
//             './data/races/race_data_2021may/5minConsistency/5 Minute Consistency Official Data Iditarod Racing v4.csv',
//         ]
//     },
//     {
//         teamId: 15,
//         heatId: 1,
//         raceFiles: []
//     },
// ];


let primerRaceData = `Team Name,Pace Car,
Team ID,1,
,,
Race Type,5-Min Best Lap,
Heat Number,1,
Result (dropdown),,
,,
Race Date,,
Race Location,,
Race Time Start,,
Race Time End,,
,,
Lap #,Time,Pits
1,20,
2,20,
3,20,
4,20,
5,20,
6,20,
7,20,
8,20,
9,20,
10,20,
11,,
12,,
13,,
14,,
15,,
16,,
17,,
18,,
19,,
20,,
21,,
22,,
23,,
24,,
25,,
26,,
27,,
28,,
29,,
30,,
31,,
32,,
33,,
34,,
35,,
36,,
37,,
38,,
39,,
40,,
41,,
42,,
43,,
44,,
45,,
46,,
47,,
48,,
49,,
50,,
51,,
52,,
53,,
54,,
55,,
56,,
57,,
58,,
59,,
60,,
61,,
62,,
63,,
64,,
65,,
66,,
67,,
68,,
69,,
70,,
71,,
72,,
73,,
74,,
75,,
76,,
77,,
78,,
79,,
80,,
81,,
82,,
83,,
84,,
85,,
86,,
87,,
88,,
89,,
90,,
91,,
92,,
93,,
94,,
95,,
96,,
97,,
98,,
99,,
100,,
101,,
102,,
103,,
104,,
105,,
106,,
107,,
108,,
109,,
110,,
111,,
112,,
113,,
114,,
115,,
116,,
117,,
118,,
119,,
120,,
121,,
122,,
123,,
124,,
125,,
`;