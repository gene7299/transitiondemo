/**
* Xibo - Digital Signage - http://www.xibo.org.uk
* Copyright (C) 2009-2013 Daniel Garner
*
* This file is part of Xibo.
*
* Xibo is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* any later version.
*
* Xibo is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with Xibo.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
jQuery.fn.extend({xiboRender:function(e,t){console.log("[Xibo] Render");var n={type:"ticker",direction:"single",duration:"50",durationIsPerItem:false,numItems:0,takeItemsFrom:"start",itemsPerPage:0,scrollSpeed:"2",scaleMode:"scale"};var e=$.extend({},n,e);e.width=$(window).width();e.height=$(window).height();e.scaleFactor=Math.min(e.width/e.originalWidth,e.height/e.originalHeight);this.each(function(){console.log("[Xibo] Selected: "+this.tagName.toLowerCase());console.log("[Xibo] Options: "+JSON.stringify(e));if(e.type=="ticker"){console.log("[Xibo] Ticker");console.log("[Xibo] There are "+t.length+" items.");if(e.sourceid==undefined){console.error("Source ID undefined - assuming 1");e.sourceid=1}console.log("[Xibo] SourceId: "+e.sourceid);if(e.sourceid==1){if(e.takeItemsFrom=="end"){console.log("[Xibo] Reversing items");t.reverse()}console.log("[Xibo] Module requested "+e.numItems+" there are "+t.length+" in the array of items");if(e.numItems>t.length||e.numItems==0)e.numItems=t.length;e.items=t.slice(0,e.numItems);if(e.takeItemsFrom=="end"){console.log("[Xibo] Reversing items");t.reverse()}}else{e.numItems=t.length}}console.log("[Xibo] Putting "+e.numItems+" Items on the page");var n=e.numItems;var r=e.itemsPerPage>0?Math.ceil(e.numItems/e.itemsPerPage):e.numItems;var i=1;console.log("[Xibo] We need to have "+r+" pages");var s=this;for(var o=0;o<t.length;o++){if(e.direction=="single"&&e.itemsPerPage>0&&(i>=e.itemsPerPage||o==0)){s=$("<div/>").addClass("page").appendTo(this);i=0}$("<div/>").addClass("item").html(t[o]).appendTo(s);i++}if(e.scaleMode=="fit"){console.log("[Xibo] Applying jQuery FitText");$("*",this).css("font-size","");$(this).css({width:e.originalWidth,height:e.originalHeight}).fitText(1.75)}else if(e.scaleMode=="scale"){console.log("[Xibo] Applying CSS ZOOM");$(this).css({zoom:e.scaleFactor,width:e.originalWidth,height:e.originalHeight})}var u=false;if(e.direction=="single"){var a=e.itemsPerPage>0?"> .page":"> .item";var f=e.itemsPerPage>0?r:n;var l=e.durationIsPerItem?e.duration:e.duration/f;console.log("[Xibo] initialising the cycle2 plugin with "+f+" slides and selector "+a+". Duration per slide is "+l+" seconds.");$(this).cycle({fx:e.transition,timeout:l*1e3,slides:a})}else if(e.direction=="left"||e.direction=="right"){u=true;$(" .item",this).css({display:"inline","padding-left":"4px"});$(" .item p",this).css({display:"inline"})}else if(e.direction=="up"||e.direction=="down"){u=true}if(u){var c=$("<div/>").addClass("scroll").attr({scrollamount:e.scrollSpeed,scaleFactor:e.scaleFactor,behaviour:"scroll",direction:e.direction,height:e.originalHeight,width:e.originalWidth});$(this).wrapInner(c);$(this).find(".scroll").marquee()}})},dataSetRender:function(e){if(e===undefined||e===null){e={duration:5,transition:"fade"}}$(this).each(function(){var t=$(this).attr("totalPages");$(this).cycle({fx:e.transition,timeout:e.duration*1e3/t,slides:"> table"})})}});if(!window.console){(function(){var e=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"],t,n=e.length;window.console={};for(t=0;t<n;t++){window.console[e[t]]=function(){}}})()}
*/
jQuery.fn.extend(
    {
    xiboRender_rss:function(e,t)
        {
        console.log("[Xibo] Render");
        var n=
            {
            type:"ticker",direction:"single",duration:"50",durationIsPerItem:false,numItems:0,takeItemsFrom:"start",itemsPerPage:0,scrollSpeed:"2",scaleMode:"scale"
        };
        var e=$.extend(
            {
        }
        ,n,e);
        e.width=$(window).width();
        e.height=$(window).height();
        e.scaleFactor=Math.min(e.width/e.originalWidth,e.height/e.originalHeight);
        this.each(function()
            {
            console.log("[Xibo] Selected: "+this.tagName.toLowerCase());
            console.log("[Xibo] Options: "+JSON.stringify(e));
            if(e.type=="ticker")
                {
                console.log("[Xibo] Ticker");
                console.log("[Xibo] There are "+t.length+" items.");
                if(e.sourceid==undefined)
                    {
                    console.error("Source ID undefined - assuming 1");
                    e.sourceid=1
                }
                console.log("[Xibo] SourceId: "+e.sourceid);
                if(e.sourceid==1)
                    {
                    if(e.takeItemsFrom=="end")
                        {
                        console.log("[Xibo] Reversing items");
                        t.reverse()
                    }
                    console.log("[Xibo] Module requested "+e.numItems+" there are "+t.length+" in the array of items");
                    if(e.numItems>t.length||e.numItems==0)e.numItems=t.length;
                    e.items=t.slice(0,e.numItems);
                    if(e.takeItemsFrom=="end")
                        {
                        console.log("[Xibo] Reversing items");
                        t.reverse()
                    }
                }
                else
                    {
                    e.numItems=t.length
                }
            }
            console.log("[Xibo] Putting "+e.numItems+" Items on the page");
            var n=e.numItems;
            var r=e.itemsPerPage>0?Math.ceil(e.numItems/e.itemsPerPage):e.numItems;
            var i=1;
            console.log("[Xibo] We need to have "+r+" pages");
            var s=this;
            for(var o=0;
            o<t.length;
            o++)
                {
                if(e.direction=="single"&&e.itemsPerPage>0&&(i>=e.itemsPerPage||o==0))
                    {
                    s=$("<div/>").addClass("page").appendTo(this);
                    i=0
                }
                $("<div/>").addClass("item").html(t[o]).appendTo(s);
                i++
            }
            if(e.scaleMode=="fit")
                {
                console.log("[Xibo] Applying jQuery FitText");
                $("*",this).css("font-size","");
                $(this).css(
                    {
                    width:e.originalWidth,height:e.originalHeight
                }
                ).fitText(1.75)
            }
            else if(e.scaleMode=="scale")
                {
                console.log("[Xibo] Applying CSS ZOOM");
                $(this).css(
                    {
                    zoom:e.scaleFactor,width:e.originalWidth,height:e.originalHeight
                }
                )
            }
            var u=false;
            if(e.direction=="single")
                {
                var a=e.itemsPerPage>0?"> .page":"> .item";
                var f=e.itemsPerPage>0?r:n;
                var l=e.durationIsPerItem?e.duration:e.duration/f;
                console.log("[Xibo] initialising the cycle2 plugin with "+f+" slides and selector "+a+". Duration per slide is "+l+" seconds.");
                $(this).cycle(
                    {
                    fx:e.transition,timeout:l*1e3,slides:a
                }
                )
            }
            else if(e.direction=="left"||e.direction=="right")
                {
                u=true;
                $(" .item",this).css(
                    {
                    display:"inline","padding-left":"4px"
                }
                );
                $(" .item p",this).css(
                    {
                    display:"inline"
                }
                )
            }
            else if(e.direction=="up"||e.direction=="down")
                {
                u=true
            }
            if(u)
                {
                var c=$("<div/>").addClass("scroll").attr(
                    {
                    scrollamount:e.scrollSpeed,scaleFactor:e.scaleFactor,behaviour:"scroll",direction:e.direction,height:e.originalHeight,width:e.originalWidth
                }
                );
                $(this).wrapInner(c);
                $(this).find(".scroll").marquee()
            }
        }
        )
    }
    ,dataSetRender:function(e)
        {
        if(e===undefined||e===null)
            {
            e=
                {
                duration:5,transition:"fade"
            }
        }
        $(this).each(function()
            {
            var t=$(this).attr("totalPages");
            $(this).cycle(
                {
                fx:e.transition,timeout:e.duration*1e3/t,slides:"> table"
            }
            )
        }
        )
    }
}
);
if(!window.console)
    {
    (function()
        {
        var e=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"],t,n=e.length;
        window.console=
            {
        };
        for(t=0;
        t<n;
        t++)
            {
            window.console[e[t]]=function()
                {
            }
        }
    }
    )()
}
