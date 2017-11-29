// jshint esversion: 6

let grid = document.querySelector('.grid');

let pairClick = [];

let click;

let count = 0;

function ff(event) {
  if (!event.target.classList.contains('mem-card')) return;

  show(event.target.firstElementChild);

  console.log(event.target.firstElementChild.src);
  console.log('number of click', count++);
  pairClick.push(event.target.firstElementChild);
  click = event.target.firstElementChild.src;
}

grid.addEventListener('click', ff);
grid.addEventListener('click', checkClick);


function checkClick() {
  if (pairClick.length == 2 && pairClick[0].src === pairClick[1].src) {
    console.log('done');
    pairClick.forEach(elem => elem.parentNode.remove());
  } else if (pairClick.length == 2) {
    pairClick.length = 0;
  }

  console.log('length', pairClick.length);
}


function show(node) {
  node.style.display = 'block';
}

// function delete(node) {
//   node.style.display = 'block';
// }


function reset() {
  const images = document.querySelectorAll('.mem-img');
  console.log(images);
  const arrImages = [...images];

  arrImages.forEach(elem => elem.style.display = 'none');
}



//return number from min to max, including both [min; max]
//work with not an integer
function randomNumber(min, max) {
  if (min ^ 0 === min && max ^ 0 === max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else

  //technique - multiply and divide
    return (Math.floor((Math.random() * (max - min + 0.1) * 10)) / 10) + min;
}



function changeSize() {
  const size = document.getElementById('selectSize').value;

}