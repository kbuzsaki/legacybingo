ootBingoGenerator = function(bingoList, opts) {
    if (!opts) opts = {};
    var LANG = opts.lang || 'name';
    var SEED = opts.seed || Math.ceil(999999 * Math.random()).toString();
    Math.seedrandom(SEED);
    var MODE = opts.mode || 'normal';
    var rowElements = {};
    rowElements["row1"] = [1, 2, 3, 4, 5];
    rowElements["row2"] = [6, 7, 8, 9, 10];
    rowElements["row3"] = [11, 12, 13, 14, 15];
    rowElements["row4"] = [16, 17, 18, 19, 20];
    rowElements["row5"] = [21, 22, 23, 24, 25];
    rowElements["col1"] = [1, 6, 11, 16, 21];
    rowElements["col2"] = [2, 7, 12, 17, 22];
    rowElements["col3"] = [3, 8, 13, 18, 23];
    rowElements["col4"] = [4, 9, 14, 19, 24];
    rowElements["col5"] = [5, 10, 15, 20, 25];
    rowElements["tlbr"] = [1, 7, 13, 19, 25];
    rowElements["bltr"] = [5, 9, 13, 17, 21];

    function invertObject(obj) {
        var ret = {};
        Object.keys(obj).forEach(function(key) {
            obj[key].forEach(function(item) {
                if (!ret[item]) ret[item] = [];
                ret[item].push(key);
            });
        });
        return ret;
    }
    rowCheckList = invertObject(rowElements);

    function makeCard() {
        var bingoBoard = [];
        for (var i = 1; i <= 25; i++) {
            if (MODE == "short") {
                bingoBoard[i] = {
                    difficulty: difficulty(i),
                    child: "yes"
                };
            } else {
                bingoBoard[i] = {
                    difficulty: difficulty(i),
                    child: "no"
                };
            }
        }
        var populationOrder = [];
        populationOrder[1] = 13;
        var diagonals = [1, 7, 19, 25, 5, 9, 17, 21];
        shuffle(diagonals);
        populationOrder = populationOrder.concat(diagonals);
        var nondiagonals = [2, 3, 4, 6, 8, 10, 11, 12, 14, 15, 16, 18, 20, 22, 23, 24];
        shuffle(nondiagonals);
        populationOrder = populationOrder.concat(nondiagonals);
        for (var k = 23; k <= 25; k++) {
            var currentSquare = getDifficultyIndex(k);
            if (currentSquare == 0) continue;
            for (var i = 1; i < 25; i++) {
                if (populationOrder[i] == currentSquare) {
                    populationOrder.splice(i, 1);
                    break;
                }
            }
            populationOrder.splice(1, 0, currentSquare);
        }
        for (var i = 1; i <= 25; i++) {
            var sq = populationOrder[i];
            var getDifficulty = bingoBoard[sq].difficulty;
            var goalArray = getShuffledGoals(getDifficulty);
            var j = 0,
                synergy = 0,
                spill = 0,
                currentObj = null,
                minSynObj = null;
            do {
                currentObj = goalArray[j];
                synergy = checkLine(sq, currentObj);
                if (minSynObj == null || synergy < minSynObj.synergy) {
                    minSynObj = {
                        synergy: synergy,
                        value: currentObj
                    };
                }
                j++;
                if (j >= goalArray.length) {
                    getDifficulty++;
                    spill++;
                    if (getDifficulty > 25) {
                        return false;
                    } else if (spill >= 3) {
                        return false;
                    } else {
                        goalArray = getShuffledGoals(getDifficulty);
                        j = 0;
                    }
                }
            } while (synergy != 0);
            bingoBoard[sq].types = minSynObj.value.types;
            bingoBoard[sq].subtypes = minSynObj.value.subtypes;
            bingoBoard[sq].name = minSynObj.value[LANG] || minSynObj.value.name;
            bingoBoard[sq].child = minSynObj.value.child;
            bingoBoard[sq].synergy = minSynObj.synergy;
        }
        return bingoBoard;

        function mirror(i) {
            if (i == 0) {
                i = 4;
            } else if (i == 1) {
                i = 3;
            } else if (i == 3) {
                i = 1;
            } else if (i == 4) {
                i = 0;
            }
            return i;
        }

        function difficulty(i) {
            var Num3 = SEED % 1000;
            var Rem8 = Num3 % 8;
            var Rem4 = Math.floor(Rem8 / 2);
            var Rem2 = Rem8 % 2;
            var Rem5 = Num3 % 5;
            var Rem3 = Num3 % 3;
            var RemT = Math.floor(Num3 / 120);
            var Table5 = [0];
            Table5.splice(Rem2, 0, 1);
            Table5.splice(Rem3, 0, 2);
            Table5.splice(Rem4, 0, 3);
            Table5.splice(Rem5, 0, 4);
            Num3 = Math.floor(SEED / 1000);
            Num3 = Num3 % 1000;
            Rem8 = Num3 % 8;
            Rem4 = Math.floor(Rem8 / 2);
            Rem2 = Rem8 % 2;
            Rem5 = Num3 % 5;
            Rem3 = Num3 % 3;
            RemT = RemT * 8 + Math.floor(Num3 / 120);
            var Table1 = [0];
            Table1.splice(Rem2, 0, 1);
            Table1.splice(Rem3, 0, 2);
            Table1.splice(Rem4, 0, 3);
            Table1.splice(Rem5, 0, 4);
            i--;
            RemT = RemT % 5;
            x = (i + RemT) % 5;
            y = Math.floor(i / 5);
            var e5 = Table5[(x + 3 * y) % 5];
            var e1 = Table1[(3 * x + y) % 5];
            value = 5 * e5 + e1;
            if (MODE == "short") {
                value = Math.floor(value / 2);
            } else if (MODE == "long") {
                value = Math.floor((value + 25) / 2);
            }
            value++;
            return value;
        }

        function shuffle(toShuffle) {
            for (var i = 0; i < toShuffle.length; i++) {
                var randElement = Math.floor(Math.random() * (i + 1));
                var temp = toShuffle[i];
                toShuffle[i] = toShuffle[randElement];
                toShuffle[randElement] = temp;
            }
        }

        function getShuffledGoals(difficulty) {
            var newArray = bingoList[difficulty].slice();
            shuffle(newArray);
            return newArray;
        }

        function getDifficultyIndex(difficulty) {
            for (var i = 1; i <= 25; i++) {
                if (bingoBoard[i].difficulty == difficulty) {
                    return i;
                }
            }
            return 0;
        }

        function checkLine(i, testsquare) {
            var typesA = testsquare.types || [];
            var subtypesA = testsquare.subtypes || [];
            var synergy = 0;
            var rows = rowCheckList[i],
                elements = [];
            var childCount = 0;
            for (var k = 0; k < rows.length; k++) {
                elements = rowElements[rows[k]];
                childCount = 0;
                for (var m = 0; m < elements.length; m++) {
                    var testsquare2 = bingoBoard[elements[m]];
                    var typesB = testsquare2.types || [];
                    var subtypesB = testsquare2.subtypes || [];
                    if (typeof typesB != 'undefined') {
                        function matchArrays(arr1, arr2) {
                            for (var n = 0; n < arr1.length; n++) {
                                for (var p = 0; p < arr2.length; p++) {
                                    if (arr1[n] == arr2[p]) synergy++;
                                }
                            }
                        }
                        matchArrays(typesA, typesB);
                        matchArrays(typesA, subtypesB);
                        matchArrays(subtypesA, typesB);
                    }
                    if (bingoBoard[elements[m]].child == "yes") {
                        childCount++;
                    }
                }
                if (MODE == "short") {
                    if (testsquare.child == "no") {
                        childCount--;
                    }
                    if (childCount < 5) {
                        synergy += 3;
                    }
                } else {
                    if (testsquare.child == "yes") {
                        childCount++;
                    }
                    if (childCount > 4) {
                        synergy += 3;
                    }
                }
            }
            return synergy;
        }
    }
    var card;
    var iterations = 0;
    while (true) {
        iterations++;
        card = makeCard();
        if (card === false) {
            continue;
        } else {
            break;
        }
    }
    return card;
};
