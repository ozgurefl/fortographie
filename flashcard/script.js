document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.querySelector('.flashcard');
    const wordElement = document.getElementById('word');
    const definitionElement = document.getElementById('definition');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const setSelector = document.getElementById('set-selector');

    let currentIndex = 0;
    let flashcards = [];
    let currentSet = 'set1';

    // Fetch the JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            flashcards = data[currentSet];
            updateFlashcard();
        });

    // Update the flashcard content
    function updateFlashcard() {
        wordElement.textContent = flashcards[currentIndex].word;
        definitionElement.textContent = flashcards[currentIndex].definition;
        resetFlashcard(); // Ensure the flashcard starts with the word side
    }

    // Reset the flashcard to show the word side
    function resetFlashcard() {
        if (flashcard.classList.contains('flipped')) {
            flashcard.classList.remove('flipped');
        }
    }

    // Flip the flashcard
    flashcard.addEventListener('click', () => {
        flashcard.classList.toggle('flipped');
    });

    // Navigate to the previous flashcard
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateFlashcard();
        }
    });

    // Navigate to the next flashcard
    nextBtn.addEventListener('click', () => {
        if (currentIndex < flashcards.length - 1) {
            currentIndex++;
            updateFlashcard();
        }
    });

    // Change flashcard set
    setSelector.addEventListener('change', (event) => {
        currentSet = event.target.value;
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                flashcards = data[currentSet];
                currentIndex = 0;
                updateFlashcard();
            });
    });
});