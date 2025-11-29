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
        this.leftButton.addEventListener("click", () => this.input = "KeyA")
        this.rightButton.addEventListener("click", () => this.input = "KeyD")
        this.rotateButton.addEventListener("click", () => this.input = "KeyR")
        this.restartBtn.addEventListener("click", () => this.input = "restart")
    }
    addTouchEvents() {
        this.leftButton.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = "KeyA"
        },{passive: false})

        this.rightButton.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = "KeyD"
        },{passive: false})

        this.rotateButton.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = "KeyR"
        },{passive: false})

        this.restartBtn.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.input = "restart"
        },{passive: false})
    }
}