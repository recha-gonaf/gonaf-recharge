/*
 * GONAF+ Web Push service worker.
 *
 * Scope: purely receiving/display. All subscribing, permission requests,
 * and sending the subscription to the backend happen in index.html
 * (registerPushNotifications()) — this file only reacts to 'push' and
 * 'notificationclick' events once a subscription already exists.
 *
 * Register at the SITE ROOT (e.g. https://your-domain/sw.js), not under
 * a subfolder, so its default scope covers the whole app. If GONAF+ is
 * served from a GitHub Pages project path (e.g. /gonaf-recharge/), place
 * this file at the root of that path instead and it will scope itself
 * to that path automatically.
 */

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data && event.data.text() }; }

  let title = data.title || "GONAF+";
  let options = {
    body: data.body || "",
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/icon-192.png",
    data: { url: data.url || "/" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  let url = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (let client of clients) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
