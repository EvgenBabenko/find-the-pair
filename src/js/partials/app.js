// jshint esversion: 6

let grid = document.querySelector('.grid');

let pairClick = [];

let click;

let count = 0;
let countCard = 0;

let gridSize = document.getElementById('selectSize').value;
console.log('gridSize', gridSize);


const appPath = '../img/';
// const arr = ['animals-bunny.jpg', 'animals-bunny-2.jpg', 'animals-cat.jpg', 'animals-cat-2.jpg', 'animals-dog.jpg', 'animals-dog-2.jpg', 'animals-horse.jpg', 'animals-horse-2.jpg', 'architecture-london-towerbridge.jpg'];
const arr = [];

function endGame() {
  if (countCard === +gridSize*2) {
    alert('Congratulations!');
  }
}


function createGrid() {
  let newArray = shuffle(arr);
  console.log('newArray', newArray);



  let numberCard = gridSize * gridSize / 2;

  for (let i = 0; i < numberCard * 2; i++) {
    console.log(i);
    let div = document.createElement('div');
    div.className = 'mem-card';
    let img = document.createElement('img');
    img.className = 'mem-img';
    grid.appendChild(div);
    div.appendChild(img);
    img.src = appPath + newArray[i];
  }

  renderGrid();
}

createGrid();

function renderGrid() {
  const gridWidth = document.querySelector('.grid').offsetWidth;

  let cardSize = gridWidth / gridSize;


  let card = [...document.querySelectorAll('.mem-card')];
  card.forEach(elem => {
    elem.style.width = cardSize + 'px';
    elem.style.height = cardSize + 'px';
  });
}



function changeSize() {
  createGrid();

}



function shuffle(array) {

  let result = [...array];

  result.sort((a, b) => {
    return Math.random() - 0.5;
  });

  return result;
}



function clickCard(event) {
  if (!event.target.classList.contains('mem-card')) return;

  show(event.target.firstElementChild);

  console.log('number of click', count++);
  pairClick.push(event.target.firstElementChild);
  click = event.target.firstElementChild.src;
}

grid.addEventListener('click', clickCard);
grid.addEventListener('click', checkClick);



function checkClick() {

  if (pairClick.length == 2 && pairClick[0].src === pairClick[1].src) {
    setTimeout(() => {
      pairClick.forEach(elem => {
        elem.parentNode.classList.add('empty');
        hide(elem);
      });
      pairClick.length = 0;
    }, 500);
    countCard++;
    console.log('countCard', countCard);
    endGame();
  } else if (pairClick.length == 2) {
    setTimeout(() => {
      pairClick.forEach(elem => {
        hide(elem);
      });
      pairClick.length = 0;
    }, 500);
  }
}



function show(node) {
  node.style.display = 'block';
}

function hide(node) {
  node.style.display = 'none';
}


function restart() {
  const listImages = document.querySelectorAll('.mem-img');
  const arrImages = [...listImages];
  console.log(arrImages);

  pairClick.length = 0;

  arrImages.forEach(elem => {
    hide(elem);
    elem.parentNode.classList.remove('empty');
  });
}