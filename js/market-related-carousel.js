(function ($) {
    var $carousel = $('.market-related-carousel');
    var $wrap = $('.market-related__inner');
    var $dots = $wrap.find('.market-related__dots button');

    if (!$carousel.length || typeof $.fn.owlCarousel !== 'function') {
        return;
    }

    $carousel.owlCarousel({
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 5000,
        loop: true,
        margin: 16,
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

    function itemsPerDot() {
        var width = $(window).width();

        if (width >= 1200) {
            return 3;
        }

        if (width >= 768) {
            return 2;
        }

        return 1;
    }

    function syncDots(event) {
        if (!event.namespace) {
            return;
        }

        var index = event.relatedTarget.relative(event.item.index);
        var dotIndex = Math.floor(index / itemsPerDot()) % $dots.length;

        $dots.removeClass('is-active').eq(dotIndex).addClass('is-active');
    }

    $carousel.on('initialized.owl.carousel changed.owl.carousel', syncDots);

    $dots.on('click', function () {
        var target = $(this).index() * itemsPerDot();

        $carousel.trigger('to.owl.carousel', [target, 450, true]);
    });
})(jQuery);
