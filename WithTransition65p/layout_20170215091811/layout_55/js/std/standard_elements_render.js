//Render Mode
// 1.renderMode="std" : Rener all json data with same rules & all media elements will auto fit the screen.
//  EX: (index.html)
//  <div id="region_1" renderMode="std" class=""></div>
//
// 2.renderMode="replace" :  only replace text of div tag & src attritube of img tag with Json.
//  EX: (index.html)
//	<div id="region_1" renderMode="replace" >
//		<img id="media_1_1" class="logo logo-position" />
//	</div>
//
// 3.renderMode="toArray" : all Json data elements pass to JavaScript Array with attribute - dataSaveToJavaScriptArray="XXXXX"
//	EX: (index.html)
//	<div id="region_2" renderMode="toArray" dataSaveToJavaScriptArray="sdata"></div>
//
//	(template.js):
//	//If your json data with "type":["image","text","text"], you need to claim 3 arrays to save the json data.
//	var sdata_1 = []; //image
//	var sdata_2 = []; //text
//	var sdata_3 = []; //text
var launchnow = false;
var layoutid = 0;
var layoutStatus = "";
var bEnableMultiNode = true;
var gPortraitDegree = 0;
var isPreview = false;
var sizelab_baseWidth=1920;
var sizelab_baseHeight=1080;
var CMSNODETYPE = "ONENODE";
var isRunningOnAndroid = false;
var starttime = 0;
var playingtime = 0;
var videoduration = 0;
var videototalloopnum = 0;
var launchIdList = [];
var failbackTimeOut = null;
function sendMessageToParent(message)
{
	window.parent.postMessage("index.html?layoutid="+layoutid+"&message="+message,'*');
}
function showMessageOnParent(message)
{
	window.parent.postMessage("index.html?layoutid="+layoutid+"&message=log: "+message,'*');
}
function LaunchLayout()
{
	console.log('LaunchLayout!LaunchLayout!LaunchLayout!');
	if(launchnow != true)
	{
		clearTimeout(failbackTimeOut);
		showMessageOnParent(" lauchNow()!!");
		//$('#Android').trigger('click');
		var eventlauch = document.createEvent('Event');
		eventlauch.initEvent('lauchNow', true, true);
		var android_cb = document.getElementById('Android');
		android_cb.dispatchEvent(eventlauch);
		for(var j=0;j<launchIdList.length;j++){ var cb = document.getElementById(launchIdList[j]);  cb.dispatchEvent(eventlauch);}
		launchnow = true;
	}
}
window.addEventListener('message', function(event) {
	function getParameter(url, name) {
		return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
	}
	if(layoutid.match(getParameter(event.data,'layoutid'))){
	 	layoutStatus = getParameter(event.data,'status');
	 	if(layoutStatus.match('launchnow')){
	 		console.log("lauchNow ~~ lauchNow ~~ lauchNow ~~ lauchNow");
	 		LaunchLayout();
	 	}else if(layoutStatus.match('cleanupVideo')){
	 		console.log("cleanupVideo ~~ cleanupVideo ~~ cleanupVideo ~~ cleanupVideo");
	 		showMessageOnParent("cleanupVideo("+layoutid+")")
			try {$('.gallery').each(function(){if($(this).attr('type')=='video' || $(this).attr('type')=='android_video'){videototalloopnum=1;var nowplay = $(this).attr('nowplaying'); $(this).attr('nowloop','2'); console.log("nowplay ="+nowplay); var vid = $($(this).find('video').get(parseInt(nowplay-1))).attr('id'); console.log(vid);$(this).find('.elm').each(function(){$(this).remove();}); $(this).find('video').each(function(){if($(this).attr('id')!=vid){$(this).remove();}});var video = document.getElementById(vid); console.log(video);video.currentTime = Math.ceil(video.duration);}  })}catch (e) {}
	 		setTimeout(function(){$('video').each(function(){document.getElementById($(this).attr('id')).pause()});},100);
	 		setTimeout(function(){$('video').each(function(){$(this).remove();});},300);
	 		setTimeout(function(){$('.onlinevideo').each(function(){$(this).remove();});},300);
	 	} if(layoutStatus.match('reportVideoEnd')){
	 		console.log("reportVideoPlayEnd ~~ reportVideoPlayEnd ~~ reportVideoPlayEnd ~~ reportVideoPlayEnd");
	 		reportVideoEnd();
	 	}
	}
});
$(document).ready(function () {
	layoutid = getParameterFromURL(document.location.href,'layoutid');
	if(getParameterFromURL(document.location.href,'preview') == 'true')
	{
		isPreview = true;
		console.log('Preview Mode!!');
		bEnablePortraitVideoFix = false;
	}
	if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/android/i))
	{
		isRunningOnAndroid = true;
		console.log('SmartCMS content running on Android !!');
	}
	if(getParameterFromURL(document.location.href,'mode') == 'Android' || getParameterFromURL(document.location.href,'mode') == 'android')
	{
		isRunningOnAndroid = true;
		console.log('SmartCMS content setting is Android Mode !!');
	}
	if(isRunningOnAndroid == true){
		$('head').append('<style>video{object-fit:fill;}</style>');
	}
		$('body').append('<div id="Android"></div>')

	starttime = getParameterFromURL(document.location.href,'starttime');
	if(starttime != undefined)
	{
		console.log("The Layout has Starttime!("+starttime+")");
	}else
	{
		starttime = 0;
		console.log("!!! starttime="+starttime);
	}
	if(parseInt(starttime) == 0)
	{
		launchnow = true;
	}
	failbackTimeOut = setTimeout(function(){LaunchLayout()},(parseInt(starttime)+10)*1000);//fail back

	playingtime = getParameterFromURL(document.location.href,'playingtime');
	if(playingtime != undefined){console.log("The Layout has playingtime!("+playingtime+")");}else{playingtime = 0;console.log("!!! playingtime="+playingtime);}
	videoduration = getParameterFromURL(document.location.href,'videoduration');
	if(videoduration != undefined){console.log("The Layout has videoduration!("+videoduration+")");}else{videoduration = 0;console.log("!!! videoduration="+videoduration);}
	if(playingtime != undefined && videoduration != undefined){videototalloopnum = Math.floor(playingtime/videoduration);console.log("videototalloopnum="+videototalloopnum)}
	var ahourlayoutscount = getParameterFromURL(document.location.href,'ahourlayoutscount');
	if(ahourlayoutscount != undefined && parseInt(ahourlayoutscount) == 1){videototalloopnum=0;}

	require.config({
		paths: {
			"interactive_tw": "js/std/interactive_tw",
			"interactive_en": "js/std/interactive_en",
			"d3.v3.min": "js/std/d3.v3.min",
			"awardrotate": "activites/roulette/awardrotate",
			"roulette_tw": "activites/roulette/roulette_tw",
			"roulette_en": "activites/roulette/roulette_en",
		}
	});

	stdRender.render(pagejson);

	stdRender.copyElmIfOnlyOne();
	if(isPreview == true)
	{
		stdRender.genPreviewModeLayout();
	}
	//setTimeout(function(){
		if(typeof bEnableTransition  != "undefined") //settingjs is loaded!
		{
			initLayout(); //@ std/layout.js
		}

		//if(stdRender.useClock == true){
		if($('.digiclock').length > 0){
			clock.render();
		}


		if( typeof doSpecialRender  !=  "undefined")
			doSpecialRender(); //@template_XXXX.js

		$('.macho').each(function(){$(this).macho();});

		//initSizeLab();
		if(typeof doAndroidNativeRender != "undefined"){console.log("go go Android Native!");doAndroidNativeRender(starttime);}

	//},100);
});

var stdRender = {
	jobj : null,
	defaultDuration : 5,
	useClock : false,
	zid : "",
	zidbg : "",
	render : function(json){
		this.parseJson(json);

	},
	getZid : function(id) {
		if(id == 1)
			return ""
		else
			return id;
	},
	OrderIdxByZindex : function(array) {

      var orderedarray = array;
      orderedarray.sort(function(a, b){
      	var ax = a.zindex;
      	var bx = b.zindex;
      	if(a.zindex==undefined || a.zindex == "")
      	{
      		ax = 999;
      	}
      	if(b.zindex==undefined || b.zindex == "")
      	{
      		bx = 999;
      	}
      	return ax-bx;
      });
      return orderedarray;
    },
    OrderIdxById : function(array) {
      var orderedarray = array;
      orderedarray.sort(function(a, b){
      	var ai = a.id;
      	var bi = b.id
      	if(a.zindex!=undefined && a.zindex != "")
      	{
      		ai = 0;
      	}
      	if(b.zindex!=undefined && b.zindex != "")
      	{
      		bi = 0;
      	}
      	return ai-bi;
      });
      return orderedarray;
    },
	parseJson : function(json){

		//json = json.replace(/\s/g,'&nbsp;');

		var jobj = jQuery.parseJSON(json);
		this.jobj = jobj;

		if(jobj.portrait!=undefined)
		{
			gPortraitDegree = parseInt(jobj.portrait);
		}
		if( (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true && bEnablePortraitVideoFix == true && bEnableMultiNode == true)
		{
			CMSNODETYPE = "MULTINODE";
			stdRender.zidbg = 0;
			stdRender.zid = 1;
			stdRender.addCMSNode(stdRender.zidbg,stdRender.zidbg);
			stdRender.addCMSNode(stdRender.zid,stdRender.zid);
		}
		if((typeof template_width) == "undefined")
		{
			console.log("template_width is undefined!!!");
			if(gPortraitDegree == 90 || gPortraitDegree == 270)
			{
				if($('body').attr('width')==undefined || $('body').attr('height')==undefined )
				{
					if(jobj.width!=undefined && jobj.height!=undefined)
					{
						$('body').attr('width',jobj.width);
						$('body').attr('height',jobj.height);
						sizelab_baseWidth = jobj.width;
						sizelab_baseHeight = jobj.height;
					}else
					{
						$('body').attr('width','1080');
						$('body').attr('height','1920');
						sizelab_baseWidth = 1080;
						sizelab_baseHeight = 1920;
					}
				}
			}else
			{
				if($('body').attr('width')==undefined || $('body').attr('height')==undefined )
				{
					if(jobj.width!=undefined && jobj.height!=undefined)
					{
						$('body').attr('width',jobj.width);
						$('body').attr('height',jobj.height);
						sizelab_baseWidth = jobj.width;
						sizelab_baseHeight = jobj.height;
					}else{
						$('body').attr('width','1920');
						$('body').attr('height','1080');
						sizelab_baseWidth = 1920;
						sizelab_baseHeight = 1080;
					}
				}
			}

		}else
		{
				console.log("template_width is "+template_width);
				$('body').attr('width',template_width);
				$('body').attr('height',template_height);
				sizelab_baseWidth = template_width;
				sizelab_baseHeight = template_height;

		}


		var media_length = jobj.media.length;

		if(media_length>0)
		{

			jobj.media = stdRender.OrderIdxByZindex(jobj.media);
			jobj.media = stdRender.OrderIdxById(jobj.media);
			console.log(jobj.media)
			//for(var m in jobj.media)
			for(var m=0;m<jobj.media.length;m++)
			{
				var media = jobj.media[m];

				var region = new Object;
				region.id = media.id;
				region.x = media.x;
				region.y = media.y;
				region.width = media.width;
				region.height = media.height;
				region.zindex = media.zindex;
				region.type = media.type;
				region.isgroup = "false";
				region.transition = media.transition;
				region.duration = media.duration;
				region.jobj = jobj.media[m];
				region.portraitvideofix = false;


				var media_render_modex = $('#region_'+media.id).attr('renderMode');
				if(media_render_modex == undefined)
				{
					media_render_modex = $('#group_'+media.id).attr('renderMode');
				}
				console.log("media_render_modex="+media_render_modex);
				if(media.type.length == 1 && media.type[0]=='background')
				{
					var bghtml = '<img id="img-bg" bgsrc="'+media.data[0].elements[0]+'" />';
					$('#cms'+stdRender.zidbg).prepend(bghtml);
				}else

				//if(typeof(media_render_mode) == 'undefined' || (typeof(media_render_mode) != 'undefined' && media_render_mode[parseInt(media.id)-1] == "std"))
				if(media_render_modex == undefined || media_render_modex == "std")
				{
					console.log("media.type.length="+media.type.length);
					if(media.type.length > 1)
					{
						region.isgroup = "true";
						if(media.type.indexOf('slideshow')!=-1)
						{
							region.isgroup = "false";
						}
					}
					if(region.isgroup == "false")
					{
						region.htmlid = 'region_'+media.id;
						if($('#region_'+media.id).length == 0 )
						{
							stdRender.createRegion(region);
						}
						stdRender.setRegion(region);

						if( (region.type == 'video' || region.type == 'onlinevideo') && (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true && bEnablePortraitVideoFix == true)
						{
							var tmphtmlid = region.htmlid;
							region.htmlid = 'VIDEO_region_'+media.id;
							region.portraitvideofix = true;
							if($('#VIDEO_region_'+media.id).length == 0 )
							{
								stdRender.createRegion(region);
							}
							stdRender.setRegion(region);
							region.htmlid = tmphtmlid;
						}
					}else if(region.isgroup == "true")
					{
						region.groupid = 'group_'+media.id;
						if($('#group_'+media.id).length == 0 )
						{
							stdRender.createGroup(region);
						}
						stdRender.setGroup(region);
					}


					var i = 0;
					//for(var d in media.data)
					if(media.data == null)
					{
						//type == shape is no data
					}else{

						for(d = 0; d< media.data.length; d++)
						{
							console.log("d="+d)
							var data = media.data[d];
							i++;
							var obj = new Object;
							obj.id = media.id;

							obj.mId = i;
							obj.x = media.x;
							obj.y = media.y;
							obj.width = media.width;
							obj.height = media.height;
							obj.zindex = media.zindex;
							//obj.ctx_num = data.elements.length;

							if(data.transition!=undefined)
							{
								obj.transition = data.transition; // for image
							}else if(media.transition != undefined)
							{
								obj.transition = media.transition; // for image
							}
							obj.direction = media.direction; // for marquee


							//console.log("obj.ctx_num="+obj.ctx_num);
							//console.log("media.duration="+media.duration);
							obj.duration = (media.duration!=undefined?media.duration:stdRender.defaultDuration);
							if($('#region_'+obj.id)!=undefined || $('#VIDEO_region_'+obj.id)!=undefined)
							{
								if(data.duration!= undefined){
									obj.duration = data.duration;
								}else
								if(media.duration != undefined)
								{
									obj.duration = media.duration;
								}else
								if($('#region_'+obj.id).attr('duration')!=undefined)
								{
									obj.duration = $('#region_'+obj.id).attr('duration');
								}if($('#VIDEO_region_'+obj.id).attr('duration')!=undefined)
								{
									obj.duration = $('#VIDEO_region_'+obj.id).attr('duration');
								}else{
									obj.duration = 10;
								}
							}
							console.log("data.elements="+data.elements);
							if(data.elements.length == 1 || region.isgroup == "false")
							{
								obj.ctx = data.elements[0];
								obj.type = media.type[0];
								//obj.elements = data.elements;
								if(media.type.indexOf('slideshow')!=-1)
								{
									//obj.label = data.elements[media.type.indexOf('label')];
								}
								obj.htmlid = 'media_'+media.id+'_'+obj.mId;
								obj.regionid = region.htmlid;
								if((region.type == 'video' || region.type == 'onlinevideo') && (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true && bEnablePortraitVideoFix == true)
								{
									obj.regionid = "VIDEO_" + region.htmlid;
									obj.portraitvideofix = true;
								}
								obj.jobj = jobj.media[m];
								//obj.dataindex = d;

								if($('#media_'+media.id+'_'+obj.mId).length == 0)
								{
									this.createMedia(obj);
								}
								this.setMedia(obj);

							}else{
								//**BE ATTENTION** Group not support bEnablePortraitVideoFix
								var j=1;
								//var ctx = new Array();
								//var type = new Array();
								//for(var e in data.elements)
								for(var e=0; e<data.elements.length;e++)
								{

									region.htmlid =  'region_'+media.id+'_'+obj.mId+'_'+j;
									if(media.pos!=null)
									{
										obj.x = media.pos[j-1].x;
										obj.y = media.pos[j-1].y;
										obj.width = media.pos[j-1].width;
										obj.height = media.pos[j-1].height;
										obj.type = media.type[j-1];
										region.x = obj.x;
										region.y = obj.y;
										region.width = obj.width;
										region.height = obj.height;
										region.zindex = obj.zindex;
										region.jobj = jobj.media[m];
									}

									if($('#region_'+media.id+'_'+obj.mId+'_'+j).length == 0)
									{
										this.createRegion(region);
									}
									this.setRegion(region);

									var element = data.elements[e];
									obj.ctx = element;
									obj.type = media.type[j-1];
									obj.htmlid = 'media_'+media.id+'_'+obj.mId+'_'+j;
									//obj.dataindex = d;
									obj.regionid = region.htmlid;
									obj.jobj = jobj.media[m];

									if($('#media_'+media.id+'_'+obj.mId+'_'+j).length == 0)
									{
										this.createMedia(obj);
									}
									this.setMedia(obj);

									j++;
								}

							}


							//console.log("i="+i);


							//if(i==1)
							//{
							//	this.setMedia(obj);
							//}

						}

						if(media.data.length == 0)
						{
							$('#region_'+media.id).addClass('hide');
						}

					}

				}else
				//if(typeof(media_render_mode) != 'undefined'){ //isSpecial
				if(media_render_modex == "toArray"){

					var mediaIndexFromZero = parseInt(media.id)-1;

					var i = 0;
					for(var d in media.data)
					{

						var data = media.data[d];
						var j=1;
						var ctx = new Array();
						//var type = new Array();
						for(var e in data.elements)
						{
							var element = data.elements[e];
							//eval(media_render_mode[mediaIndexFromZero]+"_"+j)[i] = element;
							eval($('#region_'+media.id).attr('dataSaveToJavaScriptArray')+"_"+j)[i] = element;
							ctx[j] = element;
							//type[j] = media.type[j];
							j++;
						}
						i++;
					}
				}else
				if(media_render_modex == "replace"){

						var i = 0;
						for(var d in media.data)
						{
							var data = media.data[d];

							//var obj = new Object;
							//obj.id = media.id;
							//obj.mId = i;
							if(data.elements.length == 1)
							{
								//obj.ctx = data.elements[0];
								//obj.type = media.type[0];
								if(media.type[i] == "image" || media.type[i] == "logo" || media.type[i] == "slideshow" )
								{
									$('#media_'+media.id+'_'+(i+1)).attr('src',data.elements[0]);
								}else
								if(media.type[i] == "text"){
									$('#media_'+media.id+'_'+(i+1)).html(data.elements[0]);
								}else
								if(media.type[i] == "marquee"){
									$('#media_'+media.id+'_'+(i+1)).html(data.elements[0]);
								}
							}
							i++;
						}

				}

			}
		} //this.setContent();

	},
	createRegion : function(obj){
		var id = obj.id;
		var regionhtml = '<div id="'+obj.htmlid+'" duration="10" class="gallery"></div>';
		if(obj.isgroup == "false")
		{
			if(obj.portraitvideofix == true)
			{
				var regionhtml = '<div id="'+obj.htmlid+'" portraitvideofix="true" duration="10" class="gallery"></div>';
				if(CMSNODETYPE == "MULTINODE"){
					stdRender.zid++;
					stdRender.addCMSNode(stdRender.zid,stdRender.zid);
					$('#cms'+stdRender.getZid(stdRender.zid)).append(regionhtml);
					$('#cms'+stdRender.getZid(stdRender.zid)).addClass('cmsvideo');
					stdRender.zid++;
					stdRender.addCMSNode(stdRender.zid,stdRender.zid);
				}else
				{
					$('#cmsvideo').append(regionhtml);
				}

			}else
			{
				$('#cms'+stdRender.getZid(stdRender.zid)).append(regionhtml);
			}

		}else{
			$('#'+obj.groupid).append(regionhtml);
		}
		//
	},
	setRegion : function(obj){

		var id = obj.id;
		var templateWidth = parseInt($('body').attr('width'));
		var templateHeight = parseInt($('body').attr('height'));
		if(obj.portraitvideofix == true)
		{
			$('#'+obj.htmlid).attr('portraitvideofix','true');
		}
		//if(rendertype == "normal")
		{
			if($('#'+obj.htmlid).attr('left')==undefined){$('#'+obj.htmlid).attr('left',obj.x*templateWidth/100)};
			if($('#'+obj.htmlid).attr('top')==undefined){$('#'+obj.htmlid).attr('top',obj.y*templateHeight/100)};
			if($('#'+obj.htmlid).attr('width')==undefined){$('#'+obj.htmlid).attr('width',obj.width*templateWidth/100)};
			if($('#'+obj.htmlid).attr('height')==undefined){$('#'+obj.htmlid).attr('height',obj.height*templateHeight/100)};
			if($('#'+obj.htmlid).attr('zindex')==undefined){$('#'+obj.htmlid).attr('zindex',obj.zindex)};
		}
		var appearance = obj.jobj.appearance;
		if(appearance!=undefined)
		{
			if(appearance.framePicture!=undefined && appearance.framePicture!="")
			{
				if(appearance.framePicture!=undefined && appearance.framePicture!=""){$('#'+obj.htmlid).attr('frame',appearance.framePicture);}
				if(appearance.frameWidth!=undefined && appearance.frameWidth!=""){$('#'+obj.htmlid).attr('frameWidth',appearance.frameWidth);}
				if(appearance.frameOutWidth!=undefined && appearance.frameOutWidth!=""){$('#'+obj.htmlid).attr('frameOutWidth',appearance.frameOutWidth);}
			}else{
				if(appearance.frameColor!=undefined && appearance.frameColor!="")
				{
					if(appearance.frameColor!=undefined && appearance.frameColor!=""){$('#'+obj.htmlid).attr('frame',appearance.frameColor);}
					if(appearance.frameWidth!=undefined && appearance.frameWidth!=""){$('#'+obj.htmlid).attr('frameWidth',appearance.frameWidth);}
					if(appearance.frameOutWidth!=undefined && appearance.frameOutWidth!=""){$('#'+obj.htmlid).attr('frameOutWidth',appearance.frameOutWidth);}
				}
				if(appearance.fillColor!=undefined && appearance.fillColor!=""){$('#'+obj.htmlid).attr('fillColor',appearance.fillColor);}
				if(appearance.frameRadius!=undefined && appearance.frameRadius!=""){$('#'+obj.htmlid).attr('frameRadius',appearance.frameRadius);}
			}
			if(appearance.rotate!=undefined && appearance.rotate!=""){$('#'+obj.htmlid).attr('rotate',appearance.rotate);};

		}
		$('#'+obj.htmlid).attr('rendered','true');
		$('#'+obj.htmlid).attr('class',($('#'+obj.htmlid).attr('class')==undefined?"":$('#'+obj.htmlid).attr('class'))+" gallery");
		$('#'+obj.htmlid).attr('type',obj.type);
		console.log("obj.type="+obj.type)

		if(obj.type[0] == 'image')
		{
			console.log("obj.transition="+obj.transition);
			if(obj.transition != undefined)
			{
				$('#'+obj.htmlid).attr('transition',obj.transition);
			}else if($('#'+obj.htmlid).attr('transition') == undefined)
			{
				$('#'+obj.htmlid).attr('transition','none');
			}

		}

	},
	createGroup : function(obj){
		var id = obj.id;
		var grouphtml = '<div id="group_'+id+'"></div>';
		$('#cms'+stdRender.getZid(stdRender.zid)).append(grouphtml);
	},
	setGroup : function(obj){

		var id = obj.id;
		var templateWidth = parseInt($('body').attr('width'));
		var templateHeight = parseInt($('body').attr('height'));
		$('#group_'+id).attr('rendered','true');

		if($('#group_'+id).attr('left')==undefined){$('#group_'+id).attr('left',obj.x*templateWidth/100)};
		if($('#group_'+id).attr('top')==undefined){$('#group_'+id).attr('top',obj.y*templateHeight/100)};
		if($('#group_'+id).attr('width')==undefined){$('#group_'+id).attr('width',obj.width*templateWidth/100)};
		if($('#group_'+id).attr('height')==undefined){$('#group_'+id).attr('height',obj.height*templateHeight/100)};

	},
	createMedia : function(obj){

		id = obj.id;
		mId = obj.mId;
		console.log(obj.jobj)
		//if(obj.ctx_num == 1){

			var html = "";
			if(obj.type == "image" || obj.type == "logo" || obj.type == "android_image" || obj.type == "qrcode")
			{
				//var labelhtml = (obj.label!=undefined)?"label="+obj.label:"";
				html = '<img id="'+obj.htmlid+'" type="image" duration="'+obj.duration+'" class="elm" src="'+obj.ctx+'" />';
			}else if(obj.type == "slideshow" )
			{
				//var labelhtml = (obj.label!=undefined)?"label="+obj.label:"";
				html = '<img id="'+obj.htmlid+'" type="image" duration="'+obj.duration+'" class="elm" src="'+obj.ctx+'" />';
			}else if(obj.type == "text"){
				html = '<div id="'+obj.htmlid+'" type="text" duration="'+obj.duration+'" class="elm">'+obj.ctx+'</div>';
			}else if(obj.type == "marquee" || obj.type == "android_marquee")
			{
				html = '<div id="'+obj.htmlid+'" type="marquee" duration="'+obj.duration+'" class="elm">'+obj.ctx+'</div>';
			}else if(obj.type == "video" || obj.type == "android_video")
			{
				html = '<div id="'+obj.htmlid+'" type="video" duration="'+obj.duration+'" class="elm"  uri="'+obj.ctx+'"/>';
			}else if(obj.type == "onlinevideo")
			{
				html = '<div id="'+obj.htmlid+'" type="onlinevideo" duration="'+obj.duration+'" class="elm"  uri="'+decodeURIComponent(decodeURIComponent(obj.ctx))+'"/>';
			}else if(obj.type == "clock")
			{
				html = '<div id="'+obj.htmlid+'" type="clock" duration="'+obj.duration+'" class="elm">'+'</div>';
			}else if(obj.type == "webpage")
			{
				html = '<div id="'+obj.htmlid+'" type="webpage" duration="'+obj.duration+'" class="elm"  uri="'+decodeURIComponent(decodeURIComponent(obj.ctx))+'">'+'</div>';
			}else if(obj.type == "breakingnews")
			{
				html = '<div id="'+obj.htmlid+'" type="breakingnews" duration="'+obj.duration+'" class="elm">'+obj.ctx+'</div>';
			}else if(obj.type == "rss")
			{
				html = '<div id="'+obj.htmlid+'" type="rss" duration="'+obj.duration+'" class="elm"  uri="'+decodeURIComponent(decodeURIComponent(obj.ctx))+'">'+'</div>';
			}else if(obj.type == "android_webpage")
			{
				html = '<div id="'+obj.htmlid+'" type="android_webpage" duration="'+obj.duration+'" class="elm"  uri="'+decodeURIComponent(decodeURIComponent(obj.ctx))+'">'+'</div>';
			}else if(obj.type == "android_texteffect")
			{
				html = '<div id="'+obj.htmlid+'" type="android_texteffect" duration="'+obj.duration+'" class="elm">'+obj.ctx+'</div>';
			}else if(obj.type == "botkeyboard")
			{
				html = '<div id="'+obj.htmlid+'" type="botkeyboard" duration="'+obj.duration+'" class="elm"></div>';
			}else if(obj.type == "botvote")
			{
				html = '<div id="'+obj.htmlid+'" type="botvote" duration="'+obj.duration+'" class="elm"></div>';
			}

			$('#'+obj.regionid).append(html);
			/*
		}else if(obj.ctx_num > 1){
			var html = "";
			html = '<div id="'+obj.htmlid+'" type="arrays" duration="'+obj.duration+'" class="elm"'
			var j=0;
			for(var i in obj.ctx)
			{
				j++;
				html += 'data_'+j+'='+escape(obj.ctx[i])+' ';
			}
			html += ' ></div>';
			$('#'+obj.regionid).append(html);

		}
		*/
	},
	//Despressed
	setMedia : function(obj){

		id = obj.id;
		type = obj.type;
		mId = obj.mId;
		console.log("setMedia-id=",id);
		console.log("setMedia-type=",type);

		if(type=="image" || type=="logo" || type == "android_image" || type == "qrcode")
		{

			$('#'+obj.htmlid).attr('src',obj.ctx);
			/*
			if(obj.ctx.endsWith('.mp4'))
			{
				if(isPreview == true)
				{
					$('#'+obj.htmlid).attr('src',stdRender.getPathNameWithoutFileNameExtension(obj.ctx)+'.png');
					$('#'+obj.htmlid).bind('error',function(){
						$(this).attr('src','js/std/videopreview.png#vid'+$(this).attr('id'));
					});
				}else
				{
					$('#'+obj.htmlid).attr('src','js/std/null.png#vid'+mId);
					$('#'+obj.htmlid).attr('video_uri',obj.ctx);
				}
			}
			*/
			if(type == "qrcode")
			{
				var qrcodeProperties = obj.jobj.qrcodeProperties;
				if(qrcodeProperties!=undefined)
				{
					var qr_content = qrcodeProperties.content;
					var qr_icon = qrcodeProperties.icon;
				}
			}
			if(type == "android_image")
			{
				if(isRunningOnAndroid == true)
				{
					$('#'+obj.htmlid).attr('type','android_image');
					$('#'+obj.htmlid).attr('onandroid','true');
					$('#'+obj.htmlid).parent().attr('onandroid','true');
					$('#'+obj.htmlid).addClass('forceHide');
				}else
				{
					$('#'+obj.htmlid).attr('type','image');
					$('#'+obj.htmlid).attr('emuandroid','true');
					$('#'+obj.htmlid).parent().attr('emuandroid','true');
				}
			}else
			{
				$('#'+obj.htmlid).attr('type','image');
			}

			if(obj.transition!=undefined)
			{
				$('#'+obj.htmlid).attr('transition',obj.transition);
			}
			obj.duration = 5;
		}
		else
		if(type=="slideshow")
		{

			//obj.label = data.elements[media.type.indexOf('label')];
			//$('#'+obj.htmlid).attr('src',obj.ctx);


			var slideshowProperties = obj.jobj.slideshowProperties;
			if(slideshowProperties!=undefined)
			{
				obj.transition = 'none';
				var s_type = slideshowProperties.type;
				var s_values = slideshowProperties.value;
				if(s_type!=undefined && s_values!=undefined)
				{
					//console.log("obj.dataindex="+obj.dataindex)
					if(s_values[obj.mId-1] != undefined)
					{
						for(var i=0;i<s_type.length;i++)
						{
							var s_value = s_values[obj.mId-1].elements[i];
							if(s_value!= undefined && s_value != "" )
							{
								if(s_type[i].match('duration'))
								{
									obj.duration = s_value;
								}else if(s_type[i].match('transition'))
								{
									obj.transition = s_value;
								}else if(s_type[i].match('label'))
								{
									var text = decodeURIComponent(decodeURIComponent(s_value));
									$('#'+obj.htmlid).attr('label',text);
								}

							}
						}
					}

				}

			}

			if(obj.transition!=undefined && obj.transition == 'video')
			{
				if(isPreview == true)
				{
					obj.transition = 'none';
					$('#'+obj.htmlid).attr('transition','none');
					$('#'+obj.htmlid).attr('type','image');
					$('#'+obj.htmlid).attr('src',stdRender.getPathNameWithoutFileNameExtension(obj.ctx)+'.png');
					$('#'+obj.htmlid).bind('error',function(){


						previewimage = 'js/std/videopreview.png#vid'+$(this).attr('id');

						var region_id = $(this).parent().attr('id');

						if($('#'+region_id).hasClass('box_skitter'))
						{
							$('#'+region_id).skitter('resetImage',$(this).attr('src'),previewimage);
							$(this).attr('src',previewimage);
						}

					});
				}else
				{
					obj.transition = 'video';
					$('#'+obj.htmlid).attr('video_uri',obj.ctx);
					$('#'+obj.htmlid).attr('transition','video');
					$('#'+obj.htmlid).attr('src','js/std/null.png#vid'+mId);
					$('#'+obj.htmlid).attr('type','image');
				}
			}else
			if(obj.transition!=undefined)
			{
				$('#'+obj.htmlid).attr('transition',obj.transition);
				$('#'+obj.htmlid).attr('src',obj.ctx);
				$('#'+obj.htmlid).attr('type','image');
			}else
			{
				$('#'+obj.htmlid).attr('transition','none');
				$('#'+obj.htmlid).attr('src',obj.ctx);
				$('#'+obj.htmlid).attr('type','image');
			}

		}
		else
		if(type=="text")
		{
			//$('#'+obj.htmlid).html("<span id='statictext-"+obj.id+"_"+obj.mId+"' class='statictext '>"+obj.ctx+"</span>");
			var text = decodeURIComponent(decodeURIComponent(obj.ctx));
			$('#'+obj.htmlid).html(text);
			$('#'+obj.htmlid).addClass('statictext');
			$('#'+obj.htmlid).attr('type','text');
			this.attachTextProperties(obj);
		}
		else
		if(type=="marquee" || type == "android_marquee")
		{

			//$('#'+obj.htmlid).html("<span id='marqueetext-"+obj.id+"_"+obj.mId+"' class='marqueetext '>"+obj.ctx+"</span>");
			var text = decodeURIComponent(decodeURIComponent(obj.ctx));
			$('#'+obj.htmlid).html(text);
			if(type == "android_marquee")
			{
				if(isRunningOnAndroid == true)
				{
					$('#'+obj.htmlid).attr('type','android_marquee');
					$('#'+obj.htmlid).attr('onandroid','true');
					$('#'+obj.htmlid).parent().attr('onandroid','true');
				}else
				{
					$('#'+obj.htmlid).attr('type','marquee');
					$('#'+obj.htmlid).attr('emuandroid','true');
					$('#'+obj.htmlid).parent().attr('emuandroid','true');
				}
			}else
			{
				if(isRunningOnAndroid == true)
				{
					$('#'+obj.htmlid).attr('type','android_marquee');
					$('#'+obj.htmlid).attr('onandroid','true');
					$('#'+obj.htmlid).parent().attr('onandroid','true');
				}else{
				$('#'+obj.htmlid).attr('type','marquee');
				}
			}
			//$('#'+obj.htmlid).parent().attr('type',$('#'+obj.htmlid).attr('type'));

			this.attachTextProperties(obj);

			var marqueeProperties = obj.jobj.marqueeProperties;
			if(marqueeProperties!=undefined)
			{
				if(marqueeProperties.direction!=undefined && marqueeProperties.direction!=""){$('#'+obj.htmlid).attr('direction',marqueeProperties.direction);}
				if(marqueeProperties.speed!=undefined && marqueeProperties.speed!=""){$('#'+obj.htmlid).attr('speed',marqueeProperties.speed);}

			}
			obj.duration = 86400; //Secondes for 1 days

		}else
		if(type=="video" || obj.type == "android_video")
		{

			$('#'+obj.htmlid).attr('uri',obj.ctx);
			if(type == "android_video")
			{
				if(isRunningOnAndroid == true)
				{
					$('#'+obj.htmlid).attr('type','android_video');
					$('#'+obj.htmlid).attr('onandroid','true');
					$('#'+obj.htmlid).parent().attr('onandroid','true');
				}else
				{
					$('#'+obj.htmlid).attr('type','video');
					$('#'+obj.htmlid).attr('emuandroid','true');
					$('#'+obj.htmlid).parent().attr('emuandroid','true');
				}
			}else
			{
				if(isRunningOnAndroid == true)
				{
					$('#'+obj.htmlid).attr('type','android_video');
					$('#'+obj.htmlid).attr('onandroid','true');
					$('#'+obj.htmlid).parent().attr('onandroid','true');
				}else{
				$('#'+obj.htmlid).attr('type','video');
				}
			}
			$('#'+obj.htmlid).attr('vmode','loopAll');
			obj.duration = 10800;

		}else
		if(type=="onlinevideo")
		{

			$('#'+obj.htmlid).attr('uri',obj.ctx);
			if(false && isRunningOnAndroid == true)
			{
				$('#'+obj.htmlid).attr('type','android_onlinevideo');
				$('#'+obj.htmlid).attr('onandroid','true');
				$('#'+obj.htmlid).parent().attr('onandroid','true');

			}else
			{
				$('#'+obj.htmlid).attr('type','onlinevideo');
			}
			$('#'+obj.htmlid).attr('vmode','loopAll');
			obj.duration = 10800;

		}else
		if(type == "clock")
		{
			//$('#'+obj.htmlid).html("<span id='digiclock-"+obj.id+"_"+obj.mId+"' class='digiclock'>"+obj.ctx+"</span>");
			var clockProperties = obj.jobj.clockProperties;
			if(clockProperties!=undefined)
			{
				$('#'+obj.htmlid).attr('dateFormat',clockProperties.dateFormat);
				$('#'+obj.htmlid).attr('timeFormat',clockProperties.timeFormat);
				$('#'+obj.htmlid).attr('autofit',clockProperties.autofit);
				$('#'+obj.htmlid).attr('ntp',clockProperties.ntp);
			}else //default
			{
				$('#'+obj.htmlid).attr('dateFormat','zh_dateFormat4');
				$('#'+obj.htmlid).attr('timeFormat','timeFormat3');
				$('#'+obj.htmlid).attr('autofit',true);
				$('#'+obj.htmlid).attr('ntp',false);
			}
			$('#'+obj.htmlid).addClass('digiclock');
			this.attachTextProperties(obj);
			stdRender.useClock = true;
		}else if(type == "webpage")
		{
			var webpageProperties = obj.jobj.webpageProperties;
			if(webpageProperties!=undefined)
			{
				obj.transition = 'none';
				var s_type = webpageProperties.type;
				var s_values = webpageProperties.value;
				if(s_type!=undefined && s_values!=undefined)
				{
					//console.log("obj.dataindex="+obj.dataindex)
					if(s_values[obj.mId-1] != undefined)
					{
						for(var i=0;i<s_type.length;i++)
						{
							var s_value = s_values[obj.mId-1].elements[i];
							if(s_value!= undefined && s_value != "" )
							{
								if(s_type[i].match('duration'))
								{
									obj.duration = s_value;
								}else if(s_type[i].match('videosite'))
								{
									$('#'+obj.htmlid).attr('videosite',s_value);
								}else if(s_type[i].match('zoom'))
								{
									$('#'+obj.htmlid).attr('zoom_scale',s_value);
								}else if(s_type[i].match('offset_x'))
								{
									$('#'+obj.htmlid).attr('zoom_offset_x',s_value);
								}else if(s_type[i].match('offset_y'))
								{
									$('#'+obj.htmlid).attr('zoom_offset_y',s_value);
								}else if(s_type[i].match('web_width'))
								{
									$('#'+obj.htmlid).attr('web_width',s_value);
								}else if(s_type[i].match('web_height'))
								{
									$('#'+obj.htmlid).attr('web_height',s_value);
								}
							}
						}
					}

				}

			}

			if($('#'+obj.htmlid).attr('web_width')==undefined)
			{
				$('#'+obj.htmlid).attr('web_width',1280);
			}
			if($('#'+obj.htmlid).attr('web_height')==undefined)
			{
				$('#'+obj.htmlid).attr('web_height',2280);
			}


		}else
		if(type == "breakingnews" || type == "rss")
		{
			if(type == "breakingnews"){
				var text = decodeURIComponent(decodeURIComponent(obj.ctx));
				$('#'+obj.htmlid).html(text);
			}
			var attachtoRegionObj = new Object();
			attachtoRegionObj = jQuery.extend(true, {}, obj);
			console.log("=====> obj.id="+ obj.regionid);
			attachtoRegionObj.htmlid = obj.regionid;

			var breakingnewsProperties = obj.jobj.breakingnewsProperties;
			if(breakingnewsProperties!=undefined)
			{
				$('#'+attachtoRegionObj.htmlid).attr('effect',breakingnewsProperties.effect);
				$('#'+attachtoRegionObj.htmlid).attr('duration',breakingnewsProperties.duration);
				obj.duration = breakingnewsProperties.duration;
				$('#'+attachtoRegionObj.htmlid).attr('title',breakingnewsProperties.title);
				$('#'+attachtoRegionObj.htmlid).attr('color',breakingnewsProperties.color);
				if(breakingnewsProperties.style!=undefined && breakingnewsProperties.style!=""){$('#'+attachtoRegionObj.htmlid).attr('ttstyle',breakingnewsProperties.style);}else{$('#'+attachtoRegionObj.htmlid).attr('ttstyle','triangle');}
			}else //default
			{
				$('#'+attachtoRegionObj.htmlid).attr('effect','fade');
				$('#'+attachtoRegionObj.htmlid).attr('duration','3');
				obj.duration = 3;
				$('#'+attachtoRegionObj.htmlid).attr('title','');
				$('#'+attachtoRegionObj.htmlid).attr('color','#FFFFFF');
				$('#'+attachtoRegionObj.htmlid).attr('ttstyle','triangle');
			}

			this.attachTextProperties(attachtoRegionObj);
			$('#'+attachtoRegionObj.htmlid).attr('textAlign','left');
			$('#'+attachtoRegionObj.htmlid).attr('textVAlign','top');
      var textProperties = obj.jobj.textProperties;
      if(textProperties!=undefined)
      {
        if(textProperties.fontSize!=undefined && textProperties.fontSize!=""){$('#'+attachtoRegionObj.htmlid).css('font-size',textProperties.fontSize);}
			}//$('#'+attachtoRegionObj.htmlid).removeClass('sizelab_reCssFont');
			$('#'+attachtoRegionObj.htmlid).removeClass('sizelab_reCssLineHeight');

			if(type == "rss"){
				var rssProperties = obj.jobj.rssProperties;
				if(rssProperties!=undefined)
				{
					if(rssProperties.updateInterval!=undefined && rssProperties.updateInterval!=""){$('#'+attachtoRegionObj.htmlid).attr('updateInterval',rssProperties.updateInterval);}else{$('#'+attachtoRegionObj.htmlid).attr('updateInterval','30');}
					if(rssProperties.feedCount!=undefined && rssProperties.feedCount!=""){$('#'+attachtoRegionObj.htmlid).attr('feedCount',rssProperties.feedCount);}else{$('#'+attachtoRegionObj.htmlid).attr('feedCount','30');}
				}else
				{
					$('#'+attachtoRegionObj.htmlid).attr('updateInterval','30');// 30 min to update rss content
					$('#'+attachtoRegionObj.htmlid).attr('feedCount','30'); // each rss fetch 30 items.
				}
			}
		}else if(type == "android_webpage")
		{
			if(isRunningOnAndroid == true)
			{
				$('#'+obj.htmlid).attr('type','android_webpage');
				$('#'+obj.htmlid).attr('onandroid','true');
				$('#'+obj.htmlid).parent().attr('onandroid','true');
			}else
			{
				$('#'+obj.htmlid).attr('type','android_webpage');
				$('#'+obj.htmlid).attr('emuandroid','true');
				$('#'+obj.htmlid).parent().attr('emuandroid','true');
			}
			obj.duration = 86400; //1 day refesh again
		}else if(type == "android_texteffect")
		{
			var text = decodeURIComponent(decodeURIComponent(obj.ctx));
			$('#'+obj.htmlid).html(text);
			this.attachTextProperties(obj);
			if(isRunningOnAndroid == true)
			{
				$('#'+obj.htmlid).attr('type','android_texteffect');
				$('#'+obj.htmlid).attr('onandroid','true');
				$('#'+obj.htmlid).parent().attr('onandroid','true');
			}else
			{
				$('#'+obj.htmlid).attr('type','android_texteffect');
				$('#'+obj.htmlid).attr('emuandroid','true');
				$('#'+obj.htmlid).parent().attr('emuandroid','true');
			}
			var androidProperties = obj.jobj.androidProperties;
			if(androidProperties!=undefined)
			{
				$('#'+obj.htmlid).attr('effect',androidProperties.effect);
				$('#'+obj.htmlid).attr('interval',androidProperties.interval);
			}else{
				$('#'+obj.htmlid).attr('effect','BounceIn');
				$('#'+obj.htmlid).attr('interval','6');
			}
			$('#'+obj.htmlid).attr('textAlign','center');
			$('#'+obj.htmlid).attr('textVAlign','middle');
			obj.duration = 31104000; //1 year refesh again
		}else if(type == "botkeyboard")
		{

			var botProperties = obj.jobj.botProperties;
			obj.duration = 31104000; //1 year refesh again

			var gameinfooptions = {};
			gameinfooptions.title = botProperties.title;
	    gameinfooptions.id = obj.htmlid;
			gameinfooptions.fontFamily = $('body').css('font-family').replace(/\'/g,'');

			if(botProperties.key_type == "type1"){
				require(['interactive_en', 'awardrotate', 'roulette_en'], function (){
					console.log('------->loading roulette JS success ');
					$('#'+obj.htmlid).interactive({json:JSON.stringify(obj.jobj.botProperties),id:obj.htmlid});
					game_handle[obj.htmlid] = $('#'+obj.htmlid).roulette(gameinfooptions);
					game_handle[obj.htmlid]();
				});
			}else {
				$('#'+obj.htmlid).parent().attr('fillColor','rgba(50,50,50,0.7)');
				$('#'+obj.htmlid).parent().attr('frameRadius','40');
				require(['interactive', 'd3.v3.min'], function (){
					console.log('------->loading botkeyboard JS success ');
					$('#'+obj.htmlid).interactive({json:JSON.stringify(obj.jobj.botProperties),id:obj.htmlid});
					game_handle[obj.htmlid] = $('#'+obj.htmlid).gameInfo(gameinfooptions);
					game_handle[obj.htmlid]();
				});
			}
		}else if(type == "botvote")
		{

			var botProperties = obj.jobj.botProperties;
			$('#'+obj.htmlid).parent().attr('fillColor','rgba(50,50,50,0.7)');
			$('#'+obj.htmlid).parent().attr('frameRadius','40');
			obj.duration = 31104000; //1 year refesh again

			var barchartoptions = {};
			barchartoptions.items  = botProperties.vote_options;
			barchartoptions.title = botProperties.title;
	    barchartoptions.id = obj.htmlid;
			barchartoptions.fontFamily = $('body').css('font-family').replace(/\'/g,'');

			require(['interactive_en', 'd3.v3.min'], function (){
				console.log('------->loading botvote JS success ');
				$('#'+obj.htmlid).interactive({json:JSON.stringify(obj.jobj.botProperties),id:obj.htmlid});
				bar_handle[obj.htmlid] = $('#'+obj.htmlid).barChart(barchartoptions);
				setTimeout(function(){
					var true_width = parseFloat($('#'+obj.htmlid).css('width'));
					var true_height = parseFloat($('#'+obj.htmlid).css('height'));
					bar_handle[obj.htmlid](true_width,true_height);
				},100);
			});
		}


		//if(rendertype == "normal")
		{
			var templateWidth = parseInt($('body').attr('width'));
			var templateHeight = parseInt($('body').attr('height'));
			$('#'+obj.htmlid).attr('left',obj.x*templateWidth/100);
			$('#'+obj.htmlid).attr('top',obj.y*templateHeight/100);
			$('#'+obj.htmlid).attr('width',obj.width*templateWidth/100);
			$('#'+obj.htmlid).attr('height',obj.height*templateHeight/100);
		}
		$('#'+obj.htmlid).attr('duration',obj.duration);
		$('#'+obj.htmlid).attr('rendered','true');
		$('#'+obj.htmlid).attr('class',$('#'+obj.htmlid).attr('class')+" elm");

	},
	attachTextProperties : function(obj)
	{
		var textProperties = obj.jobj.textProperties;
		if(textProperties!=undefined)
		{
			if(textProperties.fontFamily!=undefined && textProperties.fontFamily!=""){$('#'+obj.htmlid).attr('fontFamily',textProperties.fontFamily);}
			if(textProperties.fontSize!=undefined && textProperties.fontSize!=""){$('#'+obj.htmlid).attr('fontSize',textProperties.fontSize);}
			if(textProperties.textAlign!=undefined && textProperties.textAlign!=""){$('#'+obj.htmlid).attr('textAlign',textProperties.textAlign);}
			if(textProperties.textVAlign!=undefined && textProperties.textVAlign!="" && $('#'+obj.htmlid).attr('textVAlign')==undefined){$('#'+obj.htmlid).attr('textVAlign',textProperties.textVAlign);}
			if(textProperties.fontColor!=undefined && textProperties.fontColor!=""){$('#'+obj.htmlid).attr('fontColor',textProperties.fontColor);}
			if(textProperties.fontStyle!=undefined && textProperties.fontStyle!=""){$('#'+obj.htmlid).attr('fontStyle',textProperties.fontStyle);}
			if(textProperties.fontWeight!=undefined && textProperties.fontWeight!=""){$('#'+obj.htmlid).attr('fontWeight',textProperties.fontWeight);}
			if(textProperties.textDecoration!=undefined && textProperties.textDecoration!=""){$('#'+obj.htmlid).attr('textDecoration',textProperties.textDecoration);}
			//if(textProperties.fillColor!=undefined){$('#'+obj.htmlid).attr('fillColor',textProperties.fillColor);}
			//if(textProperties.frameColor!=undefined){$('#'+obj.htmlid).attr('frameColor',textProperties.frameColor);}
			$('#'+obj.htmlid).addClass('sizelab_reCssFont');
			$('#'+obj.htmlid).addClass('sizelab_reCssLineHeight');
		}
	},
	copyElmIfOnlyOne: function()
	{
		$('body').find('.gallery').each(function(){
			if($(this).attr('type') == 'video')
			{
				$(this).attr('videonum',$(this).find('.elm').length);
				if($(this).find('.elm').length == 1)
				{
					var videoDom = $(this).find('.elm');
					videoDom.clone().appendTo('#'+$(this).attr('id'));
					var videoDom = $(this).find('.elm');
					videoDom[1].id = videoDom[1].id+'_clone';

				}
			}else if($(this).attr('type') == 'slideshow')
			{
				if($(this).find('.elm').length == 1)
				{
					var videoDom = $(this).find('.elm');
					videoDom.clone().appendTo('#'+$(this).attr('id'));
					var videoDom = $(this).find('.elm');
					videoDom[1].id = videoDom[1].id+'_clone';

				}
			}
		})
	},
	genPreviewModeLayout: function()
	{

		$('body').find('.elm').each(function(){
			if($(this).attr('type') == 'video')
			{
				$(this).attr('type','image');
				$(this).css('background-color','#000');
				var videouri = $(this).attr('uri');

				var path = stdRender.getPathNameWithoutFileNameExtension(videouri);

				if($(this).parent().attr('video-preview-image')!=undefined)
				{
					$(this).html('<img src="'+$(this).parent().attr('video-preview-image')+'" style="width:100%;height:100%">');
				}else{
					$(this).html('<img src="'+path+'.png" style="width:100%;height:100%">');
				}
				//js/std/videopreview.png
				if($('#region-video-bg-'+$(this).parent().attr('id')).length == 0)
				{
					var html = '<div id="region-video-bg-'+$(this).parent().attr('id')+'" class="gallery" width="'+$(this).parent().attr('width')+'" height="'+$(this).parent().attr('height')+'" left="'+$(this).parent().attr('left')+'" top="'+$(this).parent().attr('top')+'" style="">';
					html += '<img id=media-video-bg-'+$(this).parent().attr('id')+'" class="elm" src="js/std/videopreview.png"/>';
					html += '</div>';
					$(this).parent().after(html);
				}

			}
		})
		$('body').find('.elm').each(function(){
			if(false && $(this).attr('emuandroid') == 'true')
			{
				if($('#region-video-bg-'+$(this).parent().attr('id')).length == 0)
				{
					var html = '<div id="region-video-bg-'+$(this).parent().attr('id')+'" class="gallery" width="'+$(this).parent().attr('width')+'" height="'+$(this).parent().attr('height')+'" left="'+$(this).parent().attr('left')+'" top="'+$(this).parent().attr('top')+'" >';
					var size = Math.min($(this).parent().attr('width')/2,$(this).parent().attr('height')/2);
					html += '<img id=media-video-bg-'+$(this).parent().attr('id')+'" class="" src="js/std/androidlogo.png"  style="width:40px;height:40px; " />';
					html += '</div>';
					$(this).parent().after(html);
				}
			}
		})

	},
	getPathNameWithoutFileNameExtension : function(uri)
	{

		var filename = uri.replace(/^.*[\\\/]/, '');
		//console.log("filename="+filename);
		var path = uri.replace(filename,'');
		//console.log("path="+path);
		var fname = filename.replace(/\..+$/, '');

		return ""+path+fname;
	},
	addCMSNode : function(idx,zindex)
	{
		if($('#cms'+idx).length==0)
		{
			if(idx==stdRender.zidbg)
			{
				if($('#cms'+idx).length==0){$('body').prepend('<div id="cms'+idx+'" style="z-index:'+zindex+'"></div>');}else{$('#cms'+idx).css('z-index',zindex)}
			}else if( idx == 1)
			{
				if($('#cms').length==0){$('body').append('<div id="cms" style="z-index:'+zindex+'"></div>');}else{$('#cms').css('z-index',zindex)}
			}else
			{
				if($('#cms'+idx).length==0){$('body').append('<div id="cms'+idx+'" style="z-index:'+zindex+'"></div>');}else{$('#cms'+idx).css('z-index',zindex)}
			}

		}
	}

}

var urlParams = null;
function std_urlparser(QueryString) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = QueryString;//window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
}


function getParameterFromURL(url, name) {
	if(urlParams == null)
	{
		var queryString = url.substring( url.indexOf('?') + 1 );
		std_urlparser(queryString);
	}

	return urlParams[name];
	//url = url;
	//return dogetUrlParameter(name);
	//return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}

String.prototype.startsWith = function(prefix)
{
    return (this.substr(0, prefix.length) === prefix);
}

String.prototype.endsWith = function(suffix)
{
    return (this.substr(this.length - suffix.length) === suffix);
}

String.prototype.contains = function(txt)
{
    return (this.indexOf(txt) >= 0);
}

function toSnap(text, color) {
	// Set some variables
	var time = '9000';
	var $container = $('#ohsnap');

	// Generate the HTML
	var html = '<div class="alert alert-' + color + '">' + text + '</div>';

	// Append the label to the container
	$container.append(html);

	// After 'time' seconds, the animation fades out
	setTimeout(function () {
		toSnapX($container.children('.alert').first());
	}, time);
}

function toSnapX(element) {

	// Called without argument, the function removes all alerts
	// element must be a jQuery object

	if (typeof element !== "undefined" ) {
		element.remove();
	} else {
		$('.alert').remove();
	}
}
