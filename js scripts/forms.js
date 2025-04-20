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
    const insectCountElement = document.querySelector('#insectCount .stat-number');
    const otherCountElement = document.querySelector('#otherCount .stat-number');

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

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'reptile': return '<i class="fas fa-dragon"></i>';
            case 'bird': return '<i class="fas fa-feather-alt"></i>';
            case 'mammal': return '<i class="fas fa-horse"></i>';
            case 'insect': return '<i class="fas fa-spider"></i>';
            default: return '<i class="fas fa-paw"></i>';
        }
    };

    const showNotification = (message, type = 'success') => {
        notificationElement.textContent = message;
        notificationElement.className = `notification ${type}`;
        notificationElement.style.display = 'block';

        setTimeout(() => {
            notificationElement.style.display = 'none';
        }, 5000);
    };

    const updateStatistics = () => {
        const totalAnimals = animals.length;
        const reptileCount = animals.filter(animal =>
            getAnimalCategory(animal.type) === 'reptile').length;
        const birdCount = animals.filter(animal =>
            getAnimalCategory(animal.type) === 'bird').length;
        const mammalCount = animals.filter(animal =>
            getAnimalCategory(animal.type) === 'mammal').length;
        const insectCount = animals.filter(animal =>
            getAnimalCategory(animal.type) === 'insect').length;
        const otherCount = animals.filter(animal =>
            getAnimalCategory(animal.type) === 'unknown').length;

        totalAnimalsElement.textContent = totalAnimals;
        reptileCountElement.textContent = reptileCount;
        birdCountElement.textContent = birdCount;
        mammalCountElement.textContent = mammalCount;
        insectCountElement.textContent = insectCount;
        otherCountElement.textContent = otherCount;

        const chartPlaceholder = document.getElementById('chartPlaceholder');
        if (chartPlaceholder) {
            chartPlaceholder.innerHTML = '<canvas id="typeChart" width="100%" height="100%"></canvas>';

            const ctx = document.getElementById('typeChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Рептилии', 'Птицы', 'Млекопитающие', 'Насекомые', 'Другие'],
                    datasets: [{
                        data: [reptileCount, birdCount, mammalCount, insectCount, otherCount],
                        backgroundColor: [
                            'rgba(76, 175, 80, 0.7)',  // зеленый для рептилий
                            'rgba(33, 150, 243, 0.7)', // синий для птиц
                            'rgba(255, 152, 0, 0.7)',  // оранжевый для млекопитающих
                            'rgba(156, 39, 176, 0.7)',  // фиолетовый для насекомых
                            'rgba(213,189,77,0.7)' // желтый для других
                        ],
                        borderColor: [
                            'rgba(76, 175, 80, 1)',
                            'rgba(33, 150, 243, 1)',
                            'rgba(255, 152, 0, 1)',
                            'rgba(156, 39, 176, 1)',
                            'rgba(213,189,77,0.7)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Распределение по типам животных',
                            font: {
                                size: 16
                            }
                        }
                    }
                }
            });
        }
    };

    const createTypeTags = () => {
        typeTagsContainer.innerHTML = '';

        const uniqueTypes = [...new Set(animals.map(animal => animal.type))];

        uniqueTypes.forEach(type => {
            const category = getAnimalCategory(type);
            const tag = document.createElement('div');
            tag.className = `type-tag ${category}`;
            tag.innerHTML = `${getCategoryIcon(category)} ${type}`;

            tag.addEventListener('click', () => {
                if (tag.classList.contains('active')) {
                    tag.classList.remove('active');
                    searchInput.value = '';
                    applyFilters();
                } else {
                    document.querySelectorAll('.type-tag.active').forEach(activeTag => {
                        activeTag.classList.remove('active');
                    });

                    tag.classList.add('active');
                    searchInput.value = type;
                    applyFilters();
                }
            });

            typeTagsContainer.appendChild(tag);
        });
    };

    const renderAnimals = () => {
        tableBody.innerHTML = '';

        if (filteredAnimals.length === 0) {
            emptyTableMessage.style.display = 'block';
            animalTable.style.display = 'none';
            return;
        }

        emptyTableMessage.style.display = 'none';
        animalTable.style.display = 'table';

        filteredAnimals.forEach((animal, index) => {
            const row = document.createElement('tr');
            const category = getAnimalCategory(animal.type);

            let ageDisplay = animal.age;
            if (animal.ageUnit && animal.ageUnit === 'months') {
                ageDisplay = `${animal.age} мес.`;
            } else {
                ageDisplay = `${animal.age} лет`;
            }

            let genderDisplay = 'Неизвестно';
            if (animal.gender === 'male') {
                genderDisplay = 'Самец';
            } else if (animal.gender === 'female') {
                genderDisplay = 'Самка';
            }

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

    const applyFilters = () => {
        const searchQuery = searchInput.value.toLowerCase();

        const activeFilters = Array.from(filterButtons)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        filteredAnimals = animals.filter(animal => {
            const matchesSearch = animal.name.toLowerCase().includes(searchQuery) ||
                animal.type.toLowerCase().includes(searchQuery) ||
                (animal.description && animal.description.toLowerCase().includes(searchQuery));

            const category = getAnimalCategory(animal.type);
            const matchesCategory = activeFilters.includes(category) || category === 'unknown';

            return matchesSearch && matchesCategory;
        });

        const sortOption = Array.from(sortOptions).find(radio => radio.checked).value;

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

        renderAnimals();
    };

    const startEditingAnimal = (index) => {
        const animal = animals[index];

        document.getElementById('name').value = animal.name;

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

        currentEditIndex = index;
        formTitle.textContent = 'Редактирование животного';
        submitButton.innerHTML = '<i class="fas fa-save"></i> Сохранить';
        statusDot.style.backgroundColor = '#ff9800';
        statusText.textContent = 'Режим редактирования';

        form.scrollIntoView({ behavior: 'smooth' });
    };

    const resetForm = () => {
        form.reset();
        customTypeInput.style.display = 'none';
        currentEditIndex = null;
        formTitle.textContent = 'Добавление животного';
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Добавить';
        statusDot.style.backgroundColor = '#4caf50';
        statusText.textContent = 'Режим добавления';
    };

    const showDeleteConfirmation = (index) => {
        animalToDelete = index;
        const animal = animals[index];
        deleteAnimalNameElement.textContent = animal.name;
        deleteModal.style.display = 'flex';
    };

    const hideDeleteModal = () => {
        deleteModal.style.display = 'none';
        animalToDelete = null;
    };

    const deleteAnimal = (index) => {
        const animalName = animals[index].name;
        animals.splice(index, 1);
        localStorage.setItem('animals', JSON.stringify(animals));

        if (currentEditIndex === index) {
            resetForm();
        } else if (currentEditIndex !== null && currentEditIndex > index) {
            currentEditIndex--;
        }

        filteredAnimals = [...animals];
        applyFilters();
        createTypeTags();
        updateStatistics();

        showNotification(`Животное "${animalName}" успешно удалено`, 'success');
    };

    const initApp = () => {
        typeSelect.addEventListener('change', () => {
            if (typeSelect.value === 'other') {
                customTypeInput.style.display = 'block';
                customTypeInput.focus();
            } else {
                customTypeInput.style.display = 'none';
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();

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

            if (name && type && !isNaN(age) && age >= 0) {
                const animalData = { name, type, age, ageUnit, gender, description };

                if (currentEditIndex !== null) {
                    animals[currentEditIndex] = animalData;
                    showNotification(`Животное "${name}" успешно обновлено`, 'success');
                } else {
                    animals.push(animalData);
                    showNotification(`Животное "${name}" успешно добавлено`, 'success');
                }

                localStorage.setItem('animals', JSON.stringify(animals));

                filteredAnimals = [...animals];
                applyFilters();
                createTypeTags();
                updateStatistics();

                resetForm();
            } else {
                showNotification('Пожалуйста, заполните все обязательные поля корректно', 'error');
            }
        });

        cancelButton.addEventListener('click', resetForm);

        searchInput.addEventListener('input', applyFilters);

        filterButtons.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });

        sortOptions.forEach(radio => {
            radio.addEventListener('change', applyFilters);
        });

        confirmDeleteButton.addEventListener('click', () => {
            if (animalToDelete !== null) {
                deleteAnimal(animalToDelete);
                hideDeleteModal();
            }
        });

        cancelDeleteButton.addEventListener('click', hideDeleteModal);
        closeModalButton.addEventListener('click', hideDeleteModal);

        window.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                hideDeleteModal();
            }
        });

        createTypeTags();
        updateStatistics();
        applyFilters();
    };

    initApp();
});