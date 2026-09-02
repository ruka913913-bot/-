# Chatwork Log Bots

ChatworkのWebhookを受け取り、指定したログ用ルームへメッセージを転送するCloudflare Workers用コードです。

## 構成

- `bot1/worker.js`: 374987857 → 446319897
- `bot2/worker.js`: 443728145 → 446827757
- `bot3/worker.js`: 401044905 → 446827780

各Workerは1つのWebhookと1つのログルームだけを担当します。

## Cloudflare Secrets

各Workerに以下の2つを設定します。

- `CHATWORK_API_TOKEN`
- `CHATWORK_WEBHOOK_TOKEN`

トークンそのものはGitHubには保存しません。
