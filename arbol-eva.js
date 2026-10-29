/* «Te guío»: EVA conduce una decisión paso a paso (árbol de decisión) mientras el sitio queda en pausa (eva-ui.js).
   Cada nodo tiene la pregunta de EVA y sus opciones [texto, siguiente nodo]; los nodos finales traen el veredicto
   (no · depende · sí), lo que revisas tú y adónde ir. Textos escritos por el equipo a partir de las guías y protocolos del
   sitio (Guías, protocolos y tutoriales). Revisión jurídica pendiente, como el resto de la maqueta. */
const ARBOL_EVA = {
  raiz: { eva: '¿Qué tienes entre manos?', opciones: [
    ['¿Qué es este sitio?', 'sitio-1'],
    ['Un escrito con datos de un cliente', 'esc-datos'],
    ['Un fallo o una norma que me dio una IA', 'fal-abriste'],
    ['Mi tesis o un trabajo de la carrera', 'tes-permite'],
  ] },

  /* ---------- ¿Qué es este sitio? La visita guiada: la primera vez se abre sola al terminar la bienvenida ---------- */
  'sitio-1': { eva: 'Este es el sitio de IA y Derecho de la Escuela. Sirve para una cosa: aprender a usar la inteligencia artificial sin perder el criterio. No pide cuenta: lo que avances queda en este navegador.', opciones: [['Siguiente', 'sitio-2']] },
  'sitio-2': { eva: 'Para aprender: «Mis cursos». Arriba está EVA ACADEMY, el curso completo que ya funciona; debajo, los ocho cursos de la Escuela. En «Videocápsulas» está cada tema en cinco minutos, y mis videos en vertical.', opciones: [['Siguiente', 'sitio-3']] },
  'sitio-3': { eva: 'Para practicar: el «Laboratorio». Son experimentos breves en los que caes en la trampa a propósito. Como en la bienvenida.', opciones: [['Siguiente', 'sitio-4']] },
  'sitio-4': { eva: 'Para consultar: «Recursos» y «Guías y protocolos», listas cortas para cuando hay apuro. Y «Docentes», para preparar una clase.', opciones: [['Siguiente', 'fin-sitio']] },
  'fin-sitio': { fin: 'guia', titulo: 'Y yo estoy aquí.',
    eva: 'Cuando dudes, ábreme con el botón de abajo a la derecha. No te doy la respuesta: te ayudo a decidir qué revisar tú.',
    revisa: [],
    ir: [['Empezar por EVA ACADEMY', '#cursos'], ['Abrir el Laboratorio', '#laboratorio']] },

  /* ---------- Un escrito con datos de un cliente ---------- */
  'esc-datos': { eva: '¿El escrito tiene datos que identifican a alguien? Nombres, RUT, domicilios, números de causa.', opciones: [
    ['Sí, tiene', 'esc-completo'], ['No, nada de eso', 'esc-sin-datos'], ['No estoy seguro', 'esc-dudo'],
  ] },
  'esc-dudo': { eva: 'Revísalo conmigo. ¿Aparece un cargo único, una fecha exacta o un lugar pequeño que permita saber de quién se trata?', opciones: [
    ['Sí, alguno', 'esc-completo'], ['No, nada', 'esc-sin-datos'],
  ] },
  'esc-completo': { eva: '¿Necesitas pegar el escrito completo, o te basta un fragmento?', opciones: [
    ['El escrito completo', 'esc-guarda'], ['Me basta un fragmento', 'fin-esc-fragmento'],
  ] },
  'esc-guarda': { eva: '¿Sabes si la herramienta guarda lo que pegas o lo usa para entrenarse?', opciones: [
    ['No lo guarda, lo revisé', 'fin-esc-tacha'], ['Sí lo guarda', 'fin-esc-no'], ['No lo sé', 'fin-esc-no'],
  ] },
  'fin-esc-no': { fin: 'no', titulo: 'Todavía no lo pegues.',
    eva: 'Si no sabes qué hace la herramienta con lo que pegas, pegar el escrito completo puede exponer a tu cliente. Primero tacha los datos, o pide autorización.',
    revisa: ['Cambia nombres por «Parte A», «Parte B».', 'Borra RUT, domicilios, correos y números de causa.', 'Lee las condiciones de la herramienta.'],
    ir: [['Protocolo: antes de pegar un documento', '#guias/antes-de-pegar'], ['Curso 6 · Secreto profesional', 'curso:5-0']] },
  'fin-esc-tacha': { fin: 'dep', titulo: 'Puedes, pero tacha primero.',
    eva: 'Que no lo guarde reduce el riesgo, pero no lo elimina. Los datos del cliente no me hacen falta para ayudarte.',
    revisa: ['Reemplaza los datos que identifican.', 'Pega sólo lo necesario.', 'Lo que te responda, revísalo tú antes de usarlo.'],
    ir: [['Protocolo: antes de pegar un documento', '#guias/antes-de-pegar']] },
  'fin-esc-fragmento': { fin: 'si', titulo: 'Bien: usa sólo el fragmento.',
    eva: 'Pegar lo mínimo es la mejor costumbre. Igual tacha cualquier dato que identifique, aunque sea uno.',
    revisa: ['Que el fragmento no traiga nombres ni números de causa.', 'Que lo que te responda calce con el resto del escrito.'],
    ir: [['Protocolo: antes de pegar un documento', '#guias/antes-de-pegar']] },
  'esc-sin-datos': { eva: 'Entonces el riesgo de exponer a alguien baja. Una cosa más: ¿quién va a firmar ese escrito?', opciones: [
    ['Yo', 'fin-esc-firma'], ['Lo dejó listo la IA', 'fin-esc-firma'],
  ] },
  'fin-esc-firma': { fin: 'dep', titulo: 'Firma quien lo revisó.',
    eva: 'Yo no firmo. Tú sí. Aunque yo lo haya redactado, la responsabilidad es de quien lo presenta.',
    revisa: ['Cada cita y cada norma, en la fuente oficial.', 'Que los hechos sean los del caso.', 'Que el tono y los argumentos sean tuyos.'],
    ir: [['Protocolo: verificar una cita', '#guias/verificar-cita'], ['Curso 6 · Ética profesional', 'curso:5-0']] },

  /* ---------- Un fallo o una norma que me dio una IA ---------- */
  'fal-abriste': { eva: '¿Ya lo abriste tú en la fuente oficial?', opciones: [
    ['Sí, lo abrí', 'fal-dice'], ['Todavía no', 'fal-datos'], ['¿Dónde lo abro?', 'fin-fal-donde'],
  ] },
  'fal-datos': { eva: 'Entonces todavía no sabes si existe. ¿Tienes tribunal, rol y fecha, o el número de la ley?', opciones: [
    ['Sí, los tengo', 'fin-fal-busca'], ['No, sólo el nombre del caso', 'fin-fal-inventado'],
  ] },
  'fin-fal-busca': { fin: 'dep', titulo: 'Búscalo antes de citarlo.',
    eva: 'Con esos datos lo encuentras en minutos. Si no aparece, trátalo como inventado: yo invento fallos con mucha seguridad.',
    revisa: ['Que el tribunal, el rol y la fecha coincidan.', 'Que la parte citada diga lo que te dije.'],
    ir: [['Protocolo: verificar una cita', '#guias/verificar-cita'], ['Buscador del Poder Judicial ↗', 'https://juris.pjud.cl/busqueda']] },
  'fin-fal-inventado': { fin: 'no', titulo: 'No lo cites así.',
    eva: 'Un nombre de caso sin rol ni fecha es justo lo que una IA inventa mejor. Sin datos para encontrarlo, no entra en tu trabajo.',
    revisa: ['Pídeme el tribunal, el rol y la fecha, y búscalos tú.', 'Si no aparece en la fuente oficial, no existe para tu trabajo.'],
    ir: [['Experimento 06: audiencia contra la IA', '#laboratorio/06'], ['Protocolo: verificar una cita', '#guias/verificar-cita']] },
  'fin-fal-donde': { fin: 'si', titulo: 'En la fuente oficial, siempre.',
    eva: 'Los fallos, en el buscador del Poder Judicial. Las normas, en Ley Chile, de la Biblioteca del Congreso, mirando qué versión está vigente.',
    revisa: ['Abre el documento completo, no un resumen.', 'Anota dónde y cuándo lo verificaste.'],
    ir: [['Buscador del Poder Judicial ↗', 'https://juris.pjud.cl/busqueda'], ['Ley Chile ↗', 'https://www.bcn.cl/leychile'], ['Tutorial: buscar una norma en Ley Chile', '#guias/ley-chile']] },
  'fal-dice': { eva: 'Bien. ¿Y dice lo que yo te dije que decía?', opciones: [
    ['Sí, lo leí y coincide', 'fin-fal-ok'], ['No del todo', 'fin-fal-leer'], ['No lo leí entero', 'fin-fal-leer'],
  ] },
  'fin-fal-ok': { fin: 'si', titulo: 'Ahora sí puedes citarlo.',
    eva: 'Lo encontraste y lo leíste. Eso es lo que no se delega.',
    revisa: ['Cita la parte exacta que leíste.', 'Anota dónde y cuándo lo verificaste.'],
    ir: [['Tutorial: comparar la respuesta con la fuente', '#guias/comparar-fuente']] },
  'fin-fal-leer': { fin: 'dep', titulo: 'Léelo tú antes de usarlo.',
    eva: 'Que un fallo exista no significa que diga lo que yo resumí. A veces mezclo el voto de mayoría con una disidencia.',
    revisa: ['Lee la parte considerativa que se cita.', 'Compara frase por frase con lo que te dije.'],
    ir: [['Tutorial: comparar la respuesta con la fuente', '#guias/comparar-fuente'], ['Curso 4 · Investigación jurídica', 'curso:3-0']] },

  /* ---------- Mi tesis o un trabajo de la carrera ---------- */
  'tes-permite': { eva: '¿Qué dice tu programa, o tu profesor, sobre usar IA en ese trabajo?', opciones: [
    ['Lo permite', 'tes-para'], ['No dice nada', 'fin-tes-pregunta'], ['Lo prohíbe', 'fin-tes-no'],
  ] },
  'fin-tes-no': { fin: 'no', titulo: 'Entonces no la uses ahí.',
    eva: 'La regla de tu asignatura manda. Puedes usarme para estudiar la materia, pero no para hacer ese trabajo.',
    revisa: ['Pregunta si la regla incluye revisar ortografía o buscar fuentes.'],
    ir: [['Guía: estudiar con IA sin que estudie por ti', '#guias/estudiar-con-ia']] },
  'fin-tes-pregunta': { fin: 'dep', titulo: 'Pregunta antes de usarla.',
    eva: 'Si nadie lo dijo, no lo supongas. Una pregunta a tu profesor te ahorra un mal rato.',
    revisa: ['Pregunta qué usos acepta.', 'Si te autoriza, declara el uso al final del trabajo.'],
    ir: [['Protocolo: declarar el uso de IA', '#guias/declarar-ia']] },
  'tes-para': { eva: '¿Para qué la quieres usar?', opciones: [
    ['Ordenar ideas o revisar redacción', 'fin-tes-declara'], ['Que escriba partes del texto', 'fin-tes-escribe'], ['Buscar fuentes', 'fin-tes-fuentes'],
  ] },
  'fin-tes-declara': { fin: 'si', titulo: 'Sí, y decláralo.',
    eva: 'Es un buen uso. Cuenta en una nota breve qué herramienta usaste y para qué. El análisis y las conclusiones siguen siendo tuyos.',
    revisa: ['Guarda tus conversaciones por si te piden ver el proceso.'],
    ir: [['Protocolo: declarar el uso de IA', '#guias/declarar-ia']] },
  'fin-tes-escribe': { fin: 'no', titulo: 'Ese texto ya no sería tuyo.',
    eva: 'Una tesis evalúa tu razonamiento. Si yo escribo partes, lo que se evalúa es el mío. Úsame para discutir tus ideas, no para reemplazarlas.',
    revisa: ['Escribe tú. Pídeme que te haga preguntas o contraargumentos.'],
    ir: [['Guía: estudiar con IA sin que estudie por ti', '#guias/estudiar-con-ia'], ['Protocolo: declarar el uso de IA', '#guias/declarar-ia']] },
  'fin-tes-fuentes': { fin: 'dep', titulo: 'Sirvo para empezar, no para citar.',
    eva: 'Puedo sugerirte por dónde buscar, pero cada fuente la abres tú. Las referencias que invento suenan tan reales como las verdaderas.',
    revisa: ['Abre cada fuente antes de anotarla.', 'Lo que quede sin fuente, no entra.'],
    ir: [['Tutorial: comparar la respuesta con la fuente', '#guias/comparar-fuente'], ['Curso 4 · Investigación jurídica', 'curso:3-0']] },
};
const VEREDICTO_EVA = { no: 'No', dep: 'Depende', si: 'Sí' };
