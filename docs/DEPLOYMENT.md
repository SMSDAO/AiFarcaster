# Deployment Guide

This guide covers deploying AiFarcaster to Vercel and other platforms.

## Deploy to Vercel (Recommended)

### One-Click Deploy

The easiest way to deploy is using the Vercel button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SMSDAO/AiFarcaster)

This will:
1. Clone the repository to your GitHub account
2. Create a new Vercel project
3. Guide you through environment variable setup
4. Deploy your app

### Manual Deploy

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

Follow the prompts to:
- Link to a project or create new one
- Set project name
- Configure build settings

4. **Set Environment Variables**

```bash
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS
```

Or add them in the Vercel dashboard.

5. **Deploy to Production**

```bash
vercel --prod
```

## Deploy to Other Platforms

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy

### Railway

1. Create a new project from GitHub repo
2. Add environment variables
3. Railway will automatically detect Next.js and deploy

### AWS Amplify

1. Connect repository in Amplify console
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. Add environment variables
4. Deploy

## Custom Server Deployment

### Using Docker

Create `Dockerfile`:

> **Note:** This Dockerfile uses Next.js standalone output. Make sure your `next.config.js` enables it:
>
> ```js
> /** @type {import('next').NextConfig} */
> const nextConfig = {
>   output: 'standalone',
>   reactStrictMode: true,
>   swcMinify: true,
>   // ... other config
> };
>
> module.exports = nextConfig;
> ```

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t aifarcaster .
docker run -p 3000:3000 aifarcaster
```

### Traditional VPS

1. **Setup Node.js**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone and build**

```bash
git clone https://github.com/SMSDAO/AiFarcaster.git
cd AiFarcaster
npm install
npm run build
```

3. **Setup PM2**

```bash
npm install -g pm2
pm2 start npm --name "aifarcaster" -- start
pm2 save
pm2 startup
```

4. **Setup Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment

### Verify Deployment

1. Check that the site loads correctly
2. Test wallet connection
3. Verify navigation works
4. Test payment integrations
5. Check analytics tracking

### Configure Domain

#### Vercel

1. Go to project settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### Monitor Performance

1. Use Vercel Analytics for performance metrics
2. Set up error tracking (Sentry, LogRocket)
3. Monitor server logs
4. Track user analytics

## Continuous Deployment

### GitHub Actions

The project includes a CI/CD pipeline that:
- Runs on push to main/develop
- Executes linting and type checking
- Builds the application
- Runs security audits

Vercel automatically deploys:
- **Production**: Pushes to main branch
- **Preview**: Pull requests and other branches

## Troubleshooting

### Build Fails

- Check Node.js version (18+ required)
- Verify all dependencies install correctly
- Check environment variables are set
- Review build logs for specific errors

### Runtime Errors

- Check environment variables in production
- Verify API endpoints are accessible
- Check browser console for client errors
- Review server logs

### Performance Issues

- Enable caching in your CDN
- Optimize images and assets
- Use Next.js Image component
- Enable compression
- Monitor bundle size

## Rollback

### Vercel

1. Go to project > Deployments
2. Find the last working deployment
3. Click the three dots menu
4. Select "Promote to Production"

### Other Platforms

Follow your platform's rollback procedures, typically:
1. Find previous deployment
2. Redeploy or promote to production
3. Verify the rollback worked

## Security Checklist

- [ ] Environment variables are set securely
- [ ] No secrets in repository
- [ ] HTTPS is enabled
- [ ] CSP headers configured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Security headers set

## Support

Need help with deployment? 
- Check [documentation](./USER_GUIDE.md)
- Join our [Discord](https://discord.gg/aifarcaster)
- Open an [issue](https://github.com/SMSDAO/AiFarcaster/issues)
