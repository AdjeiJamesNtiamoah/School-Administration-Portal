// =============================
// School Admin Portal - app.js
// =============================

// --- Demo users (replace with backend later) ---
const demoUsers = [
  { username: 'admin', password: 'admin123', role: 'ADMIN', name: 'Super Admin' },
  { username: 'teacher', password: 'teach123', role: 'TEACHER', name: 'Jane Teacher' },
  { username: 'student', password: 'stud123', role: 'STUDENT', name: 'Sam Student' }
];

// --- Elements ---
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const currentUserLabel = document.getElementById('currentUser');

const pages = {
  dashboard: document.getElementById('dashboardSection'),
  students: document.getElementById('studentsSection'),
  teachers: document.getElementById('teachersSection'),
  classes: document.getElementById('classesSection'),
  users: document.getElementById('usersSection')
};

// --- Storage keys ---
const USERS_KEY = 'sa_users';
const STUDENTS_KEY = 'sa_students';
const TEACHERS_KEY = 'sa_teachers';
const CLASSES_KEY = 'sa_classes';

// Initialize storage with demo data if empty
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
}
if (!localStorage.getItem(STUDENTS_KEY)) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify([
    { name: 'Kwame Nkrumah', className: 'Form 1A', age: 15 },
    { name: 'Ama Serwaa', className: 'Form 2B', age: 14 }
  ]));
}
if (!localStorage.getItem(TEACHERS_KEY)) {
  localStorage.setItem(TEACHERS_KEY, JSON.stringify([
    { name: 'Mr. Mensah', subject: 'Mathematics' }
  ]));
}
if (!localStorage.getItem(CLASSES_KEY)) {
  localStorage.setItem(CLASSES_KEY, JSON.stringify([
    { name: 'Form 1A', teacher: 'Mr. Mensah' }
  ]));
}

// --- Authentication ---
function findUser(username) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  return users.find(u => u.username === username);
}

function authenticate(username, password) {
  const user = findUser(username);
  if (user && user.password === password) return user;
  return null;
}

function showLogin() {
  loginPage.classList.remove('hidden');
  dashboardPage.classList.add('hidden');
}

function showDashboard() {
  loginPage.classList.add('hidden');
  dashboardPage.classList.remove('hidden');
  showPage('dashboard');
  updateCurrentUser();
  renderAllTables();
  updateDashboardCounts();
}

// --- Login Flow ---
loginBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const user = authenticate(username, password);
  if (!user) {
    alert('Invalid credentials. Use demo accounts listed.');
    return;
  }
  localStorage.setItem('sa_session', JSON.stringify(user));
  showDashboard();
});

// Auto-login if session exists
window.addEventListener('DOMContentLoaded', () => {
  const session = localStorage.getItem('sa_session');
  if (session) showDashboard();
  else showLogin();
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('sa_session');
  location.reload();
});

function updateCurrentUser() {
  const session = JSON.parse(localStorage.getItem('sa_session') || 'null');
  if (session) {
    currentUserLabel.textContent = `${session.name || session.username} (${session.role})`;
  } else currentUserLabel.textContent = '';
}

// --- Navigation ---
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = btn.getAttribute('data-page');
    showPage(p);
  });
});

function showPage(pageName) {
  Object.values(pages).forEach(p => p.classList.add('hidden'));
  pages[pageName].classList.remove('hidden');
}

// --- Students CRUD (client-side) ---
const studentTableBody = document.getElementById('studentTableBody');
function renderStudents() {
  const students = JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
  studentTableBody.innerHTML = '';
  students.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td>${s.className}</td><td>${s.age}</td><td><button class="delete-btn" data-entity="students" data-index="${i}">Delete</button></td>`;
    studentTableBody.appendChild(tr);
  });
  enableDeleteButtons();
}

function addStudent(name, className, age) {
  const students = JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
  students.push({ name, className, age });
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  renderStudents();
  pushActivity(`Student added: ${name}`);
}

function showAddStudentModal() {
  const name = prompt('Student full name:');
  if (!name) return;
  const className = prompt('Class (e.g. Form 1A):', 'Form 1A') || '';
  const age = prompt('Age:', '15') || '';
  addStudent(name, className, age);
}

// --- Teachers CRUD ---
const teacherTableBody = document.getElementById('teacherTableBody');
function renderTeachers() {
  const teachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
  teacherTableBody.innerHTML = '';
  teachers.forEach((t, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${t.name}</td><td>${t.subject}</td><td><button class="delete-btn" data-entity="teachers" data-index="${i}">Delete</button></td>`;
    teacherTableBody.appendChild(tr);
  });
  enableDeleteButtons();
}

function addTeacher(name, subject) {
  const teachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
  teachers.push({ name, subject });
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
  renderTeachers();
  pushActivity(`Teacher added: ${name}`);
}

function showAddTeacherModal() {
  const name = prompt('Teacher name:');
  if (!name) return;
  const subject = prompt('Subject:', 'Mathematics') || '';
  addTeacher(name, subject);
}

// --- Classes CRUD ---
const classTableBody = document.getElementById('classTableBody');
function renderClasses() {
  const classes = JSON.parse(localStorage.getItem(CLASSES_KEY) || '[]');
  classTableBody.innerHTML = '';
  classes.forEach((c, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.name}</td><td>${c.teacher}</td><td><button class="delete-btn" data-entity="classes" data-index="${i}">Delete</button></td>`;
    classTableBody.appendChild(tr);
  });
  enableDeleteButtons();
}

function addClass(name, teacher) {
  const classes = JSON.parse(localStorage.getItem(CLASSES_KEY) || '[]');
  classes.push({ name, teacher });
  localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
  renderClasses();
  pushActivity(`Class created: ${name}`);
}

function showAddClassModal() {
  const name = prompt('Class name:', 'Form 3B');
  if (!name) return;
  const teacher = prompt('Assigned teacher:', 'Mr. Mensah') || '';
  addClass(name, teacher);
}

// --- Users CRUD ---
const userTableBody = document.getElementById('userTableBody');
function renderUsers() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  userTableBody.innerHTML = '';
  users.forEach((u, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.username}</td><td>${u.role}</td><td><button class="delete-btn" data-entity="users" data-index="${i}">Delete</button></td>`;
    userTableBody.appendChild(tr);
  });
  enableDeleteButtons();
}

function addUser(username, role) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  users.push({ username, password: 'changeme', role: role, name: username });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  renderUsers();
  pushActivity(`User added: ${username} (${role})`);
}

function showAddUserModal() {
  const username = prompt('Username:');
  if (!username) return;
  const role = prompt('Role (ADMIN|TEACHER|STUDENT):', 'STUDENT') || 'STUDENT';
  addUser(username, role);
}

// --- Delete Button Handling ---
function enableDeleteButtons() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = function() {
      const entity = this.dataset.entity;
      const idx = parseInt(this.dataset.index, 10);
      if (!confirm('Delete this record?')) return;
      if (entity === 'students') {
        const arr = JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
        arr.splice(idx,1);
        localStorage.setItem(STUDENTS_KEY, JSON.stringify(arr));
        renderStudents();
      } else if (entity === 'teachers') {
        const arr = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
        arr.splice(idx,1);
        localStorage.setItem(TEACHERS_KEY, JSON.stringify(arr));
        renderTeachers();
      } else if (entity === 'classes') {
        const arr = JSON.parse(localStorage.getItem(CLASSES_KEY) || '[]');
        arr.splice(idx,1);
        localStorage.setItem(CLASSES_KEY, JSON.stringify(arr));
        renderClasses();
      } else if (entity === 'users') {
        const arr = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        arr.splice(idx,1);
        localStorage.setItem(USERS_KEY, JSON.stringify(arr));
        renderUsers();
      }
      updateDashboardCounts();
      pushActivity('Record deleted');
    };
  });
}

// --- Universal search for tables ---
function tableSearch(inputId, tableId) {
  const search = document.getElementById(inputId).value.toLowerCase();
  const rows = document.querySelectorAll(`#${tableId} tr`);
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(search) ? '' : 'none';
  });
}

// --- Dashboard counters & activity ---
function updateDashboardCounts() {
  const students = JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]').length;
  const teachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]').length;
  const classes = JSON.parse(localStorage.getItem(CLASSES_KEY) || '[]').length;
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]').length;

  document.getElementById('dashboardStudents').textContent = students;
  document.getElementById('dashboardTeachers').textContent = teachers;
  document.getElementById('dashboardClasses').textContent = classes;
  document.getElementById('dashboardUsers').textContent = users;
}

function pushActivity(text) {
  const ul = document.getElementById('recentActivity');
  const li = document.createElement('li');
  li.textContent = `${new Date().toLocaleString()}: ${text}`;
  ul.insertBefore(li, ul.firstChild);
}

// --- Render all tables ---
function renderAllTables() {
  renderStudents();
  renderTeachers();
  renderClasses();
  renderUsers();
}

// ensure counts update periodically
setInterval(updateDashboardCounts, 1000);
