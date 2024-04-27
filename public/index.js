function selectLevel() {
  const levelButtons = document.querySelectorAll('.level-btn')
  levelButtons.forEach(button => {
    if (button.classList.contains('hidden')) {
      button.classList.remove('hidden')
    }
  })
}

function showSocialMedias() {
  const socialMediaBtns = document.querySelectorAll('.socialmedia')
  socialMediaBtns.forEach(button => {
    button.classList.toggle('hidden')
  })
}

function load() {
  disableBtns('.btn')
  disableBtns('.modal-btn')

  const body = document.querySelector('body')
  const loadingMsg = document.querySelector('#loading-msg')
  body.classList.add('loading')
  loadingMsg.style.display = 'block'
}

function disableBtns(element) {
  const btns = document.querySelectorAll(element)
  btns.forEach(btn => {
    btn.disabled = true
  })
}

function enableBtns(element) {
  const btns = document.querySelectorAll(element)
  btns.forEach(btn => {
    btn.disabled = false
  })
}

function getPage(href) {
  load()
  window.location.href = href
}

function start(level) {
  load()
  window.location.href = `/game?level=${level}`
}

function postRanking() {
  load()

  const form = document.querySelector('#post-ranking')
  form.submit()
}

window.addEventListener('unload', function () {
  const body = document.querySelector('body')
  const loadingMsg = document.querySelector('#loading-msg')
  body.classList.remove('loading')
  loadingMsg.style.display = 'none'
  enableBtns('.btn')
  enableBtns('.modal-btn')
})
