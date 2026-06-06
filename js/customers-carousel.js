(function ($) {
    if (typeof $.fn.owlCarousel !== 'function') {
        return;
    }

    var $logos = $('.customers__logos');

    if ($logos.length) {
        $logos.owlCarousel({
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
                    items: 2,
                    margin: 16
                },
                576: {
                    items: 3,
                    margin: 24
                },
                992: {
                    items: 4,
                    margin: 24
                },
                1200: {
                    items: 7,
                    margin: 32
                }
            }
        });
    }

    var $carousel = $('.customers-testimonials');
    var $dots = $('.customers__dots button');

    if (!$carousel.length) {
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
                items: 4,
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

    function initScrollbars() {
        $('.testimonial-card--scroll').each(function () {
            var $card = $(this);
            var $text = $card.find('.testimonial-card__text');
            var $thumb = $card.find('.testimonial-card__scrollbar-thumb');
            var $track = $card.find('.testimonial-card__scrollbar');

            if (!$text.length || !$thumb.length || !$track.length) {
                return;
            }

            function updateThumb() {
                var el = $text.get(0);
                var trackH = $track.innerHeight();
                var scrollH = el.scrollHeight;
                var viewH = el.clientHeight;
                var minThumb = 24;

                if (scrollH <= viewH) {
                    $thumb.css({ height: trackH, transform: 'translateY(0)' });
                    return;
                }

                var thumbH = Math.max((viewH / scrollH) * trackH, minThumb);
                var maxTop = trackH - thumbH;
                var top = (el.scrollTop / (scrollH - viewH)) * maxTop;

                $thumb.css({
                    height: thumbH,
                    transform: 'translateY(' + top + 'px)'
                });
            }

            $text.on('scroll', updateThumb);
            $(window).on('resize', updateThumb);
            updateThumb();
        });
    }

    $carousel.on('initialized.owl.carousel refreshed.owl.carousel', initScrollbars);
    initScrollbars();
})(jQuery);
