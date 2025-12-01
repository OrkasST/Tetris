export class ScoreHandler {
    constructor() {
        this._score = 0
        this._highScore = 0

        this._scoreDisplay = document.getElementById("score")
        this._highScoreDisplay = document.getElementById("highScore")
    }

    updateScore(scoreModifier) {
        this._score += scoreModifier
        if (this._highScore < this._score) this._highScore = this._score
    }

    showScore() {
        this._scoreDisplay.innerText = this._score
        this._highScoreDisplay.innerText = this._highScore
    }
}