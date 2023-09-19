import React, { Suspense, lazy, useEffect, useState } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './modules/Layout';

import { HomePage } from './pages/HomePage';
const ServicesPage = lazy(() => import('./pages/ServicesPage/ServicesPage'));

// const isBrowser = typeof window !== 'undefined';

function AppWrap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <BrowserRouter basename="/">
          <Suspense fallback={<></>}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      )}
    </>
  );
}

function AppComponent() {
  return (
    <AppWrap />
  );
}

export const App = () => <AppComponent />;
