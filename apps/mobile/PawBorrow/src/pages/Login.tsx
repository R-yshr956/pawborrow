import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import {
  eyeOutline,
  eyeOffOutline,
  mailOutline,
  lockClosedOutline,
  logoGoogle,
} from "ionicons/icons";

import { useAuth } from "../context/AuthContext";
import { signInWithGoogleMobile as signInWithGoogle } from "../utils/mobileAuth";

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const isBusy = loading || googleLoading;

  const inputClass =
    "w-full box-border rounded-xl border-[1.5px] border-[#f5b98a] " +
    "bg-white px-4 py-3 text-[clamp(0.85rem,2vw,1rem)] text-[#2b2a2a] " +
    "outline-none placeholder:text-[#cfcfcf] caret-[#f5821f] " +
    "[-webkit-text-fill-color:#2b2a2a]";

  const textButtonClass =
    "cursor-pointer border-0 bg-transparent p-0 font-[inherit] " +
    "text-[#9a9a9a] underline disabled:cursor-not-allowed " +
    "disabled:opacity-65";

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isBusy) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(normalizedEmail, password);
      navigate("/dashboard", { replace: true });
    } catch (loginError) {
      setError(
        getErrorMessage(
          loginError,
          "Unable to sign in. Please check your email and password.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (isBusy) return;

    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (googleError) {
      setError(getErrorMessage(googleError, "Unable to sign in with Google."));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen className="[--background:#ffffff]">
        <form
          onSubmit={handleLogin}
          className={[
            "mx-auto box-border flex w-full max-w-[420px] flex-col",
            "px-[clamp(18px,5vw,28px)]",
            "pt-[clamp(24px,6vh,48px)]",
            "pb-[clamp(24px,5vh,32px)]",
            "[@media(max-height:640px)]:pt-[18px]",
            "[@media(orientation:landscape)_and_(max-height:500px)]:pt-[12px]",
            "[@media(orientation:landscape)_and_(max-height:500px)]:pb-[10px]",
          ].join(" ")}
        >
          <h1
            className={[
              "mt-[clamp(24px,9vh,85px)] mb-1",
              "text-center text-[clamp(2.2rem,5vw,2.8rem)]",
              "font-bold text-[#f5821f]",
              "[@media(max-height:640px)]:mt-[20px]",
              "[@media(orientation:landscape)_and_(max-height:500px)]:mt-[10px]",
            ].join(" ")}
          >
            Login
          </h1>

          <img
            src="/images/logo.png"
            alt="PawBorrow logo"
            className={[
              "mx-auto mb-[clamp(20px,4vh,32px)] ml-[70px]",
              "block w-[clamp(110px,40vw,200px)] max-w-[200px]",
              "scale-[1.8]",
              "[@media(max-height:640px)]:mb-[14px]",
            ].join(" ")}
          />

          <div className="mt-[clamp(12px,2vh,20px)] mb-[clamp(12px,2vh,18px)]">
            <label
              htmlFor="login-email"
              className="mb-[6px] block text-[13px] text-[#333333]"
            >
              Email
            </label>

            <div className="relative flex items-center">
              <IonIcon
                icon={mailOutline}
                className="mr-2 shrink-0 text-[#8a8a8a]"
                aria-hidden="true"
              />

              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                required
                disabled={isBusy}
                className={`${inputClass} min-w-0`}
              />
            </div>

            <div className="mt-[10px]">
              <label
                htmlFor="login-password"
                className="mb-[6px] block text-[13px] text-[#333333]"
              >
                Password
              </label>

              <div className="relative flex items-center">
                <IonIcon
                  icon={lockClosedOutline}
                  className="mr-2 shrink-0 text-[#8a8a8a]"
                  aria-hidden="true"
                />

                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  required
                  disabled={isBusy}
                  className={`${inputClass} min-w-0 flex-1 pr-11`}
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isBusy}
                  className={[
                    "absolute right-[14px] cursor-pointer",
                    "border-0 bg-transparent p-[6px]",
                    "text-[20px] text-[#777777]",
                    "disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  <IonIcon
                    icon={showPassword ? eyeOffOutline : eyeOutline}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-[-8px] mb-[14px] text-center text-[13px] text-[#e0433d]"
            >
              {error}
            </p>
          )}

          <div className="mb-[22px] text-center text-[13px] text-[#333333]">
            Forgot Password?{" "}
            <button
              type="button"
              className={textButtonClass}
              onClick={() =>
                setError(
                  "Please contact the administrator to reset your password.",
                )
              }
              disabled={isBusy}
            >
              Click Here
            </button>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className={[
              "mb-[14px] w-full cursor-pointer rounded-xl",
              "border-0 bg-[#f5821f] py-[14px]",
              "text-[clamp(0.8rem,2vw,0.95rem)]",
              "font-bold tracking-[0.3px] text-white",
              "disabled:cursor-not-allowed disabled:opacity-65",
            ].join(" ")}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <p
            className={[
              "mt-[clamp(18px,4vh,50px)] scale-[1.3]",
              "text-center text-[clamp(0.7rem,1.8vw,0.85rem)]",
              "text-[#9a9a9a]",
            ].join(" ")}
          >
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className={textButtonClass}
              onClick={() => navigate("/signup")}
              disabled={isBusy}
            >
              Sign Up
            </button>
          </p>

          <div
            className={[
              "my-[18px] mb-[30px] flex w-full items-center gap-3",
              "border-t border-[#f5821f]",
              "text-[13px] text-[#8a8a8a]",
              "before:h-px before:flex-1 before:bg-[#dddddd]",
              "before:content-['']",
              "after:h-px after:flex-1 after:bg-[#dddddd]",
              "after:content-['']",
            ].join(" ")}
          >
            <span>OR</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isBusy}
            className={[
              "flex min-h-[50px] w-full cursor-pointer",
              "items-center justify-center gap-[10px]",
              "rounded-xl border border-[#dddddd]",
              "bg-white font-bold text-[#222222]",
              "disabled:cursor-not-allowed disabled:opacity-65",
            ].join(" ")}
          >
            <IonIcon
              icon={logoGoogle}
              aria-hidden="true"
              className="text-[22px] text-[#4285f4]"
            />
            <span>
              {googleLoading ? "CONNECTING..." : "CONTINUE WITH GOOGLE"}
            </span>
          </button>

          <p
            className={[
              "mt-[clamp(18px,4vh,50px)] scale-[1.3]",
              "text-center text-[clamp(0.7rem,1.8vw,0.85rem)]",
              "text-[#9a9a9a]",
            ].join(" ")}
          >
            By continuing, you agree to our
            <br />
            <button
              type="button"
              className={textButtonClass}
              onClick={() => navigate("/terms-of-service")}
              disabled={isBusy}
            >
              Terms of Service
            </button>
            {" and "}
            <button
              type="button"
              className={textButtonClass}
              onClick={() => navigate("/privacy-policy")}
              disabled={isBusy}
            >
              Privacy Policy
            </button>
          </p>
        </form>
      </IonContent>
    </IonPage>
  );
}
