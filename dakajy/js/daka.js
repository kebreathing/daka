/*
* JS for jydaka
*/
var dakaObj = new DakaObj();
var dakaCalendar = new DakaCalendar();
$.ajax({
  url : weblink.getUserSigned + "?userId=" + dakaObj.getUserId(),
  type: "GET",
  async: false,
  contentType: "application/json; charset=utf-8",
  error: function(XMLHttpRequest,textStatus,errorThrown){
    console.log("A. 异常")
  },
  success: function(result){
    // console.log("[GetUserSigned]: result is got.");
    console.log("A. 获得用户的总签到数")
    dakaObj.setSumDate(result);
    // 获取用户签到详情
    $.ajax({
      url : weblink.getDetailed+"?userId="+dakaObj.getUserId()+"&year="+dakaObj.year()
                 +"&month="+dakaObj.month()+"&date="+dakaObj.date(),
      type: "GET",
      async: false,
      contentType: "application/json; charset=utf-8",
      error: function(XMLHttpRequest, textStatus, errorThrown){
        console.log("B. 异常")
      },
      success: function(msg){
        console.log("B. 获得今日训练内容。");
        if(msg.length != 0){
          dakaObj.setContent(msg.practise);
          dakaObj.setSigned(true);
        }

        // 获取总用户签到数量
        $.ajax({
          url : weblink.getDetailedFriends+"?year="+dakaObj.year()+"&month="+dakaObj.month()+"&date="+dakaObj.date(),
          type: "GET",
          contentType: "application/json; charset=utf-8",
          error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log("H. 异常")
          },
          success: function(msg){
            console.log("H. 获得打卡好友数量")
            dakaObj.setFriends(msg);
            $("#spanSum").text(msg);
          }
        })

        // 获取用户日历
        $.ajax({
          url : weblink.getCalendar+"?userId="+dakaObj.getUserId()+"&year="+dakaObj.year()+"&month="+dakaObj.month(),
          type: "GET",
          contentType: "application/json; charset=utf-8",
          error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log("C. 异常")
          },
          success: function(msg2){
            console.log("C. 获得训练日历")
            if(msg2.length != 0){
              TBCalendar.setPrintedCalendars(msg2.calendar,msg2.trainCalendar,"banner" + msg2.month);
              if(dakaObj.getSigned()){
                // 亮绿色
                $("#card-banner"+dakaObj.month()+"-"+dakaObj.date()).children(".front").children().css("background-color","#93f9b9");
                $("#card-banner"+dakaObj.month()+"-"+dakaObj.date()).children(".front").children().css("border-color","#93f9b9");
              }
            }
          }
        });
      }
    });
  }
});

// webconnect.getDetailed({userId: dakaObj.getUserId(), year : dakaObj.year(), month: dakaObj.month(), date: dakaObj.date()});
// webconnect.getCalendar({userId: dakaObj.getUserId(), year : dakaObj.year(), month: dakaObj.month()});

// 训练内容
transformContent = function(obj){
  if( "胸" == obj)  return "tdBreast"
  if( "臂" == obj)  return "tdArm"
  if( "腿" == obj)  return "tdLeg"
  if( "背" == obj)  return "tdBack"
  if( "肩" == obj)  return "tdShoulder"
  if( "···" == obj) return "tdEtc"
}


initPageCalendar = function(){
  for(var i=1;i<=12;i++){
      TBCalendar.setCalendars(dakaObj.year(),i,"banner" + i);
  }
}

initSmoothCalendar = function(){
  if(dakaCalendar.month == 1){
    $("#imgLeft").attr("src","./../img/daka2/arrow-left%20ed.png");
  }
  if(dakaCalendar.month == 12){
    $("#imgRight").attr("src","./../img/daka2/arrow-right%20ed.png");
  }
}

// 设置画布终点
setCanvasRange = function() {
  var sum = dakaObj.getSumDate();
  var unit = sum % 10 / 10; sum = Math.floor(sum/10);
  var decade = sum % 10 / 10; sum = Math.floor(sum/10);
  var hundreds = sum % 10 / 10; sum = Math.floor(sum/10);
  defaultStyle.range = { inner : hundreds, normal : decade, outter : unit };
}

clickSingleContent = function(partialId,content){
  console.log(content )
  console.log(dakaObj.getContent())
  var id = "#" + partialId;
  if(dakaObj.isContentEmpty() == true){
    $(id).children().css("color", "#000000");
    $(id).children().css("border-color", "#93f9b9");
    $(id).children().css("background-color", "#93f9b9");
    dakaObj.setContent(content);
  }
  else if (dakaObj.getContent() == content) {
    $(id).children().css("color", "#1d976c");
    $(id).children().css("border-color", "#1d976c");
    $(id).children().css("background-color", "inherit");
    dakaObj.setContent("");
  }
  else {
    console.log(partialId)
    $("#" + transformContent(dakaObj.getContent())).children().css("color","#1d976c");
    $("#" + transformContent(dakaObj.getContent())).children().css("border-color", "#1d976c");
    $("#" + transformContent(dakaObj.getContent())).children().css("background-color","inherit");

    $(id).children().css("color", "#000000");
    $(id).children().css("border-color", "#93f9b9");
    $(id).children().css("background-color", "#93f9b9");
    dakaObj.setContent(content);
  }
};

/*
* 点击按钮之后，训练内容颜色变化
*/
setContentChangable = function(bool){
  if(bool){
    $(".contents").each(function(){
      var id = this.id;
      $("#"+id).bind("click",function(){
        clickSingleContent(id,$("#" + id).text());
      })
    });
  } else {
    // 按钮不可按
    $(".tdgroup table label").css("color","#9b9b9b");
    $(".tdgroup table label").css("border-color","#9b9b9b");
    $("#btnDaka").css("border-color","#9b9b9b");
    $("#btnDaka").css("color","#9b9b9b");
    $(".contents").each(function(){
      $("#"+this.id).unbind("click");
    });
  }
}

// Init: 训练计划打卡按钮
initContentClick = function(){
  // 训练内容点击
  if(dakaObj.getSigned() == true){
    // 不可选
    setContentChangable(false);
    $("#btnDaka").html("今日已打卡");
    $("#" + transformContent(dakaObj.getContent())).children().css("color","#000000");
    $("#" + transformContent(dakaObj.getContent())).children().css("background-color","#9b9b9b");
    // $("#banner"+dakaObj.month()+"-"+dakaObj.date()).
    return;
  } else {
    // 可选
    setContentChangable(true);
    // 训练按钮点击
    $("#btnDaka").bind("click",function(){
        if(dakaObj.isContentEmpty() == true){ console.log("D. 还没勾选训练内容"); return; }

        $.ajax({
          url : weblink.postDetailedSave,
          type: "POST",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            userId:dakaObj.getUserId(),
            practise: dakaObj.getContent(),
            month: dakaObj.month(),
            year: dakaObj.year(),
            date: dakaObj.date(),
            signTime:new Date(),
            signAddress: ""
          }),
          error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log("E. 异常")
          },
          success: function(msg){
            console.log("E. 保存用户打卡信息")
            dakaObj.setSigned(true);
            setContentChangable(false);
            $("#daka-nums").html(dakaObj.addSum());
            $("#btnDaka").text("今日已打卡");
            $("#" + transformContent(dakaObj.getContent())).children().css("color","#000000");
            $("#" + transformContent(dakaObj.getContent())).children().css("background-color","#9b9b9b");
            // 初始化：画布过程
            setCanvasRange();
            canvaser.outter.modifyCircle(defaultStyle.range.outter,0.0005)
            if(defaultStyle.range.outter == 0 && (dakaObj.getSumDate() > 10))
              setTimeout(function(){ canvaser.normal.modifyCircle(defaultStyle.range.normal,0.0005); },1000)
            if(defaultStyle.range.normal == 0 && (dakaObj.getSumDate() > 100))
              setTimeout(function(){ canvaser.inner.modifyCircle(defaultStyle.range.inner,0.0005);  },2000);

            // 打卡好友数量
            $.ajax({
              url : weblink.getDetailedFriends+"?year="+dakaObj.year()+"&month="+dakaObj.month()+"&date="+dakaObj.date(),
              type: "GET",
              contentType: "application/json; charset=utf-8",
              error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("H. 异常")
              },
              success: function(msg){
                console.log("H. 获得打卡好友数量")
                dakaObj.setFriends(msg);
                $("#spanSum").text(msg);
              }
            })

            // 修改总日历
            $.ajax({
              url : weblink.postCalBetter,
              type: "POST",
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify({userId: dakaObj.getUserId(),year: dakaObj.year(), month: dakaObj.month(),date: dakaObj.date(), content: dakaObj.getContent()}),
              error: function(XMLHttpRequest,textStatus,errorThrown){
                console.log("F. 异常")
              },
              success: function(msg){
                console.log("F. 保存用户日历信息")
                if(msg.length != 0){
                  TBCalendar.setPrintedCalendars(msg.calendar,msg.trainCalendar,"banner" + msg.month);
                  if(dakaObj.getSigned()){
                    $("#card-banner"+dakaObj.month()+"-"+dakaObj.date()).children(".front").children().css("background-color","#93f9b9");
                    $("#card-banner"+dakaObj.month()+"-"+dakaObj.date()).children(".front").children().css("border-color","#93f9b9");
                  }
                }
              }
            });

            // 修改总值
            $.ajax({
              url : weblink.postSumIncre,
              type: "POST",
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify({userId: dakaObj.getUserId(),nowDate : dakaObj.strDate()}),
              error: function(XMLHttpRequest,textStatus,errorThrown){
                console.log("G. 异常")
              },
              success: function(msg){
                console.log("G. 保存用户总值")
              }
            })
          }
        });
    })
  }
};

// Init: 滑动
initSlideCal = function(){
  var unslider = $(".banner").unslider({
    arrows : false,
    index: dakaObj.month() - 1,
    nav: false,
  });

  $('.unslider-arrow').click(function() {
      var fn = this.className.split(' ')[1];
      if(fn == "prev"){
        if(dakaCalendar.month > dakaCalendar.getLeftMin()){
          dakaCalendar.month -= 1;
          dakaCalendar.banner -= 1;
          unslider.data('unslider').prev();
          $("#clabel").html(dakaCalendar.getTitle());
          webconnect.getCalendar({userId:dakaObj.getUserId(), year: dakaObj.year(), month: dakaObj.month()});
          if(dakaCalendar.month == 1)
            $("#imgLeft").attr("src","./../img/daka2/arrow-left%20ed.png");
          else
            $("#imgRight").attr("src","./../img/daka2/arrow-right.png");
        }
      } else {
        if(dakaCalendar.month < dakaCalendar.getRightMax()){
          dakaCalendar.month += 1;
          dakaCalendar.banner += 1;
          unslider.data('unslider').next();
          $("#clabel").html(dakaCalendar.getTitle());
          webconnect.getCalendar({userId:dakaObj.getUserId(), year: dakaObj.year(), month: dakaObj.month()});
          if(dakaCalendar.month == 12)
            $("#imgRight").attr("src","./../img/daka2/arrow-right%20ed.png");
          else
            $("#imgLeft").attr("src","./../img/daka2/arrow-left.png");
        }
      }
  });
}

// 画布初始化
initCanvas = function(){
  setCanvasRange();
  var height = $(".agraph").height();
  var width = $(".agraph").width();

  // 累计打卡：环形图中间的label计算
  // 1. 设置div大小和画布一样，为了让控件居中
  // 2. 计算"累计打卡"距离div顶部的距离
  // 3. 计算公式为： 中心点height/2  - 最小半径 + 线的宽度 * 3
  var margin_top = height/2 - defaultStyle.radius.inner + defaultStyle.lineWidth * 3;
  $(".page-labels").css("height",height);
  $(".page-labels").css("width",width);
  $("#labelSum").css("margin-top", margin_top);
  document.getElementById("circle1").width = width;
  document.getElementById("circle1").height = height;
  document.getElementById("circle2").width = width;
  document.getElementById("circle2").height = height;
  document.getElementById("circle3").width = width;
  document.getElementById("circle3").height = height;

  canvaser.inner = new CanvasObj();
  canvaser.normal = new CanvasObj();
  canvaser.outter = new CanvasObj();

  canvaser.inner.setting({
    imgSize : {height: height + 50,width: width},
    midpoint: {x: width / 2,y: height / 2},
    canvasId : "circle1",
    strokeStyle: defaultStyle.strokeStyle,
    globalAlpha: defaultStyle.alpha.inner,
    radius : defaultStyle.radius.inner,
    speed: defaultStyle.speed.inner,
    end : defaultStyle.range.inner
  })

  canvaser.normal.setting({
    imgSize : {height: height,width: width + 50},
    midpoint: {x: width / 2,y: height / 2},
    canvasId : "circle2",
    strokeStyle: defaultStyle.strokeStyle,
    globalAlpha: defaultStyle.alpha.normal,
    radius : defaultStyle.radius.normal,
    speed: defaultStyle.speed.normal,
    end : defaultStyle.range.normal
  })

  canvaser.outter.setting({
    imgSize : {height: height,width: width + 50},
    midpoint: {x: width / 2,y: height / 2},
    canvasId : "circle3",
    strokeStyle: defaultStyle.strokeStyle,
    globalAlpha: defaultStyle.alpha.outter,
    radius : defaultStyle.radius.outter,
    speed: defaultStyle.speed.outter,
    end : defaultStyle.range.outter
  });

  canvaser.inner.createCircle();
  canvaser.normal.createCircle();
  canvaser.outter.createCircle();

  // 标签递增
  var timer = 0;
  var t = 0;
  var now = dakaObj.getSumDate();
  function runDakaNums(time){
    timer = setInterval(function(){
      if(t > now){
        clearInterval(timer);
      } else {
        $("#daka-nums").html(t);
        t += 1;
      }
    },0.01)
  }
  runDakaNums(now);
  timer = null;
};

$(document).ready(function(){
  $("#clabel").html(dakaCalendar.getTitle());
  initCanvas();           // 初始：画布
  initContentClick();     // 设置训练内容点击
  initPageCalendar();          // 设置日历
  initSmoothCalendar();        // 设置日历滑动
  initSlideCal();          // 设置日历翻页
  // TBCalendar.setPrintedCalendars("1-3-5-12-24","胸-腿-胸-胸-胸","banner1");
})
