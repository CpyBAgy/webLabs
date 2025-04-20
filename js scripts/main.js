(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const menuLinks = document.querySelectorAll('.menu__link');
        const currentLocation = window.location.href;

        menuLinks.forEach(link => {
            if (currentLocation.includes(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });

        const testimonials = document.querySelectorAll('.testimonial');
        testimonials.forEach((testimonial, index) => {
            setTimeout(() => {
                testimonial.classList.add('visible');
            }, 300 * index);
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
