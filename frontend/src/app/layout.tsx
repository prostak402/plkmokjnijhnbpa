'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppProvider } from '@/context/BookmarksContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="ru">
      <body>
        <AppProvider>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              overflow: 'hidden',
            }}
          >
            <symbol id="i-home" viewBox="0 0 24 24">
              <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" />
            </symbol>
            <symbol id="i-clips" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="14" rx="3" />
              <path d="M10 8v6l5-3-5-3Z" fill="currentColor" stroke="none" />
            </symbol>
            <symbol id="i-search" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </symbol>
            <symbol id="i-ellipsis" viewBox="0 0 24 24">
              <circle cx="6" cy="12" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="18" cy="12" r="1.7" />
            </symbol>
            <symbol id="i-user" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </symbol>
            <symbol id="i-bookmark" viewBox="0 0 24 24">
              <path d="M6 3h12v18l-6-4-6 4V3Z" />
            </symbol>
            <symbol id="i-heart" viewBox="0 0 24 24">
              <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10Z" />
            </symbol>
            <symbol id="i-chat" viewBox="0 0 24 24">
              <path d="M21 12a8 8 0 1 1-3.1-6.36L21 6l-.26 3.13A8 8 0 0 1 21 12Z" />
            </symbol>
            <symbol id="i-share" viewBox="0 0 24 24">
              <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
              <path d="M12 16V3m0 0 4 4M12 3 8 7" />
            </symbol>
            <symbol id="i-play" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7-11-7Z" fill="currentColor" stroke="none" />
            </symbol>
            <symbol id="i-x" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6 6 18" />
            </symbol>
          </svg>
          <div className="layout" id="app">
            <aside className="sidebar">
              <div className="brand">
                <span className="diamond"></span>
                <span>Ton.Place</span>
              </div>
              <nav className="snav" id="sidebarNav">
                <Link
                  href="/feed"
                  className={`sitem ${pathname === '/feed' ? 'active' : ''}`}
                >
                  <svg className="ic">
                    <use href="#i-clips" />
                  </svg>
                  <span>Клипы</span>
                </Link>
                <Link
                  href="/bookmarks"
                  className={`sitem ${pathname === '/bookmarks' ? 'active' : ''}`}
                >
                  <svg className="ic">
                    <use href="#i-bookmark" />
                  </svg>
                  <span>Закладки</span>
                </Link>
                <Link
                  href="/profile"
                  className={`sitem ${pathname === '/profile' ? 'active' : ''}`}
                >
                  <svg className="ic">
                    <use href="#i-user" />
                  </svg>
                  <span>Профиль</span>
                </Link>
              </nav>
            </aside>
            <div className="stage-wrap">{children}</div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
