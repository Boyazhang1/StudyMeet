import { useEffect, useRef, useState } from 'react';
let ctx; 
let canvasOffset; 

const Whiteboard = ({socket, roomName}) => {

  const canvasRef = useRef()
  const divRef = useRef()
  const canvasLoaded = useRef(false)

  
  let timeout; 
  let drawing = false; 
  let current = {}

  const setUpCanvas = () => {
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = divRef.current.clientWidth - 15; 
    canvasRef.current.height = divRef.current.clientHeight - 5;
    ctx = context; 
    canvasLoaded.current = true; 
  }

  useEffect(() => {
    setUpCanvas(); 
  }, []);


  const drawLine = (x0, y0, x1, y1, emit) => {
    canvasOffset = canvasRef.current.getBoundingClientRect();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0 - parseInt(canvasOffset.x), y0 - (parseInt(canvasOffset.y)));
    ctx.lineTo(x1 - parseInt(canvasOffset.x), y1 - (parseInt(canvasOffset.y))); 
    ctx.stroke();
    ctx.closePath();
    let w = canvasRef.current.width; 
    let h = canvasRef.current.height; 
    if (emit) {
      socket.emit("send-drawing", {
        x0: x0 / w, 
        y0: y0 / h, 
        x1: x1 / w, 
        y1: y1 / h
        // x0, 
        // y0, 
        // x1, 
        // y1
      }, roomName)
    }
  }


  useEffect(() => {
    console.log('used effect')
    if (canvasLoaded) {
      let w = canvasRef.current.width; 
      let h = canvasRef.current.height; 
      socket.on('received-drawing', drawingData => {
        const {x0, y0, x1, y1} = drawingData; 
        drawLine(x0 * w, y0 * h, x1 * w, y1 * h)
      })
    }
  })

  const handleMouseDown = (e) => {
    drawing = true;
    current.x = e.clientX
    current.y = e.clientY
  };
  const handleMouseUp = (e) => {
    if (!drawing) return;
    drawing= false;
    drawLine(current.x, current.y, e.clientX, e.clientY, true)
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    drawLine(current.x, current.y, e.clientX, e.clientY, true)
    current.x = e.clientX
    current.y = e.clientY
  };

  const throttle = (callback, delay) => {
    let previousCall = new Date().getTime()
    return (e) => {
      const time = new Date().getTime(); 

      if ((time - previousCall) >= delay) {
        previousCall = time; 
        callback.apply(this, [e])
      }
    }
  }

  return (
    <div  ref={divRef} className="whiteboard">
      <canvas
      ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={throttle(handleMouseMove, 20)}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
};

export default Whiteboard;