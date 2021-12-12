import { initializeAnalytics } from "firebase/analytics";
import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import type { Firestore } from "firebase/firestore";
import {
  enableIndexedDbPersistence,
  enableNetwork,
  getFirestore,
} from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { initializePerformance } from "firebase/performance";

import { storeMessagingToken } from "../notifications/push";

type InitFirebaseMessagingConfig = {
  swRegistration: ServiceWorkerRegistration;
  vapidKey: string;
};

function setupFirestore(firestore: Firestore): void {
  void enableIndexedDbPersistence(firestore);
  void enableNetwork(firestore);
}

export function initFirebaseCore(
  config: FirebaseOptions & { appCheckSiteKey: string }
): FirebaseApp {
  const { appCheckSiteKey, ...firebaseCoreConfig } = config;

  // Init Firebase
  if (getApps().length === 0) {
    initializeApp(firebaseCoreConfig);
  }
  // Retrieve default app
  const firebase = getApp();
  // Init Firebase's AppCheck
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(firebase, {
    provider: new ReCaptchaV3Provider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
  // Configure Firestore
  setupFirestore(getFirestore(firebase));
  // Init Firebase's Performance service
  initializePerformance(firebase);
  // Init Firebase's Analytics service
  initializeAnalytics(firebase);

  return firebase;
}

export async function initFirebaseMessaging(
  firebase: FirebaseApp,
  { swRegistration, vapidKey }: InitFirebaseMessagingConfig
): Promise<void> {
  // Init and retrieve Firebase's Messaging service
  const messaging = getMessaging(firebase);

  try {
    const messagingToken = await getToken(messaging, {
      serviceWorkerRegistration: swRegistration,
      vapidKey,
    });

    if (messagingToken) {
      storeMessagingToken(messagingToken);
    } else {
      console.info("[FCM-TOKEN-FAIL]", "No registration token available.");
    }
  } catch (err) {
    console.error(err);
  }
}
