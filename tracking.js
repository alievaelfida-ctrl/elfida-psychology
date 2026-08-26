(() => {
  const allowed = ['utm_source','utm_medium','utm_campaign','utm_content','content_id','offer_version','landing_version','placement'];
  const clean = value => /^[a-z0-9_-]{1,80}$/.test(value || '') ? value : null;
  const params = new URLSearchParams(location.search);
  const touch = {};
  for (const key of allowed) {
    const value = clean(params.get(key));
    if (value) touch[key] = value;
  }
  try {
    if (Object.keys(touch).length) {
      if (!localStorage.getItem('elfida_first_touch')) localStorage.setItem('elfida_first_touch', JSON.stringify(touch));
      localStorage.setItem('elfida_latest_touch', JSON.stringify(touch));
    }
  } catch {}
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'consultation_landing_view', landing_version: 'lp_v1' });
  document.querySelectorAll('a[href="#booking"]').forEach(link => link.addEventListener('click', () => {
    window.dataLayer.push({ event: 'consultation_primary_cta_click', cta_location: link.closest('header') ? 'header' : 'hero', cta_text: 'book_session' });
  }));
  document.querySelectorAll('[data-contact-channel]').forEach(link => link.addEventListener('click', () => {
    const channel = link.dataset.contactChannel;
    if (channel === 'viber' || channel === 'whatsapp') {
      window.dataLayer.push({ event: 'consultation_contact_click', contact_channel: channel });
    }
  }));
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
