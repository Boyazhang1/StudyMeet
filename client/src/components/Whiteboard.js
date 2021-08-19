import { useEffect, useRef, useState } from 'react';

const Whiteboard = () => {
  const canvasRef = useRef();
  const drawing = useRef(false);
  const [ctx, setCtx] = useState({});
  const [canvasOffset, setCanvasOffset] = useState();

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    setCanvasOffset(canvasRef.current.getBoundingClientRect());
    console.log('rendered');
    setCtx(context);
  }, [ctx]);

  const startDraw = (e) => {
    drawing.current = true;
    draw(e);
  };
  const endDraw = () => {
    drawing.current = false;
    ctx.beginPath();
  };

  const draw = (e) => {
    if (!drawing.current) return;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    setCanvasOffset(canvasRef.current.getBoundingClientRect());
    console.log(e.pageX, e.pageY, e);
    console.log(canvasOffset)
    ctx.lineTo(
      e.clientX - parseInt(canvasOffset.x),
      e.pageY - (parseInt(canvasOffset.y) + window.scrollY)
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - parseInt(canvasOffset.x),
      e.pageY - (parseInt(canvasOffset.y) + window.scrollY)
    );
  };
  return (
    <div className="whiteboard">
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        width={500}
        height={500}
      ></canvas>
    </div>
  );
};

export default Whiteboard;