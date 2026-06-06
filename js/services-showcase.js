(function ($) {
    if (typeof $.fn.owlCarousel !== 'function') {
        return;
    }

    var DESKTOP_MQ = window.matchMedia('(min-width: 992px)');

    function getItemsPerPage() {
        return DESKTOP_MQ.matches ? 4 : 1;
    }

    function initShowcase($showcase) {
        var slideEl = $showcase.find('.services-showcase__slide').get(0);
        if (!slideEl) {
            return;
        }

        var $labelsWrap = $showcase.find('.services-showcase__labels');
        var $dotsContainer = $showcase.find('.services-showcase__dots');
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
            syncDots();
            updateNavState();
        }

        function updateNavState() {
            if (pageCount <= 1) {
                $prevBtn.addClass('is-disabled');
                $nextBtn.addClass('is-disabled');
                return;
            }

            $prevBtn.toggleClass('is-disabled', pageIndex <= 0);
            $nextBtn.toggleClass('is-disabled', pageIndex >= pageCount - 1);
        }

        function buildDots() {
            $dotsContainer.empty();

            if (DESKTOP_MQ.matches || pageCount <= 1) {
                return;
            }

            for (var i = 0; i < pageCount; i++) {
                $dotsContainer.append($('<button type="button">'));
            }
        }

        function syncDots() {
            var $dots = $dotsContainer.children('button');

            if (!$dots.length) {
                return;
            }

            $dots.removeClass('is-active').eq(pageIndex).addClass('is-active');
        }

        function bindLabelInteractions() {
            getLabels().forEach(function (label, index) {
                label.onmouseenter = function () {
                    activateLabel(index);
                };

                label.onfocusin = function () {
                    activateLabel(index);
                };

                label.onmouseleave = function () {
                    if (!label.classList.contains('is-active')) {
                        return;
                    }
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
            $dotsContainer.empty();
        }

        function initOwl() {
            destroyOwl();
            bindLabelInteractions();

            var itemsPerPage = getItemsPerPage();
            pageCount = Math.ceil(getLabels().length / itemsPerPage);
            pageIndex = 0;

            $labelsWrap.addClass('owl-carousel');
            $labelsWrap.owlCarousel({
                loop: false,
                rewind: false,
                margin: 0,
                nav: false,
                dots: false,
                slideBy: 1,
                items: 1,
                smartSpeed: 450,
                mouseDrag: false,
                touchDrag: true,
                pullDrag: true,
                freeDrag: false,
                stagePadding: 0,
                responsive: {
                    992: {
                        items: 4,
                        slideBy: 'page',
                        margin: 16,
                        touchDrag: false,
                        pullDrag: false
                    }
                }
            });

            buildDots();

            $labelsWrap.on('changed.owl.carousel initialized.owl.carousel refreshed.owl.carousel', function (event) {
                if (!event.namespace) {
                    return;
                }

                var owl = event.relatedTarget;
                var itemsPerPage = owl.options.items;
                pageCount = Math.ceil(getLabels().length / itemsPerPage);
                pageIndex = owl.relative(owl.current());
                clearLabelActive();
                labelIndex = -1;
                buildDots();
                syncDots();
                updateNavState();
            });

            clearLabelActive();
            labelIndex = -1;
            applyBg(defaultBg);

            requestAnimationFrame(function () {
                $labelsWrap.trigger('refresh.owl.carousel');
            });
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

        $dotsContainer.off('click.servicesShowcase').on('click.servicesShowcase', 'button', function () {
            goToPage($(this).index(), true);
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
