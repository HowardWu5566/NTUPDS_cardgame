const revealedCards = []
let matchPair = 0

function flipCard(card) {
  if (!card.classList.contains('card-back')) return
  card.parentNode.classList.add('flipped')

  revealedCards.push(card.nextElementSibling)

  if (revealedCards.length % 2 === 0) {
    setTimeout(checkIfMatch, 1000)
  }
}

function checkIfMatch() {
  const isMatch = revealedCards[0].dataset.id === revealedCards[1].dataset.id

  if (isMatch) {
    revealedCards[0].classList.add('lock')
    revealedCards[1].classList.add('lock')

    matchPair++

    checkIfGameOver()
  } else {
    revealedCards[0].parentNode.classList.remove('flipped')
    revealedCards[1].parentNode.classList.remove('flipped')
  }

  revealedCards.shift()
  revealedCards.shift()
}

function checkIfGameOver() {
  const puppetNum = document.querySelector('.puppet-num').textContent
  const isGameOver = matchPair === Number(puppetNum)

  if (isGameOver) {
    console.log('Game Over')
    //TODO: add modal when game is over
  }
}

//TODO: scoring rule
//TODO: ranking

document.querySelectorAll('.card-inner').forEach(card => {
  card.addEventListener('click', () => {
    flipCard(card)
  })
})
