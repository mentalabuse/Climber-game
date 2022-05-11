let keys = {
  ArrowUp: false,
  ArrowLeft: false,
  ArrowRight: false,
  x: false,
  ч: false
} 

let mirror = false
let muted = false
let ropeused = false
let ropescope = false
let inair = false
let onrope = false
let gameOver = false
let winGame = false
let clickblocker = false
let rope = document.createElement('div')
let ropeDet = document.createElement('div')
let finish = document.querySelector('.finish')
let faller = document.querySelector('.faller')
let overlay = document.querySelector('.overlay')
let startbutton = document.querySelector('.startbutton')
const mountain = document.querySelector('.mountBg')
let degree

const blocks = [...document.querySelectorAll('.block')]
const points = [...document.querySelectorAll('.point')]
const circs = [...document.querySelectorAll('.circ')]

let block = blocks[0]
let point = points[0]
let circ = circs[0]

let idleSound = new Howl({
  src: ['audio/audIdle.m4a'],
  volume: 0.7,
  onend: function () {
    idleSound.play()
  }
});
let dieSound = new Howl({
  src: ['audio/audDie.m4a'],
  volume: 1
})
let soundvol = document.querySelector('.soundvol')

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d') 
canvas.height = 120
canvas.width = 120

overlay.style.width = window.innerWidth + 'px'
overlay.style.height = window.innerHeight + 'px'
overlay.style.top = document.body.scrollHeight-window.innerHeight + 'px'

class Character {
  constructor() {
    this.width = 900
    this.height = 900
    this.frameX = 1
    this.x = 0
    this.y = 0
    this.speed = 3
  }
  drawDying() {
    if (mirror) {
      ctx.save();
      ctx.scale(-1,1);
      ctx.drawImage(images.player, 0, 0, this.width, this.height, -this.x, this.y, -canvas.width, canvas.height)
      if (this.frameX > 14) {
          canvas.style.top = canvas.offsetTop + 1 + 'px'
      } 
      else {
        this.frameX++ 
        images.player.src = `./img/Dying/${this.frameX}.png`
      }
      ctx.restore();
    }
    else {
    ctx.drawImage(images.player, 0, 0, this.width, this.height, this.x, this.y, canvas.width, canvas.height)
    if (this.frameX > 14) {
        canvas.style.top = canvas.offsetTop + 1 + 'px'
    } 
    else {
      this.frameX++ 
      images.player.src = `./img/Dying/${this.frameX}.png`
    }
  }
  }
  drawFallingDown() {
    drawAnimation(5,'FallingDown')
  }
  drawBlinking() {
    drawAnimation(17,'Blinking')
  }
  drawSlashing() {
    drawAnimation(11,'Slashing')
  }
  drawSliding() {
    drawAnimation(5,'Sliding')
  }
  drawWalking() {
    drawAnimation(23,'Walking')
  }
  drawAirLoop() {
    drawAnimation(5,'JumpLoop')
  }
  drawClimb() {
    drawAnimation(11,'Kicking')
  }
  drawWin() {
    drawAnimation(11,'Hurt')
  }

  update() {
    if (keys.ArrowRight && !inair) {
      canvas.style.left = canvas.offsetLeft+this.speed + 'px'
      point.style.left = getCoords(canvas).left -getCoords(block).left + 55 + 'px'
      canvas.style.top = getCoords(point).top - canvas.height + 20 + 'px'
    }
    if (keys.ArrowLeft && canvas.offsetLeft > 0 && !inair) {
      canvas.style.left = canvas.offsetLeft-this.speed + 'px'
      point.style.left = getCoords(canvas).left -getCoords(block).left + 55 + 'px'
      canvas.style.top = getCoords(point).top - canvas.height + 20 + 'px'
    }
    if (inair) {
      canvas.style.top = getCoords(point).top - canvas.height - 30 + 'px'
      canvas.style.left = getCoords(point).left - canvas.width/2 + 'px'
    }
    switchblock()
  }
}

let climber = new Character()
const images = {}
images.player = new Image()

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  if (keys.ArrowRight && !inair) {
    mirror = false
    climber.drawWalking()
    climber.update()
  }
  if (keys.ArrowLeft && !inair) {
    mirror = true
    climber.drawWalking()
    climber.update()
  }
  if (keys.x && !inair) {
    climber.drawSlashing()
    climber.update()
  }
}

function startMove(event) {
  if (keys.hasOwnProperty(event.key) && !gameOver && !winGame) {
    event.preventDefault()
    keys[event.key] = true
    if (event.key == 'x' && !inair && !clickblocker|| event.key == 'ч' && !clickblocker && !inair) {
      keys.x = true
      clickblocker = true
      if (!ropeused) {
        throwropeScope()
        ropeused = true
      }
      else {
        ropescope = false
        throwrope()
      }
    }
  }
}

function stopMove(event) {
  if (keys.hasOwnProperty(event.key) && !gameOver && !winGame) {
    event.preventDefault()
    keys[event.key] = false
    if (event.key == 'x' && clickblocker || event.key == 'ч' && clickblocker) {
      keys.x = false
      clickblocker = false
    }
  }
}

function playGame() {
  if (window.pageXOffset == 0 && window.pageYOffset == 0 && !gameOver) {
    window.scrollBy(0,document.body.scrollHeight-window.innerHeight)
  }
  if (window.innerWidth-canvas.getBoundingClientRect().right < 140 && !inair && block != blocks[5] && block != blocks[6] && !gameOver) {
    window.scrollBy(window.innerWidth/2,0)
  }
  if (window.innerWidth-canvas.getBoundingClientRect().right < 140 && !inair && block == blocks[5] && !gameOver) {
    window.scrollBy(300,0)
  }
  if (canvas.getBoundingClientRect().left < 140 && !inair && block == blocks[6] && !gameOver) {
    window.scrollBy(-300,0)
  }
  if (canvas.getBoundingClientRect().left < 70 && !inair && block != blocks[0] && block != blocks[1] && !gameOver) {
    window.scrollBy(-window.innerWidth/1.5,0)
  }
  if (block.getBoundingClientRect().top < 140 && !inair && !gameOver) {
    window.scrollBy(0,-window.innerWidth/2)
  }
  if (window.innerHeight - canvas.getBoundingClientRect().bottom < 140 && gameOver && canvas.offsetTop < document.body.scrollHeight - canvas.height) {
    window.scrollBy(0,window.innerWidth/4)
  }
  if (keys.ArrowRight || keys.ArrowLeft || keys.x) {   
    animate()
    if (!winGame) {
    checkWin()}
  }
  else if (block == blocks[4] && canvas.offsetTop < blocks[4].offsetTop - 10 && canvas.getBoundingClientRect().right > block.getBoundingClientRect().right - block.offsetWidth/2 + 80) {
    faller.classList.add('fallingStar')
    ctx.clearRect(0,0,canvas.width,canvas.height)
    climber.drawBlinking()
    climber.update()
  }
  else if (!gameOver && !inair && !winGame) {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    climber.drawBlinking()
    climber.update()
  }
  else if (gameOver) {
    if (climber.frameX < 15) {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    climber.update()  
    }

    else {
    window.scrollTo(0,document.body.scrollHeight-window.innerHeight)
    overlay.style.animation = 'showover 2s forwards'
    mountain.style.animation = 'hideover 2s forwards'
    canvas.style.animation = 'hideover 2s forwards'
    faller.classList.remove('fallingStar')
    }
  }
  else if (winGame) {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    climber.drawWin()
    finish.classList.add('rotFinish')
    finish.style.backgroundImage = 'url(img/win.gif)'
    setTimeout(() => {
      block = blocks[0]
      canvas.style.left = '0px'
      canvas.style.top = '970px'
      window.scrollTo(0,document.body.scrollHeight-window.innerHeight)
      overlay.style.animation = 'showover 2s forwards'
      mountain.style.animation = 'hideover 2s forwards'
      canvas.style.animation = 'hideover 2s forwards'
      finish.classList.remove('rotFinish')
      faller.classList.remove('fallingStar')
      idleSound.stop()
      winGame = false
    }, 2500);
  }
  requestAnimationFrame(playGame)
}

function checkWin() {
  if (canvas.offsetTop < finish.offsetTop && canvas.offsetLeft - finish.offsetLeft < 10) {
  winGame=true
  keys.ArrowLeft = false
  keys.ArrowRight = false
  keys.ArrowUp = false
  keys.x = false
  }
}

function drawAnimation(maxframe,name) {
  if (mirror) {
    ctx.save();
    ctx.scale(-1,1);
    ctx.drawImage(images.player, 0, 0, climber.width, climber.height, -climber.x, climber.y, -canvas.width, canvas.height)
    if (climber.frameX > maxframe) {
      climber.frameX = 1
      images.player.src = `img/${name}/${climber.frameX}.png`
    } 
    else {
      climber.frameX++ 
      images.player.src = `img/${name}/${climber.frameX}.png`
    }
    ctx.restore();
  }
  else {
  ctx.drawImage(images.player, 0, 0, climber.width, climber.height, climber.x, climber.y, canvas.width, canvas.height)
  if (climber.frameX > maxframe) {
    climber.frameX = 1
    images.player.src = `img/${name}/${climber.frameX}.png`
  } 
  else {
    climber.frameX++ 
    images.player.src = `img/${name}/${climber.frameX}.png`
  }
}
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();
  
  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset
  };
}

function switchblock() {
  if (canvas.offsetLeft > getCoords(blocks[0]).right - canvas.width/2 && canvas.offsetLeft < getCoords(blocks[1]).right - canvas.width/2) {
    block = blocks[1]
    point = points[1]
    circ = circs[0]
  }
  else if (canvas.offsetLeft < getCoords(blocks[1]).left - canvas.width/2) {
    block = blocks[0]
    point = points[0]
  }
  else if (canvas.offsetLeft > getCoords(blocks[1]).right - canvas.width/2 && inair && canvas.offsetLeft < getCoords(blocks[2]).right - canvas.width/2) {
    block = blocks[2]
    point = points[2]
    circ = circs[1]
  }
  else if (canvas.offsetLeft > getCoords(blocks[2]).right - canvas.width/2 && inair && canvas.offsetLeft < getCoords(blocks[3]).right - canvas.width/2) {
    block = blocks[3]
    point = points[3]
    circ = circs[2]
  }
  else if (canvas.offsetLeft > getCoords(blocks[3]).right - canvas.width/2 && inair && canvas.offsetLeft < getCoords(blocks[4]).right - canvas.width/2) {
    block = blocks[4]
    point = points[4]
    circ = circs[3]
  }
  else if (canvas.offsetLeft > getCoords(blocks[4]).right - canvas.width/2 && inair && canvas.offsetLeft < getCoords(blocks[5]).right - canvas.width/2) {
    block = blocks[5]
    point = points[5]
    circ = circs[0]
  }
  else if (canvas.offsetLeft > getCoords(blocks[5]).right - canvas.width/2 - 35) {
    block = blocks[6]
    point = points[6]
  }
  if (canvas.offsetLeft > getCoords(block).right - canvas.width/2 + 10 && !inair){
    charDie()
  }
  if (canvas.offsetLeft < getCoords(block).left - canvas.width/2 - 10 && !inair) {
    charDie()
  }
    if (block == blocks[4] && !onrope) {
    if (getCoords(canvas).right-canvas.offsetWidth/2 < getCoords(faller).right && getCoords(canvas).right - 40 > getCoords(faller).left && getCoords(canvas).top + 40 < getCoords(faller).bottom) {
      charDie()
    }}
}

function charDie() {
  if (!gameOver) {
    keys.ArrowLeft = false
    keys.ArrowRight = false
    keys.ArrowUp = false
    keys.x = false
    gameOver = true
    if (!muted) {
      idleSound.stop()
      dieSound.play()
    }
  }
  
  if (canvas.offsetTop < document.body.scrollHeight - (canvas.height-20)) {
    canvas.style.top = canvas.offsetTop + 5 + 'px'
    climber.drawFallingDown()
  }
  if (canvas.offsetTop >= document.body.scrollHeight - (canvas.height-20) && canvas.offsetTop <= document.body.scrollHeight - (canvas.height-26)) {
    climber.drawDying()
  }
}

function muteUnmute() {
  
  if (!muted) {
    muted = true
    idleSound.pause()
    soundvol.style.backgroundImage = 'url("img/mute.png")'
  }
  else {
    muted = false
    idleSound.play()
    soundvol.style.backgroundImage = 'url("img/volume.png")'
  }
}

function throwropeScope() {
  ropescope = true
  rope.classList.add('rope')
  rope.classList.remove('ropemiss')
  rope.style.width = '100px'
  mountain.append(rope)
  ropscopeCoord()
}

function throwrope() {
  degree = getDegreeElement(rope)

  rope.classList.remove('ropeanim')
  rope.classList.remove('mirroredropeanim')
  rope.style.transform = `rotate(${degree}deg)`

  ropeDet.classList.add('ropedetector')
  rope.appendChild(ropeDet)
  for (let j= rope.offsetWidth;j<=350;j+=10) {
    rope.style.width = j + 20 + 'px'
    if(checkCollision(ropeDet,circ)) {
      ropeused = false
      rope.style.transform = `rotate(${degree-180}deg)`
      rope.style.top = getCoords(circ).bottom - circ.offsetWidth - (blocks.length -3)*rope.offsetHeight + 'px'
      rope.style.left = getCoords(circ).right - circ.offsetWidth/2 + 'px'
      rope.classList.add('slideanim')
      inair = true
      onrope = true
      ropeSliding()
      break
    }
    else if (j == 350) {
      ropeused = false
      rope.classList.add('ropemiss')
      setTimeout(() => {
        rope.classList.remove('rope') 
      }, 700);
    }
  }
  
}

function ropeSliding() {
  if (inair) {
    if (onrope) {
    point = ropeDet}
    if (getDegreeElement(rope) < 90) {
      mirror = true
      ctx.clearRect(0,0,canvas.width,canvas.height)
      climber.drawSliding()
      climber.update()
    }
    else if (getDegreeElement(rope) > 90) {
      mirror = false
      ctx.clearRect(0,0,canvas.width,canvas.height)
      climber.drawSliding()
      climber.update()
    }
    else if (getDegreeElement(rope) == 90) {
      if (keys.ArrowUp && getCoords(canvas).bottom - 20 > getCoords(block).top) {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        climber.drawClimb()
        rope.style.width = rope.offsetWidth - climber.speed + 'px'
        climber.update()
      }
      else if (getCoords(canvas).bottom - 30 < getCoords(block).top) {
        onrope = false
        switchblock()
        inair = false
        rope.style.transform = `rotate(${degree}deg)`
        rope.classList.remove('slideanim')
        rope.classList.remove('ropemiss')
        rope.classList.remove('rope')
      }
      else {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        climber.drawAirLoop()
      }
    }

    requestAnimationFrame(ropeSliding)
  }
  else {
    cancelAnimationFrame(ropeSliding)
  }
}

function checkCollision(el1,el2) {
  if (getCoords(el1).top > getCoords(el2).top && getCoords(el1).bottom < getCoords(el2).bottom && getCoords(el1).left > getCoords(el2).left && getCoords(el1).right < getCoords(el2).right) {
    return true
  }
}

function getDegreeElement(element){
  var style = window.getComputedStyle(element, null);
  var valueStyle = style.getPropertyValue("-webkit-transform") ||
      style.getPropertyValue("-moz-transform") ||
      style.getPropertyValue("-ms-transform") ||
      style.getPropertyValue("-o-transform") ||
      style.getPropertyValue("transform");
  if(valueStyle == 'none') return 0;
  var values = valueStyle.split('(')[1];
  values = values.split(')')[0];
  values = values.split(',');
  var cos = values[0];
  var sin = values[1];
  var degree = Math.round(Math.asin(sin) * (180/Math.PI));
  if(cos<0){
      addDegree = 90 - Math.round(Math.asin(sin) * (180/Math.PI));
      degree = 90 + addDegree;
  }
  if(degree < 0){
      degree = 360 + degree;
  }
  return degree;
}

function ropscopeCoord () {
  if (ropescope) {
    if (mirror) {
      rope.style.left = canvas.offsetLeft + canvas.width/2 + 'px'
      rope.style.top = canvas.offsetTop + canvas.height - rope.offsetHeight*3 + 20 + 'px'
      rope.classList.add('mirroredropeanim')
      rope.classList.remove('ropeanim')
    }
    if (!mirror) {
      rope.style.left = canvas.offsetLeft + canvas.width/2 + 'px'
      rope.style.top = canvas.offsetTop + canvas.height - rope.offsetHeight*3 + 20 + 'px'
      rope.classList.remove('mirroredropeanim')
      rope.classList.add('ropeanim')
    }
  requestAnimationFrame(ropscopeCoord)
} else {
  cancelAnimationFrame(ropscopeCoord)
}
}

document.addEventListener('keydown', startMove)
document.addEventListener('keyup', stopMove)
soundvol.addEventListener('click', muteUnmute)
startbutton.addEventListener('click', () => {
  if (!muted) {
    dieSound.stop()
    idleSound.play()
  }
  gameOver = false
  winGame = false
  canvas.style.left = '0px'
  canvas.style.top = '970px'
  overlay.style.animation = 'hideover 2s forwards'
  mountain.style.animation = 'showover 2s forwards'
  canvas.style.animation = 'showover 2s forwards'
})

playGame()
