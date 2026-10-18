import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  logoGoogle,
  mailOutline,
  personOutline,
} from "ionicons/icons";
import { signUp } from "@repo/api";

import {
  listenForMobileAuth,
  signInWithGoogleMobile as signInWithGoogle,
} from "../utils/mobileAuth";

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

export default function SignUp() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isBusy = loading || googleLoading;
  const formDisabled = isBusy || Boolean(success);

  const inputClass = [
    "h-12 w-full rounded-xl border-[1.5px] border-froly-200",
    "bg-white py-3 pl-11 pr-4 text-sm text-alabaster-950",
    "outline-none transition duration-200",
    "placeholder:text-alabaster-300",
    "focus:border-froly-400 focus:ring-4 focus:ring-froly-100",
    "disabled:cursor-not-allowed disabled:bg-alabaster-50 disabled:opacity-65",
  ].join(" ");

  const passwordInputClass = `${inputClass} pr-12`;

  useEffect(() => {
    return listenForMobileAuth(
      () => navigate("/dashboard", { replace: true }),
      setError,
    );
  }, [navigate]);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formDisabled) return;

    setError("");
    setSuccess("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !normalizedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const registration = await signUp(
        normalizedEmail,
        password,
        trimmedFirstName,
        trimmedLastName,
      );

      setPassword("");
      setConfirmPassword("");

      if (registration.session) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setSuccess(
        "Account created. Check your email to confirm your account before logging in.",
      );
    } catch (registrationError) {
      setError(
        getErrorMessage(
          registrationError,
          "Unable to register. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    if (isBusy) return;

    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (googleError) {
      setError(
        getErrorMessage(
          googleError,
          "Unable to sign up with Google.",
        ),
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen className="[--background:#ffffff]">
        <main
          className={[
            "mx-auto min-h-full w-full max-w-[420px]",
            "px-[clamp(18px,5vw,28px)]",
            "pb-[calc(32px+env(safe-area-inset-bottom))]",
            "pt-[calc(20px+env(safe-area-inset-top))]",
          ].join(" ")}
        >
          <header className="mb-7 flex flex-col items-center text-center">
            <img
              src="/images/logo.png"
              alt="PawBorrow logo"
              className="mb-3 h-auto w-[clamp(130px,42vw,190px)] object-contain"
            />

            <h1 className="m-0 font-cherry text-3xl leading-none text-froly-400">
              Create Account
            </h1>

            <p className="mb-0 mt-2 text-sm leading-5 text-alabaster-500">
              Join PawBorrow and meet your next PawPal.
            </p>
          </header>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="signup-first-name"
                  className="mb-1.5 block text-[13px] font-semibold text-alabaster-900"
                >
                  First name
                </label>

                <div className="relative">
                  <IonIcon
                    icon={personOutline}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-alabaster-400"
                  />
                  <input
                    id="signup-first-name"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value);
                      setError("");
                    }}
                    required
                    disabled={formDisabled}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-last-name"
                  className="mb-1.5 block text-[13px] font-semibold text-alabaster-900"
                >
                  Last name
                </label>

                <div className="relative">
                  <IonIcon
                    icon={personOutline}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-alabaster-400"
                  />
                  <input
                    id="signup-last-name"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value);
                      setError("");
                    }}
                    required
                    disabled={formDisabled}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-1.5 block text-[13px] font-semibold text-alabaster-900"
              >
                Email address
              </label>

              <div className="relative">
                <IonIcon
                  icon={mailOutline}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-alabaster-400"
                />
                <input
                  id="signup-email"
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
                  disabled={formDisabled}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-1.5 block text-[13px] font-semibold text-alabaster-900"
              >
                Password
              </label>

              <div className="relative">
                <IonIcon
                  icon={lockClosedOutline}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-alabaster-400"
                />
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  minLength={6}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  required
                  disabled={formDisabled}
                  className={passwordInputClass}
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={formDisabled}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg border-0 bg-transparent text-xl text-alabaster-500 transition active:scale-90 disabled:opacity-50"
                >
                  <IonIcon
                    icon={showPassword ? eyeOffOutline : eyeOutline}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-confirm-password"
                className="mb-1.5 block text-[13px] font-semibold text-alabaster-900"
              >
                Confirm password
              </label>

              <div className="relative">
                <IonIcon
                  icon={lockClosedOutline}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-alabaster-400"
                />
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  minLength={6}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError("");
                  }}
                  required
                  disabled={formDisabled}
                  className={passwordInputClass}
                />

                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  disabled={formDisabled}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg border-0 bg-transparent text-xl text-alabaster-500 transition active:scale-90 disabled:opacity-50"
                >
                  <IonIcon
                    icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="m-0 rounded-xl bg-froly-50 px-4 py-3 text-center text-[13px] leading-5 text-froly-700"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="m-0 rounded-xl bg-emerald-50 px-4 py-3 text-center text-[13px] leading-5 text-emerald-700"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={formDisabled}
              className="min-h-12 w-full rounded-xl border-0 bg-froly-400 px-5 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_8px_20px_rgba(245,120,123,0.25)] transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>

            <p className="m-0 text-center text-[13px] text-alabaster-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                disabled={isBusy}
                className="border-0 bg-transparent p-0 font-semibold text-froly-500 underline underline-offset-2 disabled:opacity-60"
              >
                Log in
              </button>
            </p>

            <div className="flex items-center gap-3 py-1 text-xs text-alabaster-400 before:h-px before:flex-1 before:bg-alabaster-200 before:content-[''] after:h-px after:flex-1 after:bg-alabaster-200 after:content-['']">
              <span>OR</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isBusy}
              className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-alabaster-200 bg-white px-5 py-3 text-sm font-bold text-alabaster-950 shadow-sm transition duration-200 active:scale-[0.98] disabled:opacity-60"
            >
              <IonIcon
                icon={logoGoogle}
                aria-hidden="true"
                className="text-[22px] text-[#4285f4]"
              />
              <span>
                {googleLoading ? "CONNECTING..." : "SIGN UP WITH GOOGLE"}
              </span>
            </button>

            <p className="m-0 pt-2 text-center text-[11px] leading-5 text-alabaster-400">
              By creating an account, you agree to our
              <br />
              <button
                type="button"
                onClick={() => navigate("/terms-of-service")}
                disabled={isBusy}
                className="border-0 bg-transparent p-0 font-medium text-alabaster-500 underline underline-offset-2 disabled:opacity-60"
              >
                Terms of Service
              </button>
              {" and "}
              <button
                type="button"
                onClick={() => navigate("/privacy-policy")}
                disabled={isBusy}
                className="border-0 bg-transparent p-0 font-medium text-alabaster-500 underline underline-offset-2 disabled:opacity-60"
              >
                Privacy Policy
              </button>
            </p>
          </form>
        </main>
      </IonContent>
    </IonPage>
  );
}
