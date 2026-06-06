(function () {
    var nav = document.querySelector('.site-header .main-nav');
    if (!nav) return;

    var backdrop = document.querySelector('.site-header__nav-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'site-header__nav-backdrop';
        document.body.appendChild(backdrop);
    }

    nav.addEventListener('show.bs.collapse', function () {
        backdrop.classList.add('is-visible');
        document.body.classList.add('is-mobile-nav-open');
    });

    nav.addEventListener('hide.bs.collapse', function () {
        backdrop.classList.remove('is-visible');
        document.body.classList.remove('is-mobile-nav-open');
    });

    backdrop.addEventListener('click', function () {
        if (typeof bootstrap === 'undefined' || !bootstrap.Collapse) {
            nav.classList.remove('show');
            backdrop.classList.remove('is-visible');
            document.body.classList.remove('is-mobile-nav-open');
            return;
        }

        var instance = bootstrap.Collapse.getInstance(nav);
        if (instance) {
            instance.hide();
        }
    });
})();
