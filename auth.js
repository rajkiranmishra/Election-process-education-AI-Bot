/* ── AUTH STATE ── */
const USERS_KEY = 'electiq_users';
const SESSION_KEY = 'electiq_session';

function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getSession() { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
function saveSession(u) { localStorage.setItem(SESSION_KEY, JSON.stringify(u)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

/* ── MODAL ── */
window.openAuthModal = function(tab = 'signin') {
  document.getElementById('authModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  switchTab(tab);
  clearErrors();
};

window.closeAuthModal = function() {
  document.getElementById('authModal').classList.add('hidden');
  document.body.style.overflow = '';
  clearErrors();
};

window.closeModalOutside = function(e) {
  if (e.target.id === 'authModal') closeAuthModal();
};

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAuthModal(); });

/* ── TABS ── */
window.switchTab = function(tab) {
  const signin = document.getElementById('signinForm');
  const signup = document.getElementById('signupForm');
  const tsi = document.getElementById('tabSignin');
  const tsu = document.getElementById('tabSignup');
  clearErrors();
  if (tab === 'signin') {
    signin.classList.remove('hidden');
    signup.classList.add('hidden');
    tsi.classList.add('active');
    tsu.classList.remove('active');
  } else {
    signup.classList.remove('hidden');
    signin.classList.add('hidden');
    tsu.classList.add('active');
    tsi.classList.remove('active');
  }
};

/* ── SIGN UP ── */
window.handleSignup = function(e) {
  e.preventDefault();
  const name  = document.getElementById('suName').value.trim();
  const email = document.getElementById('suEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('suPassword').value;
  const users = getUsers();
  if (users[email]) { showError('suError', 'An account with this email already exists.'); return; }
  users[email] = { name, email, pass, joined: new Date().toISOString() };
  saveUsers(users);
  saveSession({ name, email });
  closeAuthModal();
  updateNavAuth();
  showToast(`Welcome, ${name}! 🎉`);
};

/* ── SIGN IN ── */
window.handleSignin = function(e) {
  e.preventDefault();
  const email = document.getElementById('siEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('siPassword').value;
  const users = getUsers();
  if (!users[email]) { showError('siError', 'No account found with this email.'); return; }
  if (users[email].pass !== pass) { showError('siError', 'Incorrect password. Please try again.'); return; }
  saveSession({ name: users[email].name, email });
  closeAuthModal();
  updateNavAuth();
  showToast(`Welcome back, ${users[email].name}! 👋`);
};

/* ── SIGN OUT ── */
window.handleSignout = function() {
  clearSession();
  updateNavAuth();
  showToast('You have been signed out. See you soon!');
};

/* ── UPDATE NAVBAR ── */
function updateNavAuth() {
  const session = getSession();
  const navAuth = document.getElementById('navAuth');
  if (session) {
    const initials = session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    navAuth.innerHTML = `
      <div class="user-menu">
        <div class="user-avatar" id="userAvatarBtn" onclick="toggleUserDropdown()">${initials}</div>
        <div class="user-dropdown hidden" id="userDropdown">
          <div class="ud-name">${session.name}</div>
          <div class="ud-email">${session.email}</div>
          <hr class="ud-divider"/>
          <button class="ud-signout" onclick="handleSignout()">Sign Out</button>
        </div>
      </div>`;
  } else {
    navAuth.innerHTML = `<button class="btn-signin" id="openAuthBtn" onclick="openAuthModal('signin')">Sign In</button>`;
  }
}

window.toggleUserDropdown = function() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.toggle('hidden');
};

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  const menu = document.querySelector('.user-menu');
  if (menu && !menu.contains(e.target)) {
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.add('hidden');
  }
});

/* ── HELPERS ── */
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('hidden');
}
function clearErrors() {
  ['siError', 'suError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  });
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('toast-show'), 10);
  setTimeout(() => { t.classList.remove('toast-show'); setTimeout(() => t.remove(), 400); }, 3200);
}

/* ── INIT ── */
updateNavAuth();
