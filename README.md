# LinKU-backend

Backend Repository for LinKU project (2023 iNThon)

## Execution Guide

### Prerequisites

- Node.js (version >= 16)

- PostgreSQL instance (version >= 14)

- Google API OAuth2 Credentials

- Firebase Cloud Messaging (FCM) Server Key

### Installation

```bash
npm install
```

### Environment Variable Configuration

target file: `.env.prod` or `env.dev`

```bash
# Application Port Setup
APP_PORT=3000
# Database Connection Setup
DB_HOST="127.0.0.1"
DB_PORT=5432
DB_USERNAME="postgres"
DB_PASSWORD="postgres"
DB_DATABASE="postgres"
# JWT configuration Setup
JWT_SECRET_KEY="******"
JWT_EXPIRES_IN=3600
JWT_REFRESH_EXPIRES_IN=604800
# Google API OAuth2 Credentials
GOOGLE_USER="admin@gmail.com"
GOOGLE_CLIENT_ID="******.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="******"
GOOGLE_REFRESH_TOKEN="******"
# Firebase Cloud Messaging (FCM) Server Key
FCM_ACCESS_KEY="******"
```

### Local Execution

```bash
npm run start:local
```

### Production Deployment

```bash
npm install -g pm2
npm run start:prod
# development: npm run start:dev
# restart: npm run restart
```
