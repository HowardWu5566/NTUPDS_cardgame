const levelSettings = {
  easy: {
    enableTimeSys: false,
    // pairTimeLimit: 0,
    enableAccuracySys: false,
    addScore: () => (scoring.score += 10),
    deductScore: () => (scoring.score = Math.max(scoring.score - 1, 0))
  },
  medium: {
    enableTimeSys: false,
    // pairTimeLimit: 0,
    enableAccuracySys: false,
    addScore: () => (scoring.score += 30),
    deductScore: () => (scoring.score = Math.max(scoring.score - 3, 0))
  },
  hard: {
    enableTimeSys: true,
    pairTimeLimit: 30000, // 30s
    enableAccuracySys: true,
    addScore: () => {
      const timeFactor = Math.max(20, 100 - timeSys.pairElapsed / 100)
      const accuracyFactor = Math.max(
        1,
        (totalPair - scoring.matchPair - scoring.flipTime) * 0.25 + 1
      )
      scoring.score += Math.floor(timeFactor * accuracyFactor)
    },
    deductScore: () => {}
  }
}

const timeSys = {
  pairStarting: undefined,
  pairEnding: undefined,
  pairElapsed: 0,
  gameElapsed: 0,
  startTimer: function () {
    if (levelSettings[level]['enableTimeSys']) {
      this.pairStarting = Date.now()
    }
  },
  stopTimer: function () {
    if (levelSettings[level]['enableTimeSys']) {
      this.pairEnding = Date.now()
      this.pairElapsed = this.pairEnding - this.pairStarting
      this.gameElapsed += this.pairElapsed
      if (this.pairElapsed > levelSettings[level]['pairTimeLimit']) {
        showGameoverModal('pairTimesUp')
      }
    }
  }
}

const accuracySys = {
  accuracyFactor: 0,
  checkMatch: function () {
    if (
      levelSettings[level]['enableAccuracySys'] &&
      !revealedCards[0].parentNode.classList.contains('shown') &&
      !revealedCards[1].parentNode.classList.contains('shown')
    ) {
      this.accuracyFactor += Math.max(
        totalPair - scoring.matchPair - scoring.flipTime,
        0
      )
    }
  },
  markShownCards: function () {
    if (levelSettings[level]['enableAccuracySys']) {
      revealedCards[0].parentNode.classList.add('shown')
      revealedCards[1].parentNode.classList.add('shown')
    }
  },
  checkIfAbnormal: function () {
    if (levelSettings[level]['enableAccuracySys']) {
      const standard = (totalPair * (totalPair + 1)) / 6
      return this.accuracyFactor > standard
    }
  }
}
