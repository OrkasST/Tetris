import { logField } from "./logField.js"

export class GameField {
    constructor(height, width, cellSize) {
        this._width = width
        this._height = height
        this._cellSize = cellSize

        this._canvasWidth = this._width * this._cellSize
        this._canvasHeigth = this._height * this._cellSize

        this._centralXPoint = Math.floor((this._width - 1) / 2)

        this._field = null

        this._isStartAnimationInProcess = false
        this._startAnimationY = 0
        this._startAnimationX = 0
    }

    get width() { return this._width }
    get height() { return this._height }
    get cellSize() { return this._cellSize }
    get canvasWidth() { return this._canvasWidth } 
    get canvasHeigth() { return this._canvasHeigth }
    get centralXPoint() { return this._centralXPoint }
    get field() { return this._field }

    generateField() {
        this._field = []
        for (let y = 0; y < this._height; y++) {
            this._field.push([])
            for (let x = 0; x < this._width; x++) {
                this._field[y].push(0)
            }
        }
    }

    eraseRow(row) {
        for (let x = 0; x < this._width; x++)
            this._field[row][x] = 0
        this.moveRowsDownFrom(row)
    }

    moveRowsDownFrom(row) {
        for (let y = row; y > 0; y--) {
            for (let x = 0; x < this._width; x++) {
                if (this._field[y - 1][x] !== 0) {
                    this._field[y][x] = this._field[y - 1][x]
                    this._field[y - 1][x] = 0
                }
            }
        }
    }

    playStartAnimation(isSkipped) {
        if (isSkipped) return false

        if (!this._isStartAnimationInProcess) this._beginStartAnimation()
        this._field[this._startAnimationY][this._startAnimationX] = 1
        this._field[this._startAnimationY][this._startAnimationX+1] = 1
        this._updateAnimationPosition()
        if (this._isAnimationComplete()) this._endStartAnimation()
        return this._isStartAnimationInProcess
    }

    _beginStartAnimation() {
        this._isStartAnimationInProcess = true
    }

    _updateAnimationPosition() {
        this._startAnimationX += 2
        if (this._startAnimationX >= this._width) {
            this._startAnimationX = 0
            this._startAnimationY += 1
        }
    }

    _isAnimationComplete() {
        return this._startAnimationY == this._height && this._startAnimationX == 0
    }

    _endStartAnimation() {
        this._startAnimationY = 0
        this._startAnimationX = 0

        this._clearField()
        this._isStartAnimationInProcess = false
    }

    _clearField() {
        for (let y = 0; y < this._height; y++)
            for (let x = 0; x < this._width; x++)
                this._field[y][x] = 0
    }

}