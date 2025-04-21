document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.querySelector('.auth-button');
    const authStatus = document.querySelector('.auth-status');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || 'Гость';

    updateAuthUI(isLoggedIn, userName);

    authButton.addEventListener('click', function() {
        const currentStatus = localStorage.getItem('isLoggedIn') === 'true';

        if (currentStatus) {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('userName');
            updateAuthUI(false, 'Гость');
        } else {
            const userName = prompt('Введите ваше имя:') || 'Гость';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', userName);
            updateAuthUI(true, userName);
        }
    });

    function updateAuthUI(isLoggedIn, userName) {
        if (isLoggedIn) {
            authButton.textContent = 'Выйти';
            authStatus.textContent = `Вы вошли как ${userName}`;
            authStatus.style.display = 'block';
        } else {
            authButton.textContent = 'Войти';
            authStatus.style.display = 'none';
        }
    }
});