# DiscPost
DiscPost is a Chrome extension for quickly posting text messages to specific Discord channels. By registering Webhook URLs in advance, you can easily send messages from the extension's popup.


[Chrome Web Store: DiscPost](https://chromewebstore.google.com/detail/egcnmhmnklehkbphcnmnpkbeekikeilp?utm_source=item-share-cb)
[Article(JP): note](https://note.com/fillmee/n/n57a50c7bbcd2)

## Purpose and Concept
While Discord chat is very convenient, it can be a bit of a hassle to switch between apps or browser tabs every time you want to share information or a memo for a specific project or team.

DiscPost was developed to meet the my need to "post memos and information to Discord without leaving the browser and without interrupting your train of thought." With its simple UI and keyboard shortcuts, it enables rapid information sharing without disrupting your browsing flow.

### Specific Use Cases
I personally use this extension as a "hub for my thoughts" in my daily work. I use Discord not just as a communication tool, but as a place to consolidate all kinds of information, and the purpose of this extension is to maximize that efficiency.

- **Instantly memo fragments of thoughts:** I send ideas, tasks, and things I want to check later to my personal Discord channel before the thought is gone, whether I'm researching on the web or in the middle of development. Since there's no need to switch browser tabs, I can take notes while maintaining focus.
- **Stock information with context:** I post URLs of interesting articles or code snippets I want to reference to the development channel with a brief memo. This makes it easy to understand why I saved it when I look back later.
- **Organize information for multiple projects:** I've created channels for several development projects and set up webhooks for them. I can instantly post ideas and knowledge gained from browsing to any project channel by quickly switching the destination from the dropdown.
- **Draft daily reports and work logs:** I post the work I've done and what I've learned throughout the day to a log channel on Discord as I complete them.

These posts are sent as unorganized scraps. A separate Discord BOT I've set up circulates through the channels, organizes and summarizes the information, and posts it in a dedicated, organized channel.

By thoroughly eliminating **the extra step of "opening Discord"** and completing the action within the browser, it achieves stress-free information consolidation.

## Main Features
- **Post messages via Webhook:** Register multiple Discord Webhook URLs and select the posting destination from a dropdown list.
- **Webhook Management:** Easily add, edit names, and delete webhooks on the settings page. There is no limit to the number of webhooks you can register.

It is recommended to assign a keyboard shortcut to open the popup from the Chrome extension settings.

### UI/UX:
- **User-Friendly:** Designed to make it clear where the focus is when switching with the TAB key. You can quickly post messages with `Ctrl + Enter` (or `Cmd + Enter` on Mac) in the input area.
- Remembers the last selected destination to make your next post smoother.

## Tech Stack
- Platform: Google Chrome Extension (Manifest V3)
- Data Store: chrome.storage.local

## How to Use
### Installation
Install DiscPost from the Chrome Web Store.
[Chrome Web Store: DiscPost](https://chromewebstore.google.com/detail/egcnmhmnklehkbphcnmnpkbeekikeilp?utm_source=item-share-cb)

**Recommended:** Set a keyboard shortcut to open the DiscPost popup from the extension management page. Please access chrome://extensions/shortcuts to set it up.

### Tutorial
It's very simple to use.

#### Get a Webhook URL from Discord
In the Discord channel you want to post to, go to "Edit Channel" → "Integrations" → "Create Webhook" to create a webhook and copy the URL.

#### Register the Webhook in DiscPost
Click the extension icon to open the popup, then click the gear icon in the upper right.
On the settings page that opens, enter the "Webhook URL" and a "Webhook Name" for your management (e.g., "general", "dev-memo"), and register it with the `ADD` button.

> The first time you launch it, you will be automatically redirected to the WEBHOOK settings screen.

<img src="/exclude/img/readme-sample-002.png">

#### Post a Message
Open the popup with the extension icon (or the shortcut key you set).
Enter the message you want to post.
Select the destination webhook from the dropdown list.
Press `Ctrl + Enter` when textarea forcused , or click the `CTRL+Enter` button to post.

<img src="/exclude/img/readme-sample-001.png">

---

Thank you for reading this far.
Enjoy your Discord life!