export default {
    mounted(el, binding) {
        el.style.position = getComputedStyle(el).position === 'static' ? 'relative' : el.style.position;
        toggleShimmer(el, binding.value);
    },
    updated(el, binding) {
        if (binding.value !== binding.oldValue) {
            toggleShimmer(el, binding.value);
        }
    },
};

function toggleShimmer(el, isLoading) {
    if (isLoading) {
        if (el.__shimmerOverlay) return;

        // Сохраняем старый стиль
        el.__originalOpacity = el.style.opacity;
        el.__originalBackgroundColor = el.style.backgroundColor;
        el.style.color = 'transparent'; // скроет текст
        el.style.userSelect = 'none';
        el.style.backgroundColor = 'transparent';

        const overlay = document.createElement('div');
        overlay.className = 'shimmer-overlay';
        el.appendChild(overlay);
        el.__shimmerOverlay = overlay;
    } else {
        if (!el.__shimmerOverlay) return;

        el.style.color = ''; // вернём цвет текста
        el.style.userSelect = '';
        if (el.__originalOpacity) el.style.opacity = el.__originalOpacity;
        if (el.__originalBackgroundColor) el.style.backgroundColor = el.__originalBackgroundColor;
        else el.style.backgroundColor = '';
        el.removeChild(el.__shimmerOverlay);
        delete el.__shimmerOverlay;
    }
}

