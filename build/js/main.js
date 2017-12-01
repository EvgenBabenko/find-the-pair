// jshint esversion: 6

const grid = document.querySelector('.grid');

let pairOfCard;
let countClick;
let countFindedPair;
let gridSize;

const appPath = '../img/';
const arr = ['animals-bunny.jpg', 'animals-bunny-2.jpg', 'animals-cat.jpg', 'animals-cat-2.jpg', 'animals-dog.jpg', 'animals-dog-2.jpg', 'animals-horse.jpg', 'animals-horse-2.jpg', 'architecture-london-towerbridge.jpg'];


//-------------------------------------------
//---------------POINT OF ENTRY
//-------------------------------------------


function init(gridSize = 2) {
  // debugger
  console.log('gridSize', gridSize);
  pairOfCard = [];
  countClick = 0;
  countFindedPair = 0;

  totalCards = parseInt(gridSize * gridSize, 10);
  totalPairs = totalCards / 2;

  message('Find all the pairs!');
  createGrid();
  renderGrid(gridSize);

  grid.addEventListener('click', clickCard);
}

init();


//-------------------------------------------
//---------------MAIN FUNCTIONAL
//-------------------------------------------


function createGrid() {
  // debugger
  let newArray = createArray();
  console.log('newArray', newArray);

  for (let i = 0; i < totalCards; i++) {
    console.log(i);
    let div = document.createElement('div');
    div.className = 'mem-card';
    let img = document.createElement('img');
    img.className = 'mem-img';
    grid.appendChild(div);
    div.appendChild(img);
    img.src = appPath + newArray[i];
  }
}


function renderGrid(gridSize) {
  const gridWidth = document.querySelector('.grid').offsetWidth;

  let cardSize = gridWidth / gridSize;

  let card = [...document.querySelectorAll('.mem-card')];
  card.forEach(elem => {
    elem.style.width = cardSize + 'px';
    elem.style.height = cardSize + 'px';
  });
}


function clickCard(e) {
  if (!e.target.classList.contains('mem-card')) {
    return;
  }

  show(e.target.firstElementChild);

  countClick++;
  console.log('number of click', countClick);
  pairOfCard.push(e.target.firstElementChild);
  checkClick();
}


function checkClick() {
  if (pairOfCard.length == 2 && pairOfCard[0].src === pairOfCard[1].src) {
    hideCards();
    countFindedPair++;
    endGame();
  } else if (pairOfCard.length == 2) {
    closeCards();
  }

  message(`You found ${countFindedPair} out of ${totalPairs} pairs with ${countClick / 2} tries.`);
}


function message(text) {
  const messageText = document.querySelector('.message');
  messageText.innerHTML = text;
}


function hideCards() {
  setTimeout(() => {
    pairOfCard.forEach(elem => {
      elem.parentNode.classList.add('empty');
      hide(elem);
    });
    pairOfCard = [];
  }, 500);
}


function closeCards() {
  setTimeout(() => {
    pairOfCard.forEach(elem => {
      hide(elem);
    });
    pairOfCard = [];
  }, 500);
}


function show(node) {
  node.style.display = 'block';
}


function hide(node) {
  node.style.display = 'none';
}


function endGame() {
  if (countFindedPair === totalPairs) {
    alert('Congratulations, you found them all!');
  }
}


function reset() {
  while (grid.firstElementChild) {
    grid.firstElementChild.remove();
  }

  changeSize();
}


function createArray() {
  let newArr = [];
  for (let i = 1; i <= totalPairs; i++) {
    newArr.push(arr[i]);
  }
  console.log(newArr);
  let doubleArr = [...shuffle(newArr), ...shuffle(newArr)];
  console.log(doubleArr);
  return doubleArr;
}


function shuffle(array) {
  let result = [...array];

  result.sort((a, b) => {
    return Math.random() - 0.5;
  });

  return result;
}


//-------------------------------------------
//---------------SIZE FIELD
//-------------------------------------------


function changeSize() {
  gridSize = document.getElementById('select-size').value;

  while (grid.firstElementChild) {
    grid.firstElementChild.remove();
  }

  init(gridSize);
}