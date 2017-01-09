/*
* JS for jydaka
*/

var dakaObj = {
  openId : 0,
  content: '',
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

clickDoubleClick = function(partial){
  var id = "#" + partial;
  console.log("["+ partial + "] 双击点击");
  if(partial.length != 0
      && dakaObj.content.length != 0
      &&  partial == dakaObj.content){
        $(id).children().css("color", "#1d976c");
        $(id).children().css("border-color", "#1d976c");
        $(id).children().css("background-color", "inherit");
  }
}

initContentClick = function(){
  $("#tdArm").bind("click",function(){
    clickSingleContent("tdArm");
  });
  $("#tdLeg").bind("click",function(){
    clickSingleContent("tdLeg");
  });
  $("#tdBreast").bind("click",function(){
    clickSingleContent("tdBreast");
  });
  $("#tdBack").bind("click",function(){
    clickSingleContent("tdBack");
  });
  $("#tdShoulder").bind("click",function(){
    clickSingleContent("tdShoulder");
  });
  $("#tdEtc").bind("click",function(){
    clickSingleContent("tdEtc");
  });
};


$(document).ready(function(){
  initContentClick();
  $("#btnDaka").bind("click",function(){
    console.log("[#BtnDaka] 点击签到按钮.");
  });
})
