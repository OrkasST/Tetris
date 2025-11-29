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
        })
        document.addEventListener("touchend", e => {
            e.preventDefault()
        })

        this.leftButton = document.getElementById("left")
        this.rightButton = document.getElementById("right")
        this.rotateButton = document.getElementById("rotate")

        this.leftButton.addEventListener("click", () => this.input = "KeyA")
        this.rightButton.addEventListener("click", () => this.input = "KeyD")
        this.rotateButton.addEventListener("click", () => this.input = "KeyR")
    }
    reset() {
        this.input = ''
    }
}