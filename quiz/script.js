const audio = new Audio();
audio.loop = true;

let score = 0;
let wrong = 0;

const questions = [
  // Overwatch
  {
    question: "Hoeveel heroes zijn er in Overwatch 2?",
    answers: [
      { text: "41", correct: false },
      { text: "43", correct: true },
      { text: "39", correct: false },
      { text: "45", correct: false }
    ],
    category: "overwatch"
  },
  {
    question: "Wie is de leider van Overwatch in het verhaal van de game?",
    answers: [
      { text: "Reaper", correct: false },
      { text: "Tracer", correct: false },
      { text: "Genji", correct: false },
      { text: "Winston", correct: true }
    ],
    category: "overwatch"
  },
  {
    question: "Wat is de echte naam van Soldier: 76?",
    answers: [
      { text: "Gabriel Reyes", correct: false },
      { text: "Jack Morrison", correct: true },
      { text: "John Kruger", correct: false },
      { text: "Cole Cassidy", correct: false }
    ],
    category: "overwatch"
  },

  // Sailor Moon
  {
    question: "Wat is de echte naam van Sailor Moon?",
    answers: [
      { text: "Ami Mizuno", correct: false },
      { text: "Usagi Tsukino", correct: true },
      { text: "Rei Hino", correct: false },
      { text: "Makoto Kino", correct: false }
    ],
    category: "sailormoon"
  },
  {
    question: "Wat is een van de speciale aanvallen van Sailor Mars?",
    answers: [
      { text: "Supreme Thunder", correct: false },
      { text: "Crescent Beam", correct: false },
      { text: "Fire Soul", correct: true },
      { text: "Bubble Spray", correct: false }
    ],
    category: "sailormoon"
  },
  {
    question: "Wat is het element van Sailor Mercury?",
    answers: [
      { text: "Vuur", correct: false },
      { text: "Water", correct: true },
      { text: "Lucht", correct: false },
      { text: "Aarde", correct: false }
    ],
    category: "sailormoon"
  },

  // Fullmetal Alchemist
  {
    question: "Wie is de broer van Edward Elric?",
    answers: [
      { text: "Roy", correct: false },
      { text: "Alphonse", correct: true },
      { text: "Hohenheim", correct: false },
      { text: "Scar", correct: false }
    ],
    category: "fma"
  },
  {
    question: "Hoe heet de groep gebaseerd op de zeven zonden?",
    answers: [
      { text: "The State Army", correct: false },
      { text: "Homunculi", correct: true },
      { text: "The Elric Clan", correct: false },
      { text: "Ishvalans", correct: false }
    ],
    category: "fma"
  },
  {
    question: "Wie is de vader van Edward en Alphonse?",
    answers: [
      { text: "Mustang", correct: false },
      { text: "Bradley", correct: false },
      { text: "Hohenheim", correct: true },
      { text: "Armstrong", correct: false }
    ],
    category: "fma"
  },
  {
    question: "wie is de flame alchemist?",
    answers: [
      { text: "Homunculi", correct: false },
      { text: "Mustang", correct: true },
      { text: "Alfonso", correct: false },
      { text: "Armstrong",correct: false }    
    ],
    category: "fma"
  },
];

const backgrounds = {
  overwatch: "url('overwatch.jpg')",
  sailormoon: "url('sailormoon.jpg')",
  fma: "url('fma.jpg')"
};

const music = {
  overwatch: "overwatch.mp3",
  sailormoon: "sailormoon.mp3",
  fma: "fma.mp3"
};

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");

const resultScreen = document.getElementById("result-screen");
const resultTitle = document.getElementById("result-title");
const scoreText = document.getElementById("score-text");

let currentQuestionIndex = 0;
let currentCategory = null;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  wrong = 0;
  currentCategory = null;

  resultScreen.classList.add("hidden");
  document.querySelector(".quiz-container").style.display = "block";
  document.body.classList.remove("fma-theme");

  showQuestion();
  
}

function playMusic(category) {
  if (audio.src && audio.src.includes(music[category])) {
    return;
  }

  audio.src = music[category];
  audio.play().catch(e => {
    console.warn("Audio play prevented:", e);
  });
}

function showQuestion() {
  resetState();

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  document.body.style.backgroundImage = backgrounds[currentQuestion.category];

  if (currentCategory !== currentQuestion.category) {
    currentCategory = currentQuestion.category;
    playMusic(currentCategory);

    if (currentCategory === "fma") {
      document.body.classList.add("fma-theme");
    } else {
      document.body.classList.remove("fma-theme");
    }
  }

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(answer, button));
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
}

function selectAnswer(answer, selectedButton) {
  if (answer.correct) {
    score++;
  } else {
    wrong++;
  }

  Array.from(answerButtons.children).forEach(button => {
    const correctAnswer = questions[currentQuestionIndex].answers.find(a => a.text === button.innerText).correct;
    button.classList.add(correctAnswer ? "correct" : "wrong");
    button.disabled = true;
  });

  selectedButton.classList.add(answer.correct ? "correct" : "wrong");
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.querySelector(".quiz-container").style.display = "none";
  resultScreen.classList.remove("hidden");

  scoreText.innerText = `Je had ${score} goed en ${wrong} fout`;

  // Controleer of speler 6 of meer vragen goed heeft
  if (score >= 6) {
    resultTitle.innerText = "🎉 Goed gedaan! Je gaat naar Level 2...";
    resultScreen.classList.add("pass");
    resultScreen.classList.remove("fail");

    // Ga automatisch naar level2.html na 3 seconden
    setTimeout(() => {
      window.location.href = "level2.html";
    }, 3000);
  } else {
    resultTitle.innerText = "💥 Onvoldoende, probeer opnieuw!";
    resultScreen.classList.add("fail");
    resultScreen.classList.remove("pass");
  }

  if (typeof audio !== "undefined") {
    audio.pause();
    audio.currentTime = 0;
  }
}

restartButton.addEventListener("click", () => {
  startQuiz();
});
document.getElementById("hint-btn").addEventListener("click", function (e) {
  e.preventDefault(); // voorkomt dat de pagina herlaadt

  // zoek alle antwoordknoppen
  const answerBtns = Array.from(document.querySelectorAll("#answer-buttons .btn"));

  // filter de foute antwoorden eruit
  const wrongAnswers = answerBtns.filter(btn => {
    const question = questions[currentQuestionIndex];
    const answer = question.answers.find(a => a.text === btn.innerText);
    return answer && !answer.correct;
  });

  // verwijder maximaal 2 foute knoppen
  let removed = 0;
  while (removed < 2 && wrongAnswers.length > 0) {
    const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
    const toRemove = wrongAnswers.splice(randomIndex, 1)[0];
    toRemove.remove(); // verwijdert de knop
    removed++;
  }
});

startQuiz();
const tabButtons = document.querySelectorAll(".nav-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    tabContents.forEach(tab => {
      tab.classList.remove("active");
    });

    document.getElementById(target).classList.add("active");
  });
});

// Activeer standaard de quiz-tab bij laden
document.getElementById("quiz-tab").classList.add("active");
document.getElementById("over-btn").addEventListener("click", function(event) {
  event.preventDefault();
  const foto = document.getElementById("over-mij-foto");
  foto.classList.toggle("hidden");
});
const level2Questions = [
  {
    question: "🔐 PUZZEL: Welke combinatie hoort niet thuis?\nA: 🔺\nB: 🔹\nC: 🔸\nD: 🟩",
    answers: [
      { text: "A", correct: false },
      { text: "B", correct: true }, // juist antwoord
      { text: "C", correct: false },
      { text: "D", correct: false }
    ],
    category: "puzzle"
  }
];

document.getElementById("level2-btn").addEventListener("click", () => {
  questions.length = 0;
  questions.push(...level2Questions);
  currentQuestionIndex = 0;
  score = 0;
  wrong = 0;
  document.getElementById("result-screen").classList.add("hidden");
  document.querySelector(".quiz-container").style.display = "block";
  showQuestion();
});