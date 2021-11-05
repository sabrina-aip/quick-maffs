const QNum = sessionStorage.getItem('QNum').split(",");
const Q = sessionStorage.getItem('Q').split(",");
const userA = sessionStorage.getItem('userA').split(",");
const trueA = sessionStorage.getItem('trueA').split(",");
const isTrue = sessionStorage.getItem('isTrue').split(",");
const wrong = sessionStorage.getItem('wrong')
const eb = document.querySelector('.error-breakdown')
const output = []

for (let i=0; i<Q.length; i++){
  output.push(
    `
    <div class="a-${isTrue[i]}">
    <h3>Q${QNum[i]}. ${Q[i]}</h3>
    <p>your answer: ${userA[i]}</p>
    <p>correct answer: ${trueA[i]}</p>
    </div>
    `
  )
};

eb.innerHTML = output.join('');