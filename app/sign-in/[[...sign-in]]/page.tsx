import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Web Agency Workflow account</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 shadow-lg">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md px-4 py-2 transition-colors",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border rounded-md transition-colors",
                formFieldInput: 
                  "bg-background border border-border rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent",
                footerActionLink: "text-primary hover:text-primary/80 font-medium"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}