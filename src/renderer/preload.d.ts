declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        sendGetConfig(fileName: string): void;
        sendGetConfigList(scriptType: string): void;
        sendGetScripts(): void;
        createConfigIpc(request: object): void;
        sendSaveConfigDetail(request: object): void;
        sendCopyConfig(request: object): void;
        sendDeleteConfig(request: object): void;
        startProcess(request: object): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
