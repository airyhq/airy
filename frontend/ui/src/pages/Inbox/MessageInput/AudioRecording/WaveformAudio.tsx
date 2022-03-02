import React, {useState, useEffect, useRef} from 'react';

export function WaveformAudio({audioData}) {
  const canvas = useRef(null);
  const [context, setContext] = useState(null);
  const maxFrequencyValue = 255;
  const barWidth = 3;
  const barTotalCount = 57;
  const canvasHeight = 40;
  //57
  const canvasWidth = 940; //270


  //responsive: barCount: 90 / barWidth: 4

  //find canvas width in pixel dynamically

  useEffect(() => {
    if (canvas && canvas.current) {
      setContext(canvas.current.getContext('2d'));
     
      const context = canvas.current.getContext('2d');

      setContext(context);
      const ratio = window.devicePixelRatio || 1;

      // canvas.current.width = canvasWidth * ratio;
      // canvas.current.height = canvasHeight * ratio;

      canvas.current.style.width = '100%';
      canvas.current.style.height = canvasHeight + 'px';
      canvas.current.width = canvas.current.offsetWidth;
      canvas.current.height = canvas.current.offsetHeight;
  

    }
  }, [canvas]);

  useEffect(() => {
    if (audioData && context) {
      context.clearRect(0, 0, canvas.current.width, canvas.current.height);
      visualizeAudioRecording();
    }
  }, [context, audioData]);

  const visualizeAudioRecording = () => {
    const canvasHeight = canvas.current.height;
    const singleBarSize = canvas.current.width / barTotalCount;

    context.lineWidth = barWidth;
    context.strokeStyle = '#1578D4'; //use scss color
    context.lineCap = 'round';

    let x = barWidth * 2;
    for (let i = 0; i < barTotalCount; i++) {
      const freqHeight = (audioData[i] / maxFrequencyValue) * canvasHeight;
      const baseHeight = canvasHeight/8;
      const y = (canvasHeight / 2 - freqHeight / 2)- (baseHeight/2)
      let calculatedHeight =  y + freqHeight + baseHeight;

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, calculatedHeight);
      context.stroke();
      x += singleBarSize;
    }
  };

  return <canvas ref={canvas}></canvas>;
}
