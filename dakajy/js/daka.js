/*
* JS for jydaka
*/
var dakaObj = new DakaObj();
var dakaCalendar = new DakaCalendar();
webconnect.getUserSigned(dakaObj.getUserId());
webconnect.getDetailed({userId: dakaObj.getUserId(), year : dakaObj.year(), month: dakaObj.month(), date: dakaObj.date()});
webconnect.getCalendar({userId: dakaObj.getUserId(), year : dakaObj.year(), month: dakaObj.month()});
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
    $("#" + dakaObj.getContent()).children().css("color","#1d976c");
    $("#" + dakaObj.getContent()).children().css("border-color", "#1d976c");
    $("#" + dakaObj.getContent()).children().css("background-color","inherit");

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
      // 颜色变灰
      $("#"+this.id).unbind("click");
    });
  }
}

// Init: 训练计划打卡按钮
initContentClick = function(){
  // 训练内容点击
  if(dakaObj.getSigned() == true){
    $("#btnDaka").html("今日已打卡");
    setContentChangable(false);
    $("#" + dakaObj.getContent()).children().css("color","#000000");
    $("#" + dakaObj.getContent()).children().css("background-color","#9b9b9b");
    return;
  } else {
    setContentChangable(true);
  }
  // 训练按钮点击
  $("#btnDaka").bind("click",function(){
    if(dakaObj.getSigned() == false){
      if(dakaObj.isContentEmpty() == true){
        console.log("[Content] 还没勾选训练内容");
        return;
      }

      // Web to end:
      // 1. 存打卡信息
      // 2. 存总记录信息
      // 3. 存日历信息
      webconnect.webClickBtnDaka({
        userId:dakaObj.getUserId(),
        practise: dakaObj.getContent(),
        month: dakaObj.month(),
        year: dakaObj.year(),
        date: dakaObj.date(),
        signTime:new Date(),
        signAddress: "",
      });

      dakaObj.setSigned(true);
      // 训练内容：设置不可变
      setContentChangable(false);
      // 训练内容：变灰
      $("#" + dakaObj.getContent()).children().css("color","#000000");
      $("#" + dakaObj.getContent()).children().css("background-color","#9b9b9b");
      $("#btnDaka").text("今日已打卡");
      $("#daka-nums").html(dakaObj.addSum());
      console.log(dakaObj)
      // 初始化：画布过程
      setCanvasRange();
      canvaser.outter.modifyCircle(defaultStyle.range.outter,0.0005)
      if(defaultStyle.range.outter == 0 && (dakaObj.getSumDate() > 10))
        setTimeout(function(){ canvaser.normal.modifyCircle(defaultStyle.range.normal,0.0005); },1000)
      if(defaultStyle.range.normal == 0 && (dakaObj.getSumDate() > 100))
        setTimeout(function(){ canvaser.inner.modifyCircle(defaultStyle.range.inner,0.0005);  },2000);
    }
  })
};

// Init: 滑动
initFlipCalendar = function(){
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
  console.log("[Daka.js] getSumDate():" + dakaObj.getSumDate())
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
  initFlipCalendar();          // 设置日历翻页
  // TBCalendar.setPrintedCalendars("1-3-5-12-24","胸-腿-胸-胸-胸","banner1");
})
