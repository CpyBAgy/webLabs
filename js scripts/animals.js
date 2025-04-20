document.addEventListener('DOMContentLoaded', function() {
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

    const modal = document.getElementById('inquiryModal');
    const inquiryButtons = document.querySelectorAll('.inquiry-btn');
    const closeModal = document.querySelector('.close-modal');
    const animalInput = document.getElementById('animal');

    inquiryButtons.forEach(button => {
        button.addEventListener('click', () => {
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

    function handleAnchor() {
        const hash = window.location.hash;
        if (hash) {
            const filter = hash.substring(1);

            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(button => {
                button.classList.remove('active');

                if (button.getAttribute('data-filter') === filter) {
                    button.classList.add('active');

                    const animalCards = document.querySelectorAll('.animal-card');
                    animalCards.forEach(card => {
                        if (filter === 'all' || card.classList.contains(filter)) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    const animalCatalog = document.getElementById('animal-catalog');
                    if (animalCatalog) {
                        setTimeout(() => {
                            animalCatalog.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }
                }
            });
        }
    }

    handleAnchor();

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});