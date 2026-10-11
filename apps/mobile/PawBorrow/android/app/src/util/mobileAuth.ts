import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";

import { supabase, signInWithGoogle as signInWithGoogleWeb } from "@repo/api";

const MOBILE_CALLBACK = "pawborrow://auth/callback";

const codeExchanges = new Map<string, Promise<void>>();

async function completeGoogleLogin(rawUrl: string): Promise<boolean> {
  const url = new URL(rawUrl);

  const isMobileCallback =
    url.protocol === "pawborrow:" &&
    url.hostname === "auth" &&
    url.pathname === "/callback" &&
    !url.port &&
    !url.username &&
    !url.password;

  if (!isMobileCallback) {
    return false;
  }

  const fragment = new URLSearchParams(url.hash.slice(1));

  const oauthError =
    url.searchParams.get("error_description") ??
    url.searchParams.get("error") ??
    fragment.get("error_description") ??
    fragment.get("error");

  if (oauthError) {
    throw new Error(`Google sign-in failed: ${oauthError}`);
  }

  const code = url.searchParams.get("code");

  if (!code) {
    throw new Error(
      "Google returned to the app without an authorization code.",
    );
  }

  let exchange = codeExchanges.get(code);

  if (!exchange) {
    exchange = (async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error("Google login completed, but no session was created.");
      }
    })();

    codeExchanges.set(code, exchange);
  }

  await exchange;

  if (Capacitor.getPlatform() === "ios") {
    await Browser.close().catch(() => undefined);
  }

  return true;
}

export async function signInWithGoogleMobile(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    await signInWithGoogleWeb();
    return;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: MOBILE_CALLBACK,
      skipBrowserRedirect: true,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error("Google did not return a sign-in URL.");
  }

  await Browser.open({
    url: data.url,
  });
}

export function listenForMobileAuth(
  onSuccess: () => void,
  onError: (message: string) => void,
): () => void {
  if (!Capacitor.isNativePlatform()) {
    return () => {};
  }

  let stopped = false;
  let listener: PluginListenerHandle | undefined;

  function reportError(error: unknown) {
    if (stopped) {
      return;
    }

    onError(
      error instanceof Error
        ? error.message
        : "Unable to complete Google sign-in.",
    );
  }

  async function handleUrl(url: string) {
    if (stopped) {
      return;
    }

    try {
      const completed = await completeGoogleLogin(url);

      if (completed && !stopped) {
        onSuccess();
      }
    } catch (error) {
      reportError(error);
    }
  }

  async function start() {
    const handle = await App.addListener("appUrlOpen", ({ url }) => {
      void handleUrl(url);
    });

    if (stopped) {
      await handle.remove();
      return;
    }

    listener = handle;

    const launch = await App.getLaunchUrl();

    if (!stopped && launch?.url) {
      await handleUrl(launch.url);
    }
  }

  void start().catch(reportError);

  return () => {
    stopped = true;
    void listener?.remove().catch(() => undefined);
  };
}
