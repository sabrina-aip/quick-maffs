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
const maxTerm = 20;
let score = 0;
let wrong = 0;
let questionNumber = 1;

// This holds the history of questions, answers, and if they were correct.
// The last entry is also the current question posed to the user.
let historicalQuestions = [];

// This function gets the user score, by checking the real and user answers from historicalQuestions.
function getScore() {
  return historicalQuestions.filter(
    (question) => question.realAnswer == question.userAnswer
  ).length;
}

// variables for timer
let second = 00;
let minute = 00;
let hour = 00;

// FUNCTIONS

// creates a random basic math question
function genQuestion() {
  let question, answer;

  let operators = ["a", "s", "m", "d"];
  // randomly generate operator and terms
  let ranOp = operators[Math.floor(Math.random() * operators.length)];
  let ranX = Math.floor(Math.random() * (maxTerm + 1));
  let ranY = Math.floor(Math.random() * (maxTerm + 1));

  switch (ranOp) {
    case "a":
      question = `${ranX} + ${ranY}`;
      answer = ranX + ranY;
      break;
    case "s":
      question = `${ranX} - ${ranY}`;
      answer = ranX - ranY;
      break;
    case "m":
      question = `${ranX} * ${ranY}`;
      answer = ranX * ranY;
      break;
    case "d":
      if ((ranY != 0) & (ranY != 1) && Number.isInteger(ranX / ranY)) {
        question = `${ranX} / ${ranY}`;
        answer = ranX / ranY;
      }
      break;
  }

  return [question, answer];
}

// posts questions
function postQuestion() {
  answered = false;
  gen = genQuestion();
  if (
    historicalQuestions[historicalQuestions.length - 2] === gen[0] ||
    gen[0] == undefined
  ) {
    postQuestion();
  } else {
    const currentAnswer = {
      question: gen[0],
      realAnswer: gen[1],
      userAnswer: undefined,
    };
    historicalQuestions.push(currentAnswer);

    console.log(currentAnswer.realAnswer);

    questionNumberElement.textContent = `Question ${historicalQuestions.length}`;
    questionElement.textContent = currentAnswer.question;
    scoreElement.textContent = `${getScore()}/${target}`;
    attemptElement.focus();
    attemptElement.click();
    attemptElement.addEventListener("keyup", checkAnswer);
  }
}

// checks answer to question (triggered on keyup and recurses postQuestion)
function checkAnswer(e) {
  if (e.keyCode == 13 && attemptElement.value != "") {
    historicalQuestions[historicalQuestions.length - 1].userAnswer =
      attemptElement.value;
    attemptElement.removeEventListener("keyup", checkAnswer);
    attemptElement.value = "";

    if (getScore() < target) {
      postQuestion();
    } else {
      scoreElement.textContent = `${getScore()}/${target}`;
      victory();
    }
  }
}

// got to victory page
function victory() {
  sessionStorage.setItem("wrong", historicalQuestions.length - getScore());
  sessionStorage.setItem(
    "timer",
    `${convertToString(hour)}:${convertToString(minute)}:${convertToString(
      second
    )}`
  );
  sessionStorage.setItem("QNum", historicalQuestions.length);
  sessionStorage.setItem(
    "Q",
    historicalQuestions.map((question) => question.question)
  );
  sessionStorage.setItem(
    "userA",
    historicalQuestions.map((question) => question.userAnswer)
  );
  sessionStorage.setItem(
    "trueA",
    historicalQuestions.map((question) => question.realAnswer)
  );
  sessionStorage.setItem(
    "isTrue",
    historicalQuestions.map(
      (question) => question.realAnswer == question.userAnswer
    )
  );
  window.location.replace("results.html");
}

function start() {
  // every second, elapsed
  addTime();
  setInterval(addTime, 1000);
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
