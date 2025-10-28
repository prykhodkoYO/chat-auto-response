import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import './LoginButton.css';

interface LoginButtonProps {
  compact?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ compact = false }) => {
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        return;
      }

      const response = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    alert('Google login failed. Please try again.');
  };

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = googleClientId && googleClientId !== 'your-google-client-id-here';

  if (!isGoogleConfigured) {
    return (
      <div className={`login-button-container ${compact ? 'compact' : ''}`}>
        <button 
          className="login-btn" 
          onClick={() => {
            alert('To enable Google login, please set up Google OAuth credentials in the environment variables.');
          }}
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className={`login-button-container ${compact ? 'compact' : ''}`}>
      {compact ? (
        <div className="compact-google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="medium"
            text="signin"
            shape="rectangular"
            width="120"
          />
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
        />
      )}
    </div>
  );
};

export default LoginButton;