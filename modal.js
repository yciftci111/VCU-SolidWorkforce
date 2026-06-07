// ── ALLE 16 VCU BIJLAGEN — volledig invulbare formulieren ──

const BijlagenForms = {

  // Render het formulier voor een specifieke bijlage
  render(nr, mwId) {
    const mw = DB.getMedewerker(mwId);
    const data = DB.getBijlage(mwId, nr);
    const d = data.data || {};
    const ht = DB.getHandtekening(mwId);

    const sigImg = (label) => ht?.hand
      ? `<div class="sig-field-wrap"><div class="sig-field-label">${label}</div><img src="${ht.hand}" class="sig-field-img"><div class="sig-field-name">${mwNaam(mw)}</div></div>`
      : `<div class="sig-field-wrap"><div class="sig-field-label">${label}</div><div class="sig-field-empty">Handtekening nog niet ingesteld</div></div>`;

    const jaNee = (id, label, val) => `
      <div class="jn-row">
        <span class="jn-label">${label}</span>
        <div class="jn-btns">
          <button class="jn-btn ${val===true?'jn-ja':''}" onclick="setJN('${id}',true,this)">Ja</button>
          <button class="jn-btn ${val===false?'jn-nee':''}" onclick="setJN('${id}',false,this)">Nee</button>
        </div>
      </div>`;

    const sterren = (id, label, val) => `
      <div class="jn-row">
        <span class="jn-label">${label}</span>
        <div class="ster-wrap" data-id="${id}">
          ${[1,2,3,4,5].map(n=>`<span class="ster ${(val||0)>=n?'ster-on':''}" onclick="setSter('${id}',${n},this.parentElement)">★</span>`).join('')}
        </div>
      </div>`;

    const fi = (id, label, val, type='text', placeholder='') => `
      <div class="form-group">
        <div class="form-label">${label}</div>
        <input type="${type}" class="form-input" id="bf-${id}" value="${H(val||'')}" placeholder="${placeholder}" onchange="setBF('${id}',this.value)">
      </div>`;

    const ta = (id, label, val, rows=3) => `
      <div class="form-group full">
        <div class="form-label">${label}</div>
        <textarea class="form-input" id="bf-${id}" rows="${rows}" onchange="setBF('${id}',this.value)">${H(val||'')}</textarea>
      </div>`;

    const forms = {

      // ── BIJLAGE 1: Directiebeoordeling ──────────────────
      1: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 1</div>
          <h2>Directiebeoordeling</h2>
          <p>Jaarlijkse evaluatie van het VGM-beleid — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Algemene gegevens</div>
          <div class="form-grid">
            ${fi('db_datum','Datum beoordeling',d.db_datum,'date')}
            ${fi('db_door','Uitgevoerd door',d.db_door||'S. Popovic')}
            ${fi('db_aantalMw','Aantal medewerkers',d.db_aantalMw,'number')}
            ${fi('db_periode','Beoordelingsperiode',d.db_periode,'text','bijv. 2024-2025')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Bevindingen</div>
          <div class="form-grid">
            ${ta('db_bevindingen','Bevindingen VGM-beleid',d.db_bevindingen,4)}
            ${ta('db_incidenten','Overzicht incidenten afgelopen periode',d.db_incidenten,3)}
            ${ta('db_audits','Auditresultaten',d.db_audits,3)}
            ${ta('db_acties','Verbetermaatregelen / actiepunten',d.db_acties,3)}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Certificaten & compliance</div>
          <div class="form-grid">
            ${ta('db_certs','Status certificaten (VCA, NEN4400, VCU-VIL)',d.db_certs,3)}
            ${fi('db_volgend','Volgende beoordeling gepland op',d.db_volgend,'date')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Ondertekening</div>
          <div class="sig-row">
            ${sigImg('Directeur — Mümin Özer')}
            ${sigImg('VGM-functionaris — S. Popovic')}
          </div>
        </div>`,

      // ── BIJLAGE 2: Interne Audit ─────────────────────────
      2: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 2</div>
          <h2>Interne Audit</h2>
          <p>Interne Auditrapportage VCU — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Auditgegevens</div>
          <div class="form-grid">
            ${fi('ia_datum','Datum audit',d.ia_datum,'date')}
            ${fi('ia_door','Uitgevoerd door',d.ia_door||'S. Popovic')}
            ${fi('ia_type','Type audit',d.ia_type||'Nulmeting')}
            ${fi('ia_doel','Doel',d.ia_doel||'Nulmeting ter voorbereiding op VCU-certificering')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Controlepunten</div>
          ${jaNee('ia_vgmbeleid','VGM-beleid aanwezig en gedocumenteerd',d.ia_vgmbeleid)}
          ${jaNee('ia_procedures','Operationele procedures aanwezig',d.ia_procedures)}
          ${jaNee('ia_incidentreg','Incidentenregistratie op orde',d.ia_incidentreg)}
          ${jaNee('ia_training','Medewerkers VCU-getraind',d.ia_training)}
          ${jaNee('ia_pbm','PBM-beleid geïmplementeerd',d.ia_pbm)}
          ${jaNee('ia_docs','Essentiële documenten aanwezig (RI&E, instructies)',d.ia_docs)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Bevindingen & Acties</div>
          <div class="form-grid">
            ${ta('ia_bevindingen','Bevindingen',d.ia_bevindingen,4)}
            ${ta('ia_acties','Actiepunten',d.ia_acties,3)}
            ${ta('ia_conclusie','Conclusie',d.ia_conclusie,3)}
            ${fi('ia_volgend','Volgende audit gepland',d.ia_volgend,'date')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Ondertekening</div>
          <div class="sig-row">
            ${sigImg('Auditor')}
            ${sigImg('Directie')}
          </div>
        </div>`,

      // ── BIJLAGE 3: NEN4400 Certificaat ──────────────────
      3: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 3</div>
          <h2>NEN4400 Certificaat</h2>
          <p>Erkenning normering arbeid — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Certificaatgegevens</div>
          <div class="form-grid">
            ${fi('nen_nr','Certificaatnummer',d.nen_nr)}
            ${fi('nen_van','Geldig vanaf',d.nen_van,'date')}
            ${fi('nen_tot','Geldig tot',d.nen_tot,'date')}
            ${fi('nen_instelling','Afgegeven door',d.nen_instelling||'SNA (Stichting Normering Arbeid)')}
            ${fi('nen_norm','Norm',d.nen_norm||'NEN 4400-1')}
            ${fi('nen_register','Opgenomen in register',d.nen_register||'Register Normering Arbeid')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Status</div>
          ${jaNee('nen_geldig','Certificaat actueel en geldig',d.nen_geldig)}
          ${jaNee('nen_inspectie','Laatste inspectie geslaagd',d.nen_inspectie)}
          <div class="form-grid mt2">
            ${fi('nen_inspDatum','Datum laatste inspectie',d.nen_inspDatum,'date')}
            ${fi('nen_volgend','Volgende inspectie',d.nen_volgend,'date')}
            ${ta('nen_opm','Opmerkingen',d.nen_opm,2)}
          </div>
        </div>`,

      // ── BIJLAGE 4: Beleidsverklaring ────────────────────
      4: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 4</div>
          <h2>Beleidsverklaring</h2>
          <p>VGM-beleidsverklaring — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Beleidsverklaring</div>
          <div class="beleids-tekst">
            Solid Workforce B.V. streeft naar een veilige en gezonde werkomgeving voor zowel medewerkers als uitzendkrachten. Wij voldoen aan alle relevante wet- en regelgeving, waaronder de VCU-richtlijnen. Ons doel is het voorkomen van ongevallen, incidenten en gezondheidsrisico's door een actieve veiligheids- en gezondheidscultuur te bevorderen en ons veiligheidsmanagementsysteem continu te verbeteren.
          </div>
          <div class="form-grid mt3">
            ${fi('bv_datum','Datum',d.bv_datum||'2025-02-19','date')}
            ${fi('bv_locatie','Locatie',d.bv_locatie||'Rotterdam')}
            ${ta('bv_aanvulling','Aanvullende bepalingen / wijzigingen',d.bv_aanvulling,3)}
            ${fi('bv_herziend','Jaarlijks herzien op',d.bv_herziend,'date')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Ondertekening Directie</div>
          <div class="sig-row">
            <div class="sig-field-wrap">
              <div class="sig-field-label">Mümin Özer — Directeur</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">Handtekening instellen</div>'}
              <div class="form-group mt2"><div class="form-label">Datum</div><input type="date" class="form-input" id="bf-bv_datumDir" value="${H(d.bv_datumDir||'')}" onchange="setBF('bv_datumDir',this.value)"></div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">S. Popovic — Directeur</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">Handtekening instellen</div>'}
              <div class="form-group mt2"><div class="form-label">Datum</div><input type="date" class="form-input" id="bf-bv_datumVgm" value="${H(d.bv_datumVgm||'')}" onchange="setBF('bv_datumVgm',this.value)"></div>
            </div>
          </div>
        </div>`,

      // ── BIJLAGE 5: VGM-certificaat ──────────────────────
      5: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 5</div>
          <h2>VGM-certificaat</h2>
          <p>VCU-VIL certificaat VGM-functionaris — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Certificaathouder</div>
          <div class="form-grid">
            ${fi('vgm_naam','Naam certificaathouder',d.vgm_naam||'S. Popovic')}
            ${fi('vgm_type','Type certificaat',d.vgm_type||'VCU-VIL')}
            ${fi('vgm_nr','Diplomanummer',d.vgm_nr||'1878770.05741504')}
            ${fi('vgm_van','Geldig vanaf',d.vgm_van,'date')}
            ${fi('vgm_tot','Geldig tot',d.vgm_tot||'2035-02-13','date')}
            ${fi('vgm_instelling','Afgegeven door',d.vgm_instelling)}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Status</div>
          ${jaNee('vgm_geldig','Certificaat actueel en geldig',d.vgm_geldig)}
          ${jaNee('vgm_aanwezig','Certificaat aanwezig in dossier',d.vgm_aanwezig)}
          ${ta('vgm_opm','Opmerkingen',d.vgm_opm,2)}
        </div>`,

      // ── BIJLAGE 6: MVK Diploma ──────────────────────────
      6: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 6</div>
          <h2>MVK Diploma's</h2>
          <p>Middelbare Veiligheidskundige — externe MVK'er Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">MVK-gegevens</div>
          <div class="form-grid">
            ${fi('mvk_naam','Naam MVK-functionaris',d.mvk_naam)}
            ${fi('mvk_bureau','Bureau / organisatie',d.mvk_bureau)}
            ${fi('mvk_diploma','Diplomatype',d.mvk_diploma||'MVK (Middelbare Veiligheidskundige)')}
            ${fi('mvk_nr','Diplomanummer',d.mvk_nr)}
            ${fi('mvk_van','Geldig vanaf',d.mvk_van,'date')}
            ${fi('mvk_tot','Geldig tot',d.mvk_tot,'date')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Overeenkomst</div>
          ${jaNee('mvk_overeenkomst','Samenwerkingsovereenkomst aanwezig',d.mvk_overeenkomst)}
          ${jaNee('mvk_geldig','Diploma geldig en actueel',d.mvk_geldig)}
          <div class="form-grid mt2">
            ${fi('mvk_datum','Datum overeenkomst',d.mvk_datum,'date')}
            ${ta('mvk_opm','Opmerkingen / taakomschrijving',d.mvk_opm,3)}
          </div>
        </div>`,

      // ── BIJLAGE 7: Organogram ───────────────────────────
      7: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 7</div>
          <h2>Organogram & Intercedent</h2>
          <p>Organisatiestructuur en rol intercedent — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Organisatiestructuur</div>
          <div class="organogram">
            <div class="org-box org-top">Directie<br><small>Mümin Özer</small></div>
            <div class="org-line"></div>
            <div class="org-mid-row">
              <div class="org-box">VGM-functionaris<br><small>S. Popovic</small></div>
              <div class="org-box">Intercedent<br><small>${mw?mwNaam(mw):'—'}</small></div>
            </div>
            <div class="org-line"></div>
            <div class="org-box org-bottom">Uitzendkrachten</div>
          </div>
          <div class="form-grid mt3">
            ${fi('org_directeur','Naam directeur',d.org_directeur||'Mümin Özer')}
            ${fi('org_vgm','Naam VGM-functionaris',d.org_vgm||'S. Popovic')}
            ${fi('org_intercedent','Naam intercedent',d.org_intercedent||mwNaam(mw))}
            ${fi('org_datum','Datum organogram',d.org_datum,'date')}
            ${ta('org_taken','Taken & verantwoordelijkheden intercedent',d.org_taken||'Werving & selectie, voorlichting, begeleiding & controle, evaluaties',3)}
          </div>
        </div>`,

      // ── BIJLAGE 8: Bedrijfsvoorlichting ─────────────────
      8: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 8</div>
          <h2>Bedrijfsvoorlichting</h2>
          <p>Voorlichting nieuwe medewerker bij aanvang — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Medewerkergegevens</div>
          <div class="form-grid">
            ${fi('bvl_naam','Naam medewerker',d.bvl_naam||mwNaam(mw))}
            ${fi('bvl_datum','Datum voorlichting',d.bvl_datum,'date')}
            ${fi('bvl_locatie','Locatie',d.bvl_locatie||'Rivium 2E Straat, 2909 LG Capelle aan den IJssel')}
            ${fi('bvl_functie','Functie',d.bvl_functie||mw?.functie||'')}
            ${fi('bvl_opdrachtgever','Opdrachtgever',d.bvl_opdrachtgever||DB.getInlener(mw?.inlenerId)?.naam||'')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Onderwerpen besproken</div>
          ${jaNee('bvl_org','Kennismaking organisatie & VCU-richtlijnen',d.bvl_org)}
          ${jaNee('bvl_risicos','Werkplekrisico\'s besproken',d.bvl_risicos)}
          ${jaNee('bvl_pbm','PBM\'s uitgelegd en verstrekt',d.bvl_pbm)}
          ${jaNee('bvl_incident','Incidentmeldingsprocedure uitgelegd',d.bvl_incident)}
          ${jaNee('bvl_rechten','Rechten & plichten besproken',d.bvl_rechten)}
          ${jaNee('bvl_medisch','Medische geschiktheid besproken',d.bvl_medisch)}
          ${jaNee('bvl_contact','Contactgegevens intercedent/VGM verstrekt',d.bvl_contact)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Ondertekening</div>
          <div class="sig-row">
            <div class="sig-field-wrap">
              <div class="sig-field-label">Handtekening medewerker</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">Handtekening instellen via menu</div>'}
              <div class="sig-field-name">${mwNaam(mw)}</div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">Handtekening Solid Workforce B.V.</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">—</div>'}
              <div class="sig-field-name">Mümin Özer — Directeur</div>
            </div>
          </div>
        </div>`,

      // ── BIJLAGE 9: Overlegverslagen ─────────────────────
      9: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 9</div>
          <h2>Overlegverslagen</h2>
          <p>VGM-overlegverslag — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Vergadergegevens</div>
          <div class="form-grid">
            ${fi('ov_nr','Vergadernummer',d.ov_nr||'1','number')}
            ${fi('ov_datum','Datum',d.ov_datum,'date')}
            ${fi('ov_tijd','Tijdstip',d.ov_tijd,'time')}
            ${fi('ov_locatie','Locatie',d.ov_locatie||'Rivium 2E Straat, 2909 LG Capelle aan den IJssel')}
            ${ta('ov_aanwezig','Aanwezigen',d.ov_aanwezig||'Mümin Özer (Directeur), S. Popovic (Intercedent)',2)}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Agendapunten & Besluiten</div>
          <div class="form-grid">
            ${ta('ov_agenda','Agendapunten',d.ov_agenda,4)}
            ${ta('ov_beslissingen','Beslissingen / besluiten',d.ov_beslissingen,3)}
            ${ta('ov_acties','Actiepunten',d.ov_acties,3)}
            ${fi('ov_volgend','Volgende vergadering',d.ov_volgend,'date')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Voor akkoord</div>
          <div class="sig-row">
            <div class="sig-field-wrap">
              <div class="sig-field-label">Directeur — Mümin Özer</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">—</div>'}
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-ov_datumDir" value="${H(d.ov_datumDir||'')}" onchange="setBF('ov_datumDir',this.value)"></div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">Notulist — S. Popovic</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">—</div>'}
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-ov_datumNot" value="${H(d.ov_datumNot||'')}" onchange="setBF('ov_datumNot',this.value)"></div>
            </div>
          </div>
        </div>`,

      // ── BIJLAGE 10: Medewerkersdossier ──────────────────
      10: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 10</div>
          <h2>Medewerkersdossier</h2>
          <p>Vereiste documenten & checklist — ${mwNaam(mw)}</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Persoonsgegevens</div>
          <div class="form-grid">
            ${fi('md_naam','Naam',d.md_naam||mwNaam(mw))}
            ${fi('md_geb','Geboortedatum',d.md_geb,'date')}
            ${fi('md_functie','Functie',d.md_functie||mw?.functie)}
            ${fi('md_start','Startdatum',d.md_start||mw?.start,'date')}
            ${fi('md_opdrachtgever','Opdrachtgever',d.md_opdrachtgever||DB.getInlener(mw?.inlenerId)?.naam||'')}
            ${fi('md_contracttype','Contracttype',d.md_contracttype)}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Vereiste documenten</div>
          ${jaNee('md_id','Identiteitsbewijs gecontroleerd',d.md_id)}
          ${jaNee('md_vcu','VCU-voorlichting ontvangen',d.md_vcu)}
          ${jaNee('md_contract','Arbeidscontract ondertekend',d.md_contract)}
          ${jaNee('md_medisch','Medische keuring (indien van toepassing)',d.md_medisch)}
          ${jaNee('md_pbm','Persoonlijke beschermingsmiddelen verstrekt',d.md_pbm)}
          ${jaNee('md_vca','VCA-certificaat (indien van toepassing)',d.md_vca)}
          ${jaNee('md_certs','Specifieke certificaten/opleidingen aanwezig',d.md_certs)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Opmerkingen</div>
          <div class="form-grid">
            ${ta('md_opm','Opmerkingen',d.md_opm,3)}
          </div>
        </div>`,

      // ── BIJLAGE 11: Informatieoverdracht ────────────────
      11: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 11</div>
          <h2>Informatieoverdracht</h2>
          <p>Bewijs informatieoverdracht nieuwe medewerker — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Gegevens</div>
          <div class="form-grid">
            ${fi('io_datum','Datum',d.io_datum,'date')}
            ${fi('io_naam','Naam medewerker',d.io_naam||mwNaam(mw))}
            ${fi('io_functie','Functie',d.io_functie||mw?.functie)}
            ${fi('io_start','Startdatum',d.io_start||mw?.start,'date')}
            ${fi('io_opdrachtgever','Opdrachtgever',d.io_opdrachtgever||DB.getInlener(mw?.inlenerId)?.naam||'')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Overgedragen informatie</div>
          ${jaNee('io_veilig','Veiligheidsvoorschriften',d.io_veilig)}
          ${jaNee('io_pbm','PBM\'s uitgelegd',d.io_pbm)}
          ${jaNee('io_vcu','VCU-regels',d.io_vcu)}
          ${jaNee('io_incident','Incidentmeldingen procedure',d.io_incident)}
          ${jaNee('io_werkplek','Werkplek & Calamiteiten',d.io_werkplek)}
          ${jaNee('io_verantw','Verantwoordelijkheden',d.io_verantw)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">PBM's verstrekt</div>
          ${jaNee('io_schoenen','Veiligheidsschoenen',d.io_schoenen)}
          ${jaNee('io_helm','Helm',d.io_helm)}
          ${jaNee('io_gehoor','Gehoorbescherming',d.io_gehoor)}
          ${jaNee('io_handsch','Handschoenen',d.io_handsch)}
          <div class="form-group full mt2">
            <div class="form-label">Overige PBM's verstrekt</div>
            <input class="form-input" id="bf-io_overige" value="${H(d.io_overige||'')}" onchange="setBF('io_overige',this.value)" placeholder="omschrijving overige PBM's">
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Verklaringen & Handtekeningen</div>
          <div class="sig-row">
            <div class="sig-field-wrap">
              <div class="sig-field-label">Handtekening medewerker</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">Handtekening instellen via menu</div>'}
              <div class="sig-field-name">${mwNaam(mw)}</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-io_datumMw" value="${H(d.io_datumMw||'')}" onchange="setBF('io_datumMw',this.value)"></div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">Handtekening intercedent/VGM</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">—</div>'}
              <div class="sig-field-name">S. Popovic — VGM-functionaris</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-io_datumVgm" value="${H(d.io_datumVgm||'')}" onchange="setBF('io_datumVgm',this.value)"></div>
            </div>
          </div>
        </div>`,

      // ── BIJLAGE 12: Controle Afspraken ──────────────────
      12: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 12</div>
          <h2>Controle Afspraken</h2>
          <p>Bewijs controle op gemaakte afspraken — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Gegevens</div>
          <div class="form-grid">
            ${fi('ca_datum','Datum controle',d.ca_datum,'date')}
            ${fi('ca_naam','Naam medewerker',d.ca_naam||mwNaam(mw))}
            ${fi('ca_functie','Functie',d.ca_functie||mw?.functie)}
            ${fi('ca_start','Startdatum',d.ca_start||mw?.start,'date')}
            ${fi('ca_opdrachtgever','Opdrachtgever',d.ca_opdrachtgever||DB.getInlener(mw?.inlenerId)?.naam||'')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Controlepunten</div>
          ${jaNee('ca_veilig','Veiligheidsinstructies opgevolgd',d.ca_veilig)}
          ${jaNee('ca_pbm','Vereiste PBM\'s gedragen',d.ca_pbm)}
          ${jaNee('ca_incident','Incidenten of bijna-ongevallen gemeld',d.ca_incident)}
          ${jaNee('ca_onveilig','Onveilige situaties gemeld',d.ca_onveilig)}
          ${jaNee('ca_tijd','Op tijd op het werk',d.ca_tijd)}
          ${jaNee('ca_taken','Taken volgens instructies uitgevoerd',d.ca_taken)}
          ${jaNee('ca_vragen','Aanvullende vragen of opmerkingen',d.ca_vragen)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Evaluatiegesprek</div>
          <div class="form-grid">
            ${fi('ca_datumGesprek','Datum gesprek',d.ca_datumGesprek,'date')}
            ${ta('ca_verbeter','Verbeterpunten',d.ca_verbeter,3)}
            ${ta('ca_acties','Actiepunten',d.ca_acties,3)}
            ${ta('ca_opmMw','Opmerkingen medewerker',d.ca_opmMw,2)}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Handtekeningen</div>
          <div class="sig-row">
            <div class="sig-field-wrap">
              <div class="sig-field-label">Handtekening medewerker</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">Handtekening instellen via menu</div>'}
              <div class="sig-field-name">${mwNaam(mw)}</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-ca_datumMw" value="${H(d.ca_datumMw||'')}" onchange="setBF('ca_datumMw',this.value)"></div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">Handtekening intercedent/VGM</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">—</div>'}
              <div class="sig-field-name">S. Popovic</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-ca_datumVgm" value="${H(d.ca_datumVgm||'')}" onchange="setBF('ca_datumVgm',this.value)"></div>
            </div>
          </div>
        </div>`,

      // ── BIJLAGE 13: Evaluatie Inleners ──────────────────
      13: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 13</div>
          <h2>Evaluatie Inleners / Uitzendkrachten</h2>
          <p>Periodieke evaluatie — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Gegevens</div>
          <div class="form-grid">
            ${fi('ev_datum','Datum',d.ev_datum,'date')}
            ${fi('ev_uk','Naam uitzendkracht',d.ev_uk||mwNaam(mw))}
            ${fi('ev_functie','Functie',d.ev_functie||mw?.functie)}
            ${fi('ev_opdrachtgever','Opdrachtgever',d.ev_opdrachtgever||DB.getInlener(mw?.inlenerId)?.naam||'')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">1. Evaluatie door Inlener</div>
          ${sterren('ev_inlVeilig','Veiligheidsvoorschriften',d.ev_inlVeilig)}
          ${sterren('ev_inlPBM','PBM\'s gebruik',d.ev_inlPBM)}
          ${sterren('ev_inlKwal','Kwaliteit werk',d.ev_inlKwal)}
          ${sterren('ev_inlWerk','Werkhouding',d.ev_inlWerk)}
          ${jaNee('ev_inlTevreden','Tevreden — samenwerking voortzetten',d.ev_inlTevreden)}
          ${ta('ev_inlOpm','Opmerkingen inlener',d.ev_inlOpm,2)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">2. Evaluatie door Uitzendkracht</div>
          ${sterren('ev_ukInstr','Instructies duidelijk',d.ev_ukInstr)}
          ${sterren('ev_ukBegeleid','Begeleiding',d.ev_ukBegeleid)}
          ${sterren('ev_ukSfeer','Werksfeer',d.ev_ukSfeer)}
          ${jaNee('ev_ukTevreden','Tevreden — wil blijven werken',d.ev_ukTevreden)}
          ${ta('ev_ukOpm','Opmerkingen uitzendkracht',d.ev_ukOpm,2)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">3. Actiepunten</div>
          ${jaNee('ev_acties','Verbetermaatregelen nodig',d.ev_acties)}
          ${ta('ev_actiesOmschr','Acties (indien van toepassing)',d.ev_actiesOmschr,2)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">4. Handtekeningen</div>
          <div class="sig-row sig-row-3">
            <div class="sig-field-wrap">
              <div class="sig-field-label">Inlener</div>
              <div class="sig-field-empty" style="height:50px;"></div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-ev_datumInl" value="${H(d.ev_datumInl||'')}" onchange="setBF('ev_datumInl',this.value)"></div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">Uitzendkracht</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty" style="height:50px;"></div>'}
              <div class="sig-field-name">${mwNaam(mw)}</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-ev_datumUK" value="${H(d.ev_datumUK||'')}" onchange="setBF('ev_datumUK',this.value)"></div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">Intercedent</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty" style="height:50px;"></div>'}
              <div class="sig-field-name">S. Popovic</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-ev_datumInt" value="${H(d.ev_datumInt||'')}" onchange="setBF('ev_datumInt',this.value)"></div>
            </div>
          </div>
        </div>`,

      // ── BIJLAGE 14: Melding Incidenten ───────────────────
      14: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 14</div>
          <h2>Melding Incidenten</h2>
          <p>Procedure melding & registratie (bijna-)ongevallen — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Incidentgegevens</div>
          <div class="form-grid">
            ${fi('mi_datum','Datum incident',d.mi_datum,'date')}
            ${fi('mi_tijdstip','Tijdstip',d.mi_tijdstip,'time')}
            ${fi('mi_locatie','Locatie',d.mi_locatie)}
            ${fi('mi_melder','Melder',d.mi_melder||mwNaam(mw))}
            ${fi('mi_getuigen','Getuigen',d.mi_getuigen)}
            ${fi('mi_verantw','Verantwoordelijke',d.mi_verantw||'S. Popovic')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Beschrijving</div>
          ${ta('mi_beschrijving','Beschrijving van het incident',d.mi_beschrijving,4)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Gevolgen</div>
          ${jaNee('mi_letsel','Lichamelijk letsel',d.mi_letsel)}
          ${jaNee('mi_schade','Materiële schade',d.mi_schade)}
          ${jaNee('mi_werkunderbr','Werkonderbreking',d.mi_werkunderbr)}
          ${jaNee('mi_bijna','Bijna-ongeval',d.mi_bijna)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Oorzaak</div>
          ${jaNee('mi_menselijk','Menselijke fout',d.mi_menselijk)}
          ${jaNee('mi_technisch','Technisch falen',d.mi_technisch)}
          ${jaNee('mi_omgeving','Omgevingsfactoren',d.mi_omgeving)}
          ${jaNee('mi_instructies','Onvoldoende instructies',d.mi_instructies)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Acties & Maatregelen</div>
          ${jaNee('mi_veilig','Situatie veiliggesteld',d.mi_veilig)}
          ${jaNee('mi_hulp','Hulpdiensten ingeschakeld',d.mi_hulp)}
          ${jaNee('mi_onderzoek','Onderzoek uitgevoerd',d.mi_onderzoek)}
          ${jaNee('mi_maatregelen','Maatregelen genomen',d.mi_maatregelen)}
          ${ta('mi_maatregelenOmschr','Omschrijving maatregelen',d.mi_maatregelenOmschr,3)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Handtekeningen</div>
          <div class="sig-row">
            <div class="sig-field-wrap">
              <div class="sig-field-label">Melder</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">Handtekening instellen</div>'}
              <div class="sig-field-name">${mwNaam(mw)}</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-mi_datumMelder" value="${H(d.mi_datumMelder||'')}" onchange="setBF('mi_datumMelder',this.value)"></div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">VGM-functionaris</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">—</div>'}
              <div class="sig-field-name">S. Popovic</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-mi_datumVgm" value="${H(d.mi_datumVgm||'')}" onchange="setBF('mi_datumVgm',this.value)"></div>
            </div>
          </div>
        </div>`,

      // ── BIJLAGE 15: Medische Geschiktheid ───────────────
      15: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 15</div>
          <h2>Overleg Medische Geschiktheid</h2>
          <p>Overleg medische geschiktheid uitzendkrachten — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Gegevens</div>
          <div class="form-grid">
            ${fi('mg_datum','Datum overleg',d.mg_datum,'date')}
            ${fi('mg_inlener','Inlener',d.mg_inlener||DB.getInlener(mw?.inlenerId)?.naam||'')}
            ${fi('mg_functie','Functie uitzendkracht',d.mg_functie||mw?.functie)}
            ${fi('mg_naam','Naam uitzendkracht',d.mg_naam||mwNaam(mw))}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Beoordeling</div>
          ${jaNee('mg_keuringVereist','Medische keuring vereist voor functie',d.mg_keuringVereist)}
          ${jaNee('mg_keuringUitgev','Keuring uitgevoerd',d.mg_keuringUitgev)}
          ${jaNee('mg_geschikt','Geschikt voor functie',d.mg_geschikt)}
          ${jaNee('mg_beperkt','Beperkt geschikt (aanpassingen nodig)',d.mg_beperkt)}
          ${ta('mg_aanpassingen','Benodigde aanpassingen',d.mg_aanpassingen,2)}
          ${ta('mg_opm','Opmerkingen',d.mg_opm,3)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Handtekeningen</div>
          <div class="sig-row">
            <div class="sig-field-wrap">
              <div class="sig-field-label">Inlener</div>
              <div class="sig-field-empty" style="height:50px;"></div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-mg_datumInl" value="${H(d.mg_datumInl||'')}" onchange="setBF('mg_datumInl',this.value)"></div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">Intercedent</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">—</div>'}
              <div class="sig-field-name">S. Popovic</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-mg_datumInt" value="${H(d.mg_datumInt||'')}" onchange="setBF('mg_datumInt',this.value)"></div>
            </div>
          </div>
        </div>`,

      // ── BIJLAGE 16: Blootstellingsrisico's ─────────────
      16: `
        <div class="bijlage-header">
          <div class="bijlage-badge">Bijlage 16</div>
          <h2>Blootstellingsrisico's & PMO</h2>
          <p>Periodiek Medisch Onderzoek — Solid Workforce B.V.</p>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Gegevens</div>
          <div class="form-grid">
            ${fi('bl_datum','Datum',d.bl_datum,'date')}
            ${fi('bl_naam','Naam uitzendkracht',d.bl_naam||mwNaam(mw))}
            ${fi('bl_functie','Functie',d.bl_functie||mw?.functie)}
            ${fi('bl_inlener','Inlener',d.bl_inlener||DB.getInlener(mw?.inlenerId)?.naam||'')}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Blootstellingsrisico's</div>
          ${jaNee('bl_stoffen','Gevaarlijke stoffen',d.bl_stoffen)}
          ${jaNee('bl_fysiek','Fysieke belasting',d.bl_fysiek)}
          ${jaNee('bl_lawaai','Lawaai (>85 dB)',d.bl_lawaai)}
          ${jaNee('bl_trillingen','Trillingen',d.bl_trillingen)}
          ${jaNee('bl_straling','Straling',d.bl_straling)}
          ${jaNee('bl_temp','Extreme temperaturen',d.bl_temp)}
          ${ta('bl_overige','Overige risico\'s',d.bl_overige,2)}
        </div>
        <div class="bf-section">
          <div class="bf-section-title">PMO</div>
          ${jaNee('bl_pmoVereist','PMO vereist voor deze functie',d.bl_pmoVereist)}
          ${jaNee('bl_pmoUitgev','PMO uitgevoerd',d.bl_pmoUitgev)}
          <div class="form-grid mt2">
            ${fi('bl_pmoDatum','Datum PMO',d.bl_pmoDatum,'date')}
            ${fi('bl_pmoVolgend','Volgend PMO',d.bl_pmoVolgend,'date')}
            ${ta('bl_opm','Opmerkingen',d.bl_opm,3)}
          </div>
        </div>
        <div class="bf-section">
          <div class="bf-section-title">Handtekeningen</div>
          <div class="sig-row">
            <div class="sig-field-wrap">
              <div class="sig-field-label">Inlener</div>
              <div class="sig-field-empty" style="height:50px;"></div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-bl_datumInl" value="${H(d.bl_datumInl||'')}" onchange="setBF('bl_datumInl',this.value)"></div>
            </div>
            <div class="sig-field-wrap">
              <div class="sig-field-label">Intercedent</div>
              ${ht?.hand?`<img src="${ht.hand}" class="sig-field-img">`:'<div class="sig-field-empty">—</div>'}
              <div class="sig-field-name">S. Popovic</div>
              <div class="form-group mt2"><input type="date" class="form-input" id="bf-bl_datumInt" value="${H(d.bl_datumInt||'')}" onchange="setBF('bl_datumInt',this.value)"></div>
            </div>
          </div>
        </div>`
    };

    return forms[nr] || `<div class="alert alert-warn"><i class="ti ti-alert-triangle"></i>Formulier ${nr} niet gevonden.</div>`;
  }
};

// ── GLOBALE BIJLAGE FUNCTIES ──
let _currentBijlageMwId = 0;
let _currentBijlageNr = 0;
let _currentBijlageData = {};

function openBijlageFormulier(mwId, nr) {
  _currentBijlageMwId = mwId;
  _currentBijlageNr = nr;
  const bestaand = DB.getBijlage(mwId, nr);
  _currentBijlageData = bestaand.data ? {...bestaand.data} : {};

  const mw = DB.getMedewerker(mwId);
  const html = BijlagenForms.render(nr, mwId);

  document.getElementById('modal-box').innerHTML = `
    <div class="modal-hdr">
      <div class="modal-title">${BIJLAGEN[nr-1]}</div>
      <button class="modal-close" onclick="Modal.close()"><i class="ti ti-x"></i></button>
    </div>
    <div class="bijlage-form-wrap">${html}</div>
    <div class="flex gap2 mt3" style="justify-content:flex-end;flex-wrap:wrap;">
      <button class="btn" onclick="Print.bijlage(${mwId},${nr})"><i class="ti ti-printer"></i>Afdrukken</button>
      <button class="btn" onclick="Modal.close()">Annuleren</button>
      <button class="btn btn-primary" onclick="slaanBijlageOp()"><i class="ti ti-check"></i>Opslaan als compleet</button>
    </div>`;
  document.getElementById('modal-overlay').classList.add('open');
}

function setBF(key, val) {
  _currentBijlageData[key] = val;
}

function setJN(id, val, btn) {
  _currentBijlageData[id] = val;
  const wrap = btn.closest('.jn-btns');
  wrap.querySelectorAll('.jn-btn').forEach(b => b.classList.remove('jn-ja','jn-nee'));
  btn.classList.add(val ? 'jn-ja' : 'jn-nee');
}

function setSter(id, val, wrap) {
  _currentBijlageData[id] = val;
  wrap.querySelectorAll('.ster').forEach((s,i) => s.classList.toggle('ster-on', i < val));
}

function slaanBijlageOp() {
  DB.saveBijlage(_currentBijlageMwId, _currentBijlageNr, {
    compleet: true,
    data: _currentBijlageData
  });
  Modal.close();
  Toast.show(`Bijlage ${_currentBijlageNr} opgeslagen als compleet`, 'success');
  App.updateBadges();
  // Herlaad huidige pagina
  if (App.currentPage === 'bijlagen') renderBijlagenGrid(_currentBijlageMwId);
  if (App.currentPage === 'dossier') loadDossier(_currentBijlageMwId);
}
