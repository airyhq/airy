const canvasWidth = 174;
const canvasHeight = 40;
const barWidth = 3;
const initialBarsColor = 'white';

export interface CanvasWaveformPaths {
  path0: Path2D;
  path1: Path2D;
  path2: Path2D;
  path3: Path2D;
  path4: Path2D;
  path5: Path2D;
  path6: Path2D;
  path7: Path2D;
  path8: Path2D;
  path9: Path2D;
  path10: Path2D;
  path11: Path2D;
  path12: Path2D;
  path13: Path2D;
  path14: Path2D;
  path15: Path2D;
  path16: Path2D;
  path17: Path2D;
  path18: Path2D;
  path19: Path2D;
}

export const paths = {
  path0: new Path2D(),
  path1: new Path2D(),
  path2: new Path2D(),
  path3: new Path2D(),
  path4: new Path2D(),
  path5: new Path2D(),
  path6: new Path2D(),
  path7: new Path2D(),
  path8: new Path2D(),
  path9: new Path2D(),
  path10: new Path2D(),
  path11: new Path2D(),
  path12: new Path2D(),
  path13: new Path2D(),
  path14: new Path2D(),
  path15: new Path2D(),
  path16: new Path2D(),
  path17: new Path2D(),
  path18: new Path2D(),
  path19: new Path2D(),
};

export const setUpCanvas = (
  canvas: React.MutableRefObject<HTMLCanvasElement>,
  canvasContext: CanvasRenderingContext2D
) => {
  const ratio = window.devicePixelRatio;

  canvas.current.width = canvasWidth * ratio;
  canvas.current.height = canvasHeight * ratio;

  canvas.current.style.width = canvasWidth + 'px';
  canvas.current.style.height = canvasHeight + 'px';

  canvasContext.scale(ratio, ratio);

  canvasContext.translate(0, canvas.current.offsetHeight / 2);
  canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);
};

export const drawBar = (
  x: number,
  height: number,
  isEven: number,
  ctx: CanvasRenderingContext2D,
  audioFrequencyBarPath: Path2D,
  setContext: React.Dispatch<CanvasRenderingContext2D>
) => {
  const canvasHeight = 40;
  const barPadding = 2;
  const halfCanvasHeight = canvasHeight / 2;
  const maxBarHeight = canvasHeight / 2 - barPadding;
  const barMinimumHeight = 4;
  ctx.fillStyle = initialBarsColor;

  if (height <= 1) {
    height += barMinimumHeight;
  }

  if (height >= halfCanvasHeight) {
    height = maxBarHeight;
  }

  if (height <= halfCanvasHeight - 1 && height >= halfCanvasHeight - barPadding) {
    height -= barPadding;
  }

  if (x === 0) x = barPadding;

  height = isEven ? height : -height;

  ctx.lineWidth = barWidth;
  ctx.strokeStyle = initialBarsColor;
  ctx.lineCap = 'round';

  audioFrequencyBarPath.moveTo(x, 0);
  audioFrequencyBarPath.lineTo(x, height);
  ctx.stroke(audioFrequencyBarPath);
  audioFrequencyBarPath.moveTo(x, 0);
  audioFrequencyBarPath.lineTo(x, -height);

  ctx.stroke(audioFrequencyBarPath);
  setContext(ctx);
};
