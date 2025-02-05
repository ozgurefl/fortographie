let currentSentenceIndex = 0;
let correctCount = 0;
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
  updateSentenceSet();
});

// Update the displayed sentence and progress
function updateSentenceSet() {
  totalSentences.textContent = currentSet.length;
  progressCount.textContent = correctCount;
  displaySentence();
}

// Display the current sentence
function displaySentence() {
  sentenceDisplay.textContent = currentSet[currentSentenceIndex];
  userInput.value = "";
  feedback.textContent = "";

  // Auto-play TTS when a new sentence appears
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(currentSet[currentSentenceIndex]);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }
}

// Check user input in real-time
userInput.addEventListener('input', () => {
  const userText = normalizeText(userInput.value);
  const correctSentence = normalizeText(currentSet[currentSentenceIndex]);

  // Clear previous feedback
  sentenceDisplay.innerHTML = "";

  // Compare each character
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
      }
    }

    sentenceDisplay.appendChild(charSpan);
  }

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

// Initialize with the default set and theme
(async function initialize() {
  currentSet = await fetchSentences("set1");
  updateSentenceSet();

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