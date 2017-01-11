/*
* JS for jydaka
*/

var defaultStyle = {
  radius: { inner: 80, normal: 93, outter: 106},
  alpha: { inner: 0.6, normal: 0.4, outter: 0.2},
  speed: { inner: 0.001, normal: 0.001, outter: 0.001},
  lineWidth: 10,
}


var dakaCalendar = {
  year: 2017,
  month: 1,
  banner: 1,
  rightmax: 12,
  leftmin: 1,
  getTitle: function(){
    return this.year + " 年 " + this.month + " 月"
  }
}

var dakaObj = {
  openId : 0,
  content: '',
  signed: false,
  getDate : function(){
    return new Date();
  },
  getStrDate : function(){
    var d = this.getDate();
    return ((d.getYear() + 1900) + "-" + (d.getMonth() + 1) + "-" + d.getDate())
  },
  setContent : function(ctt){
    this.content = ctt;
  },
  setOpenId: function(id){
    this.openId = id;
  },
  isContentEmpty: function(){
    return this.content.length == 0;
  }
}

clickSingleContent = function(partial){
  var id = "#" + partial;
  // console.log("["+ partial + "] 点击");
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

// Init: 化训练内容
initContentClick = function(){
  // 训练内容点击
  if(dakaObj.signed == false){
    setContentChangable(true);
  }

  // 训练按钮点击
  $("#btnDaka").bind("click",function(){
    if(dakaObj.signed == false){
      dakaObj.signed = !dakaObj.signed;
      setContentChangable(false);
      // console.log("[BtnDaka] 成功签到");
    } else {
      // console.log("[BtnDaka] 已经签到");
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
        if(dakaCalendar.month == dakaCalendar.leftmin){
          dakaCalendar.month = 12;
          console.log("[LeftMin] Reached.")
        } else {
          dakaCalendar.month -= 1;
        }
        // 移动模块
        if(dakaCalendar.banner != dakaCalendar.leftmin){
          dakaCalendar.banner -= 1;
        }
        unslider.data('unslider').prev();
      } else {
        if(dakaCalendar.month == dakaCalendar.rightmax){
          dakaCalendar.month = 1;
          console.log("[RighMax] Reached.")
        } else {
          dakaCalendar.month += 1;
        }
        // 移动模块
        if(dakaCalendar.banner != dakaCalendar.rightmax){
          dakaCalendar.banner += 1;
        }
        unslider.data('unslider').next();
      }

      // console.log(dakaCalendar.month + "-" + dakaCalendar.banner)
      $("#clabel").html(dakaCalendar.getTitle());
      TBCalendar.setCalendars(dakaCalendar.year,dakaCalendar.month,"banner" + dakaCalendar.banner);
  });
}

initCanvas = function(){
  var height = $(".agraph").height();
  var width = $(".agraph").width();
  $(".page-labels").css("height",height);
  $(".page-labels").css("width",width);

  $("#labelSum").css("margin-top","100px");
  document.getElementById("circle1").width = width;
  document.getElementById("circle1").height = height;
  document.getElementById("circle2").width = width;
  document.getElementById("circle2").height = height;
  document.getElementById("circle3").width = width;
  document.getElementById("circle3").height = height;

  var canvas1 = new CanvasObj();
  canvas1.setting({
    imgSize : {height: height ,width: width},
    midpoint: {x: width / 2,y: height / 2},
    strokeStyle: "#93f9b9",
    canvasId : "circle1",
    globalAlpha: defaultStyle.alpha.inner,
    radius : defaultStyle.radius.inner,
    speed: defaultStyle.speed.inner,
    start : 0,
    end : 0.4,
  })

  var canvas2 = new CanvasObj();
  canvas2.setting({
    imgSize : {height: 500 ,width: 500},
    midpoint: {x: width / 2,y: height / 2},
    strokeStyle: "#93f9b9",
    canvasId : "circle2",
    globalAlpha: defaultStyle.alpha.normal,
    radius : defaultStyle.radius.normal,
    speed: defaultStyle.speed.normal,
    start : 0,
    end : 0.6,
  })

  var canvas3 = new CanvasObj();
  canvas3.setting({
    imgSize : {height: 500 ,width: 500},
    midpoint: {x: width / 2,y: height / 2},
    strokeStyle: "#93f9b9",
    canvasId : "circle3",
    globalAlpha: defaultStyle.alpha.outter,
    radius : defaultStyle.radius.outter,
    speed: defaultStyle.speed.outter,
    start : 0,
    end : 0.8,
  });

  canvas1.createCircle();
  canvas2.createCircle();
  canvas3.createCircle();
}


$(document).ready(function(){
  $("#clabel").html(dakaCalendar.getTitle());
  initContentClick();
  initFlipClick();
  initCanvas();

  // 测试用
  TBCalendar.setCalendars(2017,1,"banner1");
  TBCalendar.setPrintedCalendars("1-3-5-12-24","胸-腿-胸-胸-胸","banner1");
})
