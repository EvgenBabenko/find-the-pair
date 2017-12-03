// jshint esversion: 6

const gridContainer = document.querySelector('.grid');

let pairOfCard;
let countClick;
let countFindedPairs;
let gridSize;

let themeNow;

let t = new Date();
t.setHours(0, 0, 0, 0);
let s = new Date();
let timerID;

const appPath = '../img/';
const arr = ['animals-bunny.jpg', 'animals-bunny-2.jpg', 'animals-cat.jpg', 'animals-cat-2.jpg', 'animals-dog.jpg', 'animals-dog-2.jpg', 'animals-horse.jpg', 'animals-horse-2.jpg', 'architecture-london-towerbridge.jpg'];


//-------------------------------------------
//---------------POINT OF ENTRY
//-------------------------------------------


function init(gridSize = 2) {
  console.log('gridSize', gridSize);
  pairOfCard = [];
  countClick = 0;
  countFindedPairs = 0;

  totalCards = parseInt(gridSize * gridSize, 10);
  totalPairs = totalCards / 2;
  gridContainer.style.pointerEvents = 'all';
  t = new Date();
  t.setHours(0, 0, 0, 0);
  s = new Date();

  message('Find all the pairs!');
  createGrid();
  renderGrid(gridSize);

  gridContainer.addEventListener('click', clickCard);
  setTheme();

  timer();
}

init();


//-------------------------------------------
//---------------MAIN FUNCTIONAL
//-------------------------------------------


function createGrid() {
  let newArray = createArray();
  console.log('newArray', newArray);

  for (let i = 0; i < totalCards; i++) {
    console.log(i);
    let div = document.createElement('div');
    div.className = 'mem-card theme';
    let img = document.createElement('img');
    img.className = 'mem-img';
    gridContainer.appendChild(div);
    div.appendChild(img);
    img.src = appPath + newArray[i];
  }

}


function renderGrid(gridSize) {
  const gridWidth = document.querySelector('.grid').offsetWidth;

  let cardSize = gridWidth / gridSize;

  let card = [...document.querySelectorAll('.mem-card')];
  card.forEach(elem => {
    elem.style.width = `${cardSize}px`;
    elem.style.height = `${cardSize}px`;
  });
}


function clickCard(e) {
  if (!e.target.classList.contains('mem-card'))
    return;

  const gh = findClass([...e.target.classList]);
  console.log(gh);
  e.target.classList.remove(gh);
  e.target.classList.add('selected');

  countClick++;
  console.log('number of click', countClick);
  pairOfCard.push(e.target);
  checkClick();
}


function findClass(array) {
  const result = array
    .toString()
    .match(/[\w\-]*theme-[\w\-]*/gi)
    .toString();

  return result;
}


function checkClick() {
  if (pairOfCard.length == 2 && pairOfCard[0].firstElementChild.src === pairOfCard[1].firstElementChild.src) {
    hideCards();
    countFindedPairs++;
    endGame();
  } else if (pairOfCard.length == 2) {
    closeCards();
  }

  message(`You found ${countFindedPairs} out of ${totalPairs} pairs with ${countClick / 2} tries.`);
}


function message(text) {
  document.querySelector('.message').innerHTML = text;
}


function alertText(text) {
  document.querySelector('.alert').innerHTML = text;
}


function hideCards() {
  setTimeout(() => {
    pairOfCard.forEach(elem => {
      elem.classList.remove(themeNow, 'selected');
      elem.classList.add('empty');
    });
    pairOfCard = [];
  }, 500);
}


function closeCards() {
  setTimeout(() => {
    pairOfCard.forEach(elem => {
      elem.classList.remove('selected');
      elem.classList.add(themeNow);
    });
    pairOfCard = [];
  }, 500);
}


function endGame() {
  if (countFindedPairs === totalPairs) {
    alert('Congratulations, you found them all!');
    clearTimeout(timerID);
  }
}


function reset() {
  setSize();
}


function createArray() {
  let newArr = arr.slice(0, totalPairs);
  newArr.sort(shuffle);
  let doubleArr = [...newArr.sort(shuffle), ...newArr.sort(shuffle)];
  doubleArr.sort(shuffle);
  return doubleArr;
}


function shuffle(a, b) {
  return Math.random() - 0.5;
}


//-------------------------------------------
//---------------SIZE FIELD
//-------------------------------------------


function setSize() {
  gridSize = document.getElementById('select-size').value;

  while (gridContainer.firstElementChild) {
    gridContainer.firstElementChild.remove();
  }

  init(gridSize);
}


//-------------------------------------------
//---------------THEMES
//-------------------------------------------


function setTheme() {
  let theme = document.getElementById('select-theme').value;
  let listContainsTheme = [...document.querySelectorAll('.theme')];

  listContainsTheme.forEach(elem => {
    if (elem.classList.contains(themeNow))
      elem.classList.remove(themeNow);

    if (elem.classList.contains('empty'))
      return;

    elem.classList.add(theme);
  });

  themeNow = theme;
}


//-------------------------------------------
//---------------TIMER
//-------------------------------------------


function timer() {
  t = new Date(t.getTime() + (new Date()).getTime() - s.getTime());
  document.querySelector('.timer-text').innerHTML = t.toLocaleTimeString();
  s = new Date();
  timerID = setTimeout(timer, 100);
}


function pause() {
  if (s) {
    clearTimeout(timerID);
    s = false;
    gridContainer.style.pointerEvents = 'none';
    alertText('pause');
  } else {
    s = new Date();
    timer();
    gridContainer.style.pointerEvents = 'all';
    alertText('');
  }
}