import { notification } from "antd";

export function createErrorNotifier(title: string): (message: string) => void {
  return function notifyError(message: string): void {
    notification.error({ description: message, message: title });
  };
}
