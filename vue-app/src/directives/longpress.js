export default {
  mounted(el, binding) {
    let pressTimer = null;
    const handler = () => binding.value();

    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) return;
      if (pressTimer === null) {
        pressTimer = setTimeout(handler, 600);
      }
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start);

    el.addEventListener('click', cancel);
    el.addEventListener('mouseout', cancel);
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel);
  }
};
