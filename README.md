# Aurigraph Enterprise Portal

**Production-grade React 18/TypeScript enterprise dashboard for Aurigraph V12 blockchain**

- 🎨 **Modern UI** - React 18 with Material-UI components
- 🔐 **Secure** - OAuth 2.0 + JWT authentication via Keycloak
- ⚡ **High Performance** - Real-time updates with WebSocket integration
- 📊 **Rich Analytics** - Transaction history, validator metrics, network stats
- 🌍 **Multi-Tenant** - Enterprise-grade role-based access control (RBAC)
- 🚀 **Cloud Native** - Docker containers, Kubernetes ready

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Aurigraph Backend API running on http://localhost:9003

### Development

```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev
# Portal available at http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
```

## API Integration

**Backend URL**: `https://dlt.aurigraph.io/api/v12`

Endpoints:
- `GET /health` - Health check
- `GET /stats` - Transaction statistics
- `GET /analytics/dashboard` - Real-time metrics
- `GET /validators/{id}/rewards` - Validator rewards

## Architecture

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API client services
│   ├── store/              # State management (Redux/Context)
│   ├── styles/             # Global styles
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## CI/CD Workflows

- `portal-ci.yml` - Build + test + lint on PR
- `portal-deploy-staging.yml` - Auto-deploy to staging on main
- `portal-deploy-prod.yml` - Manual production deployment
- `portal-e2e.yml` - E2E tests with Playwright
- `portal-lighthouse.yml` - Weekly performance audits

## Deployment

### Staging

```bash
docker-compose -f infrastructure/docker/docker-compose.portal.yml up -d
```

### Production (Blue-Green)

```bash
# Handled by GitHub Actions on manual workflow dispatch
# Achieves 0 downtime via NGINX traffic switching
```

## Features

### Dashboard
- Real-time transaction feed
- Network statistics
- Validator performance metrics
- Historical analytics

### Blockchain Management
- Transaction search and details
- Block exploration
- Network topology visualization

### Governance
- Active proposals listing
- Vote casting
- Proposal history

### Administration
- User management
- System configuration
- Audit logs

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage reports
npm run test:coverage
```

## Security

- HTTPS/TLS 1.3 enforced
- CORS properly configured
- Rate limiting on API calls
- XSS protection enabled
- CSRF tokens on state-changing operations

## Support

- 📧 Email: support@aurigraph.io
- 📚 Docs: https://docs.aurigraph.io
- 🐛 Issues: GitHub Issues

## License

Apache License 2.0
