// Define your name and API key here
const MY_NAME = 'Vaishali Tomar';  // Your name

// API call function using async/await (modified to return a static response)
async function makeApiCall(prompt) {
    try {
        // Instead of making an actual API call, return a static response
        console.log('API is not available. Returning a static response.');

        // Simulate the kind of response you would get from the API
        const staticResponse = `Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.`;

        // Simulate a delay like an actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

        return staticResponse;

    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
}

// Button creation function
function createAIReplyButton() {
    const button = document.createElement('button');
    button.innerText = 'AI Reject';
    button.className = 'ai-reply-button';
    Object.assign(button.style, {
        marginLeft: '10px',
        padding: '8px 16px',
        backgroundColor: '#0073b1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    });

    button.addEventListener('mouseover', () => button.style.backgroundColor = '#005582');
    button.addEventListener('mouseout', () => button.style.backgroundColor = '#0073b1');
    button.addEventListener('click', handleButtonClick);

    return button;
}

// Button click handler
async function handleButtonClick(event) {
    const button = event.currentTarget;
    const toolbar = button.closest('.msg-form__left-actions');
    button.innerText = 'Loading...';
    button.disabled = true;

    try {
        if (toolbar) {
            await handleAIResponse(toolbar);
        }
    } catch (error) {
        console.error('Failed to get AI response:', error);
    } finally {
        button.innerText = 'AI Reject';
        button.disabled = false;
    }
}

// AI response handler
async function handleAIResponse(toolbar) {
    const conversationBubble = toolbar.closest('.msg-overlay-conversation-bubble');
    const otherName = conversationBubble?.querySelector('.msg-s-event-listitem .msg-s-message-group__profile-link')?.textContent?.trim() || 'Unknown';
    const conversation = getConversationText(conversationBubble);
    const promptText = `My name is ${MY_NAME}. I got a message on LinkedIn from ${otherName}. Write a polite rejection for this conversation using the language of the sender: '${conversation}'`;

    const response = await makeApiCall(promptText);
    const messageBox = conversationBubble?.querySelector('.msg-form__contenteditable p');
    if (messageBox) {
        messageBox.innerHTML = response;
        togglePlaceholderVisibility(messageBox);
    }
}

// Helper function to get conversation text
function getConversationText(conversationBubble) {
    return Array.from(conversationBubble?.querySelectorAll('.msg-s-event-listitem .msg-s-message-group__profile-link, .msg-s-event-listitem .msg-s-event-with-indicator p') || [])
        .map(e => e.textContent?.trim() || '')
        .map(t => [MY_NAME, 'Unknown'].includes(t) ? `${t}:` : t)
        .join(', ')
        .replaceAll('<!---->', '');
}

// Toggle placeholder visibility
function togglePlaceholderVisibility(messageBox) {
    const placeholderDiv = messageBox.closest('.msg-overlay-conversation-bubble')?.querySelector('.msg-form__placeholder');
    if (placeholderDiv) {
        placeholderDiv.style.display = messageBox.textContent?.trim() ? 'none' : 'block';
    }
}

// Observe and inject buttons into new conversation toolbars
function observeConversations() {
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.msg-form__left-actions:not(.ai-button-injected)').forEach(injectButton);
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Inject button into toolbar
function injectButton(toolbar) {
    toolbar.appendChild(createAIReplyButton());
    toolbar.classList.add('ai-button-injected');

    const messageBox = toolbar.closest('.msg-overlay-conversation-bubble')?.querySelector('.msg-form__contenteditable p');
    if (messageBox) {
        messageBox.addEventListener('input', () => togglePlaceholderVisibility(messageBox));
        togglePlaceholderVisibility(messageBox); // Initial check
    }
}

// Start observing the conversations
observeConversations();
