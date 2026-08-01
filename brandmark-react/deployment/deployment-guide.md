# BM-OS Deployment Guide

This guide covers the deployment of the BM-OS stack using Docker Compose.

## Architecture
- **Frontend**: React (Vite) served via Nginx.
- **Backend/Middleware**: Node.js/Express.
- **Orchestrator**: Self-hosted n8n.
- **Database**: Supabase Cloud (Managed).

## Prerequisites
1. A Linux server (Ubuntu 22.04 LTS recommended) with at least 4GB RAM.
2. Docker and Docker Compose installed.
3. Domain names mapped to your server IP (e.g., `app.brandmark.com`, `n8n.brandmark.com`).
4. Managed Supabase project.

## Step-by-Step Deployment

1. **Clone the Repository**
   ```bash
   git clone https://github.com/irahulsinghrajput/BrandMark.git
   cd BrandMark/brandmark-react/deployment
   ```

2. **Configure Environment**
   ```bash
   cp .env.production.example .env.production
   nano .env.production
   ```
   *Fill in your Supabase URLs, OpenAI keys, and n8n credentials.*

3. **Build and Launch**
   ```bash
   docker-compose up -d --build
   ```

4. **Verify Health**
   Check the logs to ensure all containers started properly:
   ```bash
   docker-compose logs -f
   ```

5. **Reverse Proxy & SSL**
   It is highly recommended to use Caddy, Traefik, or Nginx Proxy Manager in front of the docker-compose stack to handle SSL termination.

## Rollback Procedure
If a deployment fails:
1. Revert the Git commit: `git checkout <previous-commit-hash>`
2. Rebuild: `docker-compose up -d --build`
3. If database schema is corrupted, restore via Supabase Dashboard (PITR).
