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
const listImages = ['animals-bunny-2.jpg','animals-bunny.jpg','animals-cat-2.jpg','animals-cat.jpg','animals-dog-2.jpg','animals-dog.jpg','animals-horse-2.jpg','animals-horse.jpg','architecture-london-towerbridge.jpg','architecture-moscow-redsquare.jpg','architecture-nederlanden.jpg','architecture-newyork-publiclibrary.jpg','architecture-paris-eiffeltower.jpg','cities-tokyo-night.jpg','diamond.jpg','flower.jpg','flowers-reddahlia.jpg','flowers-waterlillies.jpg','flowers-windclock.jpg','flowers.jpg','landscape-1.jpg','landscape-2.jpg','landscape-australia-outback.jpg','landscape-netherlands-deurningen.jpg','landscape-us-edgewood.jpg'];


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

  document.querySelector('.alert').style.display = 'none';
  alertText('');
}

init();


//-------------------------------------------
//---------------MAIN FUNCTIONAL
//-------------------------------------------


function createGrid() {
  let newArray = createArray();
  console.log('newArray', newArray);

  for (let i = 0; i < totalCards; i++) {
    const img = createNode('img', { className: 'mem-img', src: appPath + newArray[i] });
    const div = createNode('div', { className: 'mem-card theme' }, img);

    gridContainer.appendChild(div);
  }
}


function renderGrid(gridSize) {
  // const gridWidth = document.querySelector('.grid').offsetWidth;
  const gridWidth = 520;
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

  pairOfCard.push(e.target);
  checkClick();
  rotateAnimation(e.target);
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
  document.querySelector('.message').textContent = text;
}


function alertText(text) {
  document.querySelector('.alert').textContent = text;
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
  }
}


function reset() {
  setSize();
}


function createArray() {
  const newArr = listImages.slice(0, totalPairs)
    .sort(shuffle);
  const doubleArr = [...newArr.sort(shuffle), ...newArr.sort(shuffle)]
    .sort(shuffle);

  return doubleArr;
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
  document.querySelector('.timer-text').textContent = t.toLocaleTimeString();
  s = new Date();
  timerID = setTimeout(timer, 100);
}


function pause() {
  if (s) {
    clearTimeout(timerID);
    s = false;
    gridContainer.style.pointerEvents = 'none';
    document.querySelector('.alert').style.display = 'block';
    alertText('Game is paused');
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
    constructor(x1, x2, y1, y2, x) {
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

  const time = new Score(minTime, maxTime, 1, 0, t.getSeconds());
  const timeScore = time.getScore();

  const tries = new Score(minTry, maxTry, 1, 0, countTry);
  const triesScore = tries.getScore();

  totalScore = timeScore * triesScore * 100;
  
  document.querySelector('.alert').style.display = 'block';
  alertText(`Score is ${totalScore.toFixed(2)}`);
}


//-------------------------------------------
//---------------LOCAL STORAGE
//-------------------------------------------


function local_Storage() {

  return {
    saveData: function() {
      const userName = prompt(`Congratulations, you found them all!
Enter your name`);
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
      const keysLocalStorage = Object.keys(localStorage);
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

      return filterByField(dataBase, field, value);
    }

  };
}


//-------------------------------------------
//---------------LEADERBOARD
//-------------------------------------------


function leaderboard() {
  let listSelectSize = [...document.getElementById('select-size').children];
  let resultsContainer = document.querySelector('.results');

  const valueSelectSize = listSelectSize.map(elem => {
    return parseInt(elem.value, 10);
  });

  let listGridSize = document.querySelector('.tabs-grid-size');

  if (!listGridSize.firstElementChild) {
    for (let i = 0; i < valueSelectSize.length; i++) {
      const tab = createNode('a', { className: `tab ${valueSelectSize[i]}` }, `${valueSelectSize[i]}x${valueSelectSize[i]}`);
      listGridSize.appendChild(tab);
      listGridSize.addEventListener('click', clickTab);
    }
  }
}


function clickTab(e) {
  if (!e.target.classList.contains('tab')) return;

  const listTabs = [...e.target.classList];
  listTabs.shift();

  let localStorageDB = local_Storage().getData('tab', parseInt(listTabs, 10));
  console.log('localStorageDB', localStorageDB);

  let sorted = sortByField(localStorageDB, 'score');
  console.log('sorted', sorted);

  let displayed = displayResult(sorted);
  console.log('displayed', displayed);

  const resultsContainer = document.querySelector('.results');

  while (resultsContainer.firstElementChild) {
    resultsContainer.firstElementChild.remove();
  }

  if (displayed.length === 0) {
    const result = createNode('p', { }, 'No data yet!');
    resultsContainer.appendChild(result);
  }

  for (let i = 0; i < displayed.length; i++) {
    const name = displayed[i].name;
    const date = (displayed[i].date).toLocaleDateString();
    const score = (displayed[i].score).toFixed(2);

    const result = createNode('p', { }, `${name} ${date} ${score}`);
    resultsContainer.appendChild(result);
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
    } else if (angle >= 90) {
      // console.log('angle', angle);
      angle += 2;
      card.style.transform = `rotateY(${angle}deg)`;

      const findedClass = findClass([...card.classList], 'theme-');
      card.classList.remove(findedClass);
      card.classList.add('selected');
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
  // debugger
  let left = getOffset(card).left;
  let top = getOffset(card).top;

  console.log('left', left);
  console.log('top', top);

  let endPositionX = 0;
  let endPositionY = 0;
  // card.style.transform = `translate(${left}px, ${top}px)`;

  const duration = 10;

  let moveCardID = setInterval(moveCard, duration);

  function moveCard() {
    if (left <= endPositionX) {
      console.log('translateX >= 255', left);
      clearInterval(moveCardID);
    } else {
      console.log('translateX', card, left);
      left -= 2;
      // top -= 2;
      card.style.transform = `translate(${left}px, ${top}px)`;
    }
  }
}


//-------------------------------------------
//---------------HELPERS
//-------------------------------------------


function createNode(tag, props, ...children) {
  const element = document.createElement(tag);

  Object.keys(props).forEach(key => element[key] = props[key]);

  children.forEach(child => {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }

    element.appendChild(child);
  });

  return element;
}


function filterByField(arr, field, value) {
  return arr.filter(elem => {
    if (elem[field] === value) {
      return elem;
    }
  });
}


function sortByField(arr, field) {
  function byField(a, b) {
    if (a[field] < b[field]) return 1;
    if (a[field] > b[field]) return -1;
  }

  return arr.sort(byField);
}


function displayResult(arr, number = arr.length) {
  return arr.slice(0, number);
}


function shuffle(a, b) {
  return Math.random() - 0.5;
}


function findClass(array, str) {
  const string = /[\w\-]* + str + [\w\-]*/gi;
  return array
    .toString()
    .match(string);
}