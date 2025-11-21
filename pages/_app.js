import '../styles/globals.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Pages that shouldn't show navigation/footer (fullscreen presentation modes)
  const hideNavPages = [
    '/present/',
    '/worship-presenter',
    '/presenter-control-worship'
  ];
  
  const shouldHideNav = hideNavPages.some(path => router.pathname.includes(path));

  if (shouldHideNav) {
    return (
      <>
        <Head>
          <title>ChurchAssist - Presentation Mode</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>ChurchAssist - Professional Worship Solutions</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Professional worship presentation and lyrics management for churches. Tamil & English songs, service planning, and tech resources." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default MyApp;