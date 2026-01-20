(function(){
  function parseMMDDYYYY(value){
    if(!value) return null;
    const parts = value.split('-');
    if(parts.length !== 3) return null;
    const m = parseInt(parts[0], 10);
    const d = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if([m,d,y].some(isNaN)) return null;
    const dt = new Date(y, m - 1, d);
    dt.setHours(0,0,0,0);
    return isNaN(dt.getTime()) ? null : dt;
  }

  function computeCutoff(eventDate){
    // 1:00 AM on the day after the event date
    return new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate() + 1,
      1, 0, 0, 0
    );
  }

  function disableButton(btn){
    if (!btn) return;
    btn.classList.add('btn-disabled');
    btn.setAttribute('aria-disabled','true');
    btn.title = 'Registration closed';
    // Make link inert without breaking layout
    const handler = (e) => { e.preventDefault(); e.stopPropagation(); };
    // Avoid stacking multiple listeners
    btn.__cutoffHandler && btn.removeEventListener('click', btn.__cutoffHandler);
    btn.addEventListener('click', handler);
    btn.__cutoffHandler = handler;
    if (btn.tagName === 'BUTTON') btn.disabled = true;
  }

  function enableButton(btn){
    if (!btn) return;
    btn.classList.remove('btn-disabled');
    btn.removeAttribute('aria-disabled');
    btn.removeAttribute('title');
    if (btn.__cutoffHandler){
      btn.removeEventListener('click', btn.__cutoffHandler);
      delete btn.__cutoffHandler;
    }
    if (btn.tagName === 'BUTTON') btn.disabled = false;
  }

  function getEventStringFor(btn){
    // Determine event date from href query param `event`
    let href = btn.getAttribute('href') || '';
    let eventStr = null;
    if (href){
      try {
        const url = new URL(href, window.location.origin);
        eventStr = url.searchParams.get('event');
      } catch(_e){ /* ignore bad URL */ }
    }
    // Fallback: data attribute
    if (!eventStr && btn.dataset && btn.dataset.event){
      eventStr = btn.dataset.event;
    }
    // Try parent card data-event if present
    if (!eventStr){
      const parentWithData = btn.closest('[data-event]');
      if (parentWithData) eventStr = parentWithData.getAttribute('data-event');
    }
    return eventStr;
  }

  function processRegisterButtons(){
    const now = new Date();
    const buttons = document.querySelectorAll('.btn-register, a[href*="registration-form.html?event="]');
    buttons.forEach(btn => {
      try{
        const eventStr = getEventStringFor(btn);
        const eventDate = parseMMDDYYYY(eventStr);
        if (!eventDate){
          // If we can't determine event date, leave it enabled
          return;
        }
        const cutoff = computeCutoff(eventDate);
        if (now >= cutoff){
          disableButton(btn);
        } else {
          enableButton(btn);
        }
      }catch(_e){ /* ignore individual button errors */ }
    });
  }

  // Initial run when DOM is ready
  document.addEventListener('DOMContentLoaded', processRegisterButtons);
  // Run again on full load and after a short delay to catch late inserts
  window.addEventListener('load', () => {
    processRegisterButtons();
    setTimeout(processRegisterButtons, 500);
    setTimeout(processRegisterButtons, 1500);
  });
  // Observe DOM changes to catch dynamically inserted event cards
  const observer = new MutationObserver(() => processRegisterButtons());
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();