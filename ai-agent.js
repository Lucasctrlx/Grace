document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const voiceButton = document.getElementById('voiceButton');
    const chatHistory = document.getElementById('chatHistory');
    const typingIndicator = document.getElementById('typingIndicator');
    const themeToggle = document.getElementById('themeToggle');

    // Theme toggle functionality
    themeToggle.addEventListener('change', () => {
        document.body.setAttribute('data-theme', 
            themeToggle.checked ? 'dark' : 'light');
        localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = `${Math.min(userInput.scrollHeight, 150)}px`;
    });

    // Send message function
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessageToChat(message, 'user');

        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';

        // Show typing indicator
        typingIndicator.style.display = 'flex';

        try {
            // Send message to AI
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            addMessageToChat(data.response, 'ai');
        } catch (error) {
            addMessageToChat("Sorry, I'm having trouble connecting. Please try again later.", 'ai');
            console.error('Error:', error);
        } finally {
            // Hide typing indicator
            typingIndicator.style.display = 'none';
        }
    }

    // Add message to chat
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        
        const icon = document.createElement('i');
        icon.className = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        avatarDiv.appendChild(icon);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = `<p>${message}</p>`;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Initialize voice recognition if available
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        initializeVoiceRecognition(voiceButton, userInput);
    } else {
        voiceButton.style.display = 'none';
    }
});