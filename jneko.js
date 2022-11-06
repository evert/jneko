"use strict";

const imageNames = [
  'awake',
//  'down1',
//  'down2',
//  'dtogi1',
//  'dtogi2',
//  'dwleft1',
//  'dwleft2',
  'jare2',
  'kaki1',
  'kaki2',
//  'left1',
//  'left2',
//  'ltogi1',
//  'ltog2',
  'mati2',
  'mati3',
//  'right1',
//  'right2',
//  'rtogi1',
//  'rtogi2',
  'sleep1',
  'sleep2',
//  'up1',
//  'up2',
//  'upleft1',
//  'upleft2',
//  'upright1',
//  'upright2',
//  'utogi1',
//  'utogi2',
];
const nekoSize = 64; 
const images = Object.fromEntries(imageNames.map(name => {
  const image = new Image(nekoSize, nekoSize);
  image.src = 'bitmaps/' + name + '.png';
  return [name, image]
}));



function main() {

  const nekoDiv = document.getElementById('jneko');
  const neko = new Neko(nekoDiv);

}

window.addEventListener('DOMContentLoaded', () => main());

const stateMachine = {

  // Name of the state
  sleep: {

    // Which images are used for the state
    image: ['sleep1', 'sleep2'],

    // How quickly we loop through these images
    imageInterval: 1,

    // What state does this go to when clicked
    click: 'awake'
  },
  awake: {
    image: 'awake',

    // We automaticall transition to this state
    nextState: 'normal',

    // How long it takes to transition
    nextStateDelay: 2.5,
  },
  normal: {
    image: 'mati2',

    // If there's multiple nextState values, a random one is picked.
    // You make make 1 state more likely by addding it multiple times
    // to the array
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

class Neko {

  constructor(elem) {

    // The HTML element that hosts neko
    this.elem = elem;
    this.stateMachine = stateMachine;

    // Creating a new <img> element
    this.imgElem =  new Image(nekoSize, nekoSize);

    elem.appendChild(this.imgElem);
    this.imgElem.addEventListener('click', () => this.onClick());

    this.setState('sleep');

  }

  /**
   * This property is used to keep track of states with multiple frames
   */
  #animationIndex = 0;

  renderImage() {

    let name = this.stateMachine[this.#state].image;

    this.#animationIndex++;
    if (Array.isArray(name)) {
      name = name[this.#animationIndex % name.length];
    }
    console.log('Rendering %s', name);
    this.imgElem.src = images[name].src;
  }

  #state = null;
  #nextStateTimeout = null;
  #imageCycleInterval = null;

  setState(stateName) {

    clearTimeout(this.nextStateTimeout);
    clearInterval(this.imageCycleInterval);

    if (Array.isArray(stateName)) {
      // If stateName was supplied as an array of strings, we'll randomly
      // pick a new state.
      stateName = stateName[Math.floor(Math.random()*(stateName.length))];
    }
    if (!this.stateMachine[stateName]) {
      throw new Error('Uknown state: ' + stateName);
    }
    this.#state = stateName;
    const stateData = this.stateMachine[this.#state];

    // If there was a nextState, we automatically transition there after
    // a delay.
    if (stateData.nextState) {
      this.nextStateTimeout = setTimeout(
        () => this.setState(stateData.nextState),
        stateData.nextStateDelay * 1000
      );
    }

    // This block is responsible for cycling through multiple images
    // of the current state.
    if (stateData.imageInterval) {

      this.imageCycleInterval = setInterval(
        () => this.renderImage(),
        stateData.imageInterval*1000
      );

    }
    this.renderImage();
  }
  onClick() {
    const stateData = this.stateMachine[this.#state];
    if (stateData.click) {
      // If the current state had a 'click' property, we'll transition
      // to that state, otherwise it's ignored.
      this.setState(stateData.click);
    }

  }

}


