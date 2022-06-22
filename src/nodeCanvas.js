import { createCanvas, registerFont } from 'canvas';
import path from 'path';

function getWidth(){
  // const surface = CK.MakeSurface(10000, 10000)
  // const skCanvas = surface.getCanvas()

  // const canvas = document.createElement('canvas')
  const fontPath = path.resolve(__dirname, 'font/PingFangSC.ttf')
  registerFont(fontPath, { family: 'PingFangSC' })
  const canvas = createCanvas(1000,1000);
  const ctx = canvas.getContext("2d");
  if(ctx){
    ctx.font = `normal 36px PingFangSC`
    const textInfo = ctx.measureText('cur啦啦啦');
    const width =  textInfo.width;
    console.log('width====',width)
    console.log('textInfo====',textInfo)
    // console.log(polyfillMeasureText('cur'))
  }else{
    console.log('unable--getWidth')
  }
}
getWidth()