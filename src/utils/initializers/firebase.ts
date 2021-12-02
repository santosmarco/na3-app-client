import firebase from "firebase";

type InitFirebaseCoreConfig = {
  apiKey: string;
  appId: string;
  authDomain: string;
  measurementId: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
};

type InitFirebaseMessagingConfig = {
  swRegistration: ServiceWorkerRegistration;
  vapidKey: string;
};

function setupFirestore(): void {
  void firebase.firestore().enablePersistence({ synchronizeTabs: true });
  void firebase.firestore().enableNetwork();
}

export function initFirebaseCore(config: InitFirebaseCoreConfig): void {
  // Initialize default app
  firebase.initializeApp(config);

  // Configure Firestore
  setupFirestore();

  // Init Firebase's Performance service
  firebase.performance();

  // Init Firebase's Analytics service
  firebase.analytics();
}

export async function initFirebaseMessaging({
  swRegistration,
  vapidKey,
}: InitFirebaseMessagingConfig): Promise<void> {
  // Init and retrieve Firebase's Messaging service
  const messaging = firebase.messaging();

  try {
    const messagingToken = await messaging.getToken({
      serviceWorkerRegistration: swRegistration,
      vapidKey,
    });

    if (messagingToken) {
      console.info("[FCM-TOKEN-SUCCESS]", messagingToken);
    } else {
      console.info("[FCM-TOKEN-FAIL]", "No registration token available.");
    }
  } catch (err) {
    console.error(err);
  }
}
