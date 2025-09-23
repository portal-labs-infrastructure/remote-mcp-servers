import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]" />

      <div className="relative w-full max-w-md">
        <Card className="shadow-2xl border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <div className="h-8 w-8 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 text-center">
                Welcome to Remote MCPs!
              </CardTitle>
              <CardDescription className="text-center text-base">
                Your account has been created successfully
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Please check your email to confirm your account before signing
                in. The confirmation link will activate your account and give
                you full access to Remote MCPs.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">
                What&apos;s next?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                  <span>Check your email for a confirmation link</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                  <span>Click the link to activate your account</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                  <span>Start sharing and discovering MCP servers</span>
                </li>
              </ul>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105">
                Continue to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
