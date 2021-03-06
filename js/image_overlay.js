//*** SHIM ***
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

(function() {
  "use strict";
  
  //************
  //VARIABLES
  //************
  var _Canvas;
  let _frontImageSrc = 'http://insidedown.com/codepen/stock/mountain-tan.jpg';
  let _backImageSrc = 'http://insidedown.com/codepen/stock/mountain.jpg';
  let _frontImage;
  let _backImage;
  let _blackMask;
  let _mouseX = 0;
  let _mouseY = 0;
  let _maskCount = 25;
  let _tweenTime = 0.5;
  let _pauseTime = 0.25;
  let _delayTime = 0.08;
  let _maskArray = [];
  let _srcArray = ["http://insidedown.com/codepen/stock/newstain1.png", "http://insidedown.com/codepen/stock/newstain2.png", "http://insidedown.com/codepen/stock/newstain3.png"];
  
  //************
  //METHODS
  //************
  function init() {
    _Canvas = new Canvas({stage:document.getElementById('stage')});
    _backImage = new MaskedImage({src:_backImageSrc});
    _frontImage = new MaskedImage({src:_frontImageSrc});
    
    for(let i=0;i<_maskCount;i++){
      let ranSrc = _srcArray[Math.floor(Math.random() * _srcArray.length)];
      let mask = new MaskedImage({src:ranSrc, delay:i, width:300});
      _maskArray.push(mask);
    }
    addListeners();
  }
  
  //************
  //EVENTS
  //************
  function addListeners() {
    _Canvas.el.addEventListener('mousemove', onCanvasMouseMove);
    _Canvas.el.addEventListener('mouseout', onCanvasMouseOut);
  }
  
  function onCanvasMouseMove(event) {
    _mouseX = event.pageX - $(this).offset().left;
    _mouseY = event.pageY - $(this).offset().top;
  }
  
  function onCanvasMouseOut(event) {
  }
  
  function onEnterFrame() {
      _Canvas.clearStage();
      drawStage();
      window.requestAnimFrame(onEnterFrame, 60);
  }
  
  function drawStage() {
    _Canvas.context.save();
    
    for(let i=0;i<_maskCount;i++){
      let mask = _maskArray[i];
      mask.tweenDraw();
    }
    
    //_blackMask.draw(_mouseX,_mouseY);
    _Canvas.context.globalCompositeOperation = 'source-in';
    _backImage.draw();
    _Canvas.context.globalCompositeOperation = 'destination-over';
    _frontImage.draw();
    _Canvas.context.restore();
  }
  
  
  //************
  //CLASSES
  //************
  
  class MaskedImage {
    constructor(options) {
      this.hasImg = false;
      this.img = new Image();
      this.empty = {scale:0, alpha:1, x:0, y:0};
      this.delay = options.delay;
      this.rotation = Math.random() * 360;
      this.width = options.width;
      this.halfWidth = this.width/2;
      this.img.src = options.src;
      this.img.onload = function() {
        this.hasImg = true;
        if(this.delay){ 
          setTimeout(function() {this.scale();}.bind(this), this.delay*(_delayTime * 1000));
        }
        this.draw(); 
      }.bind(this);
    }
    
    draw(x=0,y=0) {
      if(this.hasImg) {
        