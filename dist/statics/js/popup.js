document.addEventListener('DOMContentLoaded', function() {
    const postButton = document.getElementById('postButton');
    const messageInput = document.getElementById('message');
    const settingsBtn = document.getElementById('settings-btn');
    const webhookSelect = document.getElementById('webhook_select');
    const loaderOverlay = document.getElementById('loader-overlay');
  // Load webhooks from storage and populate the dropdown
    function loadWebhooks() {
        chrome.storage.sync.get(['webhooks', 'lastSelectedWebhookUrl'], function(data) {
            const webhooks = data.webhooks || [];
            const lastSelectedWebhookUrl = data.lastSelectedWebhookUrl;
            webhookSelect.innerHTML = '';

            if (webhooks.length === 0) {
                chrome.runtime.sendMessage({ action: 'openSettings' });
                window.close();
            } else {
                webhooks.forEach(hook => {
                    const option = document.createElement('option');
                    option.value = hook.url;
                    option.textContent = "# " + hook.name;
                    webhookSelect.appendChild(option);
                    // Check if this webhook was the last selected one
                    if (hook.url === lastSelectedWebhookUrl) {
                    option.selected = true;
                    }
                });
            }

            // Initialize Materialize select
            const elems = document.querySelectorAll('select');
            M.FormSelect.init(elems);
        });
    }

    postButton.addEventListener('click', function() {
        postButton.disabled = true;
        loaderOverlay.classList.add('is-loading');
        
        const message = messageInput.value.trim();
        const selectedWebhookUrl = webhookSelect.value;

        // Save the selected webhook URL to storage
        chrome.storage.sync.set({ 'lastSelectedWebhookUrl': selectedWebhookUrl });

        if (message === '') {
            alert('Enter a message to send.');
            postButton.disabled = false;
            loaderOverlay.classList.remove('is-loading');
            return;
        }

        fetch(selectedWebhookUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            content: message
            })
        })
        .then(response => {
            if (response.ok) {
                window.close();
            } else {
                alert('you have an error in posting.');
                postButton.disabled = false;
                loaderOverlay.classList.remove('is-loading');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('you have an exception in posting.');
            postButton.disabled = false;
            loaderOverlay.classList.remove('is-loading');
        });
    });

    // Handle Ctrl + Enter key press
    messageInput.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault(); 
            postButton.click(); 
        }
    });

    // Handle settings button click
    settingsBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'openSettings' });
    });

    // Initial load
    loadWebhooks();

    // Save the selected webhook URL when the user changes the selection
    webhookSelect.addEventListener('change', function() {
        const selectedWebhookUrl = webhookSelect.value;
        chrome.storage.sync.set({ 'lastSelectedWebhookUrl': selectedWebhookUrl });
    });

    messageInput.focus();
});