# About the Prefix Feature
This document explains the new "Prefix" feature in DiscPost.

--

DicsPostのプレフィックス機能について解説します。

## What is the Prefix feature?
The Prefix feature is a optional setting.
It allows you to automatically set a unique text in your messages prefix , when you post.

The main advantage of this feature is that you can post messages has multiple posting puttern (as label)  to a single channel by using only just one WebHook.
This feature help when You and Discord-BOT search messages and categorize them.

--
プレフィックスはオプション設定です。
メッセージの頭に特定の文字を自動で挿入します。

メリットとしては、1つのWEBHOOKで1つのチャンネルに投稿するときに、投稿内容に複数のラベルのようなパターンを持たせることができ、検索やカテゴリ分けがしやすくなります。

## Use Case
There is a channel named journal.
This channel purpose is to store all, your life stlye, work log, ideas, cooking recipes...its so everything. 

Should we make Webhooks for each purpose ?
In this case, use prefix.
Please sow below:

--
例えば、日記のようなチャンネルがあったとします。このチャンネルは、日常や仕事の履歴、アイデア、レシピ等、とにかくなんでも保存するためにあります。

それぞれのカテゴリごとにWEBHOOKを作るのはめんどくさいですよね。
そんなときにプレフィックスを活用してください。

1. **In Setting screen , Register 3 records has same WebHook Address but other name (e.g. sandbox1-1,sandbox1-2, sandbox1-3 ).**

設定画面で同じWEBHOOKアドレスをもつ3つのレコードを、それぞれ別名で登録してください。
例:sandbox1-1,sandbox1-2, sandbox1-3

|name|url|prefix|
|-|-|-|
|sandbox1-1|https://discord.com/api/webhooks/AAAAA||
|sandbox1-2|https://discord.com/api/webhooks/AAAAA|isWorked:|
|sandbox1-3|https://discord.com/api/webhooks/AAAAA|isIdea:|

<img src="/exclude/img/readme-prefix-001.png">

1. **In popup screen , create your message : Forcus textarea label on attached images.**

ポップアップ画面でメッセージを作成してください（添付画像のテキストラベルに注目してください）

|name|textarea|
|-|-|
|sandbox1-1|<img src="/exclude/img/readme-prefix-002.png">|
|sandbox1-2|<img src="/exclude/img/readme-prefix-003.png">|
|sandbox1-3|<img src="/exclude/img/readme-prefix-004.png">|

3. **Post messages and check them in discord channel.**

Posted messages images in below:
実際にポストしたメッセージが以下の画像です。

<img src="/exclude/img/readme-prefix-005.png">

As you can see, using prefixes makes it easy to categorize posts within a single channel.
This allows you to easily find all reports later by using Discord's search function for `[Report]`. It also simplifies integration with external tools, such as AI summarizers.

--
ご覧の通り、プレフィックスを使うと一つのチャンネル内で複数のカテゴリを扱えます。これは後々、検索してまとめるときに役立ちますし、AI要約などの外部連携もしやすくなります。

--
Thank your reading.

ここまで読んでくれてありがとう。