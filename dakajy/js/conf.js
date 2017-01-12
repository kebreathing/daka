/**
* Configuration for daka
*/

// 默认Style
var defaultStyle = {
  radius: { inner: 90, normal: 103, outter: 116},
  alpha:  { inner: 0.6, normal: 0.4, outter: 0.2},
  speed:  { inner: 0.005, normal: 0.005, outter: 0.005},
  range:  { inner: 0.8, norml: 0.6, outter: 0.4},
  strokeStyle: "#93f9b9",
  lineWidth: 10
}

// Page 1 : Canvas
var canvaser= {
  outter : {},
  normal : {},
  inner : {}
}

// Page: 2
var dakaCalendar = {
  year: 2017,
  month: 1,
  banner: 1,
  rightmax: 12,
  leftmin: 1,
  getTitle: function(){
    return this.year + " 年 " + this.month + " 月";
  }
}

// Page: 1
var dakaObj = {
  openId : 0,
  content: '',
  contented: false, // 是否已经选了训练项目
  signed: false,    // 是否已经签到
  sumDate: 0,       // 签到总天数
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
  },
  addSum: function(){
    return ++this.sumDate;
  }
}
