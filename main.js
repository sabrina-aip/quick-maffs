// Events

const questionNumberElement = document.querySelector(".question-number");
const questionElement = document.querySelector(".question");
const attemptElement = document.querySelector("#attempt");
const scoreElement = document.querySelector(".score");
const hourElement = document.querySelector(".hour");
const minuteElement = document.querySelector(".minute");
const secondElement = document.querySelector(".second");

// variables for quiz function
const target = 20;
let score = 0;
let wrong = 0;
let attempt;
let questionNumber = 1;
let prompts = [];
let lastQuestion = "";
let answered = false;
let timeout = null;
let startTime;
let elapsedTime = 0;

// variables for results breakdown
let historicalQuestionNumbers = [];
let historicalQuestions = [];
let historicalUserAnswers = [];
let historicalTrueAnswers = [];
let historicalIsTrue = [];

// variables for timer
let second = 00;
let minute = 00;
let hour = 00;
let elapsed;

// FUNCTIONS

// creates a random basic math question
function genQuestion() {
  let question, answer;
  let numbers = [];
  for (let i = 0; i <= 20; i++) {
    numbers.push(i);
  }
  let operators = ["a", "s", "m", "d"];
  // randomly generate operator and terms
  let ranOp = operators[Math.floor(Math.random() * operators.length)];
  let ranX = numbers[Math.floor(Math.random() * numbers.length)];
  let ranY = numbers[Math.floor(Math.random() * numbers.length)];

  // generate question and answer
  if ((ranOp == "a") & Number.isInteger(ranX + ranY)) {
    question = `${ranX} + ${ranY}`;
    answer = ranX + ranY;
  } else if ((ranOp == "s") & Number.isInteger(ranX - ranY)) {
    question = `${ranX} - ${ranY}`;
    answer = ranX - ranY;
  } else if ((ranOp == "m") & Number.isInteger(ranX * ranY)) {
    question = `${ranX} x ${ranY}`;
    answer = ranX * ranY;
  } else if ((ranY != 0) & (ranY != 1) & Number.isInteger(ranX / ranY)) {
    question = `${ranX} / ${ranY}`;
    answer = ranX / ranY;
  }
  return [question, answer];
}

// posts questions
function postQuestion() {
  answered = false;
  gen = genQuestion();
  if (lastQuestion === gen[0] || gen[0] == undefined) {
    postQuestion();
  }
  questionNumberElement.textContent = `Question ${questionNumber}`;
  questionElement.textContent = gen[0];
  scoreElement.textContent = `${score}/${target}`;
  answer = gen[1];
  console.log(answer);
  attemptElement.focus();
  attemptElement.click();
  attemptElement.addEventListener("keyup", checkAnswer);
}

// checks answer to question (triggered on keyup and recurses postQuestion)
function checkAnswer(e) {
  if (e.keyCode == 13) {
    historicalQuestionNumbers.push(questionNumber);
    historicalQuestions.push(gen[0]);
    historicalUserAnswers.push(attemptElement.value);
    historicalTrueAnswers.push(answer);
    if (
      (Number(attemptElement.value) == answer) &
      (attemptElement.value != "")
    ) {
      score++;
      historicalIsTrue.push(true);
    } else if (Number(attemptElement.value) != answer) {
      wrong++;
      historicalIsTrue.push(false);
    }
    attemptElement.removeEventListener("keyup", checkAnswer);
    attemptElement.value = "";
    answered = true;
    questionNumber++;
    if (answered === true) {
      if (score < target) {
        postQuestion();
      } else {
        scoreElement.textContent = `${score}/${target}`;
        victory();
      }
    }
  }
}

// got to victory page
function victory() {
  sessionStorage.setItem("wrong", wrong);
  sessionStorage.setItem(
    "timer",
    `${convertToString(hour)}:${convertToString(minute)}:${convertToString(
      second
    )}`
  );
  sessionStorage.setItem("QNum", questionNumber);
  sessionStorage.setItem("Q", historicalQuestions);
  sessionStorage.setItem("userA", historicalUserAnswers);
  sessionStorage.setItem("trueA", historicalTrueAnswers);
  sessionStorage.setItem("isTrue", historicalIsTrue);
  window.location.replace("results.html");
}

function start() {
  // every second, elapsed
  addTime();
  timer = setInterval(addTime, 1000);
}

function convertToString(e) {
  if (e < 10) {
    e = `0${e}`;
  }
  return e;
}

function addTime() {
  second++;
  if (second === 60) {
    minute++;
    second = 00;
  }
  if (minute === 60) {
    hour++;
    minute = 00;
  }
  hourElement.textContent = convertToString(hour);
  minuteElement.textContent = convertToString(minute);
  secondElement.textContent = convertToString(second);
}

// run when page opens
sessionStorage.clear();
postQuestion();
start();
