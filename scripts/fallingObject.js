export class FallingObject {
    constructor(shape, colorId, x) {
        this.colorId = colorId
        this.y = -1
        this.x = x
        
        this._rotations = shape.map(rotation => [ ...rotation.map(cell => [...cell]) ])
        this._rotation = 0

        this._initialShape = shape[0].map(cell => [cell[0], cell[1]])
        this.shape = this._initialShape.map(cell => [cell[0]+this.y, cell[1]+this.x])

        this._findCorners()

        this._tempShape = [...this.shape]
    }

    _findCorners() {
        this._leftCorner = this.findCorner(0)
        this._rightCorner = this.findCorner(1)
        this._upperCorner = this.findCorner(2)
        this._lowerCorner = this.findCorner(3)
    }

    move(y,x) {
        this._tempShape = this.shape.map(cell => [...cell])

        this._setValues(y,x)

        for (let cell = 0; cell < this.shape.length; cell++) {
            this.shape[cell][0] += y
            this.shape[cell][1] += x
        }
    }

    checkSelfCollision(y,x) {
        for (let cell = 0; cell < this.shape.length; cell++) {
            if (this.shape[cell][0] == y && this.shape[cell][1] == x)
                return true
        }
        return false
    }

    findCorner(cornerId) {
        let corner = this.shape[0][cornerId < 2 ? 1 : 0]
        for (let cell =1; cell < this.shape.length; cell++) {
            if (cornerId == 0 && this.shape[cell][1] < corner) corner = this.shape[cell][1]
            else if (cornerId == 1 && this.shape[cell][1] > corner) corner = this.shape[cell][1]
            else if (cornerId == 2 && this.shape[cell][0] < corner) corner = this.shape[cell][0]
            else if (cornerId == 3 && this.shape[cell][0] > corner) corner = this.shape[cell][0]
        }
        return corner
    }

    _setValues(y,x) {
        this.y += y
        this._upperCorner += y

        this.x += x
        this._leftCorner += x
        this._rightCorner += x
    }

    rotate() {
        this._rotation++
        if (this._rotation == this._rotations.length) this._rotation = 0

        this.shape = this._rotations[this._rotation].map(cell => [cell[0]+this.y, cell[1]+this.x])
        this._findCorners()
    }

    get tempShape() { return this._tempShape }
    get upperCorner() { return this._upperCorner }
    get leftCorner() { return this._leftCorner }
    get rightCorner() { return this._rightCorner }
}