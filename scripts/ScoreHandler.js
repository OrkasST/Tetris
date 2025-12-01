export class ScoreHandler {
    constructor() {
        this._score = 0
        this._highScore = 0

        let memory = localStorage.getItem("tetris_highscore")
        if (memory) this._highScore = Number(memory)

        console.log('_highScore: ', typeof(this._highScore))

        this._scoreDisplay = document.getElementById("score")
        this._highScoreDisplay = document.getElementById("highScore")
    }

    updateScore(scoreModifier) {
        this._score += scoreModifier
        if (this._highScore < this._score) this._highScore = this._score
        
        localStorage.clear();
        localStorage.setItem("tetris_highscore", this._highScore);
    }

    showScore() {
        this._scoreDisplay.innerText = this._score
        this._highScoreDisplay.innerText = this._highScore
    }

    resetScore() {
        this._score = 0
    }
}