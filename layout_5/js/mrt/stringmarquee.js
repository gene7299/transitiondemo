
var _stringmarquee = function() {
    //"use strict";
    var handle = {};
    var DEF_SPEED = 2000;
    var DEF_SPEED_NEXT = 2000;
    var DELAY_SPEED = 2000;
   
    var bDoingAnimate = false;
    var bHas_DoingAnimate = false;
    var bStopAnimate = false;
    var bHasStopAnimate = true;
    var marqueeArray = [];
    var idx = 0;

    var build = function() {
        StartHeartbeat();
        return;

    };

    function StartHeartbeat() {

        setInterval(function() {
            if (bStopAnimate === true && bHas_DoingAnimate === true && bHasStopAnimate === true) {
                bHas_DoingAnimate = false;
                bStopAnimate = false;
            }
            if (bStopAnimate === false && bDoingAnimate === true && bHas_DoingAnimate === false) {
                build.animateStringMaquee();
                bHas_DoingAnimate = true;
            }
        }, 500);
    }
    build.createMarqueeForString = function(id, max) {
        //console.log("------------------------->build.createMarqueeForString");
        var real = $('#' + id).textMetrics().width;
        var obj = {};
        obj.id = id;
        obj.max = max;
        obj.real = real;
        marqueeArray[idx] = obj;
        idx++;
    };
    build.animateStringMaquee = function() {
        //console.log("------------------------->build.animateStringMaquee");
        //console.log('idx='+idx);
        //console.log(marqueeArray);
        var execForwardArray = [];
        var execBackwardArray = [];

        var sleep = function(t) {
            var d = $.Deferred();
            setTimeout(function() {
                d.resolve(null);
            }, t);
            return d.promise();
        };
        var _execForward = function(id, max, real) {
            var d = $.Deferred();
            var $string = $('#' + id + "");
            $string.animate({
                'margin-left': (max - real) * 1.1 + 'px'
            }, DEF_SPEED, function() {
                d.resolve(null);
            });
            return d.promise();
        };
        var _execBackward = function(id) {
            var d = $.Deferred();
            var $string = $('#' + id + "");
            $string.animate({
                'margin-left': 0 + 'px'
            }, DEF_SPEED, function() {
                d.resolve(null);
            });
            return d.promise();
        };
        for (var id = 0; id < marqueeArray.length; id++) {
            var one = marqueeArray[id];
            execForwardArray.push(
                function() {
                    return _execForward(this.id, this.max, this.real);
                }.bind(one)
            );
            execBackwardArray.push(
                function() {
                    return _execBackward(this.id);
                }.bind(one)
            );
        }

        function forwardstring() {
            var deferred = $.when.all(execForwardArray)
                .then(function() {
                    if (bStopAnimate === true) {
                        //console.log("<---------------stop 1------------------>")
                        bHasStopAnimate = true;
                        return;
                    }
                    return sleep(DELAY_SPEED);
                }).done(function() {
                    if (bStopAnimate === true) {
                        //console.log("<---------------stop 2------------------>")
                        bHasStopAnimate = true;
                        return;
                    }
                    return backwardstring();
                });
        }

        function backwardstring() {
            var deferred = $.when.all(execBackwardArray)
                .then(function() {
                    //console.log('bStopAnimate=' + bStopAnimate)
                    if (bStopAnimate === true) {
                        //console.log("<---------------stop 3------------------>")
                        bHasStopAnimate = true;
                        return;
                    }
                    return sleep(DELAY_SPEED);
                }).done(function() {
                    if (bStopAnimate === true) {
                        //console.log("<---------------stop 4------------------>")
                        bHasStopAnimate = true;
                        return;
                    }
                    return forwardstring();
                });

        }
        backwardstring();
    }
    build.startAnimateStringMaquee = function() {
        //console.log("------------------------->build.startAnimateStringMaquee");
        bDoingAnimate = true;
        bHasStopAnimate = false;
    };
    build.stopAnimateStringMaquee = function() {
        //console.log("------------------------->build.stopAnimateStringMaquee");
        bHasStopAnimate = false;
        bDoingAnimate = false;
        if (bHas_DoingAnimate === true) {
            //console.log("------------------------->bStopAnimate  bStopAnimate bStopAnimate");
            bStopAnimate = true;
        }
        build.clearAllMarquee();
    };
    build.clearAllMarquee = function() {
        //console.log("------------------------->build.clearAllMarquee");
        for(var i in marqueeArray){
          marqueeArray[i] = null;
        }
        marqueeArray = [];
        idx = 0;
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
if (jQuery.when.all === undefined) {
    jQuery.when.all = function(array) {
        var deferred = $.Deferred();
        var fulfilled = 0,
            length = array.length;
        var results = [];

        if (length === 0) {
            deferred.resolve(results);
        } else {
            array.forEach(function(promise, i) {
                $.when(promise()).then(function(value) {
                    results[i] = value;
                    fulfilled++;
                    if (fulfilled === length) {
                        deferred.resolve(results);
                    }
                });
            });
        }
        return deferred.promise();
    }
}
