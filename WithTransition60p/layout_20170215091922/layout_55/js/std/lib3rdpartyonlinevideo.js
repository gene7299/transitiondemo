function do3rdPartyOnlineVideo(playlist){


	var videoserviceprovider = "";

	//Fisrt video decide the all video server provider.
	firsturi = playlist[0];
	if(firsturi.match(/youtube.com/i) || firsturi.match(/youtu.be/i) )
	{
		videoserviceprovider = "YouTube";
	}else if(firsturi.match(/vimeo.com/i))
	{
		videoserviceprovider = "Vimeo";
	}else if(firsturi.match(/qq.com/i))
	{
		//videoserviceprovider = "QQVideo";
	}else if(firsturi.match(/youku.com/i))
	{
		//videoserviceprovider = "Youku";
	}

	if(videoserviceprovider == "YouTube")
	{
		//https://developers.google.com/youtube/iframe_api_reference
		//<iframe width="100%" height="100%" src="https://www.youtube.com/embed/wnJuytCu1MU?controls=1&amp;showinfo=0&amp;autoplay=1&amp;loop=1&amp;disablekb=1&amp;rel=0&amp;playlist=sXWZSpr9XFo" frameborder="0" style=""></iframe>
		var videoid = new Array();
		for(x=0;x<playlist.length;x++){
			path = playlist[x];

			if(-1 != path.indexOf("youtube.com"))
			{
				var tmpS = path.indexOf("v=")+2;
				if(tmpS!=-1)
				{
					var tmpE = path.lastIndexOf("&");
					if(tmpE == -1)
					{
						tmpE = path.length;
					}else{
						tmpE = path.indexOf("&",tmpS);
					}
				}
				var vid = path.substring(tmpS,tmpE);
				console.log("vid="+vid);
				videoid.push(vid);

			}else if(-1 != path.indexOf("youtu.be"))
			{

				var tmpS = path.lastIndexOf("/") + 1;
				var tmpE =path.indexOf("?")
				if(tmpE == -1)
				{
					tmpE = path.length;
				}
				var vid = path.substring(tmpS,tmpE);
				console.log("vid = "+vid);
				videoid.push(vid);
			}
			console.log(videoid)
		}
		var plist = "";
		if(videoid.length == 1)
		{
			plist += videoid[0];
		}else if(videoid.length > 1)
		{
			var v=1;
			for(v=1;v<videoid.length;v++)
			{
				plist += videoid[v];
			}
		}
		var youtubehtml = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + videoid[0] +  '?controls=1&amp;showinfo=0&amp;autoplay=1&amp;loop=1&amp;disablekb=1&amp;rel=0&amp;playlist='+plist+'" frameborder="0" class="onlinevideo"></iframe>';
		return youtubehtml;
	}else if(videoserviceprovider == "Vimeo"){
		var path = firsturi;
		var vimeo_video_id = "";
		if(-1 != path.indexOf("vimeo.com/")) // vimeo.com/channels/staffpicks/
		{
			var tmpS = path.lastIndexOf("/") + 1;
			var vimeo_video_id = path.substring(tmpS,path.length);
			console.log("vimeo_video_id = "+vimeo_video_id);
		}
		vimeo_url = "http://player.vimeo.com/video/"+vimeo_video_id+"?title=0&color=ff9933&autoplay=1&loop=1&byline=0&portrait=0";
		if(vimeo_video_id == "")
		{
			vimeo_url = path;
		}
		var videohtml = '<iframe width="100%" height="100%" src="'+vimeo_url+'" frameborder="0" class="onlinevideo"></iframe>';
		return videohtml;
	}else if(videoserviceprovider == "QQVideo"){
		var path = firsturi;
		var qq_vid_id = "";

		if(-1 != path.indexOf("?vid=")) //http://v.qq.com/cover/a/a8vco3o0mbfzyoe.html?vid=z014149ogwo
		{
			var tmpS = path.lastIndexOf("?vid=")+5;
			var qq_vid_id = path.substring(tmpS,path.length);
			console.log("qq_vid_id = "+qq_vid_id);

		}else if(-1 != path.indexOf("cover/") || -1 != path.indexOf("prev/"))  //http://v.qq.com/cover/u/uxoc2p2622u1f44/p0142heydvz.html
		{
			var tmpE = path.lastIndexOf(".html");
			var tmpS2 = path.lastIndexOf("/",tmpE-1);
			var tmpS1 = path.lastIndexOf("/",tmpS2-1);
			var tmpS0 = path.lastIndexOf("/",tmpS1-1);
			if(tmpS1-tmpS0 < 3)
			{
				var qq_vid_id = path.substring(tmpS2+1,tmpE);
			}
		}
		if(qq_vid_id == "")
		{
			qq_video_url = path;
		}else
		{
			qq_video_url = "http://v.qq.com/iframe/player.html?vid="+qq_vid_id+"&tiny=1&auto=1";
		}
		var videohtml = '<iframe width="100%" height="100%" src="'+qq_video_url+'" frameborder="0" class="onlinevideo"></iframe>';
		return videohtml;
	}else if(videoserviceprovider == "Youku"){
		var path = firsturi;
		var youku_video_id = "";
		if(-1 != path.indexOf("id_"))
		{
			console.log("youku case 1");
			var tmpE = path.lastIndexOf(".html");
			var tmpS = path.lastIndexOf("id_",tmpE-1) + 3;
			var youku_video_id = path.substring(tmpS,tmpE);
			console.log("youku_video_id = "+youku_video_id);
		}
		youku_url = "http://player.youku.com/embed/"+ youku_video_id ;
		var videohtml = '<iframe width="100%" height="100%" src="'+youku_url+'" frameborder="0" class="onlinevideo"></iframe>';
		return videohtml;
	}
}
var lib3rdpartyvideo_is_load = true
