var AndroidNavtiveItems = [];
var An_selfinnerWidthNow = 0;
var An_selfinnerHeightNow = 0;
var An_OriWidth = 0;
var An_OriHeight = 0;
var An_StartTime = 0;
var An_Timeout = null;
var An_NativeVideoNum = 0;
var An_NativeReportNum = 0;
var An_bDidNativeRender = false;
function doAndroidNativeRender(starttime){
	An_StartTime = starttime;
	setTimeout(function(){initAndroidLayout();},50);
}
function initAndroidLayout()
{
		function getURLParameter(url, name) {
			return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
		}
		var mediaBaseUri = "";
		url = $(location).attr('href');
		parenturi = getURLParameter(url, 'parenturi');
		if (!parenturi){

		}else
		{
			parenturi = ((parenturi.indexOf('?')>-1)?(parenturi.substring(0,parenturi.indexOf('?'))):(parenturi));
			url = ((url.indexOf('?')>-1)?(url.substring(0,url.indexOf('?'))):(url));
			parenturi = ((parenturi.lastIndexOf('/')>-1)?(parenturi.substring(0,parenturi.lastIndexOf('/'))):(parenturi));
			url = ((url.lastIndexOf('/')>-1)?(url.substring(0,url.lastIndexOf('/'))):(url));
			console.log("parenturi="+parenturi);
			console.log("url="+url);
			mediaBaseUri = url.replace(parenturi,"")+"/";
			mediaBaseUri = mediaBaseUri.substring(1,mediaBaseUri.length);
			console.log("mediaBaseUri="+mediaBaseUri);
		}
		
		if( (gPortraitDegree == 90 || gPortraitDegree == 270) &&  bEnablePortraitMode == true)
		{
			if( typeof( self.innerHeight ) == 'number' )
			{
				An_selfinnerWidthNow = self.innerHeight;
				An_selfinnerHeightNow = self.innerWidth;
			}else{
				self.innerHeight = An_selfinnerWidthNow = document.body.offsetHeight;
				self.innerWidth = An_selfinnerHeightNow = document.body.offsetWidth;
			}
		}else
		{
			if( typeof( self.innerHeight ) == 'number' )
			{
				An_selfinnerWidthNow = self.innerWidth;
				An_selfinnerHeightNow = self.innerHeight;
			}else
			{
				self.innerWidth  = An_selfinnerWidthNow = document.body.offsetWidth;
				self.innerHeight = An_selfinnerHeightNow = document.body.offsetHeight;
				
			}
		}
		An_OriWidth = $('body').attr('width');
		An_OriHeight = $('body').attr('height'); 

		var gal = $('.gallery');
		for(var i = 0 ; i < gal.length ; i++){
			var region = $(gal[i]);
			var regionId = region.attr('id');
			var onandroid = region.attr("onandroid");
			if(onandroid == "true")
			{
				var temp = $(region.find('.elm').first());
				var type = temp.attr("type");				
				console.log("("+i+")type="+type);

				var nativeObj = new Object();
				var obj = new Object();
				nativeObj.id = region.attr("id");
				nativeObj.zindex = region.attr("zindex");
				nativeObj.type =  type;
				nativeObj.obj = obj;

				if(type == "android_marquee")
				{				
					obj.text = temp.html();
					obj.textSize = parseInt(parseInt(temp.attr('fontSize'))*An_selfinnerWidthNow/An_OriWidth);
					obj.textColor = temp.attr('fontColor');
					obj.speed = parseInt(temp.attr('speed'));
					obj.direction = temp.attr('direction'); //left, right, up, down
					if(obj.direction == 'left' || obj.direction == 'right')
					{
						obj.text = obj.text.replace(/(\r\n|\n|\r)/gm,"  ");
					}
					obj.bgcolor = region.attr('fillcolor');

				}else if(type == "android_texteffect")
				{
					var textList = [];
					var elms = $(region.find('.elm'));
					for(j=0; j<elms.length; j++)
					{
						var elm = $(elms[j]);
						textList[j] = elm.html();
					}
					obj.textList = textList;
					obj.textSize = parseInt(parseInt(temp.attr('fontSize'))*An_selfinnerWidthNow/An_OriWidth);
					obj.textColor = temp.attr('fontColor');
					obj.bgcolor = region.attr('fillcolor');
					var effect = temp.attr('effect');//https://github.com/daimajia/AndroidViewAnimations
					effect = effect.replace(/\b(\w)(\w*)/g, function($0,$1,$2){return $1.toUpperCase() + $2;});
					obj.effect = effect; 
					obj.interval = parseInt(temp.attr('interval'));
					//obj.duration = 2000; //2 sec

				}else if(type == "android_video")
				{
					var videoList = [];
					var elms = $(region.find('.elm'));
					An_NativeVideoNum = elms.length;
					for(j=0; j<elms.length; j++)
					{
						var elm = $(elms[j]);
						videoList[j] = mediaBaseUri + elm.attr('uri');
					}
					obj.videoList = videoList;
					
				}else if(type == "android_image")
				{
					obj.src = mediaBaseUri + temp.attr('src');

					
				}else if(type == "android_webpage")
				{
					obj.src = temp.attr('uri');

				}else if(type == "android_onlinevideo")
				{
					var videoList = [];
					var elms = $(region.find('.elm'));
					for(j=0; j<elms.length; j++)
					{
						var elm = $(elms[j]);
						videoList[j] = elm.attr('uri');
					}
					console.log(videoList);
					obj.src = do3rdPartyOnlineVideo(videoList,true);

				}
				obj.width = parseFloat(region.css('width'));
				obj.height = parseFloat(region.css('height'));
				obj.xoffset = parseFloat(region.css('left'));
				obj.yoffset = parseFloat(region.css('top'));

				console.log(nativeObj);
				AndroidNavtiveItems.push(nativeObj);
				temp.addClass('forceHide');
				region.addClass('forceHide');
				if($('#bgregion_'+nativeObj.id).length!=0){
					$('#bgregion_'+nativeObj.id).addClass('forceHide');
				}
			}

		}
		if(starttime == 0){setTimeout(function(){doAndroidNativeFunction();},500);}else{
			console.log("An_StartTime="+An_StartTime)
			//An_Timeout = setTimeout(function(){doAndroidNativeFunction();},An_StartTime*1000);
			var android_cb = document.getElementById('Android');
			android_cb.addEventListener('lauchNow', function(event) {
				clearTimeout(An_Timeout);
				console.log("launchNow is received! in initAndroidLayout");
				setTimeout(function(){doAndroidNativeFunction();},500);
			});		
		}

}
function doAndroidNativeFunction()
{
	if(An_bDidNativeRender == true){console.log("An_bDidNativeRender is true!");return;}
	An_bDidNativeRender = true;
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ doAndroidNativeFunction doAndroidNativeFunction doAndroidNativeFunction ~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	console.log("~~prepare "+AndroidNavtiveItems.length+" native objects!");
	if(typeof Android != "undefined")
	{
		if(typeof Android.NativeRemoveAllAndroidViews != "undefined"){
			console.log('call NativeRemoveAllAndroidViews');
			Android.NativeRemoveAllAndroidViews();
		}
	}
	AndroidNavtiveItems.sort(function(a,b){return a.zindex-b.zindex});
	
	console.log(AndroidNavtiveItems);
	if(AndroidNavtiveItems.length>0)
	{
		for(var i=0;i<AndroidNavtiveItems.length;i++)
		{
			var nativeObj = AndroidNavtiveItems[i];
			var id = nativeObj.id;
			var zindex = nativeObj.zindex;
			var type = nativeObj.type;
			var json = JSON.stringify(nativeObj.obj); // replace newLine with \n
			console.log(type+":"+json)
			if(typeof Android != "undefined")
			{
				if(type == "android_marquee")
				{
					if(typeof Android.NativeMarquee != "undefined"){
						Android.NativeMarquee(json);
					}
				}else if(type == "android_texteffect")
				{
					if(typeof Android.NativeTextEffect != "undefined"){
						Android.NativeTextEffect(json);
					}
				}else if(type == "android_video")
				{	
					if(typeof Android.NativeVideo != "undefined"){
						Android.NativeVideo(json);
					}
				}else if(type == "android_image")
				{
					if(typeof Android.NativeImage != "undefined"){
						Android.NativeImage(json);
					}
				}else if(type == "android_webpage")
				{
					if(typeof Android.NativeWebpage != "undefined"){
						Android.NativeWebpage(json);
					}
				}else if(type == "android_onlinevideo")
				{
					if(typeof Android.NativeWebpage != "undefined"){
						Android.NativeWebpage(json);
					}
				}
			}
		}
	}	
}	
function reportVideoEnd() // by native
{
	An_NativeReportNum ++;
	showMessageOnParent("reportVideoEnd("+An_NativeReportNum+"/"+An_NativeVideoNum+")!!");
	if(An_NativeReportNum % An_NativeVideoNum == 0){
		var nativeLoopNum = An_NativeReportNum/An_NativeVideoNum;
		if(nativeLoopNum >= videototalloopnum){
			sendMessageToParent("videoplayend");
		}
	}
}