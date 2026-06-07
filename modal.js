// ── AFDRUKKEN & PDF ──
const Print = {

  _printHtml(html, titel) {
    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(`<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8">
    <title>${titel}</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12px; color: #111; margin: 20px; }
      h1 { font-size: 18px; margin-bottom: 4px; }
      h2 { font-size: 15px; margin: 16px 0 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
      h3 { font-size: 13px; margin: 12px 0 6px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 12px; }
      th { background: #f0f0f0; padding: 6px 8px; text-align: left; border: 1px solid #ccc; }
      td { padding: 6px 8px; border: 1px solid #ddd; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #185FA5; padding-bottom: 10px; margin-bottom: 16px; }
      .bedrijf { font-size: 11px; color: #555; }
      .tag { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; }
      .t-green { background: #EAF3DE; color: #27500A; }
      .t-amber { background: #FAEEDA; color: #854F0B; }
      .t-red { background: #FCEBEB; color: #791F1F; }
      .t-blue { background: #E6F1FB; color: #0C447C; }
      .sig-box { border: 1px solid #ccc; height: 50px; width: 160px; display: inline-block; }
      .checkmark { font-size: 14px; }
      .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 8px; font-size: 10px; color: #888; }
      @media print { button { display: none; } }
    </style></head><body>
    <div class="header">
      <div>
        <h1>${titel}</h1>
        <div class="bedrijf">Solid Workforce B.V. · KVK 93619405 · Rivium 2E Straat, 2909 LG Capelle aan den IJssel</div>
        <div class="bedrijf">Datum: ${formatDate(new Date().toISOString())}</div>
      </div>
    </div>
    ${html}
    <div class="footer">VCU Managementsysteem — Solid Workforce B.V. · Gegenereerd op ${new Date().toLocaleString('nl-NL')}</div>
    <br><button onclick="window.print()" style="padding:8px 16px;background:#185FA5;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;">Afdrukken / Opslaan als PDF</button>
    </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  },

  handboek() {
    const inst = DB.getInstellingen();
    const procs = PROCEDURES.map(p=>`
      <h3>${p.nr}. ${p.titel}</h3>
      <table><tr><th style="width:160px;">Frequentie</th><td>${p.freq}</td></tr>
      <tr><th>Verantwoordelijke</th><td>${p.verantw}</td></tr>
      <tr><th>Toelichting</th><td>${p.tekst}</td></tr></table>`).join('');
    const bijl = BIJLAGEN.map((b,i)=>`<tr><td>${i+1}</td><td>${b}</td><td>☐ Aanwezig</td></tr>`).join('');
    this._printHtml(`
      <h2>Inleiding</h2>
      <p>Solid Workforce B.V. is een uitzendorganisatie die zich richt op de veilige en gezonde inzet van flexkrachten binnen risicovolle sectoren. Dit handboek beschrijft de VGM-processen conform VCU-richtlijnen.</p>
      <h2>Deel 1 — Procedures (1 t/m 16)</h2>${procs}
      <h2>Deel 2 — Bijlagen (1 t/m 16)</h2>
      <table><thead><tr><th>#</th><th>Bijlage</th><th>Status</th></tr></thead><tbody>${bijl}</tbody></table>`,
      'VCU Handboek — Solid Workforce B.V.'
    );
  },

  handboekPDF() { this.handboek(); },

  handboekHoofdstuk(nr) {
    const p = PROCEDURES.find(x=>x.nr===nr);
    if (!p) return;
    this._printHtml(`<h2>${p.nr}. ${p.titel}</h2>
      <table><tr><th style="width:160px;">Frequentie</th><td>${p.freq}</td></tr>
      <tr><th>Verantwoordelijke</th><td>${p.verantw}</td></tr>
      <tr><th>Toelichting</th><td>${p.tekst}</td></tr></table>`,
      `VCU Handboek — Hoofdstuk ${p.nr}: ${p.titel}`
    );
  },

  dossierById(mwId) {
    if (!mwId) { Toast.show('Selecteer een medewerker','warn'); return; }
    const mw = DB.getMedewerker(mwId);
    if (!mw) return;
    this._printDossier(mw);
  },

  dossier() {
    const sel = document.getElementById('dossier-select');
    if (!sel?.value) { Toast.show('Selecteer een medewerker','warn'); return; }
    this.dossierById(parseInt(sel.value));
  },

  dossierPDF() { this.dossier(); },
  dossierPDFById(id) { this.dossierById(id); },

  _printDossier(mw) {
    const il = DB.getInlener(mw.inlenerId);
    const certs = DB.getCertificaten(mw.id);
    const bijl = DB.getBijlagen(mw.id);
    const ht = DB.getHandtekening(mw.id);
    const pct = DB.dossierCompletie(mw.id);

    const faseLabels = {1:'Fase 1 — Inleen (eerste periode)',2:'Fase 2 — Inleen',3:'Fase 3 — Bepaalde tijd',4:'Fase 4 — Onbepaalde tijd (vast)'};

    const bijlagenRows = BIJLAGEN.map((naam,i)=>{
      const b = bijl[i+1]||{};
      return `<tr><td>${i+1}</td><td>${naam}</td><td>${b.compleet?`<span class="tag t-green">✓ ${formatDate(b.datum)}</span>`:'<span class="tag t-amber">Ontbreekt</span>'}</td></tr>`;
    }).join('');

    const certRows = certs.length ? certs.map(c=>`<tr><td>${c.naam}</td><td>${c.nummer||'—'}</td><td>${formatDate(c.geldigTot)}</td><td>${daysDiff(c.geldigTot)<=30?'<span class="tag t-red">Verloopt binnenkort</span>':'<span class="tag t-green">Geldig</span>'}</td></tr>`).join('') : '<tr><td colspan="4">Geen certificaten geregistreerd</td></tr>';

    const sigHtml = ht ? `<img src="${ht.hand}" style="max-height:50px;border:1px solid #ccc;padding:4px;">` : '<div class="sig-box">Niet ingesteld</div>';
    const parHtml = ht?.paraaf ? `<img src="${ht.paraaf}" style="max-height:50px;border:1px solid #ccc;padding:4px;">` : '<div class="sig-box" style="width:80px;">Niet ingesteld</div>';

    this._printHtml(`
      <h2>Medewerkersdossier</h2>
      <table>
        <tr><th style="width:160px;">Naam</th><td>${mwNaam(mw)}</td><th style="width:120px;">BSN</th><td>${mw.bsn||'—'}</td></tr>
        <tr><th>Categorie</th><td>${mw.cat}</td><th>Contractfase</th><td>${mw.fase?faseLabels[mw.fase]:'N.v.t.'}</td></tr>
        <tr><th>Startdatum</th><td>${formatDate(mw.start)}</td><th>Opdrachtgever</th><td>${il?.naam||'—'}</td></tr>
        <tr><th>Functie</th><td>${mw.functie||'—'}</td><th>Dossiercompletie</th><td>${pct}%</td></tr>
        <tr><th>E-mail</th><td>${mw.email||'—'}</td><th>Telefoon</th><td>${mw.telefoon||'—'}</td></tr>
        <tr><th>ID gecontroleerd</th><td>${mw.idGecontroleerd?'<span class="tag t-green">✓ Ja</span>':'<span class="tag t-amber">Nee</span>'}</td>
            <th>VCU-voorlichting</th><td>${mw.vcuVoorlichting?'<span class="tag t-green">✓ Ja</span>':'<span class="tag t-amber">Nee</span>'}</td></tr>
      </table>

      ${mw.cat==='Uitzend'?`<h2>Contractfase (ABU/NBBU CAO)</h2>
      <p>Huidige fase: <strong>${faseLabels[mw.fase]||'—'}</strong> · Startdatum: ${formatDate(mw.start)} · Weken gewerkt: ${wekenGewerkt(mw.start)}</p>`:''}

      <h2>Handtekening & Paraaf</h2>
      <table><tr><th>Handtekening</th><th>Paraaf</th><th>Datum ingesteld</th></tr>
      <tr><td>${sigHtml}</td><td>${parHtml}</td><td>${ht?formatDate(ht.datum):'—'}</td></tr></table>

      <h2>Certificaten & Diploma's</h2>
      <table><thead><tr><th>Certificaat</th><th>Nummer</th><th>Geldig tot</th><th>Status</th></tr></thead>
      <tbody>${certRows}</tbody></table>

      <h2>VCU Bijlagen (16 stuks)</h2>
      <table><thead><tr><th style="width:30px;">#</th><th>Bijlage</th><th>Status</th></tr></thead>
      <tbody>${bijlagenRows}</tbody></table>

      <h2>Handtekeningen</h2>
      <table><tr>
        <td style="width:33%;text-align:center;"><div style="margin-bottom:4px;font-size:11px;font-weight:bold;">Medewerker</div>${sigHtml}<div style="font-size:10px;margin-top:4px;">${mwNaam(mw)}</div></td>
        <td style="width:33%;text-align:center;"><div style="margin-bottom:4px;font-size:11px;font-weight:bold;">Intercedent</div><div class="sig-box"></div></td>
        <td style="width:33%;text-align:center;"><div style="margin-bottom:4px;font-size:11px;font-weight:bold;">Directie</div><div class="sig-box"></div></td>
      </tr></table>`,
      `Personeelsdossier — ${mwNaam(mw)}`
    );
  },

  compliance() {
    const mws = DB.getMedewerkers();
    const rows = mws.map(mw=>{
      const pct = DB.dossierCompletie(mw.id);
      const certs = DB.getCertificaten(mw.id);
      const il = DB.getInlener(mw.inlenerId);
      return `<tr>
        <td>${mwNaam(mw)}</td>
        <td>${mw.cat}</td>
        <td>${mw.fase?`Fase ${mw.fase}`:'—'}</td>
        <td>${il?.naam||'—'}</td>
        <td>${mw.heeftHandtekening?'<span class="tag t-green">✓</span>':'<span class="tag t-amber">Nee</span>'}</td>
        <td>${pct===100?`<span class="tag t-green">100%</span>`:`<span class="tag t-amber">${pct}%</span>`}</td>
        <td>${certs.length>0?certs.map(c=>`${c.naam} (${formatDate(c.geldigTot)})`).join(', '):'Geen'}</td>
        <td>${pct===100&&mw.heeftHandtekening?'<span class="tag t-green">Compliant</span>':'<span class="tag t-amber">Onvolledig</span>'}</td>
      </tr>`;
    }).join('');
    this._printHtml(`
      <h2>Compliancerapportage</h2>
      <table><thead><tr><th>Naam</th><th>Categorie</th><th>Fase</th><th>Inlener</th><th>Handtek.</th><th>Dossier</th><th>Certificaten</th><th>VCU Status</th></tr></thead>
      <tbody>${rows}</tbody></table>`,
      'VCU Compliancerapportage — Solid Workforce B.V.'
    );
  }
};
