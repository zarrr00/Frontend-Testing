import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { ModeProvider } from './contexts/ModeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ModeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ModeProvider>,
);