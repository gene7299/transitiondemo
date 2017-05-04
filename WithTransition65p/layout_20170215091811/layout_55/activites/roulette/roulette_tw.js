var roulette_handle = [];

(function( $ ){

$.fn.roulette = function(options) {
      var r_width = 720;
      var r_height = r_width;
      var r_font = r_height*0.038;
      var turnplate = $.extend({
            id:"",
            width:0,
            height:0,
            fontFamily:'verdana',
            restaraunts:[],				//大转盘奖品名称
            colors:[],					//大转盘奖品区块对应背景颜色
            outsideRadius:r_width/2.195,			//大转盘外圆的半径
            textRadius:r_width/2.7272,				//大转盘奖品位置距离圆心的距离
            insideRadius:r_width/6.2068,			//大转盘内圆的半径
            startAngle:0,				//开始角度
            bRotate:false				//false:停止;ture:旋转
      }, options );
      console.log("turnplate=");
      console.log(turnplate);
      var handle = {};
      handle.turnplate = turnplate;

      var build = function(){

        var turnplatecss = '<style> \
                            .banner{display:none;margin-left:auto;margin-right:auto;margin-bottom: 0px;}\
                            .banner .turnplate{display:block;width:100%;position:relative;}\
                            .banner .turnplate canvas.item{width:100%;}\
                            .banner .turnplate img.pointer{position:absolute;width:31.5%;height:42.5%;left:34.6%;top:23%;}\
                            </style>';
//background:#e62d2d;
        var turnplatehtml = '<div id="roulette" style="overflow:hidden;width:100%;height:100%">\
                      <img src="activites/roulette/images/4.png" id="shan-img" style="display:none;" />\
                      <img src="activites/roulette/images/3.png" id="sorry-img" style="display:none;" />\
                    	<div id="turnplate_wrapper" class="banner">\
                    		<div class="turnplate" style="background-image:url(activites/roulette/images/turnplate-bg2.gif);background-size:100% 100%;">\
                    			<canvas class="item" id="wheelcanvas" width="'+r_width+'px" height="'+r_height+'px"></canvas>\
                    			<img class="pointer" src="activites/roulette/images/turnplate-pointer3.png"/>\
                    		</div>\
                    	</div>\
                    </div>';

        $('#'+turnplate.id).html(turnplatecss+turnplatehtml);

        var initCount = 0;
        var initInterval = setInterval(function(){
          if(initCount<20)
          {
            var len = Math.min(parseFloat($('#'+turnplate.id).css('width')),parseFloat($('#'+turnplate.id).css('height')));
            $('#turnplate_wrapper').css('width',len+'px');
            $('#turnplate_wrapper').css('height',len+'px');
            $('#turnplate_wrapper').css('display','block');
            drawRouletteWheel();
            console.log("init drawRouletteWheel!!!!!1")
            initCount++;
          }else
          {
            clearInterval(initInterval);
          }
        },500);

        turnplate.restaraunts = ["超值試用組", "100禮券", "智慧型手機一只", "500禮券", "免費入會費", "大福袋", "200禮券", "銘謝惠顧", "奶茶一年份", "300禮券"];
      	turnplate.colors = ["#FFF4D6", "#FFFFFF", "#FFF4D6", "#FFFFFF","#FFF4D6", "#FFFFFF", "#FFF4D6", "#FFFFFF","#FFF4D6", "#FFFFFF"];


      	var rotateTimeOut = function (){
      		$('#wheelcanvas').rotate({
      			angle:0,
      			animateTo:2160,
      			duration:8000,
      			callback:function (){
      			//	console.log('网络超时，请检查您的网络设置！');
      			}
      		});
      	};

      	//旋转转盘 item:奖品位置; txt：提示语;
      	var rotateFn = function (item, txt){
      		var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
      		if(angles<270){
      			angles = 270 - angles;
      		}else{
      			angles = 360 - angles + 270;
      		}
      		$('#wheelcanvas').stopRotate();
      		$('#wheelcanvas').rotate({
      			angle:0,
      			animateTo:angles+1800,
      			duration:8000,
      			callback:function (){
      			  console.log(txt);
      				turnplate.bRotate = !turnplate.bRotate;
      			}
      		});
      	};

      	$('.pointer').click(function (){
      		if(turnplate.bRotate)return;
      		turnplate.bRotate = !turnplate.bRotate;
      		//获取随机数(奖品个数范围内)
      		var item = rnd(1,turnplate.restaraunts.length);

          console.log("item="+item)
      		//奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
      		rotateFn(item, turnplate.restaraunts[item-1]);
      		console.log(item);
      	});
        function rnd(n, m){
        	var random = Math.floor(Math.random()*(m-n+1)+n);
        	return random;
        }
        function drawRouletteWheel() {
          var canvas = document.getElementById("wheelcanvas");
          if (canvas.getContext) {
        	  //根据奖品个数计算圆周角度
        	  var arc = Math.PI / (turnplate.restaraunts.length/2);
        	  var ctx = canvas.getContext("2d");
        	  //在给定矩形内清空一个矩形
        	  ctx.clearRect(0,0,r_width,r_height);
        	  //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        	  ctx.strokeStyle = "#FFBE04";
        	  //font 属性设置或返回画布上文本内容的当前字体属性
        	  ctx.font = r_font+'px Microsoft YaHei';
        	  for(var i = 0; i < turnplate.restaraunts.length; i++) {
        		  var angle = turnplate.startAngle + i * arc;
        		  ctx.fillStyle = turnplate.colors[i];
        		  ctx.beginPath();
        		  //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
        		  ctx.arc(r_width/2, r_height/2, turnplate.outsideRadius, angle, angle + arc, false);
        		  ctx.arc(r_width/2, r_height/2, turnplate.insideRadius, angle + arc, angle, true);
        		  ctx.stroke();
        		  ctx.fill();
        		  //锁画布(为了保存之前的画布状态)
        		  ctx.save();

        		  //----绘制奖品开始----
        		  ctx.fillStyle = "#E5302F";
        		  var text = turnplate.restaraunts[i];
        		  var line_height = r_font*1.3;
        		  //translate方法重新映射画布上的 (0,0) 位置
        		  ctx.translate(r_width/2 + Math.cos(angle + arc / 2) * turnplate.textRadius, r_height/2 + Math.sin(angle + arc / 2) * turnplate.textRadius);

        		  //rotate方法旋转当前的绘图
        		  ctx.rotate(angle + arc / 2 + Math.PI / 2);

        		  /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
        		  if(text.indexOf("M")>0){//流量包
        			  var texts = text.split("M");
        			  for(var j = 0; j<texts.length; j++){
        				  ctx.font = j == 0?'bold '+r_font*1.25+'px Microsoft YaHei':r_font+'px Microsoft YaHei';
        				  if(j == 0){
        					  ctx.fillText(texts[j]+"M", -ctx.measureText(texts[j]+"M").width / 2, j * line_height);
        				  }else{
        					  ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
        				  }
        			  }
        		  }else if(text.indexOf("M") == -1 && text.length>6){//奖品名称长度超过一定范围
        			  text = text.substring(0,6)+"||"+text.substring(6);
        			  var texts = text.split("||");
        			  for(var j = 0; j<texts.length; j++){
        				  ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
        			  }
        		  }else{
        			  //在画布上绘制填色的文本。文本的默认颜色是黑色
        			  //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
        			  ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        		  }

        		  //添加对应图标
        		  if(text.indexOf("禮券")>0){
        			  var img= document.getElementById("shan-img");
        			  img.onload=function(){
        				  ctx.drawImage(img,-20,r_font);
        			  };
        			  ctx.drawImage(img,-20,r_font);
        		  }else if(text.indexOf("谢谢参与")>=0 || text.indexOf("銘謝惠顧")>=0 ){
        			  var img= document.getElementById("sorry-img");
        			  img.onload=function(){
        				  ctx.drawImage(img,-20,r_font);
        			  };
        			  ctx.drawImage(img,-20,r_font);
        		  }
        		  //把当前画布返回（调整）到上一个save()状态之前
        		  ctx.restore();
        		  //----绘制奖品结束----
        	  }
          }
        }


      }

      build.setActivityCodeTitle = function(d){
        console.log(d)
        //d3.select('#gameInfoactivitycodetitle'+settings.id).text(d);
      }
      build.setActivityCodeNumber = function(d){
        console.log(d)
        //d3.select('#gameInfoactivitycodenumber'+settings.id).text(d);
      }
      build.key = function(d){
        console.log(d)
        $('.pointer').trigger('click');
      }
      for (i$ in handle) {
        (fn$.call(this, i$));
      }
      return build;
      function fn$(it){
        build[it] = function(v){
          if (arguments.length === 0) {
            return handle[it];
          } else {
            handle[it] = v;
            return build;
          }
        };
      }
  };

})(jQuery);
