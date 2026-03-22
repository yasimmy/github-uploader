# 🚀 GitHub Uploader

<div align="center">

![GitHub Uploader](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Современное desktop-приложение для быстрой загрузки проектов на GitHub**

[Скачать](#установка) • [Возможности](#возможности) • [Использование](#использование) • [Разработка](#разработка)


</div>

---

## ✨ Возможности

### 🎨 Премиум дизайн
- **Темная тема** в стиле Discord/Steam с градиентами
- **Glassmorphism эффекты** и плавные анимации
- **Кастомный titlebar** с управлением окном
- **Адаптивный интерфейс** с красивыми переходами

### 🚀 Функционал
- ⚡ **Быстрая загрузка** проектов на GitHub в один клик
- 🔐 **Безопасное хранение** токена локально
- 📋 **История загрузок** с полной информацией
- 🎵 **Звуковые эффекты** для лучшего UX
- ⚙️ **Гибкие настройки** под ваши нужды
- 🔒 **Приватные репозитории** одним переключателем

### 💾 Автоматизация
- Автоматическая инициализация Git
- Создание репозитория на GitHub через API
- Первый commit с кастомным сообщением
- Push в main ветку
- Сохранение истории всех загрузок

---

## 📦 Установка

### Требования
- **Node.js** 16.x или выше
- **Git** установленный в системе
- **GitHub Personal Access Token**

### Быстрый старт

```bash
# Клонировать репозиторий
git clone https://github.com/yasimmy/github-uploader.git

# Перейти в директорию
cd github-uploader

# Установить зависимости
npm install

# Запустить приложение
npm start
```

### Сборка для продакшена

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

---

## 🔑 Получение GitHub Token

1. Откройте [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Нажмите **"Generate new token"** → **"Generate new token (classic)"**
3. Выберите права доступа:
   - ✅ `repo` - полный доступ к репозиториям
   - ✅ `workflow` - для GitHub Actions (опционально)
4. Нажмите **"Generate token"** и скопируйте его
5. ⚠️ **Важно:** Токен показывается только один раз!

---

## 📖 Использование

### 1️⃣ Первый запуск

1. Вставьте ваш **GitHub Token**
2. Нажмите **"Обзор"** и выберите папку проекта
3. Введите **название репозитория**
4. Добавьте **описание** (опционально)
5. Настройте **сообщение коммита**
6. Выберите **приватность** репозитория
7. Нажмите **"Загрузить на GitHub"** 🚀

### 2️⃣ Настройки


- **GitHub Token** - сохраняется для будущих загрузок
- **Сообщение коммита по умолчанию** - используется автоматически
- **Приватность по умолчанию** - все новые репозитории будут приватными
- **Звуковые эффекты** - включить/выключить звуки

### 3️⃣ История загрузок


- Просмотр всех загруженных проектов
- Дата и время загрузки
- Статус приватности
- Сообщение коммита
- Прямая ссылка на GitHub

---

## 🛠 Технологии

### Frontend
- **Electron** 28.0.0 - Desktop framework
- **HTML5/CSS3** - Современная верстка
- **JavaScript ES6+** - Логика приложения

### Backend
- **Node.js** - Runtime environment
- **Simple Git** - Git операции
- **Octokit** - GitHub API клиент

### Дизайн
- **Custom CSS** - Уникальный дизайн
- **Web Audio API** - Звуковые эффекты
- **CSS Animations** - Плавные переходы

---

## 📁 Структура проекта

```
github-uploader/
├── main.js              # Главный процесс Electron
├── renderer.js          # Рендер процесс (UI логика)
├── index.html           # Главная страница
├── styles.css           # Стили приложения
├── package.json         # Зависимости и скрипты
├── song/                # Звуковые файлы
│   └── notification.mp3
└── README.md            # Документация
```

---

## 🔧 Разработка

### Запуск в режиме разработки

```bash
npm start
```

### Структура кода

#### main.js
Главный процесс Electron:
- Создание окна приложения
- IPC коммуникация
- Работа с файловой системой
- Git операции

#### renderer.js
Рендер процесс:
- UI логика
- Обработка событий
- LocalStorage для настроек
- Звуковые эффекты

#### styles.css
Стили приложения:
- Темная тема
- Анимации
- Адаптивность
- Компоненты UI

---

## 🐛 Известные проблемы

- **Git не найден** - Установите Git с [git-scm.com](https://git-scm.com/)
- **Ошибка токена** - Проверьте права доступа токена
- **Репозиторий существует** - Выберите другое имя

---

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта!

1. Fork репозитория
2. Создайте ветку (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📝 Roadmap

- [ ] Поддержка нескольких языков (EN, UK, RU)
- [ ] Темы оформления (Light/Dark)
- [ ] Batch загрузка проектов
- [ ] Интеграция с GitLab/Bitbucket
- [ ] Автоматическое создание README
- [ ] Шаблоны .gitignore
- [ ] Поддержка GitHub Actions
- [ ] Экспорт истории в CSV

---

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

## 👨‍💻 Автор

**GitHub Uploader Team**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Благодарности

- [Electron](https://www.electronjs.org/) - За отличный framework
- [Octokit](https://github.com/octokit) - За GitHub API клиент
- [Simple Git](https://github.com/steveukx/git-js) - За Git интеграцию
- Всем контрибьюторам проекта

---

## 📊 Статистика

![GitHub stars](https://img.shields.io/github/stars/yourusername/github-uploader?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/github-uploader?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/github-uploader)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/github-uploader)

---

<div align="center">

**Сделано с ❤️ для разработчиков**

[⬆ Наверх](#-github-uploader)

</div>
#   g i t h u b - u p l o a d e r  
 