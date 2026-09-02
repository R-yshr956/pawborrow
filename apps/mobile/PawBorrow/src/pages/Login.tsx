import { useState, FormEvent } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import logo from '../assets/images/logo.png';
import './Login.css';

// TODO: replace with a real API call once the backend is ready
const MOCK_EMAIL = 'test@pawborrow.com';
const MOCK_PASSWORD = 'password123';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Mock check — swap this block for a real API call later
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Incorrect email or password.');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <form className="login-wrap" onSubmit={handleSubmit}>
          <h1 className="login-title">Login</h1>

          <img className="login-logo" src={logo} alt="PawBorrow logo" />

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="PawPaw@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="outer-login-password-wrap">
              <label htmlFor="password">Password</label>
              <div className="login-password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <IonIcon
                  icon={showPassword ? eyeOutline : eyeOffOutline}
                  className="login-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </div>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="login-forgot">
            Forgot Password? <a href="#">Click Here</a>
          </div>

          <button type="submit" className="login-btn">LOGIN</button>

          <div className="login-divider"></div>

          <button type="button" className="login-btn">LOGIN WITH EMAIL</button>
          <button type="button" className="login-btn">LOGIN WITH FACEBOOK</button>

          <p className="login-footer">
            By continue you agree to our <br />
            <a href="#">Terms &amp; Privacy Policy</a>
          </p>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;