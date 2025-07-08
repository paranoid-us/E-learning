

(function protectPages() {
  const protectedPaths = ['about.html', 'courses.html', 'progress.html', 'dashboard.html'];
  const isLoggedIn = localStorage.getItem('loggedInUser');
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPaths.includes(currentPage) && !isLoggedIn) {
    alert('You must log in to access this page.');
    window.location.href = 'index.html'; 
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  const welcome = document.getElementById('welcomeUser');
  const user = localStorage.getItem('loggedInUser');
  if (user && welcome) {
    welcome.textContent = `Hello, ${user}`;
  }

  const avatarSeed = localStorage.getItem('avatarSeed') || user;
  const avatar = document.getElementById('avatar');
  if (avatar && avatarSeed) {
    avatar.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;
  }

  if (document.getElementById('enrolledCourses')) {
    loadDashboard();
  }

  if (document.getElementById('courseList')) {
    document.getElementById('searchInput')?.addEventListener('input', loadCourses);
    document.getElementById('categoryFilter')?.addEventListener('change', loadCourses);
    document.getElementById('levelFilter')?.addEventListener('change', loadCourses);
    loadCourses();
  }

  document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
  document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
});

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function navigateTo(pageId) {
  const isLoggedIn = localStorage.getItem('loggedInUser');
  const protectedPages = ['about', 'courses', 'progress', 'dashboard'];

  if (protectedPages.includes(pageId.toLowerCase()) && !isLoggedIn) {
    alert('You must log in to access this page.');
    return;
  }

  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.remove('hidden');

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const activeLink = Array.from(document.querySelectorAll('.nav-link')).find(link =>
    link.getAttribute('href')?.includes(pageId)
  );
  if (activeLink) activeLink.classList.add('active');
}

function loadDashboard() {
  const enrolledCoursesList = document.getElementById('enrolledCourses');
  if (!enrolledCoursesList) return;

  const enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  enrolledCoursesList.innerHTML = '';
  enrolled.forEach(title => {
    const li = document.createElement('li');
    li.innerHTML = `${title} <button onclick="unenrollCourse('${title}')">✖</button>`;
    enrolledCoursesList.appendChild(li);
  });
}

function enrollCourse(title) {
  let enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  if (!enrolled.includes(title)) {
    enrolled.push(title);
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
    alert(`Enrolled in ${title}`);
    loadCourses();
    loadDashboard();
  }
}

function unenrollCourse(title) {
  let enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  enrolled = enrolled.filter(course => course !== title);
  localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
  loadCourses();
  loadDashboard();
}

function loadCourses() {
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const selectedCategory = document.getElementById('categoryFilter')?.value || 'All';
  const selectedLevel = document.getElementById('levelFilter')?.value || 'All';
  const courseList = document.getElementById('courseList');
  const enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];

  if (!courseList || !window.courses) return;

  courseList.innerHTML = '';

  courses.forEach(course => {
    const matchesSearch = course.title.toLowerCase().includes(search);
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;

    if (matchesSearch && matchesCategory && matchesLevel) {
      const card = document.createElement('div');
      card.className = 'card fade-in';
      card.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <small class="tag">${course.category}</small>
        <small class="tag level">${course.level}</small>
        <div class="progress">
          <div class="progress-inner" style="width: ${course.progress}%"></div>
        </div>
        <button class="btn" onclick="enrollCourse('${course.title}')">
          ${enrolled.includes(course.title) ? 'Enrolled' : 'Enroll'}
        </button>
      `;
      courseList.appendChild(card);
    }
  });
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[username] && users[username] === password) {
    localStorage.setItem('loggedInUser', username);
    alert('Login successful!');
    window.location.href = 'about.html';
  } else {
    alert('Invalid credentials.');
  }
}

function handleSignup(event) {
  event.preventDefault();
  const username = document.getElementById('newUsername')?.value.trim();
  const password = document.getElementById('newPassword')?.value.trim();
  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[username]) {
    alert('Username already exists.');
    return;
  }

  users[username] = password;
  localStorage.setItem('users', JSON.stringify(users));
  alert('Signup successful! Please log in.');
  toggleForm('login');
}

function toggleForm(formType) {
  if (formType === 'login') {
    document.getElementById('loginForm')?.classList.remove('hidden');
    document.getElementById('signupForm')?.classList.add('hidden');
  } else {
    document.getElementById('signupForm')?.classList.remove('hidden');
    document.getElementById('loginForm')?.classList.add('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Check if dark mode should be applied
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Show logout if logged in
  const isLoggedIn = localStorage.getItem('loggedInUser');
  const logoutLink = document.getElementById('logoutLink');
  if (isLoggedIn && logoutLink) {
    logoutLink.classList.remove('hidden');
  } else if (logoutLink) {
    logoutLink.classList.add('hidden');
  }
});

function logoutUser() {
  localStorage.removeItem('loggedInUser');
  alert('You have been logged out.');
  window.location.href = 'index.html';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

