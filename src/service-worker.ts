/// <reference lib="webworker" />

import { BackgroundSyncPlugin } from "workbox-background-sync";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import * as navigationPreload from "workbox-navigation-preload";
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";

importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

declare const self: ServiceWorkerGlobalScope;

declare const firebase: {
  initializeApp: (config: {
    apiKey: string;
    appId: string;
    authDomain: string;
    measurementId: string;
    messagingSenderId: string;
    projectId: string;
    storageBucket: string;
  }) => void;
  messaging: () => {
    onBackgroundMessage: (
      handler: (payload: {
        collapseKey: string;
        data?: Record<string, string>;
        fcmOptions?: { analyticsLabel?: string; link?: string };
        from: string;
        notification?: { body?: string; image?: string; title?: string };
      }) => void
    ) => () => void;
  };
};

type PeriodicSyncEventTag = "update";

type PeriodicSyncEvent = Event & {
  tag?: PeriodicSyncEventTag;
  waitUntil?: FetchEvent["waitUntil"];
};

const CACHE = "na3-cache";
const PAGES_CACHE = "na3-pages-cache";
const IMAGES_CACHE = "na3-images-cache";
const STATIC_RESOURCES_CACHE = "na3-static-resources-cache";
const OFFLINE_FALLBACKS_CACHE = "na3-offline-fallbacks-cache";

const BG_SYNC_QUEUE = "na3-bg-sync-queue";

const PAGE_FALLBACK = "index.html";
const IMAGE_FALLBACK = undefined;
const FONT_FALLBACK = undefined;

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

firebase.initializeApp({
  apiKey: "AIzaSyAynKF5joA-_wpax9jzatonSZgxSE-MaRQ",
  appId: "1:810900069450:web:0f69447751bb45cac59ab3",
  authDomain: "nova-a3-ind.firebaseapp.com",
  measurementId: "G-PXKR7KDTEP",
  messagingSenderId: "810900069450",
  projectId: "nova-a3-ind",
  storageBucket: "nova-a3-ind.appspot.com",
});

const handlerPlugins = [
  new CacheableResponsePlugin({
    statuses: [0, 200],
  }),
  new BackgroundSyncPlugin(BG_SYNC_QUEUE, {
    maxRetentionTime: 24 * 60, // 24 hours
  }),
];

if (navigationPreload.isSupported()) {
  navigationPreload.enable();
}

// Set up App Shell-style routing.
const fileExtensionRegex = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    }
    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith("/_")) {
      return false;
    }
    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (fileExtensionRegex.exec(url.pathname)) {
      return false;
    }
    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    networkTimeoutSeconds: 3,
    cacheName: PAGES_CACHE,
    plugins: handlerPlugins,
  })
);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: IMAGES_CACHE,
    plugins: [
      ...handlerPlugins,
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker",
  new StaleWhileRevalidate({
    cacheName: STATIC_RESOURCES_CACHE,
    plugins: handlerPlugins,
  })
);

registerRoute(
  new RegExp("/*"),
  new StaleWhileRevalidate({
    cacheName: CACHE,
    plugins: handlerPlugins,
  })
);

self.addEventListener("install", (event) => {
  const files = [PAGE_FALLBACK];
  if (IMAGE_FALLBACK) {
    files.push(IMAGE_FALLBACK);
  }
  if (FONT_FALLBACK) {
    files.push(FONT_FALLBACK);
  }

  event.waitUntil(
    self.caches
      .open(OFFLINE_FALLBACKS_CACHE)
      .then(async (cache) => cache.addAll(files))
      .then(async () => self.skipWaiting())
  );
});

self.addEventListener("message", (event: { data?: { type?: string } }) => {
  if (event.data?.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
});

self.addEventListener("periodicsync", (event: PeriodicSyncEvent) => {
  if (event.tag === "update") {
    event.waitUntil?.(async () => self.registration.update());
  }
});

self.addEventListener(
  "fetch",
  (event: FetchEvent & { preloadResponse?: Promise<Response> }) => {
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async (): Promise<Response> => {
          try {
            const preloadResp = await event.preloadResponse;

            if (preloadResp) {
              return preloadResp;
            }

            const networkResp = await fetch(event.request);
            return networkResp;
          } catch (error) {
            const cache = await caches.open(CACHE);
            const cachedResp = await cache.match(PAGE_FALLBACK);

            if (!cachedResp) {
              return Response.error();
            }
            return cachedResp;
          }
        })()
      );
    }
  }
);

firebase.messaging().onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Nova A3";
  const options = {
    body:
      payload.notification?.body ||
      "Você tem uma nova mensagem. Abra o app para ver.",
    icon: payload.notification?.image,
  };

  void self.registration.showNotification(title, options);
});

setCatchHandler(async ({ request }) => {
  const dest = typeof request === "string" ? request : request.destination;
  const cache = await self.caches.open(OFFLINE_FALLBACKS_CACHE);

  if (dest === "document") {
    return (await cache.match(PAGE_FALLBACK)) || Response.error();
  }
  if (dest === "image" && IMAGE_FALLBACK) {
    return (await cache.match(IMAGE_FALLBACK)) || Response.error();
  }
  if (dest === "font" && FONT_FALLBACK) {
    return (await cache.match(FONT_FALLBACK)) || Response.error();
  }

  return Response.error();
});
