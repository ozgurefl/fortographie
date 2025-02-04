let currentSentenceIndex = 0;
let correctCount = 0;
let errorCount = 0;
let currentSet = []; // Will store the current sentence set

// DOM elements
const sentenceDisplay = document.getElementById('sentence-display');
const userInput = document.getElementById('user-input');
const feedback = document.getElementById('feedback');
const progressCount = document.getElementById('progress-count');
const totalSentences = document.getElementById('total-sentences');
const virtualKeyboard = document.getElementById('virtual-keyboard');
const sentenceSetDropdown = document.getElementById('sentence-set');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const listenBtn = document.getElementById('listen-btn');

// Speech synthesis
let synth = window.speechSynthesis;
let voicesLoaded = false;

// Timer variables
let startTime = null;
let timerInterval = null;

// Fetch sentences from a JSON file
async function fetchSentences(setName) {
  try {
    const response = await fetch(`${setName}.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch sentences");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sentences:", error);
    return [];
  }
}

// Function to normalize apostrophes
function normalizeText(text) {
  return text.replace(/’/g, "'"); // Replace curly apostrophe with straight apostrophe
}

// Update sentence set based on user selection
sentenceSetDropdown.addEventListener('change', async () => {
  const selectedSet = sentenceSetDropdown.value;
  currentSet = await fetchSentences(selectedSet);
  currentSentenceIndex = 0;
  correctCount = 0;
  errorCount = 0;
  updateSentenceSet();
});

// Update the displayed sentence and progress
function updateSentenceSet() {
  totalSentences.textContent = currentSet.length;
  progressCount.textContent = correctCount;
  document.getElementById('error-count').textContent = errorCount;
  displaySentence();
}

// Display the current sentence
function displaySentence() {
  sentenceDisplay.textContent = currentSet[currentSentenceIndex];
  userInput.value = "";
  feedback.textContent = "";
  errorCount = 0;
  document.getElementById('error-count').textContent = errorCount;

  // Speak the sentence automatically when it changes
  speakSentence();
}

// Check user input in real-time
userInput.addEventListener('input', () => {
  const userText = normalizeText(userInput.value);
  const correctSentence = normalizeText(currentSet[currentSentenceIndex]);

  // Clear previous feedback
  sentenceDisplay.innerHTML = "";

  // Compare each character
  let currentErrors = 0; // Track errors for the current sentence
  for (let i = 0; i < correctSentence.length; i++) {
    const charSpan = document.createElement("span");
    charSpan.textContent = correctSentence[i];
    charSpan.style.fontFamily = 'Monospace';
    charSpan.style.backgroundColor = '#f6f8fa';
    charSpan.style.padding = '2px 4px';
    charSpan.style.borderRadius = '4px';
    charSpan.style.margin = '0 1px';

    if (i < userText.length) {
      if (userText[i] === correctSentence[i]) {
        charSpan.style.color = "#28a745"; // GitHub green
      } else {
        charSpan.style.color = "#d73a49"; // GitHub red
        currentErrors++; // Increment error count
      }
    }

    sentenceDisplay.appendChild(charSpan);
  }

  // Update the total error count
  errorCount += currentErrors;
  document.getElementById('error-count').textContent = errorCount;

  // Check if the entire sentence is correct
  if (userText === correctSentence) {
    feedback.textContent = "✔ Correct!";
    feedback.style.color = "#28a745";
    correctCount++;
    progressCount.textContent = correctCount;
    setTimeout(() => {
      currentSentenceIndex++;
      if (currentSentenceIndex < currentSet.length) {
        displaySentence();
      } else {
        feedback.textContent = "🎉 Congratulations! You've completed all sentences.";
        userInput.disabled = true;
        stopTimer(); // Stop the timer when all sentences are completed
      }
    }, 1000);
  } else {
    feedback.textContent = "Keep typing...";
    feedback.style.color = "#0366d6"; // GitHub blue
  }
});

// Virtual keyboard functionality
virtualKeyboard.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const char = e.target.getAttribute('data-char');
    userInput.value += char;
    userInput.focus();
  }
});

// Theme toggle functionality
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDarkTheme = document.body.classList.contains('dark-theme');
  themeToggleBtn.textContent = isDarkTheme ? '☀️' : '🌙';
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
});

// Speech synthesis functionality
function speakSentence() {
  if (!voicesLoaded) {
    console.warn("Voices are not yet loaded.");
    return;
  }

  if (synth.speaking) {
    console.error("SpeechSynthesis is already speaking.");
    return;
  }

  const sentence = currentSet[currentSentenceIndex];
  const utterance = new SpeechSynthesisUtterance(sentence);

  // Set language to French
  utterance.lang = 'fr-FR';

  // Customize speech
  utterance.pitch = 1; // Range: 0 to 2
  utterance.rate = 1; // Range: 0.1 to 10
  utterance.volume = 1; // Range: 0 to 1

  // Select a French voice
  const voices = synth.getVoices();
  const frenchVoice = voices.find(voice => voice.lang === 'fr-FR');
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  // Speak the sentence
  synth.speak(utterance);
}

// Load voices when they become available
synth.onvoiceschanged = () => {
  voicesLoaded = true;
  console.log("Voices loaded:", synth.getVoices());
};

// Timer functionality
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
  const seconds = (elapsedTime % 60).toString().padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function stopTimer() {
  clearInterval(timerInterval);
}

// Initialize with the default set and theme
(async function initialize() {
  currentSet = await fetchSentences("set1");
  updateSentenceSet();
  startTimer(); // Start the timer when the app initializes

  // Set theme based on localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-theme');
    themeToggleBtn.textContent = '🌙';
  }
})();