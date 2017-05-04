$(document).ready(function () {

});

var clock = {
	idArray : new Array(),
	clockInIframe : false,
	bInited : new Array(),

	now : new Date().getTime(),

	blink : "",
	color : "",
	bgcolor : "",

	fontsize: "",

	sec : new Array(),
	hour12 : new Array(),
	align : new Array(),
	pageScreenWidth : new Array(),
	pageScreenHieght : new Array(),
	autofit : new Array(),
	dateFormat : new Array(),
	timeFormat : new Array(),
	monthNames : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
	dayNames_en : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	dayNames_zh : ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
	dayNames_jp : ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],

	systemTimeIntrvalHandle : null,

	oldDate : 0,
	startCheckDate : false,
	//for ntp
	ntp : "",
	checkntpjson : null,


	render : function(){

		if(clock.clockInIframe == true)
		{
			if( typeof( window.innerWidth ) == 'number' ) {
		        pageScreenWidth = window.innerWidth;
		        pageScreenHieght = window.innerHeight;
		    } else if( typeof( window.innerWidth ) == 'number' ){
		        pageScreenWidth = document.documentElement.clientWidth;
		        pageScreenHieght = document.documentElement.clientHeight;
		    }  else {
		        pageScreenWidth = document.body.offsetWidth;
		        pageScreenHieght = document.body.offsetHeight;
		    }
		    clock.pageScreenWidth = pageScreenWidth;
		    clock.pageScreenHieght = pageScreenHieght;


	   		clock.geturlparameter();
			clock.renderInIframe();
		}
	    //console.log(new Date("2015-06-30T15:26:42+01:00"));
		clock.systemTimeIntrvalHandle = setInterval(function(){
				clock.now = (new Date().getTime());
			},500);


	    $('.digiclock').each(function(index){
	    	var id = $(this).attr('id');

	    	clock.idArray[index] = id;
	    	clock.sec[id] = false;
	    	clock.hour12[id] = false;

	    	clock.getParameterFromAttribute(id);


		    if(clock.dateFormat[id]!=null){clock.dateFormat[id] = clock.checkDateFormat(clock.dateFormat[id]);}
		    if(clock.timeFormat[id]!=null){clock.timeFormat[id] = clock.checkTimeFormat(clock.timeFormat[id]);}
		    if(clock.autofit[id]=="true"){
		    	clock.renderInDiv(id);
			}
	    	clock.genFormat(id,clock.dateFormat[id],clock.timeFormat[id],clock.now);

	    	clock.bInited[id] = false;

			if(clock.ntp == "true")
			{
				ntpjson.nowCallbackFun = clock.setNow;
				if(clock.checkntpjson==null)
				{
					clock.checkntpjson = setInterval(function(x){
						return function(){
							if(ntpjson.isInited == true)
							{
								clearInterval(clock.checkntpjson)
								clearInterval(clock.systemTimeIntrvalHandle);
								for(var x=0;x<clock.idArray.length;x++)
								{
									clock.init(clock.idArray[x]);
								}
							}
						}
					}(0),100);
				}

			}else
			{
				clock.init(id);
			}

	    })

		if(clock.ntp == "true")
		{
		    var nextCheckout = 12*60*60*1000;
		    ntpjson.getTimeZoneFromServer();
		    setInterval(function(){
		    	ntpjson.bTickerStart = false;
		    	ntpjson.getTimeZoneFromServer();
			},nextCheckout);
		}





	},
	setNow : function(now)
	{
		clock.now = now;
	},
	getParameterFromAttribute : function(id){
		console.log($('#'+id))
		clock.dateFormat[id] = $('#'+id).attr('dateFormat');
		clock.timeFormat[id] = $('#'+id).attr('timeFormat');
		clock.autofit[id] = ($('#'+id).attr('autofit') == "true" ? "true" : "false") ;
		if(clock.ntp == "")
		{
			if($('#'+id).attr('ntp') == "true")
			{
				clock.ntp = "true";
			}
		}
	},
	renderInDiv : function(id){
		clock.pageScreenHieght[id] = parseInt($('#'+id).parent().css('height'));
		clock.pageScreenWidth[id] = parseInt($('#'+id).parent().css('width'));

		console.log("pageScreenHieght1="+clock.pageScreenHieght[id]);
		if((clock.dateFormat[id]!=null && clock.dateFormat[id].match(/enx/i)) || (clock.timeFormat[id]!=null && clock.timeFormat[id].match(/enx/i)) )
		{

			//clock.pageScreenHieght[id] = clock.pageScreenHieght[id]*0.83;
		}else
		{
			//clock.pageScreenHieght[id] = clock.pageScreenHieght[id]*0.93;
		}
	    clock.pageScreenWidth[id] = clock.pageScreenWidth[id]-2;
	    console.log("pageScreenWidth="+clock.pageScreenWidth[id]);
	    console.log("pageScreenHieght2="+clock.pageScreenHieght[id]);
	    $('#'+id).css('font-size',clock.pageScreenHieght[id]+"px");
	},
	geturlparameter : function(){

		var url = document.location.href;//$(location).attr('href');
		console.log("url="+url);

	    clock.fontsize =  clock.getParameterFromURL(url, 'fontsize');
	   	clock.dateFormat = clock.getParameterFromURL(url, 'dateFormat');
		clock.timeFormat = clock.getParameterFromURL(url, 'timeFormat');
		clock.autofit = clock.getParameterFromURL(url, 'autofit');
	    clock.blink = clock.getParameterFromURL(url, 'blink');
	    clock.color = clock.getParameterFromURL(url, 'color');
	    clock.bgcolor = clock.getParameterFromURL(url, 'bgcolor');
	    clock.ntp = clock.getParameterFromURL(url, 'ntp');
	    clock.align = clock.getParameterFromURL(url, 'align');

	    if(clock.blink != "true")
	    {
	    	$(".digiclock_point").removeClass('digiclock_pointhide').addClass('digiclock_pointshow');
	    }


	},
	renderInIframe : function(){
	    if(clock.color != null)
	    {
	    	$(".clock").css('color',clock.color);
	    }else
	    {
	    	$(".clock").css('color',"#111111");
	    }
	    if(clock.bgcolor != null)
	    {
	    	$("body").css('background-color',clock.bgcolor);
	    }else
	    {
	    	$("body").css('background-color','transparent');
	    }
	    if(clock.align == "right")
	    {
	    	$(".clock").css('textAlign',"right");
	    }else if(clock.align == "center")
	    {
	    	$(".clock").css('textAlign',"center");
	    }
		console.log("pageScreenHieght1="+pageScreenHieght);
		if((clock.dateFormat!=null && clock.dateFormat.match(/enx/i)) || (clock.timeFormat!=null && clock.timeFormat.match(/enx/i)) )
		{

			clock.pageScreenHieght = clock.pageScreenHieght*0.83;
		}else
		{
			clock.pageScreenHieght = clock.pageScreenHieght*0.93;
		}
	    clock.pageScreenWidth = clock.pageScreenWidth-2;
	    console.log("pageScreenWidth="+clock.pageScreenWidth);
	    console.log("pageScreenHieght2="+clock.pageScreenHieght);
	    $('.clock').css('width',clock.pageScreenWidth);
	    $('.clock').css('height',clock.pageScreenHieght);

	    $('.digiclock').css('font-size',clock.pageScreenHieght+"px");

	},

	genFormat : function(id,dateFormat,timeFormat,now){

		console.log("dateFormat="+dateFormat+";timeFormat="+timeFormat)
		var clockhtml = "";

		if($('#'+id).find('.digiclock_wrapper').length == 0)
		{
			$('#'+id).html('<span class="digiclock_wrapper"></span>');
		}

		$('#'+id).find('.digiclock_wrapper').html(clockhtml);

		if(dateFormat!=null && dateFormat != "")
		{
			clockhtml += '<span id="datetime_date" class="digiclock_init"></span>';

		}
		if(dateFormat!=null && dateFormat != "" && timeFormat!=null && timeFormat != "")
		{
			clockhtml += '<span id="datetime_spaces" class="digiclock_init">&nbsp;&nbsp;&nbsp;</span>';
		}
		if(timeFormat!=null && timeFormat != "")
		{
			clockhtml += '<span id="datetime_time" class="digiclock_init"></span>';

		}
		$('#'+id).find('.digiclock_wrapper').html(clockhtml);

		if(dateFormat!=null && dateFormat != "")
		{

			clock.genDate(id,dateFormat,now);
		}
		if(timeFormat!=null && timeFormat != "")
		{

			clock.genTime(id,timeFormat,now);
		}
	},
	checkDateFormat : function(dateFormat){
		zh_dateFormat1 = "YYYY-MM-DD";//2015-07-20
		zh_dateFormat2 = "YYYY年MM月DD日";//2015年07月20日
		zh_dateFormat3 = "YYYY年MM月DD日 WWZH";//2015年07月20日 星期一
		zh_dateFormat4 = "YYYY/MM/DD";//2015/07/20
		zh_dateFormat5 = "DD/MM/YYYY";//07/20/2015
		en_dateFormat1 = "DD/MM";//25/07
		en_dateFormat2 = "MM/DD";//07/25
		en_dateFormat3 = "DD/MM/YY";//25/07/15
		en_dateFormat4 = "MM/DD/YY";//07/25/15
		enx_dateFormat5 = "WWENX, MMENX DD, YYYY";//Saturday, July 25, 2015

		console.log("-------------------->")
		if(dateFormat.match('dateFormat'))
		{
			console.log(typeof eval(dateFormat));
			dateFormat =  eval(dateFormat);
		}
		return dateFormat;
	},

	genDate : function(id,dateFormat,now){


		var newDate = new Date(now);
		var datehtml = dateFormat;
		//console.log(datehtml)
		datehtml = datehtml.replace('YYYY',newDate.getFullYear());
		datehtml = datehtml.replace('YY',Math.floor(newDate.getFullYear()/100));
		datehtml = datehtml.replace('MMENX',clock.monthNames[newDate.getMonth()]);
		datehtml = datehtml.replace('MM',((newDate.getMonth()+1)<10)?'0'+(newDate.getMonth()+1):(newDate.getMonth()+1));
		datehtml = datehtml.replace('M',(newDate.getMonth()+1));
		datehtml = datehtml.replace('DD',(newDate.getDate()<10)?'0'+newDate.getDate():newDate.getDate());
		datehtml = datehtml.replace('WWENX',clock.dayNames_en[newDate.getDay()]);
		datehtml = datehtml.replace('WWZH',clock.dayNames_zh[newDate.getDay()]);
		datehtml = datehtml.replace('WWJP',clock.dayNames_jp[newDate.getDay()]);

		$('#'+id).find('#datetime_date').html(datehtml);

	},
	checkTimeFormat : function(timeFormat){
		timeFormat1 = "HH:MM:SS";//16:01:15
		timeFormat2 = "HH:MM";//16:01
		timeFormat3 = "AA HH:MM";//PM 04:01
		timeFormat4 = "AA HH:MM:SS";//PM 04:01:15
		timeFormat5 = "HH:MM AA";//04:01 PM
		timeFormat6 = "HH:MM:SS AA";//04:01:15 PM

		console.log("-------------------->")
		if(timeFormat.match('timeFormat'))
		{
			console.log(typeof eval(timeFormat));
			timeFormat =  eval(timeFormat);
		}
		return timeFormat;
	},
	genTime : function(id,timeFormat,now){

		var newDate = new Date(now);
		var timehtml = timeFormat;
		if(timeFormat.match('SS'))
		{
			clock.sec[id] = true;
		}
		if(timeFormat.match('AA'))
		{
			clock.hour12[id] = true;
		}
		timehtml = timehtml.replace('SS','<span id="datetime_sec" class="digiclock_init">08</span>');
		timehtml = timehtml.replace('HH','<span id="datetime_hours" class="digiclock_init" >08</span>');
		timehtml = timehtml.replace('MM','<span id="datetime_min" class="digiclock_init">08</span>');
		timehtml = timehtml.replace('AA','<span id="datetime_ampm" class="digiclock_init" >AM</span>');
		timehtml = timehtml.replace(/:/g,'<span id="point" class=" digiclock_point digiclock_init">:</span>');

		$('#'+id).find('#datetime_time').html(timehtml);
	},


	urlParams : null,
	urlparser : function(QueryString) {
	    var match,
	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
	        search = /([^&=]+)=?([^&]*)/g,
	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	        query  = QueryString;//window.location.search.substring(1);

	    this.urlParams = {};
	    while (match = search.exec(query))
	       this.urlParams[decode(match[1])] = decode(match[2]);
	},


	getParameterFromURL : function(url, name)
	{
		if(this.urlParams == null)
		{
			var queryString = url.substring( url.indexOf('?') + 1 );
			this.urlparser(queryString);
		}

		return this.urlParams[name];
		//url = url;
		//return dogetUrlParameter(name);
		//return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
	},

	init : function(id){
		console.log("id5="+id)
		if(clock.bInited[id] == true)
		{
			return;
		}else
		{
			console.log("-------->init!");
			clock.bInited[id] = true;
			clock.genFormat(id,clock.dateFormat[id],clock.timeFormat[id],clock.now);
		}

		if(clock.autofit[id]=="false")
		{
			//$('#'+id).css('font-size',clock.pageScreenHieght+"px");
			clock.start(id);

			setTimeout((function(id){
        			return function(){

						if( parseInt($('#'+id).find('.digiclock_wrapper').css('height'))==0)
						{
							var maxheight = 0;
							$('#'+id).find('.digiclock_wrapper').find('span').each(function(){ if(parseInt($(this).css('height'))>maxheight){maxheight = parseInt($(this).css('height')) } });
							var offset = maxheight - parseInt($('#'+id).parent().css('height'));
						}else
						{
							var offset = parseInt($('#'+id).find('.digiclock_wrapper').css('height')) - parseInt($('#'+id).parent().css('height'));
						}
						$('#'+id).css('padding-top',(-1*offset/2)+"px");
				};
			})(id),10);

		}else
		{

			setTimeout((function(id){
				return function(){
					var wrapperMaxWidth = 0;
					var stableCounter = 0;
					var oldfontsize = 0;
					function fitWidth(id)
					{
						//console.log("id6="+id)
						digiwidth = $('#'+id).find(".digiclock_wrapper").width()
						//console.log($('#'+id).find(".digiclock_wrapper").width())
						if(digiwidth>wrapperMaxWidth)
						{
							wrapperMaxWidth = digiwidth+5;
						}
						//console.log("wrapperMaxWidth="+wrapperMaxWidth);
						//console.log("pageScreenWidth="+clock.pageScreenWidth[id]);

						if(oldfontsize == parseInt($('#'+id).css('font-size')))
						{
							stableCounter++;
							if(stableCounter>50)
							{
								console.log("Reach size stable");
								clearInterval(dofitwidth);
								clock.start(id);

								setTimeout(function(){

									if( parseInt($('#'+id).find('.digiclock_wrapper').css('height'))==0)
									{
										var maxheight = 0;
										$('#'+id).find('.digiclock_wrapper').find('span').each(function(){ if(parseInt($(this).css('height'))>maxheight){maxheight = parseInt($(this).css('height')) } });
										var offset = maxheight - clock.pageScreenHieght[id];
									}else
									{
										var offset = parseInt($('#'+id).find('.digiclock_wrapper').css('height')) - clock.pageScreenHieght[id];
									}


									//console.log("offset="+offset)
									//$('#'+id).css('top',(-1*offset/2)+"px");
									$('#'+id).css('padding-top',(-1*offset/2)+"px");
								},10)


							}
						}
						oldfontsize = parseInt($('#'+id).css('font-size'));

						if(wrapperMaxWidth>clock.pageScreenWidth[id])
						{
							//console.log($('#'+id).css('font-size'))
							var nowsize = parseInt($('#'+id).css('font-size'));
							//console.log("nowsize="+nowsize)
							$('#'+id).css('font-size',(nowsize-2)+"px");
							//console.log("nowsize="+parseInt($('#'+id).css('font-size')))
							wrapperMaxWidth=0;
						}
					}

					var dofitwidth = setInterval( function(id) {
						return function(){
							fitWidth(id);
							}
					  	}(id), 10);

					};
				})(id),500);
			}
		},


		start: function(id){

			clock.genDate(id,clock.dateFormat[id],new Date(clock.now));

			setTimeout(function(id){
				return function(){
					var tickpoint = 0;

					if(clock.sec[id] == true){
						timeinterval = 200;
					}else
					{
						timeinterval = 1000;
					}
					setInterval( function() {

						var nowDate =  new Date(clock.now);
						var nownow = clock.now;
						// Create a newDate() object and extract the seconds of the current time on the visitor's
						var seconds = nowDate.getSeconds();
						// Add a leading zero to seconds value
						$('#'+id).find("#datetime_sec").html(( seconds < 10 ? "0" : "" ) + seconds);

						// Create a newDate() object and extract the minutes of the current time on the visitor's
						var minutes = nowDate.getMinutes();
						// Add a leading zero to the minutes value
						$('#'+id).find("#datetime_min").html(( minutes < 10 ? "0" : "" ) + minutes);
						// Create a newDate() object and extract the hours of the current time on the visitor's
						var hours = nowDate.getHours();
						// Add a leading zero to the hours value
						if(clock.hour12[id] == true)
						{
							if(hours>=12 && hours<24)
							{
								var hh12 = hours;
								if(hh12>12)
								{
									hh12 = hours-12;
								}
								$('#'+id).find('#datetime_ampm').html('PM');
								$('#'+id).find("#datetime_hours").html(( hh12 < 10 ? "0" : "" ) + hh12);
							}else
							{
								var hh12 = hours;
								if(hh12==0)
								{
									hh12 = 12;
								}
								$('#'+id).find('#datetime_ampm').html('AM');
								$('#'+id).find("#datetime_hours").html(( hh12 < 10 ? "0" : "" ) + hh12);
							}

						}else
						{
							$('#'+id).find("#datetime_hours").html(( hours < 10 ? "0" : "" ) + hours);
						}

						setTimeout(function(id){
							return function(){
								clock.oldDate[id] = nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate();
								clock.startCheckDate = true;
							}
						}(id),10000);


						if(clock.startCheckDate == true)
						{
							var nowDateString = nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate();
							if(clock.oldDate[id]!=nowDateString)
							{
								clock.genDate(id,clock.dateFormat[id],nownow);
							}

						}



					    },1000);



					if(clock.blink == "true")
					{
						setInterval( function() {
							if(tickpoint == 1)
							{
								$(".digiclock_point").each(function(){$(this).removeClass('digiclock_pointhide').addClass('digiclock_pointshow');});
								tickpoint = 0;
							}else
							{
								$(".digiclock_point").each(function(){$(this).removeClass('digiclock_pointshow').addClass('digiclock_pointhide');});
								tickpoint = 1;
							}

						    }, 500);
					}
					setTimeout(function(id){
						return function(){
							$('#'+id).find(".digiclock_wrapper").find('span').each(function(){
								$(this).removeClass('digiclock_init');
							})
						}
					}(id),1000);


				}
			}(id),100);
		}
}



var ntpjson = {

	timediff : 0,
	gtimezone : 0,
	currentTimeOffsetFromServer : 0,
	bTickerStart : false,
	offset : 0,

	now : 0,
	nowCallbackFun : null,
	isInited:false,

	// ntp code

	getOffset : function(now){
		function pad(number, length){
	    var str = "" + number
	    while (str.length < length) {
	        str = '0'+str
	    }
	    return str
		}
		var offset = new Date(ntpjson.now).getTimezoneOffset()
			  offset = ((offset<0? '+':'-')+ // Note the reversed sign!
	          pad(parseInt(Math.abs(offset/60)), 2)+
	          pad(Math.abs(offset%60), 2))
	          console.log(offset);
	          return offset;

	},
	getTimeZoneFromServer : function(){

			$.ajaxSetup({
			timeout:5000 // in milliseconds
			});


			$.timezone = function(success){
	        $.get("http://www.telize.com/geoip?callback=?", function(response){
	            success(response);
	        }, "json").fail(function( data ) {
					ntpjson.now = new Date().getTime();
					ntpjson.isInited= true;
			});
	    };
	   $.timezone(function(response){
	   		ntpjson.currentTimeOffsetFromServer = response.offset;
	        console.log("timezone="+response.timezone);
	        ntpjson.gtimezone = response.timezone;
	        ntpjson.getUTCtimeFromJsontestCom();
	        //ntpjson.getUTCtimeFromNTPserver();


	    });
	},
	getUTCtimeFromJsontestCom : function(){


	// Using YQL and JSONP
		$.ajax({
			type: 'GET',

		    url: "http://date.jsontest.com/", //http://time.jsontest.com/  http://date.jsontest.com/
		    // Tell jQuery we're expecting JSONP
		    dataType: "json",

		 	timeout: 5000,


		    // Tell YQL what we want and that we want JSON

		 //   data: {
		  //      q: "select title,abstract,url from search.news where query=\"cat\"",
		   //     format: "json"
		   // },

		    // Work with the response
		    success: function( response ) {
		    	//alert( "success" );
		        console.log( response ); // server response
		        var time = new Date(response.milliseconds_since_epoch);
		 		ntpjson.offset = ntpjson.getOffset(time.getTime());
		        var system_time = new Date().getTime();
		        var server_time = time.getTime();
		        ntpjson.timediff = server_time - system_time;
		        ntpjson.TickerStart();
		        //now = now + (currentTimeOffsetFromServer * 3600000) - (parseInt(offset/100)*3600000) - (parseInt(offset%100)*60000);
		        ntpjson.isInited = true;
		        console.log("now="+ntpjson.now);


		    },

		    error: function( response ) {
		    	// alert( "error" );
		        console.log( response ); // server response
		    },
		    complete: function( response ) {
		    	// alert( "complete" );
		        console.log( response ); // server response
		    }

		});


	},
	getUTCtimeFromNTPserver : function(){
		/*
	// Using YQL and JSONP
		$.ajax({
			type: 'GET',

		    url: "http://json-time.appspot.com/time.json?tz="+timezone,

		    // The name of the callback parameter, as specified by the YQL service
		    jsonp: "callback",

		    // Tell jQuery we're expecting JSONP
		    dataType: "jsonp",

		 	timeout: 5000,


		    // Tell YQL what we want and that we want JSON

		 //   data: {
		  //      q: "select title,abstract,url from search.news where query=\"cat\"",
		   //     format: "json"
		   // },

		    // Work with the response
		    success: function( response ) {
		    	alert( "success" );
		        console.log( response ); // server response
		    },

		    error: function( response ) {
		    	 alert( "error" );
		        console.log( response ); // server response
		    },
		    complete: function( response ) {
		    	 alert( "complete" );
		        console.log( response ); // server response
		    }

		});
	*/

	    $.data = function(success){
	        //$.get("http://json-time.appspot.com/time.json?tz="+timezone+"&callback=?", function(response){
	       	$.get("http://json-time.appspot.com/time.json?callback=?", function(response){
	            success(new Date(response.datetime));
	        }, "json").fail(function( data ) {
	        				console.log("fail! next")
						    ntpjson.isInited = true;
						  });
	    };

	   //var today = new Date();

	    $.data(function(time){
	    	console.log("time="+time);
	        //now = time.getTime();
	        ntpjson.offset = ntpjson.getOffset(time.getTime());
	        var system_time = new Date().getTime();
	        var server_time = time.getTime();
	        ntpjson.timediff = server_time - system_time;
	        ntpjson.TickerStart();
	        //now = now + (currentTimeOffsetFromServer * 3600000) - (parseInt(offset/100)*3600000) - (parseInt(offset%100)*60000);
	        ntpjson.isInited = true;
	        console.log("now="+ntpjson.now);

	    });



	},
	TickerStart : function(){
		if(ntpjson.bTickerStart == true)
		{
			console.log("Ticker has been started");
			return;
		}else
		{
			ntpjson.bTickerStart = true;
			ntpjson.nowCallbackFun(ntpjson.now);
			console.log("----------------------->TickerStart!!")
			setInterval(function(){
				ntpjson.now = (new Date().getTime()) + ntpjson.timediff  + (ntpjson.currentTimeOffsetFromServer * 3600000) - (parseInt(ntpjson.offset/100)*3600000) - (parseInt(ntpjson.offset%100)*60000);;
				//clock.now = ntpjson.now;
				ntpjson.nowCallbackFun(ntpjson.now);
			},500);
		}

	}



}
