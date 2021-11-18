const wrong = sessionStorage.getItem('wrong');
const elapsed = sessionStorage.getItem('timer');
const right = sessionStorage.getItem('right')


const w = document.querySelector('.wrong');
const t = document.querySelector('.timer');
const r = document.querySelector('.right');

w.textContent = wrong;
t.textContent = elapsed;
r.textContent = right;


