import { initializeAnalytics } from "firebase/analytics";
import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
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

export function initFirebaseCore(config: FirebaseOptions): FirebaseApp {
  // Init and retrieve Firebase
  if (getApps().length === 0) {
    initializeApp(config);
  }
  const firebase = getApp();
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
