// 禁用右鍵
document.addEventListener('contextmenu', function (e) {
  e.preventDefault()
})

document.addEventListener('keydown', function (e) {
  const isBannedKeyUsed =
    // 開啟 devtools
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
    (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i')) ||
    // 列印
    (e.ctrlKey && (e.key === 'P' || e.key === 'p')) ||
    (e.metaKey && (e.key === 'P' || e.key === 'p')) ||
    // 原始碼
    (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
    (e.metaKey && e.altKey && (e.key === 'U' || e.key === 'u')) ||
    // firefox console
    (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.key === 'k')) ||
    (e.metaKey && e.altKey && (e.key === 'K' || e.key === 'k'))

  if (isBannedKeyUsed) {
    e.preventDefault()
  }
})

// infinite debugger
;(function () {
  setInterval(function () {
    ;(function () {})['constructor']('debugger')()
    console.log('Debugger was triggered')
  }, 2000)
})()
