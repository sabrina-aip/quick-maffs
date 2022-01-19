// Events

const qn = document.querySelector('.question-number');
const q = document.querySelector('.question');
const a = document.querySelector('#attempt');
const s = document.querySelector('.score');
const hr = document.querySelector('.hour')
const min = document.querySelector('.minute')
const sec = document.querySelector('.second')

// variables for quiz function
const target = 20;
let score = 0;
let wrong = 0;
let attempt;
let questionNumber = 1;
let prompts = [];
let lastQuestion = '';
let answered = false;
let timeout = null;
let startTime;
let elapsedTime = 0;

// variables for results breakdown
let QNum = [];
let Q = [];
let userA = [];
let trueA = [];
let isTrue = [];

// variables for timer
let second = 00;
let minute = 00;
let hour = 00;
let elapsed;

// FUNCTIONS

// creates a random basic math question
function genQuestion(){
  let question, answer;  
  let numbers = [];
  for (let i = 0; i <= 20; i++){
    numbers.push(i)  
  };
  let operators = ['a','s','m','d'];
  // randomly generate operator and terms
  let ranOp = operators[Math.floor(Math.random() * operators.length)]
  let ranX = numbers[Math.floor(Math.random() * numbers.length)]
  let ranY = numbers[Math.floor(Math.random() * numbers.length)]
  
  // generate question and answer
  if ((ranOp == 'a') & (Number.isInteger(ranX + ranY))){
      question = `${ranX} + ${ranY}`
      answer = ranX+ranY
    }
  else if ((ranOp == 's') & (Number.isInteger(ranX - ranY))){
      question = `${ranX} - ${ranY}`
      answer = ranX-ranY
    }
  else if ((ranOp == 'm') & (Number.isInteger(ranX * ranY))){
      question = `${ranX} x ${ranY}`
      answer = ranX*ranY
    }
  else if ((ranY != 0) & (ranY != 1) & Number.isInteger(ranX/ranY)){
      question = `${ranX} / ${ranY}`
      answer = ranX/ranY
    }
  return [question,answer];
}

// posts questions
function postQuestion(){
  answered = false
  gen = genQuestion();
  if ((lastQuestion === gen[0]) || (gen[0] == undefined)){
    postQuestion();
  };
  qn.textContent = `Question ${questionNumber}`;
  q.textContent = gen[0];
  s.textContent = `${score}/${target}`;
  answer = gen[1];
  a.focus();
  a.click();
  a.addEventListener('keyup', checkAnswer);
};

// checks answer to question (triggered on keyup and recurses postQuestion)
function checkAnswer(e){
  if(e.keyCode == 13){
    QNum.push(questionNumber);
    Q.push(gen[0]);
    userA.push(a.value);
    trueA.push(answer);
    if ((Number(a.value) == answer) & (a.value != '')){
      score ++;
      isTrue.push(true)
    }
    else if (Number(a.value) != answer){
      wrong ++;
      isTrue.push(false)
    };
    a.removeEventListener('keyup', checkAnswer);
    a.value = '';
    answered = true;
    questionNumber++;
    if (answered === true){
      if (score<target){
        postQuestion();
      }
      else{
        s.textContent = `${score}/${target}`;
        victory();
      };  
    }
  }
}

// got to victory page
function victory(){
  sessionStorage.setItem('wrong', wrong);
  sessionStorage.setItem('timer', `${convertToString(hour)}:${convertToString(minute)}:${convertToString(second)}`);
  sessionStorage.setItem('QNum', QNum);
  sessionStorage.setItem('Q', Q);
  sessionStorage.setItem('userA', userA);
  sessionStorage.setItem('trueA', trueA);
  sessionStorage.setItem('isTrue', isTrue);
  sessionStorage.setItem('right', score);
  window.location.replace("results.html");
}

function start(){
  // every second, elapsed 
  addTime()
  timer = setInterval(addTime, 1000)
}

function convertToString(e){
  if (e < 10){
    e = `0${e}`;
  }
  return e;
}

function addTime(){
  second++;
  if (second === 60){
    minute++;
    second = 00
  }
  if (minute === 60){
    hour++;
    minute = 00
  }
  hr.textContent = convertToString(hour);
  min.textContent = convertToString(minute);
  sec.textContent = convertToString(second);
  
}

// run when page opens
sessionStorage.clear()
postQuestion()
start()
