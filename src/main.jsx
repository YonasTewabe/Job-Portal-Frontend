import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx'
import { PaymentProvider } from './context/PaymentContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          <PaymentProvider>
            <App />
          </PaymentProvider>
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
)
