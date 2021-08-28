import { useEffect, useRef, useState } from 'react';


const Whiteboard = ({socket, roomName}) => {


  const canvasRef = useRef()
  const divRef = useRef()
  const [ctx, setCtx] = useState({});
  const [canvasOffset, setCanvasOffset] = useState();
  const [drawReceived, setDrawReceived] = useState(); 

  
  let timeout; 
  let drawing = false; 
  let current = {}


  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    setCanvasOffset(canvasRef.current.getBoundingClientRect());
    canvasRef.current.width = divRef.current.clientWidth - 15; 
    canvasRef.current.height = divRef.current.clientHeight - 5;
    console.log('rendered');
    setCtx(context);
  }, [ctx]);


  const drawLine = (x0, y0, x1, y1) => {
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0 - parseInt(canvasOffset.x), y0 - (parseInt(canvasOffset.y) + window.scrollY)) ; 
    ctx.lineTo(x1 - parseInt(canvasOffset.x), y1 - (parseInt(canvasOffset.y) + window.scrollY)); 
    ctx.stroke();
    ctx.closePath();

    // let w = canvasRef.current.width; 
    // let h = canvasRef.current.height; 
    socket.emit("send-drawing", {
      // x0: x0 / w, 
      // y0: y0 / h, 
      // x1: x1 / w, 
      // y1: y1 / h
      x0, 
      y0, 
      x1, 
      y1
    }, roomName)
  }


  useEffect(() => {
    canvasRef.current.addEventListener('mousemove', throttle(handleMouseMove, 20, false))
    // drawLine(...Object.values(drawFrame))
  })


  socket.on('received-drawing', drawingData => {
    console.log(ctx)
    drawLine(drawingData)
  })
 

  const handleMouseDown = (e) => {
    drawing = true;
    current.x = e.clientX
    current.y = e.clientY
    // handleMouseMove(e);
  };
  const handleMouseUp = (e) => {
    if (!drawing) return;
    drawing= false;
    drawLine(current.x, current.y, e.clientX, e.pageY)
    // ctx.beginPath();
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    drawLine(current.x, current.y, e.clientX, e.pageY)
    current.x = e.clientX
    current.y = e.clientY


    // ctx.lineTo(
    //   e.clientX - parseInt(canvasOffset.x),
    //   e.pageY - (parseInt(canvasOffset.y) + window.scrollY)
    // );
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(
    //   e.clientX - parseInt(canvasOffset.x),
    //   e.pageY - (parseInt(canvasOffset.y) + window.scrollY)
    // );

    // if (timeout === undefined) clearTimeout(timeout)
    // timeout = setTimeout(() => {
    //   let imgData = canvasRef.current.toDataURL("image/png")
    //   socket.emit("send-drawing", imgData, roomName)
    // }, 1000)
  };

  const throttle = (callback, delay) => {
    let previousCall = new Date().getTime()
    return function() {
      const time = new Date().getTime(); 

      if ((time - previousCall) >= delay) {
        previousCall = time; 
        callback.apply(null, arguments)
      }
    }
  }

  return (
    <div  ref={divRef} className="whiteboard">
      <canvas
      ref={canvasRef}
        onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
};

export default Whiteboard;