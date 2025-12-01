import { Drawer } from "./drawer.js"
import { FallingObject } from "./fallingObject.js"
import { InputHandler } from "./inputHandler.js"
import { ScoreHandler } from "./scoreHandler.js"
import { SHAPES } from "./shapes.js"

document.addEventListener("DOMContentLoaded", () => {
    // let f = new FontFace("Limelight", 'url("https://fonts.googleapis.com/css2?family=Limelight&display=swap")')
    const widthEl = document.getElementById("measureWidth")
    const heightEl = document.getElementById("measureHeight")
    showResolutions(widthEl, heightEl)
    window.addEventListener("resize", () => {
        showResolutions(widthEl, heightEl)
    })
    const tetris = new Game(document.getElementById("screen"), ["TimesNewRoman"])
    tetris.init()
})

function showResolutions(widthEl, heightEl) {
    widthEl.innerText = window.outerWidth
    heightEl.innerText = window.outerHeight
}

class Game {
    constructor(canvasElement, fonts) {
        this.fieldSize = { y: 16, x: 8 }
        this.gameField = null
        
        this.cellSize = 32
        this.colors = ["#ff0000", "#eae30dff", "#1441beff"]

        this.drawer = new Drawer(canvasElement, this.cellSize * this.fieldSize.x, this.cellSize * this.fieldSize.y)
        this.drawer.setFonts(fonts)

        this.predictDrawerCell = this.cellSize / 3
        this.predictFieldSize = this.predictDrawerCell * this.fieldSize.x
        this.predictDrawer = new Drawer(document.getElementById("predictscreen"), this.predictFieldSize, this.predictFieldSize)
        this.nextShape = null

        this.inputHandler = new InputHandler()
        this.scoreHandler = new ScoreHandler()

        this.falling = null

        this._isGameOver = false

        this.centralX = Math.floor((this.fieldSize.x - 1) / 2)

        this.awaitFrames = 3
        this.currentFrame = 0

    } 

    init() {
        this.gameField = this._generateField()
        this.falling = null
        this._isGameOver = false
        this.scoreHandler.resetScore()

        this.nextShape = this._pickNextShape()
        this.drawUI()
        this.loopId = setInterval(this.loop.bind(this), 100)
    }

    loop() {
        this.update()
        this.inputHandler.reset()
        this.drawUI()
        if (this._isGameOver) {
            clearInterval(this.loopId)
            this.loopId = null
            this.gameOver()
        }
    }

    update() {
        if (this.inputHandler.input == "restart") this._onRestartClicked()
        if (!this.falling) {
            this.falling = new FallingObject(SHAPES[this.nextShape], 1, this.centralX)
            this.nextShape = this._pickNextShape()

            for (let y = 0; y < this.fieldSize.y; y++)
                if (this.gameField[y].every(cell => cell !== 0)) {
                    this.scoreHandler.updateScore(1)
                    this.eraseRow(y)
                    this.moveRowsDownFrom(y)
                }
        }
        let x = this.inputHandler.input == "KeyA" && this.falling.leftCorner > 0 ? -1 :
            this.inputHandler.input == "KeyD" && this.falling.rightCorner + 1 < this.fieldSize.x ? 1 : 0

        if (x !== 0) this.moveFallingObject(0, x)
        
        if (this.inputHandler.input == "KeyR") {
            this.setFallingInField(true, true)
            this.falling.rotate()
        }

        if (this.currentFrame == this.awaitFrames) {
            this.moveFallingObject(1, 0)
            if (this.isFallingLanded()) {
                this.checkUpperLimit()
                this.falling = null
            }
            this.currentFrame = 0
        } else {
            this.currentFrame++
        }
    }

    eraseRow(row) {
        for (let x = 0; x < this.fieldSize.x; x++)
            this.gameField[row][x] = 0
    }

    moveRowsDownFrom(row) {
        for (let y = row; y > 0; y--) {
            for (let x = 0; x < this.fieldSize.x; x++) {
                if (this.gameField[y - 1][x] !== 0) {
                    this.gameField[y][x] = this.gameField[y - 1][x]
                    this.gameField[y - 1][x] = 0
                }
            }
        }
    }

    drawUI() {
        this.drawer.clear()
        this.drawObjects()
        this.drawField()

        this.predictDrawer.clear()
        this.drawNextShape()

        this.scoreHandler.showScore()
    }

    drawField() {
        for (let y = 0; y < this.fieldSize.y; y++)
            for (let x = 0; x < this.fieldSize.y; x++)
                this.drawer.strokedRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize, "#000")
    }
    drawObjects() {
        for (let y = 0; y < this.fieldSize.y; y++)
            for (let x = 0; x < this.fieldSize.y; x++)
                if (this.gameField[y][x] !== 0)
                    this.drawer.filledRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize, this.colors[this.gameField[y][x] - 1])
    }

    moveFallingObject(y = 1, x = 0) {
        this.falling.move(y, x)
        this.setFallingInField()
        this.setFallingInField(false)
    }

    setFallingInField(remove = true, current = false) {
        this.chooseFallingObjectShape(!remove || current).forEach((cell, i, arr) => {
            if (this._isCellInField(cell))
                this.gameField[cell[0]][cell[1]] = remove ? 0 : this.falling.colorId
        })
    }

    chooseFallingObjectShape(current = true) {
        return current ? this.falling.shape : this.falling.tempShape
    }

    isFallingLanded() {
        if (this.falling.y + 1 == this.fieldSize.y) return true
        let isLanded = false
        this.falling.shape.forEach(
            (cell, i) => {
                if (this._isCellInField([cell[0] + 1]) && this.gameField[cell[0] + 1][cell[1]] > 0 && !this.falling.checkSelfCollision(cell[0] + 1, cell[1])) isLanded = true
            })
        return isLanded
    }

    _isCellInField(cell) { return cell[0] >= 0 && cell[0] < this.fieldSize.y }

    gameOver() {
        this.drawer.gameOver()
    }

    checkUpperLimit() {
        if (this.falling.upperCorner <= 0) this._isGameOver = true
    }

    setFont(font) {
        this.drawer.setFont(font)
    }

    _generateField() {
        let field = []
        for (let y = 0; y < this.fieldSize.y; y++) {
            field.push([])
            for (let x = 0; x < this.fieldSize.x; x++) {
                field[y].push(0)
            }
        }
        return field
    }
    _pickNextShape() {
        return Math.floor(Math.random() * Object.keys(SHAPES).length) + ''
    }

    drawNextShape() {
        let middle = this.predictFieldSize / 2
        SHAPES[this.nextShape][0].forEach(cell => {
            this.predictDrawer.filledRect(
                middle - this.predictDrawerCell + cell[1] * this.predictDrawerCell, middle + cell[0] * this.predictDrawerCell,
                this.predictDrawerCell, this.predictDrawerCell,
                "#000000"
            )
        })
    }

    _onRestartClicked() {
        if (this.loopId !== null) {
                clearInterval(this.loopId)
                this.loopId = null
            }
            this.init()
    }
}