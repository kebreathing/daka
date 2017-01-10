/*
* For jiyu 日历
*/
var monthdays = [31,28,31,30,31,30,31,31,30,31,30,31];

var calendar = {
  isleap : function(year){
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
  },
  modifyMonthDays: function(year){
    if(this.isleap(year)){
      monthdays[1] = 29;
    } else {
      monthdays[1] = 28;
    }
  },
  getMonthCalendar: function(year,month){
    this.modifyMonthDays(year); // 修改日历大小
    var dates = new Array();
    var start = new Date(year,month-1,1);     // 开始时间
    var startDay = start.getDay();       // 每月开始第一天星期几，周日 = 1
    for(var i = 0; i < startDay;i++) dates.push(0);
    for(var i = 1; i <= monthdays[month-1]; i++) dates.push(i);
    console.log("[" + year + " " + month + "]： 星期" + startDay);
    // console.log(dates);
    return dates;
  }
}

var TBCalendar = {
  setCalendars: function(year,month,tableDivId){
    // 清空原有子元素
    $("#" + tableDivId).empty();
    // 获得月历信息
    var tdCalendars = calendar.getMonthCalendar(year,month);
    // 获取table div ID

    var index = 0;
    var rows  = "";
    while(index < tdCalendars.length){
      var str = "<tr>"
      for(var i=0;i<7 && index < tdCalendars.length;i++){
        if(tdCalendars[index] == 0) str += "<td></td>";
        else                        str += "<td id=\"" + tdCalendars[index] +"\"><label>" + tdCalendars[index] + "</label></td>";
        index++;
      }
      str += "</tr>";
      rows += str;
    }
    // console.log(rows);
    $("#" + tableDivId).append("<table><tbody>" + rows + "</tbody></table>")
  }
}
