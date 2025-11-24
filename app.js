// app.js - simple client-side SPA & auth (mock). Replace with real API calls in production.

// -- Demo users (mock backend)
const demoUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin', name: 'Admin User' },
  { id: 2, username: 'teacher', password: 'teach123', role: 'Teacher', name: 'Jane Teacher' },
  { id: 3, username: 'student', password: 'stud123', role: 'Student', name: 'Bob Student' }
];

let state = {
  currentUser: null,
  students: ['Alice Johnson', 'Samuel K.', 'Rachel M.'],
  teachers: ['Jane Teacher', 'Mark T.'],
  classes: [{ name: 'Primary 1', teacher: 'Jane Teacher' }],
  users: [...demoUsers]
};

// DOM refs
const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');

const welcomeText = document.getElementById('welcomeText');

// pages
const pages = {
  dashboard: document.getElementById('page-dashboard'),
  students: document.getElementById('page-students'),
  teachers: document.getElementById('page-teachers'),
  classes: document.getElementById('page-classes'),
  users: document.getElementById('page-users')
};

const studentsTableContainer = document.getElementById('studentsTableContainer');
const teachersTableContainer = document.getElementById('teachersTableContainer');
const classesTableContainer = document.getElementById('classesTableContainer');
const usersTableContainer = document.getElementById('usersTableContainer');

const statStudents = document.getElementById('statStudents');
const statTeachers = document.getElementById('statTeachers');
const statAttendance = document.getElementById('statAttendance');

// helpers
function saveState() { localStorage.setItem('sa_state', JSON.stringify({ currentUser: state.currentUser })); }
function loadState() {
  const raw = localStorage.getItem('sa_state');
  if (raw) {
    try { const parsed = JSON.parse(raw); if (parsed.currentUser) state.currentUser = parsed.currentUser; } catch(e){}
  }
}

// auth
btnLogin.addEventListener('click', () => {
  const u = document.getElementById('inputEmail').value.trim();
  const p = document.getElementById('inputPassword').value.trim();
  if (!u || !p) { alert('Enter credentials'); return; }
  const found = state.users.find(x => (x.username === u || x.username === u.toLowerCase()) && x.password === p);
  if (!found) { alert('Invalid credentials'); return; }
  state.currentUser = { id: found.id, username: found.username, role: found.role, name: found.name };
  saveState();
  showApp();
});

btnLogout.addEventListener('click', () => {
  state.currentUser = null;
  localStorage.removeItem('sa_state');
  location.reload();
});

// routing
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    location.hash = btn.dataset.hash;
  });
});

window.addEventListener('hashchange', route);
function route() {
  const h = location.hash.replace('#','') || 'dashboard';
  showPage(h);
}

// show/hide pages
function showPage(name) {
  Object.keys(pages).forEach(k => {
    pages[k].classList.add('hidden');
  });
  if (pages[name]) pages[name].classList.remove('hidden');
  // admin only behavior
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = (state.currentUser && state.currentUser.role === 'Admin') ? 'block' : 'none';
  });
}

// app UI rendering
function renderDashboard() {
  statStudents.textContent = state.students.length;
  statTeachers.textContent = state.teachers.length;
  statAttendance.textContent = '92%';
}

function renderStudents() {
  if (state.students.length === 0) { studentsTableContainer.innerHTML = '<div class="panel">No students yet.</div>'; return; }
  let html = '<div class="table"><table class="table"><thead><tr><th>Name</th><th>Actions</th></tr></thead><tbody>';
  state.students.forEach((s,i) => {
    html += `<tr><td>${s}</td><td><button class="btn" onclick="editStudent(${i})">Edit</button> <button class="btn danger" onclick="deleteStudent(${i})">Delete</button></td></tr>`;
  });
  html += '</tbody></table></div>';
  studentsTableContainer.innerHTML = html;
}

function renderTeachers() {
  if (state.teachers.length === 0) { teachersTableContainer.innerHTML = '<div class="panel">No teachers yet.</div>'; return; }
  let html = '<div class="table"><table class="table"><thead><tr><th>Name</th><th>Actions</th></tr></thead><tbody>';
  state.teachers.forEach((t,i) => {
    html += `<tr><td>${t}</td><td><button class="btn" onclick="editTeacher(${i})">Edit</button> <button class="btn danger" onclick="deleteTeacher(${i})">Delete</button></td></tr>`;
  });
  html += '</tbody></table></div>';
  teachersTableContainer.innerHTML = html;
}

function renderClasses() {
  if (state.classes.length === 0) { classesTableContainer.innerHTML = '<div class="panel">No classes yet.</div>'; return; }
  let html = '<div class="table"><table class="table"><thead><tr><th>Class</th><th>Teacher</th><th>Actions</th></tr></thead><tbody>';
  state.classes.forEach((c,i) => {
    html += `<tr><td>${c.name}</td><td>${c.teacher}</td><td><button class="btn" onclick="editClass(${i})">Edit</button> <button class="btn danger" onclick="deleteClass(${i})">Delete</button></td></tr>`;
  });
  html += '</tbody></table></div>';
  classesTableContainer.innerHTML = html;
}

function renderUsers() {
  if (state.users.length === 0) { usersTableContainer.innerHTML = '<div class="panel">No users yet.</div>'; return; }
  let html = '<div class="table"><table class="table"><thead><tr><th>Username</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead><tbody>';
  state.users.forEach((u,i) => {
    html += `<tr><td>${u.username}</td><td>${u.name}</td><td>${u.role}</td><td>${u.role!=='Admin'?'<button class="btn" onclick="promoteUser('+i+')">Promote</button>':''}</td></tr>`;
  });
  html += '</tbody></table></div>';
  usersTableContainer.innerHTML = html;
}

// small CRUD handlers (prompt-based for demo)
window.addStudent = function(){
  const name = prompt('Student name:');
  if (name) { state.students.push(name); renderStudents(); renderDashboard(); }
};
window.deleteStudent = function(i){ if (confirm('Delete student?')) { state.students.splice(i,1); renderStudents(); renderDashboard(); } };
window.editStudent = function(i){ const v = prompt('Edit name', state.students[i]); if (v) { state.students[i]=v; renderStudents(); } };

window.addTeacher = function(){
  const name = prompt('Teacher name:'); if (name) { state.teachers.push(name); renderTeachers(); renderDashboard(); }
};
window.deleteTeacher = function(i){ if (confirm('Delete teacher?')) { state.teachers.splice(i,1); renderTeachers(); renderDashboard(); } };
window.editTeacher = function(i){ const v = prompt('Edit name', state.teachers[i]); if (v) { state.teachers[i]=v; renderTeachers(); } };

window.addClass = function(){
  const name = prompt('Class name:'); const teacher = prompt('Assign teacher:'); if (name) { state.classes.push({name, teacher: teacher||'Unassigned'}); renderClasses(); }
};
window.deleteClass = function(i){ if (confirm('Delete class?')){ state.classes.splice(i,1); renderClasses(); } };
window.editClass = function(i){ const name = prompt('Edit class', state.classes[i].name); const t = prompt('Teacher', state.classes[i].teacher); if (name){ state.classes[i]={name, teacher:t||'Unassigned'}; renderClasses(); } };

window.promoteUser = function(i){ if (confirm('Promote to Admin?')){ state.users[i].role='Admin'; renderUsers(); } };

// initial boot
function showApp(){
  loginScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  welcomeText.innerText = `Welcome, ${state.currentUser.name} (${state.currentUser.role})`;
  // show admin-only buttons
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = (state.currentUser.role==='Admin' ? 'block' : 'none'));
  route();
  renderAll();
}

function renderAll(){
  renderDashboard(); renderStudents(); renderTeachers(); renderClasses(); renderUsers();
}

// load saved state & auto-login if present
loadState();
if (state.currentUser) {
  showApp();
}

// initial route
if (!location.hash) location.hash = '#dashboard';
route();
