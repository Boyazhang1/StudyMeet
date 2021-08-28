import React from 'react'; 

class Board extends React.Component {

    ctx;
    c; 
    canvasOffset; 
    drawing = false;
    current = {}

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.setUpCanvas()

        this.props.socket.on('received-drawing', drawingData => {
            // console.log('received drawing data', drawingData)
            const {x0, y0, x1, y1} = drawingData; 
            this.drawLine(x0, y0, x1, y1)
        })
    }

    setUpCanvas() {
        let drawing = this.drawing; 
        let current = this.current; 


        const handleMouseDown = (e) => {
            drawing = true;
            current.x = e.clientX
            current.y = e.clientY
        }
    
        const handleMouseUp = (e) => {
            if (!drawing) return;
            drawing= false;
            this.drawLine(current.x, current.y, e.pageX, e.pageY, true)
        }
        
        const handleMouseMove = (e) => {
            if (!drawing) return;
            // console.log(current.x, current.y, e.pageX, e.pageY)
            this.drawLine(current.x, current.y, e.pageX, e.pageY, true)
            current.x = e.clientX
            current.y = e.clientY
        }
    
        const throttle = (callback, delay) => {
            let previousCall = new Date().getTime()
            return (e) => {
                const time = new Date().getTime(); 
    
                if ((time - previousCall) >= delay) {
                    previousCall = time; 
                    callback.apply(this, [e])
                }
            }
        };

        this.c = document.getElementById('canvasref')
        const d = document.getElementById('divref')
        this.ctx = this.c.getContext('2d')
        this.c.width = d.clientWidth - 15; 
        this.c.height = d.clientHeight - 5; 

        this.c.addEventListener('mousedown', handleMouseDown, false); 
        this.c.addEventListener('mousemove', throttle(handleMouseMove, 20), false);
        this.c.addEventListener('mouseup', handleMouseUp, false); 
 
    }

    drawLine(x0, y0, x1, y1, emit) {
        this.canvasOffset = this.c.getBoundingClientRect()
        // console.log('drawing coords', x0, y0, x1, y1)
        let ctx = this.ctx;
        let canvasOffset = this.canvasOffset; 

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x0 - parseInt(canvasOffset.x), y0 - (parseInt(canvasOffset.y) + window.scrollY)) ; 
        ctx.lineTo(x1 - parseInt(canvasOffset.x), y1 - (parseInt(canvasOffset.y) + window.scrollY)); 
        ctx.stroke();
        ctx.closePath();

        if (emit) {
            this.props.socket.emit("send-drawing", {
                // x0: x0 / w, 
                // y0: y0 / h, 
                // x1: x1 / w, 
                // y1: y1 / h
                x0, 
                y0, 
                x1, 
                y1
            }, this.props.roomName)
        }
    }



  
    render() {
        return (
          <div id='divref' className="whiteboard">
            <canvas
            id='canvasref'
            ></canvas>
          </div>
        )
      }
};

export default Board; 