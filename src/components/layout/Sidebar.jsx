import { Link, useLocation } from 'react-router-dom';
import { Terminal, Shield, Users, LogOut, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function Sidebar() {
  const { pathname } = useLocation();
  const { logout, user } = useAuth(); // We might need to fetch user role or just show all for now and let backend fail

  const navItems = [
    { label: 'TERMINAL', icon: Terminal, href: '/' },
    { label: 'RULES', icon: Shield, href: '/admin/rules' }, // admin only usually
    { label: 'USERS', icon: Users, href: '/admin/users' }, // admin only usually
    { label: 'LOGS', icon: FileText, href: '/admin/logs' }, // admin only usually
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-mono font-bold text-primary">
            <Terminal className="h-5 w-5" />
            <span>COMMAND_GATEWAY</span>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50 font-mono tracking-wide",
                pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-4">
           {/* If we had user details, we could show credits here */}
           {/* <div className="mb-4 text-xs text-muted-foreground font-mono">
              CREDITS: {user?.credits || '---'}
           </div> */}
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 pl-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            DISCONNECT
          </Button>
        </div>
      </div>
    </aside>
  );
}
