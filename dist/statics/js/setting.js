document.addEventListener('DOMContentLoaded', function() {
    const addWebhookButton = document.getElementById('addWebhook');
    const webhookUrlInput = document.getElementById('webhook_url');
    const webhookNameInput = document.getElementById('webhook_name');
    const webhookList = document.getElementById('webhookList');

    function loadWebhooks() {
        chrome.storage.sync.get('webhooks', function(data) {
            const webhooks = data.webhooks || [];
            webhookList.innerHTML = '';

            webhooks.forEach((hook, index) => {
                const li = document.createElement('li');
                li.className = '';
                li.innerHTML = `
                    <div class="input-field">
                        <input type="text" value="${hook.name}" class="webhook-name-input" data-index="${index}" readonly>
                    </div>
                    <div class="action-icons">
                        <i class="material-icons edit-btn blue-text text-lighten-2" data-index="${index}">edit</i>
                        <i class="material-icons delete-btn red-text text-lighten-2" data-index="${index}">delete</i>
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
        document.querySelectorAll('.webhook-name-input').forEach(input => {
            input.addEventListener('keydown', handleInputKeydown);
            input.addEventListener('blur', handleInputBlur);
        });
    }

    function handleEditClick(e) {
        const index = e.target.dataset.index;
        const input = document.querySelector(`.webhook-name-input[data-index='${index}']`);
        input.readOnly = false;
        input.focus();
        input.select();
    }

    function handleInputKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
    }

    function handleInputBlur(e) {
        const input = e.target;
        input.readOnly = true;

        const index = input.dataset.index;
        const newName = input.value.trim();

        if (newName === '') {
            alert('it is required to enter a channel name');
            loadWebhooks();
            return;
        }

        chrome.storage.sync.get('webhooks', function(data) {
            const webhooks = data.webhooks || [];
            if (webhooks[index] && webhooks[index].name !== newName) {
                webhooks[index].name = newName;
                chrome.storage.sync.set({ 'webhooks': webhooks });
            }
        });
    }

    function handleDeleteClick(e) {
        if (confirm('you want to delete this webhook?')) {
            const index = e.target.dataset.index;
            chrome.storage.sync.get('webhooks', function(data) {
                const webhooks = data.webhooks || [];
                webhooks.splice(index, 1);
                chrome.storage.sync.set({ 'webhooks': webhooks }, function() {
                    loadWebhooks();
                });
            });
        }
    }

    addWebhookButton.addEventListener('click', function() {
        const url = webhookUrlInput.value.trim();
        const name = webhookNameInput.value.trim();

        if (url === '' || name === '') {
            alert('it is required to enter both the WEBHOOK URL and the channel name');
            return;
        }

        if (!url.includes('https://discord')) {
            alert('this is not a valid Discord WEBHOOK URL');
            return;
        }

        chrome.storage.sync.get('webhooks', function(data) {
            const webhooks = data.webhooks || [];
            webhooks.push({ url: url, name: name });
            chrome.storage.sync.set({ 'webhooks': webhooks }, function() {
                webhookUrlInput.value = '';
                webhookNameInput.value = '';
                loadWebhooks();
            });
        });
    });

    loadWebhooks();
});