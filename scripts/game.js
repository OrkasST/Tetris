import { Drawer } from "./drawer.js"
import { FallingObject } from "./fallingObject.js"
import { GameField } from "./GameField.js"
import { InputHandler } from "./inputHandler.js"
import { inputMap } from "./inputMap.js"
import { ScoreHandler } from "./ScoreHandler.js"
import { SHAPES } from "./shapes.js"

document.addEventListener("DOMContentLoaded", () => {
    // let f = new FontFace("Limelight", 'url("https://fonts.googleapis.com/css2?family=Limelight&display=swap")')
    const tetris = new Game(document.getElementById("screen"), ["TimesNewRoman"])
    tetris.init()
})

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
            this.falling = new FallingObject(SHAPES[this.nextShape], 1, this._gameField.centralXPoint)
            this.nextShape = this._pickNextShape()

            for (let y = 0; y < this._gameField.height; y++)
                if (this._gameField.field[y].every(cell => cell !== 0)) {
                    this.scoreHandler.updateScore(1)
                    this._gameField.eraseRow(y)
                }
        }
        let x = this._calculateX(this.inputHandler.input)

        if (x !== 0) this.moveFallingObject(0, x)
        
        if (this.inputHandler.input == inputMap.ROTATE) {
            this.setFallingInField(true, true)
            this.falling.rotate()
        }

        if (this.inputHandler.input == inputMap.BOOST) this.currentFrame += Math.floor(this.awaitFrames/1.7)

        if (this.currentFrame >= this.awaitFrames) {

            if (this.isFallingLanded()) {
                if (this.falling.isLanded) this.falling = null
                this.checkUpperLimit()
                if (this.falling) this.falling.isLanded = true
            } else this.falling.isLanded = false

            if (this.falling && !this.falling.isLanded) this.moveFallingObject(1, 0)

            this.currentFrame = this.falling?.isLanded ? Math.floor(this.awaitFrames/2) : 0
        } else {
            this.currentFrame++
        }
    }

    drawUI() {
        this.drawer.clear()
        this._gameField.draw(this.drawer.filledRect(), this.drawer.strokedRect(), this.colors)

        this.predictDrawer.clear()
        this.drawNextShape()

        this.scoreHandler.showScore()
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
        if (this.falling?.upperCorner <= 0) this._isGameOver = true
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
            this.predictDrawer.filledRect()(
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

    _calculateX(input) {
        return (input == inputMap.LEFT && this.falling.leftCorner > 0 && this._checkFallingSides()[0] == 0) ? -1
            : (input == inputMap.RIGHT && this.falling.rightCorner + 1 < this._gameField.width  && this._checkFallingSides()[1] == 0) ? 1 
            : 0
    }

    _checkFallingSides() {
        if (!this.falling) return [-1,1]

        let left = 0, right = 0
        let temp = 0
        
        for (let i = 0; i < this.falling.shape.length; i++) {
            temp = this._checkCellSides(this.falling.shape[i])
            if (temp < 0) left += temp
            else if (temp > 0) right += temp
        }

        return [left, right]
    }

    _checkCellSides(cell) {
        if (!cell || cell[0] < 0) return 0
        
        if ( this._gameField.field[cell[0]][cell[1]-1] != 0 && !this.falling.checkSelfCollision(cell[0], cell[1]-1) ) return -1
        if ( this._gameField.field[cell[0]][cell[1]+1] != 0 && !this.falling.checkSelfCollision(cell[0], cell[1]+1) ) return 1
        return 0
    }
}