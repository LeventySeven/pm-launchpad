export {};

type TelegramWebAppUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
};

type TelegramWebApp = {
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
    start_param?: string;
  };
  /** Open a link inside Telegram (stays in TG, doesn't open browser) */
  openTelegramLink?: (url: string) => void;
  /** Open an external link in the in-app browser */
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  /** Share a message via Telegram's native share sheet */
  switchInlineQuery?: (query: string, choose_chat_types?: string[]) => void;
  /** Close the mini app */
  close?: () => void;
  /** Send data back to the bot */
  sendData?: (data: string) => void;
  /** Expand the mini app to full height */
  expand?: () => void;
  /** Current platform: "android" | "ios" | "tdesktop" | "web" | etc */
  platform?: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}


