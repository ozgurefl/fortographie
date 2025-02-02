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
            definitionElement.textContent = flashcards[currentIndex].translation;
        }
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
});
