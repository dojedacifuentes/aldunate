/* Tutorial: tema claro/oscuro, barra de lectura, copiar prompts y ampliar figuras.
   Archivo aparte (no inline) porque el sitio exige scripts 'self'. */
(() => {
  const raiz = document.documentElement;
  try { const t = localStorage.getItem('tutorial:tema'); if (t) raiz.dataset.tema = t; } catch {}
  const btnTema = document.getElementById('tema');
  const oscuro = () => raiz.dataset.tema ? raiz.dataset.tema === 'oscuro' : matchMedia('(prefers-color-scheme: dark)').matches;
  const pintarTema = () => { btnTema.textContent = oscuro() ? 'Claro' : 'Oscuro'; };
  btnTema.addEventListener('click', () => {
    raiz.dataset.tema = oscuro() ? 'claro' : 'oscuro';
    try { localStorage.setItem('tutorial:tema', raiz.dataset.tema); } catch {}
    pintarTema();
  });
  pintarTema();

  const barra = document.querySelector('.progreso');
  const medir = () => { const h = document.documentElement.scrollHeight - innerHeight; barra.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%'; };
  addEventListener('scroll', medir, { passive: true }); medir();

  const aviso = document.querySelector('.aviso-copia');
  let reloj;
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copiar]');
    if (!b) return;
    const texto = b.closest('.prompt').querySelector('pre').innerText;
    try { await navigator.clipboard.writeText(texto); aviso.textContent = 'Prompt copiado'; }
    catch { aviso.textContent = 'No se pudo copiar: selecciónalo a mano'; }
    aviso.classList.add('on'); clearTimeout(reloj); reloj = setTimeout(() => aviso.classList.remove('on'), 1800);
  });

  const capa = document.querySelector('.ampliar'), capaImg = capa.querySelector('img');
  document.querySelectorAll('figure img').forEach((img) => img.addEventListener('click', () => {
    capaImg.src = img.currentSrc || img.src; capaImg.alt = img.alt; capa.hidden = false;
  }));
  const cerrar = () => { capa.hidden = true; capaImg.removeAttribute('src'); };
  capa.addEventListener('click', cerrar);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !capa.hidden) cerrar(); });
})();
