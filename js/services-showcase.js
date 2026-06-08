(function ($) {
    if (typeof $.fn.owlCarousel !== 'function') {
        return;
    }

    var ITEMS_PER_PAGE = 4;
    var DESKTOP_MQ = window.matchMedia('(min-width: 992px)');

    function initShowcase($showcase) {
        var slideEl = $showcase.find('.services-showcase__slide').get(0);
        if (!slideEl) {
            return;
        }

        var $labelsWrap = $showcase.find('.services-showcase__labels');
        var $prevBtn = $showcase.find('.services-showcase__nav-btn--prev');
        var $nextBtn = $showcase.find('.services-showcase__nav-btn--next');
        var bgs = slideEl.querySelectorAll('.services-showcase__bg');

        if (!$labelsWrap.length || bgs.length < 2) {
            return;
        }

        var defaultBg = slideEl.getAttribute('data-default-bg') || bgs[0].getAttribute('src');
        var active = 0;
        var busy = false;
        var pendingSrc = null;
        var labelIndex = -1;
        var pageIndex = 0;
        var pageCount = 0;

        function getLabels() {
            return Array.from(slideEl.querySelectorAll('.services-showcase__label[data-bg]'));
        }

        function preload(src) {
            return new Promise(function (resolve) {
                var img = new Image();
                img.onload = img.onerror = function () {
                    resolve();
                };
                img.src = src;
            });
        }

        function crossfade(src) {
            var currentEl = bgs[active];

            if (currentEl.getAttribute('src') === src && currentEl.classList.contains('is-visible')) {
                busy = false;
                pendingSrc = null;
                return;
            }

            busy = true;

            var nextIdx = active === 0 ? 1 : 0;
            var nextEl = bgs[nextIdx];

            preload(src).then(function () {
                nextEl.setAttribute('src', src);
                nextEl.classList.add('is-visible');
                currentEl.classList.remove('is-visible');
                active = nextIdx;
                busy = false;

                if (pendingSrc && pendingSrc !== src) {
                    crossfade(pendingSrc);
                } else {
                    pendingSrc = null;
                }
            });
        }

        function applyBg(src) {
            if (!src) return;

            var currentEl = bgs[active];
            if (currentEl.getAttribute('src') === src && currentEl.classList.contains('is-visible')) {
                pendingSrc = null;
                return;
            }

            pendingSrc = src;

            if (!busy) {
                crossfade(src);
            }
        }

        function clearLabelActive() {
            getLabels().forEach(function (label) {
                label.classList.remove('is-active');
            });
        }

        function activateLabel(index) {
            var labels = getLabels();
            if (!labels[index]) return;

            labelIndex = index;
            labels.forEach(function (label, i) {
                label.classList.toggle('is-active', i === index);
            });
            applyBg(labels[index].getAttribute('data-bg'));
        }

        function goToPage(nextPage, animate) {
            if (nextPage < 0 || nextPage >= pageCount) {
                return;
            }

            clearLabelActive();
            labelIndex = -1;
            pageIndex = nextPage;
            $labelsWrap.trigger('to.owl.carousel', [nextPage, animate ? 450 : 0, true]);
            updateNavState();
        }

        function updateNavState() {
            if (!DESKTOP_MQ.matches || pageCount <= 1) {
                $prevBtn.addClass('is-disabled');
                $nextBtn.addClass('is-disabled');
                return;
            }

            $prevBtn.toggleClass('is-disabled', pageIndex <= 0);
            $nextBtn.toggleClass('is-disabled', pageIndex >= pageCount - 1);
        }

        function bindLabelInteractions() {
            getLabels().forEach(function (label, index) {
                label.onmouseenter = function () {
                    activateLabel(index);
                };

                label.onfocusin = function () {
                    activateLabel(index);
                };
            });
        }

        function destroyOwl() {
            if (!$labelsWrap.hasClass('owl-loaded')) {
                return;
            }

            $labelsWrap.trigger('destroy.owl.carousel');
            $labelsWrap.removeClass('owl-carousel owl-loaded');
            $labelsWrap.off('.owl.carousel');
        }

        function initOwl() {
            destroyOwl();
            bindLabelInteractions();

            pageCount = Math.ceil(getLabels().length / ITEMS_PER_PAGE);
            pageIndex = 0;

            if (!DESKTOP_MQ.matches) {
                clearLabelActive();
                labelIndex = -1;
                applyBg(defaultBg);
                updateNavState();
                return;
            }

            $labelsWrap.addClass('owl-carousel');
            $labelsWrap.owlCarousel({
                loop: false,
                rewind: false,
                margin: 16,
                nav: false,
                dots: false,
                slideBy: 'page',
                items: ITEMS_PER_PAGE,
                smartSpeed: 450,
                mouseDrag: false,
                touchDrag: false,
                pullDrag: false,
                freeDrag: false,
                stagePadding: 0
            });

            $labelsWrap.on('changed.owl.carousel initialized.owl.carousel', function (event) {
                if (!event.namespace) {
                    return;
                }

                pageIndex = event.relatedTarget.relative(event.item.index);
                clearLabelActive();
                labelIndex = -1;
                updateNavState();
            });

            clearLabelActive();
            labelIndex = -1;
            applyBg(defaultBg);
            updateNavState();
        }

        slideEl.addEventListener('mouseleave', function () {
            var labels = getLabels();

            clearLabelActive();

            if (labelIndex >= 0 && labels[labelIndex]) {
                applyBg(labels[labelIndex].getAttribute('data-bg'));
                return;
            }

            applyBg(defaultBg);
        });

        $prevBtn.off('click.servicesShowcase').on('click.servicesShowcase', function () {
            if ($(this).hasClass('is-disabled')) {
                return;
            }

            goToPage(pageIndex - 1, true);
        });

        $nextBtn.off('click.servicesShowcase').on('click.servicesShowcase', function () {
            if ($(this).hasClass('is-disabled')) {
                return;
            }

            goToPage(pageIndex + 1, true);
        });

        initOwl();

        if (typeof DESKTOP_MQ.addEventListener === 'function') {
            DESKTOP_MQ.addEventListener('change', initOwl);
        } else if (typeof DESKTOP_MQ.addListener === 'function') {
            DESKTOP_MQ.addListener(initOwl);
        }
    }

    $('.services-showcase').each(function () {
        initShowcase($(this));
    });
})(jQuery);
