/* VCU Managementsysteem — Solid Workforce B.V. */
:root {
  --bg: #f4f4f1;
  --bg2: #fff;
  --bg3: #f0efeb;
  --border: rgba(0,0,0,.1);
  --border2: rgba(0,0,0,.18);
  --text: #1a1a18;
  --text2: #666;
  --text3: #aaa;
  --blue: #185FA5; --blue-bg: #E6F1FB; --blue-text: #0C447C;
  --green: #3B6D11; --green-bg: #EAF3DE; --green-text: #27500A;
  --amber: #BA7517; --amber-bg: #FAEEDA; --amber-text: #854F0B;
  --red: #A32D2D; --red-bg: #FCEBEB; --red-text: #791F1F;
  --purple: #534AB7; --purple-bg: #EEEDFE;
  --coral: #993C1D; --coral-bg: #FAECE7;
  --radius: 8px; --radius-lg: 12px;
  --shadow: 0 1px 4px rgba(0,0,0,.08);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; }

/* ── APP LAYOUT ── */
#app { display: flex; height: 100vh; overflow: hidden; }

/* ── SIDEBAR ── */
.sidebar { width: 230px; min-width: 230px; background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.logo { display: flex; align-items: center; gap: 10px; padding: 16px; border-bottom: 1px solid var(--border); }
.logo-icon { width: 36px; height: 36px; background: var(--blue); color: #fff; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.logo-name { font-size: 13px; font-weight: 600; }
.logo-sub { font-size: 10px; color: var(--text2); }
.nav { flex: 1; overflow-y: auto; padding: 8px 0; }
.nav-section { padding: 10px 14px 3px; font-size: 10px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: .06em; }
.nav-item { display: flex; align-items: center; gap: 8px; padding: 7px 12px; cursor: pointer; border-radius: 7px; margin: 1px 6px; font-size: 13px; color: var(--text2); text-decoration: none; transition: background .12s; }
.nav-item:hover { background: var(--bg3); color: var(--text); }
.nav-item.active { background: var(--blue-bg); color: var(--blue); font-weight: 500; }
.nav-item i { font-size: 16px; min-width: 16px; }
.badge { margin-left: auto; font-size: 10px; padding: 1px 6px; border-radius: 10px; font-weight: 600; }
.badge.danger { background: var(--red-bg); color: var(--red); }
.badge.amber { background: var(--amber-bg); color: var(--amber); }
.badge.blue { background: var(--blue-bg); color: var(--blue); }
.sidebar-footer { padding: 10px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 5px; }
.btn-export { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: var(--radius); border: 1px solid var(--border2); background: none; color: var(--text2); cursor: pointer; font-size: 12px; transition: background .1s; }
.btn-export:hover { background: var(--bg3); }

/* ── MAIN ── */
.main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; min-width: 0; }

/* ── TOPBAR ── */
.topbar { background: var(--bg2); border-bottom: 1px solid var(--border); padding: 12px 20px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; position: sticky; top: 0; z-index: 10; }
.topbar-title { font-size: 16px; font-weight: 600; flex: 1; }
.content { padding: 20px; }

/* ── BUTTONS ── */
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: var(--radius); border: 1px solid var(--border2); background: var(--bg2); color: var(--text); cursor: pointer; font-size: 13px; font-family: inherit; transition: background .1s; }
.btn:hover { background: var(--bg3); }
.btn-primary { background: var(--blue); color: #fff; border-color: var(--blue); }
.btn-primary:hover { background: var(--blue-text); }
.btn-success { background: var(--green); color: #fff; border-color: var(--green); }
.btn-success:hover { background: var(--green-text); }
.btn-danger { background: var(--red); color: #fff; border-color: var(--red); }
.btn-amber { background: var(--amber); color: #fff; border-color: var(--amber); }
.btn-sm { padding: 4px 10px; font-size: 12px; }
.btn-icon { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: none; cursor: pointer; color: var(--text2); transition: background .1s; font-size: 14px; }
.btn-icon:hover { background: var(--bg3); }

/* ── CARDS ── */
.card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px 20px; margin-bottom: 16px; }
.card-title { font-size: 13px; font-weight: 600; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.card-title i { font-size: 16px; color: var(--blue); }

/* ── STATS ── */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.stat { background: var(--bg3); border-radius: var(--radius); padding: 14px 16px; }
.stat-label { font-size: 11px; color: var(--text2); margin-bottom: 5px; }
.stat-value { font-size: 26px; font-weight: 700; }
.stat-sub { font-size: 11px; color: var(--text2); margin-top: 3px; }
.stat.blue .stat-value { color: var(--blue); }
.stat.green .stat-value { color: var(--green); }
.stat.amber .stat-value { color: var(--amber); }
.stat.red .stat-value { color: var(--red); }

/* ── TABLES ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 600; color: var(--text2); border-bottom: 1px solid var(--border); text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; }
td { padding: 10px 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--bg3); }

/* ── TAGS ── */
.tag { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.tag-blue { background: var(--blue-bg); color: var(--blue-text); }
.tag-green { background: var(--green-bg); color: var(--green-text); }
.tag-amber { background: var(--amber-bg); color: var(--amber-text); }
.tag-red { background: var(--red-bg); color: var(--red-text); }
.tag-gray { background: var(--bg3); color: var(--text2); }
.tag-purple { background: var(--purple-bg); color: var(--purple); }
.tag-coral { background: var(--coral-bg); color: var(--coral); }

/* ── ALERTS ── */
.alert { padding: 10px 14px; border-radius: var(--radius); font-size: 13px; display: flex; align-items: flex-start; gap: 9px; margin-bottom: 14px; }
.alert i { flex-shrink: 0; font-size: 16px; margin-top: 1px; }
.alert-warn { background: var(--amber-bg); color: var(--amber-text); border: 1px solid #EF9F27; }
.alert-danger { background: var(--red-bg); color: var(--red-text); border: 1px solid #E24B4A; }
.alert-success { background: var(--green-bg); color: var(--green-text); border: 1px solid #97C459; }
.alert-info { background: var(--blue-bg); color: var(--blue-text); border: 1px solid #85B7EB; }

/* ── FORMS ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group.full { grid-column: 1 / -1; }
.form-label { font-size: 12px; font-weight: 500; color: var(--text2); }
.form-input { padding: 8px 10px; border: 1px solid var(--border2); border-radius: var(--radius); background: var(--bg2); color: var(--text); font-size: 13px; font-family: inherit; width: 100%; }
.form-input:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 2px rgba(24,95,165,.15); }
select.form-input { cursor: pointer; }
textarea.form-input { resize: vertical; }

/* ── PROGRESS ── */
.pbar { background: var(--bg3); border-radius: 4px; height: 5px; overflow: hidden; }
.pfill { height: 100%; border-radius: 4px; transition: width .3s; }
.pbar-wrap { display: flex; align-items: center; gap: 6px; }
.pbar-wrap .pbar { flex: 1; }
.pbar-pct { font-size: 11px; min-width: 28px; }

/* ── AVATAR ── */
.avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }

/* ── FASE TIMELINE ── */
.fase-timeline { display: flex; align-items: flex-start; margin: 12px 0; }
.fase-step { flex: 1; text-align: center; position: relative; }
.fase-step::before { content: ''; position: absolute; top: 13px; left: 50%; right: -50%; height: 2px; background: var(--border); z-index: 0; }
.fase-step:last-child::before { display: none; }
.fase-circle { width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--border2); background: var(--bg2); margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; position: relative; z-index: 1; }
.fase-circle.done { border-color: var(--green); background: var(--green); color: #fff; }
.fase-circle.active { border-color: var(--blue); background: var(--blue); color: #fff; }
.fase-label { font-size: 10px; color: var(--text2); line-height: 1.3; }

/* ── SIGNALERING ── */
.sig-item { border-left: 3px solid; padding: 10px 14px; margin-bottom: 10px; border-radius: 0 8px 8px 0; }
.sig-danger { border-color: #E24B4A; background: var(--red-bg); }
.sig-warn { border-color: #EF9F27; background: var(--amber-bg); }
.sig-info { border-color: #85B7EB; background: var(--blue-bg); }
.sig-title { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
.sig-meta { font-size: 11px; color: var(--text2); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

/* ── HANDTEKENING ── */
.sig-canvas-wrap { border: 2px dashed var(--border2); border-radius: var(--radius); background: #fafaf8; position: relative; }
#sig-canvas, #para-canvas { display: block; cursor: crosshair; touch-action: none; width: 100%; }
.canvas-controls { display: flex; gap: 8px; padding: 8px; border-top: 1px solid var(--border); align-items: center; }
.sig-preview { border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg3); min-height: 60px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.sig-preview img { max-height: 55px; max-width: 100%; }

/* ── UPLOAD ZONE ── */
.upload-zone { border: 2px dashed var(--border2); border-radius: var(--radius); padding: 20px; text-align: center; cursor: pointer; color: var(--text2); transition: all .15s; }
.upload-zone:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-bg); }
.upload-zone.has-file { border-color: var(--green); background: var(--green-bg); color: var(--green); }
.upload-zone i { font-size: 28px; display: block; margin-bottom: 6px; }

/* ── BIJLAGE GRID ── */
.bijlage-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.bijlage-card { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius); border: 1px solid var(--border); cursor: pointer; transition: all .12s; }
.bijlage-card:hover { border-color: var(--blue); background: var(--blue-bg); }
.bijlage-card.done { border-color: #97C459; background: var(--green-bg); }
.bijlage-num { width: 28px; height: 28px; border-radius: 6px; background: var(--blue-bg); color: var(--blue); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.bijlage-card.done .bijlage-num { background: var(--green); color: #fff; }

/* ── CERT CARD ── */
.cert-card { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 8px; }
.cert-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }

/* ── MODAL ── */
#modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 200; display: none; align-items: center; justify-content: center; }
#modal-overlay.open { display: flex; }
.modal { background: var(--bg2); border-radius: var(--radius-lg); padding: 24px; width: 580px; max-height: 88vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,.18); }
.modal-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.modal-title { font-size: 16px; font-weight: 700; }
.modal-close { background: none; border: none; cursor: pointer; font-size: 20px; color: var(--text2); padding: 2px; }

/* ── TOAST ── */
#toast { position: fixed; bottom: 24px; right: 24px; z-index: 999; padding: 10px 16px; border-radius: var(--radius); font-size: 13px; display: none; align-items: center; gap: 8px; max-width: 340px; box-shadow: var(--shadow); font-weight: 500; }

/* ── HANDBOEK TOC ── */
.hb-toc-item { padding: 5px 8px; font-size: 12px; cursor: pointer; border-radius: 5px; color: var(--text2); transition: background .1s; }
.hb-toc-item:hover { background: var(--bg3); color: var(--text); }
.hb-toc-item.active { background: var(--blue-bg); color: var(--blue); font-weight: 500; }

/* ── CHECKLIST ── */
.cl-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); }
.cl-item:last-child { border-bottom: none; }
.cl-check { width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--border2); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background .1s; }
.cl-check.on { background: var(--green); border-color: var(--green); color: #fff; font-size: 12px; }

/* ── HELPERS ── */
.flex { display: flex; }
.ic { align-items: center; }
.gap1 { gap: 4px; }
.gap2 { gap: 8px; }
.gap3 { gap: 12px; }
.mla { margin-left: auto; }
.mt1 { margin-top: 4px; }
.mt2 { margin-top: 8px; }
.mt3 { margin-top: 14px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.hidden { display: none !important; }
.divider { height: 1px; background: var(--border); margin: 14px 0; }

/* ── PRINT ── */
@media print {
  .sidebar, .topbar, .btn, button { display: none !important; }
  .main { overflow: visible; }
  .card { break-inside: avoid; }
}
