# canvaskit-wasm保姆级教程
## Overview
&emsp;&emsp;这里就不在介绍CanvasKit的相关内容了，感兴趣的同学可以去这篇文章看一看，本章主要以入门小demo为主。
## Get Started
&emsp;&emsp;为了吸引大家阅读的兴趣，首先大家在codepen看一个基于canvaskit做的五彩纸屑小动画。那么就从简单的例子开始，直接给大家[show code](https://codepen.io/wal1e/pen/YzegBLZ)，毕竟talk is easy show me the code哈，具体看看CanvasKit是如何在浏览器直接绘制的，按照老规矩，以Hello World开始文章的内容，为了方便大家可以跟着文章一起coding，快速看到绘制效果，这里选择了直接在html的script标签里引入canvaskit.js，这样无需打包和服务，第一时间看到画面，html文件的结构很简单，script标签引入canvasKit,js，body标签里包含一个canvas画布。如下所示：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>hello canvaskit</title>
    <!-- 引入解压过的canvaskit-wasm@0.33.0 -->
    <script type="text/javascript" src="https://unpkg.com/canvaskit-wasm@0.33.0/bin/canvaskit.js"></script>
    <!-- 需要体验skottie相关的需要引入full文件下的 -->
    <!-- <script type="text/javascript" src="https://unpkg.com/canvaskit-wasm@0.33.0/bin/full/canvaskit.js"></script> -->
  </head>
  <body>
    <style>
      canvas {
        border: 1px dashed #AAA;
      }
    
    </style>
    <canvas id=foo width=500 height=500></canvas>
  </body>
  <script src="./demo.js"></script>
</html>
```
&emsp;&emsp;接下来是加载canvasKit，在前端j中注入canvasKit对象依赖，这里的file参数其实就是canvaskit-wasm，感兴趣的可以在npm包的bin路径下看到对应的二进制文件
```javascript
const canvasKitLoaded = CanvasKitInit({
  locateFile: (file) => 'https://unpkg.com/canvaskit-wasm@0.33.0/bin/'+file,
  // 需要体验skottie相关的需要引入full文件下的
  // locateFile: (file) => 'https://unpkg.com/canvaskit-wasm@0.33.0/bin/full/'+file,
});
```
&emsp;&emsp;首先将canvasKit注入到web环境中，创建surface和skCanvas，给画布添加背景色，准备画图的基本环境
```javascript
let canvasKit
let skCanvas
canvasKitLoaded.then(async (CanvasKit) => {
  canvasKit = CanvasKit
  const canvasEl = document.getElementById('foo');
  const grContext = canvasKit.MakeGrContext(canvasKit.GetWebGLContext(canvasEl));

  const surface = canvasKit.MakeOnScreenGLSurface(
    grContext,
    canvasEl.width,
    canvasEl.height,
    canvasKit.ColorSpace.SRGB
  );
  skCanvas = surface.getCanvas();
  // 对应的demo调用
  await drawTextDemo()
  // drawRectDemo()
  // drawCircleDemo()
  // drawPathDemo()
  // setInterval(()=>{
  //   drawStarDemo()
  //   surface.flush()
  // },1000)
  // drawSkottie()
  surface.flush()
});
```
## Hello World 
&emsp;&emsp; 准备工作已经完整，首先从Hello World开始，代码如下所示。
```javascript
// demo.js
async function drawTextDemo(){
  // 引入字体，已提前上传字体资源
  const fontSrc = 'http://view.didistatic.com/static/dcms/do1_IVCZvi4Wc66Ft5EDCiHh'
  const loadRoboto = fetch(fontSrc).then((response) => response.arrayBuffer());
  const robotoData = await loadRoboto
  const fontMgr = canvasKit.FontMgr.RefDefault();
  let roboto = fontMgr.MakeTypefaceFromData(robotoData);

  const textPaint = new canvasKit.Paint();
  textPaint.setColor(canvasKit.RED);
  textPaint.setAntiAlias(true);

  const textFont = new canvasKit.Font(roboto, 30);
  skCanvas.drawText('Hello World', 100, 100, textPaint, textFont);
}
```
&emsp;&emsp; 在浏览器打开对应的html，就能看到CanvasKit绘制的Hello World了，无法看到Hello World的请提issue反馈。
&emsp;&emsp; Hello World的demo其实主要是调用drawText实现，首先要加载对应的字体资源，然后设置文本属性的textPaint和文本对象textFont，最后将参数传入drawText里进行绘制。只有在涉及到文本操作的时候，才需要依赖字体资源，在调用其它draw相关api时，会相对更简单些。接下来依然通过小demo来看看其它的绘制方法。
## 画一个小矩形
&emsp;&emsp;1. 在画布上创建绘画燃料对象paint，设置样式、画笔等属性
&emsp;&emsp;2. 创建绘画的目标区域（同时设置坐标和宽度）
&emsp;&emsp;3. 调用drawRect方法，将paint在目标区域上展示
```javascript
function drawRectDemo(){
  const paint = new canvasKit.Paint();
  paint.setColor(canvasKit.Color4f(0.9, 0, 0, 1.0))
  paint.setStyle(canvasKit.PaintStyle.Stroke);
  paint.setStrokeWidth(6)
  // 是否设置抗锯齿
  paint.setAntiAlias(true);
  const rect = canvasKit.XYWHRect(100, 100, 100, 100)

  skCanvas.clear(canvasKit.WHITE);
  skCanvas.drawRect(rect, paint);
}
```

## 画一个大圆圈
&emsp;&emsp;相比于前面画的矩形，这里主要是在第3步替换了画圆的方法drawCircle
```javascript
function drawCircleDemo(){
  const paint = new canvasKit.Paint();
  paint.setColor(canvasKit.Color4f(0.9, 0, 0, 1.0))
  paint.setStyle(canvasKit.PaintStyle.Stroke);
  paint.setStrokeWidth(6)
  // 是否设置抗锯齿
  paint.setAntiAlias(true);
  skCanvas.clear(canvasKit.WHITE);
  skCanvas.drawCircle(120,120,100,paint)
}
```

## 画几条路径
&emsp;&emsp;画路径其实是相对复杂的部分，因为会涉及到大量的数学和几何计算，这里向大家介绍几种常用的方法，在绘制复杂矢量图形时，常常是将这些方法结合起来画图。
&emsp;&emsp;具体的方法介绍可参考[path路径的介绍](https://segmentfault.com/a/1190000000721127)
```javascript
function drawPathDemo(){
  const paint = new canvasKit.Paint();
  paint.setStrokeWidth(1.0);
  paint.setAntiAlias(true);
  paint.setColor(canvasKit.Color(0, 122, 22, 1.0));
  paint.setStyle(canvasKit.PaintStyle.Stroke);
  const path = new canvasKit.Path();

  // 不同的path路经方法
  path.moveTo(20, 5);
  path.lineTo(30, 20);
  path.lineTo(40, 10);
  path.lineTo(50, 20);
  path.lineTo(60, 0);
  path.lineTo(20, 5);

  path.moveTo(20, 80);
  // 三阶贝塞尔曲线
  path.cubicTo(90, 10, 160, 150, 190, 10);

  path.moveTo(36, 148);
  // 一个控制点的贝塞尔曲线
  path.quadTo(66, 188, 120, 136);
  path.lineTo(36, 148);

  path.moveTo(150, 180);
  // 基于坐标点和两条切线画指定半径的圆弧
  path.arcToTangent(150, 100, 50, 200, 20);
  path.lineTo(160, 160);

  path.moveTo(20, 120);
  path.lineTo(20, 120);

  skCanvas.drawPath(path, paint)
}
```
&emsp;&emsp;通过上面的三个简单例子可以看出，基本流程都是一样的，通常是draw+具体layer，skCanvas知道图形将在哪里进行绘制，layer表示具体要画的是什么，paint是告诉画布如绘制。
&emsp;&emsp;你会唱小星星吗？
&emsp;&emsp;不会，我会画小星星哦
&emsp;&emsp;下面是使用path来绘制星星闪烁的代码
```javascript
function drawStar(paint, centerX, centerY, offset, radius){
  const path = new canvasKit.Path();

  path.moveTo(centerX, centerY - offset)
  path.arcToTangent(centerX, centerY, centerX - offset, centerY, radius)

  path.moveTo(centerX - offset, centerY)
  path.arcToTangent(centerX, centerY, centerX, centerY + offset, radius)

  path.moveTo(centerX, centerY + offset)
  path.arcToTangent(centerX, centerY, centerX + offset, centerY, radius)

  path.moveTo(centerX + offset, centerY)
  path.arcToTangent(centerX, centerY, centerX, centerY - offset, radius)
  skCanvas.drawPath(path, paint)
}
function drawStarDemo(){
  const paint = new canvasKit.Paint();
  paint.setStrokeWidth(1.0);
  paint.setAntiAlias(true);
  paint.setColor(canvasKit.Color(0, 0, 0, 1.0));
  paint.setStyle(canvasKit.PaintStyle.Stroke);
  // path路径的介绍
  // https://segmentfault.com/a/1190000000721127 
  let centerX = 10, centerY = 10, offset = 5, radius = 5
  for(let i = 0; i < 5; i++){
    centerX += 20
    centerY += 20
    if(Math.random() * 10 > 5){
      paint.setAlphaf(0.5)
      paint.setColor(canvasKit.Color(0, 0, 0, 1.0));
    }else{
      paint.setAlphaf(1)
      paint.setColor(canvasKit.YELLOW);
    }
    drawStar(paint, centerX, centerY, offset, radius)
  }
}
```
## skottie动画
&emsp;&emsp;最后介绍下skottie的应用，这里需要用full文件下的canvasKit.js，开头提到的五彩纸屑的动画代码如下
```javascript
function  drawSkottie(){
  fetch('https://storage.googleapis.com/skia-cdn/misc/confetti.json').then((resp) => {
    resp.text().then((jsonStr) => {
      if (!canvasKit || !jsonStr) {
        return;
      }
      const animation = canvasKit.MakeManagedAnimation(jsonStr);
      const duration = animation.duration() * 1000;
      const rectBounds = canvasKit.XYWHRect(0, 0, 500, 500);
      let firstFrame = new Date().getTime();
      const surface = canvasKit.MakeCanvasSurface('foo');

      function drawFrame(canvas) {
        let now = new Date().getTime();
        let seek = ((now - firstFrame) / duration) % 1.0;
        animation.seek(seek);
        canvas.clear(canvasKit.WHITE);
        animation.render(canvas, rectBounds);
        surface.requestAnimationFrame(drawFrame);
      }
      surface.requestAnimationFrame(drawFrame);
    });
  });
}
```