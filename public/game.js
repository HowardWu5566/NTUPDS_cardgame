const level = new URLSearchParams(window.location.search).get('level')
const revealedCards = []
let matchPair = 0
const scoring = {
  score: 0,
  // 難度 hard 根據用時計分
  startTime: undefined,
  endTime: undefined,
  elapsedTime: 0,
  hasFlipped: false,

  startTimer: function () {
    this.startTime = Date.now()
    this.hasFlipped = this.hasFlipped ? this.hasFlipped : true
  },

  stopTimer: function () {
    this.endTime = Date.now()
    this.elapsedTime = this.endTime - this.startTime
  },

  updateScore: function (isMatch) {
    switch (level) {
      case 'easy':
        this.score += isMatch ? 10 : -1
        break
      case 'medium':
        this.score += isMatch ? 30 : -3
        break
      case 'hard': // 20 ~ 100 分
        this.score += isMatch
          ? Math.floor(Math.max(20, 100 - this.elapsedTime / 100))
          : 0
        break
      default:
        break
    }
    if (this.score < 0) {
      this.score = 0
    }

    document.querySelector('#score').textContent = `Score: ${this.score}`
  }
}

function flipCard(card) {
  if (!card.classList.contains('card-back')) return

  card.parentNode.classList.add('flipped')
  revealedCards.push(card.nextElementSibling)

  if (level === 'hard' && !scoring.hasFlipped) {
    scoring.startTimer()
  }

  if (revealedCards.length % 2 === 0) {
    setTimeout(checkIfMatch, 1000)
  }
}

function checkIfMatch() {
  const isMatch = revealedCards[0].dataset.id === revealedCards[1].dataset.id

  if (isMatch) {
    revealedCards[0].classList.add('lock')
    revealedCards[1].classList.add('lock')

    if (level === 'hard') {
      scoring.stopTimer()
    }

    matchPair++
  } else {
    revealedCards[0].parentNode.classList.remove('flipped')
    revealedCards[1].parentNode.classList.remove('flipped')
  }

  scoring.updateScore(isMatch)

  revealedCards.shift()
  revealedCards.shift()

  checkIfGameOver()
}

function checkIfGameOver() {
  const puppetNum = document.querySelector('.puppet-num').textContent
  const isGameOver = matchPair === Number(puppetNum)

  if (isGameOver) {
    showGameoverModal()
  } else if (level === 'hard') {
    scoring.startTimer()
  }
}

async function showGameoverModal() {
  const gameoverModal = document.querySelector('#gameover-modal')
  const gameoverModalContent = document.querySelector('#gameover-modal-content')

  const threshold = await getThreshold()
  const isMaster = scoring.score > threshold

  if (isMaster) {
    gameoverModalContent.innerHTML = `
      <p>挑戰成功，獲得${scoring.score}分</p>
      <p>恭喜榮登英雄榜</p>
      <form action="/ranking" method="POST" id="post-ranking" class="flex-container">
        <input type="text" placeholder="英雄，請留名" value="" class="input-name" name="name" maxlength="10">
        <span id="name-error">名號太冗長</span>
        <input type="text" value="${scoring.score}" name="score" class="input-score invisible">
        <button type="submit" class="modal-btn" onclick="postRanking()">　確定　</button>
      </form>
      `
  } else {
    gameoverModalContent.innerHTML = `
    <p>挑戰成功，獲得${scoring.score}分</p>
    <div>
      <button class="modal-btn" onclick="getPage('/game?level=${level}')">再次挑戰</button>
      <button class="modal-btn" onclick="getPage('/')">　返回　</button>
    </div>
    `
  }

  gameoverModal.style.display = 'block'
  showNameErrMsg()
}

function getThreshold() {
  return fetch('/threshold')
    .then(res => {
      return res.json()
    })
    .catch(err => {
      console.error(err)
    })
}

function showNameErrMsg() {
  const inputName = document.querySelector('.input-name')
  const errMsg = document.querySelector('#name-error')

  inputName.addEventListener('keydown', function () {
    if (this.value.length >= 10) {
      errMsg.style.visibility = 'visible'
    } else {
      errMsg.style.visibility = 'hidden'
    }
  })
}

document.querySelectorAll('.card-inner').forEach(card => {
  card.addEventListener('click', () => {
    flipCard(card)
  })
})
