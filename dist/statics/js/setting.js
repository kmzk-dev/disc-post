document.addEventListener('DOMContentLoaded', function() {
    const addWebhookButton = document.getElementById('addWebhook');
    const webhookUrlInput = document.getElementById('webhook_url');
    const webhookNameInput = document.getElementById('webhook_name');
    const webhookPrefixInput = document.getElementById('webhook_prefix');
    const webhookList = document.getElementById('webhookList');

    function loadWebhooks() {
        chrome.storage.sync.get('webhooks', function(data) {
            const webhooks = data.webhooks || [];
            webhookList.innerHTML = '';

            webhooks.forEach((hook, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="row">
                        <div class="input-field col s3">
                            <input id="name_${index}" type="text" value="${hook.name}" class="webhook-name-input" data-index="${index}" readonly>
                            <label for="name_${index}" class="active">Name</label>
                        </div>
                        <div class="input-field col s8">
                            <input id="prefix_${index}" type="text" value="${hook.prefix || ''}" class="webhook-prefix-input" data-index="${index}" readonly>
                            <label for="prefix_${index}" class="active">Prefix</label>
                        </div>
                        <div class="col s1 action-icons">
                            <i class="material-icons edit-btn blue-text text-lighten-2" data-index="${index}" style="cursor: pointer;">edit</i>
                            <i class="material-icons delete-btn red-text text-lighten-2" data-index="${index}" style="cursor: pointer;">delete</i>
                        </div>
                    </div>
                `;
                webhookList.appendChild(li);
            });

            attachEventListeners();
        });
    }

    function attachEventListeners() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteClick);
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEditClick);
        });
        document.querySelectorAll('.webhook-name-input, .webhook-prefix-input').forEach(input => {
            input.addEventListener('keydown', handleInputKeydown);
            input.addEventListener('blur', handleInputBlur);
        });
    }

    function handleEditClick(e) {
        const index = e.target.dataset.index;
        const nameInput = document.querySelector(`.webhook-name-input[data-index='${index}']`);
        const prefixInput = document.querySelector(`.webhook-prefix-input[data-index='${index}']`);
        nameInput.readOnly = false;
        prefixInput.readOnly = false;
        nameInput.focus();
        nameInput.select();
    }

    function handleInputKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
    }

    function handleInputBlur(e) {
        const index = e.target.dataset.index;
        
        setTimeout(() => {
            const nameInput = document.querySelector(`.webhook-name-input[data-index='${index}']`);
            const prefixInput = document.querySelector(`.webhook-prefix-input[data-index='${index}']`);

            // If focus has moved to a different element that is not the paired input, then save and set to readonly.
            if (document.activeElement !== nameInput && document.activeElement !== prefixInput) {
                nameInput.readOnly = true;
                prefixInput.readOnly = true;

                const newName = nameInput.value.trim();
                const newPrefix = prefixInput.value.trim();

                if (newName === '') {
                    alert('it is required to enter a channel name');
                    loadWebhooks();
                    return;
                }

                chrome.storage.sync.get('webhooks', function(data) {
                    const webhooks = data.webhooks || [];
                    if (webhooks[index]) {
                        const oldName = webhooks[index].name;
                        const oldPrefix = webhooks[index].prefix || '';
                        if (oldName !== newName || oldPrefix !== newPrefix) {
                            webhooks[index].name = newName;
                            webhooks[index].prefix = newPrefix;
                            chrome.storage.sync.set({ 'webhooks': webhooks }, () => {
                                // Clean up the wrong key just in case
                                chrome.storage.sync.remove('undefined');
                            });
                        }
                    }
                });
            }
        }, 100);
    }

    function handleDeleteClick(e) {
        if (confirm('you want to delete this webhook?')) {
            const index = e.target.dataset.index;
            chrome.storage.sync.get(['webhooks', 'undefined'], function(data) {
                let webhooks = data.webhooks || data.undefined || [];
                webhooks.splice(index, 1);
                chrome.storage.sync.set({ 'webhooks': webhooks }, function() {
                    chrome.storage.sync.remove('undefined', () => {
                        loadWebhooks();
                    });
                });
            });
        }
    }

    addWebhookButton.addEventListener('click', function() {
        const url = webhookUrlInput.value.trim();
        const name = webhookNameInput.value.trim();
        const prefix = webhookPrefixInput.value.trim();

        if (url === '' || name === '') {
            alert('it is required to enter both the WEBHOOK URL and the channel name');
            return;
        }

        if (!url.includes('https://discord')) {
            alert('this is not a valid Discord WEBHOOK URL');
            return;
        }

        chrome.storage.sync.get(['webhooks', 'undefined'], function(data) {
            let webhooks = data.webhooks || data.undefined || [];
            webhooks.push({ url: url, name: name, prefix: prefix });
            chrome.storage.sync.set({ 'webhooks': webhooks }, function() {
                chrome.storage.sync.remove('undefined', () => {
                    webhookUrlInput.value = '';
                    webhookNameInput.value = '';
                    webhookPrefixInput.value = '';
                    M.updateTextFields();
                    loadWebhooks();
                });
            });
        });
    });

    loadWebhooks();
});