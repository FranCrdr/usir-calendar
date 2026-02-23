import React, { useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError = () => ({ hasError: true });
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AppErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif', color: '#fff', background: '#0a0a0c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <h1>Algo ha fallado</h1>
          <p>Recarga la página. Si sigue fallando, borra la caché de la app o desinstala la PWA e instálala de nuevo.</p>
          <button onClick={() => this.setState({ hasError: false })} style={{ padding: '8px 16px', cursor: 'pointer' }}>Reintentar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const base = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
          const swUrl = `${base}/service-worker.js`;
          const scope = base ? `${base}/` : '/';
          const registration = await navigator.serviceWorker.register(swUrl, { scope });
          console.log('Service Worker registrado:', registration);
        } catch (error) {
          console.log('Fallo en SW:', error);
        }
      }
    };
    registerServiceWorker();
  }, []);

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
};

export default App;