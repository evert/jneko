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

const images = Object.fromEntries(imageNames.map(name => {
  const image = new Image(nekoSize, nekoSize);
  image.src = 'bitmaps/' + name + '.png';
  return [name, image]
}));


function main() {

  const nekoDiv = document.getElementById('jneko');
  nekoDiv.appendChild(images.sleep1);

}

window.addEventListener('DOMContentLoaded', () => main());
