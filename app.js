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
}

// Check user input in real-time
userInput.addEventListener('input', () => {
  const userText = userInput.value;
  const correctSentence = currentSet[currentSentenceIndex];

  // Clear previous feedback
  sentenceDisplay.innerHTML = "";

  // Compare each character
  for (let i = 0; i < correctSentence.length; i++) {
    const charSpan = document.createElement("span");
    charSpan.textContent = correctSentence[i];

    if (i < userText.length) {
      if (userText[i] === correctSentence[i]) {
        charSpan.classList.add("correct"); // Correct character
      } else {
        charSpan.classList.add("incorrect"); // Incorrect character
      }
    }

    sentenceDisplay.appendChild(charSpan);
  }

  // Check if the entire sentence is correct
  if (userText === correctSentence) {
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
    correctCount++;
    progressCount.textContent = correctCount;
    setTimeout(() => {
      currentSentenceIndex++;
      if (currentSentenceIndex < currentSet.length) {
        displaySentence();
      } else {
        feedback.textContent = "Congratulations! You've completed all sentences.";
        userInput.disabled = true;
      }
    }, 1000);
  } else {
    feedback.textContent = "Keep typing...";
    feedback.style.color = "black";
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

// Initialize with the default set
(async function initialize() {
  currentSet = await fetchSentences("set1");
  updateSentenceSet();
})();