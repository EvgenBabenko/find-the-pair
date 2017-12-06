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


function init(sizeOfGrid) {
  gridSize = sizeOfGrid || 2;
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
  // const gridWidth = document.querySelector('.grid').offsetWidth;
  const gridWidth = 520;
  console.log('gridWidth', gridWidth);
  let cardSize = gridWidth / gridSize;
  console.log('cardSize', cardSize);

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
  rotateAnimation(e.target);
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
      // moveAnimation(elem);
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
    local_Storage().saveData();
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
  gridSize = parseInt(document.getElementById('select-size').value, 10);

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
  const minTry = 3 * totalPairs / 2;
  const maxTry = minTry * 4;
  const minTime = minTry / 2;
  const maxTime = minTry * 8;

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

  return {
    saveData: function() {
      const userName = prompt('Enter your name');
      const date = new Date();
      const userData = {
        name: userName,
        date: date,
        score: totalScore,
        tab: gridSize
      };
      let serialObj = JSON.stringify(userData);
      localStorage.setItem(date.toLocaleString(), serialObj);
    },

    getData: function(field, value) {
      let keysLocalStorage = Object.keys(localStorage);
      console.log('keysLocalStorage', keysLocalStorage);
      let dataBase = [];

      keysLocalStorage.forEach(key => {
        let returnedObj;

        try {
          returnedObj = JSON.parse(localStorage.getItem(`${key}`), (key, value) => {
            if (key === 'date') return new Date(value);
            return value;
          });

          if (!returnedObj.name && !returnedObj.date && !returnedObj.score && !returnedObj.tab)
            return;
        } catch (err) {
          return;
        }

        dataBase.push(returnedObj);
      });

      let filteredDB = filterByField(dataBase, field, value);
      return filteredDB;
    }

  };
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


function sortByField(arr, field) {
  function byField(a, b) {
    if (a[field] < b[field]) return 1;
    if (a[field] > b[field]) return -1;
  }
  return arr.sort(byField);
}


function displayResult(arr, number = arr.length) {
  let result = [];
  for (let i = 0; i < number; i++) {
    result.push(arr[i]);
  }
  return result;
}


//-------------------------------------------
//---------------LEADERBOARD
//-------------------------------------------


function leaderboard() {
  let selectSize = [...document.getElementById('select-size').children];
  let resultsContainer = document.querySelector('.results');
  let arrValue = [];
  selectSize.forEach(elem => {
    arrValue.push(parseInt(elem.value, 10));
  });
  console.log('arrValue', arrValue);

  let listGridSize = document.querySelector('.tabs-grid-size');

  if (!listGridSize.firstElementChild) {
    for (let i = 0; i < arrValue.length; i++) {
      let tagA = document.createElement('a');
      tagA.innerHTML = `${arrValue[i]}x${arrValue[i]}`;
      listGridSize.appendChild(tagA).classList.add('tab', arrValue[i]);

      listGridSize.addEventListener('click', clickTab);
    }
  }

  console.log('listGridSize', listGridSize);

  console.log(localStorage);
}


function clickTab(e) {
  if (!e.target.classList.contains('tab'))
    return;

  let gt = [...e.target.classList];
  console.log('gt', gt);
  console.log('e.target', e.target);

  gt.shift();
  console.log('gt', parseInt(gt, 10));


  let localStorageDB = local_Storage().getData('tab', parseInt(gt, 10));
  console.log('localStorageDB', localStorageDB);

  let sorted = sortByField(localStorageDB, 'score');
  console.log('sorted', sorted);

  let displayed = displayResult(sorted);
  console.log('displayed', displayed);

  let resultsContainer = document.querySelector('.results');

  while (resultsContainer.firstElementChild) {
    resultsContainer.firstElementChild.remove();
  }

  for (let i = 0; i < displayed.length; i++) {
    let name = displayed[i].name;
    let date = (displayed[i].date).toLocaleDateString();
    let score = (displayed[i].score).toFixed(2);

    let pTag = document.createElement('p');
    resultsContainer.appendChild(pTag).innerHTML = `${name} ${date} ${score}`;
  }

}



//-------------------------------------------
//---------------ANIMATIONS
//-------------------------------------------


function rotateAnimation(card) {
  let angle = 0;
  card.style.transform = `rotateY(${angle}deg)`;

  const duration = 1;

  let rotateCardID = setInterval(rotateCard, duration);

  function rotateCard() {
    if (angle >= 180) {
      // console.log('angle < 180', angle);
      clearInterval(rotateCardID);
    } else {
      // console.log('angle', angle);
      angle += 2;
      card.style.transform = `rotateY(${angle}deg)`;
    }
  }
}


function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  };
}


function moveAnimation(card) {
  let left = getOffset(card).left;
  let top = getOffset(card).top;

  console.log('left', left);
  console.log('top', top);

  let endPositionX = 400;
  let endPositionY = 400;
  card.style.transform = `translate(${left}px, ${top}px)`;

  const duration = 100;

  let moveCardID = setInterval(moveCard, duration);

  function moveCard() {
    if (left >= endPositionX) {
      console.log('translateX >= 255', left);
      clearInterval(moveCardID);
    } else {
      console.log('translateX', left);
      left += 2;
      top += 2;
      card.style.transform = `translate(${left}px, ${top}px)`;
    }
  }
}