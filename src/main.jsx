import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { ModeProvider } from './contexts/ModeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ConfirmProvider } from './contexts/ConfirmContext.jsx';
import { Toaster } from "@/components/ui/sonner";

ReactDOM.createRoot(document.getElementById('root')).render(
  <ModeProvider>
    <AuthProvider>
      <ConfirmProvider>
        <App />
        <Toaster />
      </ConfirmProvider>
    </AuthProvider>
  </ModeProvider>,
);