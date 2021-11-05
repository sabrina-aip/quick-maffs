const wrong = sessionStorage.getItem('wrong');
const elapsed = sessionStorage.getItem('timer');

const w = document.querySelector('.wrong');
const t = document.querySelector('.timer');

w.textContent = wrong;
t.textContent = elapsed;


