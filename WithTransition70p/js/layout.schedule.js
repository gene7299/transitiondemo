	    var DISABLE_VIDEO_PRELOADING = false;//because Launchnow is work. so video can create on really showing time.
	    var OPEN_DEBUG_MESSAGE_ON_SCREEN = false;
	    var more_time_to_alignment = 3;
	    var EnableFadeInPlay = true;
	    // schedule warehouse(parsing from XML)
		var schedule = new Array();
		// defaultPage: default page(parsing from XML), tempxml: The last time a temporary
		var defaultPage;//, tempxml;
		// connection configuration
		var hardwareKey, serverAddress, serverKey, displayName, secretKey, rootpath;
		var verfile;
		//
		var finalurl;
		var httpStr = "http://";
		var wsUrl = "";
		var wsUrl2 = "";
		var psps = "philips"
		var url;
		var isLinuxPD = false;

		var MAX_PRELOADING_TIME = 15;
		if(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i) )
		{
			var MIN_PRELOADING_TIME = 0;
			isLinuxPD = true;
		}else
		{
			var MIN_PRELOADING_TIME = 0;
		}
		var ScreenWidth;
		var ScreenHieght;
		var ErrorFontSize;
		var ErrorLineHeight;
		var ErrorFontSize;
		var ErrorLineHeight;
		var errorInterval = null;
		var schedule = new Array();
		var nowScheduleIndex = -1;
		var layout = new Array();
		var nowDurationIntervalHandle = null;
		var portrait = false;
		var append = "";
		var nowShowingFrame = 0;
		var mode = "Normal";
		var event_layoutid = -1;
		var event_message = "";
		var nowPlayingLayoutId = -1;
		var nowLayoutRemainsSeconds = 0;
		var inEmergencyAlert = false;
		var hasDefaultLayout = false;
		var initedScheduler = false;
		var SaveSCH = { scheduleid: -1, aHourLayouts_playidx: 0 };
		/** Main flow
		*/
        $(document).ready(function () {
					console.log("!!!!!!!!!!!!!!!!!!!!!!!==============> LOADING MAIN PAGE <==============!!!!!!!!!!!!!!!!!!!!!!!");

			if( typeof( window.innerWidth ) == 'number' ) {
				ScreenWidth = window.innerWidth;
				ScreenHieght = window.innerHeight;
			} else{
				ScreenWidth = document.documentElement.clientWidth;
				ScreenHieght = document.documentElement.clientHeight;
			}




			/* Step1: To get Configuration */
			url = $(location).attr('href');

			//alert(url);
			hardwareKey = getURLParameter(url, 'hardwarekey');
			if (!hardwareKey)
				hardwareKey = url.substring(url.indexOf("sch_") + 4 ,url.indexOf("/index"));
			rootpath = getURLParameter(url, 'root');
			serverAddress = getURLParameter(url, 'serveraddress');
			if (!serverAddress)
				serverAddress = window.location.hostname;
			serverKey = getURLParameter(url, 'serverkey');
			if (!serverKey)
				serverKey = "";
			displayName = getURLParameter(url, 'displayname');
			if (!displayName)
				displayName = "Public Display";
			secretKey = getURLParameter(url, 'ps');

			mode = getURLParameter(url, 'mode');
			if (!mode)
				mode = "Normal";

			if(mode == 'Android' || mode == 'android')
			{
				DISABLE_VIDEO_PRELOADING = false;
			}

			debugon = getURLParameter(url, 'debug');
			if (debugon == 'on')
				OPEN_DEBUG_MESSAGE_ON_SCREEN = true;


			/* Step2: Authenticate */

			// Step3.1: offline
			// Step3.1.1: Parse Json
			jsonToObj();

			if(portrait == true && bEnablePortraitMode == true)
			{
				temp = ScreenWidth;
				ScreenWidth = ScreenHieght;
				ScreenHieght = temp;

				rotate('error');

			}

			{
				if(ScreenWidth>ScreenHieght )
				{
					ErrorFontSize = ScreenHieght*0.0994;
					ErrorLineHeight  = (ScreenHieght - 1*ErrorFontSize)/2;
				}else
				{
					ErrorFontSize = ScreenHieght*0.0494;
					ErrorLineHeight  = (ScreenHieght - 1*ErrorFontSize)/2;
				}
				$(".error").parent().css('padding-top',ErrorLineHeight+"px");
				$(".error").css('font-size',ErrorFontSize+"px");
			}

			if (secretKey != psps){
				//$("#layout_iframe").attr('src', 'status/status.html?status=auth');
				//showerror(" No Content. No Content. No Content. No Content. No Content. ");
				//showerror("Authentication Failure");
				//return;
			}

			// Step3.1.2: Setup event listener to check video layout is play ending.
			window.addEventListener('message', function(event) {
				function getParameter(url, name) {
					return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
				}
				if(event.data.indexOf('getevent.html')!=-1)
				{
					var eventactive = getParameter(event.data,'eventactive');
					if(eventactive=='true')
					{
						var eventid = getParameter(event.data,'eventid');
						var url = getParameter(event.data,'url');
						getEventApiSuccess("ERing",eventid,url);
						ohSnap('ERing ' + eventid + ' ' + url, 'blue');
					}else{
						getEventApiSuccess("NotER",0,'');
						ohSnap('NotER ' , 'blue');
					}
				}else {
					event_layoutid = getParameter(event.data,'layoutid');
					event_message = getParameter(event.data,'message');
					console.log("event_layoutid="+event_layoutid);
					console.log("event_message="+event_message);
					if(event_message.indexOf('log:')==0){
						ohSnap('Layout ' + event_layoutid + ' ' + event_message, 'blue');
					}
				}
			});

			// Step3.1.3: Setup timer to check Schedule that if want to change layout.
			$('body').everyTime('1s','scheduler',function(){
				startSchedule();
			});


			startSchedule();

			startEvent();
			startFailback();
		});
		/** get parameter from url
		*/
		function getURLParameter(url, name) {
			return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
		}
		function startFailback() {
			setInterval(function(){
				var layout_iframe0_url_is_empty = false;
				var layout_iframe1_url_is_empty = false;
				if($("#layout_iframe0").attr('src') === "" || $("#layout_iframe0").attr('src') === undefined)
				{
					layout_iframe0_url_is_empty = true;
				}
				if($("#layout_iframe1").attr('src') === "" || $("#layout_iframe1").attr('src') === undefined)
				{
					layout_iframe1_url_is_empty = true;
				}
				if(layout_iframe0_url_is_empty === true && layout_iframe1_url_is_empty === true)
				{
					ohSnap('Empty Iframe Src ' , 'yellow');
					console.log("!!!!!!!!!!!!!!!!!!!!!!!==============> IFRAME SRC EMPYT ERROR SO RELOAD MAIN PAGE <==============!!!!!!!!!!!!!!!!!!!!!!!");
					location.href = location.href;
				}
				if($("#layout_iframe0").hasClass('hide') === true && $("#layout_iframe1").hasClass('hide') === true)
				{
					if( $("#layout_iframe0").attr('src') === "empty.html" && $("#layout_iframe1").attr('src') === "empty.html"){

					}else{
						ohSnap('Both Iframes Hide ' , 'yellow');
						console.log("!!!!!!!!!!!!!!!!!!!!!!!==============> BOTH IFRAMES HIDE ERROR SO RELOAD MAIN PAGE <==============!!!!!!!!!!!!!!!!!!!!!!!");
						location.href = location.href;
					}
				}
			},3000);
		}
		/** parser
			json to object
		*/
		function jsonToObj(){

			if((typeof layoutschedule) == "undefined")
			{
				layoutschedule = "{}";
				//showerror("No Schedule. No Schedule. No Schedule. No Schedule. No Schedule. ");
				showerror("No Schedule");
				return;
			}
			if(layoutschedule.trim() == "" ){
				layoutschedule = "{}";
				//showerror("No Schedule. No Schedule. No Schedule. No Schedule. No Schedule. ");
				showerror("No Schedule");
				//console.log("layoutschedule="+layoutschedule);
				return;
			}

			var jobj = jQuery.parseJSON(layoutschedule);
			append = jobj.append;
			portrait = jobj.portrait;
			defaultlayout = jobj.default;
			if(defaultlayout == undefined || defaultlayout == null || defaultlayout == "")
			{
				defaultlayout = "unavailable";
			}else
			{
				hasDefaultLayout = true;
				var adeflys = new Array();
				var adef = new Object();
				adef.id = defaultlayout;
				adef.duration = 600;
				adef.videoduration = -1;
				adef.preloaded = false;
				adef.videoAlignment = -1;
				adeflys[0] = adef;
				layout[0] = adeflys ;
				schedule[0] = "defaultlayouts";
			}
			console.log("defaultlayout="+defaultlayout);

			for(var s in jobj.schedule)
			{
				var sid = parseInt(s)+1;
				var slot = jobj.schedule[s];
				var timeslot = new Object;
				var lys = new Array();
				if(slot.layout.length === 0){
					lys[0] = JSON.parse(JSON.stringify(layout[0][0]));
				}
				for(var ls in slot.layout)
				{
					var ly = slot.layout[ls];
					var aly = new Object();
					aly.id = ly.id;
					aly.duration = ly.duration;
					aly.videoduration = (parseInt(ly.videoduration)>0)?ly.videoduration:-1;
					aly.preloaded = false;
					if(aly.duration%aly.videoduration==0)
					{
						aly.videoAlignment = aly.videoduration;
						aly.duration = aly.duration + more_time_to_alignment;//more time to alignment
					}
					lys[ls] = aly;
				}
				layout[sid] = lys;
				timeslot.id = sid;
				timeslot.fromdt = slot.ST;
				timeslot.todt = slot.ET;
				schedule.push(timeslot);


			}

		}
		initedScheduler = true;
		/** initialize page
			Selected from the schedules to meet time,
			if no one, select default page.
		*/
		function startSchedule() {
			console.log('do startSchedule ...');

			var today = new Date();
			var now_hour = today.getHours();
			var now_minutes = today.getMinutes();
			var now_hour_minutes = parseInt(now_hour)*100+parseInt(now_minutes);
			console.log(now_hour+":"+now_minutes+"="+now_hour_minutes);

			// check schedule
			finalurl = "";
			var checkindex = -1;
			for(var index in schedule){

				if(index == 0)
					continue;

				var start = parseInt(schedule[index].fromdt);
				var end = parseInt(schedule[index].todt);
				if(end == 0)
				{
					end = 2400;
				}
				if(end < start) // 2300~0105
				{
					start_1 = start;
					end_1 = 2400;
					start_2 = 0;
					end_2 = end;
				}else
				{
					start_1 = start_2 = start;
					end_1 = end_2 = end;
				}
				//console.log("start="+start+";end="+end+";now_hour_minutes="+now_hour_minutes);

				if ( (now_hour_minutes >= start_1 && now_hour_minutes < end_1) || (now_hour_minutes >= start_2 && now_hour_minutes < end_2) ){

					checkindex = index;
				}
			}
			if(checkindex == -1 && defaultlayout!="unavailable")
			{
				checkindex = 0;
			}
			if(nowScheduleIndex != checkindex)
			{
				if(inEmergencyAlert != true){startDuration(checkindex,-1);}
			}
			nowScheduleIndex = checkindex;
			if(nowScheduleIndex == -1)
			{
				if(defaultlayout=="unavailable")
				{
					showerror("No Content");
					return;
				}

			}

			console.log("nowScheduleIndex="+nowScheduleIndex);
		}

		function startDuration(schid,start_layout_idx) {
			clearInterval(nowDurationIntervalHandle);
			//$("#layout_iframe0").addClass('hide');
			//$("#layout_iframe1").addClass('hide');
			var t = 0;
			var mt = 0;
			if(schid == -1)
			{
				showerror("No Content");
				return;
			}
			var aHourLayouts = layout[schid];
			var aHourLayouts_count = layout[schid].length;
			var aHourLayouts_playidx = (start_layout_idx == -1)?0:start_layout_idx;
			var aHourLayouts_playedtime = new Array();
			aHourLayouts_playedtime[aHourLayouts_playidx] = 0;
			if(nowPlayingLayoutId == aHourLayouts[aHourLayouts_playidx].id){
				aHourLayouts_playedtime[aHourLayouts_playidx]  = aHourLayouts[aHourLayouts_playidx].duration - nowLayoutRemainsSeconds;
				console.log("Continuing original layout = "+aHourLayouts[aHourLayouts_playidx].id+" time="+aHourLayouts_playedtime[aHourLayouts_playidx]);
			}
			var initloop = false;
			//for first showing
			preloadlayout(aHourLayouts[aHourLayouts_playidx].id,nowPlayingLayoutId,0,aHourLayouts[aHourLayouts_playidx].duration,aHourLayouts[aHourLayouts_playidx].videoduration,-1,true,aHourLayouts_count);
			showlayout(aHourLayouts[aHourLayouts_playidx].id,nowPlayingLayoutId);

			if(aHourLayouts_count>1)
			{
				n_aHourLayouts_playidx = aHourLayouts_playidx + 1;
				if(n_aHourLayouts_playidx>=aHourLayouts_count){n_aHourLayouts_playidx=0};
				var preloadingTime = aHourLayouts[n_aHourLayouts_playidx].duration/2;
			}else
			{
				var preloadingTime = 0;
			}

			if(aHourLayouts_count>1)
			{

				nowDurationIntervalHandle = setInterval(function(){

					if(initloop == false && nowLayoutRemainsSeconds>0){console.log("nowLayoutRemainsSeconds="+nowLayoutRemainsSeconds)}
					initloop = true;
					if(aHourLayouts[aHourLayouts_playidx].videoAlignment > 0)
					{
						if(aHourLayouts[aHourLayouts_playidx].id == event_layoutid)
						{
							if(event_message.match('videoplayend'))
							{
								console.log('layout '+ aHourLayouts[aHourLayouts_playidx].id+' video is playend force to show next layout!' );
								ohSnap('layout '+ aHourLayouts[aHourLayouts_playidx].id+' video is playend force to show next layout!'  , 'red');
								//----------AAAAAAA-------is Mapping to BBBBBBB
								if(preloadingTime!=-1 &&  aHourLayouts_playedtime[aHourLayouts_playidx] < (aHourLayouts[aHourLayouts_playidx].duration-preloadingTime) ){
									preloadingTime = 0;
									console.log("set preloadingTime="+preloadingTime)
								}
								aHourLayouts_playedtime[aHourLayouts_playidx] = aHourLayouts[aHourLayouts_playidx].duration;
							}
							event_layoutid = -1;
							event_message = "";
						}
					}

					mt++;
					if(inEmergencyAlert == true){
						SaveSCH.scheduleid = schid;
						SaveSCH.aHourLayouts_playidx = aHourLayouts_playidx;
						return;
					}
					if(mt%5!=0){
						return;
					}
					console.log("t=",t);
					console.log("aHourLayouts_playedtime="+aHourLayouts_playedtime)
					console.log("preloadingTime1="+preloadingTime)

					if(preloadingTime>MAX_PRELOADING_TIME){preloadingTime = MAX_PRELOADING_TIME;}
					console.log("aHourLayouts_playedtime[aHourLayouts_playidx]="+aHourLayouts_playedtime[aHourLayouts_playidx])
					if(preloadingTime!=-1){
						console.log("-=--=--=--=--=--=--=--=--=> aHourLayouts[aHourLayouts_playidx].duration="+aHourLayouts[aHourLayouts_playidx].duration);
						console.log("-=--=--=--=--=--=--=--=--=> preloadingTime="+preloadingTime);
						console.log("-=--=--=--=--=--=--=--=--=> aHourLayouts[aHourLayouts_playidx].duration-preloadingTime ="+(aHourLayouts[aHourLayouts_playidx].duration-preloadingTime) );
						console.log("-=--=--=--=--=--=--=--=--=> aHourLayouts[aHourLayouts_playidx].videoAlignment ="+aHourLayouts[aHourLayouts_playidx].videoAlignment);
					}
					// Preloading iframe
					var findNextIsVideoLayout = false;
					//----------BBBBBB-------is Mapping to AAAAAAAA
					if(preloadingTime!=-1 && aHourLayouts_playedtime[aHourLayouts_playidx] >= (aHourLayouts[aHourLayouts_playidx].duration-preloadingTime) )
					{
						next_aHourLayouts_playidx=aHourLayouts_playidx+1;
						if(next_aHourLayouts_playidx>=aHourLayouts_count){next_aHourLayouts_playidx=0};
						if(DISABLE_VIDEO_PRELOADING && aHourLayouts[next_aHourLayouts_playidx].videoduration>0)
						{
							findNextIsVideoLayout = true;
							console.log("Next is video layout!!");
							if( preloadingTime > MIN_PRELOADING_TIME){preloadingTime = MIN_PRELOADING_TIME;}
						}
						if(aHourLayouts_playedtime[aHourLayouts_playidx] >= (aHourLayouts[aHourLayouts_playidx].duration-preloadingTime))
						{
							var cleanNowLayout = false;
							if(isLinuxPD == true && findNextIsVideoLayout == true && aHourLayouts[aHourLayouts_playidx].videoduration>0){console.log("cleanNowLayout = true;");cleanNowLayout = true;}
							ohSnap('preloadlayout...'+ aHourLayouts[next_aHourLayouts_playidx].id + ' time=' + preloadingTime, 'red');
							preloadlayout(aHourLayouts[next_aHourLayouts_playidx].id,aHourLayouts[aHourLayouts_playidx].id,preloadingTime,aHourLayouts[next_aHourLayouts_playidx].duration,aHourLayouts[next_aHourLayouts_playidx].videoduration,aHourLayouts[next_aHourLayouts_playidx].videoAlignment,cleanNowLayout,aHourLayouts_count);
							preloadingTime = -1;
						}
						//aHourLayouts_playedtime[aHourLayouts_playidx] = 0;
					}

					// Really Showing iframe
					if(aHourLayouts_playedtime[aHourLayouts_playidx] >= aHourLayouts[aHourLayouts_playidx].duration )
					{
						lastLayoutId = aHourLayouts_playidx;
						aHourLayouts_playidx++;
						if(aHourLayouts_playidx>=aHourLayouts_count){aHourLayouts_playidx=0};
						//nowShowingFrame = !nowShowingFrame;
						setTimeout(function(){showlayout(aHourLayouts[aHourLayouts_playidx].id,aHourLayouts[lastLayoutId].id);},10);
						aHourLayouts_playedtime[aHourLayouts_playidx] = 0;
						if(aHourLayouts_count>1)
						{
							next_aHourLayouts_playidx=aHourLayouts_playidx+1;
							if(next_aHourLayouts_playidx>=aHourLayouts_count){next_aHourLayouts_playidx=0};
							preloadingTime = aHourLayouts[next_aHourLayouts_playidx].duration/2;
						}else
						{
							preloadingTime = 0;
						}

					}
					aHourLayouts_playedtime[aHourLayouts_playidx]++;
					nowLayoutRemainsSeconds = aHourLayouts[aHourLayouts_playidx].duration - aHourLayouts_playedtime[aHourLayouts_playidx];
					t++;

					if(inEmergencyAlert == true){
						SaveSCH.scheduleid = schid;
						SaveSCH.aHourLayouts_playidx = aHourLayouts_playidx;
						return;
					}

				},200);
	    	}

		}
		function preloadlayout(layoutid,lastlayoutid,starttime,playingtime,videoduration,videoAlignment,cleanNowLayout,aHourLayouts_count) {
			if(layoutid == nowPlayingLayoutId)
			{
				ohSnap('preload Same layout id'+ layoutid , 'yellow');
				return;
			}
			var filename = "index.html"; //layout filename
			if(videoAlignment>0){playingtime = playingtime-more_time_to_alignment;}
			//finalurl = 'layout_'+append+'/layout_' + layoutid + '/' + filename + "?ps=" + secretKey + "&serveraddress=" + serverAddress + "&root=" +rootpath + "&starttime=" + starttime + "&portrait=" + portrait + "&mode=" + mode;
			var finalurl = 'layout_'+append+'/layout_' + layoutid + '/' + filename + "?ps=" + secretKey + "&layoutid=" + layoutid + "&starttime=" + starttime + "&playingtime=" + playingtime + "&videoduration=" + videoduration + "&ahourlayoutscount=" + aHourLayouts_count + "&portrait=" + portrait + "&mode=" + mode + "&parenturi=" + ((url.indexOf('?')>-1)?(url.substring(0,url.indexOf('?'))):(url));
			console.log("---------------------------------------->showing layoutid="+layoutid+";finalurl="+finalurl);
			if (finalurl.trim() == ""){
				showerror("No Content");
				return;
			}else{
				clearerror();
			}
			var showingFrame = nowShowingFrame;
			//if(showingFrame == true){showingFrame=1}else{showingFrame=0};
			if(cleanNowLayout == true){
				if(lastlayoutid!=-1){$("#layout_iframe"+(showingFrame?1:0))[0].contentWindow.postMessage("index.html?layoutid="+lastlayoutid+"&status=cleanupVideo",'*');}
				setTimeout(function(){$("#layout_iframe"+(showingFrame?1:0)).attr('src','');$("#layout_iframe"+showingFrame?1:0).addClass('hide');},50);
			}
			var preloadingFrame = !nowShowingFrame;

			//if(preloadingFrame == true){preloadingFrame=1}else{preloadingFrame=0};

			$("#layout_iframe"+(preloadingFrame?1:0)).css('opacity','0.01');
			$("#layout_iframe"+(preloadingFrame?1:0)).removeClass('hide');
			$("#layout_iframe"+(preloadingFrame?1:0)).attr('preloading','true');
			if(cleanNowLayout == true){
				setTimeout(function(){$("#layout_iframe"+(preloadingFrame?1:0)).attr('src', finalurl+"&t="+(new Date()).getTime());},100);
			}else{
				ohSnap('preloadlayout layout  '+ layoutid , 'green');
				$("#layout_iframe"+(preloadingFrame?1:0)).attr('src', finalurl+"&t="+(new Date()).getTime());
			}


		}
		function showlayout(layoutid,lastlayoutid) {
			if(layoutid == nowPlayingLayoutId)
			{
				ohSnap('show Same layout id'+ layoutid , 'yellow');
				return;
			}
			nowShowingFrame = !nowShowingFrame;
			var showingFrame = nowShowingFrame;
			var preloadingFrame = !nowShowingFrame;
			//if(showingFrame == true){showingFrame=1}else{showingFrame=0};
			//if(preloadingFrame == true){preloadingFrame=1}else{preloadingFrame=0};
			if(typeof Android != "undefined")
			{
				if(typeof Android.NativeRemoveAllAndroidViews != "undefined"){
					console.log('call NativeRemoveAllAndroidViews');
					ohSnap('NativeRemoveAllAndroidViews' , 'yellow');
					Android.NativeRemoveAllAndroidViews();
				}
			}
			if(isLinuxPD == true && lastlayoutid!=-1){
				ohSnap('(showlayout)cleanupVideo'+ lastlayoutid , 'yellow');
				if(lastlayoutid!=-1){
					//$("#layout_iframe"+(showingFrame?1:0))[0].contentWindow.postMessage("index.html?layoutid="+lastlayoutid+"&status=cleanupVideo",'*');
					$("#layout_iframe"+(preloadingFrame?1:0))[0].contentWindow.postMessage("index.html?layoutid="+lastlayoutid+"&status=cleanupVideo",'*');
				}
			}
			ohSnap('show layout  '+ layoutid , 'green');


			//$("#layout_iframe0")[0].contentWindow.postMessage("index.html?layoutid="+layoutid+"&status=launchnow",'*');
			//$("#layout_iframe1")[0].contentWindow.postMessage("index.html?layoutid="+layoutid+"&status=launchnow",'*');
			if(EnableFadeInPlay == true && isLinuxPD != true)
			{
				if(isLinuxPD == true){
					var FXTIMEDIFF = 50;
					var FXSPEED = 200;
				}else{
					var FXTIMEDIFF = 20; //Android
					var FXSPEED = 500; //Android
				};
 				function fadeIn(element,speed,fun) {
 					var dif = FXTIMEDIFF/speed;
				    var op = 0.01;  // initial opacity
				    var timer = setInterval(function () {
				        if (op >= 1){
				            clearInterval(timer);
				            return;
				        }
				        element.style.opacity = EasingFunctions.swing(op);
				        //element.style.filter = 'alpha(opacity=' + op * 100 + ")";
				        op = op + dif; //op += op * 0.1;
				        if (op >= 1){
							element.style.opacity = 1;
				            fun();
				        }
				    }, FXTIMEDIFF);
				}
				function fadeOut(element,speed,fun) {
					var dif = FXTIMEDIFF/speed;
				    var op = 1;  // initial opacity
				    var timer = setInterval(function () {
				        if (op <= 0.1){
				            clearInterval(timer);
				            return;
				        }
				        element.style.opacity = EasingFunctions.swing(op);
				       // element.style.filter = 'alpha(opacity=' + op * 100 + ")";
				        op = op - dif;
				        if (op <= 0.1){
				        	element.style.opacity = 0;
				            fun();
				        }
				    }, FXTIMEDIFF);
				}
				function beforefun(){
					ohSnap('(beforefun)launchnow  '+ layoutid , 'orange');
					if(mode == 'Android' || mode == 'android'){setTimeout(function(){$("#layout_iframe"+(showingFrame?1:0))[0].contentWindow.postMessage("index.html?layoutid="+layoutid+"&status=launchnow",'*');},10);}
					else{$("#layout_iframe"+(showingFrame?1:0))[0].contentWindow.postMessage("index.html?layoutid="+layoutid+"&status=launchnow",'*');}
				}
				ohSnap('(Show)launchnow  '+ layoutid , 'orange');
				$("#layout_iframe"+(showingFrame?1:0)).removeClass('hide');
				fadeIn(document.getElementById('layout_iframe'+(showingFrame?1:0)),FXSPEED,beforefun);

				function afterfun(){
						ohSnap('(afterfun)layoutid=  '+ layoutid , 'orange');
						$("#layout_iframe"+(preloadingFrame?1:0)).attr('src','');
						$("#layout_iframe"+(preloadingFrame?1:0)).addClass('hide');

				}
				fadeOut(document.getElementById('layout_iframe'+(preloadingFrame?1:0)),FXSPEED,afterfun);

				//$("#layout_iframe"+(showingFrame?1:0)).animate({opacity:1},1000);
				//$("#layout_iframe"+(preloadingFrame?1:0)).animate({opacity:0},1000,"linear",function() {
				// Animation complete
				//	$("#layout_iframe"+(preloadingFrame?1:0)).attr('src','');
				//	$("#layout_iframe"+(preloadingFrame?1:0)).addClass('hide');
  				//});
			}else
			{
				ohSnap('launchnow  '+ layoutid , 'orange');
				$("#layout_iframe"+(showingFrame?1:0)).attr('preloading','false');
				if(mode == 'Android' || mode == 'android')
				{
					setTimeout(function(){$("#layout_iframe"+(showingFrame?1:0))[0].contentWindow.postMessage("index.html?layoutid="+layoutid+"&status=launchnow",'*');},10);
					$("#layout_iframe"+(showingFrame?1:0)).css('opacity','1');
					$("#layout_iframe"+(showingFrame?1:0)).removeClass('hide');
					$("#layout_iframe"+(preloadingFrame?1:0)).addClass('hide');
					$("#layout_iframe"+(preloadingFrame?1:0)).attr('src','');
					$("#layout_iframe"+(preloadingFrame?1:0)).css('opacity','0');
				}else if(isLinuxPD == true){


					$("#layout_iframe"+(showingFrame?1:0))[0].contentWindow.postMessage("index.html?layoutid="+layoutid+"&status=launchnow",'*');
					$("#layout_iframe"+(showingFrame?1:0)).css('opacity','1');
					$("#layout_iframe"+(showingFrame?1:0)).removeClass('hide');
					//setTimeout(function(){$('.showframe').each(function(){if(parseFloat($(this).css('opacity'))==0.02 && $(this).attr('preloading')=='false'){$(this).addClass('hide');$(this).attr('src',''); }})},30000);
					//$("#layout_iframe"+(preloadingFrame?1:0)).css('opacity','0.02');
					$("#layout_iframe"+(preloadingFrame?1:0)).addClass('hide');
					$("#layout_iframe"+(preloadingFrame?1:0)).attr('src','');
					$("#layout_iframe"+(preloadingFrame?1:0)).css('opacity','0');
				}else
				{
					$("#layout_iframe"+(showingFrame?1:0))[0].contentWindow.postMessage("index.html?layoutid="+layoutid+"&status=launchnow",'*');
					$("#layout_iframe"+(showingFrame?1:0)).css('opacity','1');
					$("#layout_iframe"+(showingFrame?1:0)).removeClass('hide');
					$("#layout_iframe"+(preloadingFrame?1:0)).addClass('hide');
					$("#layout_iframe"+(preloadingFrame?1:0)).attr('src','');
					$("#layout_iframe"+(preloadingFrame?1:0)).css('opacity','0');
				}

			}

			nowPlayingLayoutId = layoutid;
		}
		function rotate(id)
		{
			deg = 270;
			if(deg!=0)
			{
				if(deg == 90)
				{
					var factor = 1;
				}else if(deg == -90 || deg == 270){
					var factor = -1;
				}
				if(deg == 180)
				{
					var offset_x = offset_y = 0;
				}else
				{
					var offset_x = factor*(self.innerHeight - self.innerWidth)/2;
					var offset_y = offset_x;
				}
				document.getElementById(id).style.transform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
				document.getElementById(id).style.msTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
				document.getElementById(id).style.webkitTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
				document.getElementById(id).style.MozTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
				document.getElementById(id).style.OTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
				document.getElementById(id).style.height = self.innerWidth;
				document.getElementById(id).style.width = self.innerHeight;
				$(id).addClass('rotate-mode');
			}
		}
		function rotateItem(id,deg)
		{
			var deg = deg % 360;
			var deg = 360-deg;

			var offset_x = offset_y = 0;
			document.getElementById(id).style.transform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
			document.getElementById(id).style.msTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
			document.getElementById(id).style.webkitTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
			document.getElementById(id).style.MozTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
			document.getElementById(id).style.OTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
			//document.getElementById(id).style.height = self.innerWidth;
			//document.getElementById(id).style.width = self.innerHeight;
			$('#'+id).addClass('rotate-mode');

		}

		function showtime(){
			var now,hours,minutes,seconds,timeValue;
			now = new Date();
			var month = now.getMonth()+1;
			var day = now.getDate();
			var year = now.getFullYear();
			hours = now.getHours();
			minutes = now.getMinutes();
			seconds = now.getSeconds();
			timeValue = "";
			timeValue += year + "/";
			timeValue += month + "/";
			timeValue += day + "  &nbsp;";
			//timeValue += (hours >= 12) ? "pm " : "am ";
			//timeValue += ((hours > 12) ? hours - 12 : hours) + " :";
			timeValue += (hours) + ":";
			timeValue += ((minutes < 10) ? "0" : "") + minutes + ":";
			timeValue += ((seconds < 10) ? "0" : "") + seconds + " ";
			return timeValue;

		}


		function showerror(msg){
			console.log("showerror="+msg)
			if(msg == "Authentication Failure")
			{
				var textcolor = "rgb(197, 74, 74)";
			}else if(msg == "No Schedule")
			{
				var textcolor = "rgba(78, 154, 46, 0.721569)";
			}else
			{
				var textcolor = "rgba(255, 255, 255, 0.72)";
			}
			var textcolor = "rgba(0, 0, 0, 0.72)";
			var deg = 0;
			errorInterval = setInterval(function(){
				$('#error_text').html(showtime());
				//rotateItem('error_wrapper',deg);
				deg++;
			},1000);

			//$('body').css('background-image','url(js/no_signal.gif)');

			$('.error').css('color',textcolor);
			$('#error').removeClass('hide');
			$('#layout_iframe1').addClass('hide');
			$('#layout_iframe0').addClass('hide');
		}

		function clearerror()
		{
			clearInterval(errorInterval);
			//$('#layout_iframe').removeClass('hide');
			$('#error').addClass('hide');
		}


		function ohSnap(text, color) {

		  if(!OPEN_DEBUG_MESSAGE_ON_SCREEN){
		  	return;
		  }
		  // text : message to show (HTML tag allowed)
		  // Available colors : red, green, blue, orange, yellow --- add your own!

		  // Set some variables
		  var time = '9000';
		  var $container = $('#ohsnap');

		  // Generate the HTML
		  var html = '<div class="alert alert-' + color + '">' + text + '</div>';

		  // Append the label to the container
		  $container.append(html);

		  // After 'time' seconds, the animation fades out
		  setTimeout(function () {
		    ohSnapX($container.children('.alert').first());
		  }, time);
		}

		function ohSnapX(element) {
		  // Called without argument, the function removes all alerts
		  // element must be a jQuery object

		  if (typeof element !== "undefined" ) {
		    element.remove();
		  } else {
		    $('.alert').remove();
		  }
		}

		// Remove the notification on click
		/*
		$('.alert').live('click', function() {
		  ohSnapX($(this))
		});
		*/

		function reportVideoPlayEnd(){
			ohSnap('reportVideoPlayEnd ('+ nowPlayingLayoutId+') !'  , 'blue');
			$('.showframe').each(function(){
				console.log($(this).attr('id'));
				$("#"+$(this).attr('id'))[0].contentWindow.postMessage("index.html?layoutid="+nowPlayingLayoutId+"&status=reportVideoEnd",'*');
			})
		}

		//http://easings.net/zh-tw
		EasingFunctions = {
	 	  swing: function (t) { var PI = 3.14; return ( -Math.cos(t * PI) / 2 ) + 0.5; },
		  // no easing, no acceleration
		  linear: function (t) { return t },
		  // accelerating from zero velocity
		  easeInQuad: function (t) { return t*t },
		  // decelerating to zero velocity
		  easeOutQuad: function (t) { return t*(2-t) },
		  // acceleration until halfway, then deceleration
		  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
		  // accelerating from zero velocity
		  easeInCubic: function (t) { return t*t*t },
		  // decelerating to zero velocity
		  easeOutCubic: function (t) { return (--t)*t*t+1 },
		  // acceleration until halfway, then deceleration
		  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
		  // accelerating from zero velocity
		  easeInQuart: function (t) { return t*t*t*t },
		  // decelerating to zero velocity
		  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
		  // acceleration until halfway, then deceleration
		  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
		  // accelerating from zero velocity
		  easeInQuint: function (t) { return t*t*t*t*t },
		  // decelerating to zero velocity
		  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
		  // acceleration until halfway, then deceleration
		  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
		}


		//=======================EVENT==========================
		var HttpProtocol = "http://";
		var NowER = {
				id : '',
				url : '',
		};
		var LastER = {
				id : '',
				url : '',
		};
		function startEvent(){

				console.log("serverAddress="+serverAddress);
				console.log("groupCode="+hardwareKey);
				if(serverAddress!="" && serverAddress.length>0)
				{
					$('#getevent').attr('src','getevent.html?serveraddress='+serverAddress+'&hardwarekey='+hardwareKey+'&t=' + ((new Date()).getTime()));
				}

		}

		function getEventApiSuccess(ERing,eventid,url){
			if(initedScheduler == false){return;}
			console.log("ER="+ERing);
			if(ERing == "ERing")
			{
				NowER.id = eventid;
        NowER.url = HttpProtocol + serverAddress + url;
				if(NowER.url != LastER.url){
					inEmergencyAlert = true;
					if(isLinuxPD == true){
							$("#layout_iframe0")[0].contentWindow.postMessage("index.html?layoutid="+nowPlayingLayoutId+"&status=cleanupVideo",'*');
							$("#layout_iframe1")[0].contentWindow.postMessage("index.html?layoutid="+nowPlayingLayoutId+"&status=cleanupVideo",'*');
					}else {
							if(typeof Android != "undefined")
							{
								if(typeof Android.NativeRemoveAllAndroidViews != "undefined"){
									console.log('call NativeRemoveAllAndroidViews');
									ohSnap('NativeRemoveAllAndroidViews' , 'yellow');
									Android.NativeRemoveAllAndroidViews();
								}
							}
					}

					nowPlayingLayoutId = -1;
					$("#layout_iframe0").attr('src','empty.html');
					$("#layout_iframe1").attr('src','empty.html');
					$("#layout_iframe0").addClass('hide');
					$("#layout_iframe1").addClass('hide');
					setTimeout(function(){
								clearInterval(nowDurationIntervalHandle);
							 nowPlayingLayoutId = -1;
								$("#layout_iframe0").attr('src','empty.html');
								$("#layout_iframe1").attr('src','empty.html');
								$("#layout_iframe0").addClass('hide');
								$("#layout_iframe1").addClass('hide');
							setTimeout(function(){
								$('#event_iframe').removeClass('hide');
								var loadingERURL = NowER.url+"?t=" + ((new Date()).getTime());
								$('#event_iframe').attr('src',loadingERURL);
								ohSnap('Loading ' + loadingERURL , 'blue');
							},100)
					},800);
					LastER.url = NowER.url;
					LastER.id = NowER.id
				}
			}else if(ERing == "NotER"){
				if(NowER.url != '')
				{
					inEmergencyAlert = false;
					$('#event_iframe').addClass('hide');
					$('#event_iframe').attr('src','empty.html');
					if(nowScheduleIndex == -1)
					{
						if(hasDefaultLayout == false)
						{
							showerror("No Content");
							return;
						}
					}
					if(nowScheduleIndex == SaveSCH.scheduleid)
					{
							startDuration(nowScheduleIndex,SaveSCH.aHourLayouts_playidx);
					}else{
							startDuration(nowScheduleIndex,-1);
					}
					NowER.url = '';
					LastER.url = '';
				}
			}else{
				//Disconnected!
			}
		}
