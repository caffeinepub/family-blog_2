import { Link, useNavigate } from '@tanstack/react-router';
import { PenSquare, Home, Heart } from 'lucide-react';
import { Button } from './ui/button';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'family-blog'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="relative w-full h-48 md:h-64 overflow-hidden">
          <img
            src="/assets/generated/header-banner.dim_1200x300.png"
            alt="Family blog header with warm earth tones and abstract shapes"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <h1 className="text-3xl md:text-4xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                Our Family Stories
              </h1>
            </Link>
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate({ to: '/create' })}>
                <PenSquare className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Our Family Stories. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-destructive fill-destructive" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
