document.addEventListener('DOMContentLoaded', function() {
    // Настройка карусели
    $('.carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        centerMode: true,
        centerPadding: '0px',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    // Фильтрация животных
    const filterButtons = document.querySelectorAll('.filter-btn');
    const animalCards = document.querySelectorAll('.animal-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            animalCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Модальное окно заявки
    const modal = document.getElementById('inquiryModal');
    const inquiryButtons = document.querySelectorAll('.inquiry-btn');
    const closeModal = document.querySelector('.close-modal');
    const animalInput = document.getElementById('animal');

    inquiryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Получаем название животного из родительской карточки
            const animalCard = button.closest('.animal-card');
            const animalName = animalCard.querySelector('h4').textContent;
            animalInput.value = animalName;
            modal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Обработка формы заявки
    const inquiryForm = document.getElementById('inquiryForm');

    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');

        modal.style.display = 'none';
        inquiryForm.reset();
    });

    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.animal-card, .tip-card');

        cards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight * 0.9;

            if (cardPosition < screenPosition) {
                card.classList.add('card-visible');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});