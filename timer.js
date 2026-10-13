const START_SECONDS = 30;
    const WARNING_SECONDS = 10;
    const display = document.querySelector('#display');
    const message = document.querySelector('#message');
    const startButton = document.querySelector('#startButton');
    const resetButton = document.querySelector('#resetButton');

    let remainingMs = START_SECONDS * 1000;
    let deadline = 0;
    let intervalId = null;
    let warned = false;

    function render() {
      const totalSeconds = Math.ceil(remainingMs / 1000);
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      display.textContent = `${minutes}:${seconds}`;
    }

    function finish() {
      clearInterval(intervalId);
      intervalId = null;
      remainingMs = 0;
      render();
      display.classList.remove('urgent');
      message.textContent = 'Час вийшов! Можна почати таймер знову.';
      startButton.disabled = false;
    }

    function tick() {
      remainingMs = Math.max(0, deadline - Date.now());
      render();

      if (!warned && remainingMs <= WARNING_SECONDS * 1000 && remainingMs > 0) {
        warned = true;
        display.classList.add('urgent');
        message.textContent = 'Залишилося 10 секунд!';
      }
      if (remainingMs === 0) finish();
    }

    startButton.addEventListener('click', () => {
      if (intervalId !== null || remainingMs === 0) return;
      deadline = Date.now() + remainingMs;
      startButton.disabled = true;
      message.textContent = 'Таймер працює.';
      intervalId = setInterval(tick, 50);
      tick();
    });

    resetButton.addEventListener('click', () => {
      clearInterval(intervalId);
      intervalId = null;
      remainingMs = START_SECONDS * 1000;
      warned = false;
      display.classList.remove('urgent');
      render();
      message.textContent = 'Таймер скинуто. Натисни «Почати».';
      startButton.disabled = false;
    });

    render();
