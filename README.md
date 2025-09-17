# 🚀 Web Agency Workflow Management System

A comprehensive web-based workflow management system tailored for agency operations, built with modern React and Next.js technologies with real-time Convex backend integration.

## ✨ Features

- **📊 Analytics Dashboard**: Real-time business metrics and reporting
- **👥 Client Management**: Comprehensive client data management with KSH currency support
- **🏗️ Project Workflow**: Live project tracking and management system
- **🎯 CRM System**: Advanced lead management with conversion tracking
- **✅ Task Management**: Team collaboration with real-time updates
- **🔍 Quality Assurance**: QA tools and workflows
- **🌙 Dark/Light Mode**: System preference detection and manual toggle
- **📱 Responsive Design**: Mobile and desktop optimized

## 🛠️ Technology Stack

### Frontend
- **Next.js 14.2.16** with App Router
- **React 18** with Server and Client Components
- **TypeScript 5** for type safety
- **Tailwind CSS 4.1.9** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

### Backend
- **Convex** - Reactive real-time database
- **Type-safe APIs** with automatic code generation
- **Real-time synchronization** across all clients

### Forms & Validation
- **React Hook Form 7.60.0** for form management
- **Zod 3.25.67** for schema validation

### Additional Tools
- **Date-fns** for date manipulation
- **Recharts** for analytics visualization
- **Sonner** for toast notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/web-agency-workflow.git
   cd web-agency-workflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Convex backend**
   ```bash
   # Login to Convex (opens browser)
   npx convex login
   
   # Initialize and deploy backend
   npx convex dev --once --configure=new
   ```

4. **Start development servers**
   
   **Terminal 1 - Convex Backend:**
   ```bash
   npx convex dev
   ```
   
   **Terminal 2 - Next.js Frontend:**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
web-agency-workflow/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics dashboard
│   ├── clients/           # Client management
│   ├── crm/               # CRM system
│   ├── projects/          # Project workflow
│   ├── qa/                # Quality assurance
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/                # Radix UI primitives
│   ├── analytics-reporting.tsx
│   ├── client-portal.tsx
│   ├── dashboard-layout.tsx
│   └── project-workflow.tsx
├── convex/                # Backend functions
│   ├── schema.ts          # Database schema
│   ├── clients.ts         # Client operations
│   ├── projects.ts        # Project operations
│   ├── leads.ts           # Lead management
│   ├── analytics.ts       # Analytics functions
│   └── tasks.ts           # Task management
├── lib/                   # Utility functions
└── hooks/                 # Custom React hooks
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key
```

These will be automatically generated when you run `npx convex dev --once --configure=new`.

## 📊 Key Features

### Real-time Capabilities
- **Live Data Updates**: Changes sync instantly across all users
- **Multi-user Collaboration**: Multiple team members can work simultaneously
- **Real-time Analytics**: Business metrics update live
- **Instant Notifications**: Project updates appear immediately

### Client Management
- Complete client information management
- Project assignment and tracking
- Communication history
- Currency conversion (USD to KSH)

### Project Workflow
- Project status tracking
- Task assignment and management
- Timeline visualization
- Team collaboration tools

### Analytics & Reporting
- Revenue tracking and metrics
- Project completion rates
- Lead conversion analytics
- Custom date range reports

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

3. **Configure environment variables** in Vercel dashboard

### Backend Deployment (Convex)

Your Convex backend is automatically deployed when you run:
```bash
npx convex deploy --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run convex:dev` - Start Convex development server
- `npm run convex:deploy` - Deploy Convex functions

## 🐛 Known Issues

- Mobile responsiveness may require additional customization
- Some UI components may need business logic integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Convex](https://convex.dev/)
- UI components from [Radix UI](https://radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

## 🔗 Links

- [Live Demo](https://your-deployment-url.vercel.app)
- [Convex Dashboard](https://dashboard.convex.dev)
- [Documentation](https://github.com/your-username/web-agency-workflow/wiki)

---

**Made with ❤️ for modern web agencies**