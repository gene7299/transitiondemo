
var doormaker1 = null;
var _doormaker = function(id) {
    //"use strict";
    var handle = {};
    handle.pagewidth = 3840;
    handle.pageheight = 1080;
    var isBuilt = false;
    var bCreateDoors = false;
    var deferredDelay1 = null;
    var deferredDelay2 = null;
    var open_bDoingAnimate = false;
    var bHas_open_bDoingAnimate = false;
    var bDoingDestory = false;

    var $door = $('#' + id);
    var $open_door_pic = $('#' + id).find('.open_door_pic');
    var $open_arrow_pic = $('#' + id).find('.open_arrow_pic');
    var $close_door_pic = $('#' + id).find('.close_door_pic');
    var $close_sign_pic = $('#' + id).find('.close_sign_pic');
    var $door_viewport = $('#' + id).parent();

    var $val_doorstatus = $('.val_doorstatus');
    var $val_doorstatusEN = $('.val_doorstatusEN');

    var viewport_width;
    var viewport_height;

    var door_leftdoor = "imgs/d_leftdoor.fw.png";
    var door_rightdoor = "imgs/d_leftdoor.fw.png";
    var door_leftarrow = "imgs/d_leftarrow.fw.png";
    var door_rightarrow = "imgs/d_rightarrow.fw.png";
    var door_closesign = "imgs/d_doorclosed.fw.png";

    var DEF_doorleft_width = (171);
    var DEF_doorleft_height = (381);
    var DEF_doorright_width = (171);
    var DEF_doorright_height = (381);
    var DEF_leftarrow_width = (142);
    var DEF_leftarrow_height = (139);
    var DEF_rightarrow_width = (142);
    var DEF_rightarrow_height = (139);
    var DEF_arrow_padding = (15);
    var DEF_closeSing_width = (238);
    var DEF_closeSing_height = (238);

    var DEF_doorleft_top = (14);
    var DEF_doorleft_left = (0);
    var DEF_leftarrow_top = (133);
    var DEF_dooropenSpeed = (900);
    var DEF_resetdooropenSpeed = (500);
    var DEF_delayDoorOpenTime = (300);

    var $open_leftdoor;
    var $open_rightdoor;
    var $open_leftarrow;
    var $open_rightarrow;
    var $close_leftdoor;
    var $close_rightdoor;
    var $door_closesign;

    var open_leftDoor_originLeft;
    var open_leftDoor_originTop;
    var open_rightDoor_originLeft;
    var open_rightDoor_originTop;
    var open_leftArrow_originLeft;
    var open_leftArrow_originTop;
    var open_rightArrow_originLeft;
    var open_rightArrow_originTop;

    var close_leftDoor_originLeft;
    var close_leftDoor_originTop;
    var close_rightDoor_originLeft;
    var close_rightDoor_originTop;
    var close_sign_originLeft;
    var close_sign_originTop;

    var open_leftDoor_toLeft;
    var open_rightDoor_toLeft;
    var open_leftArrow_toLeft;
    var open_rightArror_toLeft;


    var open_door_string = "此侧开门";
    var open_door_stringEN = "Doors open on this side";

    var close_door_string = "他侧开门";
    var close_door_stringEN = "Doors open on opposite side";
    //var close_door_stringEN = "Doors open on<br/> opposite side";

    var both_open_door_string = "双侧开门";
    var both_open_door_stringEN = "Doors open on both sides";

    function getw(w) {
        var image_design_base_width = 3840;
        return w * handle.pagewidth / image_design_base_width;
    }

    function geth(h) {
        var image_design_base_height = 1080;
        return h * handle.pageheight / image_design_base_height;
    }

    var build = function() {
        //parse mapjson
        StartHeartbeat();
        console.log('build door object[]!!');
        return;

    };

    function StartHeartbeat() {

        setInterval(function() {
            if (bCreateDoors === true && isBuilt === false) {
                //console.log("----------------->do _createDoors");
                //console.log("-------------------->bHas_open_bDoingAnimate="+bHas_open_bDoingAnimate);
                _createDoors();
                bDoingDestory = false;
                bHas_open_bDoingAnimate = false;
            }
            if (open_bDoingAnimate === true && bHas_open_bDoingAnimate === false) {
                //console.log("---------------------->do animateDoorsOpen()");
                build.animateDoorsOpen();
                bHas_open_bDoingAnimate = true;

            }
        }, 500);
    }

    function _createDoors() {
        if (isBuilt === false) {
            isBuilt = true;
            $open_door_pic = $('#' + id).find('.open_door_pic');
            $open_arrow_pic = $('#' + id).find('.open_arrow_pic');
            $close_door_pic = $('#' + id).find('.close_door_pic');
            $close_sign_pic = $('#' + id).find('.close_sign_pic');
            $door_viewport = $('#' + id).parent();
            build.drawThisDoorsOpen();
            build.drawThisDoorsClosed();
        }
    }
    build.createDoors = function() {
        bCreateDoors = true;
        //console.log("----------------->notify createDoors")
    };
    build.destoryDoors = function() {
        bDoingDestory = true;
        //console.log("--------X--------->wait destoryDoors")
        function checkStop() {
            var d = $.Deferred();
            _doCheck();

            function _doCheck() {
                //console.log("--------X--------->deferredDelay=");
                //console.log("--------X--------->"+deferredDelay1.state());
                //console.log("--------X--------->"+deferredDelay2.state());
                if (deferredDelay1.state() == 'resolved' && deferredDelay2.state() == 'resolved') {
                    d.resolve(null);
                } else {
                    setTimeout(function() {
                        _doCheck()
                    }, 100);
                }
            }
            return d.promise();
        }
        if (isBuilt === true) {
            var deferred = checkStop().done(function() {
                $open_door_pic.empty();
                $open_arrow_pic.empty();
                $close_door_pic.empty();
                $close_sign_pic.empty();
                isBuilt = false;
                //console.log("---------X-------->done destoryDoors")
            });
        }
    };
    build.drawThisDoorsOpen = function() {
        viewport_width = parseInt($door_viewport.css('width'));
        viewport_height = parseInt($door_viewport.css('height'));

        $open_door_pic.addClass('hide');
        $open_arrow_pic.addClass('hide');

        open_leftDoor_originLeft = 0.5 * (viewport_width) - getw(DEF_doorleft_width);
        open_leftDoor_originTop = 0.5 * (viewport_height - geth(DEF_doorleft_height));
        open_rightDoor_originLeft = 0.5 * (viewport_width);
        open_rightDoor_originTop = 0.5 * (viewport_height - geth(DEF_doorright_height));
        open_leftArrow_originLeft = (open_leftDoor_originLeft) - getw(DEF_leftarrow_width) - getw(DEF_arrow_padding); // 0.5*((leftDoor_originLeft) - getw(DEF_leftarrow_width))
        open_leftArrow_originTop = 0.5 * (viewport_height - geth(DEF_leftarrow_height));
        open_rightArrow_originLeft = open_rightDoor_originLeft + getw(DEF_doorleft_width) + getw(DEF_arrow_padding); //0.5*(viewport_width + rightDoor_originLeft + getw(DEF_doorleft_width) - getw(DEF_rightarrow_width));
        open_rightArrow_originTop = 0.5 * (viewport_height - geth(DEF_rightarrow_height));

        open_leftDoor_toLeft = open_leftDoor_originLeft - getw(DEF_doorleft_width);
        open_rightDoor_toLeft = open_rightDoor_originLeft + getw(DEF_doorright_width);
        open_leftArrow_toLeft = open_leftArrow_originLeft - getw(DEF_doorleft_width);
        open_rightArror_toLeft = open_rightArrow_originLeft + getw(DEF_doorright_width);

        $open_leftdoor = $('<img/>', {
            id: id + '_doorleft',
            src: door_leftdoor,
            class: 'doors1'
        }).css({
            width: getw(DEF_doorleft_width) + "px",
            height: getw(DEF_doorleft_height) + "px",
            left: (open_leftDoor_originLeft) + "px",
            top: (open_leftDoor_originTop) + "px",
            'z-index': 10
        }).appendTo($open_door_pic);

        $open_rightdoor = $('<img/>', {
            id: id + '_doorright',
            src: door_rightdoor,
            class: 'doors1'
        }).css({
            width: getw(DEF_doorright_width) + "px",
            height: getw(DEF_doorright_height) + "px",
            left: (open_rightDoor_originLeft) + "px",
            top: (open_rightDoor_originTop) + "px",
            'z-index': 10
        }).appendTo($open_door_pic);

        $open_leftarrow = $('<img/>', {
            id: id + '_arrowleft',
            src: door_leftarrow,
            class: 'doors1'
        }).css({
            width: getw(DEF_leftarrow_width) + "px",
            height: getw(DEF_leftarrow_height) + "px",
            left: (open_leftArrow_originLeft) + "px",
            top: (open_leftArrow_originTop) + "px",
            'z-index': 10
        }).appendTo($open_arrow_pic);

        $open_rightarrow = $('<img/>', {
            id: id + '_arrowright',
            src: door_rightarrow,
            class: 'doors1'
        }).css({
            width: getw(DEF_rightarrow_width) + "px",
            height: getw(DEF_rightarrow_height) + "px",
            left: (open_rightArrow_originLeft) + "px",
            top: (open_rightArrow_originTop) + "px",
            'z-index': 10
        }).appendTo($open_arrow_pic);
    };
    build.showDoorOpen = function(both) {
        //console.log("isBuilt="+isBuilt);
        $open_door_pic.removeClass('hide');
        $open_arrow_pic.removeClass('hide');
        $close_door_pic.addClass('hide');
        $close_sign_pic.addClass('hide');
        $val_doorstatus.html(open_door_string);
        $val_doorstatusEN.html(open_door_stringEN);
        if(isBuilt === false){
          setTimeout(function(){build.showDoorOpen();},1000);
        }
    };
    build.showDoorClose = function() {
        //console.log("isBuilt="+isBuilt);
        $open_door_pic.addClass('hide');
        $open_arrow_pic.addClass('hide');
        $close_door_pic.removeClass('hide');
        $close_sign_pic.removeClass('hide');
        $val_doorstatus.html(close_door_string);
        $val_doorstatusEN.html(close_door_stringEN);
        if(isBuilt === false){
          setTimeout(function(){build.showDoorClose();},1000);
        }
    };

    build.animateDoorsOpen = function() {
        build.showDoorOpen();

        var sleep = function(t) {
            var d = $.Deferred();
            setTimeout(function() {
                d.resolve(null);
            }, t);
            return d.promise();
        };

        function delayDoorsOpenningAnimation() {
            //console.log("---------------------->do delayDoorsOpenningAnimation start");
            $open_leftdoor.css('left', open_leftDoor_originLeft + "px");
            $open_rightdoor.css('left', open_rightDoor_originLeft + "px");
            $open_leftarrow.css('left', open_leftArrow_originLeft + "px");
            $open_rightarrow.css('left', open_rightArrow_originLeft + "px");
            $open_leftdoor.css('opacity', 0.5);
            $open_rightdoor.css('opacity', 0.5);
            $open_leftarrow.css('opacity', 1);
            $open_rightarrow.css('opacity', 1);

            deferredDelay1 = $.when(
                $open_leftdoor.animate({
                    'opacity': 1
                }, DEF_resetdooropenSpeed, "easeOutCubic").promise(),
                $open_rightdoor.animate({
                    'opacity': 1
                }, DEF_resetdooropenSpeed, "easeOutCubic").promise()
            ).then(function() {
                //console.log("---------------------->deferredDelay1a=");
                //console.log("---------------------->"+deferredDelay1.state());
                return sleep(DEF_delayDoorOpenTime);
            }).done(function() {
                if (open_bDoingAnimate === true) {
                    if (bDoingDestory === false) {
                        bHas_open_bDoingAnimate = true;
                        return doDoorsOpenningAnimation();
                    }
                } else {
                    bHas_open_bDoingAnimate = false;
                }
                return;
            });

        }

        function doDoorsOpenningAnimation() {
            //console.log("---------------------->do doDoorsOpenningAnimation start");

            deferredDelay2 = $.when(
                $open_leftdoor.animate({
                    'left': (open_leftDoor_toLeft) + "px",
                    'opacity': 0
                }, DEF_dooropenSpeed, "easeOutCubic").promise(),
                $open_rightdoor.animate({
                    'left': (open_rightDoor_toLeft) + "px",
                    'opacity': 0
                }, DEF_dooropenSpeed, "easeOutCubic").promise(),
                $open_leftarrow.animate({
                    'left': (open_leftArrow_toLeft) + "px",
                    'opacity': 0
                }, DEF_dooropenSpeed, "easeOutCubic").promise(),
                $open_rightarrow.animate({
                    'left': (open_rightArror_toLeft) + "px",
                    'opacity': 0
                }, DEF_dooropenSpeed, "easeOutCubic").promise()
            ).done(function() {
                //console.log("Both animations complete");
                //console.log("---------------------->deferredDelay2a=");
                //console.log("---------------------->"+deferredDelay2.state());
                if (bDoingDestory === false) {
                    return delayDoorsOpenningAnimation();
                }
                return;
            });

        }

        $('.val_doorstatus').addClass('doorstatus_blink');
        $('.val_doorstatusEN').addClass('doorstatus_blink');
        doDoorsOpenningAnimation();


    };
    build.startAnimateDoorsOpen = function() {
        //console.log("--------------->build.startAnimateDoorsOpen()");
        open_bDoingAnimate = true;
    };
    build.stopAnimateDoorsOpen = function() {
        $('.val_doorstatus').removeClass('doorstatus_blink');
        $('.val_doorstatusEN').removeClass('doorstatus_blink');
        open_bDoingAnimate = false;
    };
    build.drawThisDoorsClosed = function() {

        $close_door_pic.addClass('hide');
        $close_sign_pic.addClass('hide');

        close_leftDoor_originLeft = 0.5 * (viewport_width) - getw(DEF_doorleft_width);
        close_leftDoor_originTop = 0.5 * (viewport_height - geth(DEF_doorleft_height));
        close_rightDoor_originLeft = 0.5 * (viewport_width);
        close_rightDoor_originTop = 0.5 * (viewport_height - geth(DEF_doorright_height));

        close_sign_originLeft = 0.5 * (viewport_width - geth(DEF_closeSing_width));
        close_sign_originTop = 0.5 * (viewport_height - geth(DEF_closeSing_height));


        $close_leftdoor = $('<img/>', {
            id: id + '_doorleft',
            src: door_leftdoor,
            class: 'doors1'
        }).css({
            width: getw(DEF_doorleft_width) + "px",
            height: getw(DEF_doorleft_height) + "px",
            left: (close_leftDoor_originLeft) + "px",
            top: (close_leftDoor_originTop) + "px",
            'z-index': 10
        }).appendTo($close_door_pic);

        $close_rightdoor = $('<img/>', {
            id: id + '_doorright',
            src: door_rightdoor,
            class: 'doors1'
        }).css({
            width: getw(DEF_doorright_width) + "px",
            height: getw(DEF_doorright_height) + "px",
            left: (close_rightDoor_originLeft) + "px",
            top: (close_rightDoor_originTop) + "px",
            'z-index': 10
        }).appendTo($close_door_pic);

        $door_closesign = $('<img/>', {
            id: id + '_doorright',
            src: door_closesign,
            class: 'doors1'
        }).css({
            width: getw(DEF_closeSing_width) + "px",
            height: getw(DEF_closeSing_height) + "px",
            left: (close_sign_originLeft) + "px",
            top: (close_sign_originTop) + "px",
            'z-index': 10
        }).appendTo($close_sign_pic);
    };

    build.animateDoorsClosed = function() {

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
