/*
* JS for jydaka
*/

// 设置画布终点
setCanvasRange = function() {
  var sum = dakaObj.sumDate;
  var unit = sum % 10 / 10; sum = Math.floor(sum/10);
  var decade = sum % 10 / 10; sum = Math.floor(sum/10);
  var hundreds = sum % 10 / 10; sum = Math.floor(sum/10);
  defaultStyle.range = { inner : hundreds, normal : decade, outter : unit };
}

clickSingleContent = function(partial){
  var id = "#" + partial;
  if(dakaObj.content.length == 0){
    $(id).children().css("color", "#000000");
    $(id).children().css("border-color", "#93f9b9");
    $(id).children().css("background-color", "#93f9b9");
    dakaObj.setContent(partial);
  }
  else if (dakaObj.content == partial) {
    $(id).children().css("color", "#1d976c");
    $(id).children().css("border-color", "#1d976c");
    $(id).children().css("background-color", "inherit");
    dakaObj.setContent("");
  }
  else {
    $("#" + dakaObj.content).children().css("color","#1d976c");
    $("#" + dakaObj.content).children().css("border-color", "#1d976c");
    $("#" + dakaObj.content).children().css("background-color","inherit");

    $(id).children().css("color", "#000000");
    $(id).children().css("border-color", "#93f9b9");
    $(id).children().css("background-color", "#93f9b9");
    dakaObj.setContent(partial);
  }
};

/*
* 训练内容颜色变化
*/
setContentChangable = function(bool){
  if(bool){
    $(".contents").each(function(){
      var id = this.id;
      $("#"+id).bind("click",function(){
        clickSingleContent(id);
      })
    });
  } else {
    $(".contents").each(function(){
      $("#"+this.id).unbind("click");
    });
  }
}

// Init: 训练计划打卡按钮
initContentClick = function(){
  // 训练内容点击
  if(dakaObj.signed == true){
    $("#btnDaka").html("明日再来吧！");
    return;
  } else {
    setContentChangable(true);
  }
  // 训练按钮点击
  $("#btnDaka").bind("click",function(){
    if(dakaObj.signed == false){
      if(dakaObj.isContentEmpty() == true){
        console.log("[Content] 还没勾选训练内容");
        return;
      }

      dakaObj.signed = !dakaObj.signed;
      $("#btnDaka").html("打卡成功！");
      $("#daka-nums").html(dakaObj.addSum());
      setContentChangable(false);
      setCanvasRange();
      canvaser.outter.modifyCircle(defaultStyle.range.outter,0.0005)
      if(defaultStyle.range.outter == 0 && (dakaObj.sumDate > 10))
        setTimeout(function(){ canvaser.normal.modifyCircle(defaultStyle.range.normal,0.0005); },1000)
      if(defaultStyle.range.normal == 0 && (dakaObj.sumDate > 100))
        setTimeout(function(){ canvaser.inner.modifyCircle(defaultStyle.range.inner,0.0005);  },2000);
    }
  })
};

// Init: 滑动
initFlipClick = function(){
  var unslider = $(".banner").unslider({
    arrows : false,
    index: dakaObj.month - 1,
    nav: false,
  });

  $('.unslider-arrow').click(function() {
      var fn = this.className.split(' ')[1];
      if(fn == "prev"){
        if(dakaCalendar.month > dakaCalendar.leftmin){

          dakaCalendar.month -= 1;
          dakaCalendar.banner -= 1;
          unslider.data('unslider').prev();
          $("#clabel").html(dakaCalendar.getTitle());
          TBCalendar.setCalendars(dakaCalendar.year,dakaCalendar.month,"banner" + dakaCalendar.banner);
        }
      } else {
        if(dakaCalendar.month < dakaCalendar.rightmax){
          dakaCalendar.month += 1;
          dakaCalendar.banner += 1;
          unslider.data('unslider').next();
          $("#clabel").html(dakaCalendar.getTitle());
          TBCalendar.setCalendars(dakaCalendar.year,dakaCalendar.month,"banner" + dakaCalendar.banner);
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
  var now = dakaObj.sumDate;
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
  initContentClick();
  initFlipClick();

  initCanvas();

  // 测试用
  TBCalendar.setCalendars(2017,1,"banner1");
  TBCalendar.setPrintedCalendars("1-3-5-12-24","胸-腿-胸-胸-胸","banner1");
})
