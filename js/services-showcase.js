(function () {
    var slide = document.querySelector('.services-showcase__slide');
    if (!slide) return;

    var bgs = slide.querySelectorAll('.services-showcase__bg');
    if (bgs.length < 2) return;

    var labels = slide.querySelectorAll('.services-showcase__label[data-bg]');
    var defaultBg = slide.getAttribute('data-default-bg') || bgs[0].getAttribute('src');
    var active = 0;
    var busy = false;
    var pendingSrc = null;

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

    labels.forEach(function (label) {
        var src = label.getAttribute('data-bg');

        label.addEventListener('mouseenter', function () {
            applyBg(src);
        });

        label.addEventListener('focusin', function () {
            applyBg(src);
        });
    });

    slide.addEventListener('mouseleave', function () {
        applyBg(defaultBg);
    });

    slide.addEventListener('focusout', function (e) {
        if (!slide.contains(e.relatedTarget)) {
            applyBg(defaultBg);
        }
    });
})();
