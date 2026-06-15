import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "react-hot-toast"
import { UserProvider } from './context/user-context.tsx'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <App />
          <Toaster position='bottom-center' />
          <ReactQueryDevtools />
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
)
