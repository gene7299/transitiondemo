
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  //return s4() + s4() + '-' + s4() + '-' + s4() + '-' +  s4() + '-' + s4() + s4() + s4();
  return "SN0" + s4() + s4() + '' + s4() + '' + s4();
}
var hw_uuid = guid().toUpperCase();
//jQuery Plugin Start.......
(function( $ ){

$.fn.interactive = function(options) {
      var settings = $.extend({
      // These are the defaults.
            json:"",
            id:"",
      }, options );
      console.log("settings=");
      console.log(settings);
      var token = "";
      var activityData = JSON.parse(settings.json);
      var actionobj = "";
      var timeoutId = 0;
      var state = 0;
      var host = activityData['host'];//"http://bot.sukupan.tk";
      var TimeHandle = [];
      var Complete = [];
      var Result = [];
      var VoteOptions = [];
      var VoteResults = [];
      var ots = [];
      var icount = [];
      var interval = [];
      var pollingfq = 500;
      ots['registerAction'] = 0;
      ots['loadActivityCode'] = 0;
      ots['getKeyApp'] = 0;
      ots['getVoteResult'] = 0;
      interval['registerAction'] = 1000; //1s
      interval['loadActivityCode'] = 1000; //1s
      interval['getKeyApp'] = 100; //1s
      interval['getVoteResult'] = 1000; //1s
      function setPollingFrequency(){
        icount['registerAction'] = Math.ceil(interval['registerAction']/pollingfq);
        icount['loadActivityCode'] = Math.ceil(interval['loadActivityCode']/pollingfq);
        icount['getKeyApp'] = Math.ceil(interval['getKeyApp']/pollingfq);
        icount['getVoteResult'] = Math.ceil(interval['getVoteResult']/pollingfq);
      }
      setPollingFrequency();
      var widget_type = activityData['widget_type'];
      if(activityData['title']==='')
      {
        activityData['title']='default';
      }
      $('div').each(function(){
        if($(this).html().indexOf('[#ACTIVITY_CODE]')>=0)
        {
          $(this).html($(this).html().replace('[#ACTIVITY_CODE]','<span id="activity_code_span"></span>'));
        }
      })
      console.log("hw_uuid=",hw_uuid);
      activityData['hw_uuid'] = hw_uuid;
      function startActivity(){
        setInterval(function(){
          if(Complete['registerAction']==undefined || Complete['registerAction']!='success' || Result['registerAction']=='fail')
          {
            if(ots['registerAction']<=0){registerAction();ots['registerAction']=icount['registerAction']}else{ots['registerAction']--;}
            return;
          }else if(Result['registerAction']=='success'){

            if(ots['loadActivityCode']<=0){loadActivityCode();ots['loadActivityCode']=icount['loadActivityCode']}else{ots['loadActivityCode']--;}
            if(Complete['loadActivityCode']==undefined || Result['loadActivityCode']=='fail' || Result['loadActivityCode']=='error'){

              return;
            }else if( Result['loadActivityCode'] == 'success'){

              if(widget_type == 'key_app'){
                  if(Result['getKeyApp'] == 'end'){
                      console.log("key_app is ended!!!") // GameOver
                  }else{
                    if(ots['getKeyApp']<=0){getKeyApp();ots['getKeyApp']=icount['getKeyApp']}else{ots['getKeyApp']--;}
                  }
              }else if(widget_type == 'vote_app'){
                  if(Result['getVoteResult'] == 'end'){
                    console.log("vote_app is ended!!!")
                  }else {
                    if(ots['getVoteResult']<=0){getVoteResult();ots['getVoteResult']=icount['getVoteResult']}else{ots['getVoteResult']--;}
                  }
              }
            }
          }
        },pollingfq);
      }
      function registerAction(){ // to get token
        if(Complete['registerAction']=='start'){
          return;
        }
        Complete['registerAction'] = 'start';
        $.ajax({
            url: host+"/json/action",
            type: "POST",
            data:JSON.stringify(activityData),
            dataType: "json",
            timeout: 5000,
            success: function(obj) {
              var status = obj['status_code'];
              console.log("status="+status);
              if(status == 0){
                  token = obj['token'];
                  console.log("[GET]token="+token);
                  Result['registerAction'] = 'success';
              }else{
                  Result['registerAction'] = 'fail';
              }
              Complete['registerAction'] = 'success';
            },
            error: function(){
              if(widget_type == 'key_app'){
                game_handle[settings.id].setActivityCodeTitle("活動修復中...");
                game_handle[settings.id].setActivityCodeNumber("");
                $('#activity_code_span').html('活動修復中...');
              }else if(widget_type == 'vote_app'){
                d3.select('#activitycodetitle_'+settings.id).text("活動修復中...");
                d3.select('#activitycodenumber_'+settings.id).text("");
              }
              console.log("ERROR registerAction!")
              Complete['registerAction'] = 'error';

            }
        });
      };
      function loadActivityCode(){ // to get activecode
        if(Complete['loadActivityCode']=='start'){
          return;
        }
        Complete['loadActivityCode'] = 'start';
        $.ajax({
            url: host+"/json/queryActivityCode?token="+token,
            type: "GET",
            dataType: "json",
            timeout: 5000,
            success: function(obj) {
              var status = obj['status_code'];
              console.log("status="+status);
              if(status == 0){
                  var activity_code = obj['activity_code'].toUpperCase();
                  console.log("[GET]activity_code="+activity_code);
                  if(widget_type == 'key_app'){
                    game_handle[settings.id].setActivityCodeTitle("活動代碼：");
                    game_handle[settings.id].setActivityCodeNumber(activity_code);
                    $('#activity_code_span').html(activity_code);
                  }else if(widget_type == 'vote_app'){
                    d3.select('#activitycodetitle_'+settings.id).text("活動代碼：");
                    d3.select('#activitycodenumber_'+settings.id).text(activity_code);
                  }
                  Result['loadActivityCode'] = 'success';
              }else if(status == 1){
                  if(widget_type == 'key_app'){
                    var achtml = "活動尚未開始"
                    $('#activity_'+settings.id).html(achtml);
                    $('#activity_code_span').html(achtml);
                  }else if(widget_type == 'vote_app'){
                    d3.select('#activitycodetitle_'+settings.id).text("活動尚未開始");
                  }
                  Result['loadActivityCode'] = 'notready';
              }else if(status == 2){
                  if(widget_type == 'key_app'){
                    var achtml = "活動已結束"
                    $('#activity_'+settings.id).html(achtml);
                    $('#activity_code_span').html(achtml);
                  }else if(widget_type == 'vote_app'){
                    d3.select('#activitycodetitle_'+settings.id).text("活動已結束");
                  }
                  Result['loadActivityCode'] = 'end';
              }else{
                  Result['loadActivityCode'] = 'fail';
              }
              Complete['loadActivityCode'] = 'success';
            },
            error: function(){
              console.log("ERROR loadActivityCode!")
              Complete['loadActivityCode'] = 'error';
            }
        });
      };
      function loadAction(){ // to get activecode
        if(Complete['loadAction']=='start'){
          return;
        }
        Complete['loadAction'] = 'start';
        $.ajax({
            url: host+"/json/action?token="+token,
            type: "GET",
            dataType: "json",
            timeout: 5000,
            success: function(obj) {
              var status = obj['status_code'];
              console.log("status="+status);

                  var title = obj['title'];
                  console.log("[GET]title="+title);
                  Result['loadAction'] = 'success';
                  Complete['loadAction'] = 'success';
            },
            error: function(){
              console.log("ERROR loadAction!")
              Complete['loadAction'] = 'error';
            }
        });
      };

      function getKeyApp(){ // to get getKeyApp
        if(Complete['getKeyApp']=='start'){

          return;
        }
        console.log('key')
        Complete['getKeyApp'] = 'start';
        $.ajax({
            url: host+"/json/keyapp?token="+token,
            type: "GET",
            dataType: "json",
            timeout: 5000,
            success: function(obj) {
              var status = obj['status_code'];
              console.log("status="+status);
              if(status == 0){
                  var keycode = obj['key_code'];
                  var keytype = activityData['key_type'];
                  for(key in keycode){
                      console.log("---------------->[GET]keycode="+keycode[key]);
                      if(keytype=='type1'){ //Roll
                        game_handle[settings.id].key(keycode[key]);
                        setKeyAppGameOver();
                      }else {
                        toSnap('' + keycode[key] + '', 'blue');
                      }
                  }
                  Result['getKeyApp'] = 'success';
              }else if(status == 1){
                  Result['getKeyApp'] = 'end';
              }else{
                  Result['getKeyApp'] = 'fail';
              }
              Complete['getKeyApp'] = 'success';
            },
            error: function(){
              console.log("ERROR getKeyApp!")
              Complete['getKeyApp'] = 'error';
            }
        });
      };

      function setKeyAppGameOver(){ // to setKeyAppGameOver
        if(Complete['setKeyAppGameOver']=='start'){

          return;
        }
        console.log('key')
        Complete['setKeyAppGameOver'] = 'start';
        var sendobj = {};
        sendobj['token'] = token;
        $.ajax({
            url: host+"/json/gameover",
            type: "POST",
            data: JSON.stringify(sendobj),
            dataType: "json",
            timeout: 5000,
            success: function(obj) {
              var status = obj['status_code'];
              console.log("status="+status);
              if(status == 0){
                  Result['setKeyAppGameOver'] = 'success';
              }else if(status == 1){
                  Result['setKeyAppGameOver'] = 'end';
              }else{
                  Result['setKeyAppGameOver'] = 'fail';
              }
              Complete['setKeyAppGameOver'] = 'success';
            },
            error: function(){
              console.log("ERROR getKeyApp!")
              Complete['setKeyAppGameOver'] = 'error';
            }
        });
      };

      function objectFindByKey(array, key, value) {
          for (var i = 0; i < array.length; i++) {
              if (array[i][key] === value) {
                  return array[i];
              }
          }
          return null;
      }
      function getVoteResult(){ // to get getVoteResult
        if(Complete['getVoteResult']=='start'){
          return;
        }
        Complete['getVoteResult'] = 'start';
        $.ajax({
            url: host+"/json/voteapp?token="+token,
            type: "GET",
            dataType: "json",
            timeout: 5000,
            success: function(obj) {
              var status = obj['status_code'];
              console.log("status="+status);
              if(status == 0 || status === undefined){
                //  try{
                    var isChanged = false;
                    var vote_options = obj['vote_options'];
                    for(vote in vote_options){
                        var voteret = vote_options[vote];
                        console.log("[GET]vote: "+voteret['item'] + "=" +voteret['count']);
                        if(VoteResults[voteret['item']] == undefined){
                          VoteOptions.push(voteret['item']);
                          VoteResults[voteret['item']] = 0;
                          isChanged = true;
                        }
                        //var oldCount = VoteResults[voteret['item']];
                        var dataObj = bar_handle[settings.id].data();
                        var obj = objectFindByKey(dataObj,'item',voteret['item']);
                        if(parseInt(obj.count) != parseInt(voteret['count'])){
                            VoteResults[voteret['item']] = voteret['count'];
                            if(parseInt(obj.count)>=0){
                              obj.count = parseInt(voteret['count']);
                              bar_handle[settings.id].data(dataObj);
                            }
                            isChanged = true;
                        }

                    }
                    console.log("VoteOptions=");
                    console.log(VoteOptions)
                    if(isChanged === true) { bar_handle[settings.id]._transition();}
                //  }catch(e)
                //  {
                //    console.log("VoteOptions Error!");
                //  }
                  Result['getVoteResult'] = 'success';
              }else if(status == 1){
                  Result['getVoteResult'] = 'end';
              }else{
                  Result['getVoteResult'] = 'fail';
              }
              Complete['getVoteResult'] = 'success';
            },
            error: function(){
              console.log("ERROR getVoteResult!")
              Complete['getVoteResult'] = 'error';
            }
        });
      };


       return this.each(function() {
              startActivity();
       });
  };

})(jQuery);

var bar_handle = [];

(function( $ ){

$.fn.barChart = function(options) {
      var handle = {};
      var settings = $.extend({
      // These are the defaults.
            items:[],//[{item:"item", count:1}],
            id:"",
            width:0,
            height:0,
            fontFamily:'verdana',
      }, options );

      var data = [];
      for(i in settings.items){
        data.push({item:settings.items[i],count:0.1})
      }
      handle.settings = settings;
      var token = "";
      var gradientData = [
        {
          "offset": "0%",
          "color": "rgb(215, 235, 97)"
        }, {
          "offset": "100%",
          "color": "rgb(80, 180, 115)"
        }
      ];
      //var data = settings.data;
      var wrapper = d3.select('#'+settings.id)
                .append('svg')
                .attr({
                  'class':'wrapper',
                  'width':'100%',
                  'height':'100%',
                }).style({
                //  'background-image':'url(\'svg-background.jpg\')'
                });
      handle.wrapper = wrapper;

      var calaulateMax = function(){
        var d3max = d3.max(data,function(d){  return(d.count); })
        if(d3max <= 0)
        {
          max = 10;
        }else{
          max = (Math.floor(d3max/10)+1)*10-1;
        }
        return max;
      };


      var build = function(true_width,true_height){

          var preset = {
                        marginTop:5,
                        marginRight:1,
                        marginBottom:8,
                        marginLeft:1,
                        titleFont:7,
                        statusFont:7,
                        titleLeft:6,
                        statusLeft:6,
                        titleTop:10,
                        barFont:7,
                        itemFont:5,
                        marginItemBottom:2,
                        spaceCount:2
                       }
          var margin = { top : true_height*preset.marginTop/100 ,  right : true_width*preset.marginRight/100,
                         bottom :  true_height*preset.marginBottom/100 , left : true_width*preset.marginLeft/100}
          var width =  true_width;
          var height = true_height;

          //r margin = {top: 55, right: 5, bottom: 36, left: 5},
          //  width = true_width,
          //  height = true_height;

          var svg = d3.select('#'+settings.id+' .wrapper')
                    .append('svg')
                    .attr({
                      'width':'100%',
                      'height':'100%',
                      'viewBox':'0 0 '+width+' '+height+' ',
                      'preserveAspectRatio':'xMinYMin meet'
                    });

          svg.append("linearGradient").attr({
                "id": "themeGradient",
                "gradientUnits": "userSpaceOnUse",
                "x1": 0,
                "x2": 0,
                "y1": height,
                "y2": 0
              }).selectAll("stop").data(gradientData).enter().append("stop").attr({
                "offset": function(it){
                  return it.offset;
                },
                "stop-color": function(it){
                  return it.color;
                }
              });


          var title = d3.select('#'+settings.id+' .wrapper').append('text').text(options.title).attr({
            'fill':'#FFF',
            'font-size':true_height*preset.titleFont/100,
            'font-family':settings.fontFamily,
          //  'text-anchor':'middle',
            'x':true_width*preset.titleLeft/100,
            'y': true_height*preset.titleTop/100,
           });
          var activitycode = d3.select('#'+settings.id+' .wrapper').append('text').attr({
            'id':'activity_'+settings.id,
            'font-size':true_height*preset.statusFont/100,
            'font-family':settings.fontFamily,
          //  'text-anchor':'middle',
            'x':true_width*preset.titleLeft/100,
            'y':true_height*(preset.titleTop+preset.statusFont*1.3)/100
           });
           d3.select('#activity_'+settings.id).append('tspan').attr({
             'id':'activitycodetitle_'+settings.id,
             'fill':'#FFF',
            });
           d3.select('#activity_'+settings.id).append('tspan').attr({
              'id':'activitycodenumber_'+settings.id,
              'fill':'rgb(235, 235, 97)',
             });

          var scaleCount = d3.scale.linear()
            //.domain([0,d3.max( data.map(function(d){return(d.count);}) )])
            .domain([0,calaulateMax()*3/2])
            .range([0, height - margin.top - margin.bottom]);

          var scaleItem = d3.scale.ordinal()
            //.domain(d3.range(data.length))
            .domain(data.map(function(d){return(d.item);}))
            .rangeRoundBands([0 , width], 0.2);


          svg.selectAll('rect')
              .data(data)
              .enter()
              .append('rect')
              .attr({
              'fill':'url(#themeGradient)',
              'width':scaleItem.rangeBand(),
              'height':0,
              'x':function(d, i) { console.log("d="+d.item+";i="+i+";scaleItem(i)="+scaleItem(d.item));return scaleItem(d.item); },
              'y':height - margin.bottom
              })
              .transition()
              .duration(1500)
              .attr({
              'height':function(d){
                return scaleCount(d.count);
              },
              'y':function(d){
                return height - margin.bottom - scaleCount(d.count);
              }
              });

        svg.selectAll('text1')
           .data(data)
           .enter()
           .append('text')
           .text(function(d){
            return d.count;
           })
           .attr({
            'class' : 'count',
            //'id':function(d){return 'count-'+ data.indexOf(d.item);},
            'fill':'#FFF',
            'font-size':true_height*preset.barFont/100,
            'font-family':settings.fontFamily,
            'text-anchor':'middle',
            'x':function(d, i) {return scaleItem(d.item)+scaleItem.rangeBand()/2; },
            'y':height - margin.bottom - (true_height*preset.spaceCount/100)
           })
           .transition()
           .duration(1500)
           .attr({
            'y':function(d){
              return height - margin.bottom - scaleCount(d.count) - (true_height*preset.spaceCount/100);
            }
           }).tween('number',function(d){
              var i = d3.interpolateRound(0, d.count);
                return function(t) {
                this.textContent = i(t);
              };
           });

        svg.selectAll('text2')
           .data(data)
           .enter()
           .append('text')
           .text(function(d){
            return d.item;
           })
           .attr({
            'fill':'#FFF',
            'font-size':true_height*preset.itemFont/100,
            'font-family':settings.fontFamily,
            'text-anchor':'middle',
            'x':function(d, i) {return scaleItem(d.item)+scaleItem.rangeBand()/2; },
            'y':height-(true_height*preset.marginItemBottom/100)
           })
           //.each(getSize)
            //.style("font-size", function(d) { return d.scale + "px"; });

          function getSize(d) {
            var bbox = this.getBBox(),
                cbbox = this.parentNode.getBBox(),
                scale = Math.min(cbbox.width/bbox.width*4*(data.length), cbbox.height/bbox.height*4*(data.length));
            d.scale = scale;
          }

          build._transition = function(){

            var scaleCount = d3.scale.linear()
              //.domain([0,d3.max( data.map(function(d){return(d.count);}) )])
              .domain([0,calaulateMax()*3/2 ])
              .range([0, height - margin.top - margin.bottom]);

            svg.selectAll('rect')
             .data(data)
             .transition()
             .duration(1500)
             .attr({
               'height':function(d){
                 var ret = scaleCount(d.count);
                // if(ret>0){
                console.log("ret = "+ret)
                   return scaleCount(d.count);
                // }else {
                //   return 0;
              //   }

               },
               'y':function(d){
                 return height - margin.bottom - scaleCount(d.count);
               }
             });


            svg.selectAll('.count')
             .data(data)
             .transition()
             .duration(1500)
             .attr({
              'y':function(d){
                return height - margin.bottom - scaleCount(d.count) - (true_height*preset.spaceCount/100);
              }
             }).tween('number',function(d){
                var i = d3.interpolateRound(parseInt(this.textContent), d.count);
                  return function(t) {
                  this.textContent = i(t);
                };
             });

          }
        //  handle._transition = _transition;
      }

      handle.data = data;

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


var game_handle = [];

(function( $ ){

$.fn.gameInfo = function(options) {
      var settings = $.extend({
            id:"",
            width:0,
            height:0,
            fontFamily:'verdana',
      }, options );
      console.log("settings=");
      console.log(settings);
      var handle = {};
      handle.settings = settings;

      var build = function(){
        var width = 400;
        var height = 400;

        var svg = d3.select('#'+settings.id)
                  .append('svg')
                  .attr({
                    'class':'wrapper',
                    'width':'100%',
                    'height':'100%',
                    'viewBox':'0 0 '+width+' '+height+' ',
                    'preserveAspectRatio':'xMidYMid '
                  })

        var title = d3.select('#'+settings.id+ ' .wrapper').append('text').text(options.title).attr({
          'fill':'#FFF',
          'font-size':'60',
          'font-family':settings.fontFamily,
          'text-anchor':'middle',
          'x':'50%',
          'y':'40%',
        })
        var activity = d3.select('#'+settings.id+ ' .wrapper').append('text').attr({
          'class':'gameInfoactivity',
          'font-size':'60',
          'font-family':settings.fontFamily,
          'text-anchor':'middle',
          'x':'50%',
          'y':'60%',
        })
        var activitycodetitle = d3.select('#'+settings.id+ ' .wrapper .gameInfoactivity').append('tspan').attr({
          'fill':'#FFF',
          'id':'gameInfoactivitycodetitle'+settings.id
        });
        var activitycodenumber = d3.select('#'+settings.id+ ' .wrapper .gameInfoactivity').append('tspan').attr({
          'fill':'rgb(235, 235, 97)',
          'id':'gameInfoactivitycodenumber'+settings.id
        });
      }
      build.setActivityCodeTitle = function(d){
        d3.select('#gameInfoactivitycodetitle'+settings.id).text(d);
      }
      build.setActivityCodeNumber = function(d){
        d3.select('#gameInfoactivitycodenumber'+settings.id).text(d);
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
