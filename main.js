// @ts-check
'use strict' // Enable strict mode

// Get the options from the URL.
const query = new URLSearchParams(location.search)
const robux = query.get('robux') || 'an ungodly amount of'
const username = query.get('username') || 'builderman'

/**
 * Is fast forward enabled?
 */
let devmode = false

// Create the fast forward button if the site is hosted on localhost
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

const redirect = () => location.href = './' // Take the user back to the form submission page.

/**
 * Simuate typing.
 * The text will be typed in a pre tag created in the body.
 *
 * @param {string} text The text that will be typed.
 * @returns {Promise<HTMLPreElement>} A Promise that resolves when the string is completely typed
 */
function slowPrint (text) {
  return new Promise((resolve) => {
    const line = document.createElement('pre')
    document.body.appendChild(line)
    const stringarr = text.split('')
    function print () {
      line.innerText += stringarr.shift()
      if (stringarr[0]) {
        setTimeout(print, devmode ? 1 : 50)
      } else {
        resolve(line)
      }
    }
    print()
  })
}

/**
 * Slow print strings in order.
 * @see slowPrint
 * @param {string[]} arr Lines of text
 * @returns {Promise<HTMLPreElement[]>} A Promise that resolves to all the pre elements
 */
async function slowPrintArr (arr) {
  let lines = []
  for (const string of arr) {
    const line = await slowPrint(string)
    await new Promise(resolve=>setTimeout(resolve, devmode ? 20 : 1000)) // Wait a moment
    lines.push(line)
  }
  return lines
}

// why is this like this
slowPrint(`Checking if user ${username} is on Roblox...`)
  .then(()=>new Promise((resolve, reject)=>{
    const avatar = document.createElement('img')
    avatar.src = 'https://roblox.com/Thumbs/Avatar.ashx?x=420&y=420&username=' + query.get('username')
    if (devmode) {
      avatar.classList.add('devmode')
    }
    avatar.addEventListener('error', ()=>{
      avatar.remove()
      reject('NOT_FOUND')
    })
    document.body.appendChild(avatar)
    avatar.addEventListener('load', resolve)
  }))
  .then(()=>slowPrintArr([ // Messages printed in order
    `User ${username} found.`,
    'Connecting to Roblox servers...',
    `Generating ${robux} Robux...`
  ]))
  .then(()=>new Promise(resolve=>{
    const bar = document.createElement('progress')
    bar.max = 100
    bar.value = 0
    document.body.appendChild(bar)
    function percent () {
      if (++bar.value < 50) {
        setTimeout(percent, devmode ? 1 : 50)
      } else {
        setTimeout(resolve, devmode ? 20 : 1000)
      }
    }

    percent()
  }))
  // It wouldn't a "free game cheat" website without this
  .then(()=>slowPrint('Wait a minute— we need you to verify you aren\'t a bot.'))
  .then(() => new Promise(resolve=>setTimeout(resolve, devmode ? 20 : 1000))) // Wait a second (or 0.02 seconds in fast forward)
  // Link to TheAnnoyingSite
  .then(()=>{
    const dialog = document.createElement('div')
    dialog.style.color = 'white'
    document.body.style.filter = 'blur(50px)'
    dialog.classList.add('dia')
    dialog.innerHTML = `
        <div>To verify that you are a human, <br><a href="https://theannoyingsite.com">go to this site</a> and click the cat.</div>`
    document.documentElement.appendChild(dialog)
    window.addEventListener('contextmenu', event=>{
      event.preventDefault()
      dialog.animate([
        {left: '0'},
        {left: '-1%'},
        {left: '1%'},
        {left: '0'}],
      {duration: 200, easing: 'linear'}
      )
    })
  })
  .catch(async reason=>{
    switch (reason) {
    case 'NOT_FOUND':
      await slowPrint(`${username} is not on Roblox.  Redirecting you to the form...`)
      break
    default:
      await slowPrint(`An error has occurred: ${reason}\nRedirecting you to the form...`)
    }
    setTimeout(redirect, 1000)
  })
