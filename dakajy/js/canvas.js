/*
* Create for point (x, y)
*/

var midpoint = function(){
  this.x = 0;
  this.y = 0;
}

var CanvasObj = function(){
  // 原始参数
  var circ = Math.PI * 2;
  var quart= Math.PI / 2;

  // 基本参数
  var canvasId = '';
  var imgPos = {x1: 0,y1: 0,x2: 300, y2: 300};
  var midpoint = {};
  var radius = 30;    // 半径
  var start =  0;     // 开始位置
  var end =  0.8;       // 结束位置
  var speed = 0.01;   // 加载速度

  // 样式参数
  var lineWidth = 10.0;         // 线段粗细
  var lineCap = 'square';      // 线段样式
  var strokeStyle = "#000000"; // 线段颜色
  var globalAlpha = 1;

  this.setCanvasId = function(id) {  canvasId = id; };

  this.setLineCap = function(cap) { lineCap = cap; };

  this.setStrokeStyle= function(color) { strokeStyle = color;}

  this.setLineWidth = function(width) { lineWidth = width;}

  this.setAlpha = function(alpha) { globalAlpha = alpha; };

  this.setRadius = function(r){  radius = r; };

  this.setRange = function(s,e){ start = s; end = e; };

  this.setMidPoint = function(m){  midpoint = m; };

  this.setSpeed = function(s) { speed = s; };

  this.setImgPos = function(x1,y1,x2,y2){ imgPos.x1 = x1; imgPos.y1 = y1; imgPos.x2 = x2; imgPos.y2 = y2; };

  // 对外接口
  this.createCircle = function(){
    if(canvasId.length == 0) {
      console.log("[Canvas] Select your container.");
      return ;
    }

    var bg = document.getElementById(canvasId);
    var ctx = bg.getContext('2d');

    ctx.font="15px Arial";
    ctx.textAlign="start";
    ctx.fillText("textAlign=start",150,60);

    ctx.beginPath();
    ctx.lineCap = lineCap;
    ctx.strokeStyle = strokeStyle;
    ctx.globalAlpha = globalAlpha;
    ctx.closePath();

    ctx.fill();
    ctx.lineWidth = lineWidth;
    var imd = ctx.getImageData(imgPos.x1,imgPos.y1,imgPos.x2,imgPos.y2);

    function draw(current){
      ctx.putImageData(imd,0,0);
      ctx.beginPath();
      ctx.arc(midpoint.x,midpoint.y,radius,-(quart),((circ)*current) - quart,false);
      ctx.stroke();
    }

    var t = start;
    var now = end;
    var timer = null;
    function loadCanvas(now){
      timer = setInterval(function(){
        if(t > now){
          clearInterval(timer);
        } else {
          draw(t);
          t += speed;
        }
      })
    }

    loadCanvas(now);
    timer = null;
  }
}
