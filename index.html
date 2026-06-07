// ── DATA LAAG — opslaan in localStorage + export naar JSON ──

const DB = {
  // Standaard structuur
  defaults: {
    medewerkers: [
      {id:1,voornaam:"Harun",achternaam:"Aktas",bsn:"***6782",cat:"Eigen",fase:null,start:"2025-01-01",functie:"Intercedent",email:"h.aktas@solidworkforce.nl",telefoon:"+31612345678",inlenerId:1,heeftHandtekening:true,idGecontroleerd:true,vcuVoorlichting:true,actief:true},
      {id:2,voornaam:"Ahmed",achternaam:"Yilmaz",bsn:"***3341",cat:"Uitzend",fase:1,start:"2025-02-03",functie:"Bouwvakker",email:"a.yilmaz@email.nl",telefoon:"+31687654321",inlenerId:1,heeftHandtekening:false,idGecontroleerd:true,vcuVoorlichting:true,actief:true},
      {id:3,voornaam:"Piotr",achternaam:"Kowalski",bsn:"***9921",cat:"Uitzend",fase:2,start:"2025-02-10",functie:"Monteur",email:"p.kowalski@email.nl",telefoon:"+31611223344",inlenerId:1,heeftHandtekening:true,idGecontroleerd:true,vcuVoorlichting:true,actief:true},
      {id:4,voornaam:"Maria",achternaam:"Jansen",bsn:"***5514",cat:"Uitzend",fase:3,start:"2025-01-15",functie:"Logistiek medewerker",email:"m.jansen@email.nl",telefoon:"+31655443322",inlenerId:2,heeftHandtekening:true,idGecontroleerd:true,vcuVoorlichting:true,actief:true},
      {id:5,voornaam:"Bogdan",achternaam:"Ionescu",bsn:"***7723",cat:"Uitzend",fase:1,start:"2025-02-20",functie:"Bouwvakker",email:"b.ionescu@email.nl",telefoon:"+31699887766",inlenerId:1,heeftHandtekening:false,idGecontroleerd:true,vcuVoorlichting:false,actief:true}
    ],
    inleners: [
      {id:1,naam:"Voorbeeld Bouw B.V.",kvk:"12345678",contact:"Jan de Vries",email:"j.devries@voorbeeldbouw.nl",telefoon:"+31101234567",sector:"Bouw",actief:true},
      {id:2,naam:"Logistiek XL",kvk:"87654321",contact:"Maria Smit",email:"m.smit@logistiekxl.nl",telefoon:"+31209876543",sector:"Logistiek",actief:true}
    ],
    bijlagen: {},   // { mwId: { nr: { compleet, datum, data } } }
    certificaten: [
      {id:1,mwId:1,naam:"VCA Basis",nummer:"VCA-2024-001",geldigVanaf:"2024-07-01",geldigTot:"2025-07-01",bestand:null,sigVerzonden:false},
      {id:2,mwId:3,naam:"VCA Basis",nummer:"VCA-2024-033",geldigVanaf:"2024-11-20",geldigTot:"2025-11-20",bestand:null,sigVerzonden:false},
      {id:3,mwId:4,naam:"VCA VOL",nummer:"VCA-2023-099",geldigVanaf:"2023-05-05",geldigTot:"2028-05-05",bestand:null,sigVerzonden:false}
    ],
    handtekeningen: {},  // { mwId: { hand: dataURL, paraaf: dataURL, datum } }
    incidenten: [
      {id:1,mwId:1,inlenerId:1,datum:"2025-02-13",tijdstip:"09:30",locatie:"Bouwlocatie Rotterdam",type:"Bijna-ongeval",beschrijving:"Instabiele ladder op werklocatie",letsel:false,schade:false,status:"Open",melder:"Harun Aktas"}
    ],
    evaluaties: [
      {id:1,mwId:1,inlenerId:1,datum:"2025-02-13",scoreVeiligheid:4,scorePBM:4,scoreKwaliteit:5,scoreWerkhouding:4,inlenerTevreden:true,ukTevreden:true,verbeterpunten:"",acties:""}
    ],
    signaleringen: [],
    overlegverslagen: [
      {id:1,nummer:1,datum:"2025-02-13",tijd:"10:00",locatie:"Rivium 2E Straat, Capelle a/d IJssel",aanwezig:"Mümin Özer, Sasa Popovic, Harun Aktas, Falco Administratie",agendapunten:"1. Opening\n2. Veiligheid & Gezondheid\n3. Incidenten\n4. VCU-Certificering",beslissingen:"PBM-training plannen, VCU-handboek afronden",actiepunten:"PBM-checklist opstellen, training 22 feb",volgend:"2025-03-13"}
    ],
    instellingen: {
      bedrijfsnaam:"Solid Workforce B.V.",
      kvk:"93619405",
      adres:"Rivium 2E Straat, 2909 LG Capelle aan den IJssel",
      vgmFunctionaris:"S. Popovic",
      vgmEmail:"s.popovic@solidworkforce.nl",
      sigDagen:30,
      sigEmail:true,
      sigWhatsapp:true,
      sigSysteem:true,
      whatsappNr:"+31600000000"
    },
    nextIds: { medewerkers:6, inleners:3, certificaten:4, incidenten:2, evaluaties:2, signaleringen:1, overlegverslagen:2 }
  },

  data: null,

  load() {
    const opgeslagen = localStorage.getItem('vcu_solidworkforce');
    if (opgeslagen) {
      try { this.data = JSON.parse(opgeslagen); }
      catch(e) { this.data = JSON.parse(JSON.stringify(this.defaults)); }
    } else {
      this.data = JSON.parse(JSON.stringify(this.defaults));
    }
    // Zorg dat alle keys bestaan (bij updates)
    for (const key in this.defaults) {
      if (!(key in this.data)) this.data[key] = JSON.parse(JSON.stringify(this.defaults[key]));
    }
  },

  save() {
    localStorage.setItem('vcu_solidworkforce', JSON.stringify(this.data));
  },

  nextId(tabel) {
    if (!this.data.nextIds[tabel]) this.data.nextIds[tabel] = 1;
    return this.data.nextIds[tabel]++;
  },

  // Medewerkers
  getMedewerkers(inclInactief=false) {
    return this.data.medewerkers.filter(m => inclInactief || m.actief);
  },
  getMedewerker(id) { return this.data.medewerkers.find(m => m.id == id); },
  saveMedewerker(mw) {
    const idx = this.data.medewerkers.findIndex(m => m.id == mw.id);
    if (idx >= 0) this.data.medewerkers[idx] = mw;
    else { mw.id = this.nextId('medewerkers'); this.data.medewerkers.push(mw); }
    this.save();
    return mw;
  },
  deleteMedewerker(id) {
    const mw = this.getMedewerker(id);
    if (mw) { mw.actief = false; this.save(); }
  },

  // Inleners
  getInleners() { return this.data.inleners.filter(i => i.actief); },
  getInlener(id) { return this.data.inleners.find(i => i.id == id); },
  saveInlener(il) {
    const idx = this.data.inleners.findIndex(i => i.id == il.id);
    if (idx >= 0) this.data.inleners[idx] = il;
    else { il.id = this.nextId('inleners'); this.data.inleners.push(il); }
    this.save();
    return il;
  },

  // Bijlagen
  getBijlagen(mwId) { return this.data.bijlagen[mwId] || {}; },
  getBijlage(mwId, nr) { return (this.data.bijlagen[mwId] || {})[nr] || {compleet:false}; },
  saveBijlage(mwId, nr, data) {
    if (!this.data.bijlagen[mwId]) this.data.bijlagen[mwId] = {};
    this.data.bijlagen[mwId][nr] = { ...data, datum: new Date().toISOString().split('T')[0] };
    this.save();
  },
  dossierCompletie(mwId) {
    const b = this.data.bijlagen[mwId] || {};
    return Math.round((Object.values(b).filter(x=>x.compleet).length / 16) * 100);
  },

  // Certificaten
  getCertificaten(mwId=null) {
    return mwId ? this.data.certificaten.filter(c=>c.mwId==mwId) : this.data.certificaten;
  },
  saveCertificaat(cert) {
    const idx = this.data.certificaten.findIndex(c=>c.id==cert.id);
    if (idx>=0) this.data.certificaten[idx] = cert;
    else { cert.id = this.nextId('certificaten'); this.data.certificaten.push(cert); }
    this.save();
    return cert;
  },
  deleteCertificaat(id) {
    this.data.certificaten = this.data.certificaten.filter(c=>c.id!=id);
    this.save();
  },

  // Handtekeningen
  getHandtekening(mwId) { return this.data.handtekeningen[mwId] || null; },
  saveHandtekening(mwId, hand, paraaf) {
    this.data.handtekeningen[mwId] = { hand, paraaf, datum: new Date().toISOString() };
    const mw = this.getMedewerker(mwId);
    if (mw) { mw.heeftHandtekening = true; }
    this.save();
  },
  deleteHandtekening(mwId) {
    delete this.data.handtekeningen[mwId];
    const mw = this.getMedewerker(mwId);
    if (mw) mw.heeftHandtekening = false;
    this.save();
  },

  // Incidenten
  getIncidenten() { return this.data.incidenten; },
  saveIncident(inc) {
    const idx = this.data.incidenten.findIndex(i=>i.id==inc.id);
    if (idx>=0) this.data.incidenten[idx] = inc;
    else { inc.id = this.nextId('incidenten'); this.data.incidenten.push(inc); }
    this.save();
    return inc;
  },

  // Evaluaties
  getEvaluaties() { return this.data.evaluaties; },
  saveEvaluatie(ev) {
    const idx = this.data.evaluaties.findIndex(e=>e.id==ev.id);
    if (idx>=0) this.data.evaluaties[idx] = ev;
    else { ev.id = this.nextId('evaluaties'); this.data.evaluaties.push(ev); }
    this.save();
    return ev;
  },

  // Signaleringen
  getSignaleringen(alleenOpen=true) {
    return alleenOpen ? this.data.signaleringen.filter(s=>s.status==='Open') : this.data.signaleringen;
  },
  saveSignalering(sig) {
    sig.id = this.nextId('signaleringen');
    sig.datum = new Date().toISOString();
    sig.status = 'Open';
    this.data.signaleringen.push(sig);
    this.save();
    return sig;
  },
  afhandelSignalering(id) {
    const s = this.data.signaleringen.find(s=>s.id==id);
    if (s) { s.status='Afgehandeld'; s.afgehandeld=new Date().toISOString(); this.save(); }
  },

  // Overlegverslagen
  getOverlegverslagen() { return this.data.overlegverslagen; },
  saveOverlegverslag(ov) {
    const idx = this.data.overlegverslagen.findIndex(o=>o.id==ov.id);
    if (idx>=0) this.data.overlegverslagen[idx] = ov;
    else { ov.id = this.nextId('overlegverslagen'); this.data.overlegverslagen.push(ov); }
    this.save();
    return ov;
  },

  // Instellingen
  getInstellingen() { return this.data.instellingen; },
  saveInstellingen(inst) { this.data.instellingen = inst; this.save(); },

  // Export naar JSON-bestand
  exportJSON() {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VCU_SolidWorkforce_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import van JSON-bestand
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      this.data = parsed;
      this.save();
      return true;
    } catch(e) { return false; }
  }
};

// Veld-namen voor bijlagen
const BIJLAGEN = [
  "Directiebeoordeling", "Interne audit", "NEN4400 Certificaat", "Beleidsverklaring",
  "VGM-certificaat", "MVK Diploma's", "Organogram & Intercedent", "Bedrijfsvoorlichting",
  "Overlegverslagen", "Medewerkersdossier", "Informatieoverdracht", "Controle Afspraken",
  "Evaluatie Inleners", "Melding Incidenten", "Medische Geschiktheid", "Blootstellingsrisico's & PMO"
];

const CERT_TYPEN = ["VCA Basis","VCA VOL","VCU-VIL","BHV","Rijbewijs B","Rijbewijs BE","Rijbewijs C","Heftruck","Werken op hoogte","Overig"];

const PROCEDURES = [
  {nr:1,titel:"Directiebeoordeling",freq:"Jaarlijks",verantw:"Directie",tekst:"De directiebeoordeling vindt jaarlijks plaats en evalueert of het VGM-beleid voldoet aan de VCU-eisen. De directie bespreekt prestaties, incidenten, audits en verbeterpunten."},
  {nr:2,titel:"Interne audit",freq:"Jaarlijks",verantw:"Aangewezen auditor",tekst:"De interne audit wordt jaarlijks uitgevoerd om te controleren of het VCU-systeem goed wordt nageleefd en verbeterd kan worden."},
  {nr:3,titel:"NEN4400 Certificaat",freq:"Periodiek (SNA)",verantw:"Directie",tekst:"Solid Workforce B.V. voldoet aan de normen zoals vastgesteld in het Handboek Normen SNA en is opgenomen in het Register Normering Arbeid."},
  {nr:4,titel:"Beleidsverklaring",freq:"Jaarlijks herzien",verantw:"Directie",tekst:"De beleidsverklaring vormt de basis voor de aanpak rondom veiligheid, gezondheid en milieu. Het benadrukt de verplichting om te voldoen aan wet- en regelgeving en de VCU-richtlijnen."},
  {nr:5,titel:"VGM-certificaat",freq:"Zie geldigheid",verantw:"VGM-functionaris",tekst:"Aantoonbare VGM-competentie door middel van een geldig VCU-VIL certificaat. Naam: S. Popovic — Geldig tot: 13-02-2035."},
  {nr:6,titel:"MVK-functionaris",freq:"Op aanvraag",verantw:"Directie",tekst:"Solid Workforce B.V. schakelt extern een Middelbare Veiligheidskundige (MVK) in via erkende bureaus met de juiste diploma's en certificeringen."},
  {nr:7,titel:"Organogram & Intercedent",freq:"Bij wijziging",verantw:"Intercedent",tekst:"De intercedent speelt een sleutelrol in het werven, begeleiden en informeren van uitzendkrachten, met aandacht voor veiligheid en naleving van VCU-richtlijnen."},
  {nr:8,titel:"Bedrijfsvoorlichting",freq:"Bij aanvang",verantw:"Intercedent",tekst:"Nieuwe medewerkers ontvangen een bedrijfsvoorlichting over veiligheid, gezondheid en VCU-richtlijnen, inclusief uitleg over PBM's en incidentmeldingen."},
  {nr:9,titel:"Overlegverslagen",freq:"Periodiek",verantw:"Notulist",tekst:"Regelmatige overleggen worden gehouden om VCU-naleving, veiligheid en operationele processen te bespreken. Verslagen worden bewaard."},
  {nr:10,titel:"Medewerkersdossiers",freq:"Continu",verantw:"Intercedent",tekst:"Per medewerker wordt een volledig dossier bijgehouden met alle vereiste documenten, certificaten en ondertekende bijlagen."},
  {nr:11,titel:"Informatieoverdracht",freq:"Bij aanvang",verantw:"Intercedent",tekst:"Bewijs van informatieoverdracht naar nieuwe medewerkers over veiligheidsregels, PBM's, VCU-regels en verantwoordelijkheden."},
  {nr:12,titel:"Controle Afspraken",freq:"Periodiek",verantw:"Intercedent",tekst:"Controle op gemaakte afspraken met medewerkers: PBM-gebruik, veiligheidsgedrag, tijdigheid en taakvervulling."},
  {nr:13,titel:"Evaluatie Inleners",freq:"Periodiek",verantw:"Intercedent",tekst:"Evaluatie van de samenwerking tussen inlener, uitzendkracht en Solid Workforce. Beoordeeld op veiligheid, kwaliteit en werkhouding."},
  {nr:14,titel:"Melding Incidenten",freq:"Bij incident",verantw:"Melder + VGM",tekst:"Procedure voor melding en registratie van (bijna-)ongevallen en incidenten. Direct melden, situatie veiligstellen, formulier invullen."},
  {nr:15,titel:"Medische Geschiktheid",freq:"Bij plaatsing",verantw:"Intercedent",tekst:"Overleg met inlener over medische geschiktheid van uitzendkrachten bij hun tewerkstelling, conform de VCU-richtlijnen en Arbowet."},
  {nr:16,titel:"Blootstellingsrisico's & PMO",freq:"Bij plaatsing",verantw:"Intercedent + Inlener",tekst:"Vastleggen voor welke functies periodiek medisch onderzoek vereist is op basis van blootstellingsrisico's (stoffen, lawaai, trillingen etc.)."}
];
