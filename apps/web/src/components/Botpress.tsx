import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";

type BotpressWindow = Window & {
  botpress?: {
    close?: () => void;
  };
};

const hiddenRoutes = [
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/reset-password",
];

function isHiddenRoute(pathname: string): boolean {
  return hiddenRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

const Botpress = () => {
  const { pathname } = useLocation();

  const shouldHide = isHiddenRoute(pathname);

  useLayoutEffect(() => {
    document.body.classList.toggle("botpress-auth-route", shouldHide);

    if (shouldHide) {
      const botpressWindow = window as BotpressWindow;

      botpressWindow.botpress?.close?.();
    }

    return () => {
      document.body.classList.remove("botpress-auth-route");
    };
  }, [shouldHide]);

  if (shouldHide) {
    return null;
  }

  return (
    <button
      id="bp-toggle-chat"
      type="button"
      aria-label="Open PawBorrow assistant"
      title="Chat with PawBorrow"
      className="
        fixed bottom-6 right-6 z-[9999]
        inline-flex size-14
        items-center justify-center
        rounded-full border-0
        bg-froly-400 text-white
        shadow-[0_8px_24px_rgba(0,0,0,0.20)]
        transition-all duration-200
        hover:-translate-y-0.5
        hover:bg-froly-500
        hover:shadow-[0_12px_28px_rgba(0,0,0,0.24)]
        active:translate-y-0
        active:scale-95
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-froly-400
      "
    >
      <MessageCircle size={25} strokeWidth={2.25} aria-hidden="true" />
    </button>
  );
};

export default Botpress;
