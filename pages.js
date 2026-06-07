// ── AUTOMATISCHE SIGNALERING ──
const Signalering = {
  checkAll() {
    this.checkCertificaten();
    this.checkContractfases();
    this.checkOntbrekendeBijlagen();
  },

  checkCertificaten() {
    const dagen = DB.getInstellingen().sigDagen || 30;
    DB.getCertificaten().forEach(c => {
      const d = daysDiff(c.geldigTot);
      if (d >= 0 && d <= dagen && !c.sigVerzonden) {
        const mw = DB.getMedewerker(c.mwId);
        DB.saveSignalering({ type:'Certificaat', medewerker: mwNaam(mw), omschrijving:`${c.naam} verloopt over ${d} dag(en) — ${formatDate(c.geldigTot)}`, urgentie: d <= 7 ? 'Kritiek' : 'Waarschuwing' });
        c.sigVerzonden = true;
        DB.saveCertificaat(c);
        this.verstuurKanalen(mwNaam(mw), `VCU: ${c.naam} verloopt over ${d} dagen`);
      }
    });
  },

  checkContractfases() {
    DB.getMedewerkers().filter(m=>m.cat==='Uitzend'&&(m.fase===1||m.fase===2)).forEach(mw => {
      const weken = wekenGewerkt(mw.start);
      if (weken >= 48 && weken <= 52) {
        const bestaand = DB.getSignaleringen(true).find(s=>s.type==='Contractfase'&&s.medewerker===mwNaam(mw));
        if (!bestaand) {
          DB.saveSignalering({ type:'Contractfase', medewerker: mwNaam(mw), omschrijving:`Fase 1/2 max bijna bereikt (${weken}/52 weken) — contractherziening vereist`, urgentie:'Waarschuwing' });
          this.verstuurKanalen(mwNaam(mw), `VCU: Contractfase overgang — ${mwNaam(mw)} (week ${weken}/52)`);
        }
      }
    });
  },

  checkOntbrekendeBijlagen() {
    DB.getMedewerkers().forEach(mw => {
      const pct = DB.dossierCompletie(mw.id);
      if (pct < 100) {
        const bestaand = DB.getSignaleringen(true).find(s=>s.type==='Dossier'&&s.medewerker===mwNaam(mw));
        if (!bestaand) {
          const ontbrekend = Math.round((1 - pct/100) * 16);
          DB.saveSignalering({ type:'Dossier', medewerker: mwNaam(mw), omschrijving:`${ontbrekend} bijlage(n) ontbreken in dossier (${pct}% compleet)`, urgentie:'Waarschuwing' });
        }
      }
    });
  },

  verstuurKanalen(naam, bericht) {
    const inst = DB.getInstellingen();
    // WhatsApp: open deep-link
    if (inst.sigWhatsapp && inst.whatsappNr) {
      const nr = inst.whatsappNr.replace(/\D/g,'');
      const url = `https://wa.me/${nr}?text=${encodeURIComponent(bericht)}`;
      // Sla op voor handmatig verzenden (geen auto-open om spam te voorkomen)
      console.log('[WhatsApp]', url);
    }
    // E-mail: mailto link
    if (inst.sigEmail && inst.vgmEmail) {
      const mailto = `mailto:${inst.vgmEmail}?subject=${encodeURIComponent('VCU Signalering: '+naam)}&body=${encodeURIComponent(bericht)}`;
      console.log('[Email]', mailto);
    }
  },

  // Toon WhatsApp link voor een specifieke signalering
  stuurWhatsApp(sigId) {
    const sig = DB.getSignaleringen(false).find(s=>s.id==sigId);
    if (!sig) return;
    const inst = DB.getInstellingen();
    const nr = (inst.whatsappNr||'').replace(/\D/g,'');
    if (!nr) { Toast.show('Geen WhatsApp nummer ingesteld in Instellingen','warn'); return; }
    const tekst = `VCU Signalering — ${sig.medewerker}\n${sig.omschrijving}\nUrgentie: ${sig.urgentie}`;
    window.open(`https://wa.me/${nr}?text=${encodeURIComponent(tekst)}`, '_blank');
  },

  stuurEmail(sigId) {
    const sig = DB.getSignaleringen(false).find(s=>s.id==sigId);
    if (!sig) return;
    const inst = DB.getInstellingen();
    const onderwerp = `VCU Signalering: ${sig.medewerker} — ${sig.type}`;
    const body = `Geachte VGM-functionaris,\n\nEr is een VCU signalering voor ${sig.medewerker}:\n\n${sig.omschrijving}\n\nUrgentie: ${sig.urgentie}\nDatum: ${formatDate(sig.datum)}\n\nMet vriendelijke groet,\nVCU Managementsysteem — ${inst.bedrijfsnaam}`;
    window.location.href = `mailto:${inst.vgmEmail}?subject=${encodeURIComponent(onderwerp)}&body=${encodeURIComponent(body)}`;
  }
};
