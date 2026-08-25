type Listener = () => void;

class SessionManager {
  private isDialogOpen = false;
  private pendingResolvers: Array<() => void> = [];
  private openListeners: Listener[] = [];
  private closeListeners: Listener[] = [];

  onOpen(cb: Listener) {
    this.openListeners.push(cb);
  }
  onClose(cb: Listener) {
    this.closeListeners.push(cb);
  }

  waitForReauth(): Promise<void> {
    return new Promise((resolve) => {
      this.pendingResolvers.push(resolve);
      if (!this.isDialogOpen) {
        this.isDialogOpen = true;
        this.openListeners.forEach((l) => l());
      }
    });
  }

  resolveAll() {
    this.isDialogOpen = false;
    this.closeListeners.forEach((l) => l());
    const resolvers = this.pendingResolvers;
    this.pendingResolvers = [];
    resolvers.forEach((r) => r());
  }
}

export const sessionManager = new SessionManager();