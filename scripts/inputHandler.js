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
        this.restartBtn = document.getElementById("restartBtn")
        
        this.addClickEvents()
        this.addTouchEvents()
    }
    reset() {
        this.input = ''
    }

    addClickEvents() {
        this.leftButton.addEventListener("click", () => this.input = inputMap.LEFT)
        this.rightButton.addEventListener("click", () => this.input = inputMap.RIGHT)
        this.rotateButton.addEventListener("click", () => this.input = inputMap.ROTATE)
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

        this.restartBtn.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = inputMap.RESTART
        },{passive: false})
    }
}