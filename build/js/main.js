// jshint esversion: 6

const grid = document.querySelector('.grid');

let pairOfCard;
let countClick;
let countFindedPair;
let gridSize;

let themePrev;

let t = new Date();
t.setHours(0, 0, 10, 0);
let s = new Date();

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
  grid.style.pointerEvents = 'all';
  t = new Date();
  t.setHours(0, 0, 10, 0);
  s = new Date();

  message('Find all the pairs!');
  createGrid();
  renderGrid(gridSize);

  grid.addEventListener('click', clickCard);
  setTheme();

  timer();
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
    div.className = 'mem-card theme';
    let img = document.createElement('img');
    img.className = 'mem-img';
    grid.appendChild(div);
    div.appendChild(img);
    img.src = appPath + newArray[i];
  }

}


function renderGrid(gridSize) {
  // debugger
  const gridWidth = document.querySelector('.grid').offsetWidth;

  let cardSize = gridWidth / gridSize;

  let card = [...document.querySelectorAll('.mem-card')];
  card.forEach(elem => {
    elem.style.width = `${cardSize}px`;
    elem.style.height = `${cardSize}px`;
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
      elem.parentNode.classList.remove(`${themePrev}`);
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
  setSize();
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


function setSize() {
  gridSize = document.getElementById('select-size').value;

  while (grid.firstElementChild) {
    grid.firstElementChild.remove();
  }

  init(gridSize);
}


//-------------------------------------------
//---------------THEMES
//-------------------------------------------


function setTheme() {
  let theme = document.getElementById('select-theme').value;
  let listElementsContainsTheme = [...document.querySelectorAll('.theme')];

  listElementsContainsTheme.forEach(elem => {
    if (elem.classList.contains(`${themePrev}`)) {
      removeClassFromElement(`${themePrev}`, elem);
      // elem.classList.remove(`${themePrev}`);
    }
    if (elem.classList.contains('empty')) {
      return;
    }
    addClassToElement(`${theme}`, elem);
    // elem.classList.add(`${theme}`);
  });

  themePrev = theme;
}


function removeClassFromElement(elementClass, element) {
  element.classList.remove(elementClass);
}


function addClassToElement(elementClass, element) {
  element.classList.add(elementClass);
}


//-------------------------------------------
//---------------TIMER
//-------------------------------------------


function timer() {
  t = new Date(t.getTime() - (new Date()).getTime() + s.getTime());
  document.querySelector('.timer-text').innerHTML = t.toLocaleTimeString();
  s = new Date();
  let timerID = setTimeout(timer, 100);
  if (t.getSeconds() <= 0) {
    clearTimeout(timerID);
    grid.style.pointerEvents = 'none';
  }
}