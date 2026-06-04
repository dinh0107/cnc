(function () {
    var nums = document.querySelectorAll('.stat-card__num[data-count]');
    if (!nums.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var duration = 2000;

    function runCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        if (reduced) {
            el.textContent = String(target);
            return;
        }

        var start = performance.now();

        function tick(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(target * eased));
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = String(target);
            }
        }

        requestAnimationFrame(tick);
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                runCounter(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { root: null, threshold: 0.25 }
    );

    nums.forEach(function (el) {
        observer.observe(el);
    });
})();
