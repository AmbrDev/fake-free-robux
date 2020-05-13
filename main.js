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
 * funny typing
 *
 * @param {string} string
 * @param {number} timeout
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

const robux = +query.get('robux')
const username = query.get('username')
// eslint-disable-next-line no-extend-native
Promise.prototype.wait = function () {
  return this.then(()=> new Promise(resolve=>setTimeout(resolve, devmode ? 20 : 1000))) // delay
}

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
  .wait()
  .then(()=>slowPrint(`User ${username} found.`))
  .wait()
  .then(()=>slowPrint('Connecting to Roblox servers...'))
  .wait()
  .then(()=>slowPrint(`Generating ${robux} Robux...`))
  .wait()
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
    dialog.classList.add('dia')
    dialog.innerHTML = `
        <div>To verify that you are a human, <br><a onclick="location = './trolled.html'" href="https://theannoyingsite.com">go to this site</a> and click the cat.</div>`
    document.body.appendChild(dialog)
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
