! function() {

	var breakingNewsArrayList = [];
	$.fn.resetBreakingNews = function(){
		console.log("resetBreakingNews the breakingnews & rss");
		//console.log($(this).attr("id"));
		//console.log(breakingNewsArrayList);
		var resetfun = breakingNewsArrayList[$(this).attr("id")].reset;
		var xthis =  breakingNewsArrayList[$(this).attr("id")];
		//console.log("xthis=")
		//console.log(xthis)
		resetfun(xthis);
	}
	$.fn.breakingNews = function(bn_options) {
		var option = {
			width: "95%",
			modul: "breakingnews",
			color: "default",
			ttstyle: "triangle",
			border: 1,
			effect: "fade",
			fontstyle: "normal",
			autoplay: !1,
			timer: 4e3,
			feed: !1, //feed		:"http://feeds.bbci.co.uk/news/business/rss.xml;;http://rss.cnn.com/rss/edition.rss
			feedlabels: !1, //feedlabels	:"BBC News,CNN News",
			feedcount: 5,
			rmode: "normal",
			borderwidth: 0,
			ulLeft:0,
			liLeft:0,
			liWidth:0,
		}, rssList = [],
			labelList = [],
			bn_options = $.extend(option, bn_options);
			var l = bn_options;

			l.borderwidth = parseFloat(this.parent().css('border-width'));
			if(l.borderwidth == undefined || l.borderwidth == 'undefined' || isNaN(l.borderwidth)==true || l.borderwidth=="")
			{
				l.borderwidth = parseFloat(this.parent().css('border-top-width'));
			}
			console.log("l.borderwidth="+l.borderwidth)
			var thresholdRadius = parseFloat(this.height())/3;
			var bigRadius = false;
			if(parseFloat(this.parent().css('border-top-left-radius'))>thresholdRadius)
			{
				bigRadius = true;
			}
			if(this.parent().width() > 2*l.borderwidth && !$(this).find(".bn-title").hasClass('forceHide')  && ( l.ttstyle == "round" || bigRadius == true ) )
			{
				l.rmode = "round";
				if(l.ttstyle == "round"){$(this).find(".bn-title a").html("&nbsp;"+$(this).find(".bn-title a").html()+"&nbsp;");}else{$(this).find(".bn-title a").html("&nbsp;"+$(this).find(".bn-title a").html());}
				this.parent().css('width',(this.parent().width()+2*l.borderwidth)+'px')
				var parentBorderWidth = parseFloat(this.parent().css('border-top-width'));
				var newHeight = this.parent().height()+parentBorderWidth*2;
				this.parent().css('height',(newHeight)+'px');
				//this.css('height',(newHeight)+'px');
				var parentBorderRadius = this.parent().css('border-top-left-radius');
				if(l.ttstyle == "round"){parentBorderRadius = this.height()}

				var parentBorderColor = this.parent().attr('frame');
				if(parentBorderColor.indexOf('rgba(')==0)
				{
					parentBorderColor = parentBorderColor.replace(/[\d\.]+\)$/g, '1)');
					this.parent().css('border-color',parentBorderColor);
				}
				var parentBgColor = this.parent().css('background-color');
				this.parent().css('border-radius','0px');
				this.parent().css('border-width','0px');
				this.parent().css('background-color','transparent');
				$(this).find("ul").css('background-color',parentBgColor);
				$(this).find("ul").css('border-left-width','0px');
				$(this).find("ul").css('border-top-width',parentBorderWidth);
				$(this).find("ul").css('border-right-width',parentBorderWidth);
				$(this).find("ul").css('border-bottom-width',parentBorderWidth);
				$(this).find("ul").css('border-color',parentBorderColor);
				$(this).find("ul").css('border-style','solid');
				$(this).find("ul").css('height',(parseFloat($(this).find("ul").css('height'))-2*parseFloat(parentBorderWidth))+'px');
				$(this).find("ul").css('line-height',(parseFloat($(this).find("ul").css('height')))+'px');
				$(this).find("ul").css('border-top-right-radius',parseFloat(parentBorderRadius)+3*parseFloat(parentBorderWidth));
				$(this).find("ul").css('border-bottom-right-radius',parseFloat(parentBorderRadius)+3*parseFloat(parentBorderWidth));
				if( l.ttstyle == "round") {
					//this.parent().css('border-radius',this.height());
					$(this).find(".bn-title").css('border-radius',this.height());
				}else
				{
					this.parent().css('border-radius',this.height());
				}
			}else if( l.ttstyle == "round" ) {
					this.parent().css('border-radius',this.height());
					//$(this).find(".bn-title").css('border-radius',this.height());
			}
			if(parseFloat(this.parent().css('border-radius'))>0 && l.ttstyle != "round"){
				$(this).find(".bn-title").css('border-top-left-radius',parseFloat(this.parent().css('border-radius'))-parseFloat(l.borderwidth));
				$(this).find(".bn-title").css('border-bottom-left-radius',parseFloat(this.parent().css('border-radius'))-parseFloat(l.borderwidth));
			}
			this.css('line-height',this.height()+"px");
			var lineHeight = this.height();
			var triangle = Math.ceil(this.height()/4) + "px";
			if(l.ttstyle == "triangle")
			{
				$(this).find(".bn-title span").css('right',"-"+triangle);
				$(this).find(".bn-title span").css('top',triangle);
				$(this).find(".bn-title span").css('border-top-width',triangle);
				$(this).find(".bn-title span").css('border-bottom-width',triangle);
				$(this).find(".bn-title span").css('border-left-width',triangle);
			}else if(l.ttstyle == "peak")
			{
				$(this).find(".bn-title span").css('right',"-"+(Math.floor(this.height()/2)));
				$(this).find(".bn-title span").css('top',0);
				$(this).find(".bn-title span").css('border-top-width',this.height()/2);
				$(this).find(".bn-title span").css('border-bottom-width',this.height()/2);
				$(this).find(".bn-title span").css('border-left-width',this.height()/2);
			}else
			{
				$(this).find(".bn-title span").addClass('forceHide');
			}



			var titlebgcolor = this.parent().css('border-color');//$(this).attr('frameColor');
			if(titlebgcolor==undefined || titlebgcolor=="undefined" || titlebgcolor=="") // for firefox
			{
				titlebgcolor = $(this).attr('frameColor');
			}
			if(titlebgcolor!=undefined && titlebgcolor!=null && titlebgcolor!='undefined' && titlebgcolor!="")
			{
				$(this).find(".bn-title").css('background-color',titlebgcolor);
				$(this).find(".bn-title span").css('border-left-color',titlebgcolor); // for triangle
			}

			var temp = $(this);
			var ttitle = $(this).find(".bn-title");
			if(temp.attr("fontFamily")!=undefined){ttitle.css('font-family',temp.attr("fontFamily"));}
			if(temp.attr("RE_fontSize")!=undefined){ttitle.css('font-size',temp.attr("RE_fontSize")*1.25);}
			ttitle.css('font-size',parseFloat(ttitle.css("font-size"))*1.25+"px");
			if(temp.attr("titleFontColor")!=undefined){ttitle.find('a').css('color',temp.attr("titleFontColor"));}
			if(temp.attr("fontStyle")!=undefined){ttitle.css('font-style',temp.attr("fontStyle"));}//italic
			if(temp.attr("fontWeight")!=undefined){ttitle.find('a').css('font-weight',temp.attr("fontWeight"));}else{ttitle.find('a').css('font-weight','bold');}//bold
			//ttitle.find('a').css('font-weight','bold');  //<------------------------[BOLD]
			if(temp.attr("textDecoration")!=undefined && temp.attr("textDecoration")!="normal"){ttitle.find('a').css('text-decoration',temp.attr("textDecoration"));}//underline

			//console.log('bn-title width = '+ $(this).find(".bn-title").width());
			//var ulLeft = 0;
			$(this).find("ul").css('overflow','hidden');
			//$(this).find("ul").css('left',ulLeft+'px');
			$(this).find(".bn-title").css('z-index',parseInt($(this).css('z-index'))+1);
			var tul = $(this).find("ul");
			if(temp.attr("fontFamily")!=undefined){tul.css('font-family',temp.attr("fontFamily"));}
			if(temp.attr("RE_fontSize")!=undefined){tul.css('font-size',temp.attr("RE_fontSize"));}
			if(temp.attr("fontColor")!=undefined){tul.css('color',temp.attr("fontColor"));}
			if(temp.attr("fontStyle")!=undefined){tul.css('font-style',temp.attr("fontStyle"));}//italic
			if(temp.attr("fontWeight")!=undefined){tul.css('font-weight',temp.attr("fontWeight"));}else{tul.css('font-weight','bold');}//bold
			if(temp.attr("textDecoration")!=undefined && temp.attr("textDecoration")!="normal"){tul.find('a').css('text-decoration',temp.attr("textDecoration"));}//underline

			if(this.parent().width()<2*l.borderwidth)
			{
				$(this).find(".bn-title").addClass('forceHide');
				$(this).find("ul").addClass('forceHide');
			}
			function stylish() {
				l.modul.find("ul li").first().css("display","list-item");
				if("slide-h" == l.effect){ l.modul.addClass('bn-slide-h'); }

				if(l.modul.attr("fontColor")!=undefined){l.modul.find("ul li a").css("color",l.modul.attr("fontColor"))};
				if(l.modul.attr("fontWeight")!=undefined){l.modul.find("ul li a").css("font-weight",l.modul.attr("fontWeight"))};
				//l.modul.find("ul li a").css("font-weight","bold"); //<------------------------[BOLD]
				if(l.modul.attr("textDecoration")!=undefined && l.modul.attr("textDecoration")!="normal"){l.modul.find("ul li a").css("text-decoration",l.modul.attr("textDecoration"))};

				//var ulLeft = 0;
				//var liLeft = 0;
				//var liLeft_hide = 0;
				console.log("======>l.effect="+l.effect);
				console.log("======>l.rmode="+l.rmode);
				console.log("======>l.ttstyle="+l.ttstyle);
				if(l.rmode == 'round') //A
				{
					if("slide-h" == l.effect) //A
					{
						if(l.ttstyle == 'round')
						{
							console.log("[A A 1]");
							l.ulLeft = $(l.modul).find(".bn-title").width()-2*parseFloat(triangle);
							l.liLeft = parseFloat(triangle)*3;
							if(l.ulLeft<$(l.modul).find(".bn-title").width()/2){l.ulLeft = $(l.modul).find(".bn-title").width()/2; l.liLeft = $(l.modul).find(".bn-title").width()/2+parseFloat(triangle) }

						}else if(l.ttstyle == 'triangle')
						{
							console.log("[A A 2]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*2;
						}else if(l.ttstyle == 'peak')
						{
							console.log("[A A 3]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*3;
						}else{
							console.log("[A A 4]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle);
						}

					}else{ //B
						if(l.ttstyle == 'round')
						{
							console.log("[A B 1]");
							l.ulLeft = $(l.modul).find(".bn-title").width()-2*parseFloat(triangle);
							l.liLeft = parseFloat(triangle)*3;
							if(l.ulLeft<$(l.modul).find(".bn-title").width()/2){l.ulLeft = $(l.modul).find(".bn-title").width()/2; l.liLeft = $(l.modul).find(".bn-title").width()/2+parseFloat(triangle) }

						}else if(l.ttstyle == 'triangle')
						{
							console.log("[A B 2]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*2;
						}else if(l.ttstyle == 'peak')
						{
							console.log("[A B 3]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*3;
						}else{
							console.log("[A B 4]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*1;
						}
					}
				}else  //B
				{
					if("slide-h" == l.effect)//A
					{
						if($(l.modul).find(".bn-title").hasClass('forceHide'))
						{
							console.log("[B A 0]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*2;
						}else
						if(l.ttstyle == 'round')
						{
							console.log("[B A 1]");
							//XXXX no title
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*2;
						}else if(l.ttstyle == 'triangle')
						{
							console.log("[B A 2]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*2;
						}else if(l.ttstyle == 'peak')
						{
							console.log("[B A 3]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*3;
						}else{
							console.log("[B A 4]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle);

						}
					}else{ //B

						if($(l.modul).find(".bn-title").hasClass('forceHide'))
						{
							console.log("[B B 0]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*2;
						}else
						if(l.ttstyle == 'round')
						{
							console.log("[B B 1]");
							//XXXX no title
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*2;
						}else if(l.ttstyle == 'triangle')
						{
							console.log("[B B 2]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*2;
						}else if(l.ttstyle == 'peak')
						{
							console.log("[B B 3]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*3;
						}else{
							console.log("[B B 4]");
							l.ulLeft = $(l.modul).find(".bn-title").width();
							l.liLeft = parseFloat(triangle)*1;
						}
					}
				}
				l.liWidth = l.modul.parent().width() - l.ulLeft - l.liLeft;
				console.log("l.ulLeft = "+l.ulLeft);
				console.log("l.liLeft = "+l.liLeft);
				console.log("liWidth="+l.liWidth);
				l.modul.find("ul").css('left',l.ulLeft+'px');
				l.modul.find("ul").css('width', l.modul.parent().width() - l.ulLeft - l.borderwidth  +'px');
				if("slide-h" == l.effect)
				{
					l.modul.find("ul li").each(function(){$(this).css("left",'-'+l.liWidth+'px')});
					l.modul.find("ul li").first().css("left",l.liLeft+'px');
				}else
				{
					l.modul.find("ul li").each(function(){$(this).css("left",l.liLeft+'px')});
				}
				l.modul.find("ul li").each(function(){$(this).css("width",l.liWidth+'px');});

				//console.log(l.modul.find("ul li"));
				/*
				l.modul.width() < 480 ? (l.modul.find(".bn-title h2").css({
					display: "none"
				}), l.modul.find(".bn-title").css({
					width: 10
				}), l.modul.find("ul").css({
					left: 30
				})) : (l.modul.find(".bn-title h2").css({
					display: "inline-block"
				}), l.modul.find(".bn-title").css({
					width: "auto"
				}), l.modul.find("ul").css({
					left: $(l.modul).find(".bn-title").width() + 30
				}))
				*/

				if("slide-v" == l.effect){l.modul.find("ul li").first().css("top","0px");}
				if("slide-h" == l.effect){l.modul.find("ul li").each(function(){$(this).removeClass('bn-slide-h-hide');});};
			}
			function nextItem() {
				if(notOnClick==1)
				{
					//console.log("---------->play next item   ");
					now++, now == len && (now = 0), (len>1) && doAnimation()
				}
			}
			function doAnimation() {

				if(doing == true)
				{
					console.log("is doing!!!");
					prev = now;
					return;
				}
				doing = true;
				//console.log('prev='+prev);
				//console.log('now='+now);
				var preItemId = l.modul.find("ul li").eq(prev).attr('id');
				var nowItemId = l.modul.find("ul li").eq(now).attr('id');

				if("fade" == l.effect)
				{
					l.modul.find("ul li").css({
						display: "none"
					});
					l.modul.find("ul li").each(function(){
						$(this).css("display","none");
					});
					l.modul.find("ul li").eq(now).fadeIn("normal", function() {
						prev = now, notOnClick = !0, doing = false
					})
				}else if("typing-fast" == l.effect)
				{

					l.modul.find("ul li").each(function(){
						if($(this).attr('id')!=preItemId && $(this).attr('id')!=nowItemId){
							$(this).css("display","none");
							//$(this).css("width","100%");
							$(this).css("width",l.liWidth+'px');
						}
					});

					l.modul.find("ul li").eq(prev).animate({
						width: 0
					}, function() {
						$(this).css({
							display: "none",
							width: l.liWidth//"100%"
						}), l.modul.find("ul li").eq(now).css({
							width: 0,
							display: "block"
						}), l.modul.find("ul li").eq(now).animate({
							width: l.liWidth//"100%"
						}, function() {
							notOnClick = !0, prev = now, doing = false
						})
					})
				}else if("slide-v" == l.effect)
				{

					l.modul.find("ul li").each(function(){
						if($(this).attr('id')!=preItemId && $(this).attr('id')!=nowItemId){
							$(this).css("top",lineHeight+'px');
							$(this).css("display","block");
						}
					});

					(now >= prev ?

					(l.modul.find("ul li").eq(prev).animate({
						top: "-" + lineHeight + "px",
					}), l.modul.find("ul li").eq(now).css({
						top: lineHeight + "px",
						display: "block"
					}), l.modul.find("ul li").eq(now).animate({
						top: 0
					}, function() {
						prev = now, notOnClick = !0, doing = false
					}))

					:

					(l.modul.find("ul li").eq(prev).animate({
						top: lineHeight + "px",
					}), l.modul.find("ul li").eq(now).css({
						top: "-" + lineHeight + "px",
						display: "block"
					}), l.modul.find("ul li").eq(now).animate({
						top: 0
					}, function() {
						prev = now, notOnClick = !0, doing = false
					})))
				}else if("slide-h" == l.effect)
				{
					l.modul.find("ul li").each(function(){
						if($(this).attr('id')!=preItemId && $(this).attr('id')!=nowItemId){
							$(this).css("left", "-" + l.liWidth + "px");
						}
					});

					//(now >= prev ?
					( true ?

					(l.modul.find("ul li").eq(prev).animate({
						left: "-" + (l.liWidth)*2
					}), l.modul.find("ul li").eq(now).css({
						left: l.liWidth,
					}), l.modul.find("ul li").eq(now).animate({
						left: l.liLeft,
					}, function() {
						prev = now, notOnClick = !0, doing = false
					}))

					:

					(l.modul.find("ul li").eq(prev).animate({
						left: l.liWidth
					}), l.modul.find("ul li").eq(now).css({
						left: "-" + (l.liWidth)*2
					}), l.modul.find("ul li").eq(now).animate({
						left: l.liLeft,
					}, function() {
						prev = now, notOnClick = !0, doing = false
					}))

					)

					/* Another way
					//.bn-slide-h>ul>li{position:static;float: left;display: inline;width: auto;}
					(now == 0 ?

						(l.modul.find("ul").animate({
							left: ($(l.modul).find(".bn-title").width() + 30)
						}, function() {
							prev = now, notOnClick = !0
						}) )
					:
						(l.modul.find("ul").animate({
							left: "-" + (l.modul.find("ul li").eq(now).position().left - ($(l.modul).find(".bn-title").width() + 30))
						}, function() {
							prev = now, notOnClick = !0
						}))
					)
					*/

				}

			}
			var totalyqlcount = 0;
			function yql(url,b,feedcount,out){
			 return 'http://query.yahooapis.com/v1/public/yql?q='+
			 			encodeURIComponent('SELECT entry FROM '+b+' WHERE url=\"'+url+'\" AND output=\"'+out+'\" | sort(field=\'updated\', descending=\'true\') | truncate(count='+parseInt(feedcount)+')') + '&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
			};
			function ajaxYQL(furl){

				$.jsonp({
					type: "GET",
					url : yql(furl,'feednormalizer',l.feedcount,'atom_1.0') + "&callback=?",
					dataType: "jsonp",
					success: function(n) {
						if(n.query == null || n.query.results == null){
							console.log("error feed " + furl+ " retry count="+totalyqlcount);
							if(totalyqlcount<100){
								totalyqlcount++;
								setTimeout(function(){
										//ajaxYQL(this);
                    ajax_rss2json_com(this);
								}.bind(furl),5000);
							}
							return;
						}

						feeddata = n.query.results.feed, $(feeddata).each(function(n) {
							//	feeddata = n.query.results.feed.entry for atom_1.0
							//  feeddata = n.query.results.rss.channel.item for rss_2.0
						//	len++, l.modul.find("ul").append('<li><a target="_blank" href="' + feeddata[n].link + '"><span>' + labelList[xx] + "</span> - " + feeddata[n].title + "</a></li>")
							len++;
							if('slide-h' == l.effect){l.modul.find("ul").append('<li id="item-'+(len-1)+'" class="bn-slide-h-hide"><a href="#">' + feeddata[n].entry.title + "</a></li>")}else{l.modul.find("ul").append('<li id="item-'+(len-1)+'"><a href="#">' + feeddata[n].entry.title + "</a></li>")}
						}), 0 == xx && l.modul.find("ul li").eq(0).fadeIn(), xx++
						//console.log("call stylish");
						stylish();
					},
					error: function() {
						//l.modul.find("ul").append('<li id="item-0" class="bn-slide-h-hide"><a href="#">...</a></li>');
						//stylish();
            console.log("error2 feed " + furl+ " retry count="+totalyqlcount);
            if(totalyqlcount<100){
              totalyqlcount++;
              setTimeout(function(){
                  //ajaxYQL(this);
                  ajax_rss2json_com(this);
              }.bind(furl),5000);
            }
            return;
					}
				})
			}
      function ajax_rss2json_com(furl){

        $.jsonp({
          type: "GET",
          url : "http://rss2json.com/api.json?rss_url=" + encodeURIComponent(furl) + "&callback=?",
          dataType: "jsonp",
          success: function(n) {
            if(n.items == null){
              console.log("error feed " + furl+ " retry count="+totalyqlcount);
              if(totalyqlcount<100){
                totalyqlcount++;
                setTimeout(function(){
                    ajaxYQL(this);
                    //ajax_rss2json_com(this);
                }.bind(furl),5000);
              }
              return;
            }
            feeddata = n.items, $(feeddata).each(function(n) {
              //	feeddata = n.query.results.feed.entry for atom_1.0
              //  feeddata = n.query.results.rss.channel.item for rss_2.0
            //	len++, l.modul.find("ul").append('<li><a target="_blank" href="' + feeddata[n].link + '"><span>' + labelList[xx] + "</span> - " + feeddata[n].title + "</a></li>")
              len++;
              if('slide-h' == l.effect){l.modul.find("ul").append('<li id="item-'+(len-1)+'" class="bn-slide-h-hide"><a href="#">' + feeddata[n].title + "</a></li>")}else{l.modul.find("ul").append('<li id="item-'+(len-1)+'"><a href="#">' + feeddata[n].title + "</a></li>")}
            }), 0 == xx && l.modul.find("ul li").eq(0).fadeIn(), xx++
            //console.log("call stylish");
            stylish();
          },
          error: function() {
            //l.modul.find("ul").append('<li id="item-0" class="bn-slide-h-hide"><a href="#">...</a></li>');
            //stylish();
            console.log("error2 feed " + furl+ " retry count="+totalyqlcount);
            if(totalyqlcount<100){
              totalyqlcount++;
              setTimeout(function(){
                  ajaxYQL(this);
                  //ajax_rss2json_com(this);
              }.bind(furl),5000);
            }
          }
        })
      }
			function loadRssFeedsViaYQL() {
				var host_language = 'en';
				for (rssList = l.feed.split("#"), /*labelList = l.feedlabels.split(","),*/ len = 0, l.modul.find("ul").html(""), xx = 0, k = 0; k < rssList.length; k++){
					console.log('rssList[k]='+rssList[k]);
					var furl = rssList[k];
					ajaxYQL(rssList[k].trim());
				}
			}
      function loadRssFeedsVia_rss2json_com() {
        var host_language = 'en';
        for (rssList = l.feed.split("#"), /*labelList = l.feedlabels.split(","),*/ len = 0, l.modul.find("ul").html(""), xx = 0, k = 0; k < rssList.length; k++){
          console.log('rssList[k]='+rssList[k]);
          var furl = rssList[k];
          ajax_rss2json_com(rssList[k].trim());
        }
      }
			function loadRssFeedsViaGoogle() {
				var host_language = 'en';
				for (rssList = l.feed.split("#"), /*labelList = l.feedlabels.split(","),*/ len = 0, l.modul.find("ul").html(""), xx = 0, k = 0; k < rssList.length; k++)
        {
          $.ajax({
  					type: "GET",
  					url: "htt"+"p://aja"+"x.goog"+"leapis.c"+"om/aja"+"x/services/fee"+"d/loa"+"d?v=1.0&num=" + l.feedcount + "&callback=?&q=" + encodeURIComponent(rssList[k].trim()) + "&hl="+ host_language,
  					dataType: "json",
  					success: function(n) {
  						feeddata = n.responseData.feed.entries, $(feeddata).each(function(n) {
  						//	len++, l.modul.find("ul").append('<li><a target="_blank" href="' + feeddata[n].link + '"><span>' + labelList[xx] + "</span> - " + feeddata[n].title + "</a></li>")
  							len++;
  							if('slide-h' == l.effect){l.modul.find("ul").append('<li id="item-'+(len-1)+'" class="bn-slide-h-hide"><a href="#">' + feeddata[n].title + "</a></li>")}else{l.modul.find("ul").append('<li id="item-'+(len-1)+'"><a href="#">' + feeddata[n].title + "</a></li>")}

  						}), 0 == xx && l.modul.find("ul li").eq(0).fadeIn(), xx++

  						//console.log("call stylish");
  						stylish();

  					},
  					error: function() {
  						//l.modul.find("ul").append('<li id="item-0" class="bn-slide-h-hide"><a href="#">...</a></li>');
  						//stylish();
  					}
  				})
        }
			}


				l.modul = $("#" + $(this).attr("id"));
				var a = 0,
					now = 0,
					prev = 0,
					len = l.modul.find("ul li").length,
					notOnClick = !0,
					doing = false;

			function init()
			{
				//console.log("a(init)="+a)
				for(var i = 0; i<len ; i++)
				{
					l.modul.find("ul li").eq(i).attr('id','item-'+i);
				}

				if(0 != l.feed)
				{
					loadRssFeedsViaYQL();
				}else
				{
					l.modul.find("ul li").eq(now).fadeIn();
					stylish();
				}



				if(l.autoplay)
				{
					a = setInterval(function() {
						nextItem()
					}, l.timer);

					//console.log("a(init2)="+a)
					/*
					,$(l.modul).on("mouseenter", function() {
						clearInterval(a)
					}),

					$(l.modul).on("mouseleave", function() {
						a = setInterval(function() {
							nextItem()
						}, l.timer)
					})
					*/

				}else
				{
					clearInterval(a);
				}



				//l.border || l.modul.addClass("bn-bordernone");


				//"italic" == l.fontstyle && l.modul.addClass("bn-italic"), "bold" == l.fontstyle && l.modul.addClass("bn-bold"), "bold-italic" == l.fontstyle && l.modul.addClass("bn-bold bn-italic"), l.modul.addClass("bn-" + l.color),


				$(window).on("resize", function() {
					stylish()
				}),

				l.modul.find(".bn-navi span").on("click", function() {
					(notOnClick && !doing) && (notOnClick = !1,
					0 == $(this).index() ? 	(now--, 0 > now && (now = len - 1), doAnimation()) : (now++, now == len && (now = 0), doAnimation()))
				})
			}

			setTimeout(function(){
				init();
				var xthis = breakingNewsArrayList[$(l.modul).attr("id")];
				xthis.a = a;
				//breakingNewsArrayList[$(this).attr("id")] = xthis;
			},10);


		this.l = l;
		this.a = a;
		//console.log("a="+this.a)
		this.reset = function(xthis){
			var l = xthis.l;
			//console.log("reset the breakingnews & rss");
			//l.modul = $("#" + $(this).attr("id"));
			//console.log(l)
			//console.log("a="+xthis.a)
			clearInterval(xthis.a);
			//console.log("prev="+prev);
			if("fade" == l.effect)
			{
				if(prev!=0){l.modul.find("ul li").eq(prev).css('display','none');}
			}else if("typing-fast" == l.effect)
			{
				if(prev!=0){l.modul.find("ul li").eq(prev).css('width','0px');}
			}else if("slide-v" == l.effect)
			{
				if(prev!=0){l.modul.find("ul li").eq(prev).css('top',l.modul.find('ul').height()+'px');}
			}else if("slide-h" == l.effect)
			{
				if(prev!=0){l.modul.find("ul li").eq(prev).css('left',"-" + (l.modul.find("ul").eq(prev).width()));}
			}
			a = 0;
			len = l.modul.find("ul li").length;
			now = 0;
			prev = 0;
			notOnClick = !0;
			doing = false;
			init();
			xthis.a = a;
			//console.log("new_a="+xthis.a)
		}

		breakingNewsArrayList[$(this).attr("id")] = this;
	//	console.log("this=")
		//console.log(this)
		return this;
	}
}(jQuery);
$.handleError = function(s, xhr, status, e) {
    // If a local callback was specified, fire it
    if ( s.error ) {
        s.error.call( s.context || window, xhr, status, e );
    }

    // Fire the global callback
    if ( s.global ) {
        (s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
    }
};
