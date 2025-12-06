declare global {
  interface TelegramWebAppThemeParams {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  }

  interface TelegramWebApp {
    initData?: string;
    initDataUnsafe?: unknown;
    colorScheme?: "light" | "dark";
    themeParams: TelegramWebAppThemeParams;
    isExpanded?: boolean;
    viewportHeight?: number;
    viewportStableHeight?: number;
    ready: () => void;
    expand: () => void;
    close: () => void;
    onEvent: (event: "themeChanged", callback: () => void) => void;
    offEvent: (event: "themeChanged", callback: () => void) => void;
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export {};

