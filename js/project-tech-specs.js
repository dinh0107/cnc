(function () {
    var blocks = document.querySelectorAll('.project-tech-specs');

    if (!blocks.length) {
        return;
    }

    blocks.forEach(function (block) {
        var button = block.querySelector('.project-tech-specs__expand');
        var label = block.querySelector('.project-tech-specs__expand-label');

        if (!button || !label) {
            return;
        }

        var expandText = button.dataset.expandLabel || 'Mở rộng bảng';
        var collapseText = button.dataset.collapseLabel || 'Thu gọn';

        button.addEventListener('click', function () {
            var isExpanded = block.classList.toggle('is-expanded');

            button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            label.textContent = isExpanded ? collapseText : expandText;
        });
    });
})();
