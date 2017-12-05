// jshint esversion: 6

const gridContainer = document.querySelector('.grid');

let pairOfCard;
let countTry;
let countFindedPairs;
let gridSize;

let themeNow;

let t = new Date();
t.setHours(0, 0, 0, 0);
let s = new Date();
let timerID;

let totalScore;

const appPath = './img/';
const arr = ['animals-bunny-2.jpg', 'animals-bunny.jpg', 'animals-cat-2.jpg', 'animals-cat.jpg', 'animals-dog-2.jpg', 'animals-dog.jpg', 'animals-horse-2.jpg', 'animals-horse.jpg', 'architecture-london-towerbridge.jpg', 'architecture-moscow-redsquare.jpg', 'architecture-nederlanden.jpg', 'architecture-newyork-publiclibrary.jpg', 'architecture-paris-eiffeltower.jpg', 'cities-tokyo-night.jpg', 'flowers-reddahlia.jpg', 'flowers-waterlillies.jpg', 'flowers-windclock.jpg', 'landscape-1.jpg', 'landscape-2.jpg', 'landscape-australia-outback.jpg', 'landscape-netherlands-deurningen.jpg', 'landscape-us-edgewood.jpg', 'x_b108ad63.jpg', 'бриллиант06+vp.jpg', 'букет.jpg'];


//-------------------------------------------
//---------------POINT OF ENTRY
//-------------------------------------------


function init(gridSize = 2) {
  console.log('gridSize', gridSize);
  pairOfCard = [];
  countTry = 0;
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

  leaderboard();
}

init();


//-------------------------------------------
//---------------MAIN FUNCTIONAL
//-------------------------------------------


function createGrid() {
  let newArray = createArray();
  console.log('newArray', newArray);

  for (let i = 0; i < totalCards; i++) {
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

  const findedClass = findClass([...e.target.classList]);
  e.target.classList.remove(findedClass);
  e.target.classList.add('selected');

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
    countTry++;
    endGame();
  } else if (pairOfCard.length == 2) {
    countTry++;
    closeCards();
  }

  message(`You found ${countFindedPairs} out of ${totalPairs} pairs with ${countTry} tries.`);
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
    const timeOfWin = t.getSeconds();
    console.log('timeOfWin', timeOfWin);
    clearTimeout(timerID);
    scoring();
    local_Storage();
    leaderboard();
    alert('Congratulations, you found them all!');
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
    document.querySelector('.alert').style.display = 'block';
    alertText('pause');
  } else {
    s = new Date();
    timer();
    gridContainer.style.pointerEvents = 'all';
    document.querySelector('.alert').style.display = 'none';
    alertText('');
  }
}


//-------------------------------------------
//---------------SCORING SYSTEM
//-------------------------------------------


function scoring() {

  class Score {
    constructor(name, x1, x2, y1, y2, x) {
      this.name = name;
      this.x1 = x1;
      this.x2 = x2;
      this.y1 = y1;
      this.y2 = y2;
      this.x = x;
    }
    getScore() {
      // The scoring is based on equation
      // (x - x1) / (x2 - x1) = (y - y1) / (y2 - y1);

      // // Solution for the variable y is:
      // let y = (x * y1 - x * y2 + x1 * y2 - x2 * y1) / (x1 - x2);

      return (this.x * this.y1 - this.x * this.y2 + this.x1 * this.y2 - this.x2 * this.y1) / (this.x1 - this.x2);
    }
  }


  const minTry = 3 * totalPairs / 2;
  const maxTry = minTry * 4;
  const minTime = minTry / 2;
  const maxTime = minTry * 8;


  const timeScore = new Score('timeScore', minTime, maxTime, 1, 0, t.getSeconds());
  const g1 = timeScore.getScore();

  const triesScore = new Score('triesScore', minTry, maxTry, 1, 0, countTry);

  const g2 = triesScore.getScore();

  totalScore = g1 * g2 * 100;
  console.log('totalScore', totalScore);
  const fg = totalScore.toFixed(2);
  console.log(fg);
  // document.querySelector('.result').innerHTML = `Your score is ${fg}`;
}


//-------------------------------------------
//---------------LOCAL STORAGE
//-------------------------------------------


function local_Storage() {
  const userName = prompt('Enter your name');
  const date = new Date();

  let user = {
    name: userName,
    date: date.toLocaleDateString(),
    score: totalScore.toFixed(2),
    tab: gridSize
  };

  let serialObj = JSON.stringify(user);
  localStorage.setItem(date.toLocaleString(), serialObj);



  // let returnedObj = JSON.parse(localStorage.getItem('myKey'));
  // document.querySelector('.result').innerHTML = returnedObj.score;
}


//-------------------------------------------
//---------------LEADERBOARD
//-------------------------------------------


function leaderboard() {
  let selectSize = [...document.getElementById('select-size').children];
  let resultsContainer = document.querySelector('.results');
  let arrValue = [];
  selectSize.forEach(elem => {
    arrValue.push(elem.text);
  });
  console.log('arrValue', arrValue);

  let listGridSize = document.querySelector('.tabs-grid-size');
  for (let i = 0; i < arrValue.length; i++) {
    let tagA = document.createElement('a');
    tagA.innerHTML = arrValue[i];
    listGridSize.appendChild(tagA);
  }
  console.log('listGridSize', listGridSize);

  console.log(localStorage);
  // for (let key in localStorage) {
  //   console.log(key);
  // }

  let arrObj = Object.keys(localStorage);

  let localStorageDB = [];

  arrObj.forEach(key => {
    let returnedObj;

    try {
      returnedObj = JSON.parse(localStorage.getItem(`${key}`));
      if (!returnedObj.name && !returnedObj.date && !returnedObj.score && !returnedObj.tab) return;
    } catch (err) {
      return;
    }

    localStorageDB.push(returnedObj);
  });

  console.log('localStorageDB', localStorageDB);


  function sortByField(arr, field) {
    function byField(a, b) {
      if (a[field] < b[field]) return 1;
      if (a[field] > b[field]) return -1;
    }
    return arr.sort(byField);
  }

  function filterByField(arr, field, value) {
    let result = [];
    for (const elem of arr) {
      if (elem[field] === value) {
        result.push(elem);
      }
    }
    return result;
  }

  function displayResult(arr, number = arr.length) {
    let result = [];
    for (let i = 0; i < number; i++) {
      result.push(arr[i]);
    }
    return result;
  }

  let filtered = filterByField(localStorageDB, 'tab', '6');

  console.log('filtered', filtered);


  let sorted = sortByField(filtered, 'score');
  console.log('sorted', sorted);

  let displayed = displayResult(sorted);
  console.log('displayed', displayed);

  for (let i = 0; i < displayed.length; i++) {
    let pTag = document.createElement('p');
    resultsContainer.appendChild(pTag).innerHTML = `${displayed[i].name} ${displayed[i].date} ${displayed[i].score}`;
  }
}