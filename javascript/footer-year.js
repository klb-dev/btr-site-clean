// Updates the copyright year in the footer
(function () {
  try {
    var el = document.getElementById('copyright-year');
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  } catch (e) {
    // Fail silently; footer still renders
  }
})();