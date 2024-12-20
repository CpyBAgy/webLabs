document.addEventListener('DOMContentLoaded', () => {
    const userTable = document.getElementById('userTable');
    const template = document.getElementById('user-row-template');
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let users = [];
    let currentPage = 1;
    const itemsPerPage = 5;

    const fetchUsers = async () => {
        try {
            preloader.classList.add('active');
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Ошибка сети');
            users = await response.json();
            renderUsers();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            preloader.classList.remove('active');
        }
    };
    const renderUsers = () => {
        userTable.querySelectorAll('.cell').forEach(cell => cell.remove());
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageUsers = users.slice(startIndex, endIndex);
        currentPageUsers.forEach(user => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.name').textContent = user.name;
            clone.querySelector('.email').textContent = user.email;
            clone.querySelector('.phone').textContent = user.phone;
            clone.querySelector('.site').innerHTML = `<a href="http://${user.website}" target="_blank">${user.website}</a>`;
            userTable.appendChild(clone);
        });
        updatePaginationButtons();
    };
    const updatePaginationButtons = () => {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === Math.ceil(users.length / itemsPerPage);
    };
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsers();
        }
    });
    nextBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(users.length / itemsPerPage)) {
            currentPage++;
            renderUsers();
        }
    });

    fetchUsers();
});