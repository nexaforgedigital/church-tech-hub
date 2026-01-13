import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useRouter } from 'next/router';
import ErrorBoundary from '../components/ErrorBoundary';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

// Pages that should NOT show Navigation/Footer (fullscreen/admin pages)
const noLayoutPages = [
  '/worship-presenter',
  '/presenter-control-worship',
  '/presenter-control',
  '/mobile-remote',
  '/remote-control',
  '/present',
  '/presenter',
  '/admin/add-song-bulk',
  '/admin/import-songs',
  '/admin',
  '/admin/quick-add',
  '/admin/batch-add',
  '/admin/songs',
  '/admin/settings',
  '/admin',
  '/admin/preview',
  '/admin/structure',
  '/admin/youtube-finder',
  '/admin/chords',
  '/admin/statistics',
  '/admin/merge',
  '/admin/import-files',
  '/admin/categories',
  '/admin/backup',
  '/admin/requests',
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Check if current page should hide navigation/footer
  const hideLayout = noLayoutPages.some(page => 
    router.pathname === page || router.pathname.startsWith(page + '/')
  );

  return (
    <ErrorBoundary>
      {/* Show Navigation on all pages except presenter/fullscreen/admin pages */}
      {!hideLayout && <Navigation />}
      
      {/* Main Content */}
      <main className={hideLayout ? '' : 'min-h-screen'}>
        <Component {...pageProps} />
      </main>
      
      {/* Show Footer on all pages except presenter/fullscreen/admin pages */}
      {!hideLayout && <Footer />}
      
      {/* Analytics */}
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  );
}

export default MyApp;