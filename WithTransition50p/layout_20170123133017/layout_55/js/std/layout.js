if((typeof layoutjs_isload) == "undefined")
{
var nativeLayerZindex = 10000;
var topLayerZindex = 7000;
var middleLayerZindex = 4000;
var backgroundLayerZindex = 1000;
var subGallery = new Array();
var subGalleryIndex = new Array();
var subGalleryNext = new Array();
var subGalleryPreDoNext = new Array();
var duration = new Array();
var durationIndex = new Array();
var timeupArray = new Array();
var psps = "philips"
var hosturl="";
var rssArray = new Array();
var central_timer_counter = 0;
var uuu = 0;
//
var selfinnerWidthNow = self.innerWidth;
var selfinnerHeightNow = self.innerHeight;
var gh_scale = 1;
var gw_scale = 1;
// only for video at portait mode on Linux Opera & Android PD
var VIDEO_selfinnerWidthNow = self.innerWidth;
var VIDEO_selfinnerHeightNow = self.innerHeight;
var VIDEO_gh_scale = 1;
var VIDEO_gw_scale = 1;

/*
if((typeof bEnableVideoPreloading) == "undefined")
{
	var bEnableVideoPreloading = true;
	var VideoDelayTime = 1000;
}

$(document).ready(function () {
	if(typeof bEnableTransition  != "undefined") //settingjs is loaded!
	{
		initLayout();
	}
});
*/
function initLayout()
{
		// init
		$('div').each(function(){if($(this).attr('id')!=undefined && $(this).attr('id').indexOf('cms')==0 && $(this).parent().prop("tagName")=="BODY" && !$(this).hasClass('cmsvideo') ){$(this).addClass('cms'); } });
		$('div').each(function(){if($(this).attr('id')!=undefined && $(this).attr('id').indexOf('cmsvideo')==0 && $(this).parent().prop("tagName")=="BODY"){ $(this).removeClass('cms');$(this).addClass('cmsvideo'); } });
		//using CSS3
		//$('div[id^="cms"]').each(function(){$(this).addClass('cms')});
		//$('div[id^="cmsvideo"]').each(function(){$(this).removeClass('cms');$(this).addClass('cmsvideo')});
		//if((parseInt($('body').attr('width')) < parseInt($('body').attr('height')) )&& bEnablePortraitMode == true)
		if( (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true)
		{
			if( typeof( self.innerHeight ) == 'number' )
			{
				selfinnerWidthNow = self.innerHeight;
				selfinnerHeightNow = self.innerWidth;
				VIDEO_selfinnerWidthNow = self.innerWidth;
				VIDEO_selfinnerHeightNow = self.innerHeight;

			}else{
				self.innerHeight = selfinnerWidthNow = document.body.offsetHeight;
				self.innerWidth = selfinnerHeightNow = document.body.offsetWidth;
				VIDEO_selfinnerWidthNow = document.body.offsetWidth;
				VIDEO_selfinnerHeightNow = document.body.offsetHeight;
			}
			$('body').css('width',selfinnerHeightNow);
			$('body').css('height',selfinnerWidthNow);

			console.log("gPortraitDegree="+gPortraitDegree);
		}else
		{
			if( typeof( self.innerHeight ) == 'number' )
			{
				VIDEO_selfinnerWidthNow = selfinnerWidthNow = self.innerWidth;
				VIDEO_selfinnerHeightNow = selfinnerHeightNow = self.innerHeight;

			}else
			{
				self.innerWidth  = selfinnerWidthNow = document.body.offsetWidth;
				self.innerHeight = selfinnerHeightNow = document.body.offsetHeight;
				VIDEO_selfinnerWidthNow = selfinnerWidthNow;
				VIDEO_selfinnerHeightNow = selfinnerHeightNow;
			}
			$('body').css('width',selfinnerWidthNow);
			$('body').css('height',selfinnerHeightNow);
		}

		if( (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true)
		{
			var org_height = parseInt($('body').attr('width'));
			var org_width = parseInt($('body').attr('height'));
		}else{
			var org_width = parseInt($('body').attr('width'));
			var org_height = parseInt($('body').attr('height'));
		}
		var VIDEO_org_width = parseInt($('body').attr('width'));
		var VIDEO_org_height = parseInt($('body').attr('height'));
		if( (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true)
		{
			gh_scale = self.innerWidth / org_width;
			gw_scale = self.innerHeight / org_height;
		}else{
			gw_scale = self.innerWidth / org_width;
			gh_scale = self.innerHeight / org_height;
		}
		VIDEO_gw_scale = self.innerWidth / org_width;
		VIDEO_gh_scale = self.innerHeight / org_height;

		responsiveBackground();
		//$('#cms').append("<div id='background-region'></div>");
		$('.cms').each(function(){$(this).append("<div id='background-region-"+$(this).attr('id')+"' class='background-region'></div>"); })
		responsiveRegion();
		$('#cms').append("<div id='backuptext' style='display:none'></div>"); // for marqueeOLD
		$('#cms').append("<div id='backupticker' style='display:none'></div>"); //for tickerOLD

		//$('#scriptloading').append("<script src='../../videosetting.js'></script>");
		//
		//var url = $(location).attr('href');
		//var secretKey = getURLParameter(url, 'ps');
		//var rootpath = getURLParameter(url, 'root');
		//var serveraddress = getURLParameter(url, 'serveraddress');
		//alert(url);

		//	hosturl = "http://" + serveraddress + "/" + rootpath + "/";
			//alert(hosturl);

		// createText, createRSS
		var elms = $('.elm');
		for(var i = 0 ; i < elms.length ; i++){
			var temp = $(elms[i]);
			var type = temp.attr("type");
			temp.css('opacity','0');
			if ( type == "marqueeOLD"){
				//clone whole text div to backuptext
				temp.clone().appendTo('#backuptext');
				$('#backuptext').find('#'+temp.attr("id")).attr('id',temp.attr("id")+'_backup');

				var direction = temp.attr("direction")
				if ( direction != "none" ) {
					var id = temp.attr("id");
					var duration = temp.attr("duration");
					createText('#'+id);
					$('#'+id).attr('duration',duration);
					$('#'+id).attr('class','elm');
					$('#'+id).attr('type','marqueeOLD');
				}
			} else if( type == "marquee"){
				var id = temp.attr("id");
				var direction = temp.attr('direction');
				if(direction == "up" || direction == "down")
				{
					temp.attr("textVAlign",'top');
				}
				createStaticText('#'+id);
				//temp.clone().appendTo('#backuptext');
				//$('#backuptext').find('#'+temp.attr("id")).attr('id',temp.attr("id")+'_backup');
				//var duration = temp.attr("duration");
				createMarquee('#'+id);
				//$('#'+id).attr('duration',duration);
				//$('#'+id).attr('class','elm');
				//$('#'+id).attr('type','marquee');

			} else if ( type == "tickerOLD"){
				var id = temp.attr("id");
				var id_str = '#'+id;
				temp.clone().appendTo('#backupticker');
				$('#backupticker').find('#'+temp.attr("id")).attr('id',temp.attr("id")+'_backup');


				createRss(id_str, Math.random());
				//createRss(id_str, Math.random());
				// unit is min, convert to seconds
				//var uintval = parseInt($('#'+id).attr('updateInterval')) * 60;
				//console.info("uintval="+uintval);
				//var uintval_str = uintval+'s';
				// set timer to update
				//$('body').everyTime(uintval_str ,'uintval_str'+id,
				//function(){
					//createRss(id_str, Math.random());
				//});

				var uintval = parseInt($('#'+id).attr('updateInterval')) * 60;
				var rssObj = {
					id: "",
					interval: ""
				};
				rssObj.type = "tickerOLD";
				rssObj.id = id_str;
				rssObj.interval = uintval;
				rssArray.push(rssObj);

			} else if ( type == "breakingnews"){

				var id = temp.attr("id");
				var id_str = '#'+id;
				var theregionid = $("#"+id).parent().attr('id');

				createBreakingNews(id,type);


			}else if ( type == "rss"){

				var id = temp.attr("id");
				var id_str = '#'+id;
				var theregionid = $("#"+id).parent().attr('id');

				createBreakingNews(id,type);
				//
				var bFind = false;
				for (var j = 0 ; j < rssArray.length ; j++){
					var rssObj = rssArray[j];
					if(rssObj.id == theregionid)
					{
						bFind = true;
					}
				}
				if(bFind != true)
				{
					var uintval = parseInt($('#'+theregionid).attr('updateInterval')) * 60;
					var rssObj = {
						id: "",
						interval: ""
					};
					rssObj.type = "rss";
					rssObj.id = theregionid;
					rssObj.interval = uintval;
					rssArray.push(rssObj);
					console.log('rssArray=');
					console.log(rssArray);
				}


			} else if ( type == "text" || type == "clock")
			{
				var id = temp.attr("id");
				createStaticText('#'+id);

				if(type == "clock")
				{
					 temp.addClass("digiclock")
				}
			} else if ( type == "android_texteffect" && temp.attr('emuandroid') == 'true')
			{
				var id = temp.attr("id");
				createStaticText('#'+id);
				createTextEffect('#'+id);
			}
		}
		//
		var gallerys = $('.gallery');
		for(var i = 0 ; i < gallerys.length ; i++){
			var temp = $(gallerys[i]);
			var id = temp.attr("id");
			subGalleryNext[i] = 0;
			subGalleryPreDoNext[i] = 0;
			console.log("iid="+id);
			console.log(" gallerys.length="+ gallerys.length);
			// set value
			subGallery.push(id);
			subGalleryIndex.push(0);
			temp.attr('played','false');
			checkTransition(id);
			changePicture(id);
		}
		//

		$('body').everyTime( '1s' ,'central_timer',
		function(){
			//
			console.log("u="+uuu);
			if(uuu>31536000) //1 years
			{
				window.location.reload();
			}
			if(uuu>5 && starttime!=0 && launchnow != true)
			{
				return;
			}
			uuu++;
			for (var i = 0 ; i < rssArray.length ; i++){
				var rssObj = rssArray[i];
				//console.log(rssObj.id);
				//console.log(rssObj.interval);
				if (central_timer_counter > 0 && central_timer_counter % parseInt(rssObj.interval) == 0){
					//createRss(rssObj.id, Math.random());

					if(rssObj.type == "tickerOLD")
					{

						if(bEnableReloadTickerNewWay == true)
						{
							var idx = rssObj.id.replace('#','');
							var temp = $('#'+idx);
							var backuptemp = $('#'+idx+'_backup');
							var duration = temp.attr("duration");

							if($('#'+idx).attr('direction') == 'left' || $('#'+idx).attr('direction') == 'right' || $('#'+idx).attr('direction') == 'up' || $('#'+idx).attr('direction') == 'down')
							{
								$('#'+idx).find('.scroll').trigger('stop');
							}
							var callback = function(){

								var opacity = $('#'+idx).css('opacity');
								$('#'+idx).before('<div id='+idx+'_prev></div>');
								var temp = $('#'+idx);
								temp.remove();
						 		$('#'+idx+'_prev').after(backuptemp.clone());
								$('#'+idx+'_prev').next().attr('id',idx);
								$('#'+idx+'_prev').remove();
								createRss(rssObj.id, Math.random());
								$('#'+idx).css('opacity',opacity);
								//$('#'+idx).animate({opacity:1}, transitionSpeed);
								//$('#'+idx).attr('duration',duration);
								//$('#'+idx).attr('class','elm');
								//$('#'+idx).attr('type','text');
							}
							if($('#'+idx).attr('direction') == 'left' || $('#'+idx).attr('direction') == 'right' || $('#'+idx).attr('direction') == 'up' || $('#'+idx).attr('direction') == 'down')
							{
								temp.find('.scroll').marquee('cancel',callback);
							}else{
								callback();
							}
						}else{
							createRss(rssObj.id, Math.random());
						}
					}else if(rssObj.type == "rss")
					{
						console.log("prepare refresh rss");
						$('#'+rssObj.id+"_breakingnews").resetBreakingNews();
					}

				}
			}
			//
			var gallerys = $('.gallery');
			for(var i = 0 ; i < gallerys.length ; i++){
				var temp = $(gallerys[i]);
				var id = temp.attr("id");

				var imageId = subGalleryIndex[subGallery.indexOf(id)];
				$gallery = $('#' + id).find('.elm');//children();
				//console.log($gallery.length);

				//for(var j = 0 ; j < $gallery.length ; j++){
					//var obj = $($gallery[subGalleryIndex[i]]);
					//console.log("subGalleryNext[i]="+subGalleryNext[i])
					if (central_timer_counter > 0 && central_timer_counter == subGalleryNext[i] ){
						//console.log("------->changePicture="+id);
						changePicture(id);

					}
					//console.log("----------->subGalleryPreDoNext[i]="+subGalleryPreDoNext[i])
					if(central_timer_counter > 0 && central_timer_counter == subGalleryPreDoNext[i] )
					{
						//console.log("changePreLoadingPicture="+id);
						changePreLoadingPicture(id);
					}
				//}
				//var slideTime = gallery.attr("duration");
				//console.log(slideTime);
				//if (central_timer_counter > 0 && central_timer_counter % parseInt(slideTime) == 0){
					//changePicture(id);
				//}
			}

			central_timer_counter++;
			//console.log("c="+central_timer_counter);
		});

		// Setup timer
		/*
		var gallerys = $('.gallery');
		for(var i = 0 ; i < gallerys.length ; i++){
			var temp = $(gallerys[i]);
			//console.log("id: " + temp.attr("id"));
			var id = temp.attr("id")
			// set value
			subGallery.push(id);
			subGalleryIndex.push(0);
			changePicture(id);
		}
		*/

		$('.middletext').each(function(){
			middletext($(this).attr('id'));
		})

		init_success = true;

}
function middletext(id) // do verticalmiddle
{
	var temp = $('#'+id);

	if(temp.hasClass('gallery'))
	{
		var textallhtml = temp.find('.elm').html();
		temp.find('.elm').html("<span class='textwrapper verticalmiddle'>"+textallhtml+"</span>");
	}

	var obj = new Object();
	obj.temp = temp;
	setTimeout((function(obj){
        return function(){
        	var temp = obj.temp;
			if(temp.children().length == 0)
			{
				var textallhtml = temp.html();
				temp.html("<span class='textwrapper verticalmiddle'>"+textallhtml+"</span>");
			}else
			{
				if(temp.hasClass('gallery'))
				{

				}else
				if(temp.attr('type')!=undefined && temp.attr('type') == 'marquee' )
				{
					$(temp.children().children().get(0)).addClass('verticalmiddle');
				}else
				{
					$(temp.children().get(0)).addClass('verticalmiddle');
				}

			}
        	//console.log("-------------------height="+ parseInt(temp.find('.verticalmiddle').css('height')));

        	if(parseInt(temp.find('.verticalmiddle').parent().css('height')) > parseInt(temp.find('.verticalmiddle').css('height')))
			{
				var statictop = (parseInt(temp.find('.verticalmiddle').parent().css('height')) - parseInt(temp.find('.verticalmiddle').css('height')) )/2;
				//temp.find('.middletext').css('top',statictop+"px");
				//console.log("-------------------statictop="+ statictop);
				temp.find('.verticalmiddle').parent().css('padding-top',statictop+"px")
			}
		};
	})(obj),10);
}
function checkTransition(id)
{
		var temp = $('#'+id);
		if(bEnableTransition == true)
		{
			var bfindTransition = false;
			if(bAddingTransition == true && temp.hasClass('box_skitter') == false)
			{
				temp.addClass('box_skitter');
				temp.attr('transition',transitionEffect);
			}

			if(temp.attr('transition')!=undefined && temp.attr('transition').length>0 && temp.attr('transition') != "none" || temp.attr('type') == 'slideshow')
			{
				var elms = $('#' + id).find('.elm');
				if(elms.length>1)
				{
					temp.addClass('box_skitter');
				}
			}else
			{
				bfindTransition = false;
				var elms = $('#' + id).find('.elm');

				for(var i = 0 ; i < elms.length ; i++){
					var elm = $(elms[i]);
					if(elm.attr('transition')!=undefined && elm.attr('transition').length>0 && elm.attr('transition') != "none" )
					{

						bfindTransition = true;
						break;
					}
				}

				if(bfindTransition == true)
				{
					temp.addClass('box_skitter');
				}
			}
			if(temp.hasClass('box_skitter') == true)
			{

				if(temp.attr('transition')!=undefined && temp.attr('transition').length>0 && temp.attr('transition') != "none")
				{
					var elms = $('#' + id).find('.elm');
					if(elms.length<=1)
					{
						temp.removeClass('box_skitter');
					}else
					{
						temp.skitter({
							interval: transitionSpeed,
							with_animations: [temp.attr('transition')]
						});
					}
				}else{
					bfindTransition = false;
					var elms = $('#' + id).find('.elm');
					for(var i = 0 ; i < elms.length ; i++){
						var elm = $(elms[i]);
						if(elm.attr('transition')!=undefined  && elm.attr('transition').length>0 && elm.attr('transition') != "none" || temp.attr('type') == 'slideshow')
						{
							bfindTransition = true;
							break;
						}
					}
					var elms = $('#' + id).find('.elm');
					if(elms.length<=1)
					{
						temp.removeClass('box_skitter');
						bfindTransition = false;
					}
					if(bfindTransition == true)
					{
						temp.skitter({
							interval: transitionSpeed
							//with_animations: [temp.attr('transition')]
						});
					}else{
						temp.removeClass('box_skitter');
					}

				}

			}
		}
}
/** get parameter from url
*/
function getURLParameter(url, name) {
	return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}

function changePreLoadingPicture(id){
	console.log("changePreLoadingPicture="+id);

	var $gallery;

	var imageId = subGalleryIndex[subGallery.indexOf(id)];

	$gallery = $('#' + id).find('.elm');//children();
	if ($gallery.length == 0) {
		return;
	}
	var nextId = imageId + 1;
	if (nextId >= $gallery.length) {
			nextId = 0;
	}
	if($gallery.eq(nextId).attr('type') == 'webpage' && imageId != nextId && $gallery.eq(nextId).attr('videosite')!= 'true')
	{
		console.log("Preloading webpage!!!!")
		$gallery.eq(nextId).html("");
		$gallery.eq(nextId).css('opacity','0.01');
		createWebpage($gallery.eq(nextId).attr('id'));
		$gallery.eq(nextId).find('iframe').css('opacity','0.01')

	}else if(($gallery.eq(nextId).parent().attr('type') == 'slideshow' || $gallery.eq(nextId).parent().attr('type') == 'image' ) && $gallery.eq(nextId).attr('type') == 'image' && $gallery.eq(nextId).attr('video_uri') != undefined)
	{
		console.log("--------------------------> preloading slideshow_video_uri="+  $gallery.eq(nextId).attr('video_uri'));

		console.log("It's slideshow video ="+nextId);
		var elmid = $gallery.eq(nextId).attr('id');

		if ($("#videoplay_" + id).length == 0 || $("#videoplay_" + id).css('opacity') == 0 ){
			console.log('skip preloding video');
			//createSlideshowVideo(id,elmid);
		}

	}

	$gallery = undefined;
	delete $gallery;
}

/* for all object slideshow*/
function changePicture(id){
	// An array of object elements
	var $gallery;
	// Which object is being shown
	var imageId = subGalleryIndex[subGallery.indexOf(id)];
	// Slide time settings
	//var slideTime = 10000;
	// Slide transitionSpeed
	//console.log("imageId1="+imageId);
	// Get all subGallery of the gallery
	$gallery = $('#' + id).find('.elm');//children();
	if ($gallery.length == 0) {
		return;
	}
	var nextId = imageId + 1;
	if (nextId >= $gallery.length) {
			nextId = 0;
	}

	var nextnextId = nextId + 1;
	if (nextnextId >= $gallery.length) {
			nextnextId = 0;
	}

	if( $("#"+id).attr('played') != "true"){
			nextId = imageId ;
	}

	// get imageId
	if( $("#"+id).attr('played') != "true"){
		$("#"+id).attr('played',"true");
	//if (imageId == 0 && $gallery.eq($gallery.length - 1).css('opacity') == 0 && $gallery.eq(imageId).css('opacity') == 0){
		// do nothing
	}else {
		if ($gallery.eq(imageId).attr('type') == 'video'){
			////var myVideo=document.getElementById("video_" + $gallery.eq(imageId).attr('id'));
			 //if(!myVideo.ended)
			 //{
			 	 ////myVideo.pause();
			 //}
			////var myVideo=document.getElementById("video_" + $gallery.eq(imageId).attr('id'));
			////myVideo.remove();
		}
		$("#" + id +" .html5-video").remove();

	}
	if($gallery.eq(imageId).parent().attr('type') == 'slideshow' && $gallery.eq(imageId).attr('type') == 'image' && $gallery.eq(imageId).attr('video_uri') != undefined)
	{
		if ($gallery.length > 1) {
			//console.log("remove video");
			//$('#video_'+id).remove();
			console.log("hide video");
			//var nowplayingInSlideshow = $("#" + id).attr('nowplaying');
			//$('#video_'+id+'_'+nowplayingInSlideshow).css('opacity',0);
			//$('#videoplay_'+id).css('opacity',0);

		}
	}
	//	$gallery.eq(imageId).stop(true,true).animate({opacity:0}, 6000);
	//}else{
		$gallery.eq(imageId).stop(true,true).animate({opacity:0}, WithTransitionSpeed);
	//}
	var bDelayFadeout = false;

	/*
	var delaytime = VideoDelayTime;
	if(false && bEnableVideoPreloading == true && $gallery.eq(imageId).attr('type') != 'video' && $gallery.eq(nextId).attr('type') == 'video' && imageId!=nextId)
	{
		bDelayFadeout = true;
		if(Math.ceil(delaytime/1000) > $gallery.eq(nextId).attr("duration"))
		{
			delaytime = $gallery.eq(nextId).attr("duration")*1000;
		}
	}
	if(bDelayFadeout == false)
	{
		// do fade-out

	}else{

		window.setTimeout(function(){

			$gallery.eq(imageId).stop(true,true).animate({opacity:0}, WithTransitionSpeed);


			if($gallery.eq(nextId).attr('type') == 'image' && $("#"+id).hasClass('box_skitter') == true)
			{
				if($gallery.eq(imageId).attr('type') != 'image')
				{
					$("#"+id).skitter('nextImage',$gallery.eq(nextId).attr('src'),'ShowImmediately');//ShowImmediately
				}else{
					$("#"+id).skitter('nextImage',$gallery.eq(nextId).attr('src'),'0');// call nextImage function for transition
				}

			}else{
				if($("#"+id).hasClass('box_skitter') == true)
				{
					$("#"+id).skitter('hideImage');
				}
				$gallery.eq(nextId).stop(true,false).animate({opacity:1}, WithTransitionSpeed);

			}

		},delaytime);

	}
	*/

	// slideTime string
	//slideTime = $gallery.eq(imageId).attr("duration") + "s";
	// duration cache durationIndex
	//if (durationIndex.indexOf($gallery.eq(imageId).attr('id')) == -1){
		//duration.push(slideTime);
		//durationIndex.push($gallery.eq(imageId).attr('id'));
	//} else {
		//slideTime = duration[durationIndex.indexOf($gallery.eq(imageId).attr('id'))];
	//}
	if($gallery.eq(nextnextId).attr('type') == 'webpage')
	{
		preLoadingTime = parseInt($gallery.eq(nextId).attr("duration"))/2;
		preLoadingTime = Math.floor(preLoadingTime);
		if(preLoadingTime>15)
			preLoadingTime = 15;
	}else if(($gallery.eq(nextnextId).parent().attr('type') == 'slideshow'  || $gallery.eq(nextnextId).parent().attr('type') == 'image') && $gallery.eq(nextnextId).attr('type') == 'image' && $gallery.eq(nextnextId).attr('video_uri') != undefined)
	{
		if(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i) )
		{
			if((typeof bEnableVideoPreloading) == "undefined")
			{
				bEnableVideoPreloading = true;
				VideoDelayTime = 1000;
			}
			if(bEnableVideoPreloading == true)
			{
				preLoadingTime = VideoDelayTime/1000;
			}

		}else
		{
			preLoadingTime = 0;
		}
	}else
	{
		preLoadingTime = 0;
	}
	if($gallery.eq(imageId).attr('type') == 'webpage' && $gallery.length > 1)
	{
		$gallery.eq(imageId).html('');
	}

	if(($gallery.eq(nextId).parent().attr('type') == 'slideshow' || $gallery.eq(nextId).parent().attr('type') == 'image') && $gallery.eq(nextId).attr('type') == 'image' && $gallery.eq(nextId).attr('video_uri') != undefined)
	{

		subGalleryNext[subGallery.indexOf(id)] = subGalleryNext[subGallery.indexOf(id)]+7200;
	}else
	{

		var thischangtime = subGalleryNext[subGallery.indexOf(id)];

		subGalleryNext[subGallery.indexOf(id)] += parseInt($gallery.eq(nextId).attr("duration"));

		var nextPreLoadingTime = subGalleryNext[subGallery.indexOf(id)] - preLoadingTime;
		if(nextPreLoadingTime<thischangtime)
		{
			nextPreLoadingTime = subGalleryNext[subGallery.indexOf(id)] - 1;
		}
		subGalleryPreDoNext[subGallery.indexOf(id)] = nextPreLoadingTime;
		console.log("nextPreLoadingTime="+nextPreLoadingTime);

	}


	// update subGallery's last index number
	subGalleryIndex[subGallery.indexOf(id)] = nextId;
	// do fade-in

	if ($gallery.length > 1) {
		//Workaround for Photo Decoding Slowly on PD
		next_imageId = nextId + 1;
		if (next_imageId >= $gallery.length) {
				next_imageId = 0;
		}
		if ($gallery.eq(next_imageId).attr('type') == 'image')
		{
			$gallery.eq(next_imageId).css('opacity','0.01');
		}
		/*
		if( $gallery.eq(next_imageId).attr('type') == 'webpage' )
		{
			$gallery.eq(next_imageId).css('opacity','1');
			//if($('#webpage_'+$gallery.eq(next_imageId).attr('id')).length == 0)
			{
				var urip1 = $gallery.eq(next_imageId).attr('uri');
				var webpage1html = "";
				$gallery.eq(next_imageId).html(webpage1html);
				webpage1html += '<iframe id="webpage_';
				webpage1html += $gallery.eq(next_imageId).attr('id') + '"';
				webpage1html += ' class=""';
				webpage1html += ' src="'+urip1+'" ></iframe>';
				$gallery.eq(next_imageId).html(webpage1html);
				$gallery.eq(next_imageId).find('iframe').css('opacity','0.01')
			}

		}
		*/
	}
	if($gallery.eq(nextId).parent().attr('type') == 'slideshow' && $gallery.eq(nextId).attr('type') == 'image' && $gallery.eq(nextId).attr('video_uri') != undefined)
	{
	//

		if ($("#videoplay_" + id).length == 0 ||  $("#videoplay_" + id).css('opacity') == 0){
			//console.log("--------------------------> slideshow_video_uri="+  $gallery.eq(nextId).attr('video_uri'))
			createSlideshowVideo(id,$gallery.eq(nextId).attr('id'));
		}

	}
	if(bDelayFadeout == false)
	{

		if($gallery.eq(nextId).attr('type') == 'image' && $("#"+id).hasClass('box_skitter') == true)
		{
			if(($gallery.eq(nextId).parent().attr('type') == 'slideshow' || $gallery.eq(nextId).parent().attr('type') == 'image' ) && $gallery.eq(nextId).attr('type') == 'image' && $gallery.eq(nextId).attr('video_uri') != undefined)
			{
				//$("#"+id).skitter('hideImage');
				//$("#"+id).skitter('nextImage',$gallery.eq(nextId).attr('src'),'0');
				//setTimeout('')
				//$("#video_" + id).animate({opacity:1}, 500);
				//console.log('---------------------------> PPPPP1 = '+$gallery.eq(nextId).attr('src'))
			}else
			if($gallery.eq(imageId).attr('type') != 'image')
			{
				$("#"+id).skitter('nextImage',$gallery.eq(nextId).attr('src'),'ShowImmediately');//ShowImmediately
			}else{
				$("#"+id).skitter('nextImage',$gallery.eq(nextId).attr('src'),'0');// call nextImage function for transition
			}

		}else{
			if($("#"+id).hasClass('box_skitter') == true)
			{
				$("#"+id).skitter('hideImage');
			}
			if(($gallery.eq(nextId).parent().attr('type') == 'slideshow' || $gallery.eq(nextId).parent().attr('type') == 'image' ) && $gallery.eq(nextId).attr('type') == 'image' && $gallery.eq(nextId).attr('video_uri') != undefined)
			{
				//$("#"+id).skitter('hideImage');
				//$("#"+id).skitter('nextImage',$gallery.eq(nextId).attr('src'),'0');
				//setTimeout('')
				//$("#video_" + id).animate({opacity:1}, 500);
				//console.log('---------------------------> PPPPP2')
			}else
			if($gallery.eq(nextId).attr('type') == 'webpage')
			{
				$gallery.eq(nextId).stop(true,false).animate({opacity:1}, 1000);
			}else
			{
				$gallery.eq(nextId).stop(true,false).animate({opacity:1}, WithTransitionSpeed);
			}


		}

	}
	console.log("imageId2="+nextId);
	console.log('--->id='+$gallery.eq(nextId).attr('id')+';type='+$gallery.eq(nextId).attr('type'));

	if($gallery.eq(nextId).attr('type') == 'video' && $gallery.eq(nextId).attr('vmode') == 'loopAll' )
	{
		console.log("It's loopAll video ="+nextId);
		$('#'+id).find('.elm').each(function(){
			$(this).css('display','none');
		});
		//subGalleryNext[subGallery.indexOf(id)] = 10;

		var makeVideo = function(regionid,vid){
			var vdw = parseInt($('#'+regionid).css('width'));
			var vdh = parseInt($('#'+regionid).css('height'));
			var oldvid = $("#" + regionid).attr('nowplaying');
			$("#" + regionid).attr('oldplaying',oldvid);
			$("#" + regionid).attr('nowplaying',vid);
			//$("#video_" + regionid+"_"+vid).remove();
			if($("#videowrapper_" + regionid +"_"+vid).length == 0)
			{
				var wrapperhtml = "";
				wrapperhtml += '<div  id="videowrapper_';
				wrapperhtml += regionid + '_' + vid +'" class="vmode-video" style="background-color:transparent;opacity:0;width:'+vdw+'px !important ;height:'+vdh+'px !important "></div>';
				$('#videoplay_'+regionid).append(wrapperhtml);
			}

			var poster = 'js/std/empty2.png';
			if ($("#video_" + regionid+"_"+vid).attr('playend') == "true" ||  $("#video_" + regionid+"_"+vid).length == 0){
				//console.log("width===="+$('#'+regionid).css('width'))
				//console.log("height===="+$('#'+regionid).css('height'))

				if($("#video_" + regionid+"_"+vid).length == 0)
				{
					var uri = $($('#'+regionid).find('.elm').get(vid-1)).attr('uri');
					var videohtml = "";
					videohtml += '<video  id="video_';
					videohtml += regionid + '_' + vid +'"';
					videohtml += ' class="vmode-video"';
					videohtml += ' autoplay width="'+vdw+'px" height="'+vdh+'px" style="background-color:transparent;width:'+vdw+'px !important ;height:'+vdh+'px !important "';
					if($('#'+regionid).find('.elm').length == 1 )
					{
						if(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i))
						{
							videohtml += 'onended="this.currentTime=0;this.load();this.play();" ' ;
						}else
						{
							videohtml += 'onended="this.currentTime=0;this.load();this.play();" ' ;
							//videohtml += 'loop ';
						}
					}
					//videohtml += 'poster="' + poster + '" >';
					videohtml += ' >';
		            if (uri.search('.ogv') > -1) {
						videohtml += '<source src="' + uri + '" type="video/ogg" />';
					} else if (uri.search('.webm') > -1) {
						videohtml += '<source src="' + uri + '" type="video/webm" />';
					} else if (uri.search('.avi') > -1) {
						videohtml += '<source src="' + uri + '" type="video/avi" />';
					} else if (uri.search('.mpeg') > -1) {
						videohtml += '<source src="' + uri + '" type="video/mpeg" />';
					} else if (uri.search('.m4v') > -1) {
						videohtml += '<source src="' + uri + '" type="video/m4v" />';
					} else if (uri.search('.wmv') > -1) {
						videohtml += '<source src="' + uri + '" type="video/wmv" />';
					} else if (uri.search('.mov') > -1) {
						videohtml += '<source src="' + uri + '" type="video/mov" />';
					} else {
						videohtml += '<source src="' + uri + '" type="video/mp4" />';
					}
					//videohtml += '您的浏览器不支援HTML 5影片播放标签格式。';
					//videohtml += '您的瀏覽器不支援HTML 5影片播放標籤格式。';
					//videohtml += 'Your browser does not support the html5 video tag.';
					videohtml += '</video>';
					$('#video_'+regionid+"_"+vid).remove();
					$('#videowrapper_'+regionid+"_"+vid).html(videohtml);
					$("#video_" + regionid+"_"+vid).attr('playend','false');
					var myVideo=document.getElementById("video_" + regionid+'_'+vid);

				}else
				{
					var myVideo=document.getElementById("video_" + regionid+'_'+vid);
					myVideo.currentTime = 0;
					myVideo.load();
					myVideo.play();
					$("#video_" + regionid+"_"+vid).attr('playstarted','false');
					$("#video_" + regionid+"_"+vid).attr('playend','false');
					console.log("------------->play again!!");
				}

				function doVideoPlayEnd(videoid,event)
				{

					//timeupArray[videoid] = "";
					var regionid = $('#'+videoid).parent().parent().parent().attr('id');

					if(event == 'timeup')
					{
						var video = document.getElementById(videoid);
						video.pause();
						console.log("Pause Video");
					}
					if($('#'+videoid).attr('playend') == 'false')
					{
						clearTimeout(timeupArray[regionid]);
						console.log("Really dododododododododododododododododo Player Endded("+videoid+")!!!!!!!!!")
						$('#'+videoid).attr('playend','ending');
						var nowloop = parseInt($('#'+regionid).attr('nowloop'));
						var videonum = parseInt($('#'+regionid).attr('videonum'));
						var nowplaying = parseInt($('#'+regionid).attr('nowplaying'));
						var oldplaying = nowplaying;
						console.log(nowplaying+"/"+$('#'+regionid).find('.elm').length);
						if(nowplaying < $('#'+regionid).find('.elm').length)
						{
							nowplaying++;
							if(videonum == 1){nowloop++;}
						}else{
							nowloop++;
							nowplaying=1;
						}
						if(videototalloopnum>0 && nowloop>videototalloopnum)
						{
							showMessageOnParent("videoplayend");
							sendMessageToParent("videoplayend");
							return;
						}
						$('#'+regionid).attr('nowloop',nowloop);
						console.log(nowplaying+"/"+$('#'+regionid).find('.elm').length);
						//$(this).attr('uri', $($(this).parent().find('.elm').get(nowplaying-1)).attr('uri'));
						//if(oldplaying==nowplaying){$('#'+videoid).attr('playend','true');}
						$('#'+videoid).attr('playend','true');
						if(navigator.userAgent.match(/HAIER_SMNT/i) )
						{
							$('#'+videoid).remove();//<------- Some Hardware Accerlation Android Browser will need this to avoid video cropping.
						}
						makeVideo($('#'+regionid).attr('id'),nowplaying);
						console.log("Player Endded!!!!!!!!!")
					}
				}


				$gallery = $('#' + regionid).find('.elm');
				var duration = parseInt($gallery.eq(vid-1).attr('duration'))*1000;
				//console.log("-------------vid="+vid+"-------------->duration="+duration);
				var timeoutobjA = new Object();
				timeoutobjA.videoid = "video_" + regionid+"_"+vid;
				clearTimeout(timeupArray[regionid])
				timeupArray[regionid] = setTimeout((function(timeoutobjA){
					return function(){
						console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000myVideo.onTimeUP("+timeoutobjA.videoid+")!!");
						doVideoPlayEnd(timeoutobjA.videoid,'timeup');
						//myVideo.currentTime = myVideo.duration + 1;
						//console.log("this.currentTime = "+myVideo.currentTime);
					}
				})(timeoutobjA),duration);



				if($('#'+regionid).find('.elm').length > 1 )
				{
					myVideo.onended = function(){

						videoid = $(this).attr('id');
						//$('#result').append("Video.onended("+videoid+")!!")
						console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000myVideo.onended("+videoid+")!!");
						doVideoPlayEnd(videoid,'onended');
					}
				}

				function doVideoPlayStart(videoid,event)
				{
					if($('#'+videoid).attr('playstarted') != 'true')
					{
						$('#'+videoid).attr('playstarted','true');
						var regionid = $('#'+videoid).parent().parent().parent().attr('id');
						console.log("onplaying-"+event);
						//var regionid = $(this).parent().parent().parent().attr('id');
						var zindexbase = parseInt($('#'+regionid).css('z-index'));
						console.log("regionid="+regionid)
						var oldplaying = parseInt($('#'+regionid).attr('oldplaying'));
						var nowplaying = parseInt($('#'+regionid).attr('nowplaying'));
						console.log("oldplaying="+oldplaying+" nowplaying="+nowplaying)

						var timedur = 500;
						if($("#video_" + regionid+"_"+oldplaying).length == 0)
						{
							timedur = 1;
							console.log("#video_" + regionid+"_"+oldplaying+" is removed!")
						}
						if(oldplaying!=nowplaying){
							var obj = new Object();
							obj.regionid = regionid;
							obj.oldplaying = oldplaying;
							setTimeout((function(obj){
								return function(){
									$("#videowrapper_" + obj.regionid+"_"+obj.oldplaying).css('opacity','0');
									//$("#video_" + obj.regionid+"_"+obj.oldplaying).remove();
									console.log("!!!!!!!!!!!!!!!!!11hide video("+obj.oldplaying+")!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11");
								}
							})(obj),500)	//to hide first frame blank on Android
						}


						$("#videowrapper_" + regionid+"_"+oldplaying).css('z-index',(zindexbase+1));
						$("#videowrapper_" + regionid+"_"+nowplaying).css('z-index',(zindexbase+0));
						$("#videowrapper_" + regionid+"_"+nowplaying).css('opacity','1');
						console.log("---------------->set video now= "+nowplaying+" opacity = 1 ("+ $("#videowrapper_" + regionid+"_"+nowplaying).css('opacity') +")");

						var video = document.getElementById(videoid);
						if($('#'+regionid).attr('volume')==undefined)
						{
							video.volume = 1;
						}else
						{
							vidvolume = parseInt($('#'+regionid).attr('volume'))/100;
							video.volume = vidvolume;
						}
					}

				}
				//$('#ua').html(navigator.userAgent)

				myVideo.onplaying= function(){
					videoid = $(this).attr('id');
					doVideoPlayStart(videoid,"onplaying");
				}

				var timeoutobjB = new Object();
				timeoutobjB.videoid = "video_" + regionid+"_"+vid;
				setTimeout((function(timeoutobjB){
					return function(){
						doVideoPlayStart(timeoutobjB.videoid,'workaroundplay');
					}
				})(timeoutobjB),500);


				function checkDuration(videoid)
				{
					var video = document.getElementById(videoid);
					console.log("Video Duration = "+myVideo.duration);
					//$('#result').append("Video Duration = "+myVideo.duration);
					var VideoDuration =(Math.ceil(myVideo.duration)+1)*1000; // myVideo.duration*1000-500;
					console.log("Video Duration = "+VideoDuration);
					//$('#result').append("Video Duration = "+VideoDuration);

					if(true)
					{
						if(VideoDuration>1000)
						{
							var timeoutobjC = new Object();
							timeoutobjC.videoid = videoid;
							setTimeout((function(timeoutobjC){
								return function(){
									console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000myVideo.onTimeUP2("+timeoutobjC.videoid+")!!");
									doVideoPlayEnd(timeoutobjC.videoid,'timeup');
									//myVideo.currentTime = myVideo.duration + 1;
									//console.log("this.currentTime = "+myVideo.currentTime);
								}
							})(timeoutobjC),VideoDuration);
						}else
						{
							var timeoutobjD = new Object();
							timeoutobjD.videoid = videoid;
							setTimeout((function(timeoutobjD){
								return function(){
									checkDuration(timeoutobjD.videoid)
								}
							})(timeoutobjD),500);
						}
					}
				}

				var timeoutobjE = new Object();
				timeoutobjE.videoid = "video_" + regionid+"_"+vid;
				setTimeout((function(timeoutobjE){
					return function(){
						checkDuration(timeoutobjE.videoid)
					}
				})(timeoutobjE),500);


			}
		}



		if ($("#videoplay_" + id).length == 0 ){
			if( (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true && bEnablePortraitVideoFix == true)
			{
				$('#'+id).append('<div id="videoplay_'+id+'" class="vmode-video" style="background-color:transparent;"></div>');
			}else
			{
				$('#'+id).append('<div id="videoplay_'+id+'" class="vmode-video" style="background-color:transparent;"></div>');
			}
			$('#'+id).attr('nowloop',1);

			function applyVideo(id){
				$('#'+id).bind('click',function(x){
					var vbj = $(this).find('video').attr('id');
					var myVideoPlayer = document.getElementById(vbj);
					myVideoPlayer.load();
					myVideoPlayer.play();
				})
				makeVideo(id,1);
			}

			if(starttime == 0){
				applyVideo(id);
			}else{
				launchIdList.push(id);
				var cb = document.getElementById(id);
				cb.addEventListener('lauchNow', function(event) {
					setTimeout(function(){applyVideo(id);},600);
				});
			}
		}
	}else

	//console.log("id: " + id + " S " + imageId  + " / " + $gallery.length);
	if ($gallery.eq(nextId).attr('type') == 'video' && $gallery.eq(nextId).attr('vmode') != 'loopAll'  ){
		//$(".html5-video").remove();


		var uri = $gallery.eq(nextId).attr('uri');
		var poster = 'js/std/poster.png';
		if ($("#video_" + $gallery.eq(nextId).attr('id')).length == 0 ){
			var videohtml = "";
			videohtml += '<video id="video_';
			videohtml += $gallery.eq(nextId).attr('id') + '"';
			videohtml += ' class="html5-video"';
			//videohtml += ' autoplay loop poster="' + poster + '" >';
            videohtml += ' autoplay loop >';
            if (uri.search('.ogv') > -1) {
				videohtml += '<source src="' + uri + '" type="video/ogg" />';
			} else if (uri.search('.webm') > -1) {
				videohtml += '<source src="' + uri + '" type="video/webm" />';
			} else if (uri.search('.avi') > -1) {
				videohtml += '<source src="' + uri + '" type="video/avi" />';
			} else if (uri.search('.mpeg') > -1) {
				videohtml += '<source src="' + uri + '" type="video/mpeg" />';
			} else if (uri.search('.m4v') > -1) {
				videohtml += '<source src="' + uri + '" type="video/m4v" />';
			} else if (uri.search('.wmv') > -1) {
				videohtml += '<source src="' + uri + '" type="video/wmv" />';
			} else if (uri.search('.mov') > -1) {
				videohtml += '<source src="' + uri + '" type="video/mov" />';
			} else {
				videohtml += '<source src="' + uri + '" type="video/mp4" />';
			}
			videohtml += '您的瀏覽器不支援HTML 5影片播放標籤格式。';
			videohtml += 'Your browser does not support the video tag.';
			videohtml += '</video>';
			$gallery.eq(nextId).html(videohtml);



			/*
			myVideoPlayer = document.getElementById("video_" + $gallery.eq(nextId).attr('id'));
			myVideoPlayer.load();
			myVideoPlayer.addEventListener('loadedmetadata', function() {
			console.log("------->myVideoPlayer.duration="+myVideoPlayer.duration);
			video_duration = Math.round(myVideoPlayer.duration);

			console.log("------->subGalleryNext[subGallery.indexOf(id)]="+subGalleryNext[subGallery.indexOf(id)]);
			console.log('------->parseInt($gallery.eq(nextId).attr("duration")='+parseInt($gallery.eq(nextId).attr("duration")));


			subGalleryNext[subGallery.indexOf(id)]-= parseInt($gallery.eq(nextId).attr("duration"));
			$gallery.eq(nextId).attr("duration",video_duration);
			subGalleryNext[subGallery.indexOf(id)]+=video_duration;
			console.log("------->subGalleryNext[subGallery.indexOf(id)]="+subGalleryNext[subGallery.indexOf(id)]);

			});
			*/
			//$('#region_53da5a2746b8e').html('<div style="color: white; opacity: 1;">'+imageId+'==='+'#video_' + $gallery.eq(imageId).attr('id')+'</div>');
		} else {
			var myVideo=document.getElementById("video_" + $gallery.eq(nextId).attr('id'));
			//myVideo.remove();

			//myVideo.currentTime = 0;
			myVideo.load();
			myVideo.play();
			//console.log("duration2="+$("#video_" + $gallery.eq(nextId).attr('id')).duration);

		}
	} else if ($gallery.eq(nextId).attr('type') == 'marqueeOLD'){

		if(bEnableResetMarquee == true)
		{

			var temp = $gallery.eq(nextId);
			var idx = temp.attr("id");
			var backuptemp = $('#'+idx+'_backup');
			var duration = temp.attr("duration");

			$('#'+idx).trigger('stop');

			var callback = function(){

				$('#'+idx).before('<div id='+idx+'_prev></div>');
				var temp = $('#'+idx);
				temp.remove();
		 		$('#'+idx+'_prev').after(backuptemp.clone());
				$('#'+idx+'_prev').next().attr('id',idx);
				$('#'+idx+'_prev').remove();
				createText('#'+idx);
				$('#'+idx).animate({opacity:1}, transitionSpeed);
				$('#'+idx).attr('duration',duration);
				$('#'+idx).attr('class','elm');
				$('#'+idx).attr('type','marquee');
			}

			temp.marquee('cancel',callback);

		}

	}else if ($gallery.eq(nextId).attr('type') == 'marquee'){

/*
		if(bEnableResetMarquee == true)
		{

			var temp = $gallery.eq(nextId);
			var idx = temp.attr("id");
			var backuptemp = $('#'+idx+'_backup');
			var duration = temp.attr("duration");

			$('#'+idx).trigger('stop');

			var callback = function(){

				$('#'+idx).before('<div id='+idx+'_prev></div>');
				var temp = $('#'+idx);
				temp.remove();
		 		$('#'+idx+'_prev').after(backuptemp.clone());
				$('#'+idx+'_prev').next().attr('id',idx);
				$('#'+idx+'_prev').remove();
				createText('#'+idx);
				$('#'+idx).animate({opacity:1}, transitionSpeed);
				$('#'+idx).attr('duration',duration);
				$('#'+idx).attr('class','elm');
				$('#'+idx).attr('type','marquee');
			}

			temp.marquee('cancel',callback);

		}
*/
	}else if($gallery.eq(nextId).attr('type') == 'onlinevideo'){
		console.log("It's onlinevideo video!!");
		if((typeof lib3rdpartyvideo_is_load) != "undefined")
		{
			if($('#onlinevideo-'+id).length == 0)
			{
				console.log("lib3rdpartyvideo is already !!!");
				$('#'+id).find('.elm').each(function(){
					$(this).css('display','none');
				});

				var playlist = new Array();

				$('#'+id).find('.elm').each(function(){
					playlist.push($(this).attr('uri'));
				})
				console.log(playlist);

				var onlineVideoHtml = do3rdPartyOnlineVideo(playlist);
				if(onlineVideoHtml == undefined)
				{
					$('#'+id).attr('type','video');
					$('#'+id).find('.elm').each(function(){
						$(this).attr('type','video');
					})
					if($('#'+id).find('.elm').length == 1)
					{
						var videoDom = $('#'+id).find('.elm');
						videoDom.clone().appendTo('#'+id);
						var videoDom = $('#'+id).find('.elm');
						videoDom[1].id = videoDom[1].id+'_clone';
					}
					subGalleryNext[subGallery.indexOf(id)]=uuu+1;
				}else
				{
					function applyOnlineVideo(id,onlineVideoHtml){
						$('#'+id).append(onlineVideoHtml);
					}
					$('#'+id).find('.onlinevideo').attr('id','onlinevideo-'+id);

					if(starttime == 0){
						applyOnlineVideo(id,onlineVideoHtml);
					}else{
						launchIdList.push(id);
						var cb = document.getElementById(id);
						cb.addEventListener('lauchNow', function(event) {
							setTimeout(function(){applyOnlineVideo(id,onlineVideoHtml);},500);
						});
					}
				}

			}
		}
	} else if($gallery.eq(nextId).attr('type') == 'webpage'){

			if($('#webpage_'+$gallery.eq(nextId).attr('id')).length == 0)
			{
				createWebpage($gallery.eq(nextId).attr('id'));
			}else
			{
				$('#webpage_'+$gallery.eq(nextId).attr('id')).css('opacity','1');
			}
	} else if($gallery.eq(nextId).attr('type') == 'android_webpage' && $gallery.eq(nextId).attr('emuandroid') == 'true'){

			if($('#android_webpage_'+$gallery.eq(nextId).attr('id')).length == 0)
			{
				createEmuAndroidWebpage($gallery.eq(nextId).attr('id'));
			}else
			{
				$('#android_webpage_'+$gallery.eq(nextId).attr('id')).css('opacity','1');
			}
	}

	$gallery = undefined;
	delete $gallery;
	// timer
	//$('body').oneTime(slideTime, id, function(){
		//changePicture(id);
	//});
}
function createSlideshowVideo(regionid,elmid){
	console.log("bEnableVideoPreloading="+bEnableVideoPreloading)
	if((typeof bEnableVideoPreloading) == "undefined")
	{
		console.log("Why UNDEFINED!!!!!!!!!!!!!!!!!!!!!!");
		//bEnableVideoPreloading = true;
		//VideoDelayTime = 1000;
	}
	if(bEnableVideoPreloading == true)
	{
		var preLoadingTime = VideoDelayTime;
		console.log("preLoadingTime1-----------="+preLoadingTime);
	}else
	{
		var preLoadingTime = 0;
	}

	if ($("#videoplay_" + regionid).length == 0 ){
		$('#'+regionid).append('<div id="videoplay_'+regionid+'" class="vmode-video" style="background-color:transparent;opacity:0"></div>');

	}
	var nowid = 0;
	$gallery = $('#' + regionid).find('.elm');
	for(var i = 0; i<$gallery.length ; i++)
	{
		if($gallery.eq(i).attr('id') === elmid)
		{
			nowid = i;
			break;
		}
	}

	i--;
	if(i<0){i=$gallery.length-1;}

	var oldvid = $gallery.eq(i).attr('id');

	$("#" + regionid).attr('oldplaying',oldvid);
	$("#" + regionid).attr('nowplaying',elmid);
	subGalleryIndex[subGallery.indexOf(regionid)] = nowid;


	var vdw = parseInt($('#'+regionid).css('width'));
	var vdh = parseInt($('#'+regionid).css('height'));
	if($("#videowrapper_" + regionid +"_"+elmid).length == 0)
	{
		var wrapperhtml = "";
		wrapperhtml += '<div  id="videowrapper_';
		wrapperhtml += regionid + '_' + elmid +'" class="vmode-video" style="background-color:transparent;opacity:0;width:'+vdw+'px !important ;height:'+vdh+'px !important "></div>';
		$('#videoplay_'+regionid).append(wrapperhtml);
	}

	//$("#video_" + regionid+"_"+elmid).remove();


	var poster = 'js/std/poster.png';
	if ($("#video_" + regionid+"_"+elmid).attr('playend') == "true" || $("#video_" + regionid+"_"+elmid).length == 0 ){

		if( $("#video_" + regionid+"_"+elmid).length == 0 )
		{
			var uri = $('#'+elmid).attr('video_uri');//$($('#'+regionid).find('.elm').get(vid-1)).attr('uri');
			console.log("--------------------------------------------->play uri===="+uri);
			var videohtml = "";
			videohtml += '<video  id="video_';
			videohtml += regionid + '_'+elmid+'"';
			videohtml += ' class="vmode-video"';
			//videohtml += ' autoplay  style="opacity:0" ';  //background-color:#000000;position:absolute;top:0px;left:0px;
			videohtml += ' autoplay width="'+vdw+'px" height="'+vdh+'px" style="background-color:transparent;width:'+vdw+'px !important ;height:'+vdh+'px !important "';
			if($('#'+regionid).find('.elm').length == 1 )
			{
				if(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i))
				{
					videohtml += 'onended="this.currentTime=0;this.load();this.play();" ' ;
				}else
				{
					videohtml += 'onended="this.currentTime=0;this.load();this.play();" ' ;
					//videohtml += 'loop ';
				}
				$("#videoplay_" + regionid).css('opacity',1);
			}
			//videohtml += 'poster="' + poster + '" >';
			videohtml += ' >';
	        if (uri.search('.ogv') > -1) {
				videohtml += '<source src="' + uri + '" type="video/ogg" />';
			} else if (uri.search('.webm') > -1) {
				videohtml += '<source src="' + uri + '" type="video/webm" />';
			} else if (uri.search('.avi') > -1) {
				videohtml += '<source src="' + uri + '" type="video/avi" />';
			} else if (uri.search('.mpeg') > -1) {
				videohtml += '<source src="' + uri + '" type="video/mpeg" />';
			} else if (uri.search('.m4v') > -1) {
				videohtml += '<source src="' + uri + '" type="video/m4v" />';
			} else if (uri.search('.wmv') > -1) {
				videohtml += '<source src="' + uri + '" type="video/wmv" />';
			} else if (uri.search('.mov') > -1) {
				videohtml += '<source src="' + uri + '" type="video/mov" />';
			} else {
				videohtml += '<source src="' + uri + '" type="video/mp4" />';
			}
			//videohtml += '您的浏览器不支援HTML 5影片播放标签格式。';
			//videohtml += '您的瀏覽器不支援HTML 5影片播放標籤格式。';
			//videohtml += 'Your browser does not support the html5 video tag.';
			videohtml += '</video>';
			//$('#videoplay_'+regionid).append(videohtml);
			$('#video_'+regionid+"_"+elmid).remove();
			$('#videowrapper_'+regionid+"_"+elmid).html(videohtml);
			$("#video_" + regionid+"_"+elmid).attr('playend','false');
			var myVideo=document.getElementById("video_" + regionid+'_'+elmid);
		}else
		{
			var myVideo=document.getElementById("video_" + regionid+'_'+elmid);
			myVideo.currentTime = 0;
			myVideo.load();
			myVideo.play();
			$("#video_" + regionid+"_"+elmid).attr('playstarted','false');
			$("#video_" + regionid+"_"+elmid).attr('playend','false');
		}

		function doPlayEnd(videoid,event){

			console.log("videoid="+videoid)

			var regionid = $('#'+videoid).parent().parent().parent().attr('id');

			console.log("regionid="+regionid)
			console.log("playend="+$('#'+videoid).attr('playend'))
			if($('#'+videoid).attr('playend') == "false")
			{
				clearTimeout(timeupArray[regionid]);
				console.log("Really dododododododododododododododododo Player Endded("+videoid+")!!!!!!!!!")
				$('#'+videoid).attr('playend','ending');

				if($('#'+regionid).find('.elm').length > 1 )
				{
					var zindexbase = parseInt($('#'+regionid).css('z-index'));
					var oldplaying = $('#'+regionid).attr('oldplaying');
					var nowplaying = $('#'+regionid).attr('nowplaying');
					$gallery = $('#' + regionid).find('.elm');
					for(var i = 0; i<$gallery.length ; i++)
					{
						if($gallery.eq(i).attr('id') === nowplaying)
						{
							break;
						}
					}
					i++;
					if(i>=$gallery.length){i=0;}
					var nextplaying = $gallery.eq(i).attr('id');
					console.log('nextplaying is '+ nextplaying);
					var video = document.getElementById(videoid);
					if($('#'+nextplaying).attr('video_uri')!=undefined)
					{

						video.pause();
						$("#"+videoid).attr('playend','true');
						if(navigator.userAgent.match(/HAIER_SMNT/i) )
						{
							$('#'+videoid).remove();//<------- Some Hardware Accerlation Android Browser will need this to avoid video cropping.
						}
						createSlideshowVideo(regionid,nextplaying);

					}else
					{
						subGalleryNext[subGallery.indexOf(regionid)] = uuu + parseInt($gallery.eq(i).attr('duration'));
						subGalleryIndex[subGallery.indexOf(regionid)] = i;

						$("#videowrapper_" + regionid+"_"+nowplaying).css('z-index',(zindexbase-1));

						if($('#'+regionid).hasClass('box_skitter') == true)
						{
							$("#"+regionid).skitter('nextImage',$('#'+nextplaying).attr('src'),'0');
						}
						var delay = 0;
						if(event)
						{
							//$("#videoplay_" + regionid).animate({opacity:0},{duration:500}); //video fadeout
							delay = parseInt($gallery.eq(i).attr('duration'))*1000-1000;
							if(delay>5000)
							{
								delay = 5000;
							}
							console.log("delay="+delay)
							video.volume = 0;
						}
						var obj = new Object();
						obj.regionid = regionid;
						obj.nowplaying = nowplaying;
						obj.zindexbase = zindexbase;
						obj.videoid = videoid;
						setTimeout((function(obj){
							return function(){
								var video = document.getElementById(obj.videoid);
								video.pause();
								$("#videoplay_" + obj.regionid).css('opacity',0);
								$("#videowrapper_" + obj.regionid+"_"+obj.nowplaying).css('z-index',(obj.zindexbase-1));
								if(navigator.userAgent.match(/HAIER_SMNT/i) )
								{
									console.log("<------- Some Hardware Accerlation Android Browser will need this to avoid video cropping.");
									$('#'+videoid).remove();//<------- Some Hardware Accerlation Android Browser will need this to avoid video cropping.
								}
								$("#"+obj.videoid).attr('playend','true');
								console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Delay Player Endded!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
							}
						})(obj),delay);
					}
					console.log("Player Endded1!!!!!!!!!")

					//console.log("remove video2");
					//$("#video_" + regionid).remove();
				}else
				{
					video.pause();
					$("#"+videoid).attr('playend','true');
					if(navigator.userAgent.match(/HAIER_SMNT/i) )
					{
						$('#'+videoid).remove();//<------- Some Hardware Accerlation Android Browser will need this to avoid video cropping.
					}
					createSlideshowVideo(regionid,nextplaying);
				}
			}
		}

		var duration = parseInt($('#'+elmid).attr('duration'))*1000;
		console.log("-------------elmid="+elmid+"-------------->duration="+duration);
		var timeoutobj = new Object();
		timeoutobj.videoid = "video_" + regionid+"_"+elmid;
		clearTimeout(timeupArray[regionid])
		timeupArray[regionid]  = setTimeout((function(timeoutobj){
			return function(){
				console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000myVideo.onTimeUP("+timeoutobj.videoid+")!!");
				doPlayEnd(timeoutobj.videoid,'timeup');
				//myVideo.currentTime = myVideo.duration + 1;
				//console.log("this.currentTime = "+myVideo.currentTime);
			}
		})(timeoutobj),duration);

		myVideo.ontimeupdate = function(e){

			if (this.currentTime > this.duration - 0.1) {
            	console.log("do things when playback finished for the first time");
            }
		}

		myVideo.onended = function(){
			console.log("myVideo.onended!!");
			doPlayEnd($(this).attr('id'),'onended');
		}


		function doVideoPlayStart(videoid,event)
		{
			if($('#'+videoid).attr('playstarted') != 'true')
			{
				$('#'+videoid).attr('playstarted','true');
				var regionid = $('#'+videoid).parent().parent().parent().attr('id');
				console.log("----SLIDE--->onplaying");
				var zindexbase = parseInt($('#'+regionid).css('z-index'));
				console.log("regionid="+regionid)
				var oldplaying = ($('#'+regionid).attr('oldplaying'));
				var nowplaying = ($('#'+regionid).attr('nowplaying'));
				$('#'+regionid).find('.container_skitter').css('z-index',zindexbase+1)

				var obj = new Object();
				obj.regionid = regionid;
				obj.oldplaying = oldplaying;
				obj.nowplaying = nowplaying;
				obj.zindexbase = zindexbase;


				//preLoadingTime = 3000;
				if($('#'+oldplaying).attr('video_uri')!=undefined)
				{
					preLoadingTime = 0;
				}
				console.log("preLoadingTime-----------="+preLoadingTime);
				setTimeout((function(obj){
					return function()
					{
						var regionid = obj.regionid;
						var oldplaying = obj.oldplaying;
						var nowplaying = obj.nowplaying;
						var zindexbase = obj.zindexbase;
						$("#videowrapper_" + regionid+"_"+oldplaying).css('z-index',(zindexbase+0));
						$("#videowrapper_" + regionid+"_"+nowplaying).css('z-index',(zindexbase-1));
						$("#videowrapper_" + regionid+"_"+nowplaying).css('opacity',1);
						$("#" + nowplaying).css('opacity',0);
						if($('#'+regionid).hasClass('box_skitter') == true)
						{
							//$("#"+regionid).skitter('fadeOutImage',$('#'+oldplaying).attr('src'));
						}

						console.log("----SLIDE--->oldplaying="+oldplaying);
						console.log("----SLIDE--->nowplaying="+nowplaying);
						if(oldplaying!=nowplaying)
						{

							$("#" + oldplaying).css('opacity',0);
							if(true || $('#'+oldplaying).attr('video_uri')!=undefined) //if previous is video
							{
								var obj2 = new Object();
								obj2.regionid = regionid;
								obj2.oldplaying = oldplaying;
								obj2.nowplaying = nowplaying;

								var timedur = 500;
								if($("#video_" + regionid+"_"+oldplaying).length == 0)
								{
									timedur = 1;
									console.log("#video_" + regionid+"_"+oldplaying+" is removed!")
								}

								console.log("-------------------------------------->wait 3 sec!!");
								setTimeout((function(obj2){
									return function(){
										console.log("--------------------------------------> 3 sec time UP!!");
										$("#videowrapper_" + obj2.regionid+"_"+obj2.oldplaying).css('opacity','0');
										$("#videowrapper_" + obj2.regionid+"_"+obj2.oldplaying).css('z-index',(zindexbase-1));
										$("#videowrapper_" + obj2.regionid+"_"+obj2.nowplaying).css('z-index',(zindexbase+0));
										if($('#'+obj2.regionid).hasClass('box_skitter') == true)
										{
											$("#"+obj2.regionid).skitter('nextImage',$('#'+obj2.nowplaying).attr('src'),'0'); // image fadeout here
										}
										//$('#videoplay_'+regionid).css('opacity',1);
										$('#videoplay_'+regionid).animate({opacity:1},{duration:500});
									}
								})(obj2),timedur);	//to hide first frame blank on Android
								//$("#video_" + regionid+"_"+oldplaying).css('opacity',0);

							}
							/*
							else
							{
								if($('#'+oldplaying).attr('type')=='image' && $('#'+regionid).hasClass('box_skitter') == true)
								{
									console.log("ooooooooooooooooo>"+$('#'+oldplaying).attr('src'));
								}
							}
							*/
						}


					}
				})(obj),preLoadingTime);


				var video = document.getElementById(videoid);
				if($('#'+regionid).attr('volume')==undefined)
				{
					video.volume = 1;
				}else
				{
					vidvolume = parseInt($('#'+regionid).attr('volume'))/100;
					video.volume = vidvolume;
				}
			}

		}

		myVideo.onplaying= function(){
			videoid = $(this).attr('id');
			doVideoPlayStart(videoid,"onplaying");
		}


		setTimeout((function(timeoutobj){
			return function(){
				doVideoPlayStart(timeoutobj.videoid,'workaroundplay');
			}
		})(timeoutobj),500);

		function checkDuration(videoid)
		{
			var video = document.getElementById(videoid);
			console.log("Video Duration = "+myVideo.duration);
			//$('#result').append("Video Duration = "+myVideo.duration);
			var VideoDuration =(Math.ceil(myVideo.duration)+1)*1000; // myVideo.duration*1000-500;
			console.log("Video Duration = "+VideoDuration);
			//$('#result').append("Video Duration = "+VideoDuration);

			if(true)
			{
				if(VideoDuration>0)
				{
					var timeoutobj = new Object();
					timeoutobj.videoid = videoid;

					setTimeout((function(timeoutobj){
						return function(){
							console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk00000000000000000000000000000myVideo.onTimeUP2("+timeoutobj.videoid+")!!");
							doPlayEnd(timeoutobj.videoid,'timeup');
							//myVideo.currentTime = myVideo.duration + 1;
							//console.log("this.currentTime = "+myVideo.currentTime);
						}
					})(timeoutobj),VideoDuration);
				}else
				{
					var timeoutobj = new Object();
					timeoutobj.videoid = videoid;
					setTimeout((function(timeoutobj){
						return function(){
							checkDuration(timeoutobj.videoid)
						}
					})(timeoutobj),	500);
				}
			}
		}


		setTimeout((function(timeoutobj){
			return function(){
				checkDuration(timeoutobj.videoid)
			}
		})(timeoutobj),500);

	}
}
function createEmuAndroidWebpage(id) {

	var uri = $('#'+id).attr('uri');
	var webpagehtml = "";
	var to_width = parseInt($('#'+id).parent().css('width'));
	var to_height = parseInt($('#'+id).parent().css('height'));
	webpagehtml += '<iframe id="webpage_' + id + '"  src="'+uri+'"   ';
	webpagehtml += ' frameborder="0" scrolling="no" width="'+to_width+'" height="'+to_height+'" '
	webpagehtml += ' style="position:relative;"'
	webpagehtml += '></iframe>'
	$('#'+id).html(webpagehtml);
}
function createWebpage(id) {
/*
 	var uri = $('#'+id).attr('uri');
	var webpagehtml = "";
	webpagehtml += '<iframe width="1920" height="1080" id="webpage_';
	webpagehtml += id + '"';
	webpagehtml += ' class=""';
	webpagehtml += ' src="'+uri+'" srcolling="no" style="transform:scale(0.55);-o-transform:scale(0.55);-webkit-transform:scale(0.55);-moz-transform:scale(0.55);-ms-transform:scale(0.55);transform-origin:0 0;-o-transform-origin:0 0;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;"></iframe>';
	$('#'+id).html(webpagehtml);
*/
/*
	var to_width = parseInt($('#'+id).parent().css('width'));
	var web_scale  = to_width / selfinnerWidthNow;
	console.log("web_scale="+web_scale)
	var uri = $('#'+id).attr('uri');
	var webpagehtml = "";
	webpagehtml += '<div style="width:'+to_width+'px;height:'+selfinnerHeightNow+'px;overflow:hidden;">'
	webpagehtml += '<iframe id="webpage_' + id + '"  src="'+uri+'"   ';
	webpagehtml += ' frameborder="0" scrolling="no" width="'+selfinnerWidthNow+'" height="'+selfinnerHeightNow+'" '
	webpagehtml += ' style="width:'+selfinnerWidthNow+'px;height:'+selfinnerHeightNow+'px;transform:scale('+web_scale+');-o-transform:scale('+web_scale+');-webkit-transform:scale('+web_scale+');-moz-transform:scale('+web_scale+');-ms-transform:scale('+web_scale+');transform-origin:0 0;-o-transform-origin:0 0;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;"'
	webpagehtml += '></iframe></div>'
	$('#'+id).html(webpagehtml);
*/
	var zoom_scale = $('#'+id).attr('zoom_scale')/100;//1;
	var web_width = $('#'+id).attr('web_width');//1280;
	var web_height = $('#'+id).attr('web_height');//720;
	var to_width = parseInt($('#'+id).parent().css('width'));
	var to_height = parseInt($('#'+id).parent().css('height'));
	var web_scale  = to_width / web_width * zoom_scale;

	var zoom_offset_x = parseFloat($('#'+id).attr('zoom_offset_x')) * web_scale ;//0;
	var zoom_offset_y = parseFloat($('#'+id).attr('zoom_offset_y')) * web_scale ;//0;

	console.log("web_scale="+web_scale)
	var uri = $('#'+id).attr('uri');
	var webpagehtml = "";
	webpagehtml += '<div style="width:'+to_width+'px;height:'+to_height+'px;overflow:hidden;">'
	webpagehtml += '<iframe id="webpage_' + id + '"  src="'+uri+'"   ';
	webpagehtml += ' frameborder="0" scrolling="no" width="'+web_width+'" height="'+web_height+'" '
	webpagehtml += ' style="position:relative;top:'+(-1)*zoom_offset_y+'px;left:'+(-1)*zoom_offset_x+'px;width:'+web_width+'px;height:'+web_height+'px;transform:scale('+web_scale+');-o-transform:scale('+web_scale+');-webkit-transform:scale('+web_scale+');-moz-transform:scale('+web_scale+');-ms-transform:scale('+web_scale+');transform-origin:0 0;-o-transform-origin:0 0;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;"'
	webpagehtml += '></iframe></div>'
	$('#'+id).html(webpagehtml);

}
function createText(id) {
	//var scaleFactor = 1;
	//console.log("------->createText("+id+")");
	var scaleFactor = (self.innerHeight)/($('body').attr('height')-100);//Math.min(self.innerWidth/$('body').attr('width'),self.innerHeight/$('body').attr('height'));
	if($(id).attr('fitText')=='0'){
		//scaleFactor = 1;
	}
	if($(id).attr('direction')==undefined)
	{
		$(id).attr('direction','none');
	}
	//alert($(id).parent().attr('id') + "-" + $(id).parent().css('width').replace("px","") + "-" + $(id).parent().css('height').replace("px",""));
	$(id).cmsRender_text({
          type: 'marquee',
          direction: $(id).attr('direction'),
          duration: $(id).attr('duration'),
          durationIsPerItem: true,
          numItems: 0,
          width: $(id).parent().css('width').replace("px",""),
          height: $(id).parent().css('height').replace("px",""),
          originalWidth:$(id).parent().css('width').replace("px",""),
          originalHeight:$(id).parent().css('height').replace("px",""),
          scrollSpeed: $(id).attr('scrollSpeed'),
          fitText: ($(id).attr('fitText')=='1')?true:false,
          scaleText: ($(id).attr('fitText')=='1')?false:true,
          scaleFactor: scaleFactor
    });
}
function createMarquee(id) {

	//console.log("------->createMarquee("+id+")");
	if($(id).attr('direction')==undefined)
	{
		var direction = "left";
	}else
	{
		var direction = $(id).attr('direction');
	}
	var marqueeText = $(id).html();

	if(direction == "up" || direction == "down")
	{
		marqueeText = marqueeText.replace(/(?:\r\n|\r|\n)/g, '<br />');
	}

	$(id).html('');
	$(id).append('<div class="marqueewrapper marquee">'+marqueeText+'</div>');
	//var staticDOM = $(id).find('.marqueetext');
	//staticDOM.clone(true).appendTo($(id).find('.marqueewrapper'));
	//staticDOM.remove();


	$(id+' .marqueewrapper').attr('direction',direction);
	$(id+' .marqueewrapper').attr('scrollamount',$(id).attr('speed'));
	$(id+' .marqueewrapper').attr('behaviour','scroll');
	$(id+' .marqueewrapper').attr('height',parseInt($(id).css('height')));
	$(id+' .marqueewrapper').attr('width',parseInt($(id).css('width')));

	var mmid = $(id).attr('id');
	if(starttime == 0){
		$('#'+mmid+' .marqueewrapper').marquee();
	}else{
		$(id+' .marqueewrapper').addClass('hide');
		launchIdList.push(mmid);
			var cb = document.getElementById(mmid);
			cb.addEventListener('lauchNow',function(){
			$('#'+mmid+' .marqueewrapper').removeClass('hide');
			$('#'+mmid+' .marqueewrapper').marquee();
			middletext(mmid);
		});
	}

}
function createTextEffect(id) {
	//require animate.min.css@http://daneden.github.io/animate.css/
	var regionid = $(id).parent().attr('id');
	if($('#'+regionid).attr('render') != 'true')
	{
		$('head').append('<link rel="stylesheet" type="text/css" href="css/std/animate.min.css">');
		var interval = $(id).attr('interval');
		var effect = $(id).attr('effect');
		$('#'+regionid).attr('nowplaying','0');
		$('#'+regionid).css('white-space','nowrap');

		function doNextTextEffect(id)
		{
			$('#'+regionid).attr('nowplaying',id);
			var nowid = $($('#'+regionid).find('.elm').get(id)).attr('id');
			$('#'+regionid+' .elm').each(function(){if($(this).attr('id')!=nowid){$(this).css('opacity','0')}});
			$('#'+regionid).removeClass('animated '+effect);
			setTimeout(function(){$('#'+nowid).css('opacity','1');$('#'+regionid).addClass('animated '+effect);},50);
			function wait()
			{
				var nowply = parseInt($('#'+regionid).attr('nowplaying'));
				var nextply = nowply+1;
				if(nextply>=$('#'+regionid).find('.elm').length){nextply=0;}
				setTimeout(function(){doNextTextEffect(nextply)},interval*1000)
			}
			$('#'+regionid).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', wait());
		}
		doNextTextEffect(0);


		$('#'+regionid).attr('render','true');
	}
}
function createStaticText(id) {

	var temp = $(id);
	if(temp.attr("fontFamily")!=undefined){temp.css('font-family',temp.attr("fontFamily"));}
	if(temp.attr("fontSize")!=undefined){temp.css('font-size',temp.attr("fontSize"));}
	if(temp.attr("textAlign")!=undefined){temp.css('text-align',temp.attr("textAlign"));}
	if(temp.attr("fontColor")!=undefined){temp.css('color',temp.attr("fontColor"));}
	if(temp.attr("fontStyle")!=undefined){temp.css('font-style',temp.attr("fontStyle"));}//italic
	if(temp.attr("fontWeight")!=undefined){temp.css('font-weight',temp.attr("fontWeight"));}//bold
	if(temp.attr("textDecoration")!=undefined && temp.attr("textDecoration")!="normal"){temp.css('text-decoration',temp.attr("textDecoration"));}//underline
	if(temp.attr("fontSize")!=undefined){temp.css('line-height',parseFloat(temp.css('font-size'))*1.3+'px');}
	if(temp.attr('type') == 'text')
	{
		var padding = 10*gw_scale;
		if(temp.css('text-align') == "left" || temp.css('text-align') == "right")
		{
			temp.css('padding-left',padding+"px");
			temp.css('width',(parseInt(temp.css('width'))-2*padding)+"px");
		}

	}
	if(temp.attr("textVAlign")!=undefined){
		if(temp.attr("textVAlign") == 'middle')
		{
			temp.addClass('middletext');
		}
		if(temp.attr("textVAlign") == 'bottom')
		{
			temp.addClass('bottomtext');
		}
	}
	/*
	var obj = new Object();
	obj.temp = temp;
	setTimeout((function(obj){
        return function(){
        	var temp = obj.temp;
        	if(parseInt(temp.parent().css('height')) > parseInt(temp.find('.middletext').css('height')))
			{
				var statictop = (parseInt(temp.parent().css('height')) - parseInt(temp.find('.middletext').css('height')) )/2;
				//temp.find('.middletext').css('top',statictop+"px");
				temp.find('.middletext').parent().css('padding-top',statictop+"px")
			}
		};
	})(obj),100);
	*/

	/*
	if(temp.attr("fillColor")!=undefined){temp.css('background-color',temp.attr("fillColor"));}
	if(temp.attr("frameColor")!=undefined){
		var borderWidth = 2;
		temp.css('border-color',temp.attr("frameColor"));
		temp.css('border-width',borderWidth+"px");
		temp.css('border-style',"solid");
		temp.css('width',temp.parent().attr('width')-2*borderWidth);
		temp.css('height',temp.parent().attr('height')-2*borderWidth);
	}
				*/


}

function createBreakingNews(id,type) {
	console.log("--->createBreakingNews-"+id);

	var regionid = $("#"+id).parent().attr('id');


	if($('#'+regionid+"_breakingnews").length == 0)
	{
		var breakingnews_effect = $('#'+regionid).attr('effect');
		var breakingnews_duration = $('#'+regionid).attr('duration');
		var breakingnews_title = $('#'+regionid).attr('title');
		var breakingnews_color = $('#'+regionid).attr('color');
		var breakingnews_ttstyle = $('#'+regionid).attr('ttstyle');
		var breakingnewsHtml = '';
		if(isRunningOnAndroid === true){
			breakingnewsHtml = '<div class="breakingNews" id="'+regionid+'_breakingnews" ttstyle="'+breakingnews_ttstyle+'">';
		}else{
			breakingnewsHtml = '<div class="breakingNews" id="'+regionid+'_breakingnews" ttstyle="'+breakingnews_ttstyle+'" style="opacity:0.01">';
		}
		if(breakingnews_title==undefined || breakingnews_title==null || breakingnews_title=="")
		{
			breakingnewsHtml += '<div class="bn-title forceHide"><a>'+breakingnews_title+'</a><span></span></div>';
		}else
		{
			breakingnewsHtml += '<div class="bn-title "><a>'+breakingnews_title+'</a><span></span></div>';
		}

		breakingnewsHtml += '<ul>';

		if(type == "breakingnews"){
			var breakingnews_length = $('#'+regionid).find('.elm').length;
			for(var i=0;i<breakingnews_length;i++)
			{
				breakingnewsHtml += '<li><a href="#">' + $('#'+regionid).find('.elm').eq(i).html() + '</a></li>';
			}
		}

		breakingnewsHtml += '</ul>';
		breakingnewsHtml += ' <div class="bn-navi"><span></span><span></span></div>';
		breakingnewsHtml += '</div>';

		$('#'+regionid).prepend(breakingnewsHtml);
	}
	if($('#'+regionid+"_breakingnews").attr('render') != 'true')
	{
		var breakingnews_effect = $('#'+regionid).attr('effect');
		var breakingnews_duration = $('#'+regionid).attr('duration');
		var breakingnews_title = $('#'+regionid).attr('title');
		var breakingnews_color = $('#'+regionid).attr('color');
		var breakingnews_ttstyle = $('#'+regionid).attr('ttstyle');
		var breakingnews_length = $('#'+regionid).find('.elm').length;
		var breakingnews_rss = "";
		for(var i=0;i<breakingnews_length;i++)
		{
			$('#'+regionid).find('.elm').eq(i).addClass('hide');
			$('#'+regionid).find('.elm').eq(i).attr('duration','100000');
			if(type == "rss"){
				breakingnews_rss += $('#'+regionid).find('.elm').eq(i).attr('uri') + '#';
			}

		}
		if(type == "rss"){breakingnews_rss = breakingnews_rss.substring(0,breakingnews_rss.length - 1);}
		console.log("breakingnews_rss.length="+breakingnews_rss.length)
		console.log("breakingnews_rss="+breakingnews_rss)
		var temp = $('#'+regionid);
		var tempb = $('#'+regionid+'_breakingnews');
		if(temp.attr("frame")!=undefined && temp.attr("frame")!="" ){tempb.attr('frameColor',temp.attr("frame"));}
		tempb.attr('titleFontColor',breakingnews_color);

		if(temp.attr("fontFamily")!=undefined && temp.attr("fontFamily")!="" ){tempb.attr('fontFamily',temp.attr("fontFamily"));}
		//if(temp.attr("fontSize")!=undefined && temp.attr("fontSize")!="" ){tempb.attr('fontSize',temp.attr("fontSize"));}
		if(temp.attr("fontColor")!=undefined && temp.attr("fontColor")!="" ){tempb.attr('fontColor',temp.attr("fontColor"));}
		if(temp.attr("fontStyle")!=undefined && temp.attr("fontStyle")!="" ){tempb.attr('fontStyle',temp.attr("fontStyle"));}
		//if(temp.attr("fontWeight")!=undefined && temp.attr("fontWeight")!="" ){tempb.attr('fontWeight',temp.attr("fontWeight"));}
		tempb.attr('fontWeight','bold');
		if(temp.attr("textDecoration")!=undefined && temp.attr("textDecoration")!="" ){tempb.attr('textDecoration',temp.attr("textDecoration"));}
		//$('#'+regionid+'_breakingnews').find('ul').addClass('sizelab_reCssFont');
		//$('#'+regionid+'_breakingnews').find('.bn-title').addClass('sizelab_reCssFont');
		if(breakingnews_duration==undefined){breakingnews_duration=5;}
		if(type == "breakingnews"){
			setTimeout(function(){
			$("#"+regionid+"_breakingnews").breakingNews({
					effect		:breakingnews_effect,
					autoplay	:true,
					timer		:breakingnews_duration*1000,
					ttstyle     :breakingnews_ttstyle
				});
			if(isRunningOnAndroid !== true){
				$("#"+regionid+"_breakingnews").css('opacity','1');
			}
			},1000);
		}else if(type == "rss")
		{
			setTimeout(function(){
			var feedcount = $('#'+regionid).attr('feedCount');
			$("#"+regionid+"_breakingnews").breakingNews({
				effect		:breakingnews_effect,
				autoplay	:true,
				timer		:breakingnews_duration*1000,
				ttstyle     :breakingnews_ttstyle,
				feed		:breakingnews_rss,
				feedcount	:feedcount
			});
			if(isRunningOnAndroid !== true){
				$("#"+regionid+"_breakingnews").css('opacity','1');
			}
			},1000);

		}

		$('#'+regionid+"_breakingnews").attr('render','true');
	}


}

function createRss(id, randomnum) {
	var scaleFactor = Math.min(selfinnerWidthNow/parseInt($('body').attr('width')),selfinnerHeightNow/parseInt($('body').attr('height')));
	var scaleMode = ($(id).attr('fitText')=='1')?"fit":"scale";
	var bShowDesc = true;
	var bShowPubDate = true;
	var bShowcontentSnippet = true;

	if(bEnableForceRssTextFit == true)
	{
		$(id).attr('fitText','1');
	}
	if(bEnableRssTemplateReplace == true)
	{
		//console.log(decodeURIComponent($(id).attr('template')));
		//console.log(encodeURIComponent('<p>•[Title]</p>'));
		ShowPubDate = false;
		ShowcontentSnippet = false;
		$(id).attr('template',encodeURIComponent(rssTemplate));
	}
	if(bEnableSmartTickerStyle == true)
	{
		if($(id).attr('direction') == 'left' || $(id).attr('direction') == 'right')
		{
			ShowPubDate = false;
			ShowcontentSnippet = false;
			$(id).attr('template',encodeURIComponent(rssTemplate));
		}else{
			//$(id).attr('fitText','1');
		}
		{
			scaleMode = 'smart';
		}
	}
	console.info("rss update="+id);

	var render_options = {
                type:"ticker",
                sourceid:"1",
                direction:$(id).attr('direction'),
                duration:$(id).attr('duration'),
                durationIsPerItem:($(id).attr('durationIsPerItem')=='0')?false:true,
                numItems:$(id).attr('numItems'),
                takeItemsFrom:$(id).attr('takeItemsFrom'),
                itemsPerPage:$(id).attr('itemsPerPage'),
                scrollSpeed:$(id).attr('scrollSpeed'),
                scaleMode:scaleMode,
                width: ($(id).attr('fitText')=='1')?$(id).parent().attr('width')*1.2:$(id).parent().css('width').replace("px",""),
                height: $(id).parent().css('height').replace("px",""),
                originalWidth:($(id).attr('fitText')=='1')?$(id).parent().attr('width')*1.2:$(id).parent().css('width').replace("px",""),
                originalHeight:$(id).parent().css('height').replace("px",""),
                scaleFactor: 1, //for 16:9
                itemsSideBySide : false
        };
        var rss_options = {
                FeedUrl: $(id).attr('uri'),
				HostUrl: hosturl,
                updateInterval : $(id).attr('updateInterval'),
                MaxCount: 100,
				DescCharacterLimit: 2000,
				RandomNum: randomnum,
                ShowDesc: bShowDesc,
                ShowPubDate: bShowPubDate,
                ShowcontentSnippet: bShowcontentSnippet,
                Template: decodeURIComponent($(id).attr('template')),
                direction:$(id).attr('direction')
        }
        $(id).ReadFeedAndRender(rss_options,render_options);
}
function responsiveBackground(){

	var src = $('#img-bg').attr('src');

	if(src == undefined)
	{

		var bgsrc = $('#img-bg').attr('bgsrc');

		if(bgsrc == undefined)
		{
			$('#img-bg').attr('src','js/std/null.png');
			$('#img-bg').css( "width","0");
			$('#img-bg').css( "height","0");
		}else
		{

			if(0==bgsrc.indexOf("#") || 0==bgsrc.indexOf("rgb") || "transparent"==bgsrc)
			{
				$('#img-bg').attr('src','js/std/null.png');
				$('#img-bg').css( "width","0");
				$('#img-bg').css( "height","0");
				$('body').css('background-color',bgsrc);
			}else
			{
				$('#img-bg').attr('src',bgsrc);
				$('#img-bg').css( "width",selfinnerWidthNow);
				$('#img-bg').css( "height",selfinnerHeightNow);
			}

		}
	}else
	{
		$('#img-bg').css( "width",selfinnerWidthNow);
		$('#img-bg').css( "height",selfinnerHeightNow);
	}

}
function responsiveRegion(){
	//console.log("$('body').attr('width')=" + $('body').attr('width'));
	//console.log("$('body').attr('height')=" + $('body').attr('height'));



	//if(parseInt($('body').attr('width')) <parseInt( $('body').attr('height'))&& bEnablePortraitMode == true)
	if( (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true)
	{
		var org_height = parseInt($('body').attr('width'));
		var org_width = parseInt($('body').attr('height'));
	}else{
		var org_width = parseInt($('body').attr('width'));
		var org_height = parseInt($('body').attr('height'));
	}

	var VIDEO_org_width = parseInt($('body').attr('width'));
	var VIDEO_org_height = parseInt($('body').attr('height'));
	//$('body').css('height',selfinnerHeightNow);
	//$('body').css('width',selfinnerWidthNow);
	$('.cms').each(function(){$(this).css('height',selfinnerHeightNow); $(this).css('width',selfinnerWidthNow);});
	$('.cmsvideo').each(function(){$(this).css('height',VIDEO_selfinnerHeightNow); $(this).css('width',VIDEO_selfinnerWidthNow);});

	var hasZindexs = $('.hasZindexs');
	var gallerys = $('.gallery');
	for(var i = 0 ; i < gallerys.length ; i++){
		console.log("-----------------------------------------------------")
		var temp = $(gallerys[i]);
		//console.log("temp.attr('id')=" + temp.attr('id'));
		//console.log("temp.attr('width')=" + temp.attr('width'));
		//console.log("temp.attr('height')=" + temp.attr('height'));
		//console.log("temp.attr('top')=" + temp.attr('top'));
		//console.log("temp.attr('left')=" + temp.attr('left'));
		var tmp_portraitvideofix = temp.attr('portraitvideofix');
		console.log("tmp_portraitvideofix="+tmp_portraitvideofix);
		if(tmp_portraitvideofix != undefined && tmp_portraitvideofix == "true")
		{
			console.log("IN CMSVIDEO");
			var tmp_width = temp.attr('width');
			var tmp_height = temp.attr('height');
			var tmp_top = temp.attr('top');
			var tmp_left = temp.attr('left');

			if(gPortraitDegree == 270)
			{
				temp.attr('width',tmp_height);
				temp.attr('height',tmp_width);
				temp.attr('top',VIDEO_org_width-tmp_width-tmp_left);
				temp.attr('left',tmp_top);
			}else if(gPortraitDegree == 90)
			{
				temp.attr('width',tmp_height);
				temp.attr('height',tmp_width);
				temp.attr('top',tmp_left);
				temp.attr('left',VIDEO_org_height-tmp_height-tmp_top);
			}
		}else
		{
			tmp_portraitvideofix = "false";
			var tmp_width = temp.attr('width');
			var tmp_height = temp.attr('height');
			var tmp_top = temp.attr('top');
			var tmp_left = temp.attr('left');
		}

		//var w_scale = self.innerWidth / org_width;
		//var h_scale = self.innerHeight / org_height;
		//console.log("$('body').attr('width')="+$('body').attr('width'));
		//console.log("$('body').attr('height')="+$('body').attr('height'));
		//if(parseInt($('body').attr('width')) < parseInt($('body').attr('height'))&& bEnablePortraitMode == true)
		if( (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true && tmp_portraitvideofix == "false")
		{
			var h_scale = self.innerWidth / org_width;
			var w_scale = self.innerHeight / org_height;
		}else{
			var w_scale = self.innerWidth / org_width;
			var h_scale = self.innerHeight / org_height;
		}

		console.log("w_scale=" + w_scale);
		console.log("h_scale=" + h_scale);

		var fal_width = Math.ceil(temp.attr('width') * w_scale);
		var fal_left = temp.attr('left') * w_scale;
		var fal_height = Math.ceil(temp.attr('height') * h_scale);
		var fal_top = temp.attr('top') * h_scale;

		var tmp_bgimage = temp.attr('bg');
		if(tmp_bgimage == undefined)
		{
			tmp_bgimage = temp.attr('frame');
		}
		if( tmp_bgimage!=undefined && (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true && tmp_portraitvideofix == "true")
		{
			tmp_bgimage = "transparent";
		}
		var fillColor = temp.attr('fillColor');
		var tmp_frameRadius = temp.attr('frameRadius');
		if(tmp_frameRadius != undefined){tmp_frameRadius = Math.ceil(tmp_frameRadius * w_scale);tmp_innerframeRadius = tmp_frameRadius}
		var tmp_bgclass = temp.attr('bgclass');
		var tmp_rotate = temp.attr('rotate');
		var base_zindex = middleLayerZindex;

		var tmp_border = temp.attr('border');
		if(tmp_border==undefined)
		{
			tmp_border = temp.attr('frameOutWidth');
		}
		if(tmp_border!=undefined)
		{
			if(tmp_border.indexOf(',')!=-1)
			{
				tmp_border = tmp_border.replace('(','').replace(')','');
				tmp_border_array = tmp_border.split(",");
				tmp_border_top = tmp_border_array[0];
				tmp_border_right = tmp_border_array[1];
				tmp_border_bottom = tmp_border_array[2];
				tmp_border_left = tmp_border_array[3];
				if(tmp_portraitvideofix == "true" && gPortraitDegree == 270)
				{
					tmp_border_top = tmp_border_array[1];
					tmp_border_right = tmp_border_array[2];
					tmp_border_bottom = tmp_border_array[3];
					tmp_border_left = tmp_border_array[0];
				}else if(tmp_portraitvideofix == "true" && gPortraitDegree == 90)
				{
					tmp_border_top = tmp_border_array[3];
					tmp_border_right = tmp_border_array[0];
					tmp_border_bottom = tmp_border_array[1];
					tmp_border_left = tmp_border_array[2];
				}

				tmp_border_top = Math.ceil(tmp_border_top * h_scale);
				tmp_border_left = Math.ceil(tmp_border_left * w_scale);
				tmp_border_right = Math.ceil(tmp_border_right * w_scale);
				tmp_border_bottom = Math.ceil(tmp_border_bottom * h_scale);

				fal_width_Background = fal_width + tmp_border_left + tmp_border_right;
				fal_left_Background  = fal_left - tmp_border_left;
				fal_height_Background  = fal_height + tmp_border_top + tmp_border_bottom;
				fal_top_Background  = fal_top - tmp_border_top;

			}else
			{
				var fal_boder_w = Math.ceil(tmp_border * w_scale);
				var fal_boder_h = Math.ceil(tmp_border * h_scale);
				console.log("fal_boder_w="+fal_boder_w+";fal_boder_h="+fal_boder_h);
				fal_width_Background = fal_width + 2*fal_boder_w;
				fal_left_Background  = fal_left - fal_boder_w;
				fal_height_Background  = fal_height + 2*fal_boder_h;
				fal_top_Background  = fal_top - fal_boder_h;
				tmp_border_top = fal_boder_h;
				tmp_border_right = fal_boder_w;
				tmp_border_bottom = fal_boder_h;
				tmp_border_left = fal_boder_w;

			}
		}else
		{
			fal_width_Background = fal_width;
			fal_left_Background  = fal_left;
			fal_height_Background  = fal_height;
			fal_top_Background  = fal_top;
			tmp_border_top = 0;
			tmp_border_right = 0;
			tmp_border_bottom = 0;
			tmp_border_left = 0;

		}




		var tmp_bgborder = temp.attr('bgborder');
		if(tmp_bgborder==undefined)
		{
			tmp_bgborder = temp.attr('frameWidth');
		}
		if(tmp_bgborder!=undefined)
		{

			if(tmp_bgborder.indexOf(',')!=-1)
			{
				tmp_bgborder = tmp_bgborder.replace('(','').replace(')','');
				tmp_bgborder_array = tmp_bgborder.split(",");
				tmp_bgborder_top = tmp_bgborder_array[0];
				tmp_bgborder_right = tmp_bgborder_array[1];
				tmp_bgborder_bottom = tmp_bgborder_array[2];
				tmp_bgborder_left = tmp_bgborder_array[3];
				if(tmp_portraitvideofix == "true" && gPortraitDegree == 270)
				{
					tmp_bgborder_top = tmp_bgborder_array[1];
					tmp_bgborder_right = tmp_bgborder_array[2];
					tmp_bgborder_bottom = tmp_bgborder_array[3];
					tmp_bgborder_left = tmp_bgborder_array[0];
					console.log("tmp_bgborder_top="+tmp_bgborder_top);
					console.log("tmp_bgborder_right="+tmp_bgborder_right);
					console.log("tmp_bgborder_bottom="+tmp_bgborder_bottom);
					console.log("tmp_bgborder_left="+tmp_bgborder_left);
				}else if(tmp_portraitvideofix == "true" && gPortraitDegree == 90)
				{
					tmp_bgborder_top = tmp_bgborder_array[3];
					tmp_bgborder_right = tmp_bgborder_array[0];
					tmp_bgborder_bottom = tmp_bgborder_array[1];
					tmp_bgborder_left = tmp_bgborder_array[2];
					console.log("tmp_bgborder_top="+tmp_bgborder_top);
					console.log("tmp_bgborder_right="+tmp_bgborder_right);
					console.log("tmp_bgborder_bottom="+tmp_bgborder_bottom);
					console.log("tmp_bgborder_left="+tmp_bgborder_left);
				}
				tmp_bgborder_top = Math.ceil(tmp_bgborder_top * h_scale);
				tmp_bgborder_left = Math.ceil(tmp_bgborder_left * w_scale);
				tmp_bgborder_right = Math.ceil(tmp_bgborder_right * w_scale);
				tmp_bgborder_bottom = Math.ceil(tmp_bgborder_bottom * h_scale);


				fal_width = fal_width - tmp_bgborder_left - tmp_bgborder_right;
				fal_left  = fal_left + tmp_bgborder_left;
				fal_height  = fal_height - tmp_bgborder_top - tmp_bgborder_bottom;
				fal_top  = fal_top + tmp_bgborder_top;

			}else{

				var fal_bgboder_w = Math.ceil(tmp_bgborder * w_scale);
				var fal_bgboder_h = Math.ceil(tmp_bgborder * h_scale);
				console.log("fal_bgboder_w="+fal_bgboder_w+";fal_bgboder_h="+fal_bgboder_h);
				fal_width = fal_width - 2*fal_bgboder_w;
				fal_left = fal_left + fal_bgboder_w;
				fal_height = fal_height - 2*fal_bgboder_h;
				fal_top = fal_top + fal_bgboder_h;

				tmp_bgborder_top = fal_bgboder_h;
				tmp_bgborder_right = fal_bgboder_w;
				tmp_bgborder_bottom = fal_bgboder_h;
				tmp_bgborder_left = fal_bgboder_w;

			}
		}else
		{
				tmp_bgborder_top = 0;
				tmp_bgborder_right = 0;
				tmp_bgborder_bottom = 0;
				tmp_bgborder_left = 0;
		}

		if(temp.attr('emuandroid') == 'true')
		{
			base_zindex = nativeLayerZindex;
		}else
		if(temp.hasClass("topLayer"))
		{
			base_zindex = topLayerZindex;
		}else if(temp.hasClass("background"))
		{
			base_zindex = backgroundLayerZindex;
		}else
		{
			base_zindex = middleLayerZindex;
		}

		if(temp.attr('zindex')!=undefined)
		{
			zi = temp.attr('zindex');
		}else
		{
			zi = hasZindexs.length + i;
		}

		var background_region_n = "";
		console.log("temp.attr('id')="+temp.attr('id'));
		$('.cms').each(function(){ if($(this).find("#"+temp.attr('id')).length!=0){background_region_n = $(this).attr('id')} });
		console.log("background_region_n="+background_region_n);

		if(tmp_bgimage!=undefined || tmp_bgclass!=undefined)
		{
			if(tmp_bgclass==undefined)
			{
				tmp_bgclass="";
			}
			console.log("------->"+temp.attr( "type"));
			if(tmp_bgimage == undefined)
			{
				var bghtml = '<div id="bgregion_'+temp.attr('id')+'" class="region-bg '+tmp_bgclass+'" ';
				bghtml += 'style="left:'+fal_left_Background +';top:'+fal_top_Background +';width:'+fal_width_Background +';height:'+fal_height_Background +';z-index:'+(base_zindex+1+zi*10)+' "';
				bghtml += '>';
				bghtml += '</div>';
				$('#background-region-'+background_region_n).append(bghtml);
				if(tmp_frameRadius != undefined)
				{

					$('#bgregion_'+temp.attr('id')).css('border-radius',tmp_frameRadius+"px");
					//$('#'+temp.attr('id')).css('border-radius',tmp_frameRadius+"px");
				}
				if(fillColor != undefined)
				{
					$('#'+temp.attr('id')).css('background-color',fillColor);
				}

			}else
			if(0==tmp_bgimage.indexOf("#") || 0==tmp_bgimage.indexOf("rgb") || "transparent" == tmp_bgimage)
			{
				/*
				var bghtml = '<div id="bgregion_'+temp.attr('id')+'" class="region-bg '+tmp_bgclass+'" ';
				bghtml += 'style="background-color:'+tmp_bgimage+';left:'+fal_left_Background +';top:'+fal_top_Background +';width:'+fal_width_Background +';height:'+fal_height_Background +';z-index:'+(base_zindex+1+zi*10)+' "';
				bghtml += '>';
				bghtml += '</div>';
				*/
				if(temp.attr('type') != undefined && (temp.attr('type').match('image') || temp.attr('type').match('slideshow')|| temp.attr('type').match('video')  || temp.attr('type').match('onlinevideo')  || temp.attr('type').match('webpage') || temp.attr('type').match('breakingnews') || temp.attr('type').match('rss') || temp.attr('type').match('android_texteffect')))
				{
					fal_left = fal_left_Background;
					fal_top = fal_top_Background;
					$('#'+temp.attr('id')).css('border-style','solid');
					$('#'+temp.attr('id')).css('border-color',tmp_bgimage);
					if(tmp_border!=undefined)
					{
						$('#'+temp.attr('id')).css('border-top-width',tmp_border_top+'px');
						$('#'+temp.attr('id')).css('border-left-width',tmp_border_left+'px');
						$('#'+temp.attr('id')).css('border-right-width',tmp_border_right+'px');
						$('#'+temp.attr('id')).css('border-bottom-width',tmp_border_bottom+'px');
					}else if(tmp_bgborder!=undefined)
					{
						$('#'+temp.attr('id')).css('border-top-width',tmp_bgborder_top+'px');
						$('#'+temp.attr('id')).css('border-left-width',tmp_bgborder_left+'px');
						$('#'+temp.attr('id')).css('border-right-width',tmp_bgborder_right+'px');
						$('#'+temp.attr('id')).css('border-bottom-width',tmp_bgborder_bottom+'px');
					}
					if(tmp_frameRadius != undefined){
						$('#'+temp.attr('id')).css('border-radius',tmp_frameRadius+"px");
						if(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i) )
						{
							$('#'+temp.attr('id')+' img').each(function(){$(this).css('border-radius',tmp_frameRadius*0.8+"px");});
						}
					}
					if(temp.attr('type').match('video')  || temp.attr('type').match('onlinevideo'))
					{
						//if(fillColor != undefined)
						{
							$('#'+temp.attr('id')).css('background-color','transparent');
						}
					}else if(temp.attr('type').match('webpage')  || temp.attr('type').match('slideshow')  || temp.attr('type').match('breakingnews') || temp.attr('type').match('rss')  || temp.attr('type').match('android_texteffect'))
					{
						if(fillColor != undefined)
						{
							$('#'+temp.attr('id')).css('background-color',fillColor);
						}
					}
				}else
				{

					var bghtml = "";
					if(tmp_border!=undefined)
					{
						var bghtml = '<div id="bgregion_'+temp.attr('id')+'" class="region-bg '+tmp_bgclass+'" ';
						bghtml += 'style="left:'+fal_left_Background +';top:'+fal_top_Background +';width:'+fal_width +';height:'+fal_height +';z-index:'+(base_zindex+1+zi*10)+';';
						bghtml += 'border-style:solid;border-color:'+tmp_bgimage+';border-top-width:'+tmp_border_top+'px;border-left-width:'+tmp_border_left+'px;border-right-width:'+tmp_border_right+'px;border-bottom-width:'+tmp_border_bottom+'px "';
						bghtml += '>';
						bghtml += '</div>';
					}else if(tmp_bgborder!=undefined){
						var bghtml = '<div id="bgregion_'+temp.attr('id')+'" class="region-bg '+tmp_bgclass+'" ';
						bghtml += 'style="left:'+fal_left_Background +';top:'+fal_top_Background +';width:'+fal_width +';height:'+fal_height +';z-index:'+(base_zindex+1+zi*10)+';';
						bghtml += 'border-style:solid;border-color:'+tmp_bgimage+';border-top-width:'+tmp_bgborder_top+'px;border-left-width:'+tmp_bgborder_left+'px;border-right-width:'+tmp_bgborder_right+'px;border-bottom-width:'+tmp_bgborder_bottom+'px "';
						bghtml += '>';
						bghtml += '</div>';
					}

					$('#background-region-'+background_region_n).append(bghtml);
					if(tmp_frameRadius != undefined)
					{

						//$('#bgregion_'+temp.attr('id')).css('border-radius',tmp_frameRadius+"px");
						$('#bgregion_'+temp.attr('id')).css('border-radius',tmp_frameRadius+"px");
					}
					if(fillColor != undefined)
					{
						$('#bgregion_'+temp.attr('id')).css('background-color',fillColor);
					}

				}


			}else
			{
				var bghtml = '<div id="bgregion_'+temp.attr('id')+'" class="region-bg '+tmp_bgclass+'" ';
				bghtml += 'style="left:'+fal_left_Background +';top:'+fal_top_Background +';width:'+fal_width_Background +';height:'+fal_height_Background +';z-index:'+(base_zindex+1+zi*10)+' "';
				bghtml += '>';
				//bghtml += '<img src="'+tmp_bgimage+'" style="width:'+fal_width_Background +';height:'+fal_height_Background+'" />';
				bghtml += '<img src="'+tmp_bgimage+'" />';
				bghtml += '</div>';
				$('#background-region-'+background_region_n).append(bghtml);
				/*
				if(tmp_frameRadius != undefined)
				{

					$('#bgregion_'+temp.attr('id')).css('border-radius',tmp_frameRadius+"px");
					if(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i) )
					{
						$('#bgregion_'+temp.attr('id')+' img').css('border-radius',tmp_frameRadius+"px");
					}
					//$('#'+temp.attr('id')).css('border-radius',tmp_frameRadius+"px");
				}
				*/
				if(fillColor != undefined)
				{
					$('#'+temp.attr('id')).css('background-color',fillColor);
				}

			}

		}else{
			if(tmp_frameRadius != undefined)
			{

				$('#'+temp.attr('id')).css('border-radius',tmp_frameRadius+"px");
				if(temp.attr('type') != undefined && temp.attr('type').match('image'))
				{
					if(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i) )
					{
						$('#'+temp.attr('id')+' img').each(function(){$(this).css('border-radius',tmp_frameRadius+"px");});
					}
				}
			}
			if(fillColor != undefined)
			{
				$('#'+temp.attr('id')).css('background-color',fillColor);
			}
		}






			if(temp.attr('id')!=undefined && temp.attr('id').indexOf("region-video-bg-")==-1)
			{
				console.log("fal_width=" + fal_width);
				console.log("fal_left=" + fal_left);
				console.log("fal_height=" + fal_height);
				console.log("fal_top=" + fal_top);
				temp.css( "width", fal_width );
				//temp.css( "margin-left", fal_left );
				temp.css( "left", fal_left );
				temp.css( "height", fal_height );
				//temp.css( "margin-top", fal_top );
				temp.css( "top", fal_top );

				if(tmp_portraitvideofix == "true")
				{
					temp.css("z-index",base_zindex+5+zi*10);//puls 1
				}else
				if(temp.hasClass("background"))
				{
					temp.css("z-index",base_zindex+4+zi*10);
				}else
				{
					temp.css("z-index",base_zindex+4+zi*10);
				}
			}

			if(!(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i) ))
			{
				var rotateAntiAlias = "translateZ(0)";
			}else
			{
				var rotateAntiAlias = "";
			}


			if($("#region-video-bg-"+temp.attr('id')).length > 0)
			{
				if(tmp_bgimage!=undefined && (0==tmp_bgimage.indexOf("#") || 0==tmp_bgimage.indexOf("rgb") || "transparent" == tmp_bgimage))
				{
					$("#region-video-bg-"+temp.attr('id')).css( "width", fal_width );
					$("#region-video-bg-"+temp.attr('id')).css( "left", fal_left + tmp_bgborder_left + tmp_border_left);
					$("#region-video-bg-"+temp.attr('id')).css( "height", fal_height);
					$("#region-video-bg-"+temp.attr('id')).css( "top", fal_top + tmp_bgborder_top + tmp_border_top );
				}else{
					$("#region-video-bg-"+temp.attr('id')).css( "width", fal_width );
					$("#region-video-bg-"+temp.attr('id')).css( "left", fal_left );
					$("#region-video-bg-"+temp.attr('id')).css( "height", fal_height );
					$("#region-video-bg-"+temp.attr('id')).css( "top", fal_top );
				}

				$("#region-video-bg-"+temp.attr('id')).css( "z-index", parseInt(temp.css("z-index"))+1);
				if(tmp_rotate != undefined){
					var region_video_bg_rotateid = 'region-video-bg-'+temp.attr('id');
					document.getElementById(region_video_bg_rotateid).style.transform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";//translateZ(0)
					document.getElementById(region_video_bg_rotateid).style.msTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(region_video_bg_rotateid).style.webkitTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(region_video_bg_rotateid).style.MozTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(region_video_bg_rotateid).style.OTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";

				}
			}

			if(tmp_rotate != undefined)
			{

				var rotateid = temp.attr('id');
				var bgregion_rotateid = 'bgregion_'+temp.attr('id')
				if(document.getElementById(rotateid)!= null)
				{
					document.getElementById(rotateid).style.transform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(rotateid).style.msTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(rotateid).style.webkitTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(rotateid).style.MozTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(rotateid).style.OTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
				}
				if(document.getElementById(bgregion_rotateid) != null)
				{
					document.getElementById(bgregion_rotateid).style.transform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(bgregion_rotateid).style.msTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(bgregion_rotateid).style.webkitTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(bgregion_rotateid).style.MozTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
					document.getElementById(bgregion_rotateid).style.OTransform="rotate(" + tmp_rotate + "deg) "+rotateAntiAlias+" ";
				}

			}

			//background-region
	}



	//if(deg!=undefined && deg!=0 )
	if( (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true)
	{
		var deg = gPortraitDegree;
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
			//var offset_x = factor*(self.innerHeight - self.innerWidth)/2;
			var offset_x = factor*(self.innerHeight/2 - self.innerWidth/2);
			var offset_y = offset_x;
		}
		/*
		document.body.style.transform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
		document.body.style.msTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
		document.body.style.webkitTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
		document.body.style.MozTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
		document.body.style.OTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";

		$('body').addClass('rotate-mode');
		*/

		$('.cms').each(function(){
			var cmsid = $(this).attr('id');
			document.getElementById(cmsid).style.transform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
			document.getElementById(cmsid).style.msTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
			document.getElementById(cmsid).style.webkitTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
			document.getElementById(cmsid).style.MozTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
			document.getElementById(cmsid).style.OTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";

			$(this).addClass('rotate-mode');
			$(this).css('overflow','visible');
		});
		/*
		document.getElementById('cms').style.transform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
		document.getElementById('cms').style.msTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
		document.getElementById('cms').style.webkitTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
		document.getElementById('cms').style.MozTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";
		document.getElementById('cms').style.OTransform="rotate(" + deg + "deg) translate("+offset_x+"px ,"+offset_y+"px)";

		$('#cms').addClass('rotate-mode');
		*/
	}
}

var layoutjs_isload = true;
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}
