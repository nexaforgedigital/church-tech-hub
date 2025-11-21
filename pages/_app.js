import '../styles/globals.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Pages that shouldn't show navigation/footer (fullscreen presentation modes)
  const hideNavPages = [
    '/present/[songId]',
    '/worship-presenter',
    '/presenter-control-worship'
  ];
  
  const shouldHideNav = hideNavPages.some(path => router.pathname.includes(path.replace('[songId]', '')));

  if (shouldHideNav) {
    return <Component {...pageProps} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;