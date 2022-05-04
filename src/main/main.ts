/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as fs from 'fs';
import os from 'os';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const LAZY_CODER_DIR = `${require('os').homedir()}/.lazycoder`;
const pty = require('node-pty');

const LAZY_CONFIG = `${LAZY_CODER_DIR}/config.json`;
const LAZY_CONFIG_RUNWAY = `${LAZY_CODER_DIR}/.runway`;
const LAZY_CONFIG_SCRIPTS = `${LAZY_CODER_DIR}/scripts.json`;
const LAZY_CONFIG_SCRIPTS_DIR = `${LAZY_CODER_DIR}/scripts`;
const LAZY_CONFIG_SCRIPTS_BASE = `${LAZY_CODER_DIR}/base`;
const LAZY_CONFIG_DIR = `${LAZY_CODER_DIR}/configs`;

const getConfigList = (script, exceptName) => {
  const data = fs.readFileSync(LAZY_CONFIG, { encoding: 'utf8', flag: 'r' });
  const configs = JSON.parse(data).config;
  const filtered: any[] = [];
  configs.forEach((element) => {
    if (script === 'all' || element.script === script) {
      if (!(exceptName && element.name === exceptName)) {
        filtered.push(element);
      }
    }
  });
  return filtered;
};

const getConfigDetail = (fileName: string) => {
  if (fs.existsSync(`${LAZY_CONFIG_DIR}/${fileName}`)) {
    const data = fs.readFileSync(`${LAZY_CONFIG_DIR}/${fileName}`, {
      encoding: 'utf8',
      flag: 'r',
    });
    return JSON.parse(data);
  }
  return null;
};

const writeFile = (file: string, newConfig: object) => {
  try {
    fs.writeFileSync(file, JSON.stringify(newConfig), {
      encoding: 'utf8',
      flag: 'w',
    });
    return true;
  } catch (error) {
    return false;
  }
};

const getUpdatedConfigDetail = (
  configList: Array<object>,
  formData: object
) => {
  const updatedList: Array<object> = [];
  configList.forEach((value) => {
    value.value = formData[value.name];
    updatedList.push(value);
  });
  return updatedList;
};
const getScripts = () => {
  const data = fs.readFileSync(LAZY_CONFIG_SCRIPTS, {
    encoding: 'utf8',
    flag: 'r',
  });
  const { scripts } = JSON.parse(data);
  return scripts;
};
const getScriptDetail = (name: string) => {
  const scripts: Array<object> = getScripts();
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].name === name) {
      return scripts[i];
    }
  }
  return null;
};

const getArguments = (args: string) => {
  return args.split(' ');
};

const getInputFile = (formData: object) => {
  const inputFile = `${Date.now()}.properties`;
  const targetFile = `${LAZY_CONFIG_RUNWAY}/${inputFile}`;
  let fileContent = '';
  Object.keys(formData).forEach((key) => {
    fileContent += `${key}=${formData[key]}\n`;
  });
  fs.writeFileSync(targetFile, fileContent, {
    encoding: 'utf8',
    flag: 'w',
  });
  return inputFile;
};

const getAsArgs = (formData: object) => {
  const args: Array<string> = [];
  Object.keys(formData).forEach((key) => {
    args.push(formData[key]);
  });
  return args;
};

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('start-process', async (event, request) => {
  const scriptDetail = getScriptDetail(request.currentConfig.script);
  if (scriptDetail == null) {
    // impossible -> it should return (not entered by user)
    return null;
  }
  const scriptDirectory = `${LAZY_CONFIG_SCRIPTS_DIR}/${scriptDetail.name}`;
  const scriptArgs = getArguments(scriptDetail.args);
  const args: Array<string> = [];

  scriptArgs.forEach((eachArg) => {
    if (eachArg.indexOf('$main') !== -1) {
      args.push(eachArg.replaceAll('$main', scriptDetail.main));
    }
    if (eachArg.indexOf('$input') !== -1) {
      args.push(`..\\..\\.runway\\${getInputFile(request.formData)}`);
    }
    if (eachArg.indexOf('$args') !== -1) {
      args.push(...getAsArgs(request.formData));
    }
  });

  const ptyProcess = pty.spawn(scriptDetail.executable, args, {
    name: request.currentConfig.name,
    cols: 120,
    rows: 120,
    cwd: scriptDirectory,
    env: { ...process.env, ...request.environment },
  });
  ptyProcess.onData((data) => {
    event.reply('terminal-data', data);
  });
});

ipcMain.on('get-config-list', async (event, script) => {
  event.reply('get-config-list', getConfigList(script, null));
});

ipcMain.on('get-scripts', async (event) => {
  event.reply('get-scripts', getScripts());
});

ipcMain.on('copy-config', async (event, request) => {
  const targetFile = `${LAZY_CONFIG_DIR}/${request.newName}.json`;
  let status = false;
  if (!fs.existsSync(targetFile)) {
    fs.copyFileSync(`${LAZY_CONFIG_DIR}/${request.name}.json`, targetFile);
    const existingConfigs: Array<object> = getConfigList('all', null);
    existingConfigs.push({
      file: `${request.newName}.json`,
      name: request.newName,
      script: request.script,
    });
    const newConfig = {
      config: existingConfigs,
    };
    status = writeFile(LAZY_CONFIG, newConfig);
  }
  event.reply('copy-config', status);
});

ipcMain.on('delete-config', async (event, request) => {
  const targetFile = `${LAZY_CONFIG_DIR}/${request.name}.json`;
  let status = false;
  if (fs.existsSync(targetFile)) {
    fs.rmSync(targetFile);
    const existingConfigs: Array<object> = getConfigList('all', request.name);
    const newConfig = {
      config: existingConfigs,
    };
    status = writeFile(LAZY_CONFIG, newConfig);
  }
  event.reply('delete-config', status);
});

ipcMain.on('save-config', async (event, request) => {
  const targetFile = `${LAZY_CONFIG_DIR}/${request.currentConfig.file}`;
  const configDetail = getConfigDetail(request.currentConfig.file);
  const updatedList = getUpdatedConfigDetail(
    configDetail.config,
    request.formData
  );
  const status: boolean = writeFile(targetFile, {
    config: updatedList,
    environment: request.environment,
  });
  event.reply('save-config', status);
});
ipcMain.on('create-config', async (event, request) => {
  const targetFile = `${LAZY_CONFIG_DIR}/${request.name}.json`;
  let status = false;
  if (!fs.existsSync(targetFile)) {
    fs.copyFileSync(
      `${LAZY_CONFIG_SCRIPTS_BASE}/${request.config}`,
      targetFile
    );
    const existingConfigs: Array<object> = getConfigList('all', null);
    existingConfigs.push({
      file: `${request.name}.json`,
      name: request.name,
      script: request.script,
    });
    const newConfig = {
      config: existingConfigs,
    };
    status = writeFile(LAZY_CONFIG, newConfig);
  }
  event.reply('create-config', status);
});

ipcMain.on('get-config', async (event, fileName) => {
  event.reply('get-config', getConfigDetail(fileName));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  if (!fs.existsSync(LAZY_CODER_DIR)) {
    fs.mkdirSync(LAZY_CODER_DIR);
  }
  if (!fs.existsSync(LAZY_CONFIG_RUNWAY)) {
    fs.mkdirSync(LAZY_CONFIG_RUNWAY);
  }
  if (!fs.existsSync(LAZY_CONFIG)) {
    writeFile(LAZY_CONFIG, {
      config: [],
    });
  }
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
