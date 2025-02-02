document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.querySelector('.flashcard');
    const wordElement = document.getElementById('word');
    const definitionElement = document.getElementById('definition');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const setSelector = document.getElementById('set-selector');

    let currentIndex = 0;
    let flashcards = [];
    let currentSet = 'verbs';

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
    function goToPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            updateFlashcard();
        }
    }

    // Navigate to the next flashcard
    function goToNext() {
        if (currentIndex < flashcards.length - 1) {
            currentIndex++;
            updateFlashcard();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            goToPrevious();
        } else if (event.key === 'ArrowRight') {
            goToNext();
        }
    });

    // Touch navigation (swipe left/right)
    let touchStartX = 0;
    let touchEndX = 0;

    flashcard.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    });

    flashcard.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance to trigger navigation
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance > swipeThreshold) {
            goToPrevious(); // Swipe right
        } else if (swipeDistance < -swipeThreshold) {
            goToNext(); // Swipe left
        }
    }

    // Button navigation
    prevBtn.addEventListener('click', goToPrevious);
    nextBtn.addEventListener('click', goToNext);

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