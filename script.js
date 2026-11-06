document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('achievements-container');
  const addBtn = document.getElementById('add-achievements-btn');
  const hideBtn = document.getElementById('hide-achievements-btn');
  const themeBtn = document.getElementById('theme-toggle-btn');

  if (!container || !addBtn || !hideBtn || !themeBtn) {
    console.error('Ошибка: не найдены необходимые элементы на странице.');
    return;
  }

  function setupDeleteButton(button) {
    button.addEventListener('click', function() {

      const card = button.closest('.achievements-card');
      if (card) {
        card.classList.add('fade-out');

        card.addEventListener('transitionend', function handler() {
          card.removeEventListener('transitionend', handler); 
          card.remove();
          saveState(); 
        });
      }
    });
  }


  function renderCard(name, dateAttr, dateText, icon = '🏅') {
    const article = document.createElement('article');
    article.className = 'achievements-card';

    const title = document.createElement('h3');
    title.textContent = name;

    const medal = document.createElement('span');
    medal.className = 'medal';
    medal.textContent = icon;

    const time = document.createElement('time');
    time.setAttribute('datetime', dateAttr);
    time.textContent = dateText;

    const p = document.createElement('p');
    p.textContent = 'Новое достижение'; 

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    setupDeleteButton(deleteBtn);

    article.appendChild(title);
    article.appendChild(medal);
    article.appendChild(time);
    article.appendChild(p);
    article.appendChild(deleteBtn);

    container.appendChild(article);
  }

  function saveState() {
    const cards = container.querySelectorAll('.achievements-card');
    const data = [];
    cards.forEach(card => {
      const h3 = card.querySelector('h3');
      const time = card.querySelector('time');
      const medal = card.querySelector('.medal');
      const p = card.querySelector('p');

      if (h3 && time) {
        data.push({
          name: h3.textContent,
          date: time.getAttribute('datetime'),
          displayDate: time.textContent,
          icon: medal ? medal.textContent : '🏅',
          desc: p ? p.textContent : ''
        });
      }
    });
    localStorage.setItem('achievements', JSON.stringify(data));
  }

  function loadState() {
    // Тема
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('theme-dark');
    }

    // Карточки
    const savedData = localStorage.getItem('achievements');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        container.innerHTML = ''; 
        
        data.forEach(item => {
          renderCard(item.name, item.date, item.displayDate, item.icon);
        });
      } catch (e) {
        console.error('Ошибка при загрузке данных из localStorage:', e);
      }
    } else {
     
      const existingCards = container.querySelectorAll('.achievements-card');
      existingCards.forEach(card => {
        const deleteBtn = card.querySelector('.delete-btn');
        if (deleteBtn) setupDeleteButton(deleteBtn);
      });
      saveState(); 
    }
  }

 
  addBtn.addEventListener('click', () => {
    const name = prompt('Введите название достижения:');
    if (!name) return;

    const date = prompt('Введите дату (например, 2026-11-06):');
    if (!date) return;

    renderCard(name, date, date);
    saveState();
  });

  hideBtn.addEventListener('click', () => {
    container.classList.toggle('collapsed');
  });

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    const isDark = document.body.classList.contains('theme-dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Запуск при старте
  loadState();
});