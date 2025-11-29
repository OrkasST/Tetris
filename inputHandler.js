export class InputHandler {
    constructor() {
        this.input = ''

        this.eventListener = document.addEventListener("keypress", (e) => {
            this.input = e.code
        })
    }
    reset() {
        this.input = ''
    }
}