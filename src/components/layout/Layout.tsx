import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuth = location.pathname === '/auth';
  const isAdmin = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      {!isAuth && !isAdmin && <Header />}
      <main className={!isAuth && !isAdmin && !isHome ? 'pt-16 pb-20' : isHome ? 'pb-20' : ''}>
        {children}
      </main>
      {!isAuth && !isAdmin && <BottomNav />}
    </div>
  );
}
