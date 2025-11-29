export class InputHandler {
    constructor() {
        this.input = ''

        this.eventListener = document.addEventListener("keypress", (e) => {
            this.input = e.code
        })

        // document.addEventListener("dblclick", e => {
        //     e.preventDefault()
        // })
        // document.addEventListener("click", e => {
        //     e.preventDefault()
        // })
        document.addEventListener("touchstart", e => {
            e.preventDefault()
        },{passive: false})
        // document.addEventListener("touchend", e => {
        //     e.preventDefault()
        // },{passive: false})

        this.leftButton = document.getElementById("left")
        this.rightButton = document.getElementById("right")
        this.rotateButton = document.getElementById("rotate")
        this.restartBtn = document.getElementById("restartBtn")

        this.leftButton.addEventListener("click", () => this.input = "KeyA")
        this.leftButton.addEventListener("touchstart", () => this.input = "KeyA")

        this.rightButton.addEventListener("click", () => this.input = "KeyD")
        this.rightButton.addEventListener("touchstart", () => this.input = "KeyD")

        this.rotateButton.addEventListener("click", () => this.input = "KeyR")
        this.rotateButton.addEventListener("touchstart", () => this.input = "KeyR")

        this.restartBtn.addEventListener("click", () => this.input = "restart")
        this.restartBtn.addEventListener("touchstart", () => this.input = "restart")
    }
    reset() {
        this.input = ''
    }
}