document.addEventListener('DOMContentLoaded', function() {
    const postButton = document.getElementById('postButton');
    const messageInput = document.getElementById('message');
    const settingsBtn = document.getElementById('settings-btn');
    const webhookSelect = document.getElementById('webhook_select');
    const loaderOverlay = document.getElementById('loader-overlay');
    const clearDraftBtn = document.getElementById('clear-draft-btn');
    const includeUrlToggle = document.getElementById('includeUrlToggle');
    const currentUrlDisplay = document.getElementById('current-url-display');

    // modal action
    const confirmModal = document.getElementById('confirm-modal');
    const confirmOk = document.getElementById('confirm-ok');
    const confirmCancel = document.getElementById('confirm-cancel');
    const modalInstance = M.Modal.init(confirmModal, {
        onOpenEnd: function() {
            confirmCancel.focus();
        },
        onCloseEnd: function() {
            messageInput.focus();
        }
    });

    // get current tab URL
    let currentTabUrl = '';
    function getCurrentTabUrl() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs && tabs.length > 0) {
                const url = tabs[0].url;
                
                if (typeof url === 'string') {
                    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) {
                        currentTabUrl = '';
                        includeUrlToggle.disabled = true;
                        includeUrlToggle.checked = false;
                    } else {
                        currentTabUrl = url;
                        includeUrlToggle.disabled = false;
                    }
                } else { 
                    currentTabUrl = '';
                    includeUrlToggle.disabled = true;
                    includeUrlToggle.checked = false;
                }
            } else {
                currentTabUrl = '';
                includeUrlToggle.disabled = true;
                includeUrlToggle.checked = false;
            }
            updateUrlDisplay();
        });
    }

    // Update the URL display style and text based on the toggle state and URL existence
    function updateUrlDisplay() {
        if (!currentTabUrl || includeUrlToggle.disabled) {
            currentUrlDisplay.style.color = 'var(--system-color)';
            currentUrlDisplay.textContent = 'Unable to include URL';
        } 
        else if (includeUrlToggle.checked) {
            currentUrlDisplay.style.color = 'var(--forcus-color)';
            currentUrlDisplay.textContent = currentTabUrl;
        } 
        else {
            currentUrlDisplay.style.color = 'var(--system-color)';
            currentUrlDisplay.textContent = `Include Current URL ( Enter/Space )`;
        }
    }
    
    includeUrlToggle.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            includeUrlToggle.checked = !includeUrlToggle.checked;
            updateUrlDisplay();
        }
    });
    includeUrlToggle.addEventListener('click', updateUrlDisplay);

    // Replace label content in textarea
    function updatePrefixDisplay() {
        const messageLabel = document.getElementById('message-label');
        if (webhookSelect.selectedIndex > -1) {
            const selectedOption = webhookSelect.options[webhookSelect.selectedIndex];
            const prefix = selectedOption.dataset.prefix;

            if (prefix && prefix.length > 0) {
                messageLabel.textContent = '( Prefixed )' + prefix;
            } else {
                messageLabel.textContent = 'Entry your post message';
            }
        } else {
            messageLabel.textContent = 'Entry your post message';
        }
    }
    // Load saved message from storage
    chrome.storage.local.get('draftMessage', function(data) {
        if (data.draftMessage) {
            messageInput.value = data.draftMessage;
            M.textareaAutoResize(messageInput);
        }
    });

    // Save message to storage on input
    messageInput.addEventListener('input', function() {
        chrome.storage.local.set({ 'draftMessage': messageInput.value });
    });
    // Clear draft button functionality
    // Handle clear draft button click
        clearDraftBtn.addEventListener('click', function() {
            if (messageInput.value.length > 0) {
                modalInstance.open();
            }
        });
    // Handle modal confirmation
    confirmOk.addEventListener('click', function() {
        messageInput.value = '';
        chrome.storage.local.remove('draftMessage');
        M.textareaAutoResize(messageInput);
    });
    
    // Load webhooks from storage and populate the dropdown
    function loadWebhooks() {
        chrome.storage.sync.get(['webhooks', 'lastSelectedWebhookUrl', 'lastSelectedWebhookObj'], function(data) {
            const webhooks = data.webhooks || [];
            const lastSelectedUrl = data.lastSelectedWebhookUrl; // this key is old logic
            const lastSelectedObj = data.lastSelectedWebhookObj; // this key is new logic
            webhookSelect.innerHTML = '';

            if (webhooks.length === 0) {
                chrome.runtime.sendMessage({ action: 'openSettings' });
                window.close();
            } else {
                let isSelectedSet = false;
                webhooks.forEach(hook => {
                    const option = document.createElement('option');
                    option.value = hook.url;
                    option.textContent = "# " + hook.name;
                    option.dataset.prefix = hook.prefix || '';
                    webhookSelect.appendChild(option);
                });

                // Set last selected option
                // priority 1: new logic ( storage with lastSelectedWebhookObj )
                if (lastSelectedObj) {
                    for (let i = 0; i < webhookSelect.options.length; i++) {
                        const opt = webhookSelect.options[i];
                        if (opt.value === lastSelectedObj.url && opt.textContent === `# ${lastSelectedObj.name}`) {
                            opt.selected = true;
                            isSelectedSet = true;
                            break;
                        }
                    }
                }
                // priority 2: old logic ( storage without lastSelectedWebhookObj )
                if (!isSelectedSet && lastSelectedUrl) {
                    for (let i = 0; i < webhookSelect.options.length; i++) {
                        const opt = webhookSelect.options[i];
                        if (opt.value === lastSelectedUrl) {
                            opt.selected = true;
                            break;
                        }
                    }
                }
            }

            // Initialize Materialize select
            const elems = document.querySelectorAll('select');
            M.FormSelect.init(elems);
            updatePrefixDisplay();
            getCurrentTabUrl();
        });
    }

    postButton.addEventListener('click', function() {
        postButton.disabled = true;
        loaderOverlay.classList.add('is-loading');
        
        let message = messageInput.value.trim();

        if (includeUrlToggle.checked && currentTabUrl && !includeUrlToggle.disabled) {
            message = `${message}\n\n${currentTabUrl}`;
        }

        const selectedOption = webhookSelect.options[webhookSelect.selectedIndex];
        const selectedWebhookUrl = selectedOption.value;
        const selectedWebhookName = selectedOption.textContent.substring(2); //remove "# "
        const prefix = selectedOption.dataset.prefix;

        const lastSelectedObj = { url: selectedWebhookUrl, name: selectedWebhookName };
        chrome.storage.sync.set({
            'lastSelectedWebhookObj': lastSelectedObj,
            'lastSelectedWebhookUrl': selectedWebhookUrl
        });

        if (message.trim() === '') {
            alert('required messages os current url if to post');
            postButton.disabled = false;
            loaderOverlay.classList.remove('is-loading');
            return;
        }

        const content = prefix ? `${prefix}${message}` : message;

        fetch(selectedWebhookUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            content: content
            })
        })
        .then(response => {
            if (response.ok) {
                chrome.storage.local.remove('draftMessage');
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
        const selectedOption = webhookSelect.options[webhookSelect.selectedIndex];
        const selectedWebhookUrl = selectedOption.value;
        const selectedWebhookName = selectedOption.textContent.substring(2); // remove "# "
        const lastSelectedObj = { url: selectedWebhookUrl, name: selectedWebhookName };
        chrome.storage.sync.set({
            'lastSelectedWebhookObj': lastSelectedObj,
            'lastSelectedWebhookUrl': selectedWebhookUrl,
        });
        updatePrefixDisplay();
    });

    messageInput.focus();
});