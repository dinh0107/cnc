(function ($) {
    if (typeof $.fn.owlCarousel !== 'function') {
        return;
    }

    function buildDots($wrap, count) {
        $wrap.empty();

        if (count <= 1) {
            $wrap.hide();
            return $();
        }

        $wrap.show();

        for (var i = 0; i < count; i++) {
            $wrap.append($('<button type="button">'));
        }

        return $wrap.children('button').first().addClass('is-active').end();
    }

    $('.project-carousel').each(function () {
        var $carousel = $(this);
        var $dotsWrap = $carousel.siblings('.project-carousel__dots').first();

        if (!$dotsWrap.length) {
            $dotsWrap = $carousel.parent().children('.project-carousel__dots').first();
        }

        var slideCount = $carousel.children().length;

        if (slideCount === 0) {
            return;
        }

        var $dots = buildDots($dotsWrap, slideCount);

        $carousel.owlCarousel({
            autoplay: true,
            autoplayHoverPause: true,
            autoplayTimeout: 5000,
            loop: slideCount > 1,
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
            if (!event.namespace || !$dots.length) {
                return;
            }

            var index = event.relatedTarget.relative(event.item.index);

            $dots.removeClass('is-active').eq(index).addClass('is-active');
        }

        $carousel.on('initialized.owl.carousel changed.owl.carousel', syncDots);

        $dotsWrap.on('click', 'button', function () {
            $carousel.trigger('to.owl.carousel', [$(this).index(), 450, true]);
        });
    });
})(jQuery);
