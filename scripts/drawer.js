export class Drawer {
    constructor(canvas, width, height) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")

        canvas.width = width
        canvas.height = height

        this._fonts = []
    }

    clear() {
        this.ctx.reset()
    }

    filledRect() { return (x,y, width,height, color) =>
        this._rect(x,y,width,height, null,color)
    }

    strokedRect()  { return (x,y, width,height, color) => 
        this._rect(x,y,width,height, color, null)
    }

    _rect(x,y,width,height, strokeColor = '', fillColor = '') {
        this.ctx.beginPath()
        this.ctx.rect(x,y,width,height)

        if (strokeColor) {
            this.ctx.strokeStyle = strokeColor
            this.ctx.stroke()
        }
        if (fillColor) {
            this.ctx.fillStyle = fillColor
            this.ctx.fill()
        }
        this.ctx.closePath()
    }

    gameOver() {
        this.filledRect(0,this.canvas.height/2-32,this.canvas.width,64,"#ffffffb6")

        this.ctx.beginPath()
        this.ctx.fillStyle = "#000000"
        this.ctx.font = "bold 38px " + this._fonts[0]
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.fillText("GAME OVER", this.canvas.width/2, this.canvas.height/2)
        this.ctx.closePath()
    }

    setFonts(fonts) {
        this._fonts = fonts
    }
}