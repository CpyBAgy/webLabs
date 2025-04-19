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

    // Расширенный список возможных питомцев для клиентов
    const petTypes = [
        'Зеленая игуана', 'Йеменский хамелеон', 'Сине-жёлтый ара',
        'Тукан Токо', 'Капуцин', 'Одногорбый верблюд', 'Розовый птицеед',
        'Императорский скорпион', 'Бородатая агама', 'Мадагаскарский таракан',
        'Африканский серый попугай', 'Венценосный голубь', 'Сахарная сумчатая летяга',
        'Красноухая черепаха', 'Геккон Токи', 'Императорский удав', 'Паук-птицеед Брахипельма',
        'Сенегальский попугай', 'Королевский питон', 'Суринамская пипа'
    ];

    // Случайные цитаты клиентов
    const testimonials = [
        'Благодаря "Два Холма" я стал счастливым обладателем редкого вида хамелеона. Консультации по уходу оказались бесценными!',
        'Приобрели здесь экзотического попугая для дочери. Поражены уровнем сервиса и заботой о животных!',
        'Лучший магазин экзотических животных! Специалисты помогли подобрать идеальные условия для моего питона.',
        'Огромное спасибо за помощь в обустройстве террариума для моей игуаны. Теперь у нее идеальные условия!',
        'Всегда приезжаю сюда за кормом и аксессуарами. Приятно, что продавцы помнят всех моих питомцев по именам!',
        'Благодаря семинарам "Два Холма" я научился правильно ухаживать за своими экзотическими питомцами.',
        'Не представляю, что бы делал без ветеринарной поддержки этого магазина. Спасли моего хамелеона!'
    ];

    // Функция для назначения случайных питомцев
    const assignRandomPets = (client) => {
        // Количество питомцев от 1 до 3
        const numPets = Math.floor(Math.random() * 3) + 1;
        const pets = [];

        for (let i = 0; i < numPets; i++) {
            const randomIndex = Math.floor(Math.random() * petTypes.length);
            // Убедимся, что нет дубликатов
            if (!pets.includes(petTypes[randomIndex])) {
                pets.push(petTypes[randomIndex]);
            }
        }

        // Добавляем случайное свидетельство
        const testimonialIndex = Math.floor(Math.random() * testimonials.length);

        return {
            ...client,
            pets,
            testimonial: testimonials[testimonialIndex]
        };
    };

    // Функция для отображения карточек клиентов
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

            // Устанавливаем данные клиента
            clone.querySelector('.client-name').textContent = client.name;
            clone.querySelector('.location-text').textContent = `${client.address.city}, ${client.address.street}`;
            clone.querySelector('.email-text').textContent = client.email;
            clone.querySelector('.phone-text').textContent = client.phone;

            // Добавляем отзыв клиента
            const testimonialElement = clone.querySelector('.client-testimonial');
            if (testimonialElement) {
                testimonialElement.textContent = `«${client.testimonial}»`;
            }

            // Создаем теги для питомцев
            const petTagsContainer = clone.querySelector('.pet-tags');
            client.pets.forEach(pet => {
                const petTag = document.createElement('span');
                petTag.className = 'pet-tag';

                // Назначаем класс в зависимости от типа питомца
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

            // Устанавливаем ссылку на сайт
            const websiteLink = clone.querySelector('.website-link');
            websiteLink.href = `https://${client.website}`;
            websiteLink.textContent = `${client.website}`;

            // Используем первую букву имени для аватара
            const avatarPlaceholder = clone.querySelector('.avatar-placeholder');
            avatarPlaceholder.textContent = client.name.charAt(0);

            // Добавляем случайный цвет для аватара
            const colors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#e91e63', '#3f51b5', '#009688'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            avatarPlaceholder.style.backgroundColor = randomColor;

            // Добавляем анимацию появления с задержкой для эффекта каскада
            const clientCard = clone.querySelector('.client-card');
            setTimeout(() => {
                clientCard.classList.add('visible');
            }, 100);

            clientsContainer.appendChild(clone);
        });

        updatePagination();
    };

    // Обновление пагинации
    const updatePagination = () => {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === Math.ceil(filteredClients.length / itemsPerPage);

        // Обновляем индикаторы страниц
        pageIndicators.innerHTML = '';
        const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

        // Логика отображения нумерации страниц
        let startPage = 1;
        let endPage = totalPages;

        // Если больше 5 страниц, показываем только часть
        if (totalPages > 5) {
            if (currentPage <= 3) {
                // Находимся в начале
                endPage = 5;
            } else if (currentPage >= totalPages - 2) {
                // Находимся в конце
                startPage = totalPages - 4;
            } else {
                // Находимся в середине
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        // Если мы не начинаем с первой страницы, показываем первую и многоточие
        if (startPage > 1) {
            addPageIndicator(1);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageIndicators.appendChild(ellipsis);
            }
        }

        // Добавляем индикаторы страниц
        for (let i = startPage; i <= endPage; i++) {
            addPageIndicator(i);
        }

        // Если мы не заканчиваем последней страницей, показываем многоточие и последнюю
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

    // Функция для создания индикатора страницы
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
                // Прокручиваем к началу секции клиентов
                clientsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        pageIndicators.appendChild(indicator);
    };

    // Загрузка данных клиентов
    const fetchClients = async () => {
        try {
            preloader.classList.add('active');

            // Добавляем задержку для демонстрации прелоадера
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Ошибка сети');

            // Получаем данные и добавляем случайных питомцев
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

    // Обработчики для кнопок пагинации
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderClients();
            // Прокручиваем к началу секции клиентов
            clientsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredClients.length / itemsPerPage)) {
            currentPage++;
            renderClients();
            // Прокручиваем к началу секции клиентов
            clientsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Поиск клиентов
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

    // Обработчик формы присоединения к сообществу
    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('joinName').value;
            const email = document.getElementById('joinEmail').value;

            // Создаем и показываем уведомление
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 10px;"></i> Спасибо, <strong>${name}</strong>! Ваша заявка принята. Мы свяжемся с вами по электронной почте <strong>${email}</strong> в ближайшее время.`;

            joinForm.reset();

            // Добавляем уведомление перед формой
            joinForm.parentNode.insertBefore(notification, joinForm);

            // Прокручиваем к уведомлению
            notification.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Убираем уведомление через 5 секунд
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        });
    }

    // Загружаем данные клиентов при загрузке страницы
    fetchClients();
});