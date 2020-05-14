/* eslint-env browser */
/* global Promise */
const query = new URLSearchParams(location.search)
let devmode = false
if (location.hostname === 'localhost') {
  const indicator = document.createElement('button')
  indicator.innerText = '⏩'
  indicator.classList.add('ff')
  indicator.addEventListener('click', ()=>{
    devmode = !devmode
    indicator.classList.toggle('on')
  })
  document.body.appendChild(indicator)
}
if (!(query.get('robux') && query.get('username'))) {
  location = './'
}

/**
 * Simuate typing in a terminal
 *
 * @param {string} string
 * @returns {Promise<void>} A Promise that resolves when the string is completely typed
 */
function slowPrint (string) {
  return new Promise((resolve) => {
    const line = document.createElement('pre')
    document.body.appendChild(line)
    const stringarr = string.split('')
    function print () {
      line.innerText += stringarr.shift()
      if (stringarr[0]) {
        setTimeout(print, devmode ? 1 : 50)
      } else {
        resolve()
      }
    }
    print()
  })
}

/**
 * Slow print strings in order.
 * @param {string[]} arr
 * @returns {Promise<void>} A Promise that resolves when all strings are done typing
 */
function slowPrintArr (arr) {
  return arr
    .map(str=>slowPrint.bind(null, str))
    .reduce((cur, next)=>cur.then(()=> new Promise(resolve=>setTimeout(resolve, devmode ? 20 : 1000))).then(next), Promise.resolve())
}
const robux = +query.get('robux')
const username = query.get('username')
// eslint-disable-next-line no-extend-native
Promise.prototype.wait = function () {
  return this.then(()=> new Promise(resolve=>setTimeout(resolve, devmode ? 20 : 1000))) // delay
}

// why is this like this
slowPrint(`Checking if user ${username} is on Roblox...`)
  .then(()=>new Promise((resolve, reject)=>{
    const avatar = document.createElement('img')
    avatar.src = 'https://roblox.com/Thumbs/Avatar.ashx?x=420&y=420&username=' + query.get('username')
    avatar.addEventListener('error', ()=>{
      avatar.remove()
      reject('404')
    })
    document.body.appendChild(avatar)
    avatar.addEventListener('load', resolve)
  }))
  .then(()=>slowPrintArr([`User ${username} found.`, 'Connecting to Roblox servers...', `Generating ${robux} Robux...`]))
  .then(()=>new Promise(resolve=>{
    const count = document.createElement('pre')
    count.classList.add('per')
    document.body.appendChild(count)
    count.innerText = '0'
    function addRobux () {
      if (+count.innerText < 50) {
        count.innerText -= - 1
        setTimeout(addRobux, devmode ? 1 : 50)
      } else {
        resolve()
      }
    }
    addRobux()
  }))
  .then(()=>slowPrint('Wait a minute— we need you to verify you aren\'t a bot.'))
  .wait()
  .then(()=>{
    const dialog = document.createElement('div')
    dialog.style.color = 'white'
    document.body.style.filter = 'blur(50px)'
    dialog.classList.add('dia')
    dialog.innerHTML = `
        <div>To verify that you are a human, <br><a onclick="location = './trolled.html'" href="https://theannoyingsite.com">go to this site</a> and click the cat.</div>`
    document.documentElement.appendChild(dialog)
    window.addEventListener('contextmenu', event=>{
      event.preventDefault()
      dialog.animate([
        {left: '0'},
        {left: '-10%', transform: 'rotate(-0.0625turn)'},
        {left: '10%', transform: 'rotate(0.0625turn)'},
        {left: '0'}],
      {duration: 1000, easing: 'ease'}
      )
    })
  })
  .catch(reason=>{
    if (reason === '404') {
      slowPrint(`${username} is not on Roblox. Redirecting you to the form...`)
        .wait()
        .then(()=>{
          location = './'
        })
    }
  })

var input = ''
const key = '38384040373937396665'
document.addEventListener('keydown', function (e) {
  input += '' + e.keyCode
  if (input === key) {
    slowPrint('up up down down left right left right b a')
  }
  if (!key.indexOf(input)) {
    return
  }
  input = '' + e.keyCode
})
