// ── ALLE MODALS ──
const Modal = {
  open(html) {
    document.getElementById('modal-box').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('open');
  },
  close() {
    document.getElementById('modal-overlay').classList.remove('open');
  },
  handleOverlay(e) {
    if (e.target === document.getElementById('modal-overlay')) this.close();
  },
  hdr(title) {
    return `<div class="modal-hdr"><div class="modal-title">${title}</div><button class="modal-close" onclick="Modal.close()"><i class="ti ti-x"></i></button></div>`;
  },
  footer(saveCall, saveLabel='Opslaan') {
    return `<div class="flex gap2 mt3" style="justify-content:flex-end;"><button class="btn" onclick="Modal.close()">Annuleren</button><button class="btn btn-primary" onclick="${saveCall}"><i class="ti ti-check"></i>${saveLabel}</button></div>`;
  },

  // ── NIEUWE MEDEWERKER ──
  nieuwMedewerker(id=null) {
    const mw = id ? DB.getMedewerker(id) : null;
    const ils = DB.getInleners();
    const ilOpts = ils.map(i=>`<option value="${i.id}" ${mw?.inlenerId==i.id?'selected':''}>${H(i.naam)}</option>`).join('');
    const v = mw || {};
    this.open(`${this.hdr(id ? 'Medewerker bewerken' : 'Nieuwe medewerker toevoegen')}
    <div class="form-grid">
      <div class="form-group"><div class="form-label">Voornaam *</div><input class="form-input" id="mw-vnaam" value="${H(v.voornaam||'')}"></div>
      <div class="form-group"><div class="form-label">Achternaam *</div><input class="form-input" id="mw-anaam" value="${H(v.achternaam||'')}"></div>
      <div class="form-group"><div class="form-label">Categorie *</div>
        <select class="form-input" id="mw-cat" onchange="toggleFaseVeld()">
          ${['Eigen','Uitzend','ZZP','Onderaannemer'].map(c=>`<option ${v.cat===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group" id="fase-veld" ${v.cat!=='Uitzend'&&v.cat?'style="display:none"':''}>
        <div class="form-label">Contractfase</div>
        <select class="form-input" id="mw-fase">
          <option value="1" ${v.fase==1?'selected':''}>Fase 1 — Inleen (eerste periode)</option>
          <option value="2" ${v.fase==2?'selected':''}>Fase 2 — Inleen (max. 52 weken)</option>
          <option value="3" ${v.fase==3?'selected':''}>Fase 3 — Bepaalde tijd (≥1 jaar)</option>
          <option value="4" ${v.fase==4?'selected':''}>Fase 4 — Onbepaalde tijd (vast)</option>
        </select>
      </div>
      <div class="form-group"><div class="form-label">Startdatum *</div><input type="date" class="form-input" id="mw-start" value="${v.start||''}"></div>
      <div class="form-group"><div class="form-label">Opdrachtgever</div>
        <select class="form-input" id="mw-inlener"><option value="">— Geen —</option>${ilOpts}</select>
      </div>
      <div class="form-group full"><div class="form-label">Functie</div><input class="form-input" id="mw-functie" value="${H(v.functie||'')}"></div>
      <div class="form-group"><div class="form-label">E-mailadres</div><input type="email" class="form-input" id="mw-email" value="${H(v.email||'')}"></div>
      <div class="form-group"><div class="form-label">Telefoonnummer</div><input class="form-input" id="mw-tel" value="${H(v.telefoon||'')}"></div>
      <div class="form-group"><div class="form-label">BSN (geanonimiseerd)</div><input class="form-input" id="mw-bsn" value="${H(v.bsn||'')}"></div>
      <div class="form-group"><div class="form-label">ID gecontroleerd</div>
        <select class="form-input" id="mw-id"><option value="1" ${v.idGecontroleerd?'selected':''}>Ja — gecontroleerd</option><option value="0" ${!v.idGecontroleerd?'selected':''}>Nee</option></select>
      </div>
    </div>
    <div class="alert alert-info mt2"><i class="ti ti-signature"></i>Na opslaan kunt u direct de handtekening instellen.</div>
    ${this.footer(`saveMedewerker(${id||'null'})`, id?'Opslaan':'Toevoegen & dossier aanmaken')}`);
    toggleFaseVeld();
  },

  bewerkMedewerker(id) { this.nieuwMedewerker(id); },

  // ── NIEUW CERTIFICAAT ──
  nieuwCertificaat(mwId=null) {
    const mws = DB.getMedewerkers();
    const mwOpts = mws.map(m=>`<option value="${m.id}" ${mwId==m.id?'selected':''}>${H(mwNaam(m))}</option>`).join('');
    this.open(`${this.hdr('Certificaat / Diploma toevoegen')}
    <div class="form-grid">
      <div class="form-group full"><div class="form-label">Medewerker *</div><select class="form-input" id="cert-mw">${mwOpts}</select></div>
      <div class="form-group"><div class="form-label">Type certificaat *</div>
        <select class="form-input" id="cert-naam">${CERT_TYPEN.map(t=>`<option>${t}</option>`).join('')}</select>
      </div>
      <div class="form-group"><div class="form-label">Certificaatnummer</div><input class="form-input" id="cert-nr" placeholder="VCA-2025-001"></div>
      <div class="form-group"><div class="form-label">Geldig vanaf</div><input type="date" class="form-input" id="cert-van"></div>
      <div class="form-group"><div class="form-label">Geldig tot *</div><input type="date" class="form-input" id="cert-tot"></div>
    </div>
    <div class="mt2">
      <div class="form-label">Upload diploma / certificaat (PDF of afbeelding)</div>
      <div class="upload-zone mt1" id="cert-zone" onclick="document.getElementById('cert-file').click()">
        <i class="ti ti-upload"></i><div style="font-size:13px;">Klik of sleep PDF / PNG / JPG hier</div>
      </div>
      <input type="file" id="cert-file" accept=".pdf,image/*" class="hidden" onchange="handleCertUpload(event)">
    </div>
    <div class="alert alert-info mt2"><i class="ti ti-bell"></i>Signalering wordt automatisch ingesteld ${DB.getInstellingen().sigDagen} dagen voor vervaldatum.</div>
    ${this.footer('saveCertificaatModal()')}`);
  },

  // ── INCIDENT BEKIJKEN ──
  bekijkIncident(id) {
    const inc = DB.getIncidenten().find(i=>i.id==id);
    const mw = DB.getMedewerker(inc?.mwId);
    this.open(`${this.hdr('Incident details')}
    <table style="font-size:13px;width:100%;">
      <tr><td style="color:var(--text2);padding:6px 0;width:140px;">Datum/Tijdstip</td><td>${formatDate(inc.datum)} ${inc.tijdstip||''}</td></tr>
      <tr><td style="color:var(--text2);padding:6px 0;">Type</td><td>${H(inc.type)}</td></tr>
      <tr><td style="color:var(--text2);padding:6px 0;">Medewerker</td><td>${H(mwNaam(mw))}</td></tr>
      <tr><td style="color:var(--text2);padding:6px 0;">Locatie</td><td>${H(inc.locatie||'—')}</td></tr>
      <tr><td style="color:var(--text2);padding:6px 0;">Beschrijving</td><td>${H(inc.beschrijving||'—')}</td></tr>
      <tr><td style="color:var(--text2);padding:6px 0;">Letsel</td><td>${inc.letsel?'<span class="tag tag-red">Ja</span>':'<span class="tag tag-green">Nee</span>'}</td></tr>
      <tr><td style="color:var(--text2);padding:6px 0;">Schade</td><td>${inc.schade?'<span class="tag tag-red">Ja</span>':'<span class="tag tag-green">Nee</span>'}</td></tr>
      <tr><td style="color:var(--text2);padding:6px 0;">Status</td><td><span class="tag ${inc.status==='Open'?'tag-amber':'tag-green'}">${inc.status}</span></td></tr>
    </table>
    <div class="flex gap2 mt3" style="justify-content:flex-end;">
      ${inc.status==='Open'?`<button class="btn btn-success" onclick="sluitIncident(${id});Modal.close()"><i class="ti ti-check"></i>Afhandelen</button>`:''}
      <button class="btn" onclick="Modal.close()">Sluiten</button>
    </div>`);
  },

  // ── NIEUW INCIDENT ──
  nieuwIncident() {
    const mws = DB.getMedewerkers();
    const ils = DB.getInleners();
    this.open(`${this.hdr('Incident / Bijna-Ongeval melden (Bijlage 14)')}
    <div class="form-grid">
      <div class="form-group"><div class="form-label">Datum *</div><input type="date" class="form-input" id="inc-datum" value="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group"><div class="form-label">Tijdstip</div><input type="time" class="form-input" id="inc-tijd"></div>
      <div class="form-group"><div class="form-label">Type *</div>
        <select class="form-input" id="inc-type"><option>Bijna-ongeval</option><option>Incident</option><option>Bedrijfsongeval</option></select>
      </div>
      <div class="form-group"><div class="form-label">Medewerker</div>
        <select class="form-input" id="inc-mw">${mws.map(m=>`<option value="${m.id}">${H(mwNaam(m))}</option>`).join('')}</select>
      </div>
      <div class="form-group full"><div class="form-label">Locatie</div><input class="form-input" id="inc-loc" placeholder="Werklocatie / adres"></div>
      <div class="form-group full"><div class="form-label">Beschrijving *</div><textarea class="form-input" id="inc-omschr" rows="3" placeholder="Omschrijf het incident..."></textarea></div>
      <div class="form-group"><div class="form-label">Lichamelijk letsel?</div><select class="form-input" id="inc-letsel"><option value="0">Nee</option><option value="1">Ja</option></select></div>
      <div class="form-group"><div class="form-label">Materiële schade?</div><select class="form-input" id="inc-schade"><option value="0">Nee</option><option value="1">Ja</option></select></div>
    </div>
    ${this.footer('saveIncidentModal()')}`);
  },

  // ── NIEUWE EVALUATIE ──
  nieuweEvaluatie() {
    const mws = DB.getMedewerkers();
    const ils = DB.getInleners();
    const sterField = (id, label) => `<div class="form-group"><div class="form-label">${label}</div><select class="form-input" id="${id}"><option value="1">⭐ 1</option><option value="2">⭐⭐ 2</option><option value="3">⭐⭐⭐ 3</option><option value="4" selected>⭐⭐⭐⭐ 4</option><option value="5">⭐⭐⭐⭐⭐ 5</option></select></div>`;
    this.open(`${this.hdr('Nieuwe evaluatie (Bijlage 13)')}
    <div class="form-grid">
      <div class="form-group"><div class="form-label">Medewerker *</div><select class="form-input" id="ev-mw">${mws.map(m=>`<option value="${m.id}">${H(mwNaam(m))}</option>`).join('')}</select></div>
      <div class="form-group"><div class="form-label">Inlener *</div><select class="form-input" id="ev-il">${ils.map(i=>`<option value="${i.id}">${H(i.naam)}</option>`).join('')}</select></div>
      <div class="form-group full"><div class="form-label">Datum</div><input type="date" class="form-input" id="ev-datum" value="${new Date().toISOString().split('T')[0]}"></div>
      ${sterField('ev-veilig','Veiligheidsregels')}${sterField('ev-pbm','PBM gebruik')}
      ${sterField('ev-kwal','Kwaliteit werk')}${sterField('ev-werk','Werkhouding')}
      <div class="form-group"><div class="form-label">Inlener tevreden?</div><select class="form-input" id="ev-it"><option value="1">Ja — voortzetten</option><option value="0">Nee — verbeterpunten</option></select></div>
      <div class="form-group"><div class="form-label">Medewerker tevreden?</div><select class="form-input" id="ev-ut"><option value="1">Ja — wil blijven</option><option value="0">Nee — verbeterpunten</option></select></div>
      <div class="form-group full"><div class="form-label">Verbeterpunten / opmerkingen</div><textarea class="form-input" id="ev-verb" rows="2"></textarea></div>
    </div>
    ${this.footer('saveEvaluatieModal()')}`);
  },

  // ── NIEUWE INLENER ──
  nieuweInlener() { this.bewerkInlener(null); },
  bewerkInlener(id) {
    const il = id ? DB.getInlener(id) : null;
    const v = il || {};
    this.open(`${this.hdr(id ? 'Inlener bewerken' : 'Nieuwe inlener toevoegen')}
    <div class="form-grid">
      <div class="form-group full"><div class="form-label">Bedrijfsnaam *</div><input class="form-input" id="il-naam" value="${H(v.naam||'')}"></div>
      <div class="form-group"><div class="form-label">KVK-nummer</div><input class="form-input" id="il-kvk" value="${H(v.kvk||'')}"></div>
      <div class="form-group"><div class="form-label">Sector</div><input class="form-input" id="il-sector" value="${H(v.sector||'')}"></div>
      <div class="form-group"><div class="form-label">Contactpersoon</div><input class="form-input" id="il-contact" value="${H(v.contact||'')}"></div>
      <div class="form-group"><div class="form-label">E-mail</div><input type="email" class="form-input" id="il-email" value="${H(v.email||'')}"></div>
      <div class="form-group"><div class="form-label">Telefoon</div><input class="form-input" id="il-tel" value="${H(v.telefoon||'')}"></div>
    </div>
    ${this.footer(`saveInlenerModal(${id||'null'})`)}`);
  }
};

// ── SAVE FUNCTIES ──
function toggleFaseVeld() {
  const cat = document.getElementById('mw-cat')?.value;
  const veld = document.getElementById('fase-veld');
  if (veld) veld.style.display = cat==='Uitzend' ? '' : 'none';
}

function saveMedewerker(id) {
  const vnaam = document.getElementById('mw-vnaam')?.value?.trim();
  const anaam = document.getElementById('mw-anaam')?.value?.trim();
  if (!vnaam||!anaam) { Toast.show('Vul naam in','warn'); return; }
  const cat = document.getElementById('mw-cat')?.value;
  const fase = cat==='Uitzend' ? parseInt(document.getElementById('mw-fase')?.value||1) : null;
  const mw = {
    id: id||0, voornaam:vnaam, achternaam:anaam, cat,fase,
    start: document.getElementById('mw-start')?.value||new Date().toISOString().split('T')[0],
    inlenerId: parseInt(document.getElementById('mw-inlener')?.value||0)||null,
    functie: document.getElementById('mw-functie')?.value||'',
    email: document.getElementById('mw-email')?.value||'',
    telefoon: document.getElementById('mw-tel')?.value||'',
    bsn: document.getElementById('mw-bsn')?.value||'',
    idGecontroleerd: document.getElementById('mw-id')?.value==='1',
    vcuVoorlichting:false, heeftHandtekening:false, actief:true
  };
  if (id) { const bestaand=DB.getMedewerker(id); mw.heeftHandtekening=bestaand?.heeftHandtekening||false; mw.vcuVoorlichting=bestaand?.vcuVoorlichting||false; }
  DB.saveMedewerker(mw);
  Modal.close();
  Toast.show(id?'Medewerker bijgewerkt':'Medewerker aangemaakt — dossier gereed','success');
  App.navigate('medewerkers');
  App.updateBadges();
}

function handleCertUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const zone = document.getElementById('cert-zone');
  zone.classList.add('has-file');
  zone.innerHTML = `<i class="ti ti-check"></i><div>${H(file.name)}</div>`;
  const reader = new FileReader();
  reader.onload = ev => { window._certBestand = {naam:file.name, data:ev.target.result}; };
  reader.readAsDataURL(file);
}

function saveCertificaatModal() {
  const mwId = parseInt(document.getElementById('cert-mw')?.value||0);
  const naam = document.getElementById('cert-naam')?.value;
  const tot = document.getElementById('cert-tot')?.value;
  if (!mwId||!naam||!tot) { Toast.show('Vul alle verplichte velden in','warn'); return; }
  DB.saveCertificaat({id:0, mwId, naam, nummer:document.getElementById('cert-nr')?.value||'', geldigVanaf:document.getElementById('cert-van')?.value||'', geldigTot:tot, bestand:window._certBestand||null, sigVerzonden:false});
  window._certBestand = null;
  Modal.close();
  Toast.show('Certificaat opgeslagen — signalering ingesteld','success');
  Signalering.checkAll();
  App.navigate('certificaten');
  App.updateBadges();
}

function saveIncidentModal() {
  const beschrijving = document.getElementById('inc-omschr')?.value?.trim();
  if (!beschrijving) { Toast.show('Vul een beschrijving in','warn'); return; }
  DB.saveIncident({id:0, mwId:parseInt(document.getElementById('inc-mw')?.value||0), datum:document.getElementById('inc-datum')?.value, tijdstip:document.getElementById('inc-tijd')?.value, type:document.getElementById('inc-type')?.value, locatie:document.getElementById('inc-loc')?.value, beschrijving, letsel:document.getElementById('inc-letsel')?.value==='1', schade:document.getElementById('inc-schade')?.value==='1', status:'Open', melder:'VGM-functionaris'});
  Modal.close();
  Toast.show('Incident geregistreerd','success');
  App.navigate('incidenten');
}

function saveEvaluatieModal() {
  DB.saveEvaluatie({id:0, mwId:parseInt(document.getElementById('ev-mw')?.value||0), inlenerId:parseInt(document.getElementById('ev-il')?.value||0), datum:document.getElementById('ev-datum')?.value, scoreVeiligheid:parseInt(document.getElementById('ev-veilig')?.value), scorePBM:parseInt(document.getElementById('ev-pbm')?.value), scoreKwaliteit:parseInt(document.getElementById('ev-kwal')?.value), scoreWerkhouding:parseInt(document.getElementById('ev-werk')?.value), inlenerTevreden:document.getElementById('ev-it')?.value==='1', ukTevreden:document.getElementById('ev-ut')?.value==='1', verbeterpunten:document.getElementById('ev-verb')?.value});
  Modal.close();
  Toast.show('Evaluatie opgeslagen','success');
  App.navigate('evaluaties');
}

function saveInlenerModal(id) {
  const naam = document.getElementById('il-naam')?.value?.trim();
  if (!naam) { Toast.show('Vul bedrijfsnaam in','warn'); return; }
  DB.saveInlener({id:id||0, naam, kvk:document.getElementById('il-kvk')?.value, sector:document.getElementById('il-sector')?.value, contact:document.getElementById('il-contact')?.value, email:document.getElementById('il-email')?.value, telefoon:document.getElementById('il-tel')?.value, actief:true});
  Modal.close();
  Toast.show('Inlener opgeslagen','success');
  App.navigate('inleners');
}
