import { Link } from "react-router-dom";

export default function Verify() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-8">
      <div className="max-w-sm w-full text-center">
        <p className="font-body text-sm text-charcoal/60">
          Verifying your email...
        </p>

        <>
          <h1 className="font-display text-2xl text-charcoal mb-4">
            Email verified!
          </h1>
          <p className="font-body text-sm text-charcoal/60 mb-8">
            Your account is now fully active.
          </p>
          <Link
            to="/"
            className="inline-block bg-sage text-cream font-body text-sm tracking-wide uppercase px-8 py-4 hover:bg-charcoal transition-colors"
          >
            Go to Homepage
          </Link>
        </>

        <>
          <h1 className="font-display text-2xl text-charcoal mb-4">
            Verification failed
          </h1>
          <p className="font-body text-sm text-red-600 mb-8">
            There was an error verifying your email. Please try again.
          </p>
          <Link
            to="/"
            className="inline-block bg-sage text-cream font-body text-sm tracking-wide uppercase px-8 py-4 hover:bg-charcoal transition-colors"
          >
            Go to Homepage
          </Link>
        </>
      </div>
    </main>
  );
}
