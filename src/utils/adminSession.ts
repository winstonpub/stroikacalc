/* ============================================================================
 * ФАЙЛ: src/utils/adminSession.ts — Признак входа в панель «Администрирование»
 * ЗА ЧТО ОТВЕЧАЕТ: Хранит и сообщает всем частям сайта, что администратор уже вошёл в панель
 *   (введён пароль на странице #/admin). Благодаря этому шапка сайта может показать кнопку «Администрирование».
 * ОТКУДА БЕРЁТ ИНФОРМАЦИЮ: Ключ "admin:unlocked" в sessionStorage браузера — сессия живёт до закрытия вкладки.
 * КАК ИЗМЕНИТЬ: Менять не требуется; пароль входа задаётся константой ADMIN_PASSWORD в src/pages/AdminPage.tsx.
 * ========================================================================= */

const ADMIN_SESSION_KEY = "admin:unlocked";
const ADMIN_SESSION_EVENT = "admin:session-changed";

/* БЛОК: Проверка текущего состояния сессии (isAdminUnlocked)
 * ЗА ЧТО ОТВЕЧАЕТ: Возвращает true, если в этой вкладке администратор уже вошёл в панель управления.
 * ОТКУДА БЕРЁТ ИНФОРМАЦИЯ: Из sessionStorage по ключу "admin:unlocked".
 * КАК ИЗМЕНИТЬ: Не требует изменений. */
export function isAdminUnlocked(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/* БЛОК: Вход и выход из панели (unlockAdmin, lockAdmin)
 * ЗА ЧТО ОТВЕЧАЕТ: Запоминает вход в панель управления и оповещает шапку сайта, либо стирает ключ при выходе.
 * ОТКУДА БЕРЁТ ИНФОРМАЦИЯ: Вызывается страницей «Администрирование» после проверки пароля или кнопкой «Заблокировать».
 * КАК ИЗМЕНИТЬ: Не требует изменений. */
export function unlockAdmin(): void {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

export function lockAdmin(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {}
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

/* БЛОК: Подписка на изменение состояния сессии (subscribeAdminSession)
 * ЗА ЧТО ОТВЕЧАЕТ: Позволяет шапке сайта мгновенно показать или скрыть кнопку «Администрирование»
 *   сразу после входа в панель или нажатия «Заблокировать», без перезагрузки страницы.
 * ОТКУДА БЕРЁТ ИНФОРМАЦИЯ: Событие "admin:session-changed" из unlockAdmin() / lockAdmin().
 * КАК ИЗМЕНИТЬ: Не требует изменений. */
export function subscribeAdminSession(listener: () => void): () => void {
  window.addEventListener(ADMIN_SESSION_EVENT, listener);
  return () => window.removeEventListener(ADMIN_SESSION_EVENT, listener);
}
