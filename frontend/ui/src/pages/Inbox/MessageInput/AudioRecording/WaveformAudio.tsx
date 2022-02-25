import React, {useState, useEffect, useRef} from 'react';

export function WaveformAudio({audioData}) {
  const canvas = useRef(null);
  const [context, setContext] = useState(null);
  const maxFrequencyValue = 255;
  const barWidth = 2;
  const barTotalCount = 57;
  const canvasWidth = 470;
  const canvasHeight = 40;

  //find canvas width in pixel dynamically

  useEffect(() => {
    if (canvas && canvas.current) {
      setContext(canvas.current.getContext('2d')); 
      //const context = canvas.current.getContext('2d');
     
      //setContext(context);
      // const ratio = window.devicePixelRatio;

      // canvas.current.width = canvasWidth * ratio;
      // canvas.current.height = canvasHeight * ratio;

      // canvas.current.style.width = canvasWidth + 'px';
      // canvas.current.style.height = canvasHeight + 'px';

      // context.scale(ratio, ratio);
      // context.translate(0, canvas.current.offsetHeight / 2);

      
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

    let x = barWidth;
    for (let i = 0; i < barTotalCount; i++) {
      const freqHeight = (audioData[i] / maxFrequencyValue) * canvasHeight;
      const y = canvasHeight / 2 - freqHeight / 2;

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + freqHeight);
      context.stroke();
      x += singleBarSize;
    }
  };

  return <canvas ref={canvas} width="470" height="40"></canvas>;
}
