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
  registration: ServiceWorkerRegistration;
  vapidKey: string;
};

export function initFirebaseCore(config: InitFirebaseCoreConfig): void {
  // Initialize default app
  firebase.initializeApp(config);

  // Get the Performance service for the default app
  firebase.performance();

  // Get the Analytics service for the default app
  firebase.analytics();
}

export async function initFirebaseMessaging({
  registration,
  vapidKey,
}: InitFirebaseMessagingConfig): Promise<void> {
  // Get the Messaging service for the default app
  const messaging = firebase.messaging();

  try {
    const messagingToken = await messaging.getToken({
      serviceWorkerRegistration: registration,
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
