import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import logo from '../assets/images/logo.png';
import { defaultUserProfile, type UserProfile } from '../context/AuthContext';
import '../style/Login.css';

// TODO: replace with a real API call once the backend is ready
const MOCK_EMAIL = 'test@pawborrow.com';
const MOCK_PASSWORD = 'password123';

interface LoginProps {
  onLoginSuccess: (profile?: Partial<UserProfile>) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both email and password.');
      return;
    }

    if (trimmedEmail.toLowerCase() === MOCK_EMAIL && trimmedPassword === MOCK_PASSWORD) {
      setError('');
      onLoginSuccess({
        ...defaultUserProfile,
        email: trimmedEmail,
      });
      navigate('/dashboard', { replace: true });
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
            <button type="button" className="login-terms-link" onClick={() => navigate('/terms-of-service')}>
              Terms &amp; Privacy Policy
            </button>
          </p>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;