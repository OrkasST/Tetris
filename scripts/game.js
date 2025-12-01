import { Drawer } from "./drawer.js"
import { FallingObject } from "./FallingObject.js"
import { GameField } from "./GameField.js"
import { InputHandler } from "./InputHandler.js"
import { inputMap } from "./inputMap.js"
import { ScoreHandler } from "./ScoreHandler.js"
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
        this._gameField = new GameField(16, 8, 32)
        
        this.colors = ["#ff0000", "#eae30dff", "#1441beff"]

        this.drawer = new Drawer(canvasElement, this._gameField.canvasWidth, this._gameField.canvasHeigth)
        this.drawer.setFonts(fonts)

        this.predictDrawerCell = this._gameField.cellSize / 3
        this.predictFieldSize = this.predictDrawerCell * this._gameField.width
        this.predictDrawer = new Drawer(document.getElementById("predictscreen"), this.predictFieldSize, this.predictFieldSize)
        this.nextShape = null

        this.inputHandler = new InputHandler()
        this.scoreHandler = new ScoreHandler()

        this.falling = null

        this._isGameOver = false
        this._isGameStarted = false

        this.awaitFrames = 30
        this.currentFrame = 0
    } 

    init() {
        this._gameField.generateField()
        this._gameField.resetAnimationCount()

        this.falling = null
        this._isGameOver = false
        this.scoreHandler.resetScore()

        this.nextShape = this._pickNextShape()
        this.drawUI()
        this._isGameStarted = true
        this.loopId = setInterval(this.loop.bind(this), 1000 / 60)
    }

    loop() {
        if (!this._gameField.playStartAnimation()) this.update()
        
        this.inputHandler.reset()
        this.drawUI()
        if (this._isGameOver) {
            this.gameOver()
        }
    }

    update() {
        if (this.inputHandler.input == "restart") return this._onRestartClicked()
        if (!this._isGameStarted) return
        if (!this.falling) {
            console.log("DFGHJKGFDSDFGKLKVCDVBFGNH");
            this.falling = new FallingObject(SHAPES[this.nextShape], 1, this._gameField.centralXPoint)
            this.nextShape = this._pickNextShape()

            for (let y = 0; y < this._gameField.height; y++)
                if (this._gameField.field[y].every(cell => cell !== 0)) {
                    this.scoreHandler.updateScore(1)
                    this._gameField.eraseRow(y)
                }
        }
        let x = this.inputHandler.input == inputMap.LEFT && this.falling.leftCorner > 0 ? -1 :
            this.inputHandler.input == inputMap.RIGHT && this.falling.rightCorner + 1 < this._gameField.width ? 1 : 0

        if (x !== 0) this.moveFallingObject(0, x)
        
        if (this.inputHandler.input == inputMap.ROTATE) {
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

    drawUI() {
        this.drawer.clear()
        this.drawObjects()
        this.drawField()

        this.predictDrawer.clear()
        this.drawNextShape()

        this.scoreHandler.showScore()
    }

    drawField() {
        for (let y = 0; y < this._gameField.height; y++)
            for (let x = 0; x < this._gameField.width; x++)
                this.drawer.strokedRect(
                    x * this._gameField.cellSize, y * this._gameField.cellSize,
                    this._gameField.cellSize, this._gameField.cellSize,
                    "#000"
                )
    }
    drawObjects() {
        for (let y = 0; y < this._gameField.height; y++)
            for (let x = 0; x < this._gameField.width; x++)
                if (this._gameField.field[y][x] !== 0)
                    this.drawer.filledRect(
                x * this._gameField.cellSize, y * this._gameField.cellSize,
                this._gameField.cellSize, this._gameField.cellSize,
                this.colors[this._gameField.field[y][x] - 1]
            )
    }

    moveFallingObject(y = 1, x = 0) {
        this.falling.move(y, x)

        this.setFallingInField()

        this.setFallingInField(false)
    }

    setFallingInField(remove = true, current = false) {
        this.chooseFallingObjectShape(!remove || current).forEach((cell, i, arr) => {
            if (this._isCellInField(cell))
                this._gameField.field[cell[0]][cell[1]] = remove ? 0 : this.falling.colorId
        })
    }

    chooseFallingObjectShape(current = true) {
        return current ? this.falling.shape : this.falling.tempShape
    }

    isFallingLanded() {
        if (this.falling.y + 1 == this._gameField.height) return true
        let isLanded = false
        this.falling.shape.forEach(
            (cell, i) => {
                if (this._isCellInField([cell[0] + 1]) && this._gameField.field[cell[0] + 1][cell[1]] > 0 && !this.falling.checkSelfCollision(cell[0] + 1, cell[1])) isLanded = true
            })
        return isLanded
    }

    _isCellInField(cell) {
        return cell[0] >= 0 && cell[0] < this._gameField.height
    }

    gameOver() {
        this.drawer.gameOver()

        if (!this._isGameStarted) return
        this.nextShape = null
        this._gameField.resetAnimationCount()
        this._isGameStarted = false
    }

    checkUpperLimit() {
        if (this.falling.upperCorner <= 0) this._isGameOver = true
    }

    setFont(font) {
        this.drawer.setFont(font)
    }

    _pickNextShape() {
        return Math.floor(Math.random() * Object.keys(SHAPES).length) + ''
    }

    drawNextShape() {
        if (!this.nextShape) return
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
        this._isGameOver = false
        if (this.loopId !== null) {
                clearInterval(this.loopId)
                this.loopId = null
            }
            this.init()
    }
}