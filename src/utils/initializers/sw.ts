import { initFirebaseMessaging } from "./firebase";

type BackgroundSyncOptions = {
  minInterval?: number;
};

type PeriodicSyncManager = {
  register: (tag: string, options?: BackgroundSyncOptions) => Promise<void>;
};

type SwRegistration = ServiceWorkerRegistration & {
  periodicSync?: PeriodicSyncManager;
};

type SwRegistrationHandlerConfig = {
  firebaseMessagingVapidKey: string;
};

async function registerUpdateSync(
  swRegistration: SwRegistration
): Promise<void> {
  // Check if periodicSync is supported
  if ("periodicSync" in swRegistration && swRegistration.periodicSync) {
    // Request permission
    const status = await navigator.permissions.query({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      name: "periodic-background-sync",
    });
    if (status.state === "granted") {
      try {
        // Register new sync every 24 hours
        await swRegistration.periodicSync.register("update", {
          minInterval: 24 * 60 * 60 * 1000, // 1 day
        });
        console.log("Periodic background sync registered!");
      } catch (err) {
        console.error("Periodic background sync failed:", err);
      }
    }
  }
}

export function handleSwRegistration(
  registration: SwRegistration,
  config: SwRegistrationHandlerConfig
): void {
  void registerUpdateSync(registration);
  void initFirebaseMessaging({
    swRegistration: registration,
    vapidKey: config.firebaseMessagingVapidKey,
  });
}
