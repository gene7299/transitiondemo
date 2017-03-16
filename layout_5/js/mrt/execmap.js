//ver 20160909
//use strict";
var DEF_SKIP_TRANS_TYPE = 2;
var DEF_SIMULATE_SPEED = 5000; //ms

var isNowStandby = false;
var setstandby = function(show) { //call by android
    if (show === true) {
        isNowStandby = true;
        $('.standby').animate({
            opacity: 1
        });
        $('.standby').removeClass('hide');
    } else {
        isNowStandby = false;
        $('.standby').animate({
            opacity: 0
        }, {
            complete: function() {
                $('.standby').addClass('hide');
            }
        });

    }
};

var _maprunner = function() {
    var handle = {};

    handle.mapjson = "";


    var hStringMarquee;

    var LineName = "";
    var LineName_EN = "";
    var LineColor = "#FF0000";

    var mapDirection = {};
    mapDirection[0] = 'down_toward'; //down-toward  (StationCode--)
    mapDirection[1] = 'up_toward'; // up-toward (stationCode++)

    var stationOrder = {};
    stationOrder[0] = "descend";
    stationOrder[1] = "ascend";
    var DEFINE_stationOrder = 0; //mappping to right
    var realrule = "";

    var runningState = {};
    runningState[0] = "runaway";
    runningState[1] = "stopready";

    var mapSide = {};
    mapSide["R"] = "L";
    mapSide["L"] = "R";

    var doorSide = {};
    doorSide["R"] = "R";
    doorSide["L"] = "L";

    var doorState = {};
    doorState[0] = "DoorClose";
    doorState[1] = "DoorOpen";

    var nowDirection;
    var nowSide;
    var last_runjson = "";

    var build = function() {

        DEFINE_stationOrder = handle.stationOrder;
        mapobj = JSON.parse(handle.mapjson);
        hStringMarquee = _stringmarquee();
        hStringMarquee();
        console.log('build object[]!!');
        return;

    };

    build.setLineInfo = function() {
        $('.val_thisline').css('background-color', LineColor);
        $('.val_thisline span').html(parseInt(LineName));
        $('.title_thisline').html(LineName.replace(parseInt(LineName), ''));
        $('.val_thislineEN').html(LineName_EN);
    };
    build.setStationInfo = function(startstop, endstop, direction, side) {
        var $val_fromstation = $('#mrt_depature_cn');
        var $val_fromstationEN = $('#mrt_depature_en');
        var $val_tostation = $('#mrt_destination_cn');
        var $val_tostationEN = $('#mrt_destination_en');

        var startStop_obj = objectFindByKey(stationobj, 'StationCode', startstop);
        var endStop_obj = objectFindByKey(stationobj, 'StationCode', endstop);
        $val_fromstation.html(startStop_obj.StationName);
        $val_fromstationEN.html(startStop_obj.StationName_EN);
        $val_tostation.html(endStop_obj.StationName);
        $val_tostationEN.html(endStop_obj.StationName_EN);

        var maxWidth = parseFloat($val_fromstation.parent().parent().css('width'));
        var maxWidthEN = parseFloat($val_fromstationEN.parent().parent().css('width'));
        if ($val_fromstation.textMetrics().width > maxWidth) {
            console.log("one stop name is too long ...(" + startStop_obj.StationName + ")");
            hStringMarquee.createMarqueeForString('mrt_depature_cn', maxWidth);
        }
        if ($val_fromstationEN.textMetrics().width > maxWidthEN) {
            console.log("one stop name is too long ...(" + startStop_obj.StationName_EN + ")");
            hStringMarquee.createMarqueeForString('mrt_depature_en', maxWidthEN);
        }

        var To_maxWidth = parseFloat($val_tostation.parent().parent().css('width'));
        var To_maxWidthEN = parseFloat($val_tostationEN.parent().parent().css('width'));
        if ($val_tostation.textMetrics().width > To_maxWidth) {
            console.log("one stop name is too long ...(" + endStop_obj.StationName + ")");
            hStringMarquee.createMarqueeForString('mrt_destination_cn', To_maxWidth);
        }
        if ($val_tostationEN.textMetrics().width > To_maxWidthEN) {
            console.log("one stop name is too long ...(" + endStop_obj.StationName_EN + ")");
            hStringMarquee.createMarqueeForString('mrt_destination_en', To_maxWidthEN);
        }

        $val_fromstation = null;
        $val_fromstationEN = null;
        $val_tostation = null;
        $val_tostationEN = null;
    };
    build.setNextStationInfo = function(state, nextStop) {
        var $val_nextstation = $('#mrt_next_cn');
        var $val_nextstationEN = $('#mrt_next_en');
        var nextStop_obj = objectFindByKey(stationobj, 'StationCode', nextStop);
        $val_nextstation.html(nextStop_obj.StationName);
        $val_nextstationEN.html(nextStop_obj.StationName_EN);

        var maxWidth = parseFloat($val_nextstation.parent().parent().css('width'));
        var maxWidthEN = parseFloat($val_nextstationEN.parent().parent().css('width'));
        if ($val_nextstation.textMetrics().width > maxWidth) {
            console.log("one stop name is too long ...(" + nextStop_obj.StationName + ")");
            hStringMarquee.createMarqueeForString('mrt_next_cn', maxWidth);
        }
        if ($val_nextstationEN.textMetrics().width > maxWidthEN) {
            console.log("one stop name is too long ...(" + nextStop_obj.StationName_EN + ")");
            hStringMarquee.createMarqueeForString('mrt_next_en', maxWidthEN);
        }
    };
    build.setNowStationInfo = function(state, nowStop) {
        var $val_nextstation = $('#mrt_current_cn');
        var $val_nextstationEN = $('#mrt_current_en');
        var nowStop_obj = objectFindByKey(stationobj, 'StationCode', nowStop);
        $val_nextstation.html(nowStop_obj.StationName);
        $val_nextstationEN.html(nowStop_obj.StationName_EN);
    };
    build.setNowNextStationInfo = function(state, nowStop) {
        var $val_nextstation = $('.val_nextstation');
        var $val_nextstationEN = $('.val_nextstationEN');
        var nowStop_obj = objectFindByKey(stationobj, 'StationCode', nowStop);
        $val_nextstation.html(nowStop_obj.StationName);
        $val_nextstationEN.html(nowStop_obj.StationName_EN);

        var $title_nextstation = $('.title_nextstation');
        var $title_nextstationEN = $('.title_nextstationEN');
        if (state == 'runaway') {
            $title_nextstation.html(txt_NextStation_CN);
            $title_nextstationEN.html(txt_NextStatoin_EN);
        } else {
            $title_nextstation.html(txt_THisStation_CN);
            $title_nextstationEN.html(txt_THisStation_EN);
        }

    };
    build.loadmap = function(stationCode1, stationCode2) {
            //parse mapjson
            console.log(mapobj);

            var lineobj1 = mapobj['L' + stationCode1 + stationCode2];
            var lineobj2 = mapobj['L' + stationCode2 + stationCode1];
            console.log("lineobj1 - L" + stationCode1 + stationCode2 + " = ");
            console.log(lineobj1);
            console.log("lineobj2 - L" + stationCode2 + stationCode1 + " = ");
            console.log(lineobj2);
            if (typeof lineobj1 !== 'undefined') {
                lineobj = lineobj1;
            }
            if (typeof lineobj2 !== 'undefined') {
                lineobj = lineobj2;
            }
            if (typeof lineobj1 !== 'undefined' && typeof lineobj2 !== 'undefined') {
                console.log("no any map is available");
                return false;
            }
            LineName = lineobj.LineName;
            LineName_EN = lineobj.LineName_EN;
            LineColor = lineobj.LineColor;
            stationobj = lineobj.Stations;
            /*
            if (init === false) {
                for (var i in stationobj) {
                    stationobj[i].StationName = stationobj[i].StationName + "車站";
                    stationobj[i].StationName_EN = stationobj[i].StationName_EN + " Station";
                }
                init = true;
            }
            */
            return true;
    };

    build.run = function(runjson) {
        //console.log("MAPHTML:" + runjson);
        if (last_runjson == runjson) {
            console.log("RUNED-" + last_runjson);
            return;
        }
        last_runjson = runjson;
        var runobj = JSON.parse(runjson);
        runobj.hexString = "";
        console.log(JSON.stringify(runobj));
        var start_stationCode = runobj.startingStation;
        var end_stationCode = runobj.terminalStation;
        var current_stationCode = runobj.currentStation;
        var next_stationCode = runobj.nextStation;
        var run_state = ((runobj.travelingState === true) ? 1 : 0);
        var run_direction = ((runobj.travelingDirection === true) ? 1 : 0);
        var run_side = mapSide[runobj.side];
        var door_side = doorSide[runobj.side];
        var leftDoor_state = ((runobj.leftDoor === true) ? 1 : 0);
        var rightDoor_state = ((runobj.rightDoor === true) ? 1 : 0);
        var run_stationStateArray = runobj.stationStopArray;
        var car_Number = runobj.carNumber;

        var misc_ipAddress = runobj.ipAddress;
        //var run_standby = ((runobj.StandBy === true) ? 1 : 0);
        if (run_direction != nowDirection || run_side != nowSide) {
            nowDirection = run_direction;
            nowSide = run_side;
            build.loadmap(start_stationCode, end_stationCode);
            if (nowSide == 'L') {
                $('.SIDE').each(function() {
                    $(this).attr('show', 'LEFTSIDE');
                });
            } else {
                $('.SIDE').each(function() {
                    $(this).attr('show', 'RIGHTSIDE');
                });
            }

            if (isNowStandby === false) {
                $('.standby').animate({
                    opacity: 0
                }, {
                    complete: function() {
                        $('.standby').addClass('hide');
                    }
                });
            }
        }
        hStringMarquee.stopAnimateStringMaquee();
        //$('.val_carnumber').html(car_Number + '车');
        //build.setSkipArray(run_stationStateArray, mapDirection[nowDirection], nowSide);
//(function() {        
        build.setStationInfo(start_stationCode, end_stationCode, mapDirection[run_direction], nowSide);
        build.drawNowMapRunning(current_stationCode, next_stationCode, mapDirection[run_direction], nowSide, runningState[run_state]);
        var currentSideDoorState = null;
        if (door_side == "R") {
            currentSideDoorState = doorState[rightDoor_state];
        } else if (door_side == "L") {
            currentSideDoorState = doorState[leftDoor_state];
        }
        if (currentSideDoorState == "DoorOpen") {
            if (runningState[run_state] === 'stopready') {
                //handle.doorhandle.showDoorOpen();
                //handle.doorhandle.startAnimateDoorsOpen();
            } else {
                //handle.doorhandle.showDoorOpen();
                //handle.doorhandle.stopAnimateDoorsOpen();
            }
        } else if (currentSideDoorState == "DoorClose") {
              //handle.doorhandle.showDoorClose();
        }
        hStringMarquee.startAnimateStringMaquee();
 //})();

    };
    build.drawNowMapRunning = function(current_stationCode, next_stationCode, direction, side, state) {

        var now_StationCode = '';
        var prev_StationCode = '';
        if (state == 'runaway') {
            prev_StationCode = current_stationCode;
            now_StationCode = next_stationCode;
        } else if (state == 'stopready') {
            prev_StationCode = current_stationCode;
            now_StationCode = current_stationCode;
        }
        //console.log("now_StationCode=" + now_StationCode);
        build.setNowStationInfo(state, current_stationCode);
        build.setNextStationInfo(state, next_stationCode);
        //console.log("now_StationIdx=" + now_StationIdx);
    };

    var dir = {};
    dir.up_toward = true;
    dir.down_toward = false;
    build.simulateRunning = function(side, direction) {


        //var side = "R";
        //var direction = "up_toward";

        var lineobj = mapobj[Object.keys(mapobj)[0]];
        var stationobj = lineobj.Stations;

        var runjson0 = getSimulateRunJson(stationobj[0].StationCode, stationobj[stationobj.length - 1].StationCode, stationobj[0].StationCode, stationobj[0].StationCode, false, direction, side);
        setjson(runjson0);
        _simulateRunning(side, direction);

        function getSimulateRunJson(start_stationcode, end_stationcode, current_stationcode, next_stationcode, state, direction, side) {
            return '{"startingStation":"' + start_stationcode + '","terminalStation":"' + end_stationcode + '","currentStation":"' + current_stationcode + '","nextStation":"' + next_stationcode + '","travelingState":' + state + ',"travelingDirection":' + dir[direction] + ',"side":"' + side + '","leftDoor":true,"rightDoor":true,"stationStopArray":["1","1","1","0","1","1","1","1","1","1","1","1","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],"carNumber":3,"StandBy":false}';
        }

        function _simulateRunning(side, direction) {
            var maparray = [];

            if (direction == "up_toward") {
                for (var i = 0, m = 0; i <= stationobj.length - 1; i++, m++) {
                    maparray[m] = stationobj[i].StationCode;
                }
            } else if (direction == "down_toward") {
                for (var j = stationobj.length - 1, n = 0; j >= 0; j--, n++) {
                    maparray[n] = stationobj[j].StationCode;
                }
            }
            var start_stationcode = maparray[0];
            var end_stationcode = maparray[maparray.length - 1];
            var nowIdx = 0;
            var state = true;
            var go = true;
            intervalrunning();

            function intervalrunning() {
                var current_stationcode = "";
                var next_stationcode = "";
                var nextIdx = nowIdx + 1;
                if (nextIdx > maparray.length - 1) {
                    nextIdx = maparray.length - 1;
                }
                if (state === true) {
                    next_stationcode = current_stationcode = maparray[nowIdx];
                } else {
                    current_stationcode = maparray[nowIdx];
                    next_stationcode = maparray[nextIdx];
                }
                var runjson = getSimulateRunJson(start_stationcode, end_stationcode, current_stationcode, next_stationcode, state, direction, side);
                setjson(runjson);
                if (state === false) { // run
                    nowIdx++;
                    if (nowIdx > maparray.length - 1) {
                        nowIdx = 0;
                    }
                    state = true;
                } else { // stopready
                    if (nowIdx + 1 > maparray.length - 1) {
                        nowIdx = 0;
                        state = true;
                        go = false;
                    }
                    state = false;
                }
                if (go === true) {
                    setTimeout(function() {
                        return intervalrunning();
                    }, DEF_SIMULATE_SPEED);

                } else {
                    var next_direction = "";
                    if (direction == "up_toward") {
                        next_direction = "down_toward";
                    } else {
                        next_direction = "up_toward";
                    }
                    setTimeout(function() {
                        return _simulateRunning(side, next_direction);
                    }, 5000);
                }

            }
        }


    };
    for (var i$ in handle) {
        fn$(i$);
    }
    return build;

    function fn$(it) {
        build[it] = function(v) {
            if (arguments.length === 0) {
                return handle[it];
            } else {
                handle[it] = v;
                return build;
            }
        };
    }
};

String.prototype.startsWith = function(prefix) {
    return (this.substr(0, prefix.length) === prefix);
}

String.prototype.endsWith = function(suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
}

String.prototype.contains = function(txt) {
    return (this.indexOf(txt) >= 0);
}

function d2h(d) {
    if (d < 16) {
        return "0" + d.toString(16).toUpperCase();
    } else {
        return d.toString(16).toUpperCase();;
    }
}

function objectFindByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}
