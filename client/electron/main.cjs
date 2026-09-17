const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 880,
    minWidth: 900,
    minHeight: 650,
    title: 'BloodBank 360',
    icon: path.join(__dirname, '../public/icon-512.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'default',
    autoHideMenuBar: false
  });

  const devUrl = 'http://localhost:5173';
  const prodUrl = `file://${path.join(__dirname, '../dist/index.html')}`;

  // Try loading dev URL first; fallback to built files
  win.loadURL(devUrl).catch(() => {
    win.loadURL(prodUrl);
  });

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Setup desktop app menu
  const template = [
    {
      label: 'BloodBank 360',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Navigation',
      submenu: [
        {
          label: 'Find Blood',
          click: () => win.loadURL(`${devUrl}/find-blood`)
        },
        {
          label: 'Blood Bank Portal',
          click: () => win.loadURL(`${devUrl}/bank/dashboard`)
        },
        {
          label: 'Emergency SOS',
          click: () => win.loadURL(`${devUrl}/emergency-sos`)
        },
        {
          label: 'Live Map Explorer',
          click: () => win.loadURL(`${devUrl}/map-explorer`)
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
