(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const menuLinks = document.querySelectorAll('.menu__link');
        const currentLocation = window.location.href;
        menuLinks.forEach(link => {
            if (link.href === currentLocation) {
                link.classList.add('active');
            }
        });
    });

    window.onload = function() {
        const loadTime = (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) / 1000;
        const performanceDisplay = document.getElementById("performance-display");
        if (performanceDisplay) {
            performanceDisplay.innerText = `Время загрузки страницы: ${loadTime.toFixed(2)} сек.`;
        }
    };
})();
