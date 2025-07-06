// script.js

const courses = [
  {
    id: 1,
    title: "React for Beginners",
    description: "Learn React and build dynamic UIs.",
    category: "Programming",
    level: "Beginner",
    progress: 65,
    videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA"
  },
  {
    id: 2,
    title: "Graphic Design Basics",
    description: "Learn the principles of design.",
    category: "Design",
    level: "Beginner",
    progress: 20,
    videoUrl: "https://www.youtube.com/embed/1FdjLZdHIS8"
  },
  {
    id: 3,
    title: "Digital Marketing 101",
    description: "Basics of online marketing strategies.",
    category: "Marketing",
    level: "Intermediate",
    progress: 0,
    videoUrl: "https://www.youtube.com/embed/7R-Uj4bfQw8"
  }
];

function navigateTo(pageId) {
  const isLoggedIn = localStorage.getItem('loggedInUser');
  const protectedPages = ['home', 'courses', 'progress', 'dashboard'];

  if (protectedPages.includes(pageId) && !isLoggedIn) {
    alert('Please log in to access this page.');
    showPage('auth');
    return;
  }

  showPage(pageId);
}

function showPage(id) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.add('hidden'));
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
}

function loadCourses() {
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const selectedCategory = document.getElementById('categoryFilter')?.value || 'All';
  const selectedLevel = document.getElementById('levelFilter')?.value || 'All';
  const courseList = document.getElementById('courseList');
  const enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  if (!courseList) return;

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

function enrollCourse(title) {
  let enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  if (!enrolled.includes(title)) {
    enrolled.push(title);
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
    loadDashboard();
    alert(`Enrolled in ${title}`);
    loadCourses();
  }
}

function unenrollCourse(title) {
  let enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  enrolled = enrolled.filter(course => course !== title);
  localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
  loadDashboard();
  loadCourses();
}

function loadDashboard() {
  const user = localStorage.getItem('loggedInUser');
  if (!user) return;

  const avatarSeed = localStorage.getItem('avatarSeed') || user;
  const avatar = document.getElementById('avatar');
  const welcomeUser = document.getElementById('welcomeUser');
  const enrolledCoursesList = document.getElementById('enrolledCourses');

  if (avatar) avatar.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;
  if (welcomeUser) welcomeUser.textContent = `Hello, ${user}`;

  if (enrolledCoursesList) {
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    enrolledCoursesList.innerHTML = '';
    enrolled.forEach(title => {
      const li = document.createElement('li');
      li.innerHTML = `${title} <button onclick="unenrollCourse('${title}')">✖</button>`;
      enrolledCoursesList.appendChild(li);
    });
  }
}

function updateAvatar() {
  const seed = document.getElementById('avatarInput')?.value;
  if (seed) {
    localStorage.setItem('avatarSeed', seed);
    const avatar = document.getElementById('avatar');
    if (avatar) avatar.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  }
}

function updateProfile(newUsername, newPassword) {
  let users = JSON.parse(localStorage.getItem('users')) || {};
  const oldUser = localStorage.getItem('loggedInUser');
  if (users[oldUser]) {
    delete users[oldUser];
    users[newUsername] = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', newUsername);
    alert('Profile updated!');
    loadDashboard();
  }
}

function toggleForm(formType) {
  if (formType === 'login') {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
  } else {
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[username] && users[username] === password) {
    localStorage.setItem('loggedInUser', username);
    alert('Login successful!');
    document.getElementById('auth').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('authLink')?.classList.add('hidden');
    document.getElementById('logoutLink')?.classList.remove('hidden');
  } else {
    alert('Invalid credentials.');
  }
}

function handleSignup(event) {
  event.preventDefault();
  const username = document.getElementById('newUsername').value.trim();
  const password = document.getElementById('newPassword').value.trim();
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

function logoutUser() {
  localStorage.removeItem('loggedInUser');
  alert('You have been logged out.');

  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('newUsername').value = '';
  document.getElementById('newPassword').value = '';

  navigateTo('auth');
  document.getElementById('authLink')?.classList.remove('hidden');
  document.getElementById('logoutLink')?.classList.add('hidden');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('loggedInUser');

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  if (isLoggedIn) {
    document.getElementById('auth')?.classList.add('hidden');
    document.getElementById('home')?.classList.remove('hidden');
    document.getElementById('authLink')?.classList.add('hidden');
    document.getElementById('logoutLink')?.classList.remove('hidden');
    loadDashboard();
  } else {
    navigateTo('auth');
    document.getElementById('authLink')?.classList.remove('hidden');
    document.getElementById('logoutLink')?.classList.add('hidden');
  }

  if (document.getElementById('courseList')) {
    document.getElementById('searchInput')?.addEventListener('input', loadCourses);
    document.getElementById('categoryFilter')?.addEventListener('change', loadCourses);
    document.getElementById('levelFilter')?.addEventListener('change', loadCourses);
    loadCourses();
  }

  if (document.getElementById('enrolledCourses')) {
    loadDashboard();
  }

  document.querySelector('#loginForm')?.addEventListener('submit', handleLogin);
  document.querySelector('#signupForm')?.addEventListener('submit', handleSignup);
});
