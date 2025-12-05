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
            btn.classList.add("activated_btn")
        })
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = key
            if (isContinuous) this._continuousEvent = key
            btn.classList.add("activated_btn")
        },{passive: false})
        
        
            btn.addEventListener("mouseup", () => {
                if (isContinuous) this._continuousEvent = ""
                btn.classList.remove("activated_btn")
            })
            btn.addEventListener("touchend", (e) => {
                e.preventDefault()
                e.stopPropagation()
                this._continuousEvent = ""
                btn.classList.remove("activated_btn")
            },{passive: false})
        
    }
}