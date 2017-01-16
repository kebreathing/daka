/**
* Configuration for web
*/
var webObj = {
  host: "localhost",
  port: 8080,
  part: "daka"
}
var url = "http://" + webObj.host + ":" + webObj.port + "/" + webObj.part;
var weblink = {
  postUserSession: url +"/user/log",
  postUserSave : url + "/user/save",
  getUserSigned: url + "/sum/getSigned",
  postDetailedSave: url + "/detailed/save",
  getDetailed:   url + "/detailed/get",
  postSumIncre:  url + "/sum/incre",
  postCalBetter: url + "/calendar/better",
  getCalendar:   url + "/calendar/get",
}


/*
* Rest 函数命名：method+Class+method
*/
var webconnect = {
  // Session开启
  postUserSession: function(obj){
    $.ajax({
      url : weblink.postUserSession,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){
      },
      complate: function(XMLHttpRequest, textStatus){
      }
    })
  },
  // 保存用户信息
  postUserSave : function(obj){
    $.ajax({
      url : weblink.postUserSave,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){
      },
      complate: function(XMLHttpRequest, textStatus){
      }
    })
  },
  // 修改用户打卡总次数
  postSumIncre: function(obj){
    $.ajax({
      url : weblink.postSumIncre,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest,textStatus,errorThrown){
      },
      success: function(msg){
      },
      complate: function(XMLHttpRequest,textStatus){
      }
    })
  },
  // 修改日历
  postCalBetter: function(obj){
    console.log(obj)
    $.ajax({
      url : weblink.postCalBetter,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest,textStatus,errorThrown){
      },
      success: function(msg){
      },
      complate: function(XMLHttpRequest,textStatus){
      }
    })
  },
  // 保存用户打卡detailed
  postDetailedSave: function(obj){
    console.log(obj)
    $.ajax({
      url : weblink.postDetailedSave,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(obj),
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){

      },
      complate: function(XMLHttpRequest, textStatus){
      }
    })
  },
  // 获取page-1 总次数
  getUserSigned: function(userId){
    console.log("[Sum-signedCount] id:" + userId)
    $.ajax({
      url : weblink.getUserSigned + "?userId=" + userId,
      type: "GET",
      async: false,
      contentType: "application/json; charset=utf-8",
      error: function(XMLHttpRequest,textStatus,errorThrown){
      },
      success: function(result){
        console.log("[GetUserSigned]: result is got.");
        dakaObj.setSumDate(result);
      },
      complate: function(XMLHttpRequest,textStatus){
      }
    })
  },
  // 获取page-1 用户打卡detailed
  getDetailed: function(obj){
    var url = weblink.getDetailed + "?userId=" + obj.userId + "&year=" + obj.year
               + "&month=" + obj.month + "&date=" + obj.date;
    $.ajax({
      url : url,
      type: "GET",
      async: false,
      contentType: "application/json; charset=utf-8",
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){
        console.log("[GetDetailed]: result is got.");
        console.log(msg)
        if(msg.length != 0){
          dakaObj.setContent(msg.practise);
          dakaObj.setSigned(true);
        }
      },
      complate: function(XMLHttpRequest, textStatus){
      }
    })
  },
  // 获得日历打卡信息
  getCalendar: function(obj){
    var url = weblink.getCalendar + "?userId=" + obj.userId + "&year=" + obj.year
                 + "&month=" + obj.month;
    $.ajax({
      url : url,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      error: function(XMLHttpRequest, textStatus, errorThrown){
      },
      success: function(msg){
        console.log("[GetCalendar]: result is got.");
        if(msg.length != 0)
          TBCalendar.setPrintedCalendars(msg.calendar,msg.trainCalendar,"banner" + msg.month);
      },
      complate: function(XMLHttpRequest, textStatus){
      }
    })
  },
  // 点击打卡按钮，完成所有信息
  webClickBtnDaka(obj){
    // console.log(obj)
    this.postDetailedSave(obj);
    this.postSumIncre({userId: obj.userId,nowDate : obj.signTime});
    this.postCalBetter({userId: obj.userId,year: obj.year, month: obj.month,date: obj.date, content: obj.practise})
  }
}
