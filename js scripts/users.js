document.addEventListener('DOMContentLoaded', () => {
    const clientsContainer = document.getElementById('clientsContainer');
    const template = document.getElementById('client-card-template');
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicators = document.getElementById('pageIndicators');
    const searchInput = document.getElementById('clientSearch');
    const preloader = document.getElementById('preloader');
    const joinForm = document.getElementById('joinForm');

    let clients = [];
    let filteredClients = [];
    let currentPage = 1;
    const itemsPerPage = 4;

    const petTypes = [
        'Зеленая игуана', 'Йеменский хамелеон', 'Сине-жёлтый ара',
        'Тукан Токо', 'Капуцин', 'Одногорбый верблюд', 'Розовый птицеед',
        'Императорский скорпион', 'Бородатая агама', 'Мадагаскарский таракан',
        'Африканский серый попугай', 'Венценосный голубь', 'Сахарная сумчатая летяга',
        'Красноухая черепаха', 'Геккон Токи', 'Императорский удав', 'Паук-птицеед Брахипельма',
        'Сенегальский попугай', 'Королевский питон', 'Суринамская пипа'
    ];

    const testimonials = [
        'Благодаря "Два Холма" я стал счастливым обладателем редкого вида хамелеона. Консультации по уходу оказались бесценными!',
        'Приобрели здесь экзотического попугая для дочери. Поражены уровнем сервиса и заботой о животных!',
        'Лучший магазин экзотических животных! Специалисты помогли подобрать идеальные условия для моего питона.',
        'Огромное спасибо за помощь в обустройстве террариума для моей игуаны. Теперь у нее идеальные условия!',
        'Всегда приезжаю сюда за кормом и аксессуарами. Приятно, что продавцы помнят всех моих питомцев по именам!',
        'Благодаря семинарам "Два Холма" я научился правильно ухаживать за своими экзотическими питомцами.',
        'Не представляю, что бы делал без ветеринарной поддержки этого магазина. Спасли моего хамелеона!'
    ];

    const assignRandomPets = (client) => {
        const numPets = Math.floor(Math.random() * 3) + 1;
        const pets = [];

        for (let i = 0; i < numPets; i++) {
            const randomIndex = Math.floor(Math.random() * petTypes.length);
            if (!pets.includes(petTypes[randomIndex])) {
                pets.push(petTypes[randomIndex]);
            }
        }

        const testimonialIndex = Math.floor(Math.random() * testimonials.length);

        return {
            ...client,
            pets,
            testimonial: testimonials[testimonialIndex]
        };
    };

    const renderClients = () => {
        clientsContainer.innerHTML = '';

        if (filteredClients.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = '<i class="fas fa-search" style="font-size: 2rem; margin-bottom: 15px; color: #999;"></i><br>Клиенты не найдены. Попробуйте изменить параметры поиска.';
            clientsContainer.appendChild(emptyMessage);
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredClients.length);
        const currentClients = filteredClients.slice(startIndex, endIndex);

        currentClients.forEach(client => {
            const clone = template.content.cloneNode(true);

            clone.querySelector('.client-name').textContent = client.name;
            clone.querySelector('.location-text').textContent = `${client.address.city}, ${client.address.street}`;
            clone.querySelector('.email-text').textContent = client.email;
            clone.querySelector('.phone-text').textContent = client.phone;

            const testimonialElement = clone.querySelector('.client-testimonial');
            if (testimonialElement) {
                testimonialElement.textContent = `«${client.testimonial}»`;
            }

            const petTagsContainer = clone.querySelector('.pet-tags');
            client.pets.forEach(pet => {
                const petTag = document.createElement('span');
                petTag.className = 'pet-tag';

                if (pet.toLowerCase().includes('игуана') ||
                    pet.toLowerCase().includes('хамелеон') ||
                    pet.toLowerCase().includes('агама') ||
                    pet.toLowerCase().includes('геккон') ||
                    pet.toLowerCase().includes('черепаха') ||
                    pet.toLowerCase().includes('питон') ||
                    pet.toLowerCase().includes('удав')) {
                    petTag.classList.add('reptile-tag');
                } else if (pet.toLowerCase().includes('ара') ||
                    pet.toLowerCase().includes('тукан') ||
                    pet.toLowerCase().includes('попугай') ||
                    pet.toLowerCase().includes('голубь')) {
                    petTag.classList.add('bird-tag');
                } else if (pet.toLowerCase().includes('капуцин') ||
                    pet.toLowerCase().includes('верблюд') ||
                    pet.toLowerCase().includes('летяга')) {
                    petTag.classList.add('mammal-tag');
                } else {
                    petTag.classList.add('insect-tag');
                }

                petTag.textContent = pet;
                petTagsContainer.appendChild(petTag);
            });

            const websiteLink = clone.querySelector('.website-link');
            websiteLink.href = `https://${client.website}`;
            websiteLink.textContent = `${client.website}`;

            const avatarPlaceholder = clone.querySelector('.avatar-placeholder');
            avatarPlaceholder.textContent = client.name.charAt(0);

            const colors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#e91e63', '#3f51b5', '#009688'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            avatarPlaceholder.style.backgroundColor = randomColor;

            const clientCard = clone.querySelector('.client-card');
            setTimeout(() => {
                clientCard.classList.add('visible');
            }, 100);

            clientsContainer.appendChild(clone);
        });

        updatePagination();
    };

    const updatePagination = () => {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === Math.ceil(filteredClients.length / itemsPerPage);

        pageIndicators.innerHTML = '';
        const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

        let startPage = 1;
        let endPage = totalPages;

        if (totalPages > 5) {
            if (currentPage <= 3) {
                endPage = 5;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        if (startPage > 1) {
            addPageIndicator(1);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageIndicators.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            addPageIndicator(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageIndicators.appendChild(ellipsis);
            }
            addPageIndicator(totalPages);
        }
    };

    const addPageIndicator = (pageNum) => {
        const indicator = document.createElement('span');
        indicator.className = 'page-indicator';
        if (pageNum === currentPage) {
            indicator.classList.add('active');
        }
        indicator.textContent = pageNum;
        indicator.addEventListener('click', () => {
            if (pageNum !== currentPage) {
                currentPage = pageNum;
                renderClients();
                clientsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        pageIndicators.appendChild(indicator);
    };

    const fetchClients = async () => {
        try {
            preloader.classList.add('active');

            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Ошибка сети');

            const data = await response.json();
            clients = data.map(client => assignRandomPets(client));

            filteredClients = [...clients];
            renderClients();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = '<i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px;"></i><br>Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.';
            clientsContainer.appendChild(errorMessage);
        } finally {
            preloader.classList.remove('active');
        }
    };

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderClients();
            clientsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredClients.length / itemsPerPage)) {
            currentPage++;
            renderClients();
            clientsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value.toLowerCase().trim();

        if (searchQuery === '') {
            filteredClients = [...clients];
        } else {
            filteredClients = clients.filter(client =>
                client.name.toLowerCase().includes(searchQuery) ||
                client.email.toLowerCase().includes(searchQuery) ||
                client.address.city.toLowerCase().includes(searchQuery) ||
                client.pets.some(pet => pet.toLowerCase().includes(searchQuery))
            );
        }

        currentPage = 1;
        renderClients();
    });

    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('joinName').value;
            const email = document.getElementById('joinEmail').value;

            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 10px;"></i> Спасибо, <strong>${name}</strong>! Ваша заявка принята. Мы свяжемся с вами по электронной почте <strong>${email}</strong> в ближайшее время.`;

            joinForm.reset();

            joinForm.parentNode.insertBefore(notification, joinForm);

            notification.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        });
    }

    fetchClients();
});