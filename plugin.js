export const UA = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36";
const BASE_URL = "https://cuevana3r.pro";

function log(...args) {
  try { kino.log(...args); } catch { }
}

function cleanText(text) {
  if (!text) return "";
  let result = text
    .replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<[^>]*>/g, "")
    .trim();

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
    const [htmlPopulares, htmlPeliculas, htmlEstrenos] = await Promise.all([
      fetchPage("/tendencias"), fetchPage("/peliculas"), fetchPage("/")
    ]);
    const [htmlAccion, htmlComedia, htmlTerror, htmlAnimacion] = await Promise.all([
      fetchPage("/peliculas?genero=accion"), fetchPage("/peliculas?genero=comedia"),
      fetchPage("/peliculas?genero=terror"), fetchPage("/peliculas?genero=animacion")
    ]);
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

    if (estrenos.length > 0) rows.push({ id: "estrenos", title: "🔥 Estrenos Destacados", ref: "/", items: estrenos });
    if (populares.length > 0) rows.push({ id: "populares", title: "⭐ Películas Populares", ref: "/tendencias", items: populares });
    if (peliculas.length > 0) rows.push({ id: "peliculas", title: "🎬 Películas Agregadas", ref: "/peliculas", items: peliculas });
    if (accion.length > 0) rows.push({ id: "accion", title: "💥 Acción", ref: "/peliculas?genero=accion", items: accion });
    if (comedia.length > 0) rows.push({ id: "comedia", title: "😂 Comedia", ref: "/peliculas?genero=comedia", items: comedia });
    if (terror.length > 0) rows.push({ id: "terror", title: "👻 Terror", ref: "/peliculas?genero=terror", items: terror });
    if (animacion.length > 0) rows.push({ id: "animacion", title: "🎨 Animación", ref: "/peliculas?genero=animacion", items: animacion });
    if (anime.length > 0) rows.push({ id: "anime", title: "🎌 Anime", ref: "/peliculas?genero=anime", items: anime });
    if (cienciaFic.length > 0) rows.push({ id: "sci-fi", title: "🚀 Ciencia Ficción", ref: "/peliculas?genero=ciencia-ficcion", items: cienciaFic });
    if (suspenso.length > 0) rows.push({ id: "suspenso", title: "🔍 Suspenso", ref: "/peliculas?genero=suspenso", items: suspenso });
    if (drama.length > 0) rows.push({ id: "drama", title: "🎭 Drama", ref: "/peliculas?genero=drama", items: drama });

  } else if (chosen === "series") {
    const [htmlSeries, htmlHome] = await Promise.all([
      fetchPage("/series"), fetchPage("/")
    ]);
    const [htmlAccion, htmlComedia, htmlTerror, htmlAnimacion] = await Promise.all([
      fetchPage("/series?genero=accion"), fetchPage("/series?genero=comedia"),
      fetchPage("/series?genero=terror"), fetchPage("/series?genero=animacion")
    ]);
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

    if (series.length > 0) rows.push({ id: "series", title: "📺 Series Actualizadas", ref: "/series", items: series });
    if (episodios.length > 0) rows.push({ id: "episodios", title: "🆕 Últimos Episodios", ref: "/?tipo=episodios", items: episodios });
    if (accion.length > 0) rows.push({ id: "s-accion", title: "💥 Acción", ref: "/series?genero=accion", items: accion });
    if (comedia.length > 0) rows.push({ id: "s-comedia", title: "😂 Comedia", ref: "/series?genero=comedia", items: comedia });
    if (terror.length > 0) rows.push({ id: "s-terror", title: "👻 Terror", ref: "/series?genero=terror", items: terror });
    if (animacion.length > 0) rows.push({ id: "s-animacion",title: "🎨 Animación", ref: "/series?genero=animacion",items: animacion });
    if (anime.length > 0) rows.push({ id: "s-anime", title: "🎌 Anime", ref: "/series?genero=anime", items: anime });
    if (cienciaFic.length > 0) rows.push({ id: "s-sci-fi", title: "🚀 Ciencia Ficción", ref: "/series?genero=ciencia-ficcion", items: cienciaFic });
    if (suspenso.length > 0) rows.push({ id: "s-suspenso", title: "🔍 Suspenso", ref: "/series?genero=suspenso", items: suspenso });
    if (drama.length > 0) rows.push({ id: "s-drama", title: "🎭 Drama", ref: "/series?genero=drama", items: drama });
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

function extractItems(html, limit = 20, isEpisode = false) {
  if (!html) return [];
  const items = [];
  const vistos = new Set();

  // Si no queremos capturar el hero/slider horizontal como tarjeta de póster
  // aislamos las secciones de listado o evitamos elementos tipo banner
  const aRegex = /<a[^>]+href="([^"]+(?:\/pelicula\/|\/serie\/)[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = aRegex.exec(html)) !== null && items.length < limit) {
    let link = match[1];
    if (isEpisode) {
      if (!link.includes("episodio")) continue;
      link = link.replace(/\/episodio-\d+x\d+/i, "");
    } else {
      if (link.includes("episodio")) continue;
    }

    const innerHtml = match[2];
    
    // Ignoramos enlaces que correspondan al botón o cabecera gigante del banner principal
    if (innerHtml.includes("class=\"play-button\"") || innerHtml.includes("btn-play")) {
      continue;
    }

    const imgMatch = innerHtml.match(/(?:src|data-src|data-lazy)=(?:"([^"]+)"|([^ >]+))/i);
    const titleMatch = innerHtml.match(/<h2[^>]*>([^<]+)<\/h2>/i) || innerHtml.match(/alt="([^"]+)"/i);

    if (imgMatch && titleMatch && !vistos.has(link)) {
      vistos.add(link);
      let imgUrl = imgMatch[1] || imgMatch[2];
      if (imgUrl.startsWith("//")) imgUrl = "https:" + imgUrl;
      if (imgUrl.startsWith("/")) imgUrl = BASE_URL + imgUrl;

      // Obtener versión de mejor resolución si Cuevana usa miniaturas /w185/ o /w300/
      imgUrl = imgUrl.replace(/\/w\d+\//i, "/w500/").replace(/\/thumb\//i, "/original/");

      const fullLink = link.startsWith("http") ? link : `${BASE_URL}${link}`;
      
      const item = {
        id: "item-" + fullLink.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
        ref: fullLink,
        title: cleanText(titleMatch[1] || titleMatch[2]),
        kind: link.includes("/serie/") ? "series" : "movie"
      };

      if (isEpisode) {
        // En episodios la imagen original es horizontal (16:9 backdrop)
        item.backdrop = imgUrl;
        item.poster = imgUrl; // Kino usará backdrop si está en vista tarjeta
      } else {
        // En películas y series regulares es póster vertical
        item.poster = imgUrl;
        item.backdrop = imgUrl;
      }

      items.push(item);
    }
  }
  return items;
}

export async function home() {
  const fetchPage = async (path) => {
    try {
      const res = await kino.fetch(`${BASE_URL}${path}`, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return "";
      return await res.text();
    } catch (e) { return ""; }
  };

  const [htmlHome, htmlPeliculas, htmlSeries, htmlPopulares] = await Promise.all([
    fetchPage("/"),
    fetchPage("/peliculas"),
    fetchPage("/series"),
    fetchPage("/tendencias")
  ]);

  const estrenos = extractItems(htmlHome, 20, false);
  const ultimosEpisodios = extractItems(htmlHome, 20, true);
  const peliculas = extractItems(htmlPeliculas, 20, false);
  const series = extractItems(htmlSeries, 20, false);
  const populares = extractItems(htmlPopulares, 20, false);

  const categories = [];

  if (estrenos.length > 0) categories.push({ id: "estrenos", title: "🔥 Estrenos Destacados", ref: "/", items: estrenos });
  if (ultimosEpisodios.length > 0) categories.push({ id: "episodios", title: "🆕 Últimos Episodios", ref: "/?tipo=episodios", items: ultimosEpisodios });
  if (populares.length > 0) categories.push({ id: "populares", title: "⭐ Películas Populares", ref: "/tendencias", items: populares });
  if (peliculas.length > 0) categories.push({ id: "peliculas", title: "🎬 Películas Agregadas", ref: "/peliculas", items: peliculas });
  if (series.length > 0) categories.push({ id: "series", title: "📺 Series Actualizadas", ref: "/series", items: series });

  return categories;
}


// --- BROWSE UNIVERSAL CON PAGINACIÓN EXACTA DE CUEVANA ---
export async function browse(ref, cursor) {
  await null;

  if (!ref) throw kino.error("not_found", "Referencia no válida");

  const isEpisode = ref.includes("tipo=episodios") || ref.includes("episodios");
  let path = ref.replace("?tipo=episodios", "").replace("tipo=episodios", "");
  
  // Si la ruta base está vacía o es solo la barra, la ajustamos a la de episodios recientes si corresponde
  if (path === "/" && isEpisode) {
    path = "/episodios/recientes";
  }

  const page = cursor ? Number(cursor) : 1;

  let url = `${BASE_URL}${path}`;

  // Aplicamos la paginación tal como maneja Cuevana
  if (page > 1) {
    url += url.includes("?") ? `&page=${page}` : `?page=${page}`;
  }

  const res = await kino.fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw kino.error("not_found", "No se pudo cargar la página");

  const html = await res.text();
  const items = extractItems(html, 40, isEpisode);

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
      const item = {
        id: "item-" + fullLink.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
        ref: fullLink,
        title: cleanText(titleMatch[1] || titleMatch[2]),
        kind: link.includes("/serie/") ? "series" : "movie",
        poster
      };
      if (yearMatch) item.year = parseInt(yearMatch[1], 10);
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

  const descMatch = html.match(/class="Description"[^>]*>([\s\S]*?)<\/div>/i) || html.match(/<p[^>]*>\s*([^<]{30,})\s*<\/p>/i);
  if (descMatch) metadata.overview = cleanText(descMatch[1]);

  const voteMatch = html.match(/<span[^>]+class="Num"[^>]*>([\d.]+)<\/span>/i) || html.match(/class="Vote"[^>]*>\s*([\d.]+)\s*</i) || html.match(/class="AAIco-star"[^>]*>.*?<\/i>\s*([\d.]+)/i);
  if (voteMatch) metadata.rating = parseFloat(voteMatch[1]);

  const gRegex = /<a[^>]+href="[^"]*genero[^"]*"[^>]*>\s*([^<]+)\s*<\/a>/gi;
  let gm;
  const genres = [];
  while ((gm = gRegex.exec(html)) !== null) {
    genres.push(cleanText(gm[1]));
  }
  if (genres.length > 0) metadata.genres = [...new Set(genres)];

  const yearMatch = html.match(/class="Date"[^>]*>\s*(\d{4})\s*</i) ||
    html.match(/>(19\d{2}|20\d{2})<\/(?:span|p|a)>/i) ||
    html.match(/Estreno:\s*(\d{4})/i) ||
    html.match(/<span class="Year">(\d{4})<\/span>/i);
  if (yearMatch) metadata.year = parseInt(yearMatch[1], 10);

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

        if (rawTitle && isNaN(rawTitle) && !rawTitle.toLowerCase().includes("episodio")) {
          epTitle = rawTitle;
        }

        const epObj = { season, number, ref: epRef, title: epTitle };
        if (still) epObj.still = still;
        episodesList.push(epObj);
      }
    }
  }

  if (episodesList.length === 0) {
    episodesList.push({ season: 1, number: 1, ref: ref, title: "Reproducir Película" });
  }

  episodesList.sort((a, b) => (a.season - b.season) || (a.number - b.number));

  const result = { episodes: episodesList };

  if (Object.keys(metadata).length > 0) {
    result.series = metadata;
  }

  return result;
}

export async function resolve(ref) {
  await null;

  try {
    let targetUrl = ref;
    let selectedServer = null;
    if (ref.includes("|||")) {
      const parts = ref.split("|||");
      targetUrl = parts[0];
      selectedServer = parts[1];
    }

    const res1 = await kino.fetch(targetUrl, { headers: { "User-Agent": UA } });
    if (!res1.ok) throw kino.error("unavailable", "Fallo al contactar el servidor principal de Cuevana", { userMessage: "Cuevana no responde en este momento." });
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
          if (url.startsWith("http")) cuevanaWrappers.push({ url, lang: "Español" });
        }
      }
    }

    if (cuevanaWrappers.length === 0) throw kino.error("not_found", "No hay servidores disponibles", { userMessage: "No se encontraron servidores de video." });

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

        try {
          const page = await kino.browser.capture(iframeUrl, {
            headers: { "Referer": wrapper.url },
            timeoutMs: 20000
          });
          if (page && page.media && page.media.length > 0) {
            const validMedia = page.media.find(m => m.url.includes('.m3u8') || m.url.includes('.mp4')) || page.media[0];
            streamUrl = validMedia.url;
            if (validMedia.headers) streamHeaders = validMedia.headers;
          }
        } catch(err) {}

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
      throw kino.error("unavailable", "Se intentaron todos los servidores pero ninguno entregó el video.", { userMessage: "Los servidores de este video están inactivos." });
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
    throw kino.error("unavailable", String(e), { userMessage: "Hubo un problema cargando este contenido." });
  }
}

export async function sign(url, data, ref, action) {
  return {
    headers: data ? data.headers : {}
  };
}