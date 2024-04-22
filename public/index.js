function selectLevel() {
  const levelButtons = document.querySelectorAll('.level-btn')
  levelButtons.forEach(button => {
    if (button.classList.contains('hidden')) {
      button.classList.remove('hidden')
    }
  })
}

function disableBtns(element) {
  const btns = document.querySelectorAll(element)
  btns.forEach(btn => {
    btn.disabled = true
  })
}

function getPage(href) {
  disableBtns('.btn')
  disableBtns('.modal-btn')
  window.location.href = href
}

function start(level) {
  disableBtns('.btn')
  window.location.href = `/game?level=${level}`
}

function postRanking() {
  const form = document.querySelector('#post-ranking')
  disableBtns('.modal-btn')
  form.submit()
}
