const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const simpleGit = require('simple-git');
const { Octokit } = require('octokit');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Select folder
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

// Upload to GitHub
ipcMain.handle('upload-project', async (event, data) => {
  try {
    const { folderPath, repoName, description, isPrivate, token, commitMessage } = data;
    
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      return { success: false, error: 'Папка не найдена' };
    }

    const octokit = new Octokit({ auth: token });
    const git = simpleGit(folderPath);

    // Check if git is installed
    try {
      await git.version();
    } catch (error) {
      return { success: false, error: 'Git не установлен. Скачайте с https://git-scm.com/' };
    }

    // Configure git user if not set
    try {
      await git.addConfig('user.name', 'GitHub Uploader', false, 'local');
      await git.addConfig('user.email', 'uploader@github-app.local', false, 'local');
    } catch (e) {
      // Ignore if already set
    }

    // Create GitHub repo
    const repo = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      description: description,
      private: isPrivate
    });

    // Check if already a git repo
    const isRepo = await git.checkIsRepo();
    
    if (!isRepo) {
      await git.init();
      await git.branch(['-M', 'main']);
    }
    
    await git.add('.');
    
    try {
      await git.commit(commitMessage || 'Первый коммит');
    } catch (e) {
      // If nothing to commit, that's ok
      if (!e.message.includes('nothing to commit')) {
        throw e;
      }
    }
    
    // Check if remote exists
    const remotes = await git.getRemotes();
    const originExists = remotes.some(r => r.name === 'origin');
    
    if (originExists) {
      await git.removeRemote('origin');
    }
    
    await git.addRemote('origin', repo.data.clone_url);
    await git.push('origin', 'main', { '--set-upstream': null });

    return { success: true, url: repo.data.html_url };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Window controls
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});
ipcMain.on('window-close', () => mainWindow.close());
