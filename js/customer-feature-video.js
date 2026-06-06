(function ($) {
    $('.customer-feature__media-wrap').each(function () {
        var $wrap = $(this);
        var $poster = $wrap.find('.customer-feature__poster');
        var $play = $wrap.find('.customer-feature__play');
        var video = $wrap.find('.customer-feature__video')[0];
        var posterMarkup = $poster.length ? $poster.prop('outerHTML') : '';
        var playMarkup = $play.length ? $play.prop('outerHTML') : '';

        if (!video) {
            return;
        }

        function playVideo() {
            $poster.remove();
            $play.remove();
            $wrap.addClass('is-playing');

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    restorePoster();
                });
            }
        }

        function restorePoster() {
            $wrap.removeClass('is-playing');
            video.pause();
            video.currentTime = 0;

            if (posterMarkup && !$wrap.find('.customer-feature__poster').length) {
                $(posterMarkup).prependTo($wrap);
                $poster = $wrap.find('.customer-feature__poster');
            }

            if (playMarkup && !$wrap.find('.customer-feature__play').length) {
                $(playMarkup).appendTo($wrap);
                $play = $wrap.find('.customer-feature__play');
            }
        }

        $wrap.on('click', function (e) {
            if ($wrap.hasClass('is-playing')) {
                return;
            }

            if ($(e.target).closest('.customer-feature__video').length) {
                return;
            }

            e.preventDefault();
            playVideo();
        });

        video.addEventListener('ended', restorePoster);
    });
})(jQuery);
