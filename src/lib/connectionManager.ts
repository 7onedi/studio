type Listener = () => void;

class ConnectionManager {
  private isOffline = false;
  private pendingResolvers: Array<() => void> = [];
  private offlineListeners: Listener[] = [];
  private onlineListeners: Listener[] = [];

  onOffline(cb: Listener) {
    this.offlineListeners.push(cb);
  }
  onOnline(cb: Listener) {
    this.onlineListeners.push(cb);
  }

  reportOffline() {
    if (this.isOffline) return;
    this.isOffline = true;
    this.offlineListeners.forEach((l) => l());
  }

  reportOnline() {
    if (!this.isOffline) return;
    this.isOffline = false;
    this.onlineListeners.forEach((l) => l());
    const resolvers = this.pendingResolvers;
    this.pendingResolvers = [];
    resolvers.forEach((r) => r());
  }

  waitForReconnect(): Promise<void> {
    return new Promise((resolve) => {
      this.pendingResolvers.push(resolve);
      // періодична спроба "пінгу", щоб самостійно виявити відновлення
      const interval = setInterval(async () => {
        try {
          await fetch("/api/auth/me", { credentials: "include" });
          clearInterval(interval);
          this.reportOnline();
        } catch {
          // все ще офлайн, чекаємо далі
        }
      }, 3000);
    });
  }
}

export const connectionManager = new ConnectionManager();