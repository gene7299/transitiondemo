function do3rdPartyOnlineVideo(playlist){

	
	var videoserviceprovider = "";

	//Fisrt video decide the all video server provider.
	firsturi = playlist[0];
	if(firsturi.match(/youtube.com/i) || firsturi.match(/youtu.be/i) )
	{
		videoserviceprovider = "YouTube";
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
	}


}
var lib3rdpartyvideo_is_load = true