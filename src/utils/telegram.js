const tg = window.Telegram?.WebApp;

export function isTelegramWebApp() {
  return Boolean(tg && tg.platform !== "unknown");
}

export function triggerHaptic(type = "light") {
  if (!isTelegramWebApp() || !tg?.HapticFeedback) return;

  tg.HapticFeedback.impactOccurred(type);
}

export function initTelegramApp() {
  if (!tg) return;

  tg.ready();

  if (!isTelegramWebApp()) return;

  document.body.classList.add("is-telegram");
  tg.expand?.();
  tg.disableVerticalSwipes?.();
  tg.lockOrientation?.();
}
