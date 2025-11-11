document.addEventListener("DOMContentLoaded", () => {
  let score = 0;
  let wrong = 0;
  let fiftyUsed = false;
  let currentQuestionIndex = 0;
  const bgMusic = document.getElementById("bg-music");

  const questions = [
    {
      question: "Wie is de eerste Pokémon die Ash in Kanto gevangen heeft?",
      answers: [
        { text: "Pidgey", correct: false },
        { text: "Caterpie", correct: true },
        { text: "Bulbasaur", correct: false },
        { text: "Rattata", correct: false }
      ]
    },
    {
      question: "Welke Pokémon gebruikt Misty het meest in het begin?",
      answers: [
        { text: "Psyduck", correct: true },
        { text: "Staryu", correct: false },
        { text: "Squirtle", correct: false },
        { text: "Poliwag", correct: false }
      ]
    },
    {
      question: "Wat is de speciale aanval van Charizard?",
      answers: [
        { text: "Hydro Pump", correct: false },
        { text: "Thunderbolt", correct: false },
        { text: "Flamethrower", correct: true },
        { text: "Solar Beam", correct: false }
      ]
    },
    {
      question: "Wie is de rivaal van Ash in het eerste seizoen?",
      answers: [

        { text: "Misty", correct: false },
        { text: "Gary Oak", correct: true },
        { text: "Brock", correct: false },
        { text: "Jessie", correct: false }
      ]
    },
    {
      question: "Welke Pokémon evolueert uit Eevee?",
      answers: [

        { text: "Bulbasaur", correct: false },
        { text: "Pikachu", correct: false },
        { text: "Charmander", correct: false },
        { text: "Vaporeon", correct: true },
      ]
    },
    {
      question: "Wat is de naam van de Team Rocket leden die Ash achterna zitten?",
      answers: [
        { text: "Gary & Tracey", correct: false },
        { text: "Misty & Brock", correct: false },
        { text: "Jessie & James", correct: true },
        { text: "Officer Jenny & Meowth", correct: false }
      ]
    }
  ];

  const questionElement = document.getElementById("question");
  const answerButtons = document.getElementById("answer-buttons");
  const nextButton = document.getElementById("next-btn");
  const restartButton = document.getElementById("restart-btn");
  const resultScreen = document.getElementById("result-screen");
  const resultTitle = document.getElementById("result-title");
  const scoreText = document.getElementById("score-text");

  function startQuiz() {
    // 🔊 Start muziek bij eerste interactie
    bgMusic.play().catch(() => {
      console.log("Autoplay geblokkeerd, muziek start bij eerste klik.");
    });

    score = 0;
    wrong = 0;
    fiftyUsed = false;
    currentQuestionIndex = 0;
    document.getElementById("hint-btn").disabled = false;
    resultScreen.classList.add("hidden");
    document.querySelector(".quiz-container").style.display = "block";
    showQuestion();
  }

  function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
      const button = document.createElement("button");
      button.innerText = answer.text;
      button.classList.add("btn");
      button.addEventListener("click", () => selectAnswer(answer, button));
      answerButtons.appendChild(button);
    });
  }

  function resetState() {
    answerButtons.innerHTML = "";
    nextButton.style.display = "none";
  }

  function selectAnswer(answer, selectedButton) {
    if (answer.correct) score++;
    else wrong++;

    Array.from(answerButtons.children).forEach(button => {
      const correctAnswer = questions[currentQuestionIndex].answers.find(a => a.text === button.innerText).correct;
      button.classList.add(correctAnswer ? "correct" : "wrong");
      button.disabled = true;
    });

    nextButton.style.display = "block";
  }

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) showQuestion();
    else showResult();
  });

  function showResult() {
    document.querySelector(".quiz-container").style.display = "none";
    resultScreen.classList.remove("hidden");
    scoreText.innerText = `Je had ${score} goed en ${wrong} fout`;

    if (score >= 4) {
      resultTitle.innerText = "🎉 Goed gedaan! Level 2 gehaald!";
    } else {
      resultTitle.innerText = "💥 Onvoldoende, probeer opnieuw!";
    }
  }

  restartButton.addEventListener("click", startQuiz);

  // 50/50 knop
  document.getElementById("hint-btn").addEventListener("click", function() {
    if (fiftyUsed) return;
    const answerBtns = Array.from(document.querySelectorAll("#answer-buttons .btn"));
    const wrongAnswers = answerBtns.filter(btn => {
      const answer = questions[currentQuestionIndex].answers.find(a => a.text === btn.innerText);
      return answer && !answer.correct;
    });
    let removed = 0;
    while (removed < 2 && wrongAnswers.length > 0) {
      const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
      wrongAnswers.splice(randomIndex, 1)[0].remove();
      removed++;
    }
    fiftyUsed = true;
    this.disabled = true;
  });

  // Hint knop
  document.getElementById('over-btn').addEventListener('click', () => {
    const overMij = document.getElementById('over-mij-container');
    const quiz = document.querySelector('.quiz-container');
    const resultScreen = document.getElementById('result-screen');
    if (overMij.classList.contains('hidden')) {
      overMij.classList.remove('hidden');
      quiz.style.display = 'none';
      resultScreen.classList.add('hidden');
    } else {
      overMij.classList.add('hidden');
      quiz.style.display = 'block';
    }
  });

  document.getElementById('toon-foto-btn').addEventListener('click', () => {
    document.getElementById('over-mij-foto').classList.remove('hidden');
    document.getElementById('foto-tekst').classList.remove('hidden');
  });

  startQuiz();
});
