// Поиск элементов 
const container = document.getElementById('achievements-container');
const addBtn = document.getElementById('add-achievement-btn');
const hideBtn = document.getElementById('hide-achievements-btn');
const themeBtn = document.getElementById('theme-toggle-btn');

// Проверка существования ключевых элементов
if (!container || !addBtn || !hideBtn || !themeBtn) {
  console.error('Ошибка: не найдены необходимые элементы на странице.');
} else {
  loadState();

  // Обработчики событий 
  addBtn.addEventListener('click', addAchievement);
  hideBtn.addEventListener('click', toggleVisibility);
  themeBtn.addEventListener('click', toggleTheme);
}

// Функция добавления достижения
function addAchievement() {
  const name = prompt('Введите название достижения:');
  if (!name) return; // Если пользователь отменил ввод

  const date = prompt('Введите дату (например, 2026-11-06):');
  if (!date) return;

  // Создание карточки 
  const card = document.createElement('div');
  card.className = 'achievement-card';

  const title = document.createElement('h3');
  title.textContent = name;

  const time = document.createElement('time');
  time.setAttribute('datetime', date);
  time.textContent = date;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.className = 'delete-btn';
  
  // Обработчик удаления с анимацией
  deleteBtn.addEventListener('click', function() {
    card.classList.add('fade-out');
    card.addEventListener('transitionend', () => {
      card.remove();
      saveState(); // Сохраняем после удаления
    });
  });

  card.appendChild(title);
  card.appendChild(time);
  card.appendChild(deleteBtn);

  container.appendChild(card);
  saveState(); // Сохраняем после добавления
}

// Функция скрытия/показа
function toggleVisibility() {
  if (!container) {
    console.error('Контейнер достижений не найден');
    return;
  }
  container.classList.toggle('collapsed');
}

//  Функция переключения темы
function toggleTheme() {
  document.body.classList.toggle('theme-dark');
  const isDark = document.body.classList.contains('theme-dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Сохранение состояния (карточки) 
function saveState() {
  const cards = container.querySelectorAll('.achievement-card');
  const data = [];
  cards.forEach(card => {
    data.push({
      name: card.querySelector('h3').textContent,
      date: card.querySelector('time').getAttribute('datetime'),
      displayDate: card.querySelector('time').textContent
    });
  });
  localStorage.setItem('achievements', JSON.stringify(data));
}

// Загрузка состояния при старте 
function loadState() {
  // Восстановление темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
  }

  // Восстановление карточек
  const savedData = localStorage.getItem('achievements');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      // Очищаем контейнер (если там уже есть статические карточки)
      container.innerHTML = '';
      
      data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'achievement-card';

        const title = document.createElement('h3');
        title.textContent = item.name;

        const time = document.createElement('time');
        time.setAttribute('datetime', item.date);
        time.textContent = item.displayDate;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', function() {
          card.classList.add('fade-out');
          card.addEventListener('transitionend', () => {
            card.remove();
            saveState();
          });
        });

        card.appendChild(title);
        card.appendChild(time);
        card.appendChild(deleteBtn);
        container.appendChild(card);
      });
    } catch (e) {
      console.error('Ошибка при загрузке данных из localStorage:', e);
    }
  }
}

// глобальная проверка ошибок
if (!container) {
  console.error('Элемент не найден: #achievements-container');
}