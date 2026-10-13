export const UA = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36";
const BASE_URL = "https://cuevana3k.pro";

function log(...args) {
  try { kino.log(...args); } catch { }
}

function cleanText(text) {
  if (!text) return "";
  let result = text
    .replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<[^>]*>/g, "")
    .trim();

  // Opción A: Formatear a "SERIE: Nombre" y "PELÍCULA: Nombre"
  result = result.replace(/^Serie\s+/i, "SERIE: ");
  result = result.replace(/^Pel[ií]cula\s+/i, "PELÍCULA: ");
  return result;
}

export async function section({ tab }) {
  const tabs = [
    { id: "pelis", label: "Películas" },
    { id: "series", label: "Series" }
  ];

  const chosen = tabs.some((t) => t.id === tab) ? tab : "pelis";

  const fetchPage = async (path) => {
    try {
      const res = await kino.fetch(`${BASE_URL}${path}`, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return "";
      return await res.text();
    } catch (e) { return ""; }
  };

  let heroItem = null;
  const rows = [];

  if (chosen === "pelis") {
    // Lote 1: Lo principal (Home, Tendencias, Películas)
    const [htmlPopulares, htmlPeliculas, htmlEstrenos] = await Promise.all([
      fetchPage("/tendencias"), fetchPage("/peliculas"), fetchPage("/")
    ]);

    // Lote 2: Primer grupo de géneros
    const [htmlAccion, htmlComedia, htmlTerror, htmlAnimacion] = await Promise.all([
      fetchPage("/peliculas?genero=accion"), fetchPage("/peliculas?genero=comedia"),
      fetchPage("/peliculas?genero=terror"), fetchPage("/peliculas?genero=animacion")
    ]);

    // Lote 3: Segundo grupo de géneros
    const [htmlAnime, htmlCienciaFiccion, htmlSuspenso, htmlDrama] = await Promise.all([
      fetchPage("/peliculas?genero=anime"), fetchPage("/peliculas?genero=ciencia-ficcion"),
      fetchPage("/peliculas?genero=suspenso"), fetchPage("/peliculas?genero=drama")
    ]);

    const populares = extractItems(htmlPopulares, 20, false);
    const peliculas = extractItems(htmlPeliculas, 20, false);
    const estrenos = extractItems(htmlEstrenos, 20, false);
    const accion = extractItems(htmlAccion, 20, false);
    const comedia = extractItems(htmlComedia, 20, false);
    const terror = extractItems(htmlTerror, 20, false);
    const animacion = extractItems(htmlAnimacion, 20, false);
    const anime = extractItems(htmlAnime, 20, false);
    const cienciaFic = extractItems(htmlCienciaFiccion, 20, false);
    const suspenso = extractItems(htmlSuspenso, 20, false);
    const drama = extractItems(htmlDrama, 20, false);

    if (populares.length > 0) heroItem = populares[0];
    else if (estrenos.length > 0) heroItem = estrenos[0];

    if (estrenos.length > 0) rows.push({ id: "estrenos", title: "🔥 Estrenos Destacados", ref: "estrenos", items: estrenos });
    if (populares.length > 0) rows.push({ id: "populares", title: "⭐ Películas Populares", ref: "populares", items: populares });
    if (peliculas.length > 0) rows.push({ id: "peliculas", title: "🎬 Películas Agregadas", ref: "peliculas", items: peliculas });
    if (accion.length > 0) rows.push({ id: "accion", title: "💥 Acción", ref: "accion", items: accion });
    if (comedia.length > 0) rows.push({ id: "comedia", title: "😂 Comedia", ref: "comedia", items: comedia });
    if (terror.length > 0) rows.push({ id: "terror", title: "👻 Terror", ref: "terror", items: terror });
    if (animacion.length > 0) rows.push({ id: "animacion", title: "🎨 Animación", ref: "animacion", items: animacion });
    if (anime.length > 0) rows.push({ id: "anime", title: "🎌 Anime", ref: "anime", items: anime });
    if (cienciaFic.length > 0) rows.push({ id: "sci-fi", title: "🚀 Ciencia Ficción", ref: "sci-fi", items: cienciaFic });
    if (suspenso.length > 0) rows.push({ id: "suspenso", title: "🔍 Suspenso", ref: "suspenso", items: suspenso });
    if (drama.length > 0) rows.push({ id: "drama", title: "🎭 Drama", ref: "drama", items: drama });

  } else if (chosen === "series") {
    // Lote 1: Series principales
    const [htmlSeries, htmlHome] = await Promise.all([
      fetchPage("/series"), fetchPage("/")
    ]);

    // Lote 2: Primer grupo de géneros de series
    const [htmlAccion, htmlComedia, htmlTerror, htmlAnimacion] = await Promise.all([
      fetchPage("/series?genero=accion"), fetchPage("/series?genero=comedia"),
      fetchPage("/series?genero=terror"), fetchPage("/series?genero=animacion")
    ]);

    // Lote 3: Segundo grupo de géneros de series
    const [htmlAnime, htmlCienciaFiccion, htmlSuspenso, htmlDrama] = await Promise.all([
      fetchPage("/series?genero=anime"), fetchPage("/series?genero=ciencia-ficcion"),
      fetchPage("/series?genero=suspenso"), fetchPage("/series?genero=drama")
    ]);

    const series = extractItems(htmlSeries, 20, false);
    const episodios = extractItems(htmlHome, 20, true);
    const accion = extractItems(htmlAccion, 20, false);
    const comedia = extractItems(htmlComedia, 20, false);
    const terror = extractItems(htmlTerror, 20, false);
    const animacion = extractItems(htmlAnimacion, 20, false);
    const anime = extractItems(htmlAnime, 20, false);
    const cienciaFic = extractItems(htmlCienciaFiccion, 20, false);
    const suspenso = extractItems(htmlSuspenso, 20, false);
    const drama = extractItems(htmlDrama, 20, false);

    if (series.length > 0) heroItem = series[0];
    else if (episodios.length > 0) heroItem = episodios[0];

    if (series.length > 0) rows.push({ id: "series", title: "📺 Series Actualizadas", ref: "series", items: series });
    if (episodios.length > 0) rows.push({ id: "episodios", title: "🆕 Últimos Episodios", ref: "episodios", items: episodios });
    if (accion.length > 0) rows.push({ id: "s-accion", title: "💥 Acción", ref: "s-accion", items: accion });
    if (comedia.length > 0) rows.push({ id: "s-comedia", title: "😂 Comedia", ref: "s-comedia", items: comedia });
    if (terror.length > 0) rows.push({ id: "s-terror", title: "👻 Terror", ref: "s-terror", items: terror });
    if (animacion.length > 0) rows.push({ id: "s-animacion",title: "🎨 Animación", ref: "s-animacion",items: animacion });
    if (anime.length > 0) rows.push({ id: "s-anime", title: "🎌 Anime", ref: "s-anime", items: anime });
    if (cienciaFic.length > 0) rows.push({ id: "s-sci-fi", title: "🚀 Ciencia Ficción", ref: "s-sci-fi", items: cienciaFic });
    if (suspenso.length > 0) rows.push({ id: "s-suspenso", title: "🔍 Suspenso", ref: "s-suspenso", items: suspenso });
    if (drama.length > 0) rows.push({ id: "s-drama", title: "🎭 Drama", ref: "s-drama", items: drama });
  }

  let hero = { title: "Destacado", text: "Explora el mejor contenido disponible." };
  if (heroItem) {
    hero = {
      title: heroItem.title,
      text: chosen === "series" ? "Disfruta de esta serie destacada." : "Disfruta de esta película destacada.",
      image: heroItem.poster
    };
  }

  return { tabs, tab: chosen, hero, rows };
}

function base64Decode(str) {
  try {
    return atob(str);
  } catch (e) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    const cleanStr = (str || '').replace(/[^A-Za-z0-9\+\/\=]/g, '');
    for (let i = 0; i < cleanStr.length;) {
      const enc1 = chars.indexOf(cleanStr.charAt(i++));
      const enc2 = chars.indexOf(cleanStr.charAt(i++));
      const enc3 = chars.indexOf(cleanStr.charAt(i++));
      const enc4 = chars.indexOf(cleanStr.charAt(i++));
      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;
      output += String.fromCharCode(chr1);
      if (enc3 !== 64 && enc3 !== -1) output += String.fromCharCode(chr2);
      if (enc4 !== 64 && enc4 !== -1) output += String.fromCharCode(chr3);
    }
    return output;
  }
}

function extractTmdbId(url) {
  const m = url.match(/\/(?:pelicula|serie)\/(\d+)\//);
  return m ? parseInt(m[1], 10) : null;
}

// --- EXTRACCIÓN INTELIGENTE (Separa Fondos y Pósters) ---

// --- EXTRACCIÓN SEGURA Y DEFINITIVA ---
function extractItems(html, limit = 20, isEpisode = false) {
  if (!html) return [];
  const itemsMap = new Map();
  const aRegex = /<a[^>]+href="([^"]+(?:\/pelicula\/|\/serie\/)[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = aRegex.exec(html)) !== null) {
    let link = match[1];
    if (isEpisode) {
      if (!link.includes("episodio")) continue;
      link = link.replace(/\/episodio-\d+x\d+/i, "");
    } else {
      if (link.includes("episodio")) continue;
    }

    const innerHtml = match[2];
    
    // Buscamos cualquier fuente de imagen disponible de forma flexible
    const imgMatch = innerHtml.match(/data-src="([^"]+)"/i) || 
                     innerHtml.match(/data-lazy="([^"]+)"/i) || 
                     innerHtml.match(/src="([^"]+)"/i);
                     
    const titleMatch = innerHtml.match(/<h2[^>]*>([^<]+)<\/h2>/i) || innerHtml.match(/alt="([^"]+)"/i);
    
    if (imgMatch && titleMatch) {
      let imgUrl = imgMatch[1];
      
      // Ignoramos imágenes vacías o de carga temporal
      if (!imgUrl || imgUrl.startsWith('data:')) continue;

      if (imgUrl.startsWith("//")) imgUrl = "https:" + imgUrl;
      if (imgUrl.startsWith("/")) imgUrl = BASE_URL + imgUrl;
      
      const fullLink = link.startsWith("http") ? link : `${BASE_URL}${link}`;
      const linkKey = fullLink.split('?')[0].replace(/\/$/, "");
      
      const isHorizontal = imgUrl.includes('w780') || imgUrl.includes('w1280') || imgUrl.includes('backdrop') || isEpisode;

      if (!itemsMap.has(linkKey)) {
        const item = {
          id: "item-" + linkKey.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
          ref: fullLink,
          title: cleanText(titleMatch[1] || titleMatch[2]),
          kind: linkKey.includes("/serie/") ? "series" : "movie",
          poster: isHorizontal ? null : imgUrl,
          backdrop: isHorizontal ? imgUrl : null,
          tempImg: imgUrl
        };
        itemsMap.set(linkKey, item);
      } else {
        const existingItem = itemsMap.get(linkKey);
        if (!isHorizontal && !existingItem.poster) existingItem.poster = imgUrl;
        else if (isHorizontal && !existingItem.backdrop) existingItem.backdrop = imgUrl;
      }
    }
  }
  
  const results = [];
  for (const item of itemsMap.values()) {
    if (!item.poster) item.poster = item.backdrop || item.tempImg;
    if (!item.backdrop) item.backdrop = item.poster || item.tempImg;
    delete item.tempImg;
    
    results.push(item);
    if (results.length >= limit) break;
  }
  
  return results;
}
export async function home() {
  const fetchPage = async (path) => {
    try {
      const res = await kino.fetch(`${BASE_URL}${path}`, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return "";
      return await res.text();
    } catch (e) { return ""; }
  };

  // 1. Descargamos SOLAMENTE las 4 páginas principales (sin géneros)
  const [htmlHome, htmlPeliculas, htmlSeries, htmlPopulares] = await Promise.all([
    fetchPage("/"),
    fetchPage("/peliculas"),
    fetchPage("/series"),
    fetchPage("/tendencias")
  ]);

  // 2. Extraemos los items
  const estrenos = extractItems(htmlHome, 20, false);
  const ultimosEpisodios = extractItems(htmlHome, 20, true);
  const peliculas = extractItems(htmlPeliculas, 20, false);
  const series = extractItems(htmlSeries, 20, false);
  const populares = extractItems(htmlPopulares, 20, false);

  const categories = [];

  // 3. Armamos las 5 filas limpias con sus rutas directas
  if (estrenos.length > 0) categories.push({ id: "estrenos", title: "Estrenos Destacados", ref: "/", items: estrenos });
  if (ultimosEpisodios.length > 0) categories.push({ id: "episodios", title: "Últimos Episodios", ref: "/?tipo=episodios", items: ultimosEpisodios });
  if (populares.length > 0) categories.push({ id: "populares", title: "Películas Populares", ref: "/tendencias", items: populares });
  if (peliculas.length > 0) categories.push({ id: "peliculas", title: "Películas Agregadas", ref: "/peliculas", items: peliculas });
  if (series.length > 0) categories.push({ id: "series", title: "Series Actualizadas", ref: "/series", items: series });

  return categories;
}
export async function browse(ref, cursor) {
  await null;

  const paths = {
    "estrenos": "/",
    "episodios": "/",
    "populares": "/tendencias",
    "peliculas": "/peliculas",
    "series": "/series",
    "accion": "/peliculas?genero=accion",
    "comedia": "/peliculas?genero=comedia",
    "terror": "/peliculas?genero=terror",
    "animacion": "/peliculas?genero=animacion",
    "anime": "/peliculas?genero=anime",
    "sci-fi": "/peliculas?genero=ciencia-ficcion",
    "suspenso": "/peliculas?genero=suspenso",
    "drama": "/peliculas?genero=drama"
  };

  const path = paths[ref];
  if (!path) throw kino.error("not_found", "esa fila ya no existe");

  const page = cursor ? Number(cursor) : 1;

  const url = page > 1
    ? `${BASE_URL}${path}${path.includes("?") ? "&" : "?"}page=${page}`
    : `${BASE_URL}${path}`;

  const res = await kino.fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw kino.error("not_found", "no se pudo cargar la página");

  const html = await res.text();
  const items = extractItems(html, 40, ref === "episodios");

  return {
    items,
    next: items.length >= 10 ? String(page + 1) : undefined
  };
}

export async function search(query) {
  const searchTerm = (query && query.q) ? encodeURIComponent(query.q) : "";
  const res = await kino.fetch(`${BASE_URL}/explorar?s=${searchTerm}`, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) return [];
  const html = await res.text();
  const results = [];
  const vistos = new Set();
  const aRegex = /<a[^>]+href="([^"]+(?:\/pelicula\/|\/serie\/)[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = aRegex.exec(html)) !== null && results.length < 50) {
    let link = match[1];
    if (link.includes("episodio")) continue;
    const innerHtml = match[2];
    const imgMatch = innerHtml.match(/src=(?:"([^"]+)"|([^ >]+))/i);
    const titleMatch = innerHtml.match(/<h[23][^>]*>([^<]+)<\/h[23]>/i) || innerHtml.match(/alt="([^"]+)"/i);
    const yearMatch = innerHtml.match(/<span class="Year">(\d+)<\/span>/i);
    if (imgMatch && titleMatch && !vistos.has(link)) {
      vistos.add(link);
      let poster = imgMatch[1] || imgMatch[2];
      if (poster.startsWith("//")) poster = "https:" + poster;
      const fullLink = link.startsWith("http") ? link : `${BASE_URL}${link}`;
      const tmdbId = extractTmdbId(fullLink);
      const item = {
        id: "item-" + fullLink.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
        ref: fullLink,
        title: cleanText(titleMatch[1] || titleMatch[2]),
        kind: link.includes("/serie/") ? "series" : "movie",
        poster
      };
      if (yearMatch) item.year = parseInt(yearMatch[1], 10);
      if (tmdbId) item.ids = { tmdb: tmdbId };
      results.push(item);
    }
  }
  return results;
}

export async function episodes(ref) {
  const res = await kino.fetch(ref, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error("No se pudo obtener el contenido");
  const html = await res.text();

  const metadata = {};

  // Sinopsis (Overview)
  const descMatch = html.match(/class="Description"[^>]*>([\s\S]*?)<\/div>/i) || html.match(/<p[^>]*>\s*([^<]{30,})\s*<\/p>/i);
  if (descMatch) metadata.overview = cleanText(descMatch[1]);

  // Calificación (Rating)
  const voteMatch = html.match(/<span[^>]+class="Num"[^>]*>([\d.]+)<\/span>/i) || html.match(/class="Vote"[^>]*>\s*([\d.]+)\s*</i) || html.match(/class="AAIco-star"[^>]*>.*?<\/i>\s*([\d.]+)/i);
  if (voteMatch) metadata.rating = parseFloat(voteMatch[1]);

  // Géneros (Genres)
  const gRegex = /<a[^>]+href="[^"]*genero[^"]*"[^>]*>\s*([^<]+)\s*<\/a>/gi;
  let gm;
  const genres = [];
  while ((gm = gRegex.exec(html)) !== null) {
    genres.push(cleanText(gm[1]));
  }
  if (genres.length > 0) metadata.genres = [...new Set(genres)];

  // Año (Year) - Radar ampliado para que no se escape en las series
  const yearMatch = html.match(/class="Date"[^>]*>\s*(\d{4})\s*</i) ||
    html.match(/>(19\d{2}|20\d{2})<\/(?:span|p|a)>/i) ||
    html.match(/Estreno:\s*(\d{4})/i) ||
    html.match(/<span class="Year">(\d{4})<\/span>/i);
  if (yearMatch) metadata.year = parseInt(yearMatch[1], 10);

  // Fondo / Póster (Backdrop)
  const bgMatch = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i) ||
    html.match(/background-image:\s*url\((['"]?)([^)'"d]+)\1\)/i) ||
    html.match(/<img[^>]+class="[^"]*lazy[^"]*"[^>]+data-src="([^"]+)"/i);

  if (bgMatch) {
    let bUrl = bgMatch[1] || bgMatch[2];
    if (bUrl && !bUrl.startsWith('data:')) {
      if (bUrl.startsWith('//')) bUrl = 'https:' + bUrl;
      else if (bUrl.startsWith('/')) bUrl = BASE_URL + bUrl;
      metadata.backdrop = bUrl;
    }
  }

  // Intento más agresivo de capturar TMDB ID para forzar a Kino a traer los nombres de episodios
  const tmdbIdMatch = html.match(/tmdb[=&_]*(\d{3,})/i) ||
    html.match(/data-id="(\d{3,})"/i) ||
    html.match(/"tmdb_id"\s*:\s*"?(\d+)"?/i);
  if (tmdbIdMatch) metadata.ids = { tmdb: parseInt(tmdbIdMatch[1], 10) };

  // Extraer episodios
  const seasonRegex = /<a[^>]+href="([^"]+\/temporada-\d+)"/gi;
  const seasonLinks = [];
  let sMatch;
  while ((sMatch = seasonRegex.exec(html)) !== null) {
    let sLink = sMatch[1];
    if (!sLink.startsWith("http")) sLink = BASE_URL + sLink;
    if (!seasonLinks.includes(sLink)) seasonLinks.push(sLink);
  }

  const episodesList = [];
  const vistos = new Set();

  if (seasonLinks.length > 0) {
    const seasonHtmls = await Promise.all(
      seasonLinks.map(link => kino.fetch(link).then(r => r.ok ? r.text() : "").catch(() => ""))
    );
    for (const sHtml of seasonHtmls) {
      if (!sHtml) continue;
      const epRegex = /<a[^>]+href="([^"]+\/episodio-\d+x\d+)"[^>]*>([\s\S]*?)<\/a>/gi;
      let epMatch;
      while ((epMatch = epRegex.exec(sHtml)) !== null) {
        let epRef = epMatch[1];
        if (!epRef.startsWith("http")) epRef = BASE_URL + epRef;
        if (vistos.has(epRef)) continue;
        vistos.add(epRef);

        let season = 1, number = 1;
        const numMatch = epRef.match(/episodio-(\d+)x(\d+)/i);
        if (numMatch) {
          season = parseInt(numMatch[1], 10);
          number = parseInt(numMatch[2], 10);
        }

        const titleMatch = epMatch[2].match(/<span[^>]*>([^<]+)<\/span>/i) || epMatch[2].match(/alt="([^"]+)"/i);
        const imgMatch = epMatch[2].match(/src=(?:"([^"]+)"|([^ >]+))/i);

        let still = imgMatch ? (imgMatch[1] || imgMatch[2]) : null;
        if (still && still.startsWith("//")) still = "https:" + still;

        let rawTitle = titleMatch ? cleanText(titleMatch[1] || titleMatch[2]) : "";
        let epTitle = `Episodio ${number}`;

        // Usamos el título que venga, si es que Cuevana en algún momento decide ponerlos
        if (rawTitle && isNaN(rawTitle) && !rawTitle.toLowerCase().includes("episodio")) {
          epTitle = rawTitle;
        }

        const epObj = { season, number, ref: epRef, title: epTitle };
        if (still) epObj.still = still;
        episodesList.push(epObj);
      }
    }
  }

  // Si no hay episodios, es una película
  if (episodesList.length === 0) {
    episodesList.push({ season: 1, number: 1, ref: ref, title: "Reproducir Película" });
  }

  episodesList.sort((a, b) => (a.season - b.season) || (a.number - b.number));

  const result = { episodes: episodesList };

  // SOLUCIÓN: Empaquetar TODO en "series" como lo exige la app
  if (Object.keys(metadata).length > 0) {
    result.series = metadata;
  }

  return result;
}

export async function resolve(ref) {
  await null;

  // 1. Definimos el User-Agent robusto al inicio para usarlo en todas las peticiones
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  try {
    let targetUrl = ref;
    let selectedServer = null;
    if (ref.includes("|||")) {
      const parts = ref.split("|||");
      targetUrl = parts[0];
      selectedServer = parts[1];
    }

    // Aplicamos el nuevo UA a la petición principal
    const res1 = await kino.fetch(targetUrl, { headers: { "User-Agent": UA } });
    if (!res1.ok) throw kino.error("unavailable", "Fallo al contactar el servidor principal de Cuevana", { userMessage: "Cuevana no responde en este momento. Intenta de nuevo más tarde." });
    const html1 = await res1.text();

    let dynamicKey = 'a45f04ce-2394-47c3-b718-0ecd97ce51d6';
    const keyMatch = html1.match(/["']([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})["']/i);
    if (keyMatch) dynamicKey = keyMatch[1];

    const cuevanaWrappers = [];
    if (selectedServer) {
      let url = selectedServer;
      if (url.includes("?v=")) { try { url = base64Decode(url.split("?v=")[1]); } catch(e) {} }
      if (url.startsWith("//")) url = "https:" + url;
      cuevanaWrappers.push({ url, lang: "" });
    } else {
      const containerRegex = /class="tab-video-item">([\s\S]*?)<div[^>]*class="tab-item-name"[^>]*>\s*([^<\n]+)[\s\S]*?<ul>([\s\S]*?)<\/ul>/gi;
      let cMatch;
      let foundLangs = false;
      while ((cMatch = containerRegex.exec(html1)) !== null) {
        foundLangs = true;
        let langName = cleanText(cMatch[2]) || "Latino";
        const serversHtml = cMatch[3];
        const serverRegex = /data-server="([^"]+)"/g;
        let match;
        while ((match = serverRegex.exec(serversHtml)) !== null) {
          let url = match[1];
          if (url.includes("?v=")) { try { url = base64Decode(url.split("?v=")[1]); } catch(e) {} }
          if (url.startsWith("//")) url = "https:" + url;

          // 2. Quitamos el candado "tungtungsahur", aceptamos cualquier enlace web
          if (url.startsWith("http")) cuevanaWrappers.push({ url, lang: langName });
        }
      }

      if (!foundLangs) {
        const serverRegex = /data-server="([^"]+)"/g;
        let match;
        while ((match = serverRegex.exec(html1)) !== null) {
          let url = match[1];
          if (url.includes("?v=")) { try { url = base64Decode(url.split("?v=")[1]); } catch(e) {} }
          if (url.startsWith("//")) url = "https:" + url;

          // Quitamos el candado aquí también
          if (url.startsWith("http")) cuevanaWrappers.push({ url, lang: "Español" });
        }
      }
    }

    if (cuevanaWrappers.length === 0) throw kino.error("not_found", "No hay servidores disponibles", { userMessage: "No se encontraron servidores de video en la página." });

    let pref = "3";
    try { pref = kino.config.get("servidor_pref") ?? "3"; } catch(e) {}

    if (pref !== "cualquiera") {
      cuevanaWrappers.forEach((item, i) => item.index = i);
      cuevanaWrappers.sort((a, b) => {
        const indexA = (a.url.match(/token=([^&]+)/) || [])[1]?.[0];
        const indexB = (b.url.match(/token=([^&]+)/) || [])[1]?.[0];

        const isPrefA = indexA === pref ? 1 : 0;
        const isPrefB = indexB === pref ? 1 : 0;

        if (isPrefA !== isPrefB) return isPrefB - isPrefA;
        return a.index - b.index;
      });
    }

    const extractPromises = cuevanaWrappers.map(async (wrapper) => {
      try {
        const tokenMatch = wrapper.url.match(/token=([^&]+)/);
        if (!tokenMatch) return null;
        const token = tokenMatch[1];
        const serverIndex = token[0];
        const encodedData = token.slice(1);

        const serversDict = {
          '1': { baseUrl: 'https://lkhjerbhye3wjkhodvh5xiczuvd.lol/v/', name: 'Hyper' },
          '2': { baseUrl: 'https://filemoon.sx/e/', name: 'Filemoon' },
          '3': { baseUrl: 'https://lkhjerbhye3wjkhodvh5xlczuvd.lol/e/', name: 'Nebula' },
          '4': { baseUrl: 'https://dood.li/e/', name: 'Doodstream' }
        };

        if (!serversDict[serverIndex]) return null;
        const sInfo = serversDict[serverIndex];

        const decoded = base64Decode(encodedData);
        let decrypted = '';
        for (let i = 0; i < decoded.length; i++) {
          decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ dynamicKey.charCodeAt(i % dynamicKey.length));
        }

        const iframeUrl = sInfo.baseUrl + decrypted;
        const originMatch = iframeUrl.match(/^(https?:\/\/[^\/]+)/i);
        const originUrl = originMatch ? originMatch[1] : iframeUrl;

        let streamUrl = null;
        let streamHeaders = {
          "Referer": iframeUrl,
          "Origin": originUrl,
          "User-Agent": UA,
          "Accept": "*/*"
        };

        // --- PLAN A: Navegador Oculto al rescate primero ---
        try {
          const page = await kino.browser.capture(iframeUrl, {
            headers: { "Referer": wrapper.url },
            timeoutMs: 20000 // Le damos 20 segundos para atrapar el video
          });
          if (page && page.media && page.media.length > 0) {
            // Buscamos preferentemente el m3u8 o mp4
            const validMedia = page.media.find(m => m.url.includes('.m3u8') || m.url.includes('.mp4')) || page.media[0];
            streamUrl = validMedia.url;
            if (validMedia.headers) streamHeaders = validMedia.headers;
          }
        } catch(err) {}

        // --- PLAN B: Si el navegador oculto falla, usamos fetch y regex ---
        if (!streamUrl) {
          try {
            const res3 = await kino.fetch(iframeUrl, {
              headers: { "Referer": wrapper.url, "User-Agent": UA },
              timeoutMs: 8000
            });
            
            if (res3.ok) {
              const html3 = await res3.text();
              
              const findStreamInCode = (code) => {
                const streamFinal = code.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/i) || code.match(/(?:file|src|url)\s*:\s*["'](https?:\/\/[^"']+)["']/i);
                return streamFinal ? (streamFinal[1] || streamFinal[0]) : null;
              };

              const scripts = html3.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
              if (scripts) {
                for (const s of scripts) {
                  if (s.includes('eval(function(p,a,c,k,e,d)')) {
                    const scriptSospechoso = s.replace(/<script[^>]*>|<\/script>/gi, "").trim();
                    const packerMatch = scriptSospechoso.match(/eval\((function\(p,a,c,k,e,d\)[\s\S]+)\)/);
                    if (packerMatch) {
                      try {
                        const unpackedCode = new Function("return (" + packerMatch[1] + ");")();
                        streamUrl = findStreamInCode(unpackedCode);
                        if (streamUrl) break;
                      } catch (err) {}
                    }
                  } else {
                    streamUrl = findStreamInCode(s);
                    if (streamUrl) break;
                  }
                }
              }
              if (!streamUrl) streamUrl = findStreamInCode(html3);
            }
          } catch (e) {}
        }

        if (streamUrl) {
          if (streamUrl.includes('.urlset/master.m3u8')) {
            streamUrl = streamUrl.replace(/,[a-z,]+\.urlset\/master\.m3u8/, 'h/index.m3u8');
          }

          const finalLabel = wrapper.lang ? `${wrapper.lang} - ${sInfo.name}` : sInfo.name;

          return {
            label: finalLabel,
            url: streamUrl,
            signing: "request",
            headers: streamHeaders
          };
        }
        return null;
      } catch (innerError) { return null; }
    });

    const results = await Promise.all(extractPromises);

    const validStreams = [];
    const seenUrls = new Set();

    for (const res of results) {
      if (res && !seenUrls.has(res.url)) {
        seenUrls.add(res.url);
        validStreams.push(res);
      }
    }

    if (validStreams.length === 0) {
      throw kino.error("unavailable", "Se intentaron todos los servidores pero ninguno entregó el video.", { userMessage: "Los servidores de este video están inactivos por el momento."});
    }

    const primary = validStreams[0];
    const finalResponse = {
      url: primary.url,
      headers: primary.headers
    };

    if (validStreams.length > 1) {
      finalResponse.alternatives = validStreams.slice(1).map(s => ({
        label: s.label,
        url: s.url,
        headers: s.headers
      }));
    }

    return finalResponse;

  } catch (e) {
    if (e && e.code) throw e;
    throw kino.error("unavailable", String(e), { userMessage: "Hubo un problema cargando este contenido. Intenta de nuevo más tarde." });
  }
}
// NUEVA FUNCIÓN: El "Puente" corregido
export async function sign(url, data, ref, action) {
  // Kino nos pasa en 'data' todo el objeto que devolvimos en resolve().
  // Simplemente reciclamos esas mismas cabeceras perfectas para cada pedacito de video.
  return {
    headers: data ? data.headers : {}
  };
}
