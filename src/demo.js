
const canvasKitLoaded = CanvasKitInit({
  // locateFile: (file) => 'https://unpkg.com/canvaskit-wasm@0.28.1/bin/'+file,
  // 需要体验skottie相关的需要引入full文件下的
  locateFile: (file) => {
    console.log("file====",file)
    return 'https://unpkg.com/canvaskit-wasm@0.28.1/bin/full/'+file
  }
});
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
  // drawSkottie(surface)
  // SkottieExample()
  surface.flush()
});

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

function drawPathDemo(){
  const paint = new canvasKit.Paint();
  paint.setStrokeWidth(1.0);
  paint.setAntiAlias(true);
  paint.setColor(canvasKit.Color(0, 122, 22, 1.0));
  paint.setStyle(canvasKit.PaintStyle.Stroke);
  // path路径的介绍
  // https://segmentfault.com/a/1190000000721127 
  const path = new canvasKit.Path();
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

async function drawTextDemo(){
  // 字体资源，以提前
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
  // const path = new canvasKit.Path();
  // // 左上 100,50-->100,100的直线 和 100,100-->50, 100的直线 相切的指定半径的圆弧
  // path.moveTo(100,50)
  // path.arcToTangent(100, 100, 50, 100, radius)

  // path.moveTo(50,100)
  // path.arcToTangent(100, 100, 100, 150, radius)

  // path.moveTo(100,150)
  // path.arcToTangent(100, 100, 150, 100, radius)

  // path.moveTo(150,100)
  // path.arcToTangent(100, 100, 100, 50, radius)
  let centerX = 10, centerY = 10, offset = 5, radius = 5
  for(let i = 0; i < 8; i++){
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

function drawGradient(){
  // const shader = canvasKit.Shader.MakeLinearGradient(
  //   fromPoint.toArray(),
  //   toPoint.toArray(),
  //   colors,
  //   stops,
  //   sk.canvasKit.TileMode.Clamp
  // );
  const shader1 = canvasKit.Shader.MakeLinearGradient(  
    [0, 0], [50, 100],
    Float32Array.of(
        0, 1, 0, 0.8,
        1, 0, 0, 1,
        0, 0, 1, 0.5,
    ),
    [0, 0.65, 1.0],
    canvasKit.TileMode.Mirror
  );
  const paint = new canvasKit.Paint();
  paint.setStrokeWidth(1.0);
  paint.setAntiAlias(true);
  paint.setColor(canvasKit.Color(0, 0, 0, 1.0));
  paint.setStyle(canvasKit.PaintStyle.Stroke);
  // paint.setShader(shader1)
  // path路径的介绍
  // https://segmentfault.com/a/1190000000721127 
  const path = new canvasKit.Path();
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

function SkottieExample() {
  const cdnJson = 'https://storage.googleapis.com/skia-cdn/misc/lego_loader.json'
  const cdnConfettiJson = 'https://storage.googleapis.com/skia-cdn/misc/confetti.json'
  const cdnDrinksJson = 'https://storage.googleapis.com/skia-cdn/misc/drinks.json'
  const rectLeft = 0;
  const rectTop = 1;
  const rectRight = 2;
  const rectBottom = 3;
  fetch(cdnConfettiJson).then((resp) => {
    resp.text().then((jsonStr) => {
      if (!canvasKit || !jsonStr) {
        return;
      }
      const animation = canvasKit.MakeManagedAnimation(jsonStr);
      const duration = animation.duration() * 1000;
      // animation.setColor('BACKGROUND_FILL', canvasKit.Color(0, 163, 199, 1.0));

      const fullBounds = canvasKit.XYWHRect(0, 0, 500, 500);
    
      const surface = canvasKit.MakeCanvasSurface('foo');
      if (!surface) {
        console.error('Could not make surface');
        return;
      }
    
      let firstFrame = Date.now();
    
      function drawFrame(canvas) {
        let seek = ((Date.now() - firstFrame) / duration) % 1.0;
        let damage = animation.seek(seek);
    
        // if (damage[rectRight] > damage[rectLeft] && damage[rectBottom] > damage[rectTop]) {
          canvas.clear(canvasKit.WHITE);
          animation.render(canvas, fullBounds);
        // }
        surface.requestAnimationFrame(drawFrame);
      }
      surface.requestAnimationFrame(drawFrame);
    
    })
  })
  
}
