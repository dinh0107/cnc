(function ($) {
    $('.news-page__filter').on('click', function () {
        $('.news-page__filter').removeClass('is-active').attr('aria-selected', 'false');
        $(this).addClass('is-active').attr('aria-selected', 'true');
    });
})(jQuery);
