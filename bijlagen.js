// ── HOOFD APP CONTROLLER ──

const App = {
  currentPage: 'dashboard',

  init() {
    DB.load();
    this.setupNav();
    this.navigate('dashboard');
    Signalering.checkAll();
    this.updateBadges();
  },

  setupNav() {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const page = el.dataset.page;
        if (page) this.navigate(page);
      });
    });
  },

  navigate(page) {
    this.currentPage = page;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
    const main = document.getElementById('main-content');
    main.innerHTML = Pages[page] ? Pages[page]() : '<div class="content"><p>Pagina niet gevonden.</p></div>';
    if (typeof window[`init_${page}`] === 'function') window[`init_${page}`]();
    this.updateBadges();
  },

  updateBadges() {
    const sigs = DB.getSignaleringen(true).length;
    const expCerts = DB.getCertificaten().filter(c => {
      const dagen = daysDiff(c.geldigTot);
      return dagen <= DB.getInstellingen().sigDagen && dagen >= 0;
    }).length;
    document.getElementById('nb-sig').textContent = sigs;
    document.getElementById('nb-sig').style.display = sigs > 0 ? '' : 'none';
    document.getElementById('nb-mw').textContent = DB.getMedewerkers().length;
    document.getElementById('nb-cert').textContent = expCerts;
    document.getElementById('nb-cert').style.display = expCerts > 0 ? '' : 'none';
  },

  exportData() {
    DB.exportJSON();
    Toast.show('Data opgeslagen als JSON-bestand', 'success');
  },

  importData() {
    document.getElementById('import-file').click();
  },

  handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (DB.importJSON(ev.target.result)) {
        Toast.show('Data geladen!', 'success');
        this.navigate(this.currentPage);
        this.updateBadges();
      } else {
        Toast.show('Ongeldig bestand', 'danger');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }
};

// ── TOAST ──
const Toast = {
  timer: null,
  show(msg, type='info') {
    const el = document.getElementById('toast');
    const styles = {
      success: { bg: '#EAF3DE', color: '#27500A', icon: 'ti-check' },
      danger:  { bg: '#FCEBEB', color: '#791F1F', icon: 'ti-alert-triangle' },
      warn:    { bg: '#FAEEDA', color: '#854F0B', icon: 'ti-alert-triangle' },
      info:    { bg: '#E6F1FB', color: '#0C447C', icon: 'ti-info-circle' }
    };
    const s = styles[type] || styles.info;
    el.style.background = s.bg;
    el.style.color = s.color;
    el.style.border = `1px solid ${s.color}`;
    el.innerHTML = `<i class="ti ${s.icon}"></i>${msg}`;
    el.style.display = 'flex';
    clearTimeout(this.timer);
    this.timer = setTimeout(() => el.style.display = 'none', 3500);
  }
};

// ── HULPFUNCTIES ──
function H(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function daysDiff(dateStr) {
  if (!dateStr) return 9999;
  const d = new Date(dateStr);
  const now = new Date();
  now.setHours(0,0,0,0);
  return Math.round((d - now) / 86400000);
}

function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
}

function wekenGewerkt(startStr) {
  if (!startStr) return 0;
  return Math.floor((new Date() - new Date(startStr)) / (7 * 86400000));
}

function mwNaam(mw) { return mw ? `${mw.voornaam} ${mw.achternaam}` : '—'; }

function mwAvatar(mw, size=32) {
  const initials = (mw.voornaam[0]||'') + (mw.achternaam[0]||'');
  const colors = [
    ['#E6F1FB','#185FA5'],['#FAEEDA','#BA7517'],['#EAF3DE','#3B6D11'],
    ['#EEEDFE','#534AB7'],['#FAECE7','#993C1D'],['#FCEBEB','#A32D2D']
  ];
  const [bg,fg] = colors[mw.id % colors.length];
  return `<div class="avatar" style="width:${size}px;height:${size}px;background:${bg};color:${fg};">${initials}</div>`;
}

function faseTag(mw) {
  if (mw.cat === 'Eigen') return '<span class="tag tag-green">Eigen personeel</span>';
  if (mw.cat === 'ZZP') return '<span class="tag tag-coral">ZZP</span>';
  if (mw.cat === 'Onderaannemer') return '<span class="tag tag-gray">Onderaannemer</span>';
  const map = {1:['tag-green','Fase 1'],2:['tag-amber','Fase 2'],3:['tag-blue','Fase 3'],4:['tag-purple','Fase 4']};
  const [cls,lbl] = map[mw.fase] || ['tag-gray','?'];
  return `<span class="tag ${cls}">${lbl}</span>`;
}

function pbarHtml(pct) {
  const c = pct===100?'#639922':pct>=60?'#EF9F27':'#E24B4A';
  return `<div class="pbar-wrap"><div class="pbar" style="flex:1;"><div class="pfill" style="width:${pct}%;background:${c};"></div></div><span class="pbar-pct">${pct}%</span></div>`;
}

function certStatusTag(cert) {
  const d = daysDiff(cert.geldigTot);
  if (d < 0) return '<span class="tag tag-red">Verlopen</span>';
  if (d <= 30) return `<span class="tag tag-red">Verloopt over ${d}d</span>`;
  if (d <= 90) return `<span class="tag tag-amber">Verloopt over ${d}d</span>`;
  return '<span class="tag tag-green">Geldig</span>';
}

// Init
document.addEventListener('DOMContentLoaded', () => App.init());
