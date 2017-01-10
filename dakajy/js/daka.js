/*
* JS for jydaka
*/

var dakaCalendar = {
  year: 2017,
  month: 1,
  banner: 2,
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
  console.log("["+ partial + "] 点击");
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
      console.log("[BtnDaka] 成功签到");
    } else {
      console.log("[BtnDaka] 已经签到");
    }
  })
};



$(document).ready(function(){
  initContentClick();

  $("#clabel").html(dakaCalendar.getTitle());
  TBCalendar.setCalendars(2016,12,"banner1");
  TBCalendar.setCalendars(2017,1,"banner2");
  TBCalendar.setCalendars(2017,2,"banner3");
  var unslider = $(".banner").unslider({
    arrows : false,
    index: 1,
    nav: false,
  });

  $('.unslider-arrow').click(function() {
      var fn = this.className.split(' ')[1];
      if(fn == "prev"){
        if(dakaCalendar.month == 1){
          dakaCalendar.year -= 1;
          dakaCalendar.month = 12;
        } else {
          dakaCalendar.month -= 1;
        }

        if(dakaCalendar.banner == 1){
          dakaCalendar.banner = 3;
        } else {
          dakaCalendar.banner -= 1;
        }

        unslider.data('unslider').prev();
      } else {
        if(dakaCalendar.month == 12){
          dakaCalendar.year += 1;
          dakaCalendar.month = 1;
        } else {
          dakaCalendar.month += 1;
        }

        if(dakaCalendar.banner == 3){
          dakaCalendar.banner = 1;
        } else {
          dakaCalendar.banner += 1;
        }

        unslider.data('unslider').next();
      }
      $("#clabel").html(dakaCalendar.getTitle());
      TBCalendar.setCalendars(dakaCalendar.year,dakaCalendar.month,"banner" + dakaCalendar.banner);
  });
})
