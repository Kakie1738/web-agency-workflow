# Production Environment Variables Setup

## After your Vercel deployment completes, follow these steps:

### 1. Get your Production URL
- Note your production URL (e.g., `https://web-agency-workflow.vercel.app`)

### 2. Set Environment Variables in Vercel Dashboard
Go to your Vercel project → Settings → Environment Variables and add:

```
# Clerk Authentication (Production Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your-production-publishable-key
CLERK_SECRET_KEY=sk_live_your-production-secret-key

# Clerk URL Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex (Use your existing production deployment)
NEXT_PUBLIC_CONVEX_URL=https://famous-gull-199.convex.cloud
CONVEX_DEPLOY_KEY=prod:famous-gull-199|your-deploy-key

# Clerk Webhook (Production)
WEBHOOK_SECRET=whsec_your-production-webhook-secret
```

### 3. Set up Production Clerk Application
1. **Create a new Clerk application** for production (or use existing)
2. **Get production API keys** (pk_live_* and sk_live_*)
3. **Update environment variables** in Vercel
4. **Configure webhook** with your production URL:
   ```
   https://your-vercel-app.vercel.app/api/webhooks/clerk
   ```

### 4. Deploy Convex to Production
```bash
npm run convex:deploy:prod
```

### 5. Test Production Authentication
1. Visit your production URL
2. Test sign-up and sign-in flows
3. Verify protected routes work correctly
4. Check webhook functionality

## Notes:
- Use production Clerk keys for live deployment
- Webhook URL must use your actual production domain
- Test thoroughly before announcing to users