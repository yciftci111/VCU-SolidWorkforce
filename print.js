// ── ALLE PAGINA'S ──
const Pages = {

  // ════════════════ DASHBOARD ════════════════
  _mobBtn() {
    return `<button class="mob-menu-btn" onclick="openSidebar()"><i class="ti ti-menu-2"></i></button>`;
  },

  dashboard() {
    const mws = DB.getMedewerkers();
    const sigs = DB.getSignaleringen(true);
    const openInc = DB.getIncidenten().filter(i=>i.status==='Open').length;
    const expCerts = DB.getCertificaten().filter(c=>daysDiff(c.geldigTot)<=30&&daysDiff(c.geldigTot)>=0);
    const compliant = mws.filter(m=>DB.dossierCompletie(m.id)===100&&m.heeftHandtekening).length;

    const alertsHtml = [
      expCerts.length ? `<div class="alert alert-danger"><i class="ti ti-certificate"></i><div><strong>${expCerts.length} certificaat/diploma verloopt binnen 30 dagen.</strong> Bekijk de certificaten pagina.</div></div>` : '',
      mws.filter(m=>!m.heeftHandtekening).length ? `<div class="alert alert-warn"><i class="ti ti-signature"></i>Medewerkers zonder handtekening: ${mws.filter(m=>!m.heeftHandtekening).map(m=>mwNaam(m)).join(', ')}</div>` : '',
      sigs.filter(s=>s.urgentie==='Kritiek').length ? `<div class="alert alert-danger"><i class="ti ti-bell"></i>${sigs.filter(s=>s.urgentie==='Kritiek').length} kritieke signalering(en) vereisen directe actie.</div>` : ''
    ].filter(Boolean).join('');

    const mwRows = mws.slice(0,5).map(mw => {
      const pct = DB.dossierCompletie(mw.id);
      const inlener = DB.getInlener(mw.inlenerId);
      return `<tr>
        <td><div class="flex ic gap2">${mwAvatar(mw)}<span>${H(mwNaam(mw))}</span></div></td>
        <td>${faseTag(mw)}</td>
        <td style="font-size:12px;">${H(inlener?.naam||'—')}</td>
        <td style="min-width:100px;">${pbarHtml(pct)}</td>
        <td>${pct===100&&mw.heeftHandtekening?'<span class="tag tag-green">Compliant</span>':'<span class="tag tag-amber">Onvolledig</span>'}</td>
        <td><button class="btn-icon" onclick="App.navigate('dossier');setTimeout(()=>loadDossier(${mw.id}),100)" title="Dossier"><i class="ti ti-folder-open"></i></button></td>
      </tr>`;
    }).join('');

    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Dashboard</div>
      <div class="flex gap2">
        <button class="btn" onclick="App.navigate('rapporten')"><i class="ti ti-printer"></i>Afdrukken</button>
        <button class="btn btn-primary" onclick="Modal.nieuwMedewerker()"><i class="ti ti-plus"></i>Nieuwe medewerker</button>
      </div>
    </div>
    <div class="content">
      ${alertsHtml}
      <div class="stats-grid">
        <div class="stat blue"><div class="stat-label">Medewerkers actief</div><div class="stat-value">${mws.length}</div><div class="stat-sub">${mws.filter(m=>m.cat==='Uitzend').length} uitzend · ${mws.filter(m=>m.cat==='Eigen').length} eigen</div></div>
        <div class="stat green"><div class="stat-label">VCU Compliant</div><div class="stat-value">${compliant}</div><div class="stat-sub">Dossier 100% + handtekening</div></div>
        <div class="stat amber"><div class="stat-label">Open signaleringen</div><div class="stat-value">${sigs.length}</div><div class="stat-sub">Actief openstaand</div></div>
        <div class="stat red"><div class="stat-label">Open incidenten</div><div class="stat-value">${openInc}</div><div class="stat-sub">Vereisen opvolging</div></div>
      </div>
      <div class="grid2">
        <div class="card">
          <div class="card-title"><i class="ti ti-bell"></i>Recente signaleringen</div>
          ${sigs.slice(0,3).map(s=>`<div class="sig-item ${s.urgentie==='Kritiek'?'sig-danger':'sig-warn'}">
            <div class="sig-title">${H(s.omschrijving)}</div>
            <div class="sig-meta"><span>${H(s.medewerker)}</span><span class="tag ${s.urgentie==='Kritiek'?'tag-red':'tag-amber'}">${s.urgentie}</span></div>
          </div>`).join('') || '<p style="color:var(--text2);font-size:13px;">Geen openstaande signaleringen.</p>'}
          ${sigs.length>0?`<button class="btn btn-sm" onclick="App.navigate('signalering')">Alle signaleringen →</button>`:''}
        </div>
        <div class="card">
          <div class="card-title"><i class="ti ti-certificate"></i>Certificaten status</div>
          ${DB.getCertificaten().filter(c=>daysDiff(c.geldigTot)<=90).slice(0,4).map(c=>{
            const mw = DB.getMedewerker(c.mwId);
            return `<div class="flex ic gap2" style="margin-bottom:8px;font-size:13px;">
              ${mwAvatar(mw,26)}<div style="flex:1;">${H(mwNaam(mw))} — ${H(c.naam)}</div>${certStatusTag(c)}
            </div>`;
          }).join('') || '<p style="color:var(--text2);font-size:13px;">Alle certificaten actueel.</p>'}
        </div>
      </div>
      <div class="card">
        <div class="card-title"><i class="ti ti-users"></i>Medewerkers overzicht</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Naam</th><th>Categorie/Fase</th><th>Opdrachtgever</th><th>Dossier</th><th>Status</th><th></th></tr></thead>
          <tbody>${mwRows}</tbody>
        </table></div>
      </div>
    </div>`;
  },

  // ════════════════ SIGNALERINGEN ════════════════
  signalering() {
    const sigs = DB.getSignaleringen(false);
    const open = sigs.filter(s=>s.status==='Open');
    const afg = sigs.filter(s=>s.status==='Afgehandeld');
    const inst = DB.getInstellingen();
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Signaleringen</div></div>
    <div class="content">
      <div class="card">
        <div class="card-title"><i class="ti ti-settings"></i>Signaleringsinstellingen</div>
        <div class="flex ic gap3" style="flex-wrap:wrap;font-size:13px;">
          <span style="color:var(--text2);">Waarschuw</span>
          <select class="form-input" style="width:120px;" id="inst-dagen" onchange="saveInstelling('sigDagen',parseInt(this.value))">
            <option value="30" ${inst.sigDagen==30?'selected':''}>30 dagen</option>
            <option value="60" ${inst.sigDagen==60?'selected':''}>60 dagen</option>
            <option value="90" ${inst.sigDagen==90?'selected':''}>90 dagen</option>
          </select>
          <span style="color:var(--text2);">van tevoren · Kanalen:</span>
          <label class="flex ic gap1"><input type="checkbox" ${inst.sigSysteem?'checked':''} onchange="saveInstelling('sigSysteem',this.checked)"> Systeem</label>
          <label class="flex ic gap1"><input type="checkbox" ${inst.sigEmail?'checked':''} onchange="saveInstelling('sigEmail',this.checked)"> E-mail</label>
          <label class="flex ic gap1"><input type="checkbox" ${inst.sigWhatsapp?'checked':''} onchange="saveInstelling('sigWhatsapp',this.checked)"> WhatsApp</label>
          <button class="btn btn-sm btn-primary" onclick="Signalering.checkAll();App.navigate('signalering')"><i class="ti ti-refresh"></i>Hercontroleren</button>
        </div>
      </div>
      <div class="card">
        <div class="card-title"><i class="ti ti-alert-triangle"></i>Openstaand (${open.length})</div>
        ${open.length===0?'<p style="color:var(--text2);font-size:13px;">Geen openstaande signaleringen.</p>':''}
        <div class="table-wrap"><table>
          <thead><tr><th>Type</th><th>Medewerker</th><th>Omschrijving</th><th>Urgentie</th><th>Datum</th><th></th></tr></thead>
          <tbody>${open.map(s=>`<tr>
            <td><span class="tag tag-blue">${H(s.type)}</span></td>
            <td>${H(s.medewerker)}</td>
            <td style="font-size:12px;">${H(s.omschrijving)}</td>
            <td>${s.urgentie==='Kritiek'?'<span class="tag tag-red">Kritiek</span>':'<span class="tag tag-amber">Waarschuwing</span>'}</td>
            <td style="font-size:12px;">${formatDate(s.datum)}</td>
            <td><button class="btn-icon" onclick="DB.afhandelSignalering(${s.id});App.navigate('signalering')" title="Afhandelen"><i class="ti ti-check"></i></button></td>
          </tr>`).join('')}
          </tbody>
        </table></div>
      </div>
      ${afg.length?`<div class="card">
        <div class="card-title"><i class="ti ti-history"></i>Afgehandeld (${afg.length})</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Type</th><th>Medewerker</th><th>Omschrijving</th><th>Afgehandeld</th></tr></thead>
          <tbody>${afg.map(s=>`<tr>
            <td><span class="tag tag-green">${H(s.type)}</span></td><td>${H(s.medewerker)}</td>
            <td style="font-size:12px;">${H(s.omschrijving)}</td><td style="font-size:12px;">${formatDate(s.afgehandeld)}</td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>`:''}
    </div>`;
  },

  // ════════════════ MEDEWERKERS ════════════════
  medewerkers() {
    const mws = DB.getMedewerkers();
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Medewerkers</div>
      <div class="flex gap2 ic">
        <input type="text" class="form-input" style="width:180px;" placeholder="Zoeken..." oninput="filterMw(this.value)">
        <select class="form-input" style="width:140px;" onchange="filterMwCat(this.value)">
          <option value="">Alle categorieën</option>
          <option>Eigen</option><option>Uitzend</option><option>ZZP</option><option>Onderaannemer</option>
        </select>
        <button class="btn btn-primary" onclick="Modal.nieuwMedewerker()"><i class="ti ti-plus"></i>Nieuw</button>
      </div>
    </div>
    <div class="content">
      <div class="card">
        <div class="table-wrap"><table id="mw-table">
          <thead><tr><th>Naam</th><th>Categorie</th><th>Fase</th><th>Start</th><th>Opdrachtgever</th><th>Handtek.</th><th>Dossier</th><th>Acties</th></tr></thead>
          <tbody id="mw-tbody">${renderMwTbody(mws)}</tbody>
        </table></div>
      </div>
    </div>`;
  },

  // ════════════════ DOSSIER ════════════════
  dossier() {
    const mws = DB.getMedewerkers();
    const opts = mws.map(m=>`<option value="${m.id}">${H(mwNaam(m))}</option>`).join('');
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Personeelsdossier</div>
      <div class="flex gap2">
        <select class="form-input" id="dossier-select" style="width:200px;" onchange="loadDossier(parseInt(this.value))">
          <option value="">— Selecteer medewerker —</option>${opts}
        </select>
        <button class="btn" onclick="Print.dossier()"><i class="ti ti-printer"></i>Afdrukken</button>
        <button class="btn btn-success" onclick="Print.dossierPDF()"><i class="ti ti-file-type-pdf"></i>PDF</button>
      </div>
    </div>
    <div class="content" id="dossier-content">
      <div class="alert alert-info"><i class="ti ti-info-circle"></i>Selecteer een medewerker om het dossier te bekijken.</div>
    </div>`;
  },

  // ════════════════ HANDTEKENING ════════════════
  handtekening() {
    const mws = DB.getMedewerkers();
    const opts = mws.map(m=>`<option value="${m.id}">${H(mwNaam(m))}</option>`).join('');
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Handtekening & Paraaf</div></div>
    <div class="content">
      <div class="alert alert-info"><i class="ti ti-info-circle"></i>Eenmalig instellen per medewerker. Wordt automatisch overgenomen in alle 16 bijlagen en formulieren.</div>
      <div class="flex ic gap3" style="margin-bottom:16px;">
        <label class="form-label" style="margin:0;">Medewerker:</label>
        <select class="form-input" style="width:220px;" id="sig-mw-select" onchange="loadSigStatus(parseInt(this.value))">
          <option value="">— Selecteer —</option>${opts}
        </select>
      </div>
      <div id="sig-status"></div>
      <div class="grid2">
        <div class="card">
          <div class="card-title"><i class="ti ti-signature"></i>Handtekening</div>
          <div class="flex gap2" style="margin-bottom:10px;">
            <button class="btn btn-sm active" onclick="switchTab('hand','teken')"><i class="ti ti-pencil"></i>Tekenen</button>
            <button class="btn btn-sm" onclick="switchTab('hand','upload')"><i class="ti ti-upload"></i>Uploaden</button>
          </div>
          <div id="hand-teken">
            <div class="sig-canvas-wrap">
              <canvas id="sig-canvas" height="130"></canvas>
              <div class="canvas-controls">
                <button class="btn btn-sm" onclick="clearCanvas('sig-canvas')"><i class="ti ti-trash"></i>Wissen</button>
                <select class="form-input" style="width:80px;font-size:12px;" id="sig-color"><option value="#111">Zwart</option><option value="#185FA5">Blauw</option></select>
                <button class="btn btn-sm btn-primary mla" onclick="saveFromCanvas('hand')"><i class="ti ti-check"></i>Opslaan</button>
              </div>
            </div>
          </div>
          <div id="hand-upload" class="hidden">
            <div class="upload-zone" id="hand-upload-zone" onclick="document.getElementById('hand-file').click()">
              <i class="ti ti-upload"></i><div>Klik of sleep afbeelding hier</div><div style="font-size:11px;margin-top:4px;">PNG of JPG — witte achtergrond</div>
            </div>
            <input type="file" id="hand-file" accept="image/*" class="hidden" onchange="handleSigUpload('hand',event)">
          </div>
          <div id="hand-preview" class="hidden mt2">
            <div class="form-label mb-1">Opgeslagen handtekening:</div>
            <div class="sig-preview"><img id="hand-img" src=""></div>
            <div class="alert alert-success mt2" style="margin-bottom:0;"><i class="ti ti-check"></i>Handtekening opgeslagen</div>
          </div>
        </div>
        <div class="card">
          <div class="card-title"><i class="ti ti-writing"></i>Paraaf</div>
          <div class="flex gap2" style="margin-bottom:10px;">
            <button class="btn btn-sm" onclick="switchTab('para','teken')"><i class="ti ti-pencil"></i>Tekenen</button>
            <button class="btn btn-sm" onclick="switchTab('para','upload')"><i class="ti ti-upload"></i>Uploaden</button>
          </div>
          <div id="para-teken">
            <div class="sig-canvas-wrap">
              <canvas id="para-canvas" height="130"></canvas>
              <div class="canvas-controls">
                <button class="btn btn-sm" onclick="clearCanvas('para-canvas')"><i class="ti ti-trash"></i>Wissen</button>
                <select class="form-input" style="width:80px;font-size:12px;" id="para-color"><option value="#111">Zwart</option><option value="#185FA5">Blauw</option></select>
                <button class="btn btn-sm btn-primary mla" onclick="saveFromCanvas('para')"><i class="ti ti-check"></i>Opslaan</button>
              </div>
            </div>
          </div>
          <div id="para-upload" class="hidden">
            <div class="upload-zone" id="para-upload-zone" onclick="document.getElementById('para-file').click()">
              <i class="ti ti-upload"></i><div>Klik of sleep afbeelding hier</div>
            </div>
            <input type="file" id="para-file" accept="image/*" class="hidden" onchange="handleSigUpload('para',event)">
          </div>
          <div id="para-preview" class="hidden mt2">
            <div class="form-label">Opgeslagen paraaf:</div>
            <div class="sig-preview"><img id="para-img" src=""></div>
            <div class="alert alert-success mt2" style="margin-bottom:0;"><i class="ti ti-check"></i>Paraaf opgeslagen</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title"><i class="ti ti-files"></i>Automatisch toegepast in</div>
        <div class="grid2" style="font-size:13px;">
          <div style="display:flex;flex-direction:column;gap:6px;">${BIJLAGEN.slice(7,12).map(b=>`<div class="flex ic gap2"><i class="ti ti-check" style="color:var(--green);"></i>${b}</div>`).join('')}</div>
          <div style="display:flex;flex-direction:column;gap:6px;">${BIJLAGEN.slice(12).map(b=>`<div class="flex ic gap2"><i class="ti ti-check" style="color:var(--green);"></i>${b}</div>`).join('')}</div>
        </div>
      </div>
    </div>`;
  },

  // ════════════════ BIJLAGEN ════════════════
  bijlagen() {
    const mws = DB.getMedewerkers();
    const opts = mws.map(m=>`<option value="${m.id}">${H(mwNaam(m))}</option>`).join('');
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">16 VCU Bijlagen</div>
      <select class="form-input" id="bijlage-mw-sel" style="width:220px;" onchange="renderBijlagenGrid(parseInt(this.value))">
        <option value="">— Selecteer medewerker —</option>${opts}
      </select>
    </div>
    <div class="content">
      <div class="card">
        <div class="card-title"><i class="ti ti-files"></i>Bijlagenstatus</div>
        <div id="bijlage-grid" class="bijlage-grid">${renderBijlagenPlaceholder()}</div>
      </div>
    </div>`;
  },

  // ════════════════ CERTIFICATEN ════════════════
  certificaten() {
    const mws = DB.getMedewerkers();
    const opts = mws.map(m=>`<option value="${m.id}">${H(mwNaam(m))}</option>`).join('');
    const allCerts = DB.getCertificaten();
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Certificaten & VCA</div>
      <div class="flex gap2">
        <select class="form-input" id="cert-mw-sel" style="width:200px;" onchange="renderCertDetail(parseInt(this.value))">
          <option value="">— Medewerker —</option>${opts}
        </select>
        <button class="btn btn-primary" onclick="Modal.nieuwCertificaat()"><i class="ti ti-plus"></i>Toevoegen</button>
      </div>
    </div>
    <div class="content">
      <div class="grid2">
        <div class="card">
          <div class="card-title"><i class="ti ti-certificate"></i>VCA-vereisten per categorie</div>
          ${[['Uitzendkracht','VCA Basis','tag-green'],['Eigen personeel','VCA VOL','tag-blue'],['ZZP','VCA Basis + VCA VOL','tag-coral'],['Onderaannemer','VCA Basis','tag-gray']].map(([cat,vereist,cls])=>`
          <div class="cert-card"><div class="cert-icon" style="background:var(--blue-bg);color:var(--blue);"><i class="ti ti-certificate"></i></div>
            <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${cat}</div><div style="font-size:11px;color:var(--text2);">${vereist}</div></div>
            <span class="tag ${cls}">${vereist}</span></div>`).join('')}
        </div>
        <div class="card">
          <div class="card-title"><i class="ti ti-users"></i>Status per medewerker</div>
          ${mws.map(mw=>{
            const certs = DB.getCertificaten(mw.id);
            const exp = certs.filter(c=>daysDiff(c.geldigTot)<=30&&daysDiff(c.geldigTot)>=0);
            return `<div class="cert-card" style="cursor:pointer;" onclick="document.getElementById('cert-mw-sel').value=${mw.id};renderCertDetail(${mw.id})">
              ${mwAvatar(mw,30)}<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:500;">${H(mwNaam(mw))}</div>
              <div style="font-size:11px;color:var(--text2);">${certs.length} certificaat/diploma('s)</div></div>
              ${exp.length?'<span class="tag tag-red">Let op</span>':certs.length===0?'<span class="tag tag-gray">Geen</span>':'<span class="tag tag-green">OK</span>'}
            </div>`;
          }).join('')}
        </div>
      </div>
      <div id="cert-detail"></div>
    </div>`;
  },

  // ════════════════ INCIDENTEN ════════════════
  incidenten() {
    const incs = DB.getIncidenten();
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Incidenten & Bijna-Ongevallen</div>
      <button class="btn btn-primary" onclick="Modal.nieuwIncident()"><i class="ti ti-plus"></i>Melden</button>
    </div>
    <div class="content">
      <div class="card">
        <div class="table-wrap"><table>
          <thead><tr><th>Datum</th><th>Type</th><th>Medewerker</th><th>Locatie</th><th>Omschrijving</th><th>Status</th><th>Acties</th></tr></thead>
          <tbody>${incs.map(inc=>{
            const mw = DB.getMedewerker(inc.mwId);
            return `<tr>
              <td>${formatDate(inc.datum)}</td>
              <td><span class="tag ${inc.type==='Bedrijfsongeval'?'tag-red':inc.type==='Bijna-ongeval'?'tag-amber':'tag-blue'}">${H(inc.type)}</span></td>
              <td>${H(mwNaam(mw))}</td>
              <td style="font-size:12px;">${H(inc.locatie||'—')}</td>
              <td style="font-size:12px;max-width:200px;">${H((inc.beschrijving||'').slice(0,60))}${inc.beschrijving?.length>60?'…':''}</td>
              <td>${inc.status==='Open'?'<span class="tag tag-amber">Open</span>':inc.status==='Afgehandeld'?'<span class="tag tag-green">Afgehandeld</span>':'<span class="tag tag-blue">In behandeling</span>'}</td>
              <td class="flex gap1">
                <button class="btn-icon" onclick="Modal.bekijkIncident(${inc.id})" title="Bekijken"><i class="ti ti-eye"></i></button>
                ${inc.status==='Open'?`<button class="btn-icon" onclick="sluitIncident(${inc.id})" title="Afhandelen"><i class="ti ti-check"></i></button>`:''}
              </td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>
      </div>
    </div>`;
  },

  // ════════════════ EVALUATIES ════════════════
  evaluaties() {
    const evs = DB.getEvaluaties();
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Evaluaties</div>
      <button class="btn btn-primary" onclick="Modal.nieuweEvaluatie()"><i class="ti ti-plus"></i>Nieuwe evaluatie</button>
    </div>
    <div class="content">
      <div class="card">
        <div class="table-wrap"><table>
          <thead><tr><th>Datum</th><th>Medewerker</th><th>Inlener</th><th>Veiligheid</th><th>Kwaliteit</th><th>Conclusie</th></tr></thead>
          <tbody>${evs.map(ev=>{
            const mw = DB.getMedewerker(ev.mwId);
            const il = DB.getInlener(ev.inlenerId);
            const sterren = n => '⭐'.repeat(Math.min(5,Math.max(0,n||0)));
            return `<tr>
              <td>${formatDate(ev.datum)}</td>
              <td>${H(mwNaam(mw))}</td>
              <td>${H(il?.naam||'—')}</td>
              <td>${sterren(ev.scoreVeiligheid)}</td>
              <td>${sterren(ev.scoreKwaliteit)}</td>
              <td>${ev.inlenerTevreden?'<span class="tag tag-green">Tevreden</span>':'<span class="tag tag-amber">Verbeterpunten</span>'}</td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>
      </div>
    </div>`;
  },

  // ════════════════ HANDBOEK ════════════════
  handboek() {
    const toc = [
      {key:'intro',label:'Inleiding'},
      ...PROCEDURES.map(p=>({key:`p${p.nr}`,label:`${p.nr}. ${p.titel}`})),
      {key:'bijlagen',label:'Bijlagen 1–16'}
    ];
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">VCU Handboek</div>
      <div class="flex gap2">
        <button class="btn" onclick="Print.handboekPDF()"><i class="ti ti-file-type-pdf"></i>PDF afdrukken</button>
        <button class="btn btn-primary" onclick="Print.handboek()"><i class="ti ti-printer"></i>Afdrukken</button>
      </div>
    </div>
    <div class="content">
      <div style="display:grid;grid-template-columns:190px 1fr;gap:16px;">
        <div class="card" style="height:fit-content;padding:12px;">
          <div class="card-title" style="font-size:11px;margin-bottom:8px;">Inhoudsopgave</div>
          ${toc.map(t=>`<div class="hb-toc-item" onclick="showHbSection('${t.key}',this)">${t.label}</div>`).join('')}
        </div>
        <div class="card" id="hb-content">
          <div class="alert alert-info"><i class="ti ti-info-circle"></i>Selecteer een hoofdstuk uit de inhoudsopgave.</div>
        </div>
      </div>
    </div>`;
  },

  // ════════════════ INLENERS ════════════════
  inleners() {
    const ils = DB.getInleners();
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Inleners / Opdrachtgevers</div>
      <button class="btn btn-primary" onclick="Modal.nieuweInlener()"><i class="ti ti-plus"></i>Nieuw</button>
    </div>
    <div class="content">
      <div class="card">
        <div class="table-wrap"><table>
          <thead><tr><th>Bedrijf</th><th>Contact</th><th>Sector</th><th>Actieve mw.</th><th>Email</th><th>Telefoon</th><th>Acties</th></tr></thead>
          <tbody>${ils.map(il=>{
            const actief = DB.getMedewerkers().filter(m=>m.inlenerId===il.id).length;
            return `<tr>
              <td><strong>${H(il.naam)}</strong></td>
              <td>${H(il.contact||'—')}</td>
              <td><span class="tag tag-blue">${H(il.sector||'—')}</span></td>
              <td>${actief}</td>
              <td style="font-size:12px;">${H(il.email||'—')}</td>
              <td style="font-size:12px;">${H(il.telefoon||'—')}</td>
              <td><button class="btn-icon" onclick="Modal.bewerkInlener(${il.id})"><i class="ti ti-edit"></i></button></td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>
      </div>
    </div>`;
  },

  // ════════════════ RAPPORTEN ════════════════
  rapporten() {
    const mws = DB.getMedewerkers();
    const opts = mws.map(m=>`<option value="${m.id}">${H(mwNaam(m))}</option>`).join('');
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Afdrukken & Export</div></div>
    <div class="content">
      <div class="grid2">
        <div class="card"><div class="card-title"><i class="ti ti-book"></i>VCU Handboek</div>
          <p style="font-size:13px;color:var(--text2);margin-bottom:14px;">Volledig handboek incl. alle 16 procedures en bijlagenlijst</p>
          <div class="flex gap2"><button class="btn btn-primary" onclick="Print.handboek()"><i class="ti ti-printer"></i>Afdrukken</button><button class="btn" onclick="Print.handboekPDF()"><i class="ti ti-file-type-pdf"></i>PDF</button></div>
        </div>
        <div class="card"><div class="card-title"><i class="ti ti-folder"></i>Personeelsdossier</div>
          <p style="font-size:13px;color:var(--text2);margin-bottom:10px;">Volledig dossier incl. bijlagen, handtekening en certificaten</p>
          <div class="flex gap2 ic">
            <select class="form-input" style="flex:1;" id="print-mw-sel">${opts}</select>
            <button class="btn btn-primary" onclick="Print.dossierById(parseInt(document.getElementById('print-mw-sel').value))"><i class="ti ti-printer"></i>Print</button>
          </div>
        </div>
        <div class="card"><div class="card-title"><i class="ti ti-chart-bar"></i>Compliancerapportage</div>
          <p style="font-size:13px;color:var(--text2);margin-bottom:14px;">Overzicht alle medewerkers met VCU-compliance status</p>
          <div class="flex gap2">
            <button class="btn btn-success" onclick="Print.compliance()"><i class="ti ti-printer"></i>Afdrukken</button>
            <button class="btn" onclick="Export.csv()"><i class="ti ti-table-export"></i>CSV export</button>
          </div>
        </div>
        <div class="card"><div class="card-title"><i class="ti ti-download"></i>Data backup</div>
          <p style="font-size:13px;color:var(--text2);margin-bottom:14px;">Sla alle data op als JSON-bestand op uw laptop</p>
          <div class="flex gap2">
            <button class="btn btn-primary" onclick="App.exportData()"><i class="ti ti-download"></i>Opslaan (JSON)</button>
            <button class="btn" onclick="App.importData()"><i class="ti ti-upload"></i>Laden</button>
          </div>
        </div>
      </div>
    </div>`;
  },

  // ════════════════ INSTELLINGEN ════════════════
  instellingen() {
    const inst = DB.getInstellingen();
    return `
    <div class="topbar">${this._mobBtn()}<div class="topbar-title">Instellingen</div></div>
    <div class="content">
      <div class="card"><div class="card-title"><i class="ti ti-building"></i>Bedrijfsgegevens</div>
        <div class="form-grid">
          <div class="form-group"><div class="form-label">Bedrijfsnaam</div><input class="form-input" id="inst-bnaam" value="${H(inst.bedrijfsnaam)}"></div>
          <div class="form-group"><div class="form-label">KVK-nummer</div><input class="form-input" id="inst-kvk" value="${H(inst.kvk)}"></div>
          <div class="form-group full"><div class="form-label">Adres</div><input class="form-input" id="inst-adres" value="${H(inst.adres)}"></div>
          <div class="form-group"><div class="form-label">VGM-functionaris</div><input class="form-input" id="inst-vgm" value="${H(inst.vgmFunctionaris)}"></div>
          <div class="form-group"><div class="form-label">E-mail VGM</div><input class="form-input" id="inst-email" value="${H(inst.vgmEmail)}"></div>
        </div>
        <button class="btn btn-primary mt3" onclick="slaInstellingenOp()"><i class="ti ti-check"></i>Opslaan</button>
      </div>
      <div class="card"><div class="card-title"><i class="ti ti-bell"></i>Signalering</div>
        <div class="form-grid">
          <div class="form-group"><div class="form-label">Waarschuwingstermijn (dagen)</div>
            <select class="form-input" id="inst-sigdagen">
              <option value="30" ${inst.sigDagen==30?'selected':''}>30 dagen</option>
              <option value="60" ${inst.sigDagen==60?'selected':''}>60 dagen</option>
              <option value="90" ${inst.sigDagen==90?'selected':''}>90 dagen</option>
            </select>
          </div>
          <div class="form-group"><div class="form-label">WhatsApp nummer</div><input class="form-input" id="inst-wa" value="${H(inst.whatsappNr||'')}"></div>
        </div>
        <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap;">
          <label class="flex ic gap2"><input type="checkbox" id="inst-sys" ${inst.sigSysteem?'checked':''}> Systeem pop-up</label>
          <label class="flex ic gap2"><input type="checkbox" id="inst-mail" ${inst.sigEmail?'checked':''}> E-mail</label>
          <label class="flex ic gap2"><input type="checkbox" id="inst-wa-cb" ${inst.sigWhatsapp?'checked':''}> WhatsApp</label>
        </div>
        <button class="btn btn-primary mt3" onclick="slaInstellingenOp()"><i class="ti ti-check"></i>Opslaan</button>
      </div>
    </div>`;
  }
};

// ── GEDEELDE RENDERERS & HELPERS ──

function renderMwTbody(mws) {
  return mws.map(mw => {
    const pct = DB.dossierCompletie(mw.id);
    const il = DB.getInlener(mw.inlenerId);
    return `<tr>
      <td><div class="flex ic gap2">${mwAvatar(mw)}<span>${H(mwNaam(mw))}</span></div></td>
      <td>${mw.cat==='Eigen'?'<span class="tag tag-green">Eigen</span>':mw.cat==='ZZP'?'<span class="tag tag-coral">ZZP</span>':mw.cat==='Onderaannemer'?'<span class="tag tag-gray">Ondrnmr</span>':'<span class="tag tag-blue">Uitzend</span>'}</td>
      <td>${faseTag(mw)}</td>
      <td style="font-size:12px;">${formatDate(mw.start)}</td>
      <td style="font-size:12px;max-width:120px;">${H(il?.naam||'—')}</td>
      <td>${mw.heeftHandtekening?'<span class="tag tag-green"><i class="ti ti-check"></i></span>':'<span class="tag tag-amber"><i class="ti ti-clock"></i></span>'}</td>
      <td style="min-width:100px;">${pbarHtml(pct)}</td>
      <td><div class="flex gap1">
        <button class="btn-icon" onclick="App.navigate('dossier');setTimeout(()=>loadDossier(${mw.id}),100)" title="Dossier"><i class="ti ti-folder-open"></i></button>
        <button class="btn-icon" onclick="Modal.bewerkMedewerker(${mw.id})" title="Bewerken"><i class="ti ti-edit"></i></button>
        <button class="btn-icon" onclick="App.navigate('handtekening');setTimeout(()=>document.getElementById('sig-mw-select').value=${mw.id},100);setTimeout(()=>loadSigStatus(${mw.id}),150)" title="Handtekening"><i class="ti ti-signature"></i></button>
      </div></td>
    </tr>`;
  }).join('');
}

function filterMw(q) {
  const mws = DB.getMedewerkers().filter(m=>mwNaam(m).toLowerCase().includes(q.toLowerCase()));
  document.getElementById('mw-tbody').innerHTML = renderMwTbody(mws);
}
function filterMwCat(cat) {
  const mws = DB.getMedewerkers().filter(m=>!cat||m.cat===cat);
  document.getElementById('mw-tbody').innerHTML = renderMwTbody(mws);
}

function loadDossier(id) {
  if (!id) return;
  const sel = document.getElementById('dossier-select');
  if (sel) sel.value = id;
  const mw = DB.getMedewerker(id);
  if (!mw) return;
  const cont = document.getElementById('dossier-content');
  const certs = DB.getCertificaten(id);
  const ht = DB.getHandtekening(id);
  const bijl = DB.getBijlagen(id);
  const pct = DB.dossierCompletie(id);
  const il = DB.getInlener(mw.inlenerId);

  const faseHtml = mw.cat==='Uitzend' ? `
    <div class="divider"></div>
    <div class="form-label">Contractfase (ABU/NBBU CAO)</div>
    <div class="fase-timeline">${[{l:'Fase 1-2',s:'Inleen ≤52w'},{l:'Fase 3',s:'Bepaald'},{l:'Fase 4',s:'Onbep.'}].map((f,i)=>{
      const ai=mw.fase<=2?0:mw.fase===3?1:2;
      return `<div class="fase-step"><div class="fase-circle ${i<ai?'done':i===ai?'active':''}">${i<ai?'<i class="ti ti-check" style="font-size:10px;"></i>':i+1}</div><div class="fase-label">${f.l}<br><span style="font-size:9px;">${f.s}</span></div></div>`;
    }).join('')}</div>
    <div class="alert alert-info mt2" style="font-size:12px;"><i class="ti ti-info-circle"></i>Week ${wekenGewerkt(mw.start)} van 52 — ${52-wekenGewerkt(mw.start)} weken resterend in fase ${mw.fase<=2?'1/2':'—'}</div>` : '';

  const sigHtml = ht ? `<div class="flex gap3">
    <div><div class="form-label">Handtekening</div><div class="sig-preview" style="width:160px;height:50px;"><img src="${ht.hand}" style="max-height:46px;"></div></div>
    <div><div class="form-label">Paraaf</div><div class="sig-preview" style="width:80px;height:50px;"><img src="${ht.paraaf||ht.hand}" style="max-height:46px;"></div></div>
  </div>` : `<div class="alert alert-warn"><i class="ti ti-alert-triangle"></i>Geen handtekening — <button class="btn btn-sm mla" onclick="App.navigate('handtekening');setTimeout(()=>{document.getElementById('sig-mw-select').value=${id};loadSigStatus(${id});},100)">Nu instellen</button></div>`;

  const bijlagenHtml = BIJLAGEN.map((naam,i)=>{
    const b = bijl[i+1]||{};
    return `<div class="cl-item">
      <div class="cl-check ${b.compleet?'on':''}" onclick="toggleBijlage(${id},${i+1},this)">
        ${b.compleet?'<i class="ti ti-check"></i>':''}
      </div>
      <span style="flex:1;font-size:13px;">${i+1}. ${naam}</span>
      ${b.compleet?`<span class="tag tag-green" style="font-size:10px;">${formatDate(b.datum)}</span>`:'<span class="tag tag-amber" style="font-size:10px;">Ontbreekt</span>'}
    </div>`;
  }).join('');

  cont.innerHTML = `
    <div class="flex gap2" style="margin-bottom:14px;">
      <button class="btn" onclick="Print.dossierById(${id})"><i class="ti ti-printer"></i>Print dossier</button>
      <button class="btn btn-success" onclick="Print.dossierPDFById(${id})"><i class="ti ti-file-type-pdf"></i>PDF export</button>
      <button class="btn btn-primary mla" onclick="Modal.nieuwCertificaat(${id})"><i class="ti ti-plus"></i>Certificaat toevoegen</button>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-user"></i>${H(mwNaam(mw))} — Personeelsdossier</div>
      <div class="form-grid">
        <div><div class="form-label">Naam</div><div style="font-size:13px;">${H(mwNaam(mw))}</div></div>
        <div><div class="form-label">BSN</div><div style="font-size:13px;">${H(mw.bsn||'—')}</div></div>
        <div><div class="form-label">Categorie</div>${faseTag(mw)}</div>
        <div><div class="form-label">Startdatum</div><div style="font-size:13px;">${formatDate(mw.start)}</div></div>
        <div><div class="form-label">Opdrachtgever</div><div style="font-size:13px;">${H(il?.naam||'—')}</div></div>
        <div><div class="form-label">Dossiercompletie</div>${pbarHtml(pct)}</div>
        <div><div class="form-label">E-mail</div><div style="font-size:13px;">${H(mw.email||'—')}</div></div>
        <div><div class="form-label">Telefoon</div><div style="font-size:13px;">${H(mw.telefoon||'—')}</div></div>
      </div>
      ${faseHtml}
    </div>
    <div class="card"><div class="card-title"><i class="ti ti-signature"></i>Handtekening & Paraaf</div>${sigHtml}</div>
    <div class="card">
      <div class="card-title"><i class="ti ti-certificate"></i>Certificaten (${certs.length})</div>
      ${certs.length ? certs.map(c=>`<div class="cert-card">
        <div class="cert-icon" style="background:${daysDiff(c.geldigTot)<=30?'var(--red-bg)':'var(--green-bg)'};color:${daysDiff(c.geldigTot)<=30?'var(--red)':'var(--green)'};">
          <i class="ti ti-certificate"></i></div>
        <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${H(c.naam)}</div>
          <div style="font-size:11px;color:var(--text2);">Nr: ${H(c.nummer||'—')} · Geldig t/m: ${formatDate(c.geldigTot)}</div></div>
        ${certStatusTag(c)}
        <button class="btn btn-sm btn-danger" onclick="if(confirm('Verwijderen?'))deleteCert(${c.id})"><i class="ti ti-trash"></i></button>
      </div>`).join('') : `<div class="alert alert-warn"><i class="ti ti-alert-triangle"></i>Geen certificaten geregistreerd. <button class="btn btn-sm btn-primary" onclick="Modal.nieuwCertificaat(${id})" style="margin-left:8px;"><i class="ti ti-plus"></i>Toevoegen</button></div>`}
    </div>
    <div class="card"><div class="card-title"><i class="ti ti-files"></i>VCU Bijlagen (16)</div>${bijlagenHtml}</div>`;
}

function toggleBijlage(mwId, nr, el) {
  const b = DB.getBijlage(mwId, nr);
  const nieuw = !b.compleet;
  DB.saveBijlage(mwId, nr, { compleet: nieuw });
  el.classList.toggle('on', nieuw);
  el.innerHTML = nieuw ? '<i class="ti ti-check"></i>' : '';
  const statusEl = el.parentElement.querySelector('.tag');
  if (statusEl) {
    statusEl.className = `tag ${nieuw?'tag-green':'tag-amber'}`;
    statusEl.style.fontSize = '10px';
    statusEl.textContent = nieuw ? formatDate(new Date().toISOString().split('T')[0]) : 'Ontbreekt';
  }
  App.updateBadges();
}

function deleteCert(id) { DB.deleteCertificaat(id); App.navigate('dossier'); }
function sluitIncident(id) {
  const inc = DB.getIncidenten().find(i=>i.id==id);
  if (inc) { inc.status='Afgehandeld'; DB.saveIncident(inc); App.navigate('incidenten'); Toast.show('Incident afgehandeld','success'); }
}

function renderBijlagenPlaceholder() {
  return BIJLAGEN.map((naam,i)=>`<div class="bijlage-card"><div class="bijlage-num">${i+1}</div><div style="font-size:12px;">${naam}</div></div>`).join('');
}

function renderBijlagenGrid(mwId) {
  if (!mwId) return;
  const bijl = DB.getBijlagen(mwId);
  document.getElementById('bijlage-grid').innerHTML = BIJLAGEN.map((naam,i)=>{
    const b = bijl[i+1]||{};
    return `<div class="bijlage-card ${b.compleet?'done':''}" onclick="openBijlageFormulier(${mwId},${i+1})">
      <div class="bijlage-num">${i+1}</div>
      <div style="flex:1;font-size:12px;line-height:1.4;">${naam}</div>
      <div style="flex-shrink:0;">
        ${b.compleet
          ? '<i class="ti ti-circle-check" style="color:var(--green);font-size:18px;"></i>'
          : '<i class="ti ti-circle-plus" style="color:var(--text3);font-size:18px;"></i>'}
      </div>
    </div>`;
  }).join('');
}

function renderCertDetail(mwId) {
  if (!mwId) return;
  const mw = DB.getMedewerker(mwId);
  const certs = DB.getCertificaten(mwId);
  document.getElementById('cert-detail').innerHTML = `
    <div class="card">
      <div class="card-title"><i class="ti ti-certificate"></i>${H(mwNaam(mw))} — certificaten</div>
      ${certs.map(c=>`<div class="cert-card">
        <div class="cert-icon" style="background:${daysDiff(c.geldigTot)<=30?'var(--red-bg)':'var(--green-bg)'};color:${daysDiff(c.geldigTot)<=30?'var(--red)':'var(--green)'};">
          <i class="ti ti-certificate"></i></div>
        <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${H(c.naam)}</div>
          <div style="font-size:11px;color:var(--text2);">Nr: ${H(c.nummer||'—')} · Geldig t/m: ${formatDate(c.geldigTot)}</div></div>
        ${certStatusTag(c)}
        <button class="btn btn-sm btn-danger" onclick="if(confirm('Verwijderen?'))deleteCert(${c.id});renderCertDetail(${mwId})"><i class="ti ti-trash"></i></button>
      </div>`).join('') || `<div class="alert alert-warn"><i class="ti ti-alert-triangle"></i>Geen certificaten. <button class="btn btn-sm btn-primary" onclick="Modal.nieuwCertificaat(${mwId})" style="margin-left:8px;"><i class="ti ti-plus"></i>Toevoegen</button></div>`}
    </div>`;
}

function showHbSection(key, el) {
  document.querySelectorAll('.hb-toc-item').forEach(e=>e.classList.remove('active'));
  if (el) el.classList.add('active');
  const cont = document.getElementById('hb-content');
  if (key==='intro') {
    cont.innerHTML = `<div class="card-title"><i class="ti ti-book"></i>Inleiding</div>
      <p style="font-size:13px;line-height:1.8;color:var(--text2);">Solid Workforce B.V. is een uitzendorganisatie die zich richt op de veilige en gezonde inzet van flexkrachten binnen risicovolle sectoren. Om te voldoen aan de eisen van de <strong>Veiligheids Checklist Uitzendorganisaties (VCU)</strong> en om de veiligheid, gezondheid en welzijn van onze uitzendkrachten te waarborgen, heeft Solid Workforce B.V. dit VCU-handboek opgesteld.</p>
      <button class="btn btn-primary mt3" onclick="Print.handboek()"><i class="ti ti-printer"></i>Print volledig handboek</button>`;
  } else if (key==='bijlagen') {
    cont.innerHTML = `<div class="card-title"><i class="ti ti-files"></i>Bijlagen 1–16</div>
      <div class="bijlage-grid">${BIJLAGEN.map((b,i)=>`<div class="bijlage-card"><div class="bijlage-num">${i+1}</div><div style="font-size:12px;">${b}</div></div>`).join('')}</div>`;
  } else {
    const nr = parseInt(key.replace('p',''));
    const p = PROCEDURES.find(x=>x.nr===nr);
    if (p) cont.innerHTML = `
      <div class="card-title"><i class="ti ti-file-text"></i>${p.nr}. ${p.titel}</div>
      <table style="font-size:13px;margin-bottom:14px;"><tr><td style="color:var(--text2);padding:4px 8px 4px 0;width:140px;">Frequentie</td><td>${p.freq}</td></tr><tr><td style="color:var(--text2);padding:4px 8px 4px 0;">Verantwoordelijke</td><td>${p.verantw}</td></tr></table>
      <p style="font-size:13px;line-height:1.8;color:var(--text2);">${p.tekst}</p>
      <button class="btn btn-primary mt3" onclick="Print.handboekHoofdstuk(${p.nr})"><i class="ti ti-printer"></i>Print dit hoofdstuk</button>`;
  }
}

function loadSigStatus(mwId) {
  if (!mwId) return;
  const mw = DB.getMedewerker(mwId);
  const ht = DB.getHandtekening(mwId);
  const bar = document.getElementById('sig-status');
  if (bar) bar.innerHTML = ht ? `<div class="alert alert-success"><i class="ti ti-check"></i>${H(mwNaam(mw))} heeft al een handtekening opgeslagen. U kunt deze hieronder overschrijven.</div>` : `<div class="alert alert-warn"><i class="ti ti-alert-triangle"></i>${H(mwNaam(mw))} heeft nog geen handtekening.</div>`;
  if (ht?.hand) { document.getElementById('hand-preview').classList.remove('hidden'); document.getElementById('hand-img').src = ht.hand; }
  if (ht?.paraaf) { document.getElementById('para-preview').classList.remove('hidden'); document.getElementById('para-img').src = ht.paraaf; }
  initCanvasses();
}

let sigMwId = 0;
function initCanvasses() {
  ['sig-canvas','para-canvas'].forEach(id => {
    const c = document.getElementById(id);
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = c.parentElement.offsetWidth || 480;
    ctx.fillStyle = '#fafaf8'; ctx.fillRect(0,0,c.width,c.height);
    let drawing = false;
    const pos = e => { const r=c.getBoundingClientRect(); return e.touches ? {x:(e.touches[0].clientX-r.left)*(c.width/r.width),y:(e.touches[0].clientY-r.top)*(c.height/r.height)} : {x:(e.clientX-r.left)*(c.width/r.width),y:(e.clientY-r.top)*(c.height/r.height)}; };
    c.onmousedown = e => { drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
    c.onmousemove = e => { if(!drawing)return; const p=pos(e); const col=id==='sig-canvas'?(document.getElementById('sig-color')?.value||'#111'):(document.getElementById('para-color')?.value||'#111'); ctx.strokeStyle=col; ctx.lineWidth=2; ctx.lineCap='round'; ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
    c.onmouseup = c.onmouseleave = () => drawing=false;
    c.ontouchstart = e => { e.preventDefault(); drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
    c.ontouchmove = e => { e.preventDefault(); if(!drawing)return; const p=pos(e); ctx.strokeStyle='#111'; ctx.lineWidth=2; ctx.lineCap='round'; ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
    c.ontouchend = () => drawing=false;
  });
}

function clearCanvas(id) { const c=document.getElementById(id); if(!c)return; const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height); ctx.fillStyle='#fafaf8'; ctx.fillRect(0,0,c.width,c.height); }

function saveFromCanvas(type) {
  const mwId = parseInt(document.getElementById('sig-mw-select')?.value||0);
  if (!mwId) { Toast.show('Selecteer eerst een medewerker','warn'); return; }
  const c = document.getElementById(type==='hand'?'sig-canvas':'para-canvas');
  const data = c.toDataURL('image/png');
  const ht = DB.getHandtekening(mwId) || {};
  if (type==='hand') { DB.saveHandtekening(mwId, data, ht.paraaf||null); document.getElementById('hand-img').src=data; document.getElementById('hand-preview').classList.remove('hidden'); }
  else { DB.saveHandtekening(mwId, ht.hand||data, data); document.getElementById('para-img').src=data; document.getElementById('para-preview').classList.remove('hidden'); }
  Toast.show('Opgeslagen — automatisch in alle formulieren','success');
  App.updateBadges();
}

function handleSigUpload(type, e) {
  const mwId = parseInt(document.getElementById('sig-mw-select')?.value||0);
  if (!mwId) { Toast.show('Selecteer eerst een medewerker','warn'); return; }
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const data = ev.target.result;
    const ht = DB.getHandtekening(mwId) || {};
    if (type==='hand') { DB.saveHandtekening(mwId, data, ht.paraaf||null); document.getElementById('hand-img').src=data; document.getElementById('hand-preview').classList.remove('hidden'); document.getElementById('hand-upload-zone').classList.add('has-file'); document.getElementById('hand-upload-zone').innerHTML=`<i class="ti ti-check"></i><div>${file.name} geüpload</div>`; }
    else { DB.saveHandtekening(mwId, ht.hand||data, data); document.getElementById('para-img').src=data; document.getElementById('para-preview').classList.remove('hidden'); document.getElementById('para-upload-zone').classList.add('has-file'); document.getElementById('para-upload-zone').innerHTML=`<i class="ti ti-check"></i><div>${file.name} geüpload</div>`; }
    Toast.show('Opgeslagen — automatisch in alle formulieren','success');
    App.updateBadges();
  };
  reader.readAsDataURL(file);
}

function switchTab(type, tab) {
  document.getElementById(`${type}-teken`).classList.toggle('hidden', tab!=='teken');
  document.getElementById(`${type}-upload`).classList.toggle('hidden', tab!=='upload');
}

function saveInstelling(key, val) { const inst=DB.getInstellingen(); inst[key]=val; DB.saveInstellingen(inst); }

function slaInstellingenOp() {
  const inst = DB.getInstellingen();
  inst.bedrijfsnaam = document.getElementById('inst-bnaam')?.value || inst.bedrijfsnaam;
  inst.kvk = document.getElementById('inst-kvk')?.value || inst.kvk;
  inst.adres = document.getElementById('inst-adres')?.value || inst.adres;
  inst.vgmFunctionaris = document.getElementById('inst-vgm')?.value || inst.vgmFunctionaris;
  inst.vgmEmail = document.getElementById('inst-email')?.value || inst.vgmEmail;
  inst.sigDagen = parseInt(document.getElementById('inst-sigdagen')?.value || 30);
  inst.whatsappNr = document.getElementById('inst-wa')?.value || inst.whatsappNr;
  inst.sigSysteem = document.getElementById('inst-sys')?.checked ?? inst.sigSysteem;
  inst.sigEmail = document.getElementById('inst-mail')?.checked ?? inst.sigEmail;
  inst.sigWhatsapp = document.getElementById('inst-wa-cb')?.checked ?? inst.sigWhatsapp;
  DB.saveInstellingen(inst);
  Toast.show('Instellingen opgeslagen','success');
}

const Export = {
  csv() {
    const mws = DB.getMedewerkers();
    const rows = [['Naam','Categorie','Fase','Start','Opdrachtgever','Handtekening','Dossier%','VCA Status']];
    mws.forEach(mw => {
      const il = DB.getInlener(mw.inlenerId);
      rows.push([mwNaam(mw),mw.cat,mw.fase||'—',mw.start,il?.naam||'—',mw.heeftHandtekening?'Ja':'Nee',DB.dossierCompletie(mw.id),DB.getCertificaten(mw.id).length>0?'Ja':'Nee']);
    });
    const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`VCU_Compliance_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    Toast.show('CSV geëxporteerd','success');
  }
};
