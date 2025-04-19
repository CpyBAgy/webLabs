document.addEventListener('DOMContentLoaded', () => {
    // Элементы формы
    const form = document.getElementById('animalForm');
    const typeSelect = document.getElementById('type');
    const customTypeInput = document.getElementById('customType');
    const ageInput = document.getElementById('age');
    const ageUnitSelect = document.getElementById('ageUnit');
    const submitButton = document.getElementById('submitButton');
    const cancelButton = document.getElementById('cancelButton');
    const formTitle = document.getElementById('formTitle');
    const formStatus = document.getElementById('formStatus');
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    // Элементы таблицы
    const animalTable = document.getElementById('animalTable');
    const tableBody = animalTable.querySelector('tbody');
    const emptyTableMessage = document.getElementById('emptyTable');
    const searchInput = document.getElementById('searchAnimal');

    // Фильтры и сортировка
    const filterButtons = document.querySelectorAll('.filter-option input');
    const sortOptions = document.querySelectorAll('.sort-option input');
    const typeTagsContainer = document.getElementById('animalTypes');

    // Статистика
    const totalAnimalsElement = document.querySelector('#totalAnimals .stat-number');
    const reptileCountElement = document.querySelector('#reptileCount .stat-number');
    const birdCountElement = document.querySelector('#birdCount .stat-number');
    const mammalCountElement = document.querySelector('#mammalCount .stat-number');

    // Элементы модального окна
    const deleteModal = document.getElementById('deleteModal');
    const deleteAnimalNameElement = document.getElementById('deleteAnimalName');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    const closeModalButton = document.querySelector('.close-modal');

    // Элемент уведомления
    const notificationElement = document.getElementById('notification');

    // Состояние приложения
    let animals = JSON.parse(localStorage.getItem('animals')) || [];
    let filteredAnimals = [...animals];
    let currentEditIndex = null;
    let animalToDelete = null;

    // Карта категорий животных
    const animalCategories = {
        reptiles: [
            'Зеленая игуана', 'Йеменский хамелеон', 'Бородатая агама',
            'Королевский питон', 'Красноухая черепаха', 'Геккон'
        ],
        birds: [
            'Сине-жёлтый ара', 'Африканский серый попугай', 'Тукан Токо',
            'Венценосный голубь', 'Попугай', 'Ара'
        ],
        mammals: [
            'Капуцин', 'Одногорбый верблюд', 'Сахарная сумчатая летяга',
            'Обезьяна', 'Верблюд'
        ],
        insects: [
            'Розовый птицеед', 'Императорский скорпион', 'Мадагаскарский таракан',
            'Скорпион', 'Таракан', 'Паук'
        ]
    };

    // Функция определения категории животного
    const getAnimalCategory = (type) => {
        const lowercaseType = type.toLowerCase();

        if (animalCategories.reptiles.some(reptile =>
            lowercaseType.includes(reptile.toLowerCase()))) {
            return 'reptile';
        } else if (animalCategories.birds.some(bird =>
            lowercaseType.includes(bird.toLowerCase()))) {
            return 'bird';
        } else if (animalCategories.mammals.some(mammal =>
            lowercaseType.includes(mammal.toLowerCase()))) {
            return 'mammal';
        } else if (animalCategories.insects.some(insect =>
            lowercaseType.includes(insect.toLowerCase()))) {
            return 'insect';
        }

        return 'unknown';
    };

    // Функция получения иконки для категории
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'reptile': return '<i class="fas fa-dragon"></i>';
            case 'bird': return '<i class="fas fa-feather-alt"></i>';
            case 'mammal': return '<i class="fas fa-horse"></i>';
            case 'insect': return '<i class="fas fa-spider"></i>';
            default: return '<i class="fas fa-paw"></i>';
        }
    };

    // Функция для показа уведомления
    const showNotification = (message, type = 'success') => {
        notificationElement.textContent = message;
        notificationElement.className = `notification ${type}`;
        notificationElement.style.display = 'block';

        // Автоматически скрываем уведомление через 5 секунд
        setTimeout(() => {
            notificationElement.style.display = 'none';
        }, 5000);
    };

    // Функция для обновления статистики
    const updateStatistics = () => {
        const totalAnimals = animals.length;
        const reptileCount = animals.filter(animal =>
            getAnimalCategory(animal.type) === 'reptile').length;
        const birdCount = animals.filter(animal =>
            getAnimalCategory(animal.type) === 'bird').length;
        const mammalCount = animals.filter(animal =>
            getAnimalCategory(animal.type) === 'mammal').length;

        totalAnimalsElement.textContent = totalAnimals;
        reptileCountElement.textContent = reptileCount;
        birdCountElement.textContent = birdCount;
        mammalCountElement.textContent = mammalCount;
    };

    // Функция для создания тегов типов животных
    const createTypeTags = () => {
        // Очищаем контейнер
        typeTagsContainer.innerHTML = '';

        // Получаем уникальные типы животных
        const uniqueTypes = [...new Set(animals.map(animal => animal.type))];

        // Создаем теги для каждого типа
        uniqueTypes.forEach(type => {
            const category = getAnimalCategory(type);
            const tag = document.createElement('div');
            tag.className = `type-tag ${category}`;
            tag.innerHTML = `${getCategoryIcon(category)} ${type}`;

            // Добавляем обработчик события для фильтрации
            tag.addEventListener('click', () => {
                // Если уже активен этот тег - сбрасываем фильтр
                if (tag.classList.contains('active')) {
                    tag.classList.remove('active');
                    searchInput.value = '';
                    applyFilters();
                } else {
                    // Удаляем активный класс у всех тегов
                    document.querySelectorAll('.type-tag.active').forEach(activeTag => {
                        activeTag.classList.remove('active');
                    });

                    // Активируем текущий тег
                    tag.classList.add('active');
                    searchInput.value = type;
                    applyFilters();
                }
            });

            typeTagsContainer.appendChild(tag);
        });
    };

    // Функция для отображения списка животных с фильтрацией и сортировкой
    const renderAnimals = () => {
        // Очищаем таблицу
        tableBody.innerHTML = '';

        // Если список пуст, показываем сообщение
        if (filteredAnimals.length === 0) {
            emptyTableMessage.style.display = 'block';
            animalTable.style.display = 'none';
            return;
        }

        // Иначе показываем таблицу
        emptyTableMessage.style.display = 'none';
        animalTable.style.display = 'table';

        // Добавляем строки для каждого животного
        filteredAnimals.forEach((animal, index) => {
            const row = document.createElement('tr');
            const category = getAnimalCategory(animal.type);

            // Преобразуем возраст в строку
            let ageDisplay = animal.age;
            if (animal.ageUnit && animal.ageUnit === 'months') {
                ageDisplay = `${animal.age} мес.`;
            } else {
                ageDisplay = `${animal.age} лет`;
            }

            // Преобразуем пол в строку
            let genderDisplay = 'Неизвестно';
            if (animal.gender === 'male') {
                genderDisplay = 'Самец';
            } else if (animal.gender === 'female') {
                genderDisplay = 'Самка';
            }

            // Генерируем HTML для строки
            row.innerHTML = `
                <td>${animal.name}</td>
                <td class="animal-type ${category}">
                    ${getCategoryIcon(category)} <span>${animal.type}</span>
                </td>
                <td>${ageDisplay}</td>
                <td>${genderDisplay}</td>
                <td>${animal.description || '-'}</td>
                <td class="actions">
                    <button class="action-button edit-button" data-index="${index}">
                        <i class="fas fa-edit"></i> Изменить
                    </button>
                    <button class="action-button delete-button" data-index="${index}">
                        <i class="fas fa-trash-alt"></i> Удалить
                    </button>
                </td>
            `;

            // Добавляем обработчики событий для кнопок
            const editButton = row.querySelector('.edit-button');
            editButton.addEventListener('click', () => {
                startEditingAnimal(index);
            });

            const deleteButton = row.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                showDeleteConfirmation(index);
            });

            tableBody.appendChild(row);
        });
    };

    // Функция для применения фильтров и сортировки
    const applyFilters = () => {
        // Получаем значение поиска
        const searchQuery = searchInput.value.toLowerCase();

        // Получаем активные фильтры категорий
        const activeFilters = Array.from(filterButtons)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Фильтруем животных
        filteredAnimals = animals.filter(animal => {
            // Проверка на соответствие поисковому запросу
            const matchesSearch = animal.name.toLowerCase().includes(searchQuery) ||
                animal.type.toLowerCase().includes(searchQuery) ||
                (animal.description && animal.description.toLowerCase().includes(searchQuery));

            // Проверка на соответствие категории
            const category = getAnimalCategory(animal.type);
            const matchesCategory = activeFilters.includes(category) || category === 'unknown';

            return matchesSearch && matchesCategory;
        });

        // Получаем выбранный вариант сортировки
        const sortOption = Array.from(sortOptions).find(radio => radio.checked).value;

        // Сортируем животных
        filteredAnimals.sort((a, b) => {
            switch (sortOption) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'type':
                    return a.type.localeCompare(b.type);
                case 'age':
                    const aAgeInMonths = a.ageUnit === 'months' ? a.age : a.age * 12;
                    const bAgeInMonths = b.ageUnit === 'months' ? b.age : b.age * 12;
                    return aAgeInMonths - bAgeInMonths;
                default:
                    return 0;
            }
        });

        // Обновляем таблицу
        renderAnimals();
    };

    // Функция для начала редактирования животного
    const startEditingAnimal = (index) => {
        const animal = animals[index];

        // Заполняем форму данными животного
        document.getElementById('name').value = animal.name;

        // Если тип животного есть в списке, выбираем его
        // Иначе выбираем "Другой" и заполняем поле пользовательского типа
        if (Array.from(typeSelect.options).some(option => option.value === animal.type)) {
            typeSelect.value = animal.type;
            customTypeInput.style.display = 'none';
        } else {
            typeSelect.value = 'other';
            customTypeInput.value = animal.type;
            customTypeInput.style.display = 'block';
        }

        ageInput.value = animal.age;
        ageUnitSelect.value = animal.ageUnit || 'years';
        document.getElementById('gender').value = animal.gender || 'unknown';
        document.getElementById('description').value = animal.description || '';

        // Переключаем режим формы на редактирование
        currentEditIndex = index;
        formTitle.textContent = 'Редактирование животного';
        submitButton.innerHTML = '<i class="fas fa-save"></i> Сохранить';
        statusDot.style.backgroundColor = '#ff9800';
        statusText.textContent = 'Режим редактирования';

        // Прокручиваем к форме
        form.scrollIntoView({ behavior: 'smooth' });
    };

    // Функция для сброса формы
    const resetForm = () => {
        form.reset();
        customTypeInput.style.display = 'none';
        currentEditIndex = null;
        formTitle.textContent = 'Добавление животного';
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Добавить';
        statusDot.style.backgroundColor = '#4caf50';
        statusText.textContent = 'Режим добавления';
    };

    // Функция для показа модального окна подтверждения удаления
    const showDeleteConfirmation = (index) => {
        animalToDelete = index;
        const animal = animals[index];
        deleteAnimalNameElement.textContent = animal.name;
        deleteModal.style.display = 'flex';
    };

    // Функция для скрытия модального окна
    const hideDeleteModal = () => {
        deleteModal.style.display = 'none';
        animalToDelete = null;
    };

    // Функция для удаления животного
    const deleteAnimal = (index) => {
        const animalName = animals[index].name;
        animals.splice(index, 1);
        localStorage.setItem('animals', JSON.stringify(animals));

        // Если мы редактировали это животное, сбрасываем форму
        if (currentEditIndex === index) {
            resetForm();
        } else if (currentEditIndex !== null && currentEditIndex > index) {
            // Если индекс редактируемого животного больше удаленного, корректируем его
            currentEditIndex--;
        }

        // Обновляем отображение
        filteredAnimals = [...animals];
        applyFilters();
        createTypeTags();
        updateStatistics();

        showNotification(`Животное "${animalName}" успешно удалено`, 'success');
    };

    // Инициализация приложения
    const initApp = () => {
        // Обработка изменения типа животного
        typeSelect.addEventListener('change', () => {
            if (typeSelect.value === 'other') {
                customTypeInput.style.display = 'block';
                customTypeInput.focus();
            } else {
                customTypeInput.style.display = 'none';
            }
        });

        // Обработка отправки формы
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Получаем данные из формы
            const name = document.getElementById('name').value.trim();

            // Определяем тип животного (из списка или пользовательский)
            let type = typeSelect.value;
            if (type === 'other') {
                type = customTypeInput.value.trim();
                if (!type) {
                    showNotification('Пожалуйста, укажите вид животного', 'error');
                    return;
                }
            }

            const age = parseFloat(ageInput.value);
            const ageUnit = ageUnitSelect.value;
            const gender = document.getElementById('gender').value;
            const description = document.getElementById('description').value.trim();

            // Проверяем валидность данных
            if (name && type && !isNaN(age) && age >= 0) {
                const animalData = { name, type, age, ageUnit, gender, description };

                if (currentEditIndex !== null) {
                    // Режим редактирования
                    animals[currentEditIndex] = animalData;
                    showNotification(`Животное "${name}" успешно обновлено`, 'success');
                } else {
                    // Режим добавления
                    animals.push(animalData);
                    showNotification(`Животное "${name}" успешно добавлено`, 'success');
                }

                // Сохраняем в localStorage
                localStorage.setItem('animals', JSON.stringify(animals));

                // Обновляем отображение
                filteredAnimals = [...animals];
                applyFilters();
                createTypeTags();
                updateStatistics();

                // Сбрасываем форму
                resetForm();
            } else {
                showNotification('Пожалуйста, заполните все обязательные поля корректно', 'error');
            }
        });

        // Обработка кнопки отмены
        cancelButton.addEventListener('click', resetForm);

        // Обработка поиска
        searchInput.addEventListener('input', applyFilters);

        // Обработка изменения фильтров
        filterButtons.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });

        // Обработка изменения сортировки
        sortOptions.forEach(radio => {
            radio.addEventListener('change', applyFilters);
        });

        // Обработка подтверждения удаления
        confirmDeleteButton.addEventListener('click', () => {
            if (animalToDelete !== null) {
                deleteAnimal(animalToDelete);
                hideDeleteModal();
            }
        });

        // Обработка отмены удаления
        cancelDeleteButton.addEventListener('click', hideDeleteModal);
        closeModalButton.addEventListener('click', hideDeleteModal);

        // Закрытие модального окна при клике вне его
        window.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                hideDeleteModal();
            }
        });

        // Инициализируем отображение
        createTypeTags();
        updateStatistics();
        applyFilters();
    };

    // Запускаем инициализацию приложения
    initApp();
});