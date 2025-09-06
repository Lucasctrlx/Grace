function initializeVoiceRecognition(button, input) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    button.addEventListener('click', () => {
        if (button.classList.contains('listening')) {
            recognition.stop();
            button.classList.remove('listening');
            button.innerHTML = '<i class="fas fa-microphone"></i>';
        } else {
            recognition.start();
            button.classList.add('listening');
            button.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        input.dispatchEvent(new Event('input'));
        button.classList.remove('listening');
        button.innerHTML = '<i class="fas fa-microphone"></i>';
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        button.classList.remove('listening');
        button.innerHTML = '<i class="fas fa-microphone"></i>';
    };
}