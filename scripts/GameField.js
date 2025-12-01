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

}