(function ($) {
    var $carousel = $('.project-carousel');
    var $dots = $('.project-carousel__dots button');

    if (!$carousel.length || typeof $.fn.owlCarousel !== 'function') {
        return;
    }

    $carousel.owlCarousel({
        loop: true,
        margin: 20,
        nav: false,
        dots: false,
        slideBy: 1,
        smartSpeed: 450,
        responsive: {
            0: {
                items: 1,
                margin: 16
            },
            768: {
                items: 2,
                margin: 24
            },
            1200: {
                items: 3,
                margin: 30
            }
        }
    });

    function syncDots(event) {
        if (!event.namespace) {
            return;
        }

        var index = event.relatedTarget.relative(event.item.index);

        $dots.removeClass('is-active').eq(index).addClass('is-active');
    }

    $carousel.on('initialized.owl.carousel changed.owl.carousel', syncDots);

    $dots.on('click', function () {
        var index = $(this).index();

        $carousel.trigger('to.owl.carousel', [index, 450, true]);
    });
})(jQuery);
