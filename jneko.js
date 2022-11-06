"use strict";

const imageNames = [
  'awake',
  'down1',
  'down2',
  'dtogi1',
  'dtogi2',
  'dwleft1',
  'dwleft2',
  'jare2',
  'kaki1',
  'kaki2',
  'left1',
  'left2',
  'ltogi1',
  'ltogo2',
  'mati2',
  'mati3',
  'right1',
  'right2',
  'rtogi1',
  'rtogi2',
  'sleep1',
  'sleep2',
  'up1',
  'up2',
  'upleft1',
  'upleft2',
  'upright1',
  'upright2',
  'utogi1',
  'utogi2',
];

const nekoSize = 64;
let nekoImg;

let state;

let favicon = document.querySelector("link[rel~='icon']");
if (!favicon) {
  favicon = document.createElement('link');
  favicon.rel = 'icon';
  document.getElementsByTagName('head')[0].appendChild(favicon);
}
const images = Object.fromEntries(imageNames.map(name => {
  const image = new Image(nekoSize, nekoSize);
  image.src = 'bitmaps/' + name + '.png';
  return [name, image]
}));


function main() {

  const nekoDiv = document.getElementById('jneko');

  /*
  nekoDiv.style.position = 'fixed';
  nekoDiv.style.left = '50%';
  nekoDiv.style.top = '50%';
  */
  nekoImg = new Image(nekoSize, nekoSize);
  nekoDiv.appendChild(nekoImg);
  nekoDiv.addEventListener('click', () => onClick());

  setState('sleep');
}

const stateMachine = {
  sleep: {
    image: ['sleep1', 'sleep2'],
    imageInterval: 1,
    click: 'awake'
  },
  awake: {
    image: 'awake',
    nextState: 'normal',
    nextStateDelay: 2.5,
  },
  normal: {
    image: 'mati2',
    nextState: ['normal', 'normal', 'normal', 'tilt', 'scratch', 'yawn'],
    nextStateDelay: 1.5,
  },
  tilt: {
    image: 'jare2',
    nextState: 'normal',
    nextStateDelay: 1,
  },
  yawn: {
    image: 'mati3',
    nextState: ['normal', 'normal', 'sleep'],
    nextStateDelay: 1,
  },
  scratch: {
    image: ['kaki1', 'kaki2'],
    imageInterval: 0.1,
    nextState: 'normal',
    nextStateDelay: 3,
  }


};

let animationIndex = 0;

function renderImage() {


  let name = stateMachine[state].image;

  animationIndex++;
  if (Array.isArray(name)) {
    name = name[animationIndex % name.length];
  }
  console.log('Rendering %s', name);
  nekoImg.src = images[name].src;
  favicon.href = nekoImg.src;
}

function sleep(s) {
  return new Promise(res => setTimeout(res, s*1000));
}

let nextStateTimeout;
let imageCycleInterval;

function setState(stateName) {

  clearTimeout(nextStateTimeout);
  clearInterval(imageCycleInterval);

  if (Array.isArray(stateName)) {
    stateName = stateName[Math.floor(Math.random()*stateName.length)];
  }
  if (!stateMachine[stateName]) {
    throw new Error('Uknown state: ' + stateName);
  }
  state = stateName;
  const stateData = stateMachine[state];

  if (stateData.nextState) {
    nextStateTimeout = setTimeout(
      () => setState(stateData.nextState),
      stateData.nextStateDelay * 1000
    );
  }
  renderImage();
  if (stateData.imageInterval) {

    imageCycleInterval = setInterval(
      () => renderImage(),
      stateData.imageInterval*1000
    );

  }

}

function onClick() {
  const stateData = stateMachine[state];
  if (stateData.click) {
    setState(stateData.click);
  }

}

window.addEventListener('DOMContentLoaded', () => main());
