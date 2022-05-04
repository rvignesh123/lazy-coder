import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    sendGetConfigList(scriptType: string) {
      ipcRenderer.send('get-config-list', scriptType);
    },
    sendGetScripts() {
      ipcRenderer.send('get-scripts');
    },
    createConfigIpc(request: object) {
      ipcRenderer.send('create-config', request);
    },
    sendSaveConfigDetail(request: object) {
      ipcRenderer.send('save-config', request);
    },
    sendGetConfig(fileName: string) {
      ipcRenderer.send('get-config', fileName);
    },
    sendCopyConfig(request: object) {
      ipcRenderer.send('copy-config', request);
    },
    sendDeleteConfig(request: object) {
      ipcRenderer.send('delete-config', request);
    },
    startProcess(request: object) {
      ipcRenderer.send('start-process', request);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = [
        'ipc-example',
        'get-config-list',
        'get-config',
        'get-scripts',
        'create-config',
        'save-config',
        'copy-config',
        'delete-config',
        'terminal-data',
      ];
      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return undefined;
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = [
        'ipc-example',
        'get-config-list',
        'get-config',
        'get-scripts',
        'create-config',
        'save-config',
        'copy-config',
        'delete-config',
        'start-process',
        'terminal-data',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});
