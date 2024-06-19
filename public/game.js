const level = new URLSearchParams(window.location.search).get('level')
const revealedCards = []
const totalPair = Number(document.querySelector('.puppet-num').textContent)
const scoring = {
  score: 0,
  matchPair: 0,
  flipTime: 0,
  update: function () {
    document.querySelector('#score').textContent = `Score: ${this.score}`
  }
}

function start() {
  document.querySelectorAll('.card-back').forEach(card => {
    card.addEventListener('click', () => {
      flipCard(card)
    })
  })

  timeSys.startTimer()
}

function flipCard(card) {
  if (!card.classList.contains('card-back')) return
  if (card.parentNode.classList.contains('flipped')) return

  card.parentNode.classList.add('flipped')
  revealedCards.push(card.nextElementSibling)

  if (revealedCards.length % 2 === 0) {
    setTimeout(compareTwoCards, 1000)
  }
}

function compareTwoCards() {
  const isMatch = checkIfMatch()

  scoring.flipTime++

  if (isMatch) {
    scoring.matchPair++

    revealedCards[0].classList.add('lock')
    revealedCards[1].classList.add('lock')

    timeSys.stopTimer()
    levelSettings[level].addScore()

    accuracySys.checkMatch()
    checkIfGameOver()
  } else {
    revealedCards[0].parentNode.classList.remove('flipped')
    revealedCards[1].parentNode.classList.remove('flipped')

    levelSettings[level].deductScore()

    accuracySys.markShownCards()
  }

  scoring.update()
  revealedCards.splice(0, 2)
}

function checkIfMatch() {
  const devisor = getDevisor()

  return (
    revealedCards[0].dataset.randnum % devisor ===
    revealedCards[1].dataset.randnum % devisor
  )
}

function getDevisor() {
  const primeArr = [
    // length = 25, length should larger than total puppetnum - 11
    101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
    179, 181, 191, 193, 197, 199, 211, 223, 227, 229
  ]
  let minId = Infinity
  document.querySelectorAll('.card-front').forEach(card => {
    if (Number(card.dataset.randnum) < minId) {
      minId = Number(card.dataset.randnum)
    }
  })
  return primeArr[minId]
}

function checkIfGameOver() {
  const isGameOver = scoring.matchPair === totalPair

  if (isGameOver) {
    showLoadingMsg()
    accuracySys.checkIfAbnormal()
      ? showGameoverModal('tooAccurate')
      : showGameoverModal('matchAll')
  } else {
    timeSys.startTimer()
    scoring.flipTime = 0
  }
}

async function showGameoverModal(result) {
  const gameoverModal = document.querySelector('#gameover-modal')
  const gameoverModalContent = document.querySelector('#gameover-modal-content')

  if (result === 'matchAll') {
    const threshold = await getThreshold()
    let isGameTimesUp
    if (levelSettings[level]['enableTimeSys']) {
      isGameTimesUp =
        threshold === 'GameTimesUp' ||
        threshold.gameElapsedTime > timeSys.gameElapsedTime * 2
    }

    const isMaster = scoring.score > threshold.score
    if (isGameTimesUp) {
      gameoverModalContent.innerHTML = `
        <p>挑戰失敗</p>
        <p>疲態盡顯，應當養精蓄銳！</p>
        <div>
          <button class="modal-btn" onclick="getPage('/game?level=${level}')">再次挑戰</button>
          <button class="modal-btn" onclick="getPage('/')">返回</button>
        </div>
        `
    } else if (isMaster) {
      gameoverModalContent.innerHTML = `
        <p>挑戰成功，獲得${scoring.score}分</p>
        <p>恭喜榮登英雄榜</p>
        <form action="/ranking" method="POST" id="post-ranking" class="flex-container">
          <input type="text" placeholder="英雄，請留名" value="" class="input-name" name="name" maxlength="10">
          <span id="name-error"></span>
          <input type="text" value="${scoring.score}" name="score" class="input-score invisible">
          <button type="submit" class="modal-btn" onclick="postRanking(event)">確定</button>
        </form>
        `
    } else {
      gameoverModalContent.innerHTML = `
        <p>挑戰成功，獲得${scoring.score}分</p>
        <div>
          <button class="modal-btn" onclick="getPage('/game?level=${level}')">再次挑戰</button>
          <button class="modal-btn" onclick="getPage('/')">返回</button>
        </div>
        `
    }
  } else if (result === 'pairTimesUp') {
    gameoverModalContent.innerHTML = `
      <p>挑戰失敗</p>
      <p>拳腳無眼，切莫東張西望！</p>
      <div>
        <button class="modal-btn" onclick="getPage('/game?level=${level}')">再次挑戰</button>
        <button class="modal-btn" onclick="getPage('/')">返回</button>
      </div>
      `
  } else if (result === 'tooAccurate') {
    gameoverModalContent.innerHTML = `
      <p>挑戰失敗</p>
      <p>鴻運當頭，卻遭小人陷害</p>
      <div>
        <button class="modal-btn" onclick="getPage('/game?level=${level}')">再次挑戰</button>
        <button class="modal-btn" onclick="getPage('/')">返回</button>
      </div>
      `
  }

  rmLoadingMsg()
  gameoverModal.style.display = 'block'
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

function checkName() {
  const bannedNames = ['虛位以待']
  const name = document.querySelector('.input-name').value.trim()

  if (name.length > 10) {
    return '名號太冗長'
  } else if (bannedNames.includes(name)) {
    return '請更換名號'
  }
}

function postRanking(event) {
  const form = document.querySelector('#post-ranking')
  const errMsg = document.querySelector('#name-error')
  const message = checkName()
  event.preventDefault()

  if (message) {
    errMsg.textContent = message
    errMsg.style.visibility = 'visible'
    return
  }

  showLoadingMsg()
  form.submit()
}

start()
