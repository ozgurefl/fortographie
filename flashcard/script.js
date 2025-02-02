document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.querySelector('.flashcard');
    const wordElement = document.getElementById('word');
    const definitionElement = document.getElementById('definition');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const setSelector = document.getElementById('set-selector');

    let currentIndex = 0;
    let flashcards = [];
    let currentSet = '';
    let isFlipped = false;

    // Fetch the JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            setSelector.innerHTML = ''; // Clear existing options
            data.flashcards.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category;
                option.textContent = category.category;
                setSelector.appendChild(option);
            });
            currentSet = data.flashcards[0].category;
            loadFlashcards(currentSet, data);
        });

    function loadFlashcards(set, data) {
        const categoryData = data.flashcards.find(category => category.category === set);
        flashcards = categoryData ? categoryData.cards : [];
        currentIndex = 0;
        updateFlashcard();
    }

    function updateFlashcard() {
        if (flashcards.length > 0) {
            wordElement.textContent = flashcards[currentIndex].word;
            definitionElement.innerHTML = `<strong>${flashcards[currentIndex].translation}</strong><br><em>${flashcards[currentIndex].example_fr}</em><br>${flashcards[currentIndex].example_en}`;
            resetFlashcard();
        }
    }

    function resetFlashcard() {
        flashcard.classList.remove('flipped');
        isFlipped = false;
    }

    setSelector.addEventListener('change', (event) => {
        currentSet = event.target.value;
        fetch('data.json')
            .then(response => response.json())
            .then(data => loadFlashcards(currentSet, data));
    });

    nextBtn.addEventListener('click', () => {
        if (flashcards.length > 0) {
            currentIndex = (currentIndex + 1) % flashcards.length;
            updateFlashcard();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (flashcards.length > 0) {
            currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
            updateFlashcard();
        }
    });

    flashcard.addEventListener('click', () => {
        flashcard.classList.toggle('flipped');
        isFlipped = !isFlipped;
    });

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            nextBtn.click();
        } else if (event.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (event.key === ' ') {
            flashcard.click();
        }
    });

    // Adjust flashcard size based on screen size
    function adjustFlashcardSize() {
        if (window.innerWidth > 768) {
            flashcard.style.width = '400px';
            flashcard.style.height = '250px';
        } else {
            flashcard.style.width = '300px';
            flashcard.style.height = '200px';
        }
    }

    window.addEventListener('resize', adjustFlashcardSize);
    adjustFlashcardSize();
});
