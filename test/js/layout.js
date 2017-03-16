var subGallery = new Array();
var subGalleryIndex = new Array();
var duration = new Array();
var durationIndex = new Array();

$(document).ready(function () {
	// init 
	responsiveBackground();
	responsiveRegion();
	// createText, createRSS
	var elms = $('.elm');
	for(var i = 0 ; i < elms.length ; i++){
		var temp = $(elms[i]);
		var type = temp.attr("type")
		if ( type == "text"){
			var direction = temp.attr("direction")
			if ( direction != "none" ) {
				var id = temp.attr("id");
				console.log("text===="+temp.attr("duration"));
				var duration = temp.attr("duration");
				createText('#'+id);
				$('#'+id).attr('duration',duration);
				$('#'+id).attr('class','elm');
			}
		} else if ( type == "ticker"){
			var id = temp.attr("id");
			createRss('#'+id);
		}
	}
	// Setup timer
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
});
		
/* for all object slideshow*/
function changePicture(id){	
	// An array of object elements
	var $gallery;
	// Which object is being shown
	var imageId = subGalleryIndex[subGallery.indexOf(id)];
	// Slide time settings
	var slideTime = 10000;
	// Slide transitionSpeed
	var transitionSpeed = 800;	 
	// Get all subGallery of the gallery
	$gallery = $('#' + id).children();	
	if ($gallery.length == 0) {
		return;
	}
	// do fade-out
	$gallery.eq(imageId).stop(true,true).animate({opacity:0}, transitionSpeed);
	// get imageId
	if (imageId == 0 && $gallery.eq($gallery.length - 1).css('opacity') == 0 && $gallery.eq(imageId).css('opacity') == 0){
		// do nothing
	}else {
		if ($gallery.eq(imageId).attr('type') == 'video'){
			var myVideo=document.getElementById("video_" + $gallery.eq(imageId).attr('id')); 
			 //if(!myVideo.ended)
			 //{
			 	 myVideo.pause();	
			 //}
		}
		imageId++;
	}
	if (imageId >= $gallery.length) {
			imageId = 0;
	}
	// slideTime string
	slideTime = $gallery.eq(imageId).attr("duration") + "s";
	// duration cache durationIndex
	if (durationIndex.indexOf($gallery.eq(imageId).attr('id')) == -1){
		duration.push(slideTime);
		durationIndex.push($gallery.eq(imageId).attr('id'));
	} else {
		slideTime = duration[durationIndex.indexOf($gallery.eq(imageId).attr('id'))];
	}
	// update subGallery's last index number
	subGalleryIndex[subGallery.indexOf(id)] = imageId;
	// do fade-in 
	$gallery.eq(imageId).stop(true,false).animate({opacity:1}, transitionSpeed);
	//console.log("id: " + id + " S " + imageId  + " / " + $gallery.length);
	if ($gallery.eq(imageId).attr('type') == 'video'){
		var uri = $gallery.eq(imageId).attr('uri');
		var poster = 'poster.png';
		if ($("#video_" + $gallery.eq(imageId).attr('id')).length == 0 ){
			var videohtml = "";
			videohtml += '<video id="video_';
			videohtml += $gallery.eq(imageId).attr('id') + '"';
			videohtml += ' class="html5-video"';
			videohtml += ' autoplay poster="' + poster + '" >';
			if (uri.search('.mp4') > -1) {
				videohtml += '<source src="' + uri + '" type="video/mp4" />';			
			} else if (uri.search('.ogv') > -1) {
				videohtml += '<source src="' + uri + '" type="video/ogg" />';
			} else if (uri.search('.webm') > -1) {
				videohtml += '<source src="' + uri + '" type="video/webm" />';
			}
			videohtml += '您的瀏覽器不支援HTML 5影片播放標籤格式。';
			videohtml += 'Your browser does not support the video tag.';
			videohtml += '</video>';
			$gallery.eq(imageId).html(videohtml);
		} else {
			var myVideo=document.getElementById("video_" + $gallery.eq(imageId).attr('id'));
			myVideo.currentTime = 0; 
			myVideo.load();	
			myVideo.play();	
			//myVideo.currentTime = 0; 
					
		}
	} else if ($gallery.eq(imageId).attr('type') == 'text'){
		
	}		
	// timer
	$('body').oneTime(slideTime, id, function(){
		changePicture(id);
	});
}	
function createText(id) {     
	//var scaleFactor = 1;
	var scaleFactor = (self.innerHeight)/($('body').attr('height')-100);//Math.min(self.innerWidth/$('body').attr('width'),self.innerHeight/$('body').attr('height'));
	if($(id).attr('fitText')=='0'){
		//scaleFactor = 1;
	}
	//alert($(id).parent().attr('id') + "-" + $(id).parent().css('width').replace("px","") + "-" + $(id).parent().css('height').replace("px",""));
	$(id).xiboRender_text({            
          type: 'text',           
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
          scaleFactor: scaleFactor,   
    });   
} 
function createRss(id) {
	var scaleFactor = Math.min(self.innerWidth/$('body').attr('width'),self.innerHeight/$('body').attr('height'));
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
                scaleMode:($(id).attr('fitText')=='1')?"fit":"scale",
                width: ($(id).attr('fitText')=='1')?$(id).parent().attr('width')*1.2:$(id).parent().css('width').replace("px",""),       
                height: $(id).parent().css('height').replace("px",""),                       
                originalWidth:($(id).attr('fitText')=='1')?$(id).parent().attr('width')*1.2:$(id).parent().css('width').replace("px",""),
                originalHeight:$(id).parent().css('height').replace("px",""),
                scaleFactor: 1, //for 16:9  
                itemsSideBySide : false,
        };  
        var rss_options = {
                FeedUrl: $(id).attr('uri'),
                updateInterval : $(id).attr('updateInterval'),
                MaxCount: 10,
                ShowDesc: true,
                Template: decodeURIComponent($(id).attr('template')),
        }
        $(id).ReadFeedAndRender(rss_options,render_options);
}
function responsiveBackground(){
	$('#img-bg').css( "width", self.innerWidth );
	$('#img-bg').css( "height", self.innerHeight );
}
function responsiveRegion(){
	console.log("$('body').attr('width')=" + $('body').attr('width'));
	console.log("$('body').attr('height')=" + $('body').attr('height'));
	var org_width = $('body').attr('width'); 
	var org_height = $('body').attr('height');
			
	var gallerys = $('.gallery');
	for(var i = 0 ; i < gallerys.length ; i++){
		var temp = $(gallerys[i]);
		console.log("temp.attr('id')=" + temp.attr('id'));
		console.log("temp.attr('width')=" + temp.attr('width'));
		console.log("temp.attr('height')=" + temp.attr('height'));
		console.log("temp.attr('top')=" + temp.attr('top'));
		console.log("temp.attr('left')=" + temp.attr('left'));
		var tmp_width = temp.attr('width'); 
		var tmp_height = temp.attr('height');
		var tmp_top = temp.attr('top'); 
		var tmp_left = temp.attr('left');
		var w_scale = self.innerWidth / org_width;
		var h_scale = self.innerHeight / org_height;
		console.log("w_scale=" + w_scale);
		console.log("h_scale=" + h_scale);
		var fal_width = temp.attr('width') * w_scale; 
		var fal_left = temp.attr('left') * w_scale;
		var fal_height = temp.attr('height') * h_scale;
		var fal_top = temp.attr('top') * h_scale; 
		temp.css( "width", fal_width );
		temp.css( "margin-left", fal_left );
		temp.css( "height", fal_height );
		temp.css( "margin-top", fal_top );
	}
}
	