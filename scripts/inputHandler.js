import { inputMap } from "./inputMap.js"

export class InputHandler {
    constructor() {
        this.input = ''

        this.eventListener = document.addEventListener("keypress", (e) => {
            this.input = e.code
        })
        document.addEventListener("touchstart", e => {
            e.preventDefault()
        },{passive: false})

        this.leftButton = document.getElementById("left")
        this.rightButton = document.getElementById("right")
        this.rotateButton = document.getElementById("rotate")
        this.boostBtn = document.getElementById("boost")
        this.restartBtn = document.getElementById("restartBtn")

        this._addBtnEvents()

        this._continuousEvent = ''
        
        // this.addClickEvents()
        // this.addTouchEvents()
    }
    reset() {
        this.input = this._continuousEvent
    }

    _addBtnEvents() {
        this._addBtnEvent(this.leftButton, inputMap.LEFT)
        this._addBtnEvent(this.rightButton, inputMap.RIGHT)
        this._addBtnEvent(this.rotateButton, inputMap.ROTATE)
        this._addBtnEvent(this.boostBtn, inputMap.BOOST, true)
        this._addBtnEvent(this.restartBtn, inputMap.RESTART)
    }
    
    _addBtnEvent(btn, key, isContinuous) {
        btn.addEventListener("mousedown", () => {
            this.input = key
            if (isContinuous) this._continuousEvent = key
        })
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = key
            if (isContinuous) this._continuousEvent = key
        },{passive: false})
        
        if (isContinuous) {
            btn.addEventListener("mouseup", () => this._continuousEvent = "" )
            btn.addEventListener("touchend", (e) => {
                e.preventDefault()
                e.stopPropagation()
                this._continuousEvent = ""
                console.log('this._continuousEvent: ', this._continuousEvent);
            },{passive: false})
        }
    }

    addClickEvents() {
        this.leftButton.addEventListener("click", () => this.input = inputMap.LEFT)
        this.rightButton.addEventListener("click", () => this.input = inputMap.RIGHT)
        this.rotateButton.addEventListener("click", () => this.input = inputMap.ROTATE)
        this.boostBtn.addEventListener("click", () => this.input = inputMap.BOOST)

        this.restartBtn.addEventListener("click", () => this.input = inputMap.RESTART)
    }
    addTouchEvents() {
        this.leftButton.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = inputMap.LEFT
        },{passive: false})

        this.rightButton.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = inputMap.RIGHT
        },{passive: false})

        this.rotateButton.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = inputMap.ROTATE
        },{passive: false})

        this.boostBtn.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = inputMap.BOOST
        },{passive: false})

        this.restartBtn.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = inputMap.RESTART
        },{passive: false})
    }
}