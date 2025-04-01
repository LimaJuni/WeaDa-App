document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const clearChatButton = document.getElementById('clear-chat');
    const sendIcon = document.getElementById('send-icon');
    const loadingIcon = document.getElementById('loading-icon');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    
    // Message template
    const messageTemplate = document.getElementById('message-template');
    
    // State
    let isLoading = false;
    let messages = [];
    
    // Configure marked for markdown rendering
    const marked = window.marked; // Access marked from the window object
    const hljs = window.hljs; // Access hljs from the window object
  
    marked.setOptions({
      highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
      breaks: true,
      gfm: true
    });
    
    // Initialize chat with welcome message
    addMessage({
      role: 'assistant',
      content: "Hello! I'm your AI assistant powered by DeepSeek. How can I help you today?"
    });
    
    // Event Listeners
    chatForm.addEventListener('submit', handleSubmit);
    messageInput.addEventListener('input', handleInput);
    messageInput.addEventListener('keydown', handleKeyDown);
    clearChatButton.addEventListener('click', clearChat);
    
    // Auto-resize textarea
    function handleInput() {
      messageInput.style.height = 'auto';
      messageInput.style.height = `${Math.min(messageInput.scrollHeight, 200)}px`;
      
      // Enable/disable send button based on input
      sendButton.disabled = messageInput.value.trim() === '' || isLoading;
    }
    
    // Handle Enter key
    function handleKeyDown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (messageInput.value.trim() !== '' && !isLoading) {
          chatForm.dispatchEvent(new Event('submit'));
        }
      }
    }
    
    // Handle form submission
    async function handleSubmit(e) {
      e.preventDefault();
      
      const userInput = messageInput.value.trim();
      if (userInput === '' || isLoading) return;
      
      // Add user message to chat
      addMessage({
        role: 'user',
        content: userInput
      });
      
      // Clear input and reset height
      messageInput.value = '';
      messageInput.style.height = 'auto';
      sendButton.disabled = true;
      
      // Scroll to bottom
      scrollToBottom();
      
      // Send message to API
      await sendMessage(userInput);
    }
    
    // Add a message to the chat
    function addMessage(message) {
      // Clone the template
      const messageNode = messageTemplate.content.cloneNode(true);
      const messageElement = messageNode.querySelector('.message');
      
      // Set message classes based on role
      if (message.role === 'user') {
        messageElement.classList.add('user-message');
      } else {
        messageElement.classList.add('assistant-message');
      }
      
      // Set avatar icon
      const avatarIcon = messageElement.querySelector('.icon-avatar');
      if (message.role === 'user') {
        avatarIcon.innerHTML = `
          <circle cx="12" cy="8" r="4"/>
          <path d="M20 19v-1a7 7 0 0 0-7-7h-2a7 7 0 0 0-7 7v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2Z"/>
        `;
      } else {
        avatarIcon.innerHTML = `
          <path d="M12 8V4H8"/>
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <path d="M20 8h-4v4"/>
          <circle cx="12" cy="12" r="4"/>
        `;
      }
      
      // Set sender name
      const senderElement = messageElement.querySelector('.message-sender');
      senderElement.textContent = message.role === 'user' ? 'You' : 'DeepSeek AI';
      
      // Set message content with markdown
      const textElement = messageElement.querySelector('.message-text');
      textElement.innerHTML = marked.parse(message.content);
      
      // Setup reasoning button if available
      const reasoningBtn = messageElement.querySelector('.btn-reasoning');
      const reasoningContainer = messageElement.querySelector('.reasoning-container');
      
      if (message.reasoning && message.role === 'assistant') {
        reasoningBtn.classList.remove('hidden');
        reasoningBtn.addEventListener('click', () => {
          const isShowing = reasoningContainer.classList.toggle('hidden');
          reasoningBtn.textContent = isShowing ? 'Show reasoning' : 'Hide reasoning';
          reasoningContainer.textContent = message.reasoning;
          scrollToBottom();
        });
      }
      
      // Setup copy button for assistant messages
      const copyBtn = messageElement.querySelector('.btn-copy');
      if (message.role === 'assistant') {
        copyBtn.classList.remove('hidden');
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(message.content);
          
          // Show copied state
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          `;
          
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
          }, 2000);
        });
      }
      
      // Add to messages array
      messages.push(message);
      
      // Add to DOM
      chatMessages.appendChild(messageElement);
      
      // Scroll to bottom
      scrollToBottom();
    }
    
    // Send message to API
    async function sendMessage(userInput) {
      try {
        setLoading(true);
        hideError();
        
        // Create a placeholder for the assistant's response
        const placeholderMessage = {
          role: 'assistant',
          content: '',
          id: Date.now().toString()
        };
        
        // Add placeholder message
        const placeholderNode = messageTemplate.content.cloneNode(true);
        const placeholderElement = placeholderNode.querySelector('.message');
        placeholderElement.classList.add('assistant-message');
        placeholderElement.classList.add('placeholder-message');
        
        // Set avatar icon
        const avatarIcon = placeholderElement.querySelector('.icon-avatar');
        avatarIcon.innerHTML = `
          <path d="M12 8V4H8"/>
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <path d="M20 8h-4v4"/>
          <circle cx="12" cy="12" r="4"/>
        `;
        
        // Set sender name
        const senderElement = placeholderElement.querySelector('.message-sender');
        senderElement.textContent = 'DeepSeek AI';
        
        // Set initial content
        const textElement = placeholderElement.querySelector('.message-text');
        textElement.innerHTML = '<div class="typing-indicator"><span>.</span><span>.</span><span>.</span></div>';
        
        // Add to DOM
        chatMessages.appendChild(placeholderElement);
        scrollToBottom();
        
        // Prepare the messages for the API
        const apiMessages = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Add the user's new message
        apiMessages.push({
          role: 'user',
          content: userInput
        });
        
        // Replace this with your actual API endpoint
        // For this example, we'll simulate a response
        // In a real implementation, you would make a fetch request to your backend
        
        // Simulate API call
        // In a real implementation, replace this with:
        /*
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            messages: apiMessages,
            // Add your API key here or use environment variables on your server
            apiKey: 'YOUR_DEEPSEEK_API_KEY' 
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to get response from API');
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let responseText = '';
        let reasoning = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          // Parse the chunk and update the UI
          // This depends on your API response format
        }
        */

        app.post('/api/chat', async (req, res) => {
            const { messages } = req.body;
            
            try {
              const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer '
                },
                body: JSON.stringify({
                  model: 'deepseek-reasoner',
                  messages: messages,
                  stream: true
                })
              });
              
              // Forward the stream to the client
              response.body.pipe(res);
            } catch (error) {
              res.status(500).json({ error: error.message });
            }
        });
        // For demo purposes, simulate a response after a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Remove placeholder
        placeholderElement.remove();
        
        // Add the simulated response
        const simulatedResponse = {
          role: 'assistant',
          content: `I'm a simulated response from DeepSeek AI. In a real implementation, you would connect to the DeepSeek API using your API key.
  
  Here's how you would typically set up the API connection:
  
  \`\`\`javascript
  // In your server-side code (Node.js, Express, etc.)
  app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.DEEPSEEK_API_KEY}\`
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: messages,
          stream: true
        })
      });
      
      // Forward the stream to the client
      response.body.pipe(res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  \`\`\`
  
  To use this chatbot with the real DeepSeek API:
  
  1. Create a server endpoint like the one above
  2. Set your DEEPSEEK_API_KEY in your server environment variables
  3. Update the fetch call in the sendMessage function to point to your server endpoint`,
          reasoning: `<Thinking>
  When implementing a DeepSeek API integration, I need to consider:
  1. Authentication using the API key
  2. Proper streaming of responses
  3. Error handling
  4. Processing the reasoning tags in the response
  
  The DeepSeek API expects messages in a specific format, and we need to ensure we're using the correct model ID. The 'deepseek-reasoner' model provides the thinking/reasoning capability.
  
  For security, the API key should never be exposed in client-side code, which is why we need a server endpoint to proxy the requests.
  </Thinking>`
        };
        
        addMessage(simulatedResponse);
        
      } catch (error) {
        showError(error.message || 'An error occurred while sending your message');
      } finally {
        setLoading(false);
      }
    }
    
    // Set loading state
    function setLoading(loading) {
      isLoading = loading;
      sendButton.disabled = loading || messageInput.value.trim() === '';
      
      if (loading) {
        sendIcon.classList.add('hidden');
        loadingIcon.classList.remove('hidden');
      } else {
        sendIcon.classList.remove('hidden');
        loadingIcon.classList.add('hidden');
      }
    }
    
    // Show error message
    function showError(message) {
      errorContainer.classList.remove('hidden');
      errorMessage.textContent = message;
    }
    
    // Hide error message
    function hideError() {
      errorContainer.classList.add('hidden');
    }
    
    // Clear chat
    function clearChat() {
      messages = [];
      chatMessages.innerHTML = '';
      
      // Add welcome message back
      addMessage({
        role: 'assistant',
        content: "Hello! I'm your AI assistant powered by DeepSeek. How can I help you today?"
      });
    }
    
    // Scroll to bottom of chat
    function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });