$(document).ready(function () {
    $('.carousel').slick({
        infinite: true, // Бесконечное пролистывание
        slidesToShow: 3, // Количество видимых слайдов
        slidesToScroll: 1, // Количество слайдов при прокрутке
        autoplay: true, // Включение автоматического пролистывания
        autoplaySpeed: 3000, // Интервал между переключениями (в миллисекундах)
        dots: true, // Навигационные точки
        centerMode: true, // Активный слайд по центру
        centerPadding: '0px', // Убираем лишние отступы
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
});