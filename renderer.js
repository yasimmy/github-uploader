const { ipcRenderer, shell } = require('electron');
const path = require('path');

// Load settings
let settings = {
  token: '',
  defaultCommit: 'Первый коммит',
  autoPrivate: false,
  soundEnabled: true
};

// Audio
let clickSound;
let successSound;
let errorSound;

// Initialize audio
function initAudio() {
  try {
    clickSound = new Audio(path.join(__dirname, 'song', 'notification.mp3'));
    successSound = new Audio(path.join(__dirname, 'song', 'notification.mp3'));
    errorSound = new Audio(path.join(__dirname, 'song', 'notification.mp3'));
    
    clickSound.volume = 0.3;
    successSound.volume = 0.4;
    errorSound.volume = 0.35;
  } catch (e) {
    // Audio initialization failed
  }
}

// Play sound
function playSound(type) {
  if (!settings.soundEnabled) return;
  
  try {
    let sound;
    if (type === 'click') {
      sound = clickSound;
    } else if (type === 'success') {
      sound = successSound;
    } else if (type === 'error') {
      sound = errorSound;
    }
    
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  } catch (e) {
    // Sound playback failed
  }
}

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('github-uploader-settings');
  if (saved) {
    settings = { ...settings, ...JSON.parse(saved) };
    applySettings();
  }
}

function applySettings() {
  if (document.getElementById('token')) {
    document.getElementById('token').value = settings.token;
  }
  if (document.getElementById('is-private')) {
    document.getElementById('is-private').checked = settings.autoPrivate;
  }
  if (document.getElementById('commit-message')) {
    document.getElementById('commit-message').value = settings.defaultCommit;
  }
}

// Save settings
function saveSettings() {
  settings.token = document.getElementById('settings-token').value.trim();
  settings.defaultCommit = document.getElementById('default-commit').value.trim() || 'Первый коммит';
  settings.autoPrivate = document.getElementById('auto-private').checked;
  settings.soundEnabled = document.getElementById('sound-enabled').checked;
  
  localStorage.setItem('github-uploader-settings', JSON.stringify(settings));
  applySettings();
}

// History management
function loadHistory() {
  const history = JSON.parse(localStorage.getItem('github-uploader-history') || '[]');
  return history;
}

function saveToHistory(data) {
  const history = loadHistory();
  history.unshift({
    ...data,
    date: new Date().toISOString()
  });
  
  if (history.length > 50) history.pop();
  
  localStorage.setItem('github-uploader-history', JSON.stringify(history));
}

function renderHistory() {
  const history = loadHistory();
  const container = document.getElementById('history-list');
  const emptyState = document.getElementById('empty-history');
  
  if (history.length === 0) {
    emptyState.style.display = 'block';
    container.innerHTML = '';
    return;
  }
  
  emptyState.style.display = 'none';
  container.innerHTML = history.map((item, index) => `
    <div class="history-item" style="animation-delay: ${index * 0.05}s">
      <div class="history-item-header">
        <div class="history-item-title">${item.repoName}</div>
        <div class="history-item-date">${new Date(item.date).toLocaleString('ru-RU')}</div>
      </div>
      <div class="history-item-desc">${item.description || 'Без описания'}</div>
      <div class="history-item-footer">
        <span class="history-badge ${item.isPrivate ? 'private' : 'public'}">
          ${item.isPrivate ? '🔒 Приватный' : '🌐 Публичный'}
        </span>
        <span style="font-size: 12px; color: #6a6a6a;">💬 ${item.commitMessage || 'Первый коммит'}</span>
        <a href="#" class="history-link" data-url="${item.url}">Открыть на GitHub</a>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.history-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      playSound('click');
      shell.openExternal(e.target.dataset.url);
    });
  });
}

// Page navigation
function switchPage(pageName) {
  playSound('click');
  
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === pageName) {
      item.classList.add('active');
    }
  });
  
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageName + '-page').classList.add('active');
  
  if (pageName === 'history') {
    renderHistory();
  }
  
  if (pageName === 'settings') {
    document.getElementById('settings-token').value = settings.token;
    document.getElementById('default-commit').value = settings.defaultCommit;
    document.getElementById('auto-private').checked = settings.autoPrivate;
    document.getElementById('sound-enabled').checked = settings.soundEnabled;
  }
}

// Notification system
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span>${type === 'success' ? '✓' : '✕'}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('hiding');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);
  
  playSound('click');
  
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Modal functions
function showModal() {
  document.getElementById('token-modal').classList.remove('hidden');
}

function hideModal() {
  document.getElementById('token-modal').classList.add('hidden');
}

// Toggle checkbox
function toggleCheckbox(checkboxId, toggleId, statusTextOn, statusTextOff) {
  const checkbox = document.getElementById(checkboxId);
  const toggle = document.getElementById(toggleId);
  const status = toggle.querySelector('.checkbox-status');
  
  checkbox.checked = !checkbox.checked;
  
  if (checkbox.checked) {
    toggle.classList.add('active');
    status.textContent = 'Вкл';
    showToast(statusTextOn);
  } else {
    toggle.classList.remove('active');
    status.textContent = 'Выкл';
    showToast(statusTextOff);
  }
}

// Initialize toggles
function initializeToggles() {
  document.getElementById('private-toggle').addEventListener('click', () => {
    toggleCheckbox('is-private', 'private-toggle', 'Приватный репозиторий включено', 'Приватный репозиторий выключено');
  });
  
  document.getElementById('auto-private-toggle').addEventListener('click', () => {
    toggleCheckbox('auto-private', 'auto-private-toggle', 'Приватность по умолчанию включено', 'Приватность по умолчанию выключено');
  });
  
  document.getElementById('sound-toggle').addEventListener('click', () => {
    toggleCheckbox('sound-enabled', 'sound-toggle', 'Звуковые эффекты включено', 'Звуковые эффекты выключено');
    settings.soundEnabled = document.getElementById('sound-enabled').checked;
  });
  
  // Set initial states
  if (document.getElementById('is-private').checked) {
    document.getElementById('private-toggle').classList.add('active');
    document.getElementById('private-toggle').querySelector('.checkbox-status').textContent = 'Вкл';
  } else {
    document.getElementById('private-toggle').querySelector('.checkbox-status').textContent = 'Выкл';
  }
  
  if (document.getElementById('auto-private').checked) {
    document.getElementById('auto-private-toggle').classList.add('active');
    document.getElementById('auto-private-toggle').querySelector('.checkbox-status').textContent = 'Вкл';
  } else {
    document.getElementById('auto-private-toggle').querySelector('.checkbox-status').textContent = 'Выкл';
  }
  
  if (document.getElementById('sound-enabled').checked) {
    document.getElementById('sound-toggle').classList.add('active');
    document.getElementById('sound-toggle').querySelector('.checkbox-status').textContent = 'Вкл';
  } else {
    document.getElementById('sound-toggle').querySelector('.checkbox-status').textContent = 'Выкл';
  }
}

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  loadSettings();
  initializeToggles();
  
  // Window controls
  document.getElementById('minimize-btn').addEventListener('click', () => {
    playSound('click');
    ipcRenderer.send('window-minimize');
  });

  document.getElementById('maximize-btn').addEventListener('click', () => {
    playSound('click');
    ipcRenderer.send('window-maximize');
  });

  document.getElementById('close-btn').addEventListener('click', () => {
    playSound('click');
    ipcRenderer.send('window-close');
  });

  // Menu navigation
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      switchPage(item.dataset.page);
    });
  });

  // Token help links
  document.addEventListener('click', (e) => {
    if (e.target.id === 'token-help' || e.target.id === 'token-help-settings') {
      e.preventDefault();
      playSound('click');
      showModal();
    }
    
    if (e.target.closest('#github-link')) {
      e.preventDefault();
      playSound('click');
      shell.openExternal('https://github.com/yasimmy');
    }
    
    if (e.target.closest('#docs-link')) {
      e.preventDefault();
      playSound('click');
      showToast('Документация в разработке');
    }
  });

  document.getElementById('close-modal').addEventListener('click', () => {
    playSound('click');
    hideModal();
  });

  document.getElementById('token-modal').addEventListener('click', (e) => {
    if (e.target.id === 'token-modal') {
      hideModal();
    }
  });

  // Select folder
  document.getElementById('select-folder-btn').addEventListener('click', async () => {
    playSound('click');
    const folderPath = await ipcRenderer.invoke('select-folder');
    if (folderPath) {
      document.getElementById('folder-path').value = folderPath;
      
      const folderName = folderPath.split(/[\\/]/).pop();
      if (!document.getElementById('repo-name').value) {
        document.getElementById('repo-name').value = folderName;
      }
    }
  });

  // Upload project
  document.getElementById('upload-btn').addEventListener('click', async () => {
    playSound('click');
    
    const token = document.getElementById('token').value.trim();
    const folderPath = document.getElementById('folder-path').value;
    const repoName = document.getElementById('repo-name').value.trim();
    const description = document.getElementById('description').value.trim();
    const isPrivate = document.getElementById('is-private').checked;
    const commitMessage = document.getElementById('commit-message').value.trim() || 'Первый коммит';

    if (!token) {
      showStatus('Пожалуйста, введите GitHub токен', 'error');
      return;
    }
    
    if (!folderPath) {
      showStatus('Пожалуйста, выберите папку проекта', 'error');
      return;
    }
    
    if (!repoName) {
      showStatus('Пожалуйста, введите название репозитория', 'error');
      return;
    }

    showStatus('Загрузка на GitHub...', 'loading');
    document.getElementById('upload-btn').disabled = true;

    const result = await ipcRenderer.invoke('upload-project', {
      folderPath,
      repoName,
      description,
      isPrivate,
      token,
      commitMessage
    });

    document.getElementById('upload-btn').disabled = false;

    if (result.success) {
      playSound('success');
      showStatus(`Успешно загружено! Смотреть: ${result.url}`, 'success');
      showNotification('Проект успешно загружен! 🎉', 'success');
      
      settings.token = token;
      localStorage.setItem('github-uploader-settings', JSON.stringify(settings));
      
      saveToHistory({
        repoName,
        description,
        isPrivate,
        url: result.url,
        commitMessage
      });
      
      document.getElementById('folder-path').value = '';
      document.getElementById('repo-name').value = '';
      document.getElementById('description').value = '';
    } else {
      playSound('error');
      let errorMessage = result.error;
      
      if (errorMessage.includes('ENOENT') || errorMessage.includes('spawn git')) {
        errorMessage = 'Git не найден. Установите Git с https://git-scm.com/';
      } else if (errorMessage.includes('already exists')) {
        errorMessage = 'Репозиторий с таким именем уже существует';
      } else if (errorMessage.includes('Bad credentials')) {
        errorMessage = 'Неверный токен GitHub';
      }
      
      showStatus(`Ошибка: ${errorMessage}`, 'error');
      showNotification(`Ошибка: ${errorMessage}`, 'error');
    }
  });

  // Save settings
  document.getElementById('save-settings-btn').addEventListener('click', () => {
    playSound('click');
    saveSettings();
    
    const statusEl = document.getElementById('settings-status');
    statusEl.textContent = 'Настройки успешно сохранены!';
    statusEl.className = 'status success';
    
    showNotification('Настройки сохранены! ⚙️', 'success');
    
    setTimeout(() => {
      statusEl.className = 'status hidden';
    }, 3000);
  });
});
