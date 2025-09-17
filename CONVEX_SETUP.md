# Convex Integration Guide

This guide will help you complete the Convex integration for your Web Agency Workflow system.

## 🚀 Getting Started

### 1. Create a Convex Account
1. Visit [dashboard.convex.dev](https://dashboard.convex.dev)
2. Sign up with your GitHub account or email
3. Create a new project

### 2. Initialize Convex Development
Run the following command to start Convex development and get your environment variables:

```bash
npx convex dev
```

This command will:
- Prompt you to log in to Convex (if not already logged in)
- Create a new deployment or connect to an existing one
- Generate your `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOY_KEY`
- Start the Convex development server

### 3. Configure Environment Variables
After running `npx convex dev`, update your `.env.local` file with the provided values:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key-here
```

### 4. Start Both Servers
You'll need to run both the Next.js development server and Convex development server:

**Terminal 1 - Next.js:**
```bash
npm run dev
```

**Terminal 2 - Convex:**
```bash
npm run convex
# or
npx convex dev
```

## 📊 Database Schema

Your Convex database includes the following tables:

### Clients
- Name, email, phone, company
- Status (active, inactive, pending)
- Timestamps for creation and updates

### Projects  
- Title, description, client relationship
- Status (planning, in_progress, review, completed, on_hold)
- Budget, currency, dates
- Progress tracking

### Leads
- Contact information and company details
- Lead source and status tracking
- Estimated value and conversion workflow

### Tasks
- Project-related tasks and assignments
- Priority levels and due dates
- Status tracking and team collaboration

### Analytics
- Revenue tracking and project metrics
- Lead conversion analytics
- Performance insights and reporting

## 🔄 Reactive Features

### Real-time Updates
- All data updates are automatically synchronized across all connected clients
- No manual refresh needed - changes appear instantly
- Optimistic updates for better user experience

### Available Queries
```typescript
// Projects
const projects = useQuery(api.projects.getProjects)
const projectsByStatus = useQuery(api.projects.getProjectsByStatus, { status: "in_progress" })

// Clients
const clients = useQuery(api.clients.getClients)
const activeClients = useQuery(api.clients.getClientsByStatus, { status: "active" })

// Analytics
const revenueMetrics = useQuery(api.analytics.getRevenueMetrics)
const projectMetrics = useQuery(api.analytics.getProjectMetrics)
```

### Available Mutations
```typescript
// Create new records
const createProject = useMutation(api.projects.createProject)
const createClient = useMutation(api.clients.createClient)
const createLead = useMutation(api.leads.createLead)

// Update existing records
const updateProject = useMutation(api.projects.updateProject)
const convertLead = useMutation(api.leads.convertLeadToClient)
const recordRevenue = useMutation(api.analytics.recordRevenue)
```

## 💰 Currency Integration

The system includes automatic currency conversion from USD to KSH:
- Conversion rate: 1 USD = 130 KSH
- All budget displays show KSH equivalents
- Revenue tracking supports multiple currencies

## 🔧 Component Usage

### Using Convex in Components
```typescript
"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"

export function MyComponent() {
  const projects = useQuery(api.projects.getProjects)
  const createProject = useMutation(api.projects.createProject)
  
  const handleCreate = async () => {
    await createProject({
      title: "New Project",
      clientId: "client-id",
      status: "planning"
    })
  }
  
  return (
    <div>
      {projects?.map(project => (
        <div key={project._id}>{project.title}</div>
      ))}
      <button onClick={handleCreate}>Create Project</button>
    </div>
  )
}
```

## 🚀 Deployment

### Development Deployment
Your Convex functions are automatically deployed when you save changes during development.

### Production Deployment
1. **Deploy Convex functions:**
   ```bash
   npx convex deploy --prod
   ```

2. **Deploy Next.js to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Environment Variables:**
   Add your production Convex URL to Vercel environment variables:
   ```
   NEXT_PUBLIC_CONVEX_URL=https://your-prod-project.convex.cloud
   ```

## 📁 Updated Components

The following components have been created/updated for Convex integration:

- `components/client-portal-convex.tsx` - Real-time client portal with Convex
- `lib/convex-provider.tsx` - Convex client provider
- `convex/schema.ts` - Database schema definitions
- `convex/clients.ts` - Client management functions
- `convex/projects.ts` - Project management functions  
- `convex/leads.ts` - Lead management and conversion
- `convex/analytics.ts` - Analytics and reporting
- `convex/tasks.ts` - Task management functions

## 🔄 Next Steps

1. **Run `npx convex dev`** to get your environment variables
2. **Update `.env.local`** with your Convex URLs
3. **Test the reactive features** by opening multiple browser tabs
4. **Customize the schema** to match your specific business needs
5. **Add authentication** using Convex Auth or your preferred provider
6. **Implement file uploads** using Convex file storage
7. **Add real-time notifications** using Convex presence

## 🆘 Troubleshooting

### Common Issues

**"Cannot connect to Convex"**
- Ensure `NEXT_PUBLIC_CONVEX_URL` is set correctly
- Verify Convex dev server is running
- Check network connectivity

**"Function not found"**
- Run `npx convex dev` to regenerate API types
- Ensure all functions are properly exported
- Check function names and parameters

**"Authentication errors"**
- Verify you're logged in to Convex CLI: `npx convex login`
- Check deploy key permissions
- Ensure project ownership

For more help, visit the [Convex documentation](https://docs.convex.dev) or join the [Convex Discord community](https://convex.dev/community).