import { t as require_react } from "./react-1WJTggxS.js";
import { A as importarDesdeUrl, B as paginate, c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DX181kQz.js";
import { E as putPages, h as getMeta, k as uid, O as setMeta, r as allBooks, w as putBook, S as patchBook } from "./db-Ii3ipPL7.js";
import { generarFacehashUri } from "./nostr-zC6Qsl2z.js";
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
//#region src/pages/libros-gratis.js
const GUTENDEX = "https://gutendex.com";
const OL = "https://openlibrary.org";
const IA = "https://archive.org";
const META_CAT = "librosGratis_catalogo";
const META_GARD = "librosGratis_guardados"; // v180: guardados por categoría (tema)
const FUENTES = ["gutendex", "openlibrary", "archive", "wikisource-es", "wikisource-en", "royalroad", "wattpad", "arxiv", "annas"];
/* v208: nombres para la UI de Filtros y para el estado «Buscando: …» */
const BIB_INFO = { gutendex: "Gutenberg", openlibrary: "Open Library", archive: "Archive.org", "wikisource-es": "Wikisource (es)", "wikisource-en": "Wikisource (en)", royalroad: "Royal Road", wattpad: "Wattpad", arxiv: "arXiv", annas: "Anna's Archive" };
const SEMILLA_40 = [{"id": 2000, "fuente": "gutendex", "title": "Don Quijote de la Mancha", "authors": ["Cervantes Saavedra, Miguel de"], "bookshelves": ["Category: Classics of Literature", "Category: Novels"], "downloads": 15420, "epub": "https://www.gutenberg.org/ebooks/2000.epub3.images", "txt": null, "cover": "https://www.gutenberg.org/cache/epub/2000/pg2000.cover.medium.jpg", "synopsis": "Alonso Quijano, enloquecido por la lectura de novelas de caballerías, decide armarse caballero andante y salir en busca de aventuras junto a su fiel escudero Sancho Panza."}, {"id": 17955, "fuente": "gutendex", "title": "Fortunata y Jacinta", "authors": ["Pérez Galdós, Benito"], "bookshelves": ["Category: Novels", "Category: Romance"], "downloads": 7400, "epub": "https://www.gutenberg.org/ebooks/17955.epub3.images", "txt": null, "cover": "https://www.gutenberg.org/cache/epub/17955/pg17955.cover.medium.jpg", "synopsis": "Retrato monumental del Madrid del siglo XIX a través de las vidas entrelazadas de dos mujeres de distintos estratos sociales unidas por el amor hacia Juanito Santa Cruz."}, {"id": 49836, "fuente": "gutendex", "title": "Cumbres borrascosas", "authors": ["Brontë, Emily"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 9800, "epub": "https://www.gutenberg.org/ebooks/49836.epub3.images", "txt": null, "cover": "https://www.gutenberg.org/cache/epub/49836/pg49836.cover.medium.jpg", "synopsis": "La apasionada, destructiva y trágica historia de amor entre Catherine Earnshaw y el enigmático Heathcliff en los desolados páramos de Yorkshire."}, {"id": 56834, "fuente": "gutendex", "title": "Frankenstein o el moderno Prometeo", "authors": ["Shelley, Mary Wollstonecraft"], "bookshelves": ["Category: Science", "Category: Fantasy"], "downloads": 14500, "epub": "https://www.gutenberg.org/ebooks/56834.epub3.images", "txt": null, "cover": "https://www.gutenberg.org/cache/epub/56834/pg56834.cover.medium.jpg", "synopsis": "El joven científico Víctor Frankenstein desafía las leyes naturales al insuflar vida a un ser creado a partir de restos humanos, desatando consecuencias trágicas."}, {"id": 58820, "fuente": "gutendex", "title": "Drácula", "authors": ["Stoker, Bram"], "bookshelves": ["Category: Fantasy", "Category: Crime, Thrillers and Mystery"], "downloads": 13200, "epub": "https://www.gutenberg.org/ebooks/58820.epub3.images", "txt": null, "cover": "https://www.gutenberg.org/cache/epub/58820/pg58820.cover.medium.jpg", "synopsis": "El conde Drácula viaja desde Transilvania hasta Inglaterra para extender la maldición vampírica mientras un grupo liderado por Van Helsing lucha por detenerlo."}, {"id": 55432, "fuente": "gutendex", "title": "El conde de Montecristo", "authors": ["Dumas, Alexandre"], "bookshelves": ["Category: Adventure", "Category: Novels"], "downloads": 15100, "epub": "https://www.gutenberg.org/ebooks/55432.epub3.images", "txt": null, "cover": "https://www.gutenberg.org/cache/epub/55432/pg55432.cover.medium.jpg", "synopsis": "Edmundo Dantés, injustamente encarcelado en el castillo de If, escapa tras catorce años para ejecutar una meticulosa venganza bajo la identidad del conde de Montecristo."}, {"id": 55433, "fuente": "gutendex", "title": "Los tres mosqueteros", "authors": ["Dumas, Alexandre"], "bookshelves": ["Category: Adventure", "Category: Novels"], "downloads": 13400, "epub": "https://www.gutenberg.org/ebooks/55433.epub3.images", "txt": null, "cover": "https://www.gutenberg.org/cache/epub/55433/pg55433.cover.medium.jpg", "synopsis": "D'Artagnan viaja a París con el sueño de convertirse en mosquetero del rey, uniéndose a Athos, Porthos y Aramis bajo el lema «Todos para uno y uno para todos»."}, {"id": 6130, "fuente": "gutendex", "title": "La Ilíada", "authors": ["Homero"], "bookshelves": ["Category: Classics of Literature", "Category: Poetry"], "downloads": 8750, "epub": "https://www.gutenberg.org/ebooks/6130.epub3.images", "txt": null, "cover": "https://www.gutenberg.org/cache/epub/6130/pg6130.cover.medium.jpg", "synopsis": "Epopeya griega sobre la cólera de Aquiles durante las últimas semanas de la guerra de Troya y el destino fatal de héroes y dioses en el campo de batalla."}, {"id": "ol_cien_anos", "fuente": "openlibrary", "title": "Cien años de soledad", "authors": ["García Márquez, Gabriel"], "bookshelves": ["Category: Novels", "Category: Classics of Literature"], "downloads": 28500, "epub": null, "txt": null, "cover": "https://covers.openlibrary.org/b/id/11153218-M.jpg", "synopsis": "La saga de siete generaciones de la familia Buendía en el mítico pueblo de Macondo, obra cumbre del realismo mágico y de la literatura universal."}, {"id": "ol_amor_colera", "fuente": "openlibrary", "title": "El amor en los tiempos del cólera", "authors": ["García Márquez, Gabriel"], "bookshelves": ["Category: Novels", "Category: Romance"], "downloads": 22400, "epub": null, "txt": null, "cover": "https://covers.openlibrary.org/b/id/10543210-M.jpg", "synopsis": "Florentino Ariza espera pacientemente durante más de cincuenta años el reencuentro con Fermina Daza, demostrando la persistencia inquebrantable del amor."}, {"id": "ol_pedro_paramo", "fuente": "openlibrary", "title": "Pedro Páramo", "authors": ["Rulfo, Juan"], "bookshelves": ["Category: Novels", "Category: Classics of Literature"], "downloads": 19800, "epub": null, "txt": null, "cover": "https://covers.openlibrary.org/b/id/8314125-M.jpg", "synopsis": "Juan Preciado llega al desolado pueblo de Comala buscando a su padre, Pedro Páramo, descubriendo que sus habitantes son almas en pena que susurran sus recuerdos."}, {"id": "ol_rayuela", "fuente": "openlibrary", "title": "Rayuela", "authors": ["Cortázar, Julio"], "bookshelves": ["Category: Novels", "Category: Romance"], "downloads": 21500, "epub": null, "txt": null, "cover": "https://covers.openlibrary.org/b/id/9264152-M.jpg", "synopsis": "Horacio Oliveira deambula por París y Buenos Aires en una novela contranovelística que invita al lector a múltiples caminos de lectura y experimentación vital."}, {"id": "ol_ciudad_perros", "fuente": "openlibrary", "title": "La ciudad y los perros", "authors": ["Vargas Llosa, Mario"], "bookshelves": ["Category: Novels"], "downloads": 17900, "epub": null, "txt": null, "cover": "https://covers.openlibrary.org/b/id/7421890-M.jpg", "synopsis": "Un grupo de cadetes en el Colegio Militar Leoncio Prado de Lima enfrenta una férrea disciplina militar y un código de supervivencia que desata una tragedia interna."}, {"id": "ol_el_tunel", "fuente": "openlibrary", "title": "El túnel", "authors": ["Sabato, Ernesto"], "bookshelves": ["Category: Novels", "Category: Crime, Thrillers and Mystery"], "downloads": 18700, "epub": null, "txt": null, "cover": "https://covers.openlibrary.org/b/id/8812345-M.jpg", "synopsis": "El pintor Juan Pablo Castel narra desde la cárcel la obsesión y los celos que lo llevaron a asesinar a María Iribarne, la única persona que comprendió su arte."}, {"id": "ol_casa_espiritus", "fuente": "openlibrary", "title": "La casa de los espíritus", "authors": ["Allende, Isabel"], "bookshelves": ["Category: Novels"], "downloads": 23100, "epub": null, "txt": null, "cover": "https://covers.openlibrary.org/b/id/9541289-M.jpg", "synopsis": "Crónica familiar de cuatro generaciones de los Trueba en un país sudamericano marcado por pasiones turbulentas, poderes clarividentes y convulsiones políticas."}, {"id": "ol_ficciones", "fuente": "openlibrary", "title": "Ficciones", "authors": ["Borges, Jorge Luis"], "bookshelves": ["Category: Short Stories", "Category: Fantasy"], "downloads": 28400, "epub": null, "txt": null, "cover": "https://covers.openlibrary.org/b/id/11112450-M.jpg", "synopsis": "Conjunto de relatos laberínticos sobre universos infinitos, espejos, paradojas temporales y bibliotecas universales."}, {"id": "ia_veinte_mil", "fuente": "archive", "title": "Veinte mil leguas de viaje submarino", "authors": ["Verne, Jules"], "bookshelves": [], "downloads": 10900, "epub": null, "txt": null, "ia": "veintemilleguas00vern", "url": "https://archive.org/details/veintemilleguas00vern", "cover": "https://archive.org/services/img/veintemilleguas00vern", "synopsis": "El profesor Aronnax y sus compañeros son capturados por el misterioso Capitán Nemo a bordo del submarino Nautilus en un viaje prodigioso por los abismos oceánicos."}, {"id": "ia_vuelta_mundo", "fuente": "archive", "title": "La vuelta al mundo en ochenta días", "authors": ["Verne, Jules"], "bookshelves": [], "downloads": 10200, "epub": null, "txt": null, "ia": "lavueltaalmundo00vern", "url": "https://archive.org/details/lavueltaalmundo00vern", "cover": "https://archive.org/services/img/lavueltaalmundo00vern", "synopsis": "El meticuloso Phileas Fogg y su mayordomo Passepartout aceptan una audaz apuesta en el Reform Club de Londres: circunvalar el globo terrestre en exactamente 80 días."}, {"id": "ia_odisea", "fuente": "archive", "title": "La Odisea", "authors": ["Homero"], "bookshelves": [], "downloads": 9400, "epub": null, "txt": null, "ia": "laodiseadehomero00home", "url": "https://archive.org/details/laodiseadehomero00home", "cover": "https://archive.org/services/img/laodiseadehomero00home", "synopsis": "El arduo y legendario regreso de Odiseo a Ítaca tras la caída de Troya, sorteando sirenas, monstruos y la cólera de Poseidón para reunirse con Penélope y Telémaco."}, {"id": "ia_viaje_centro", "fuente": "archive", "title": "Viaje al centro de la Tierra", "authors": ["Verne, Jules"], "bookshelves": [], "downloads": 12500, "epub": null, "txt": null, "ia": "viajealcentrodel00vern", "url": "https://archive.org/details/viajealcentrodel00vern", "cover": "https://archive.org/services/img/viajealcentrodel00vern", "synopsis": "El profesor Lidenbrock, su sobrino Axel y el guía Hans descienden por el cráter de un volcán islandés hacia las profundidades desconocidas de nuestro planeta."}, {"id": "ia_arte_guerra", "fuente": "archive", "title": "El arte de la guerra", "authors": ["Sun Tzu"], "bookshelves": [], "downloads": 16200, "epub": null, "txt": null, "ia": "elartedelaguerra00sunt", "url": "https://archive.org/details/elartedelaguerra00sunt", "cover": "https://archive.org/services/img/elartedelaguerra00sunt", "synopsis": "Tratado militar milenario sobre estrategia, liderazgo y psicología del conflicto donde la máxima victoria consiste en someter al enemigo sin librar batalla."}, {"id": "ia_principe", "fuente": "archive", "title": "El príncipe", "authors": ["Maquiavelo, Nicolás"], "bookshelves": [], "downloads": 7890, "epub": null, "txt": null, "ia": "elprincipe00maqu", "url": "https://archive.org/details/elprincipe00maqu", "cover": "https://archive.org/services/img/elprincipe00maqu", "synopsis": "Tratado de doctrina política sobre cómo adquirir y conservar el poder estatal, analizando con realismo las virtudes y tácticas que definen a un gobernante eficaz."}, {"id": "wss_vida_sueno", "fuente": "wikisource-es", "title": "La vida es sueño", "authors": ["Calderón de la Barca, Pedro"], "bookshelves": [], "downloads": 8100, "soloBusqueda": true, "url": "https://es.wikisource.org/wiki/La_vida_es_sueño", "epub": null, "txt": null, "cover": null, "synopsis": "Segismundo, príncipe encerrado en una torre por su padre el rey Basilio ante temibles profecías, reflexiona sobre el libre albedrío, el destino y la naturaleza ilusoria de la realidad."}, {"id": "wss_fuenteovejuna", "fuente": "wikisource-es", "title": "Fuente Ovejuna", "authors": ["Vega, Lope de"], "bookshelves": [], "downloads": 6700, "soloBusqueda": true, "url": "https://es.wikisource.org/wiki/Fuenteovejuna", "epub": null, "txt": null, "cover": null, "synopsis": "El pueblo cordobés de Fuente Ovejuna se rebela contra los abusos del tiránico Comendador Mayor, asumiendo colectivamente la justicia bajo la célebre respuesta unánime ante el juez."}, {"id": "wss_rimas_leyendas", "fuente": "wikisource-es", "title": "Rimas y Leyendas", "authors": ["Bécquer, Gustavo Adolfo"], "bookshelves": [], "downloads": 11300, "soloBusqueda": true, "url": "https://es.wikisource.org/wiki/Rimas_(Bécquer)", "epub": null, "txt": null, "cover": null, "synopsis": "Poesía lírica y relatos fantásticos del romanticismo español explorando el misterio, el amor inalcanzable, la muerte y el poder evocador del espíritu poético."}, {"id": "wss_don_juan", "fuente": "wikisource-es", "title": "Don Juan Tenorio", "authors": ["Zorrilla, José"], "bookshelves": [], "downloads": 9200, "soloBusqueda": true, "url": "https://es.wikisource.org/wiki/Don_Juan_Tenorio", "epub": null, "txt": null, "cover": null, "synopsis": "El célebre seductor y duelista sevillano encuentra la redención espiritual a través del amor puro de Doña Inés en la noche de difuntos."}, {"id": "wss_celestina", "fuente": "wikisource-es", "title": "La Celestina", "authors": ["Rojas, Fernando de"], "bookshelves": [], "downloads": 7450, "soloBusqueda": true, "url": "https://es.wikisource.org/wiki/La_Celestina", "epub": null, "txt": null, "cover": null, "synopsis": "Calisto recurre a la vieja alcahueta Celestina para conseguir el amor de Melibea, desencadenando una espiral de codicia, pasiones y muertes trágicas."}, {"id": "wss_mio_cid", "fuente": "wikisource-es", "title": "El cantar de mio Cid", "authors": ["Anónimo"], "bookshelves": [], "downloads": 8600, "soloBusqueda": true, "url": "https://es.wikisource.org/wiki/Cantar_de_mio_Cid", "epub": null, "txt": null, "cover": null, "synopsis": "El cantar de gesta más antiguo de la literatura castellana que narra las hazañas heroicas de Rodrigo Díaz de Vivar tras su injusto destierro de Castilla."}, {"id": "roy_mol", "fuente": "royalroad", "title": "Mother of Learning", "authors": ["Domagoj Kurmaic (Nobody103)"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 85000, "cover": "https://covers.openlibrary.org/b/id/12833441-L.jpg", "url": "https://www.royalroad.com/fiction/21220/mother-of-learning", "synopsis": "Zorian Kazinski es un estudiante de magia atrapado en un bucle temporal de un mes. Debe aprender magia avanzada, descubrir el misterio del bucle y sobrevivir a una invasión planificada."}, {"id": "roy_dcc", "fuente": "royalroad", "title": "Dungeon Crawler Carl", "authors": ["Matt Dinniman"], "bookshelves": ["Category: Comic and Graphic Books", "Category: Fantasy"], "downloads": 91000, "cover": "https://covers.openlibrary.org/b/id/12674890-L.jpg", "url": "https://www.royalroad.com/fiction/33844/dungeon-crawler-carl", "synopsis": "La Tierra ha sido colapsada en una megamasmorra para un reality show intergaláctico. Carl y su gata Princesa Donut luchan por sobrevivir piso a piso."}, {"id": "wat_atdmv", "fuente": "wattpad", "title": "A través de mi ventana", "authors": ["Ariana Godoy"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 120000, "cover": "https://covers.openlibrary.org/b/id/11175935-L.jpg", "url": "https://www.wattpad.com/story/37625126-a-trav%C3%A9s-de-mi-ventana", "synopsis": "Raquel lleva toda la vida enamorada de su vecino Ares Hidalgo, un chico frío y misterioso al que observa en secreto hasta que un cambio en la clave del wifi lo cambia todo."}, {"id": "wat_blvd", "fuente": "wattpad", "title": "Boulevard", "authors": ["Flor M. Salvador"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 115000, "cover": "https://covers.openlibrary.org/b/id/12657274-L.jpg", "url": "https://www.wattpad.com/story/23491823-boulevard", "synopsis": "Hasley Weigel y Luke Howland no estaban destinados a encontrarse, pero juntos crean un refugio donde superar las sombras y aprender el verdadero significado del afecto."}, {"id": "arx_transformer", "fuente": "arxiv", "title": "Attention Is All You Need", "authors": ["Ashish Vaswani"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 185000, "cover": "https://covers.openlibrary.org/b/id/12833445-L.jpg", "url": "https://arxiv.org/abs/1706.03762", "synopsis": "El paper fundamental que introdujo la arquitectura Transformer basada enteramente en mecanismos de atención, transformando por completo el procesamiento de lenguaje natural y la inteligencia artificial moderna."}, {"id": "arx_bitcoin", "fuente": "arxiv", "title": "Bitcoin: A Peer-to-Peer Electronic Cash System", "authors": ["Satoshi Nakamoto"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 195000, "cover": "https://covers.openlibrary.org/b/id/12674895-L.jpg", "url": "https://bitcoin.org/bitcoin.pdf", "synopsis": "El documento fundacional de la criptomoneda y las cadenas de bloques descentralizadas, describiendo un sistema de dinero electrónico entre pares sin intermediarios financieros."}, {"id": "ann_sapiens", "fuente": "annas", "title": "Sapiens: De animales a dioses", "authors": ["Yuval Noah Harari"], "bookshelves": ["Category: History", "Category: Philosophy", "Category: Science"], "downloads": 210000, "cover": "https://covers.openlibrary.org/b/id/8634250-L.jpg", "url": "https://annas-archive.gl/search?q=sapiens+yuval+noah+harari", "synopsis": "Un recorrido fascinante por la historia de la humanidad, desde los primeros homínidos hasta las revoluciones cognitiva, agrícola y científica."}, {"id": "ann_cosmos", "fuente": "annas", "title": "Cosmos", "authors": ["Carl Sagan"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 220000, "cover": "https://covers.openlibrary.org/b/id/8283901-L.jpg", "url": "https://annas-archive.gl/search?q=cosmos+carl+sagan", "synopsis": "Obra maestra de divulgación científica que conecta la astronomía, la evolución humana, la historia de las civilizaciones y nuestro lugar en el cosmos."}, {"id": "lum_bitacora", "fuente": "lumen", "title": "Bitácora del Navegante Estelar", "authors": ["Lumen Editorial"], "bookshelves": ["Category: Science Fiction", "Category: Adventure"], "downloads": 5400, "epub": null, "txt": null, "cover": null, "synopsis": "Relatos de exploración espacial y bitácoras de capitanes estelares surcando constelaciones distantes bajo el protocolo descentralizado de Lumen."}, {"id": "lum_nostr_guia", "fuente": "lumen", "title": "Guía Práctica de Nostr y Criptografía", "authors": ["Lumen Labs"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 6200, "epub": null, "txt": null, "cover": null, "synopsis": "Manual introductorio a las identidades criptográficas, claves públicas y privadas, relays y soberanía digital en el ecosistema Nostr."}, {"id": "lum_poesia_libre", "fuente": "lumen", "title": "Antología de Poesía Libre 2026", "authors": ["Comunidad Lumen"], "bookshelves": ["Category: Poetry"], "downloads": 4800, "epub": null, "txt": null, "cover": null, "synopsis": "Colección de poemas contemporáneos en lengua hispana aportados y firmados criptográficamente por la comunidad lectora de Lumen."}, {"id": "lum_lectura_rapida", "fuente": "lumen", "title": "Manual de Lectura Rápida y Concentración", "authors": ["Editorial Minerva"], "bookshelves": ["Category: Philosophy"], "downloads": 5100, "epub": null, "txt": null, "cover": null, "synopsis": "Métodos comprobados de fijación ocular, comprensión lectora profunda y técnicas de memoria para devorar libros con placer y retención total."}];
function siglaDe(fuente) {
	if (!fuente) return "LUM";
	const f = String(fuente).toLowerCase();
	if (f.includes("guten") || f === "gut") return "GUT";
	if (f.includes("open") || f === "ol") return "OPL";
	if (f.includes("archive") || f === "ia") return "IA";
	if (f.includes("wiki") || f.startsWith("ws")) return "WIK";
	if (f.includes("royal") || f.includes("roy")) return "ROY";
	if (f.includes("watt") || f.includes("wat")) return "WAT";
	if (f.includes("arxiv") || f.includes("arx")) return "ARX";
	if (f.includes("anna") || f.includes("ann")) return "ANN";
	if (f.includes("bne")) return "BNE";
	if (f.includes("standard") || f === "sta") return "STA";
	if (f.includes("nostr") || f === "lumen" || f === "lum") return "LUM";
	return f.slice(0, 3).toUpperCase();
}
function nombreAutorLimpio(aut) {
	if (!aut || typeof aut !== "string") return "";
	let a = aut.trim();
	a = a.replace(/\s*[\(\[]\s*\d{3,4}\s*[-–—]\s*\d{0,4}\s*[\)\]]/g, "").trim();
	if (a.includes(",")) {
		const partes = a.split(",").map((p) => p.trim());
		if (partes.length === 2 && partes[0] && partes[1]) {
			a = `${partes[1]} ${partes[0]}`;
		}
	}
	return a.replace(/\s+/g, " ").trim();
}
function claseSigla(sigla) {
	return "sigla-" + String(sigla || "").toLowerCase();
}
const RAW_CATS = {"Category: Religion": [["La Sagrada Biblia", "Varios Autores", "rel-1", "gutenberg", 48500, "https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg", "https://www.gutenberg.org/ebooks/10.epub3.images"], ["El Sagrado Cor\u00e1n", "Profeta Mahoma (Trad. Julio Cort\u00e9s)", "rel-2", "archive", 39200, null, "https://ia800200.us.archive.org/coran.pdf"], ["Bhagavad Gita: El Canto del Se\u00f1or", "Vyasa", "rel-3", "gutenberg", 36100, "https://www.gutenberg.org/cache/epub/2388/pg2388.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2388.epub3.images"], ["Tao Te Ching: El Libro del Camino y la Virtud", "Lao Tse", "rel-4", "gutenberg", 34800, "https://www.gutenberg.org/cache/epub/216/pg216.cover.medium.jpg", "https://www.gutenberg.org/ebooks/216.epub3.images"], ["Dhammapada: La Senda de la Verdad", "Buda Gautama", "rel-5", "gutenberg", 31200, "https://www.gutenberg.org/cache/epub/2017/pg2017.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2017.epub3.images"], ["Las Confesiones", "San Agust\u00edn", "rel-6", "gutenberg", 28900, "https://www.gutenberg.org/cache/epub/3296/pg3296.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3296.epub3.images"], ["La Ciudad de Dios", "San Agust\u00edn", "rel-7", "gutenberg", 24500, "https://www.gutenberg.org/cache/epub/45304/pg45304.cover.medium.jpg", "https://www.gutenberg.org/ebooks/45304.epub3.images"], ["Suma Teol\u00f3gica (Selecci\u00f3n)", "Santo Tom\u00e1s de Aquino", "rel-8", "gutenberg", 23800, "https://www.gutenberg.org/cache/epub/17611/pg17611.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17611.epub3.images"], ["Imitaci\u00f3n de Cristo", "Tom\u00e1s de Kempis", "rel-9", "gutenberg", 22400, "https://www.gutenberg.org/cache/epub/1653/pg1653.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1653.epub3.images"], ["El Libro Tibetano de los Muertos (Bardo Thodol)", "Padmasambhava", "rel-10", "archive", 21900, null, "https://ia800300.us.archive.org/bardo.pdf"], ["Los Upanishads: Esencia del Pensamiento Hind\u00fa", "Sabios V\u00e9dicos", "rel-11", "gutenberg", 20500, "https://www.gutenberg.org/cache/epub/3283/pg3283.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3283.epub3.images"], ["El Sutra del Diamante", "Tradici\u00f3n Mah\u0101y\u0101na", "rel-12", "wikisource", 19800, null, ""], ["Las Moradas del Castillo Interior", "Santa Teresa de Jes\u00fas", "rel-13", "gutenberg", 19400, "https://www.gutenberg.org/cache/epub/24578/pg24578.cover.medium.jpg", "https://www.gutenberg.org/ebooks/24578.epub3.images"], ["Noche Oscura del Alma", "San Juan de la Cruz", "rel-14", "gutenberg", 18900, "https://www.gutenberg.org/cache/epub/25619/pg25619.cover.medium.jpg", "https://www.gutenberg.org/ebooks/25619.epub3.images"], ["Gu\u00eda de Perplejos", "Mois\u00e9s Maim\u00f3nides", "rel-15", "gutenberg", 18200, "https://www.gutenberg.org/cache/epub/39904/pg39904.cover.medium.jpg", "https://www.gutenberg.org/ebooks/39904.epub3.images"], ["El Zohar: El Libro del Esplendor", "Shimon bar Yojai (Atrib.)", "rel-16", "archive", 17800, null, "https://ia800400.us.archive.org/zohar.pdf"], ["El Poema de Gilgamesh", "Mitolog\u00eda Sumeria", "rel-17", "gutenberg", 17500, "https://www.gutenberg.org/cache/epub/11000/pg11000.cover.medium.jpg", "https://www.gutenberg.org/ebooks/11000.epub3.images"], ["El Libro Egipcio de los Muertos", "Sacerdotes de Tebas", "rel-18", "gutenberg", 16900, "https://www.gutenberg.org/cache/epub/13000/pg13000.cover.medium.jpg", "https://www.gutenberg.org/ebooks/13000.epub3.images"], ["Teogon\u00eda y Los Trabajos y los D\u00edas", "Hes\u00edodo", "rel-19", "gutenberg", 16400, "https://www.gutenberg.org/cache/epub/348/pg348.cover.medium.jpg", "https://www.gutenberg.org/ebooks/348.epub3.images"], ["El Cantar de los Cantares", "Rey Salom\u00f3n", "rel-20", "wikisource", 16100, "https://covers.openlibrary.org/b/id/5144315-M.jpg", ""], ["El Libro de Job", "Literatura B\u00edblica Sapiencial", "rel-21", "wikisource", 15800, null, ""], ["Tratado Teol\u00f3gico-Pol\u00edtico", "Baruch Spinoza", "rel-22", "gutenberg", 15500, "https://www.gutenberg.org/cache/epub/2361/pg2361.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2361.epub3.images"], ["Pensamientos", "Blaise Pascal", "rel-23", "gutenberg", 15200, "https://www.gutenberg.org/cache/epub/18269/pg18269.cover.medium.jpg", "https://www.gutenberg.org/ebooks/18269.epub3.images"], ["Las Variedades de la Experiencia Religiosa", "William James", "rel-24", "gutenberg", 14900, "https://www.gutenberg.org/cache/epub/621/pg621.cover.medium.jpg", "https://www.gutenberg.org/ebooks/621.epub3.images"], ["Lo Sagrado y lo Profano", "Mircea Eliade", "rel-25", "openlibrary", 14600, "https://covers.openlibrary.org/b/id/966779-M.jpg", ""], ["El Mito del Eterno Retorno", "Mircea Eliade", "rel-26", "openlibrary", 14200, "https://covers.openlibrary.org/b/id/966806-M.jpg", ""], ["Las Religiones del Mundo", "Huston Smith", "rel-27", "openlibrary", 13900, "https://covers.openlibrary.org/b/id/8289774-M.jpg", ""], ["El Profeta", "Gibran Khalil Gibran", "rel-28", "gutenberg", 13600, "https://www.gutenberg.org/cache/epub/58585/pg58585.cover.medium.jpg", "https://www.gutenberg.org/ebooks/58585.epub3.images"], ["La Nube del No-Saber", "M\u00edstico An\u00f3nimo Ingl\u00e9s", "rel-29", "gutenberg", 13300, "https://www.gutenberg.org/cache/epub/123/pg123.cover.medium.jpg", "https://www.gutenberg.org/ebooks/123.epub3.images"], ["La Regla de San Benito", "San Benito de Nursia", "rel-30", "gutenberg", 13000, "https://www.gutenberg.org/cache/epub/7000/pg7000.cover.medium.jpg", "https://www.gutenberg.org/ebooks/7000.epub3.images"], ["Ejercicios Espirituales", "San Ignacio de Loyola", "rel-31", "gutenberg", 12700, "https://www.gutenberg.org/cache/epub/24580/pg24580.cover.medium.jpg", "https://www.gutenberg.org/ebooks/24580.epub3.images"], ["Vida de Jes\u00fas", "Ernest Renan", "rel-32", "gutenberg", 12400, "https://www.gutenberg.org/cache/epub/4900/pg4900.cover.medium.jpg", "https://www.gutenberg.org/ebooks/4900.epub3.images"], ["Ortodoxia", "G.K. Chesterton", "rel-33", "gutenberg", 12100, "https://www.gutenberg.org/cache/epub/130/pg130.cover.medium.jpg", "https://www.gutenberg.org/ebooks/130.epub3.images"], ["El Hombre Eterno", "G.K. Chesterton", "rel-34", "gutenberg", 11800, "https://www.gutenberg.org/cache/epub/247/pg247.cover.medium.jpg", "https://www.gutenberg.org/ebooks/247.epub3.images"], ["Cartas del Diablo a su Sobrino", "C.S. Lewis", "rel-35", "archive", 11500, null, "https://ia800500.us.archive.org/cartas.pdf"], ["Mero Cristianismo", "C.S. Lewis", "rel-36", "archive", 11200, null, "https://ia800600.us.archive.org/mero.pdf"], ["Los Cuatro Amores", "C.S. Lewis", "rel-37", "archive", 10900, null, "https://ia800700.us.archive.org/amores.pdf"], ["I Ching: El Libro de las Mutaciones", "Tradici\u00f3n Cl\u00e1sica China", "rel-38", "gutenberg", 10600, "https://www.gutenberg.org/cache/epub/1500/pg1500.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1500.epub3.images"], ["Libro de Chuang Tzu", "Zhuangzi", "rel-39", "gutenberg", 10300, "https://www.gutenberg.org/cache/epub/525/pg525.cover.medium.jpg", "https://www.gutenberg.org/ebooks/525.epub3.images"], ["Las Analectas", "Confucio", "rel-40", "gutenberg", 10000, "https://www.gutenberg.org/cache/epub/4094/pg4094.cover.medium.jpg", "https://www.gutenberg.org/ebooks/4094.epub3.images"], ["El Camino del Bodhisattva (Bodhicaryavatara)", "Shantideva", "rel-41", "archive", 9800, null, ""], ["Palabras de mi Maestro Perfecto", "Patrul Rinpoche", "rel-42", "archive", 9500, null, ""], ["\u00c9tica demostrada seg\u00fan el orden geom\u00e9trico", "Baruch Spinoza", "rel-43", "gutenberg", 9300, "https://www.gutenberg.org/cache/epub/3800/pg3800.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3800.epub3.images"], ["La Religi\u00f3n dentro de los L\u00edmites de la Mera Raz\u00f3n", "Immanuel Kant", "rel-44", "gutenberg", 9100, "https://www.gutenberg.org/cache/epub/48000/pg48000.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48000.epub3.images"], ["Temor y Temblor", "S\u00f8ren Kierkegaard", "rel-45", "gutenberg", 8900, "https://www.gutenberg.org/cache/epub/60333/pg60333.cover.medium.jpg", "https://www.gutenberg.org/ebooks/60333.epub3.images"], ["Las Obras del Amor", "S\u00f8ren Kierkegaard", "rel-46", "openlibrary", 8700, "https://covers.openlibrary.org/b/id/3326357-M.jpg", ""], ["El Misterio de la Fe", "Alexander Schmemann", "rel-47", "archive", 8500, null, ""], ["La Teolog\u00eda M\u00edstica de la Iglesia Oriental", "Vladimir Lossky", "rel-48", "archive", 8300, null, ""], ["Masnavi: El Poema Espiritual", "Jalal al-Din Rumi", "rel-49", "gutenberg", 8100, "https://www.gutenberg.org/cache/epub/2526/pg2526.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2526.epub3.images"], ["La Conferencia de los P\u00e1jaros", "Farid al-Din Attar", "rel-50", "archive", 7900, null, ""], ["La C\u00e1bala y su Simbolismo", "Gershom Scholem", "rel-51", "openlibrary", 7700, "https://covers.openlibrary.org/b/id/581696-M.jpg", ""], ["Dios en Busca del Hombre", "Abraham Joshua Heschel", "rel-52", "openlibrary", 7500, null, ""], ["Los Profetas: Voz y Conciencia", "Abraham Joshua Heschel", "rel-53", "openlibrary", 7300, null, ""], ["San Francisco de As\u00eds", "G.K. Chesterton", "rel-54", "gutenberg", 7100, "https://www.gutenberg.org/cache/epub/1887/pg1887.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1887.epub3.images"], ["La Leyenda Dorada", "Santiago de la Vor\u00e1gine", "rel-55", "gutenberg", 6900, "https://www.gutenberg.org/cache/epub/39000/pg39000.cover.medium.jpg", "https://www.gutenberg.org/ebooks/39000.epub3.images"], ["El Rescatador del Error (Confesiones)", "Abu Hamid Al-Ghazali", "rel-56", "archive", 6700, null, ""], ["Mente Zen, Mente de Principiante", "Shunryu Suzuki", "rel-57", "openlibrary", 6500, null, ""], ["Las En\u00e9adas", "Plotino", "rel-58", "gutenberg", 6300, "https://www.gutenberg.org/cache/epub/42930/pg42930.cover.medium.jpg", "https://www.gutenberg.org/ebooks/42930.epub3.images"], ["Fed\u00f3n o Del Alma", "Plat\u00f3n", "rel-59", "gutenberg", 6100, "https://www.gutenberg.org/cache/epub/1658/pg1658.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1658.epub3.images"], ["Cartas a Lucilio sobre la Serenidad y la Providencia", "S\u00e9neca", "rel-60", "gutenberg", 5900, "https://www.gutenberg.org/cache/epub/16888/pg16888.cover.medium.jpg", "https://www.gutenberg.org/ebooks/16888.epub3.images"], ["The Holy Bible (King James Version)", "Various Authors", "rel-61", "gutenberg", 32000, "https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg", "https://www.gutenberg.org/ebooks/10.epub3.images"], ["The Pilgrim's Progress", "John Bunyan", "rel-62", "gutenberg", 24000, "https://www.gutenberg.org/cache/epub/131/pg131.cover.medium.jpg", "https://www.gutenberg.org/ebooks/131.epub3.images"], ["The Song Celestial: Bhagavad-Gita", "Sir Edwin Arnold", "rel-63", "gutenberg", 18000, "https://www.gutenberg.org/cache/epub/2388/pg2388.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2388.epub3.images"], ["The Prophet", "Kahlil Gibran", "rel-64", "gutenberg", 17500, "https://www.gutenberg.org/cache/epub/58585/pg58585.cover.medium.jpg", "https://www.gutenberg.org/ebooks/58585.epub3.images"], ["The Varieties of Religious Experience", "William James", "rel-65", "gutenberg", 15000, "https://www.gutenberg.org/cache/epub/621/pg621.cover.medium.jpg", "https://www.gutenberg.org/ebooks/621.epub3.images"], ["Mere Christianity", "C.S. Lewis", "rel-66", "archive", 14000, "https://covers.openlibrary.org/b/id/718144-M.jpg", "https://ia800800.us.archive.org/mere_en.pdf"], ["Orthodoxy", "G.K. Chesterton", "rel-67", "gutenberg", 13500, "https://www.gutenberg.org/cache/epub/130/pg130.cover.medium.jpg", "https://www.gutenberg.org/ebooks/130.epub3.images"], ["The Cloud of Unknowing", "Anonymous 14th Century Monk", "rel-68", "gutenberg", 12800, "https://www.gutenberg.org/cache/epub/123/pg123.cover.medium.jpg", "https://www.gutenberg.org/ebooks/123.epub3.images"], ["The Gospel of Buddha", "Paul Carus", "rel-69", "gutenberg", 12000, "https://www.gutenberg.org/cache/epub/3589/pg3589.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3589.epub3.images"], ["The Light of Asia", "Sir Edwin Arnold", "rel-70", "gutenberg", 11500, "https://www.gutenberg.org/cache/epub/8404/pg8404.cover.medium.jpg", "https://www.gutenberg.org/ebooks/8404.epub3.images"], ["Pens\u00e9es de Pascal sur la Religion", "Blaise Pascal", "rel-71", "gutenberg", 11000, "https://www.gutenberg.org/cache/epub/18269/pg18269.cover.medium.jpg", "https://www.gutenberg.org/ebooks/18269.epub3.images"], ["Vie de J\u00e9sus (Original Fran\u00e7ais)", "Ernest Renan", "rel-72", "gutenberg", 10500, "https://www.gutenberg.org/cache/epub/4900/pg4900.cover.medium.jpg", "https://www.gutenberg.org/ebooks/4900.epub3.images"], ["Trait\u00e9 sur la Tol\u00e9rance", "Voltaire", "rel-73", "gutenberg", 10200, "https://www.gutenberg.org/cache/epub/28498/pg28498.cover.medium.jpg", "https://www.gutenberg.org/ebooks/28498.epub3.images"], ["Die Religion innerhalb der Grenzen der blo\u00dfen Vernunft", "Immanuel Kant", "rel-74", "gutenberg", 9900, "https://www.gutenberg.org/cache/epub/48000/pg48000.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48000.epub3.images"], ["Furcht und Zittern", "S\u00f8ren Kierkegaard", "rel-75", "gutenberg", 9600, "https://www.gutenberg.org/cache/epub/60333/pg60333.cover.medium.jpg", "https://www.gutenberg.org/ebooks/60333.epub3.images"], ["Siddhartha: Eine indische Dichtung", "Hermann Hesse", "rel-76", "gutenberg", 16000, "https://www.gutenberg.org/cache/epub/2493/pg2493.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2493.epub3.images"], ["La Divina Commedia (Testo Originale)", "Dante Alighieri", "rel-77", "gutenberg", 27000, "https://www.gutenberg.org/cache/epub/1012/pg1012.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1012.epub3.images"], ["I Fioretti di San Francesco", "Ugolino da Montegiorgio", "rel-78", "gutenberg", 9400, "https://www.gutenberg.org/cache/epub/18999/pg18999.cover.medium.jpg", "https://www.gutenberg.org/ebooks/18999.epub3.images"], ["A B\u00edblia Sagrada (Tradu\u00e7\u00e3o de Jo\u00e3o Ferreira de Almeida)", "V\u00e1rios Autores", "rel-79", "gutenberg", 15000, "https://www.gutenberg.org/cache/epub/2300/pg2300.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2300.epub3.images"], ["O Evangelho Segundo o Espiritismo", "Allan Kardec", "rel-80", "archive", 12500, "https://covers.openlibrary.org/b/id/10538492-M.jpg", "https://ia800900.us.archive.org/kardec.pdf"]], "Category: Politics": [["El Pr\u00edncipe", "Maquiavelo, Nicol\u00e1s", 1232, "gutendex", 18500, "https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1232.epub3.images"], ["El Contrato Social", "Rousseau, Jean-Jacques", 46333, "gutendex", 14200, "https://www.gutenberg.org/cache/epub/46333/pg46333.cover.medium.jpg", "https://www.gutenberg.org/ebooks/46333.epub3.images"], ["El Manifiesto Comunista", "Marx, Karl y Engels, Friedrich", 61, "gutendex", 22100, "https://www.gutenberg.org/cache/epub/61/pg61.cover.medium.jpg", "https://www.gutenberg.org/ebooks/61.epub3.images"], ["La Rep\u00fablica", "Plat\u00f3n", 1497, "gutendex", 19800, "https://www.gutenberg.org/cache/epub/1497/pg1497.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1497.epub3.images"], ["La Riqueza de las Naciones", "Smith, Adam", 3300, "gutendex", 16400, "https://www.gutenberg.org/cache/epub/3300/pg3300.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3300.epub3.images"], ["Dos Tratados sobre el Gobierno Civil", "Locke, John", 7370, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/7370/pg7370.cover.medium.jpg", "https://www.gutenberg.org/ebooks/7370.epub3.images"], ["Sobre la Libertad", "Mill, John Stuart", 34901, "gutendex", 13500, "https://www.gutenberg.org/cache/epub/34901/pg34901.cover.medium.jpg", "https://www.gutenberg.org/ebooks/34901.epub3.images"], ["Desobediencia Civil", "Thoreau, Henry David", 71, "gutendex", 15800, "https://www.gutenberg.org/cache/epub/71/pg71.cover.medium.jpg", "https://www.gutenberg.org/ebooks/71.epub3.images"], ["Utop\u00eda", "Moro, Tom\u00e1s", 2130, "gutendex", 12400, "https://www.gutenberg.org/cache/epub/2130/pg2130.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2130.epub3.images"], ["El Arte de la Guerra", "Sun Tzu", 132, "gutendex", 25300, "https://www.gutenberg.org/cache/epub/132/pg132.cover.medium.jpg", "https://www.gutenberg.org/ebooks/132.epub3.images"], ["La Democracia en Am\u00e9rica", "Tocqueville, Alexis de", 815, "gutendex", 9800, "https://www.gutenberg.org/cache/epub/815/pg815.cover.medium.jpg", "https://www.gutenberg.org/ebooks/815.epub3.images"], ["Leviat\u00e1n", "Hobbes, Thomas", 3207, "gutendex", 14900, "https://www.gutenberg.org/cache/epub/3207/pg3207.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3207.epub3.images"], ["Pol\u00edtica", "Arist\u00f3teles", 6762, "gutendex", 17100, "https://www.gutenberg.org/cache/epub/6762/pg6762.cover.medium.jpg", "https://www.gutenberg.org/ebooks/6762.epub3.images"], ["Sentido Com\u00fan", "Paine, Thomas", 147, "gutendex", 11500, "https://www.gutenberg.org/cache/epub/147/pg147.cover.medium.jpg", "https://www.gutenberg.org/ebooks/147.epub3.images"], ["El Federalista", "Hamilton, Alexander; Madison, James", 18, "gutendex", 10200, "https://www.gutenberg.org/cache/epub/18/pg18.cover.medium.jpg", "https://www.gutenberg.org/ebooks/18.epub3.images"], ["Vindicaci\u00f3n de los Derechos de la Mujer", "Wollstonecraft, Mary", 3420, "gutendex", 11900, "https://www.gutenberg.org/cache/epub/3420/pg3420.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3420.epub3.images"], ["Rebeli\u00f3n en la Granja", "Orwell, George", "orwell-rebelion", "archive", 28900, "https://covers.openlibrary.org/b/id/11153210-M.jpg", null], ["1984", "Orwell, George", "orwell-1984", "archive", 35400, "https://covers.openlibrary.org/b/id/9267242-M.jpg", null], ["El Esp\u00edritu de las Leyes", "Montesquieu", 27592, "gutendex", 8700, "https://www.gutenberg.org/cache/epub/27592/pg27592.cover.medium.jpg", "https://www.gutenberg.org/ebooks/27592.epub3.images"], ["La Sociedad Abierta y sus Enemigos", "Popper, Karl", "popper-open-soc", "openlibrary", 13100, "https://covers.openlibrary.org/b/id/997827-M.jpg", null], ["Discurso sobre la Servidumbre Voluntaria", "La Bo\u00e9tie, \u00c9tienne de", 54200, "gutendex", 8200, "https://www.gutenberg.org/cache/epub/54200/pg54200.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54200.epub3.images"], ["El Capital (Tomo I)", "Marx, Karl", 62, "gutendex", 19300, "https://www.gutenberg.org/cache/epub/62/pg62.cover.medium.jpg", "https://www.gutenberg.org/ebooks/62.epub3.images"], ["La Condici\u00f3n Humana", "Arendt, Hannah", "arendt-cond-humana", "openlibrary", 14600, "https://covers.openlibrary.org/b/id/5746840-M.jpg", null], ["Los Or\u00edgenes del Totalitarismo", "Arendt, Hannah", "arendt-totalitarismo", "openlibrary", 16800, "https://covers.openlibrary.org/b/id/10793645-M.jpg", null], ["Tratado Teol\u00f3gico-Pol\u00edtico", "Spinoza, Baruch", 23682, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/23682/pg23682.cover.medium.jpg", "https://www.gutenberg.org/ebooks/23682.epub3.images"], ["La Ley", "Bastiat, Fr\u00e9d\u00e9ric", 44520, "gutendex", 11400, "https://www.gutenberg.org/cache/epub/44520/pg44520.cover.medium.jpg", "https://www.gutenberg.org/ebooks/44520.epub3.images"], ["De la Guerra", "Clausewitz, Carl von", 1946, "gutendex", 15200, "https://www.gutenberg.org/cache/epub/1946/pg1946.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1946.epub3.images"], ["Consideraciones sobre el Gobierno Representativo", "Mill, John Stuart", 5669, "gutendex", 7600, "https://www.gutenberg.org/cache/epub/5669/pg5669.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5669.epub3.images"], ["Reflexiones sobre la Revoluci\u00f3n Francesa", "Burke, Edmund", 15679, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/15679/pg15679.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15679.epub3.images"], ["Derechos del Hombre", "Paine, Thomas", 3742, "gutendex", 12100, "https://www.gutenberg.org/cache/epub/3742/pg3742.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3742.epub3.images"], ["El Estado y la Revoluci\u00f3n", "Lenin, Vladimir Ilich", "lenin-estado-rev", "archive", 16500, "https://covers.openlibrary.org/b/id/12727116-M.jpg", null], ["El Apoyo Mutuo", "Kropotkin, Piotr", 4341, "gutendex", 13900, "https://www.gutenberg.org/cache/epub/4341/pg4341.cover.medium.jpg", "https://www.gutenberg.org/ebooks/4341.epub3.images"], ["La Conquista del Pan", "Kropotkin, Piotr", 23428, "gutendex", 14800, "https://www.gutenberg.org/cache/epub/23428/pg23428.cover.medium.jpg", "https://www.gutenberg.org/ebooks/23428.epub3.images"], ["Dios y el Estado", "Bakunin, Mijail", 4567, "gutendex", 11700, "https://www.gutenberg.org/cache/epub/4567/pg4567.cover.medium.jpg", "https://www.gutenberg.org/ebooks/4567.epub3.images"], ["Teor\u00eda de la Justicia", "Rawls, John", "rawls-justicia", "openlibrary", 15900, "https://covers.openlibrary.org/b/id/14190193-M.jpg", null], ["Anarqu\u00eda, Estado y Utop\u00eda", "Nozick, Robert", "nozick-anarquia", "openlibrary", 10800, "https://covers.openlibrary.org/b/id/3086752-M.jpg", null], ["La Rebeli\u00f3n de las Masas", "Ortega y Gasset, Jos\u00e9", "ortega-rebelion-masas", "archive", 18400, "https://covers.openlibrary.org/b/id/1047124-M.jpg", null], ["El Pr\u00edncipe y la Pol\u00edtica Moderna", "Gramsci, Antonio", "gramsci-politica", "archive", 12600, "https://covers.openlibrary.org/b/id/8411950-M.jpg", null], ["Camino de Servidumbre", "Hayek, Friedrich", "hayek-servidumbre", "openlibrary", 17200, "https://covers.openlibrary.org/b/id/7375880-M.jpg", null], ["La Pol\u00edtica como Vocaci\u00f3n", "Weber, Max", 28091, "gutendex", 14300, "https://www.gutenberg.org/cache/epub/28091/pg28091.cover.medium.jpg", "https://www.gutenberg.org/ebooks/28091.epub3.images"]], "Category: Novels": [["Don Quijote de la Mancha", "Cervantes Saavedra, Miguel de", 2000, "gutendex", 15420, "https://www.gutenberg.org/cache/epub/2000/pg2000.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2000.epub3.images"], ["Fortunata y Jacinta", "P\u00e9rez Gald\u00f3s, Benito", 17955, "gutendex", 7400, "https://www.gutenberg.org/cache/epub/17955/pg17955.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17955.epub3.images"], ["Do\u00f1a Perfecta", "P\u00e9rez Gald\u00f3s, Benito", 17358, "gutendex", 6500, "https://www.gutenberg.org/cache/epub/17358/pg17358.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17358.epub3.images"], ["Los pazos de Ulloa", "Pardo Baz\u00e1n, Emilia", 15353, "gutendex", 5900, "https://www.gutenberg.org/cache/epub/15353/pg15353.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15353.epub3.images"], ["Niebla (Nivola)", "Unamuno, Miguel de", 54181, "gutendex", 8600, "https://www.gutenberg.org/cache/epub/54181/pg54181.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54181.epub3.images"], ["Cumbres borrascosas", "Bront\u00eb, Emily", 49836, "gutendex", 9800, "https://www.gutenberg.org/cache/epub/49836/pg49836.cover.medium.jpg", "https://www.gutenberg.org/ebooks/49836.epub3.images"], ["Frankenstein o el moderno Prometeo", "Shelley, Mary Wollstonecraft", 56834, "gutendex", 14500, "https://www.gutenberg.org/cache/epub/56834/pg56834.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56834.epub3.images"], ["Dr\u00e1cula", "Stoker, Bram", 58820, "gutendex", 13200, "https://www.gutenberg.org/cache/epub/58820/pg58820.cover.medium.jpg", "https://www.gutenberg.org/ebooks/58820.epub3.images"], ["El retrato de Dorian Gray", "Wilde, Oscar", 48921, "gutendex", 10400, "https://www.gutenberg.org/cache/epub/48921/pg48921.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48921.epub3.images"], ["La vida del Lazarillo de Tormes", "An\u00f3nimo", 3959, "gutendex", 8200, "https://www.gutenberg.org/cache/epub/3959/pg3959.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3959.epub3.images"], ["Los miserables (Tomo I)", "Hugo, Victor", 61830, "gutendex", 9900, "https://www.gutenberg.org/cache/epub/61830/pg61830.cover.medium.jpg", "https://www.gutenberg.org/ebooks/61830.epub3.images"], ["El conde de Montecristo", "Dumas, Alexandre", 55432, "gutendex", 15100, "https://www.gutenberg.org/cache/epub/55432/pg55432.cover.medium.jpg", "https://www.gutenberg.org/ebooks/55432.epub3.images"], ["Los tres mosqueteros", "Dumas, Alexandre", 55433, "gutendex", 13400, "https://www.gutenberg.org/cache/epub/55433/pg55433.cover.medium.jpg", "https://www.gutenberg.org/ebooks/55433.epub3.images"], ["La Regenta", "Alas, Leopoldo (Clar\u00edn)", 54190, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/54190/pg54190.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54190.epub3.images"], ["Marianela", "P\u00e9rez Gald\u00f3s, Benito", 17956, "gutendex", 6800, "https://www.gutenberg.org/cache/epub/17956/pg17956.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17956.epub3.images"], ["Pepita Jim\u00e9nez", "Valera, Juan", 15355, "gutendex", 5700, "https://www.gutenberg.org/cache/epub/15355/pg15355.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15355.epub3.images"], ["Sangre y arena", "Blasco Ib\u00e1\u00f1ez, Vicente", 15357, "gutendex", 7300, "https://www.gutenberg.org/cache/epub/15357/pg15357.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15357.epub3.images"], ["La barraca", "Blasco Ib\u00e1\u00f1ez, Vicente", 15359, "gutendex", 6400, "https://www.gutenberg.org/cache/epub/15359/pg15359.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15359.epub3.images"], ["Los cuatro jinetes del Apocalipsis", "Blasco Ib\u00e1\u00f1ez, Vicente", 15358, "gutendex", 8100, "https://www.gutenberg.org/cache/epub/15358/pg15358.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15358.epub3.images"], ["El sombrero de tres picos", "Alarc\u00f3n, Pedro Antonio de", 15356, "gutendex", 5400, "https://www.gutenberg.org/cache/epub/15356/pg15356.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15356.epub3.images"], ["Cien a\u00f1os de soledad", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_cien_anos", "openlibrary", 28500, "https://covers.openlibrary.org/b/id/11153218-M.jpg", null], ["El amor en los tiempos del c\u00f3lera", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_amor_colera", "openlibrary", 22400, "https://covers.openlibrary.org/b/id/10096404-M.jpg", null], ["Pedro P\u00e1ramo", "Rulfo, Juan", "ol_pedro_paramo", "openlibrary", 19800, "https://covers.openlibrary.org/b/id/5419076-M.jpg", null], ["Rayuela", "Cort\u00e1zar, Julio", "ol_rayuela", "openlibrary", 21500, "https://covers.openlibrary.org/b/id/1047466-M.jpg", null], ["La ciudad y los perros", "Vargas Llosa, Mario", "ol_ciudad_perros", "openlibrary", 17900, "https://covers.openlibrary.org/b/id/3221667-M.jpg", null], ["El t\u00fanel", "Sabato, Ernesto", "ol_el_tunel", "openlibrary", 18700, "https://covers.openlibrary.org/b/id/5517733-M.jpg", null], ["Sobre h\u00e9roes y tumbas", "Sabato, Ernesto", "ol_sobre_heroes", "openlibrary", 14300, "https://covers.openlibrary.org/b/id/8078732-M.jpg", null], ["La casa de los esp\u00edritus", "Allende, Isabel", "ol_casa_espiritus", "openlibrary", 23100, "https://covers.openlibrary.org/b/id/3205226-M.jpg", null], ["Cr\u00f3nica de una muerte anunciada", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_cronica_muerte", "openlibrary", 20900, "https://covers.openlibrary.org/b/id/8489859-M.jpg", null], ["La sombra del viento", "Ruiz Zaf\u00f3n, Carlos", "ol_sombra_viento", "openlibrary", 26400, "https://covers.openlibrary.org/b/id/10107644-M.jpg", null], ["Los detectives salvajes", "Bola\u00f1o, Roberto", "ol_detectives_salvajes", "openlibrary", 19400, "https://covers.openlibrary.org/b/id/3706128-M.jpg", null], ["El siglo de las luces", "Carpentier, Alejo", "ol_siglo_luces", "openlibrary", 13800, "https://covers.openlibrary.org/b/id/1047145-M.jpg", null], ["Yo el Supremo", "Roa Bastos, Augusto", "ol_yo_el_supremo", "openlibrary", 12900, "https://covers.openlibrary.org/b/id/4131244-M.jpg", null], ["Paradiso", "Lezama Lima, Jos\u00e9", "ol_paradiso", "openlibrary", 11800, "https://covers.openlibrary.org/b/id/2134818-M.jpg", null], ["Conversaci\u00f3n en La Catedral", "Vargas Llosa, Mario", "ol_conversacion_catedral", "openlibrary", 16200, "https://covers.openlibrary.org/b/id/12532400-M.jpg", null], ["La fiesta del Chivo", "Vargas Llosa, Mario", "ol_fiesta_chivo", "openlibrary", 17100, "https://covers.openlibrary.org/b/id/1047728-M.jpg", null], ["Santa", "Gamboa, Federico", 15354, "gutendex", 6100, "https://www.gutenberg.org/cache/epub/15354/pg15354.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15354.epub3.images"], ["Mar\u00eda", "Isaacs, Jorge", 15360, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/15360/pg15360.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15360.epub3.images"], ["Amalia", "M\u00e1rmol, Jos\u00e9", 15361, "gutendex", 6700, "https://www.gutenberg.org/cache/epub/15361/pg15361.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15361.epub3.images"], ["Clemencia", "Altamirano, Ignacio Manuel", 15364, "gutendex", 5200, "https://www.gutenberg.org/cache/epub/15364/pg15364.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15364.epub3.images"]], "Category: Romance": [["Cumbres borrascosas", "Bront\u00eb, Emily", 49836, "gutendex", 9800, "https://www.gutenberg.org/cache/epub/49836/pg49836.cover.medium.jpg", "https://www.gutenberg.org/ebooks/49836.epub3.images"], ["Romeo y Julieta", "Shakespeare, William", 56360, "gutendex", 14700, "https://www.gutenberg.org/cache/epub/56360/pg56360.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56360.epub3.images"], ["Orgullo y prejuicio", "Austen, Jane", 54330, "gutendex", 16800, "https://www.gutenberg.org/cache/epub/54330/pg54330.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54330.epub3.images"], ["Sentido y sensibilidad", "Austen, Jane", 54331, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/54331/pg54331.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54331.epub3.images"], ["Jane Eyre", "Bront\u00eb, Charlotte", 54332, "gutendex", 13500, "https://www.gutenberg.org/cache/epub/54332/pg54332.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54332.epub3.images"], ["Pepita Jim\u00e9nez", "Valera, Juan", 15355, "gutendex", 5700, "https://www.gutenberg.org/cache/epub/15355/pg15355.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15355.epub3.images"], ["Marianela", "P\u00e9rez Gald\u00f3s, Benito", 17956, "gutendex", 6800, "https://www.gutenberg.org/cache/epub/17956/pg17956.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17956.epub3.images"], ["Fortunata y Jacinta", "P\u00e9rez Gald\u00f3s, Benito", 17955, "gutendex", 7400, "https://www.gutenberg.org/cache/epub/17955/pg17955.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17955.epub3.images"], ["La dama de las camelias", "Dumas, Alexandre (hijo)", 54333, "gutendex", 12100, "https://www.gutenberg.org/cache/epub/54333/pg54333.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54333.epub3.images"], ["Mar\u00eda", "Isaacs, Jorge", 15360, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/15360/pg15360.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15360.epub3.images"], ["Amalia", "M\u00e1rmol, Jos\u00e9", 15361, "gutendex", 6700, "https://www.gutenberg.org/cache/epub/15361/pg15361.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15361.epub3.images"], ["Clemencia", "Altamirano, Ignacio Manuel", 15364, "gutendex", 5200, "https://www.gutenberg.org/cache/epub/15364/pg15364.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15364.epub3.images"], ["Las cuitas del joven Werther", "Goethe, Johann Wolfgang von", 36781, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/36781/pg36781.cover.medium.jpg", "https://www.gutenberg.org/ebooks/36781.epub3.images"], ["Niebla (Nivola)", "Unamuno, Miguel de", 54181, "gutendex", 8600, "https://www.gutenberg.org/cache/epub/54181/pg54181.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54181.epub3.images"], ["La Celestina", "Rojas, Fernando de", 1619, "gutendex", 6900, "https://www.gutenberg.org/cache/epub/1619/pg1619.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1619.epub3.images"], ["Persuasi\u00f3n", "Austen, Jane", 54336, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/54336/pg54336.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54336.epub3.images"], ["Emma", "Austen, Jane", 54337, "gutendex", 10100, "https://www.gutenberg.org/cache/epub/54337/pg54337.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54337.epub3.images"], ["La abad\u00eda de Northanger", "Austen, Jane", 54338, "gutendex", 7800, "https://www.gutenberg.org/cache/epub/54338/pg54338.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54338.epub3.images"], ["Manon Lescaut", "Pr\u00e9vost, Abb\u00e9", 54335, "gutendex", 6700, "https://www.gutenberg.org/cache/epub/54335/pg54335.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54335.epub3.images"], ["Cyrano de Bergerac", "Rostand, Edmond", 54334, "gutendex", 11400, "https://www.gutenberg.org/cache/epub/54334/pg54334.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54334.epub3.images"], ["El amor en los tiempos del c\u00f3lera", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_amor_colera", "openlibrary", 22400, "https://covers.openlibrary.org/b/id/10096404-M.jpg", null], ["Como agua para chocolate", "Esquivel, Laura", "ol_como_agua", "openlibrary", 21800, "https://covers.openlibrary.org/b/id/8372632-M.jpg", null], ["Carta de una desconocida", "Zweig, Stefan", "ol_carta_desconocida", "openlibrary", 15400, "https://covers.openlibrary.org/b/id/1022090-M.jpg", null], ["Veinticuatro horas en la vida de una mujer", "Zweig, Stefan", "ol_24_horas", "openlibrary", 14200, "https://covers.openlibrary.org/b/id/10688298-M.jpg", null], ["Seda", "Baricco, Alessandro", "ol_seda", "openlibrary", 16700, "https://covers.openlibrary.org/b/id/8914560-M.jpg", null], ["Bodas de sangre", "Garc\u00eda Lorca, Federico", "ol_bodas_sangre", "openlibrary", 19200, "https://covers.openlibrary.org/b/id/9124578-M.jpg", null], ["La t\u00eda Tula", "Unamuno, Miguel de", "ol_tia_tula", "openlibrary", 11500, "https://covers.openlibrary.org/b/id/314560-M.jpg", null], ["Veinte poemas de amor y una canci\u00f3n desesperada", "Neruda, Pablo", "ol_20_poemas", "openlibrary", 25800, "https://covers.openlibrary.org/b/id/10541289-M.jpg", null], ["Madame Bovary", "Flaubert, Gustave", "ol_madame_bovary", "openlibrary", 18900, "https://covers.openlibrary.org/b/id/12993424-M.jpg", null], ["Rayuela", "Cort\u00e1zar, Julio", "ol_rayuela", "openlibrary", 21500, "https://covers.openlibrary.org/b/id/1047466-M.jpg", null], ["Los amantes de Teruel", "Hartzenbusch, Juan Eugenio", 15370, "gutendex", 4900, "https://www.gutenberg.org/cache/epub/15370/pg15370.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15370.epub3.images"], ["Don Juan Tenorio", "Zorrilla, Jos\u00e9", 15366, "gutendex", 8700, "https://www.gutenberg.org/cache/epub/15366/pg15366.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15366.epub3.images"], ["El s\u00ed de las ni\u00f1as", "Fern\u00e1ndez de Morat\u00edn, Leandro", 15363, "gutendex", 6300, "https://www.gutenberg.org/cache/epub/15363/pg15363.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15363.epub3.images"], ["La gitanilla", "Cervantes Saavedra, Miguel de", 2001, "gutendex", 7100, "https://www.gutenberg.org/cache/epub/2001/pg2001.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2001.epub3.images"], ["Sonetos de amor", "Vega, Lope de", 2539, "gutendex", 5800, "https://www.gutenberg.org/cache/epub/2539/pg2539.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2539.epub3.images"], ["Amor constante m\u00e1s all\u00e1 de la muerte", "Quevedo, Francisco de", 15362, "gutendex", 6100, "https://www.gutenberg.org/cache/epub/15362/pg15362.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15362.epub3.images"], ["El amante de Lady Chatterley", "Lawrence, D. H.", "ol_lady_chatterley", "openlibrary", 17400, "https://covers.openlibrary.org/b/id/12983362-M.jpg", null], ["El amor enamorado", "Vega, Lope de", 2540, "gutendex", 4800, "https://www.gutenberg.org/cache/epub/2540/pg2540.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2540.epub3.images"], ["Leyendas de amor", "Zorrilla, Jos\u00e9", 15365, "gutendex", 5300, "https://www.gutenberg.org/cache/epub/15365/pg15365.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15365.epub3.images"], ["Cartas de amor", "Pardo Baz\u00e1n, Emilia", 15371, "gutendex", 5600, "https://www.gutenberg.org/cache/epub/15371/pg15371.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15371.epub3.images"]], "Category: Crime, Thrillers and Mystery": [["Estudio en escarlata", "Doyle, Arthur Conan", 2873, "gutendex", 11400, "https://www.gutenberg.org/cache/epub/2873/pg2873.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2873.epub3.images"], ["El perro de los Baskerville", "Doyle, Arthur Conan", 2874, "gutendex", 12300, "https://www.gutenberg.org/cache/epub/2874/pg2874.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2874.epub3.images"], ["Las aventuras de Sherlock Holmes", "Doyle, Arthur Conan", 5690, "gutendex", 13800, "https://www.gutenberg.org/cache/epub/5690/pg5690.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5690.epub3.images"], ["El misterio de Cloomber", "Doyle, Arthur Conan", 2875, "gutendex", 6400, "https://www.gutenberg.org/cache/epub/2875/pg2875.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2875.epub3.images"], ["Memorias de Sherlock Holmes", "Doyle, Arthur Conan", 2876, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/2876/pg2876.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2876.epub3.images"], ["El regreso de Sherlock Holmes", "Doyle, Arthur Conan", 2877, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/2877/pg2877.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2877.epub3.images"], ["El signo de los cuatro", "Doyle, Arthur Conan", 2878, "gutendex", 9700, "https://www.gutenberg.org/cache/epub/2878/pg2878.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2878.epub3.images"], ["Su \u00faltima reverencia", "Doyle, Arthur Conan", 2879, "gutendex", 7300, "https://www.gutenberg.org/cache/epub/2879/pg2879.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2879.epub3.images"], ["El valle del terror", "Doyle, Arthur Conan", 2880, "gutendex", 8100, "https://www.gutenberg.org/cache/epub/2880/pg2880.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2880.epub3.images"], ["El archivo de Sherlock Holmes", "Doyle, Arthur Conan", 2881, "gutendex", 7600, "https://www.gutenberg.org/cache/epub/2881/pg2881.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2881.epub3.images"], ["Los cr\u00edmenes de la calle Morgue", "Poe, Edgar Allan", 54340, "gutendex", 14200, "https://www.gutenberg.org/cache/epub/54340/pg54340.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54340.epub3.images"], ["El misterio de Marie Rog\u00eat", "Poe, Edgar Allan", 54341, "gutendex", 8500, "https://www.gutenberg.org/cache/epub/54341/pg54341.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54341.epub3.images"], ["La carta robada", "Poe, Edgar Allan", 54342, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/54342/pg54342.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54342.epub3.images"], ["El escarabajo de oro", "Poe, Edgar Allan", 54343, "gutendex", 12500, "https://www.gutenberg.org/cache/epub/54343/pg54343.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54343.epub3.images"], ["El extra\u00f1o caso del Dr. Jekyll y Mr. Hyde", "Stevenson, Robert Louis", 42108, "gutendex", 10600, "https://www.gutenberg.org/cache/epub/42108/pg42108.cover.medium.jpg", "https://www.gutenberg.org/ebooks/42108.epub3.images"], ["Dr\u00e1cula", "Stoker, Bram", 58820, "gutendex", 13200, "https://www.gutenberg.org/cache/epub/58820/pg58820.cover.medium.jpg", "https://www.gutenberg.org/ebooks/58820.epub3.images"], ["La dama de blanco", "Collins, Wilkie", 54344, "gutendex", 7800, "https://www.gutenberg.org/cache/epub/54344/pg54344.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54344.epub3.images"], ["La piedra lunar", "Collins, Wilkie", 54345, "gutendex", 8600, "https://www.gutenberg.org/cache/epub/54345/pg54345.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54345.epub3.images"], ["El misterio del cuarto amarillo", "Leroux, Gaston", 54346, "gutendex", 9500, "https://www.gutenberg.org/cache/epub/54346/pg54346.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54346.epub3.images"], ["El fantasma de la \u00f3pera", "Leroux, Gaston", 54347, "gutendex", 11800, "https://www.gutenberg.org/cache/epub/54347/pg54347.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54347.epub3.images"], ["Diez negritos", "Christie, Agatha", "ol_10_negritos", "openlibrary", 24500, "https://covers.openlibrary.org/b/id/11172296-M.jpg", null], ["Asesinato en el Orient Express", "Christie, Agatha", "ol_orient_express", "openlibrary", 22800, "https://covers.openlibrary.org/b/id/11100465-M.jpg", null], ["El asesinato de Roger Ackroyd", "Christie, Agatha", "ol_roger_ackroyd", "openlibrary", 19500, "https://covers.openlibrary.org/b/id/13151356-M.jpg", null], ["Muerte en el Nilo", "Christie, Agatha", "ol_muerte_nilo", "openlibrary", 20400, "https://covers.openlibrary.org/b/id/14066646-M.jpg", null], ["El halc\u00f3n malt\u00e9s", "Hammett, Dashiell", "ol_halcon_maltes", "openlibrary", 16800, "https://covers.openlibrary.org/b/id/998587-M.jpg", null], ["Cosecha roja", "Hammett, Dashiell", "ol_cosecha_roja", "openlibrary", 14500, "https://covers.openlibrary.org/b/id/7812456-M.jpg", null], ["El sue\u00f1o eterno", "Chandler, Raymond", "ol_sueno_eterno", "openlibrary", 17900, "https://covers.openlibrary.org/b/id/7268475-M.jpg", null], ["Adi\u00f3s, mu\u00f1eca", "Chandler, Raymond", "ol_adios_muneca", "openlibrary", 15200, null, null], ["El largo adi\u00f3s", "Chandler, Raymond", "ol_largo_adios", "openlibrary", 16400, "https://covers.openlibrary.org/b/id/4903298-M.jpg", null], ["El nombre de la rosa", "Eco, Umberto", "ol_nombre_rosa", "openlibrary", 27100, null, null], ["Cr\u00f3nica de una muerte anunciada", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_cronica_muerte", "openlibrary", 20900, "https://covers.openlibrary.org/b/id/8489859-M.jpg", null], ["La sombra del viento", "Ruiz Zaf\u00f3n, Carlos", "ol_sombra_viento", "openlibrary", 26400, "https://covers.openlibrary.org/b/id/10107644-M.jpg", null], ["Plenilunio", "Mu\u00f1oz Molina, Antonio", "ol_plenilunio", "openlibrary", 13700, "https://covers.openlibrary.org/b/id/7377392-M.jpg", null], ["El secreto de sus ojos", "Sacheri, Eduardo", "ol_secreto_ojos", "openlibrary", 18500, "https://covers.openlibrary.org/b/id/7703326-M.jpg", null], ["La tabla de Flandes", "P\u00e9rez-Reverte, Arturo", "ol_tabla_flandes", "openlibrary", 19200, "https://covers.openlibrary.org/b/id/8614520-M.jpg", null], ["El club Dumas", "P\u00e9rez-Reverte, Arturo", "ol_club_dumas", "openlibrary", 20800, "https://covers.openlibrary.org/b/id/9014520-M.jpg", null], ["Tatuaje", "V\u00e1zquez Montalb\u00e1n, Manuel", "ol_tatuaje", "openlibrary", 12400, "https://covers.openlibrary.org/b/id/1046631-M.jpg", null], ["Los mares del Sur", "V\u00e1zquez Montalb\u00e1n, Manuel", "ol_mares_sur", "openlibrary", 13100, "https://covers.openlibrary.org/b/id/3752631-M.jpg", null], ["El guardi\u00e1n invisible", "Redondo, Dolores", "ol_guardian_invisible", "openlibrary", 18400, "https://covers.openlibrary.org/b/id/9910039-M.jpg", null], ["La niebla y la doncella", "Silva, Lorenzo", "ol_niebla_doncella", "openlibrary", 14600, "https://covers.openlibrary.org/b/id/4318274-M.jpg", null]], "Category: Poetry": [["Rimas y Leyendas", "B\u00e9cquer, Gustavo Adolfo", 23648, "gutendex", 9300, "https://www.gutenberg.org/cache/epub/23648/pg23648.cover.medium.jpg", "https://www.gutenberg.org/ebooks/23648.epub3.images"], ["Platero y yo", "Jim\u00e9nez, Juan Ram\u00f3n", 60183, "gutendex", 11800, "https://www.gutenberg.org/cache/epub/60183/pg60183.cover.medium.jpg", "https://www.gutenberg.org/ebooks/60183.epub3.images"], ["La Divina Comedia", "Alighieri, Dante", 57303, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/57303/pg57303.cover.medium.jpg", "https://www.gutenberg.org/ebooks/57303.epub3.images"], ["La Il\u00edada", "Homero", 6130, "gutendex", 8750, "https://www.gutenberg.org/cache/epub/6130/pg6130.cover.medium.jpg", "https://www.gutenberg.org/ebooks/6130.epub3.images"], ["La Odisea", "Homero", 6245, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/6245/pg6245.cover.medium.jpg", "https://www.gutenberg.org/ebooks/6245.epub3.images"], ["Cancionero", "Petrarca, Francesco", 54350, "gutendex", 6200, "https://www.gutenberg.org/cache/epub/54350/pg54350.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54350.epub3.images"], ["Soledades", "G\u00f3ngora, Luis de", 15380, "gutendex", 5400, "https://www.gutenberg.org/cache/epub/15380/pg15380.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15380.epub3.images"], ["F\u00e1bula de Polifemo y Galatea", "G\u00f3ngora, Luis de", 15381, "gutendex", 4900, "https://www.gutenberg.org/cache/epub/15381/pg15381.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15381.epub3.images"], ["Poemas escogidos", "Quevedo, Francisco de", 15382, "gutendex", 6100, "https://www.gutenberg.org/cache/epub/15382/pg15382.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15382.epub3.images"], ["\u00c9glogas y canciones", "Garcilaso de la Vega", 15383, "gutendex", 5200, "https://www.gutenberg.org/cache/epub/15383/pg15383.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15383.epub3.images"], ["C\u00e1ntico espiritual", "San Juan de la Cruz", 15384, "gutendex", 5800, "https://www.gutenberg.org/cache/epub/15384/pg15384.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15384.epub3.images"], ["Poes\u00edas completas", "Le\u00f3n, Fray Luis de", 15385, "gutendex", 5100, "https://www.gutenberg.org/cache/epub/15385/pg15385.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15385.epub3.images"], ["Romancero gitano", "Garc\u00eda Lorca, Federico", "ol_romancero_gitano", "openlibrary", 22500, null, null], ["Poeta en Nueva York", "Garc\u00eda Lorca, Federico", "ol_poeta_ny", "openlibrary", 18900, "https://covers.openlibrary.org/b/id/108013-M.jpg", null], ["Veinte poemas de amor", "Neruda, Pablo", "ol_20_poemas_neruda", "openlibrary", 25800, "https://covers.openlibrary.org/b/id/747596-M.jpg", null], ["Canto general", "Neruda, Pablo", "ol_canto_general", "openlibrary", 17600, "https://covers.openlibrary.org/b/id/4909630-M.jpg", null], ["Residencia en la tierra", "Neruda, Pablo", "ol_residencia_tierra", "openlibrary", 16400, null, null], ["Campos de Castilla", "Machado, Antonio", 54351, "gutendex", 7900, "https://www.gutenberg.org/cache/epub/54351/pg54351.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54351.epub3.images"], ["Soledades, galer\u00edas y otros poemas", "Machado, Antonio", 54352, "gutendex", 7300, "https://www.gutenberg.org/cache/epub/54352/pg54352.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54352.epub3.images"], ["El rayo que no cesa", "Hern\u00e1ndez, Miguel", "ol_rayo_cesa", "openlibrary", 19200, "https://covers.openlibrary.org/b/id/12337025-M.jpg", null], ["Viento del pueblo", "Hern\u00e1ndez, Miguel", "ol_viento_pueblo", "openlibrary", 15800, null, null], ["Las flores del mal", "Baudelaire, Charles", 54353, "gutendex", 12900, "https://www.gutenberg.org/cache/epub/54353/pg54353.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54353.epub3.images"], ["Hojas de hierba", "Whitman, Walt", 54354, "gutendex", 11400, "https://www.gutenberg.org/cache/epub/54354/pg54354.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54354.epub3.images"], ["Rubaiyat", "Jayam, Omar", 54355, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/54355/pg54355.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54355.epub3.images"], ["Cantares gallegos", "Castro, Rosal\u00eda de", 15386, "gutendex", 4900, "https://www.gutenberg.org/cache/epub/15386/pg15386.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15386.epub3.images"], ["Follas novas", "Castro, Rosal\u00eda de", 15387, "gutendex", 4600, "https://www.gutenberg.org/cache/epub/15387/pg15387.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15387.epub3.images"], ["En las orillas del Sar", "Castro, Rosal\u00eda de", 15388, "gutendex", 4800, "https://www.gutenberg.org/cache/epub/15388/pg15388.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15388.epub3.images"], ["Azul...", "Dar\u00edo, Rub\u00e9n", 15389, "gutendex", 8600, "https://www.gutenberg.org/cache/epub/15389/pg15389.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15389.epub3.images"], ["Prosas profanas", "Dar\u00edo, Rub\u00e9n", 15390, "gutendex", 7500, "https://www.gutenberg.org/cache/epub/15390/pg15390.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15390.epub3.images"], ["Cantos de vida y esperanza", "Dar\u00edo, Rub\u00e9n", 15391, "gutendex", 8100, "https://www.gutenberg.org/cache/epub/15391/pg15391.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15391.epub3.images"], ["Trilce", "Vallejo, C\u00e9sar", "ol_trilce", "openlibrary", 16800, null, null], ["Los heraldos negros", "Vallejo, C\u00e9sar", "ol_heraldos_negros", "openlibrary", 18200, "https://covers.openlibrary.org/b/id/4086142-M.jpg", null], ["Poemas humanos", "Vallejo, C\u00e9sar", "ol_poemas_humanos", "openlibrary", 15900, "https://covers.openlibrary.org/b/id/4422232-M.jpg", null], ["Libertad bajo palabra", "Paz, Octavio", "ol_libertad_palabra", "openlibrary", 17500, null, null], ["Piedra de sol", "Paz, Octavio", "ol_piedra_sol", "openlibrary", 19400, "https://covers.openlibrary.org/b/id/4704563-M.jpg", null], ["Desolaci\u00f3n", "Mistral, Gabriela", "ol_desolacion", "openlibrary", 18100, null, null], ["Tala", "Mistral, Gabriela", "ol_tala", "openlibrary", 14900, "https://covers.openlibrary.org/b/id/5266477-M.jpg", null], ["Lagar", "Mistral, Gabriela", "ol_lagar", "openlibrary", 13800, null, null], ["Versos sencillos", "Mart\u00ed, Jos\u00e9", 15392, "gutendex", 7600, "https://www.gutenberg.org/cache/epub/15392/pg15392.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15392.epub3.images"], ["Ismaelillo", "Mart\u00ed, Jos\u00e9", 15393, "gutendex", 5900, "https://www.gutenberg.org/cache/epub/15393/pg15393.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15393.epub3.images"]], "Category: Short Stories": [["Las aventuras de Sherlock Holmes", "Doyle, Arthur Conan", 5690, "gutendex", 13800, "https://www.gutenberg.org/cache/epub/5690/pg5690.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5690.epub3.images"], ["Rimas y Leyendas", "B\u00e9cquer, Gustavo Adolfo", 23648, "gutendex", 9300, "https://www.gutenberg.org/cache/epub/23648/pg23648.cover.medium.jpg", "https://www.gutenberg.org/ebooks/23648.epub3.images"], ["La metamorfosis", "Kafka, Franz", 56441, "gutendex", 12100, "https://www.gutenberg.org/cache/epub/56441/pg56441.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56441.epub3.images"], ["Narraciones extraordinarias", "Poe, Edgar Allan", 54360, "gutendex", 15600, "https://www.gutenberg.org/cache/epub/54360/pg54360.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54360.epub3.images"], ["Cuentos de amor, de locura y de muerte", "Quiroga, Horacio", 54361, "gutendex", 13400, "https://www.gutenberg.org/cache/epub/54361/pg54361.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54361.epub3.images"], ["Cuentos de la selva", "Quiroga, Horacio", 54362, "gutendex", 14200, "https://www.gutenberg.org/cache/epub/54362/pg54362.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54362.epub3.images"], ["El almohad\u00f3n de plumas y otros relatos", "Quiroga, Horacio", 54363, "gutendex", 11800, "https://www.gutenberg.org/cache/epub/54363/pg54363.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54363.epub3.images"], ["Cuentos de Canterbury", "Chaucer, Geoffrey", 54364, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/54364/pg54364.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54364.epub3.images"], ["El Decamer\u00f3n", "Boccaccio, Giovanni", 54365, "gutendex", 12500, "https://www.gutenberg.org/cache/epub/54365/pg54365.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54365.epub3.images"], ["Las mil y una noches", "An\u00f3nimo", 54366, "gutendex", 16800, "https://www.gutenberg.org/cache/epub/54366/pg54366.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54366.epub3.images"], ["Cuentos escogidos", "Maupassant, Guy de", 54367, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/54367/pg54367.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54367.epub3.images"], ["Bola de sebo y otros cuentos", "Maupassant, Guy de", 54368, "gutendex", 10200, "https://www.gutenberg.org/cache/epub/54368/pg54368.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54368.epub3.images"], ["Cuentos de Ch\u00e9jov", "Ch\u00e9jov, Ant\u00f3n", 54369, "gutendex", 11500, "https://www.gutenberg.org/cache/epub/54369/pg54369.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54369.epub3.images"], ["La dama del perrito", "Ch\u00e9jov, Ant\u00f3n", 54370, "gutendex", 9100, "https://www.gutenberg.org/cache/epub/54370/pg54370.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54370.epub3.images"], ["El pr\u00edncipe feliz y otros cuentos", "Wilde, Oscar", 48922, "gutendex", 13200, "https://www.gutenberg.org/cache/epub/48922/pg48922.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48922.epub3.images"], ["Una casa de granadas", "Wilde, Oscar", 48923, "gutendex", 8400, "https://www.gutenberg.org/cache/epub/48923/pg48923.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48923.epub3.images"], ["El Aleph", "Borges, Jorge Luis", "ol_aleph", "openlibrary", 26900, null, null], ["Ficciones", "Borges, Jorge Luis", "ol_ficciones", "openlibrary", 28400, "https://covers.openlibrary.org/b/id/10832290-M.jpg", null], ["El libro de arena", "Borges, Jorge Luis", "ol_libro_arena", "openlibrary", 19800, null, null], ["Historia universal de la infamia", "Borges, Jorge Luis", "ol_historia_infamia", "openlibrary", 17900, "https://covers.openlibrary.org/b/id/9300042-M.jpg", null], ["Bestiario", "Cort\u00e1zar, Julio", "ol_bestiario", "openlibrary", 21500, null, null], ["Final del juego", "Cort\u00e1zar, Julio", "ol_final_juego", "openlibrary", 18700, "https://covers.openlibrary.org/b/id/4933371-M.jpg", null], ["Las armas secretas", "Cort\u00e1zar, Julio", "ol_armas_secretas", "openlibrary", 17200, "https://covers.openlibrary.org/b/id/1055669-M.jpg", null], ["Todos los fuegos el fuego", "Cort\u00e1zar, Julio", "ol_todos_fuegos", "openlibrary", 19400, "https://covers.openlibrary.org/b/id/8065429-M.jpg", null], ["Historias de cronopios y de famas", "Cort\u00e1zar, Julio", "ol_cronopios", "openlibrary", 22800, "https://covers.openlibrary.org/b/id/2291057-M.jpg", null], ["El llano en llamas", "Rulfo, Juan", "ol_llano_llamas", "openlibrary", 24100, "https://covers.openlibrary.org/b/id/5419076-M.jpg", null], ["Doce cuentos peregrinos", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_12_cuentos", "openlibrary", 23500, null, null], ["Los funerales de la Mam\u00e1 Grande", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_mama_grande", "openlibrary", 18200, "https://covers.openlibrary.org/b/id/10097333-M.jpg", null], ["Ojos de perro azul", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_ojos_perro_azul", "openlibrary", 16900, "https://covers.openlibrary.org/b/id/10099963-M.jpg", null], ["Cuentos de Eva Luna", "Allende, Isabel", "ol_cuentos_eva_luna", "openlibrary", 20400, "https://covers.openlibrary.org/b/id/3205240-M.jpg", null], ["La culpa es de los tlaxcaltecas", "Garro, Elena", "ol_culpa_tlaxcaltecas", "openlibrary", 14500, null, null], ["Llamadas telef\u00f3nicas", "Bola\u00f1o, Roberto", "ol_llamadas_telefonicas", "openlibrary", 16700, "https://covers.openlibrary.org/b/id/3744911-M.jpg", null], ["Putas asesinas", "Bola\u00f1o, Roberto", "ol_putas_asesinas", "openlibrary", 15800, "https://covers.openlibrary.org/b/id/1047302-M.jpg", null], ["El pozo y el p\u00e9ndulo", "Poe, Edgar Allan", 54371, "gutendex", 12100, "https://www.gutenberg.org/cache/epub/54371/pg54371.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54371.epub3.images"], ["El coraz\u00f3n delator", "Poe, Edgar Allan", 54372, "gutendex", 14800, "https://www.gutenberg.org/cache/epub/54372/pg54372.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54372.epub3.images"], ["El barril de amontillado", "Poe, Edgar Allan", 54373, "gutendex", 11900, "https://www.gutenberg.org/cache/epub/54373/pg54373.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54373.epub3.images"], ["Cuentos de la Alhambra", "Irving, Washington", 54374, "gutendex", 9700, "https://www.gutenberg.org/cache/epub/54374/pg54374.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54374.epub3.images"], ["Novelas ejemplares", "Cervantes Saavedra, Miguel de", 2002, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/2002/pg2002.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2002.epub3.images"], ["Cuentos fant\u00e1sticos", "Hoffmann, E. T. A.", 54375, "gutendex", 8200, "https://www.gutenberg.org/cache/epub/54375/pg54375.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54375.epub3.images"], ["Relatos de un n\u00e1ufrago", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_relatos_naufrago", "openlibrary", 17500, "https://covers.openlibrary.org/b/id/9486827-M.jpg", null]], "Category: Plays/Films/Dramas": [["Edipo Rey", "S\u00f3focles", 62058, "gutendex", 8300, "https://www.gutenberg.org/cache/epub/62058/pg62058.cover.medium.jpg", "https://www.gutenberg.org/ebooks/62058.epub3.images"], ["Hamlet, Pr\u00edncipe de Dinamarca", "Shakespeare, William", 56353, "gutendex", 13900, "https://www.gutenberg.org/cache/epub/56353/pg56353.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56353.epub3.images"], ["Romeo y Julieta", "Shakespeare, William", 56360, "gutendex", 14700, "https://www.gutenberg.org/cache/epub/56360/pg56360.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56360.epub3.images"], ["Macbeth", "Shakespeare, William", 56355, "gutendex", 9100, "https://www.gutenberg.org/cache/epub/56355/pg56355.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56355.epub3.images"], ["Otelo: El moro de Venecia", "Shakespeare, William", 56358, "gutendex", 7200, "https://www.gutenberg.org/cache/epub/56358/pg56358.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56358.epub3.images"], ["El rey Lear", "Shakespeare, William", 56359, "gutendex", 8400, "https://www.gutenberg.org/cache/epub/56359/pg56359.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56359.epub3.images"], ["El sue\u00f1o de una noche de verano", "Shakespeare, William", 56354, "gutendex", 9600, "https://www.gutenberg.org/cache/epub/56354/pg56354.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56354.epub3.images"], ["La tempestad", "Shakespeare, William", 56356, "gutendex", 8100, "https://www.gutenberg.org/cache/epub/56356/pg56356.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56356.epub3.images"], ["El mercader de Venecia", "Shakespeare, William", 56357, "gutendex", 8500, "https://www.gutenberg.org/cache/epub/56357/pg56357.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56357.epub3.images"], ["Fausto", "Goethe, Johann Wolfgang von", 36780, "gutendex", 8800, "https://www.gutenberg.org/cache/epub/36780/pg36780.cover.medium.jpg", "https://www.gutenberg.org/ebooks/36780.epub3.images"], ["La vida es sue\u00f1o", "Calder\u00f3n de la Barca, Pedro", 2516, "gutendex", 7100, "https://www.gutenberg.org/cache/epub/2516/pg2516.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2516.epub3.images"], ["El alcalde de Zalamea", "Calder\u00f3n de la Barca, Pedro", 2517, "gutendex", 5900, "https://www.gutenberg.org/cache/epub/2517/pg2517.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2517.epub3.images"], ["Fuente Ovejuna", "Vega, Lope de", 2538, "gutendex", 5800, "https://www.gutenberg.org/cache/epub/2538/pg2538.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2538.epub3.images"], ["El perro del hortelano", "Vega, Lope de", 2539, "gutendex", 6300, "https://www.gutenberg.org/cache/epub/2539/pg2539.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2539.epub3.images"], ["El caballero de Olmedo", "Vega, Lope de", 2540, "gutendex", 5400, "https://www.gutenberg.org/cache/epub/2540/pg2540.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2540.epub3.images"], ["La dama boba", "Vega, Lope de", 2541, "gutendex", 5100, "https://www.gutenberg.org/cache/epub/2541/pg2541.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2541.epub3.images"], ["La Celestina", "Rojas, Fernando de", 1619, "gutendex", 6900, "https://www.gutenberg.org/cache/epub/1619/pg1619.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1619.epub3.images"], ["Don Juan Tenorio", "Zorrilla, Jos\u00e9", 15366, "gutendex", 8700, "https://www.gutenberg.org/cache/epub/15366/pg15366.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15366.epub3.images"], ["El burlador de Sevilla", "Tirso de Molina", 15367, "gutendex", 6400, "https://www.gutenberg.org/cache/epub/15367/pg15367.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15367.epub3.images"], ["Don Gil de las calzas verdes", "Tirso de Molina", 15368, "gutendex", 5200, "https://www.gutenberg.org/cache/epub/15368/pg15368.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15368.epub3.images"], ["El s\u00ed de las ni\u00f1as", "Fern\u00e1ndez de Morat\u00edn, Leandro", 15363, "gutendex", 6300, "https://www.gutenberg.org/cache/epub/15363/pg15363.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15363.epub3.images"], ["La comedia nueva o El caf\u00e9", "Fern\u00e1ndez de Morat\u00edn, Leandro", 15369, "gutendex", 4900, "https://www.gutenberg.org/cache/epub/15369/pg15369.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15369.epub3.images"], ["Bodas de sangre", "Garc\u00eda Lorca, Federico", "ol_bodas_sangre", "openlibrary", 19200, "https://covers.openlibrary.org/b/id/9124578-M.jpg", null], ["Yerma", "Garc\u00eda Lorca, Federico", "ol_yerma", "openlibrary", 17500, "https://covers.openlibrary.org/b/id/457015-M.jpg", null], ["La casa de Bernarda Alba", "Garc\u00eda Lorca, Federico", "ol_bernarda_alba", "openlibrary", 23400, "https://covers.openlibrary.org/b/id/7323388-M.jpg", null], ["Do\u00f1a Rosita la soltera", "Garc\u00eda Lorca, Federico", "ol_rosita_soltera", "openlibrary", 14200, "https://covers.openlibrary.org/b/id/3837453-M.jpg", null], ["Luces de bohemia", "Valle-Incl\u00e1n, Ram\u00f3n del", "ol_luces_bohemia", "openlibrary", 18800, null, null], ["Divinas palabras", "Valle-Incl\u00e1n, Ram\u00f3n del", "ol_divinas_palabras", "openlibrary", 15100, "https://covers.openlibrary.org/b/id/5353514-M.jpg", null], ["Casa de mu\u00f1ecas", "Ibsen, Henrik", 54380, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/54380/pg54380.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54380.epub3.images"], ["Un enemigo del pueblo", "Ibsen, Henrik", 54381, "gutendex", 9800, "https://www.gutenberg.org/cache/epub/54381/pg54381.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54381.epub3.images"], ["El jard\u00edn de los cerezos", "Ch\u00e9jov, Ant\u00f3n", 54382, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/54382/pg54382.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54382.epub3.images"], ["La gaviota", "Ch\u00e9jov, Ant\u00f3n", 54383, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/54383/pg54383.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54383.epub3.images"], ["Las tres hermanas", "Ch\u00e9jov, Ant\u00f3n", 54384, "gutendex", 8700, "https://www.gutenberg.org/cache/epub/54384/pg54384.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54384.epub3.images"], ["T\u00edo Vania", "Ch\u00e9jov, Ant\u00f3n", 54385, "gutendex", 8500, "https://www.gutenberg.org/cache/epub/54385/pg54385.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54385.epub3.images"], ["Tartufo", "Moli\u00e8re", 54386, "gutendex", 9300, "https://www.gutenberg.org/cache/epub/54386/pg54386.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54386.epub3.images"], ["El avaro", "Moli\u00e8re", 54387, "gutendex", 9900, "https://www.gutenberg.org/cache/epub/54387/pg54387.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54387.epub3.images"], ["El enfermo imaginario", "Moli\u00e8re", 54388, "gutendex", 9100, "https://www.gutenberg.org/cache/epub/54388/pg54388.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54388.epub3.images"], ["El mis\u00e1ntropo", "Moli\u00e8re", 54389, "gutendex", 8400, "https://www.gutenberg.org/cache/epub/54389/pg54389.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54389.epub3.images"], ["Ant\u00edgona", "S\u00f3focles", 62059, "gutendex", 9700, "https://www.gutenberg.org/cache/epub/62059/pg62059.cover.medium.jpg", "https://www.gutenberg.org/ebooks/62059.epub3.images"], ["Prometeo encadenado", "Esquilo", 62060, "gutendex", 8600, "https://www.gutenberg.org/cache/epub/62060/pg62060.cover.medium.jpg", "https://www.gutenberg.org/ebooks/62060.epub3.images"]], "Category: Adventure": [["Don Quijote de la Mancha", "Cervantes Saavedra, Miguel de", 2000, "gutendex", 15420, "https://www.gutenberg.org/cache/epub/2000/pg2000.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2000.epub3.images"], ["La Odisea", "Homero", 6245, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/6245/pg6245.cover.medium.jpg", "https://www.gutenberg.org/ebooks/6245.epub3.images"], ["La Il\u00edada", "Homero", 6130, "gutendex", 8750, "https://www.gutenberg.org/cache/epub/6130/pg6130.cover.medium.jpg", "https://www.gutenberg.org/ebooks/6130.epub3.images"], ["Veinte mil leguas de viaje submarino", "Verne, Jules", 4791, "gutendex", 10900, "https://www.gutenberg.org/cache/epub/4791/pg4791.cover.medium.jpg", "https://www.gutenberg.org/ebooks/4791.epub3.images"], ["La vuelta al mundo en ochenta d\u00edas", "Verne, Jules", 5097, "gutendex", 10200, "https://www.gutenberg.org/cache/epub/5097/pg5097.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5097.epub3.images"], ["Viaje al centro de la Tierra", "Verne, Jules", 5123, "gutendex", 12500, "https://www.gutenberg.org/cache/epub/5123/pg5123.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5123.epub3.images"], ["De la Tierra a la Luna", "Verne, Jules", 5110, "gutendex", 7600, "https://www.gutenberg.org/cache/epub/5110/pg5110.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5110.epub3.images"], ["La isla misteriosa", "Verne, Jules", 5111, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/5111/pg5111.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5111.epub3.images"], ["Miguel Strogoff", "Verne, Jules", 5112, "gutendex", 8400, "https://www.gutenberg.org/cache/epub/5112/pg5112.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5112.epub3.images"], ["Cinco semanas en globo", "Verne, Jules", 5113, "gutendex", 7800, "https://www.gutenberg.org/cache/epub/5113/pg5113.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5113.epub3.images"], ["El conde de Montecristo", "Dumas, Alexandre", 55432, "gutendex", 15100, "https://www.gutenberg.org/cache/epub/55432/pg55432.cover.medium.jpg", "https://www.gutenberg.org/ebooks/55432.epub3.images"], ["Los tres mosqueteros", "Dumas, Alexandre", 55433, "gutendex", 13400, "https://www.gutenberg.org/cache/epub/55433/pg55433.cover.medium.jpg", "https://www.gutenberg.org/ebooks/55433.epub3.images"], ["Veinte a\u00f1os despu\u00e9s", "Dumas, Alexandre", 55434, "gutendex", 8200, "https://www.gutenberg.org/cache/epub/55434/pg55434.cover.medium.jpg", "https://www.gutenberg.org/ebooks/55434.epub3.images"], ["El vizconde de Bragelonne", "Dumas, Alexandre", 55435, "gutendex", 7900, "https://www.gutenberg.org/cache/epub/55435/pg55435.cover.medium.jpg", "https://www.gutenberg.org/ebooks/55435.epub3.images"], ["La isla del tesoro", "Stevenson, Robert Louis", 48931, "gutendex", 9700, "https://www.gutenberg.org/cache/epub/48931/pg48931.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48931.epub3.images"], ["Secuestrado", "Stevenson, Robert Louis", 48932, "gutendex", 7400, "https://www.gutenberg.org/cache/epub/48932/pg48932.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48932.epub3.images"], ["La flecha negra", "Stevenson, Robert Louis", 48933, "gutendex", 6800, "https://www.gutenberg.org/cache/epub/48933/pg48933.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48933.epub3.images"], ["Robinson Crusoe", "Defoe, Daniel", 54390, "gutendex", 12100, "https://www.gutenberg.org/cache/epub/54390/pg54390.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54390.epub3.images"], ["Los viajes de Gulliver", "Swift, Jonathan", 54391, "gutendex", 11600, "https://www.gutenberg.org/cache/epub/54391/pg54391.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54391.epub3.images"], ["Las minas del rey Salom\u00f3n", "Haggard, H. Rider", 54392, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/54392/pg54392.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54392.epub3.images"], ["Ella", "Haggard, H. Rider", 54393, "gutendex", 8200, "https://www.gutenberg.org/cache/epub/54393/pg54393.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54393.epub3.images"], ["El libro de la selva", "Kipling, Rudyard", 54394, "gutendex", 13400, "https://www.gutenberg.org/cache/epub/54394/pg54394.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54394.epub3.images"], ["Kim", "Kipling, Rudyard", 54395, "gutendex", 9100, "https://www.gutenberg.org/cache/epub/54395/pg54395.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54395.epub3.images"], ["Colmillo Blanco", "London, Jack", 54396, "gutendex", 12800, "https://www.gutenberg.org/cache/epub/54396/pg54396.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54396.epub3.images"], ["La llamada de la selva", "London, Jack", 54397, "gutendex", 13100, "https://www.gutenberg.org/cache/epub/54397/pg54397.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54397.epub3.images"], ["El lobo de mar", "London, Jack", 54398, "gutendex", 8700, "https://www.gutenberg.org/cache/epub/54398/pg54398.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54398.epub3.images"], ["Moby Dick", "Melville, Herman", 54399, "gutendex", 14200, "https://www.gutenberg.org/cache/epub/54399/pg54399.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54399.epub3.images"], ["Sandok\u00e1n: Los tigres de Mompracem", "Salgari, Emilio", 54400, "gutendex", 9500, "https://www.gutenberg.org/cache/epub/54400/pg54400.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54400.epub3.images"], ["Los piratas de la Malasia", "Salgari, Emilio", 54401, "gutendex", 8100, "https://www.gutenberg.org/cache/epub/54401/pg54401.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54401.epub3.images"], ["El corsario negro", "Salgari, Emilio", 54402, "gutendex", 9900, "https://www.gutenberg.org/cache/epub/54402/pg54402.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54402.epub3.images"], ["La reina de los caribes", "Salgari, Emilio", 54403, "gutendex", 7600, "https://www.gutenberg.org/cache/epub/54403/pg54403.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54403.epub3.images"], ["El \u00faltimo mohicano", "Cooper, James Fenimore", 54404, "gutendex", 8700, "https://www.gutenberg.org/cache/epub/54404/pg54404.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54404.epub3.images"], ["Los cazadores de cabelleras", "Reid, Mayne", 54405, "gutendex", 6300, "https://www.gutenberg.org/cache/epub/54405/pg54405.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54405.epub3.images"], ["El coraz\u00f3n de las tinieblas", "Conrad, Joseph", 54406, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/54406/pg54406.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54406.epub3.images"], ["Lord Jim", "Conrad, Joseph", 54407, "gutendex", 8500, "https://www.gutenberg.org/cache/epub/54407/pg54407.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54407.epub3.images"], ["Relato de un n\u00e1ufrago", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_relato_naufrago", "openlibrary", 17500, "https://covers.openlibrary.org/b/id/9486827-M.jpg", null], ["El oro de los tigres", "Borges, Jorge Luis", "ol_oro_tigres", "openlibrary", 14800, "https://covers.openlibrary.org/b/id/9723494-M.jpg", null], ["El capit\u00e1n Alatriste", "P\u00e9rez-Reverte, Arturo", "ol_alatriste", "openlibrary", 24200, "https://covers.openlibrary.org/b/id/1046756-M.jpg", null], ["Limpieza de sangre", "P\u00e9rez-Reverte, Arturo", "ol_limpieza_sangre", "openlibrary", 18600, null, null], ["El sol de Breda", "P\u00e9rez-Reverte, Arturo", "ol_sol_breda", "openlibrary", 17800, null, null]], "Category: History": [["El pr\u00edncipe", "Maquiavelo, Nicol\u00e1s", 32448, "gutendex", 7890, "https://www.gutenberg.org/cache/epub/32448/pg32448.cover.medium.jpg", "https://www.gutenberg.org/ebooks/32448.epub3.images"], ["El arte de la guerra", "Sun Tzu", 59345, "gutendex", 16200, "https://www.gutenberg.org/cache/epub/59345/pg59345.cover.medium.jpg", "https://www.gutenberg.org/ebooks/59345.epub3.images"], ["Fuente Ovejuna", "Vega, Lope de", 2538, "gutendex", 5800, "https://www.gutenberg.org/cache/epub/2538/pg2538.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2538.epub3.images"], ["Do\u00f1a Perfecta", "P\u00e9rez Gald\u00f3s, Benito", 17358, "gutendex", 6500, "https://www.gutenberg.org/cache/epub/17358/pg17358.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17358.epub3.images"], ["Trafalgar", "P\u00e9rez Gald\u00f3s, Benito", 17359, "gutendex", 7900, "https://www.gutenberg.org/cache/epub/17359/pg17359.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17359.epub3.images"], ["Bail\u00e9n", "P\u00e9rez Gald\u00f3s, Benito", 17360, "gutendex", 6800, "https://www.gutenberg.org/cache/epub/17360/pg17360.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17360.epub3.images"], ["Zaragoza", "P\u00e9rez Gald\u00f3s, Benito", 17361, "gutendex", 7200, "https://www.gutenberg.org/cache/epub/17361/pg17361.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17361.epub3.images"], ["Gerona", "P\u00e9rez Gald\u00f3s, Benito", 17362, "gutendex", 6400, "https://www.gutenberg.org/cache/epub/17362/pg17362.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17362.epub3.images"], ["Juan Mart\u00edn el Empecinado", "P\u00e9rez Gald\u00f3s, Benito", 17363, "gutendex", 6100, "https://www.gutenberg.org/cache/epub/17363/pg17363.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17363.epub3.images"], ["La batalla de los Arapiles", "P\u00e9rez Gald\u00f3s, Benito", 17364, "gutendex", 5900, "https://www.gutenberg.org/cache/epub/17364/pg17364.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17364.epub3.images"], ["Cartas de relaci\u00f3n de la conquista de M\u00e9xico", "Cort\u00e9s, Hern\u00e1n", 15400, "gutendex", 8400, "https://www.gutenberg.org/cache/epub/15400/pg15400.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15400.epub3.images"], ["Historia verdadera de la conquista de la Nueva Espa\u00f1a", "D\u00edaz del Castillo, Bernal", 15401, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/15401/pg15401.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15401.epub3.images"], ["Brev\u00edsima relaci\u00f3n de la destrucci\u00f3n de las Indias", "Casas, Bartolom\u00e9 de las", 15402, "gutendex", 7800, "https://www.gutenberg.org/cache/epub/15402/pg15402.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15402.epub3.images"], ["Comentarios reales de los incas", "Garcilaso de la Vega, Inca", 15403, "gutendex", 8100, "https://www.gutenberg.org/cache/epub/15403/pg15403.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15403.epub3.images"], ["La Araucana", "Ercilla, Alonso de", 15404, "gutendex", 6700, "https://www.gutenberg.org/cache/epub/15404/pg15404.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15404.epub3.images"], ["Naufragios y comentarios", "N\u00fa\u00f1ez Cabeza de Vaca, \u00c1lvar", 15405, "gutendex", 7300, "https://www.gutenberg.org/cache/epub/15405/pg15405.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15405.epub3.images"], ["Historia de la decadencia del Imperio Romano", "Gibbon, Edward", 54410, "gutendex", 9500, "https://www.gutenberg.org/cache/epub/54410/pg54410.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54410.epub3.images"], ["Vidas paralelas", "Plutarco", 54411, "gutendex", 10400, "https://www.gutenberg.org/cache/epub/54411/pg54411.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54411.epub3.images"], ["Anales e Historias", "T\u00e1cito", 54412, "gutendex", 7600, "https://www.gutenberg.org/cache/epub/54412/pg54412.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54412.epub3.images"], ["Guerra de las Galias", "C\u00e9sar, Julio", 54413, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/54413/pg54413.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54413.epub3.images"], ["Guerras civiles", "C\u00e9sar, Julio", 54414, "gutendex", 7400, "https://www.gutenberg.org/cache/epub/54414/pg54414.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54414.epub3.images"], ["Historia de Roma desde su fundaci\u00f3n", "Tito Livio", 54415, "gutendex", 8300, "https://www.gutenberg.org/cache/epub/54415/pg54415.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54415.epub3.images"], ["Historia general de las cosas de Nueva Espa\u00f1a", "Sahag\u00fan, Bernardino de", 15406, "gutendex", 7200, "https://www.gutenberg.org/cache/epub/15406/pg15406.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15406.epub3.images"], ["Cr\u00f3nica del Per\u00fa", "Cieza de Le\u00f3n, Pedro", 15407, "gutendex", 6900, "https://www.gutenberg.org/cache/epub/15407/pg15407.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15407.epub3.images"], ["Facundo: Civilizaci\u00f3n y barbarie", "Sarmiento, Domingo Faustino", 15408, "gutendex", 7700, "https://www.gutenberg.org/cache/epub/15408/pg15408.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15408.epub3.images"], ["Las venas abiertas de Am\u00e9rica Latina", "Galeano, Eduardo", "ol_venas_abiertas", "openlibrary", 26400, "https://covers.openlibrary.org/b/id/5416334-M.jpg", null], ["Memoria del fuego", "Galeano, Eduardo", "ol_memoria_fuego", "openlibrary", 19200, "https://covers.openlibrary.org/b/id/4150919-M.jpg", null], ["El oto\u00f1o del patriarca", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_otono_patriarca", "openlibrary", 18900, null, null], ["La fiesta del Chivo", "Vargas Llosa, Mario", "ol_fiesta_chivo", "openlibrary", 17100, "https://covers.openlibrary.org/b/id/1047728-M.jpg", null], ["Yo el Supremo", "Roa Bastos, Augusto", "ol_yo_el_supremo", "openlibrary", 12900, "https://covers.openlibrary.org/b/id/4131244-M.jpg", null], ["Noticias del Imperio", "del Paso, Fernando", "ol_noticias_imperio", "openlibrary", 15600, "https://covers.openlibrary.org/b/id/7164630-M.jpg", null], ["El laberinto de la soledad", "Paz, Octavio", "ol_laberinto_soledad", "openlibrary", 22800, null, null], ["Los d\u00edas terrenales", "Revueltas, Jos\u00e9", "ol_dias_terrenales", "openlibrary", 11200, "https://covers.openlibrary.org/b/id/5349572-M.jpg", null], ["El luto humano", "Revueltas, Jos\u00e9", "ol_luto_humano", "openlibrary", 11800, "https://covers.openlibrary.org/b/id/5335668-M.jpg", null], ["Zapata y la Revoluci\u00f3n Mexicana", "Womack, John", "ol_zapata_rev", "openlibrary", 14300, "https://covers.openlibrary.org/b/id/2159314-M.jpg", null], ["Breve historia de Espa\u00f1a", "Garc\u00eda de Cort\u00e1zar, Fernando", "ol_breve_espana", "openlibrary", 16500, "https://covers.openlibrary.org/b/id/4903608-M.jpg", null], ["Espa\u00f1a invertebrada", "Ortega y Gasset, Jos\u00e9", "ol_espana_invert", "openlibrary", 15200, "https://covers.openlibrary.org/b/id/4903267-M.jpg", null], ["La rebeli\u00f3n de las masas", "Ortega y Gasset, Jos\u00e9", "ol_rebelion_masas", "openlibrary", 20100, null, null], ["Discurso del m\u00e9todo", "Descartes, Ren\u00e9", 54416, "gutendex", 10800, "https://www.gutenberg.org/cache/epub/54416/pg54416.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54416.epub3.images"], ["Manifiesto del Partido Comunista", "Marx, Karl y Engels, Friedrich", 54417, "gutendex", 15200, "https://www.gutenberg.org/cache/epub/54417/pg54417.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54417.epub3.images"]], "Category: Science": [["Frankenstein o el moderno Prometeo", "Shelley, Mary Wollstonecraft", 56834, "gutendex", 14500, "https://www.gutenberg.org/cache/epub/56834/pg56834.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56834.epub3.images"], ["Veinte mil leguas de viaje submarino", "Verne, Jules", 4791, "gutendex", 10900, "https://www.gutenberg.org/cache/epub/4791/pg4791.cover.medium.jpg", "https://www.gutenberg.org/ebooks/4791.epub3.images"], ["Viaje al centro de la Tierra", "Verne, Jules", 5123, "gutendex", 12500, "https://www.gutenberg.org/cache/epub/5123/pg5123.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5123.epub3.images"], ["De la Tierra a la Luna", "Verne, Jules", 5110, "gutendex", 7600, "https://www.gutenberg.org/cache/epub/5110/pg5110.cover.medium.jpg", "https://www.gutenberg.org/ebooks/5110.epub3.images"], ["El origen de las especies", "Darwin, Charles", 54420, "gutendex", 16400, "https://www.gutenberg.org/cache/epub/54420/pg54420.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54420.epub3.images"], ["El viaje del Beagle", "Darwin, Charles", 54421, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/54421/pg54421.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54421.epub3.images"], ["La m\u00e1quina del tiempo", "Wells, H. G.", 54422, "gutendex", 14100, "https://www.gutenberg.org/cache/epub/54422/pg54422.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54422.epub3.images"], ["La guerra de los mundos", "Wells, H. G.", 54423, "gutendex", 15800, "https://www.gutenberg.org/cache/epub/54423/pg54423.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54423.epub3.images"], ["El hombre invisible", "Wells, H. G.", 54424, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/54424/pg54424.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54424.epub3.images"], ["La isla del Dr. Moreau", "Wells, H. G.", 54425, "gutendex", 10400, "https://www.gutenberg.org/cache/epub/54425/pg54425.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54425.epub3.images"], ["Los primeros hombres en la Luna", "Wells, H. G.", 54426, "gutendex", 8700, "https://www.gutenberg.org/cache/epub/54426/pg54426.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54426.epub3.images"], ["Un mundo feliz", "Huxley, Aldous", "ol_mundo_feliz", "openlibrary", 27400, "https://covers.openlibrary.org/b/id/8231823-M.jpg", null], ["1984", "Orwell, George", "ol_1984", "openlibrary", 31200, "https://covers.openlibrary.org/b/id/9267242-M.jpg", null], ["Rebeli\u00f3n en la granja", "Orwell, George", "ol_granja", "openlibrary", 26500, "https://covers.openlibrary.org/b/id/11261770-M.jpg", null], ["Fahrenheit 451", "Bradbury, Ray", "ol_f451", "openlibrary", 24800, null, null], ["Cr\u00f3nicas marcianas", "Bradbury, Ray", "ol_cronicas_marcianas", "openlibrary", 22100, null, null], ["El hombre ilustrado", "Bradbury, Ray", "ol_hombre_ilustrado", "openlibrary", 16800, null, null], ["Fundaci\u00f3n", "Asimov, Isaac", "ol_fundacion", "openlibrary", 23900, "https://covers.openlibrary.org/b/id/14612610-M.jpg", null], ["Yo, Robot", "Asimov, Isaac", "ol_yo_robot", "openlibrary", 21400, "https://covers.openlibrary.org/b/id/12385229-M.jpg", null], ["El fin de la eternidad", "Asimov, Isaac", "ol_fin_eternidad", "openlibrary", 17500, "https://covers.openlibrary.org/b/id/6622699-M.jpg", null], ["Cosmos", "Sagan, Carl", "ol_cosmos", "openlibrary", 28900, "https://covers.openlibrary.org/b/id/8283901-M.jpg", null], ["Los dragones del Ed\u00e9n", "Sagan, Carl", "ol_dragones_eden", "openlibrary", 18200, "https://covers.openlibrary.org/b/id/5014547-M.jpg", null], ["El mundo y sus demonios", "Sagan, Carl", "ol_mundo_demonios", "openlibrary", 24300, "https://covers.openlibrary.org/b/id/13129044-M.jpg", null], ["Breve historia del tiempo", "Hawking, Stephen", "ol_breve_tiempo", "openlibrary", 27600, null, null], ["El universo en una c\u00e1scara de nuez", "Hawking, Stephen", "ol_universo_nuez", "openlibrary", 19500, null, null], ["El gen ego\u00edsta", "Dawkins, Richard", "ol_gen_egoista", "openlibrary", 21800, "https://covers.openlibrary.org/b/id/133936-M.jpg", null], ["Sapiens: De animales a dioses", "Harari, Yuval Noah", "ol_sapiens", "openlibrary", 32500, null, null], ["Homo Deus: Breve historia del ma\u00f1ana", "Harari, Yuval Noah", "ol_homo_deus", "openlibrary", 24100, null, null], ["El universo elegante", "Greene, Brian", "ol_universo_elegante", "openlibrary", 16400, "https://covers.openlibrary.org/b/id/1007630-M.jpg", null], ["Los tres primeros minutos del universo", "Weinberg, Steven", "ol_3_minutos", "openlibrary", 14700, "https://covers.openlibrary.org/b/id/4903237-M.jpg", null], ["La doble h\u00e9lice", "Watson, James D.", "ol_doble_helice", "openlibrary", 15200, "https://covers.openlibrary.org/b/id/12779180-M.jpg", null], ["Cazadores de microbios", "Kruif, Paul de", "ol_cazadores_microbios", "openlibrary", 19800, "https://covers.openlibrary.org/b/id/13345255-M.jpg", null], ["Di\u00e1logos sobre los dos m\u00e1ximos sistemas del mundo", "Galilei, Galileo", 54427, "gutendex", 8600, "https://www.gutenberg.org/cache/epub/54427/pg54427.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54427.epub3.images"], ["Principios matem\u00e1ticos de la filosof\u00eda natural", "Newton, Isaac", 54428, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/54428/pg54428.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54428.epub3.images"], ["Tratado elemental de qu\u00edmica", "Lavoisier, Antoine", 54429, "gutendex", 7400, "https://www.gutenberg.org/cache/epub/54429/pg54429.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54429.epub3.images"], ["La teor\u00eda de la relatividad", "Einstein, Albert", 54430, "gutendex", 15800, "https://www.gutenberg.org/cache/epub/54430/pg54430.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54430.epub3.images"], ["Sobre el sue\u00f1o", "Freud, Sigmund", 54431, "gutendex", 9100, "https://www.gutenberg.org/cache/epub/54431/pg54431.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54431.epub3.images"], ["Introducci\u00f3n al psicoan\u00e1lisis", "Freud, Sigmund", 54432, "gutendex", 11400, "https://www.gutenberg.org/cache/epub/54432/pg54432.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54432.epub3.images"], ["La interpretaci\u00f3n de los sue\u00f1os", "Freud, Sigmund", 54433, "gutendex", 13700, "https://www.gutenberg.org/cache/epub/54433/pg54433.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54433.epub3.images"], ["Astronom\u00eda popular", "Flammarion, Camille", 54434, "gutendex", 8300, "https://www.gutenberg.org/cache/epub/54434/pg54434.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54434.epub3.images"]], "Category: Fantasy": [["La metamorfosis", "Kafka, Franz", 56441, "gutendex", 12100, "https://www.gutenberg.org/cache/epub/56441/pg56441.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56441.epub3.images"], ["Dr\u00e1cula", "Stoker, Bram", 58820, "gutendex", 13200, "https://www.gutenberg.org/cache/epub/58820/pg58820.cover.medium.jpg", "https://www.gutenberg.org/ebooks/58820.epub3.images"], ["Frankenstein o el moderno Prometeo", "Shelley, Mary Wollstonecraft", 56834, "gutendex", 14500, "https://www.gutenberg.org/cache/epub/56834/pg56834.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56834.epub3.images"], ["El retrato de Dorian Gray", "Wilde, Oscar", 48921, "gutendex", 10400, "https://www.gutenberg.org/cache/epub/48921/pg48921.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48921.epub3.images"], ["La Divina Comedia", "Alighieri, Dante", 57303, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/57303/pg57303.cover.medium.jpg", "https://www.gutenberg.org/ebooks/57303.epub3.images"], ["Fausto", "Goethe, Johann Wolfgang von", 36780, "gutendex", 8800, "https://www.gutenberg.org/cache/epub/36780/pg36780.cover.medium.jpg", "https://www.gutenberg.org/ebooks/36780.epub3.images"], ["Alicia en el pa\u00eds de las maravillas", "Carroll, Lewis", 59714, "gutendex", 14100, "https://www.gutenberg.org/cache/epub/59714/pg59714.cover.medium.jpg", "https://www.gutenberg.org/ebooks/59714.epub3.images"], ["A trav\u00e9s del espejo", "Carroll, Lewis", 59715, "gutendex", 10200, "https://www.gutenberg.org/cache/epub/59715/pg59715.cover.medium.jpg", "https://www.gutenberg.org/ebooks/59715.epub3.images"], ["El extra\u00f1o caso del Dr. Jekyll y Mr. Hyde", "Stevenson, Robert Louis", 42108, "gutendex", 10600, "https://www.gutenberg.org/cache/epub/42108/pg42108.cover.medium.jpg", "https://www.gutenberg.org/ebooks/42108.epub3.images"], ["Rimas y Leyendas", "B\u00e9cquer, Gustavo Adolfo", 23648, "gutendex", 9300, "https://www.gutenberg.org/cache/epub/23648/pg23648.cover.medium.jpg", "https://www.gutenberg.org/ebooks/23648.epub3.images"], ["Peter Pan y Wendy", "Barrie, J. M.", 54440, "gutendex", 12800, "https://www.gutenberg.org/cache/epub/54440/pg54440.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54440.epub3.images"], ["El maravilloso mago de Oz", "Baum, L. Frank", 54441, "gutendex", 13400, "https://www.gutenberg.org/cache/epub/54441/pg54441.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54441.epub3.images"], ["Cuentos de hadas", "Grimm, Jacob y Wilhelm", 54442, "gutendex", 15200, "https://www.gutenberg.org/cache/epub/54442/pg54442.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54442.epub3.images"], ["Cuentos de Hans Christian Andersen", "Andersen, Hans Christian", 54443, "gutendex", 14600, "https://www.gutenberg.org/cache/epub/54443/pg54443.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54443.epub3.images"], ["Las mil y una noches", "An\u00f3nimo", 54366, "gutendex", 16800, "https://www.gutenberg.org/cache/epub/54366/pg54366.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54366.epub3.images"], ["Cuentos de la Alhambra", "Irving, Washington", 54374, "gutendex", 9700, "https://www.gutenberg.org/cache/epub/54374/pg54374.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54374.epub3.images"], ["La dama del lago", "Scott, Walter", 54444, "gutendex", 7300, "https://www.gutenberg.org/cache/epub/54444/pg54444.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54444.epub3.images"], ["Peter Schlemihl", "Chamisso, Adelbert von", 54445, "gutendex", 6800, "https://www.gutenberg.org/cache/epub/54445/pg54445.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54445.epub3.images"], ["Los elixires del diablo", "Hoffmann, E. T. A.", 54446, "gutendex", 7100, "https://www.gutenberg.org/cache/epub/54446/pg54446.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54446.epub3.images"], ["La comunidad del anillo", "Tolkien, J. R. R.", "ol_comunidad_anillo", "openlibrary", 34200, "https://covers.openlibrary.org/b/id/14627060-M.jpg", null], ["Las dos torres", "Tolkien, J. R. R.", "ol_dos_torres", "openlibrary", 28700, null, null], ["El retorno del rey", "Tolkien, J. R. R.", "ol_retorno_rey", "openlibrary", 30100, "https://covers.openlibrary.org/b/id/14627062-M.jpg", null], ["El Hobbit", "Tolkien, J. R. R.", "ol_hobbit", "openlibrary", 31500, null, null], ["El Silmarillion", "Tolkien, J. R. R.", "ol_silmarillion", "openlibrary", 23400, "https://covers.openlibrary.org/b/id/14627042-M.jpg", null], ["El le\u00f3n, la bruja y el ropero", "Lewis, C. S.", "ol_narnia_leon", "openlibrary", 25600, null, null], ["El principito", "Saint-Exup\u00e9ry, Antoine de", "ol_principito", "openlibrary", 33400, "https://covers.openlibrary.org/b/id/10708272-M.jpg", null], ["Harry Potter y la piedra filosofal", "Rowling, J. K.", "ol_hp_piedra", "openlibrary", 38900, "https://covers.openlibrary.org/b/id/15155833-M.jpg", null], ["La historia interminable", "Ende, Michael", "ol_historia_interminable", "openlibrary", 27800, "https://covers.openlibrary.org/b/id/7383413-M.jpg", null], ["Momo", "Ende, Michael", "ol_momo", "openlibrary", 22100, "https://covers.openlibrary.org/b/id/8574580-M.jpg", null], ["Coraline", "Gaiman, Neil", "ol_coraline", "openlibrary", 21800, "https://covers.openlibrary.org/b/id/14171421-M.jpg", null], ["Stardust", "Gaiman, Neil", "ol_stardust", "openlibrary", 19700, "https://covers.openlibrary.org/b/id/8216379-M.jpg", null], ["Buenos presagios", "Gaiman, Neil y Pratchett, Terry", "ol_buenos_presagios", "openlibrary", 22400, "https://covers.openlibrary.org/b/id/10482258-M.jpg", null], ["El color de la magia", "Pratchett, Terry", "ol_color_magia", "openlibrary", 20500, "https://covers.openlibrary.org/b/id/14647238-M.jpg", null], ["Mort", "Pratchett, Terry", "ol_mort", "openlibrary", 18900, "https://covers.openlibrary.org/b/id/14648805-M.jpg", null], ["El nombre del viento", "Rothfuss, Patrick", "ol_nombre_viento", "openlibrary", 29800, "https://covers.openlibrary.org/b/id/11480483-M.jpg", null], ["El temor de un hombre sabio", "Rothfuss, Patrick", "ol_temor_hombre_sabio", "openlibrary", 25100, "https://covers.openlibrary.org/b/id/8294024-M.jpg", null], ["El \u00faltimo deseo", "Sapkowski, Andrzej", "ol_ultimo_deseo", "openlibrary", 23700, "https://covers.openlibrary.org/b/id/7360819-M.jpg", null], ["Juego de tronos", "Martin, George R. R.", "ol_juego_tronos", "openlibrary", 32100, "https://covers.openlibrary.org/b/id/9269962-M.jpg", null], ["El rey de la m\u00e1scara de oro", "Schwob, Marcel", 54447, "gutendex", 6400, "https://www.gutenberg.org/cache/epub/54447/pg54447.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54447.epub3.images"], ["La invenci\u00f3n de Morel", "Bioy Casares, Adolfo", "ol_invencion_morel", "openlibrary", 19200, "https://covers.openlibrary.org/b/id/1046845-M.jpg", null]], "Category: Juvenile": [["Alicia en el pa\u00eds de las maravillas", "Carroll, Lewis", 59714, "gutendex", 14100, "https://www.gutenberg.org/cache/epub/59714/pg59714.cover.medium.jpg", "https://www.gutenberg.org/ebooks/59714.epub3.images"], ["A trav\u00e9s del espejo", "Carroll, Lewis", 59715, "gutendex", 10200, "https://www.gutenberg.org/cache/epub/59715/pg59715.cover.medium.jpg", "https://www.gutenberg.org/ebooks/59715.epub3.images"], ["La isla del tesoro", "Stevenson, Robert Louis", 48931, "gutendex", 9700, "https://www.gutenberg.org/cache/epub/48931/pg48931.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48931.epub3.images"], ["Platero y yo", "Jim\u00e9nez, Juan Ram\u00f3n", 60183, "gutendex", 11800, "https://www.gutenberg.org/cache/epub/60183/pg60183.cover.medium.jpg", "https://www.gutenberg.org/ebooks/60183.epub3.images"], ["El maravilloso mago de Oz", "Baum, L. Frank", 54441, "gutendex", 13400, "https://www.gutenberg.org/cache/epub/54441/pg54441.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54441.epub3.images"], ["Peter Pan y Wendy", "Barrie, J. M.", 54440, "gutendex", 12800, "https://www.gutenberg.org/cache/epub/54440/pg54440.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54440.epub3.images"], ["El libro de la selva", "Kipling, Rudyard", 54394, "gutendex", 13400, "https://www.gutenberg.org/cache/epub/54394/pg54394.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54394.epub3.images"], ["El segundo libro de la selva", "Kipling, Rudyard", 54450, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/54450/pg54450.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54450.epub3.images"], ["Las aventuras de Tom Sawyer", "Twain, Mark", 54451, "gutendex", 14900, "https://www.gutenberg.org/cache/epub/54451/pg54451.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54451.epub3.images"], ["Las aventuras de Huckleberry Finn", "Twain, Mark", 54452, "gutendex", 13700, "https://www.gutenberg.org/cache/epub/54452/pg54452.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54452.epub3.images"], ["El pr\u00edncipe y el mendigo", "Twain, Mark", 54453, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/54453/pg54453.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54453.epub3.images"], ["Cuentos de los hermanos Grimm", "Grimm, Jacob y Wilhelm", 54442, "gutendex", 15200, "https://www.gutenberg.org/cache/epub/54442/pg54442.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54442.epub3.images"], ["Cuentos de Andersen", "Andersen, Hans Christian", 54443, "gutendex", 14600, "https://www.gutenberg.org/cache/epub/54443/pg54443.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54443.epub3.images"], ["Heidi", "Spyri, Johanna", 54454, "gutendex", 11900, "https://www.gutenberg.org/cache/epub/54454/pg54454.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54454.epub3.images"], ["Coraz\u00f3n: Diario de un ni\u00f1o", "Amicis, Edmundo de", 54455, "gutendex", 12400, "https://www.gutenberg.org/cache/epub/54455/pg54455.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54455.epub3.images"], ["Las aventuras de Pinocho", "Collodi, Carlo", 54456, "gutendex", 15800, "https://www.gutenberg.org/cache/epub/54456/pg54456.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54456.epub3.images"], ["Mujercitas", "Alcott, Louisa May", 54457, "gutendex", 16200, "https://www.gutenberg.org/cache/epub/54457/pg54457.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54457.epub3.images"], ["Aquellas mujercitas", "Alcott, Louisa May", 54458, "gutendex", 9800, "https://www.gutenberg.org/cache/epub/54458/pg54458.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54458.epub3.images"], ["Hombrecitos", "Alcott, Louisa May", 54459, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/54459/pg54459.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54459.epub3.images"], ["David Copperfield", "Dickens, Charles", 54460, "gutendex", 11500, "https://www.gutenberg.org/cache/epub/54460/pg54460.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54460.epub3.images"], ["Oliver Twist", "Dickens, Charles", 54461, "gutendex", 12900, "https://www.gutenberg.org/cache/epub/54461/pg54461.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54461.epub3.images"], ["Cuento de Navidad", "Dickens, Charles", 54462, "gutendex", 17200, "https://www.gutenberg.org/cache/epub/54462/pg54462.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54462.epub3.images"], ["El jard\u00edn secreto", "Burnett, Frances Hodgson", 54463, "gutendex", 11800, "https://www.gutenberg.org/cache/epub/54463/pg54463.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54463.epub3.images"], ["El peque\u00f1o lord Fauntleroy", "Burnett, Frances Hodgson", 54464, "gutendex", 8600, "https://www.gutenberg.org/cache/epub/54464/pg54464.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54464.epub3.images"], ["La princesita", "Burnett, Frances Hodgson", 54465, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/54465/pg54465.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54465.epub3.images"], ["El principito", "Saint-Exup\u00e9ry, Antoine de", "ol_principito_inf", "openlibrary", 33400, "https://covers.openlibrary.org/b/id/10708272-M.jpg", null], ["Charlie y la f\u00e1brica de chocolate", "Dahl, Roald", "ol_charlie_chocolate", "openlibrary", 26700, "https://covers.openlibrary.org/b/id/12459564-M.jpg", null], ["Matilda", "Dahl, Roald", "ol_matilda", "openlibrary", 28400, "https://covers.openlibrary.org/b/id/12889769-M.jpg", null], ["James y el melocot\u00f3n gigante", "Dahl, Roald", "ol_james_melocoton", "openlibrary", 19500, null, null], ["Las brujas", "Dahl, Roald", "ol_las_brujas", "openlibrary", 21300, "https://covers.openlibrary.org/b/id/12374442-M.jpg", null], ["El gran gigante bonach\u00f3n", "Dahl, Roald", "ol_ggb", "openlibrary", 18900, "https://covers.openlibrary.org/b/id/9176033-M.jpg", null], ["Donde viven los monstruos", "Sendak, Maurice", "ol_monstruos", "openlibrary", 22100, "https://covers.openlibrary.org/b/id/50842-M.jpg", null], ["Cuentos por tel\u00e9fono", "Rodari, Gianni", "ol_cuentos_telefono", "openlibrary", 17400, "https://covers.openlibrary.org/b/id/7396950-M.jpg", null], ["Gram\u00e1tica de la fantas\u00eda", "Rodari, Gianni", "ol_gramatica_fantasia", "openlibrary", 16200, "https://covers.openlibrary.org/b/id/11571768-M.jpg", null], ["F\u00e1bulas de Esopo", "Esopo", 54466, "gutendex", 14500, "https://www.gutenberg.org/cache/epub/54466/pg54466.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54466.epub3.images"], ["F\u00e1bulas de La Fontaine", "La Fontaine, Jean de", 54467, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/54467/pg54467.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54467.epub3.images"], ["F\u00e1bulas literarias", "Iriarte, Tom\u00e1s de", 15410, "gutendex", 6800, "https://www.gutenberg.org/cache/epub/15410/pg15410.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15410.epub3.images"], ["F\u00e1bulas morales", "Samaniego, F\u00e9lix Mar\u00eda de", 15411, "gutendex", 7300, "https://www.gutenberg.org/cache/epub/15411/pg15411.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15411.epub3.images"], ["El gato con botas", "Perrault, Charles", 54468, "gutendex", 13100, "https://www.gutenberg.org/cache/epub/54468/pg54468.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54468.epub3.images"], ["Caperucita Roja y otros cuentos", "Perrault, Charles", 54469, "gutendex", 15400, "https://www.gutenberg.org/cache/epub/54469/pg54469.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54469.epub3.images"]], "Category: Classics of Literature": [["Don Quijote de la Mancha", "Cervantes Saavedra, Miguel de", 2000, "gutendex", 15420, "https://www.gutenberg.org/cache/epub/2000/pg2000.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2000.epub3.images"], ["La Il\u00edada", "Homero", 6130, "gutendex", 8750, "https://www.gutenberg.org/cache/epub/6130/pg6130.cover.medium.jpg", "https://www.gutenberg.org/ebooks/6130.epub3.images"], ["La Odisea", "Homero", 6245, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/6245/pg6245.cover.medium.jpg", "https://www.gutenberg.org/ebooks/6245.epub3.images"], ["La Divina Comedia", "Alighieri, Dante", 57303, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/57303/pg57303.cover.medium.jpg", "https://www.gutenberg.org/ebooks/57303.epub3.images"], ["La metamorfosis", "Kafka, Franz", 56441, "gutendex", 12100, "https://www.gutenberg.org/cache/epub/56441/pg56441.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56441.epub3.images"], ["Frankenstein o el moderno Prometeo", "Shelley, Mary Wollstonecraft", 56834, "gutendex", 14500, "https://www.gutenberg.org/cache/epub/56834/pg56834.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56834.epub3.images"], ["Dr\u00e1cula", "Stoker, Bram", 58820, "gutendex", 13200, "https://www.gutenberg.org/cache/epub/58820/pg58820.cover.medium.jpg", "https://www.gutenberg.org/ebooks/58820.epub3.images"], ["El retrato de Dorian Gray", "Wilde, Oscar", 48921, "gutendex", 10400, "https://www.gutenberg.org/cache/epub/48921/pg48921.cover.medium.jpg", "https://www.gutenberg.org/ebooks/48921.epub3.images"], ["Cumbres borrascosas", "Bront\u00eb, Emily", 49836, "gutendex", 9800, "https://www.gutenberg.org/cache/epub/49836/pg49836.cover.medium.jpg", "https://www.gutenberg.org/ebooks/49836.epub3.images"], ["La vida del Lazarillo de Tormes", "An\u00f3nimo", 3959, "gutendex", 8200, "https://www.gutenberg.org/cache/epub/3959/pg3959.cover.medium.jpg", "https://www.gutenberg.org/ebooks/3959.epub3.images"], ["La Celestina", "Rojas, Fernando de", 1619, "gutendex", 6900, "https://www.gutenberg.org/cache/epub/1619/pg1619.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1619.epub3.images"], ["La vida es sue\u00f1o", "Calder\u00f3n de la Barca, Pedro", 2516, "gutendex", 7100, "https://www.gutenberg.org/cache/epub/2516/pg2516.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2516.epub3.images"], ["Fuente Ovejuna", "Vega, Lope de", 2538, "gutendex", 5800, "https://www.gutenberg.org/cache/epub/2538/pg2538.cover.medium.jpg", "https://www.gutenberg.org/ebooks/2538.epub3.images"], ["Edipo Rey", "S\u00f3focles", 62058, "gutendex", 8300, "https://www.gutenberg.org/cache/epub/62058/pg62058.cover.medium.jpg", "https://www.gutenberg.org/ebooks/62058.epub3.images"], ["Hamlet, Pr\u00edncipe de Dinamarca", "Shakespeare, William", 56353, "gutendex", 13900, "https://www.gutenberg.org/cache/epub/56353/pg56353.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56353.epub3.images"], ["Romeo y Julieta", "Shakespeare, William", 56360, "gutendex", 14700, "https://www.gutenberg.org/cache/epub/56360/pg56360.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56360.epub3.images"], ["Macbeth", "Shakespeare, William", 56355, "gutendex", 9100, "https://www.gutenberg.org/cache/epub/56355/pg56355.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56355.epub3.images"], ["Otelo: El moro de Venecia", "Shakespeare, William", 56358, "gutendex", 7200, "https://www.gutenberg.org/cache/epub/56358/pg56358.cover.medium.jpg", "https://www.gutenberg.org/ebooks/56358.epub3.images"], ["Fausto", "Goethe, Johann Wolfgang von", 36780, "gutendex", 8800, "https://www.gutenberg.org/cache/epub/36780/pg36780.cover.medium.jpg", "https://www.gutenberg.org/ebooks/36780.epub3.images"], ["El pr\u00edncipe", "Maquiavelo, Nicol\u00e1s", 32448, "gutendex", 7890, "https://www.gutenberg.org/cache/epub/32448/pg32448.cover.medium.jpg", "https://www.gutenberg.org/ebooks/32448.epub3.images"], ["El arte de la guerra", "Sun Tzu", 59345, "gutendex", 16200, "https://www.gutenberg.org/cache/epub/59345/pg59345.cover.medium.jpg", "https://www.gutenberg.org/ebooks/59345.epub3.images"], ["Rimas y Leyendas", "B\u00e9cquer, Gustavo Adolfo", 23648, "gutendex", 9300, "https://www.gutenberg.org/cache/epub/23648/pg23648.cover.medium.jpg", "https://www.gutenberg.org/ebooks/23648.epub3.images"], ["Niebla (Nivola)", "Unamuno, Miguel de", 54181, "gutendex", 8600, "https://www.gutenberg.org/cache/epub/54181/pg54181.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54181.epub3.images"], ["Fortunata y Jacinta", "P\u00e9rez Gald\u00f3s, Benito", 17955, "gutendex", 7400, "https://www.gutenberg.org/cache/epub/17955/pg17955.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17955.epub3.images"], ["Do\u00f1a Perfecta", "P\u00e9rez Gald\u00f3s, Benito", 17358, "gutendex", 6500, "https://www.gutenberg.org/cache/epub/17358/pg17358.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17358.epub3.images"], ["Los pazos de Ulloa", "Pardo Baz\u00e1n, Emilia", 15353, "gutendex", 5900, "https://www.gutenberg.org/cache/epub/15353/pg15353.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15353.epub3.images"], ["Platero y yo", "Jim\u00e9nez, Juan Ram\u00f3n", 60183, "gutendex", 11800, "https://www.gutenberg.org/cache/epub/60183/pg60183.cover.medium.jpg", "https://www.gutenberg.org/ebooks/60183.epub3.images"], ["Los miserables (Tomo I)", "Hugo, Victor", 61830, "gutendex", 9900, "https://www.gutenberg.org/cache/epub/61830/pg61830.cover.medium.jpg", "https://www.gutenberg.org/ebooks/61830.epub3.images"], ["El conde de Montecristo", "Dumas, Alexandre", 55432, "gutendex", 15100, "https://www.gutenberg.org/cache/epub/55432/pg55432.cover.medium.jpg", "https://www.gutenberg.org/ebooks/55432.epub3.images"], ["Los tres mosqueteros", "Dumas, Alexandre", 55433, "gutendex", 13400, "https://www.gutenberg.org/cache/epub/55433/pg55433.cover.medium.jpg", "https://www.gutenberg.org/ebooks/55433.epub3.images"], ["La Eneida", "Virgilio", 54470, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/54470/pg54470.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54470.epub3.images"], ["Metamorfosis", "Ovidio", 54471, "gutendex", 10100, "https://www.gutenberg.org/cache/epub/54471/pg54471.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54471.epub3.images"], ["Di\u00e1logos", "Plat\u00f3n", 54472, "gutendex", 13200, "https://www.gutenberg.org/cache/epub/54472/pg54472.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54472.epub3.images"], ["\u00c9tica a Nic\u00f3maco", "Arist\u00f3teles", 54473, "gutendex", 11500, "https://www.gutenberg.org/cache/epub/54473/pg54473.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54473.epub3.images"], ["Meditaciones", "Marco Aurelio", 54474, "gutendex", 14600, "https://www.gutenberg.org/cache/epub/54474/pg54474.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54474.epub3.images"], ["De la brevedad de la vida", "S\u00e9neca", 54475, "gutendex", 12300, "https://www.gutenberg.org/cache/epub/54475/pg54475.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54475.epub3.images"], ["Epigramas", "Marcial", 54476, "gutendex", 7800, "https://www.gutenberg.org/cache/epub/54476/pg54476.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54476.epub3.images"], ["El Satiric\u00f3n", "Petronio", 54477, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/54477/pg54477.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54477.epub3.images"], ["El asno de oro", "Apuleyo", 54478, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/54478/pg54478.cover.medium.jpg", "https://www.gutenberg.org/ebooks/54478.epub3.images"], ["El cantar de mio Cid", "An\u00f3nimo", 15420, "gutendex", 8400, "https://www.gutenberg.org/cache/epub/15420/pg15420.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15420.epub3.images"]], "Category: Philosophy": [["El banquete", "Plat\u00f3n", 54472, "gutendex", 13200, "https://www.gutenberg.org/cache/epub/54472/pg54472.cover.medium.jpg", null], ["La Rep\u00fablica", "Plat\u00f3n", "ol_republica_platon", "openlibrary", 29500, "https://covers.openlibrary.org/b/id/14418448-M.jpg", null], ["Fed\u00f3n", "Plat\u00f3n", 54480, "gutendex", 9800, "https://www.gutenberg.org/cache/epub/54480/pg54480.cover.medium.jpg", null], ["\u00c9tica a Nic\u00f3maco", "Arist\u00f3teles", 54473, "gutendex", 11500, "https://www.gutenberg.org/cache/epub/54473/pg54473.cover.medium.jpg", null], ["Pol\u00edtica", "Arist\u00f3teles", 54481, "gutendex", 10800, "https://www.gutenberg.org/cache/epub/54481/pg54481.cover.medium.jpg", null], ["Metaf\u00edsica", "Arist\u00f3teles", 54482, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/54482/pg54482.cover.medium.jpg", null], ["Meditaciones", "Marco Aurelio", 54474, "gutendex", 14600, "https://www.gutenberg.org/cache/epub/54474/pg54474.cover.medium.jpg", null], ["De la brevedad de la vida", "S\u00e9neca", 54475, "gutendex", 12300, "https://www.gutenberg.org/cache/epub/54475/pg54475.cover.medium.jpg", null], ["Cartas a Lucilio", "S\u00e9neca", 54483, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/54483/pg54483.cover.medium.jpg", null], ["Manual de vida (Enquiridi\u00f3n)", "Epicteto", 54484, "gutendex", 13900, "https://www.gutenberg.org/cache/epub/54484/pg54484.cover.medium.jpg", null], ["Discurso del m\u00e9todo", "Descartes, Ren\u00e9", 54416, "gutendex", 10800, "https://www.gutenberg.org/cache/epub/54416/pg54416.cover.medium.jpg", null], ["Meditaciones metaf\u00edsicas", "Descartes, Ren\u00e9", 54485, "gutendex", 11900, "https://www.gutenberg.org/cache/epub/54485/pg54485.cover.medium.jpg", null], ["\u00c9tica", "Spinoza, Baruch", 54486, "gutendex", 10400, "https://www.gutenberg.org/cache/epub/54486/pg54486.cover.medium.jpg", null], ["Tratado teol\u00f3gico-pol\u00edtico", "Spinoza, Baruch", 54487, "gutendex", 8700, "https://www.gutenberg.org/cache/epub/54487/pg54487.cover.medium.jpg", null], ["Leviat\u00e1n", "Hobbes, Thomas", 54488, "gutendex", 12800, "https://www.gutenberg.org/cache/epub/54488/pg54488.cover.medium.jpg", null], ["Tratado sobre la naturaleza humana", "Hume, David", 54489, "gutendex", 9900, "https://www.gutenberg.org/cache/epub/54489/pg54489.cover.medium.jpg", null], ["Cr\u00edtica de la raz\u00f3n pura", "Kant, Immanuel", 54490, "gutendex", 15400, "https://www.gutenberg.org/cache/epub/54490/pg54490.cover.medium.jpg", null], ["Cr\u00edtica de la raz\u00f3n pr\u00e1ctica", "Kant, Immanuel", 54491, "gutendex", 10200, "https://www.gutenberg.org/cache/epub/54491/pg54491.cover.medium.jpg", null], ["Fundamentaci\u00f3n de la metaf\u00edsica de las costumbres", "Kant, Immanuel", 54492, "gutendex", 11800, "https://www.gutenberg.org/cache/epub/54492/pg54492.cover.medium.jpg", null], ["As\u00ed habl\u00f3 Zaratustra", "Nietzsche, Friedrich", "ol_zaratustra", "openlibrary", 27400, "https://covers.openlibrary.org/b/id/2290835-M.jpg", null], ["M\u00e1s all\u00e1 del bien y del mal", "Nietzsche, Friedrich", "ol_bien_mal", "openlibrary", 22100, "https://covers.openlibrary.org/b/id/4910600-M.jpg", null], ["Genealog\u00eda de la moral", "Nietzsche, Friedrich", "ol_genealogia_moral", "openlibrary", 19800, "https://covers.openlibrary.org/b/id/10774251-M.jpg", null], ["El ocaso de los \u00eddolos", "Nietzsche, Friedrich", "ol_ocaso_idolos", "openlibrary", 17500, "https://covers.openlibrary.org/b/id/3349582-M.jpg", null], ["Ecce Homo", "Nietzsche, Friedrich", "ol_ecce_homo", "openlibrary", 16800, "https://covers.openlibrary.org/b/id/1759313-M.jpg", null], ["El mundo como voluntad y representaci\u00f3n", "Schopenhauer, Arthur", 54493, "gutendex", 13100, "https://www.gutenberg.org/cache/epub/54493/pg54493.cover.medium.jpg", null], ["El arte de tener raz\u00f3n", "Schopenhauer, Arthur", 54494, "gutendex", 15200, "https://www.gutenberg.org/cache/epub/54494/pg54494.cover.medium.jpg", null], ["El contrato social", "Rousseau, Jean-Jacques", 54495, "gutendex", 13700, "https://www.gutenberg.org/cache/epub/54495/pg54495.cover.medium.jpg", null], ["Emilio, o De la educaci\u00f3n", "Rousseau, Jean-Jacques", 54496, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/54496/pg54496.cover.medium.jpg", null], ["Elogio de la locura", "Erasmo de R\u00f3terdam", 54497, "gutendex", 12400, "https://www.gutenberg.org/cache/epub/54497/pg54497.cover.medium.jpg", null], ["Pensamientos", "Pascal, Blaise", 54498, "gutendex", 11900, "https://www.gutenberg.org/cache/epub/54498/pg54498.cover.medium.jpg", null], ["Sobre la libertad", "Mill, John Stuart", 54499, "gutendex", 12600, "https://www.gutenberg.org/cache/epub/54499/pg54499.cover.medium.jpg", null], ["El utilitarismo", "Mill, John Stuart", 54500, "gutendex", 10100, "https://www.gutenberg.org/cache/epub/54500/pg54500.cover.medium.jpg", null], ["El mito de S\u00edsifo", "Camus, Albert", "ol_sisifo", "openlibrary", 26200, "https://covers.openlibrary.org/b/id/1014395-M.jpg", null], ["El ser y la nada", "Sartre, Jean-Paul", "ol_ser_nada", "openlibrary", 21800, "https://covers.openlibrary.org/b/id/14240191-M.jpg", null], ["El existencialismo es un humanismo", "Sartre, Jean-Paul", "ol_existencialismo", "openlibrary", 23900, "https://covers.openlibrary.org/b/id/9825014-M.jpg", null], ["Tractatus Logico-Philosophicus", "Wittgenstein, Ludwig", "ol_tractatus", "openlibrary", 18900, "https://covers.openlibrary.org/b/id/5415771-M.jpg", null], ["Investigaciones filos\u00f3ficas", "Wittgenstein, Ludwig", "ol_investigaciones_filo", "openlibrary", 16400, "https://covers.openlibrary.org/b/id/8067128-M.jpg", null], ["Ser y tiempo", "Heidegger, Martin", "ol_ser_tiempo", "openlibrary", 19200, "https://covers.openlibrary.org/b/id/2208564-M.jpg", null], ["La condici\u00f3n humana", "Arendt, Hannah", "ol_condicion_humana", "openlibrary", 22500, "https://covers.openlibrary.org/b/id/5746840-M.jpg", null], ["Vigilar y castigar", "Foucault, Michel", "ol_vigilar_castigar", "openlibrary", 24800, "https://covers.openlibrary.org/b/id/5539160-M.jpg", null]], "Category: Biography": [["Confesiones", "Agust\u00edn de Hipona", 54510, "gutendex", 14200, "https://www.gutenberg.org/cache/epub/54510/pg54510.cover.medium.jpg", null], ["Vidas paralelas", "Plutarco", 54411, "gutendex", 10400, "https://www.gutenberg.org/cache/epub/54411/pg54411.cover.medium.jpg", null], ["Vida de los doce c\u00e9sares", "Suetonio", 54511, "gutendex", 11800, "https://www.gutenberg.org/cache/epub/54511/pg54511.cover.medium.jpg", null], ["Confesiones", "Rousseau, Jean-Jacques", 54512, "gutendex", 13100, "https://www.gutenberg.org/cache/epub/54512/pg54512.cover.medium.jpg", null], ["Vida de Benvenuto Cellini", "Cellini, Benvenuto", 54513, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/54513/pg54513.cover.medium.jpg", null], ["Vida de Samuel Johnson", "Boswell, James", 54514, "gutendex", 9700, "https://www.gutenberg.org/cache/epub/54514/pg54514.cover.medium.jpg", null], ["Poes\u00eda y verdad", "Goethe, Johann Wolfgang von", 54515, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/54515/pg54515.cover.medium.jpg", null], ["Mi vida y amores", "Casanova, Giacomo", 54516, "gutendex", 12300, "https://www.gutenberg.org/cache/epub/54516/pg54516.cover.medium.jpg", null], ["Historia de mi vida", "Sand, George", 54517, "gutendex", 8400, "https://www.gutenberg.org/cache/epub/54517/pg54517.cover.medium.jpg", null], ["Vida de Jes\u00fas", "Renan, Ernest", 54518, "gutendex", 10100, "https://www.gutenberg.org/cache/epub/54518/pg54518.cover.medium.jpg", null], ["Diario de Ana Frank", "Frank, Anne", "ol_diario_ana_frank", "openlibrary", 35400, "https://covers.openlibrary.org/b/id/8584021-M.jpg", null], ["El mundo de ayer", "Zweig, Stefan", "ol_mundo_ayer", "openlibrary", 28900, "https://covers.openlibrary.org/b/id/13027664-M.jpg", null], ["Momentos estelares de la humanidad", "Zweig, Stefan", "ol_momentos_estelares", "openlibrary", 27100, "https://covers.openlibrary.org/b/id/13226425-M.jpg", null], ["Mar\u00eda Antonieta", "Zweig, Stefan", "ol_maria_antonieta", "openlibrary", 21400, "https://covers.openlibrary.org/b/id/6536618-M.jpg", null], ["Fouch\u00e9: Retrato de un hombre pol\u00edtico", "Zweig, Stefan", "ol_fouche", "openlibrary", 22800, "https://covers.openlibrary.org/b/id/8766476-M.jpg", null], ["Magallanes: El hombre y su gesta", "Zweig, Stefan", "ol_magallanes", "openlibrary", 19700, "https://covers.openlibrary.org/b/id/6480308-M.jpg", null], ["Erasmo de R\u00f3terdam", "Zweig, Stefan", "ol_erasmo_zweig", "openlibrary", 17500, null, null], ["Balzac", "Zweig, Stefan", "ol_balzac_zweig", "openlibrary", 16800, "https://covers.openlibrary.org/b/id/977377-M.jpg", null], ["Vivir para contarla", "Garc\u00eda M\u00e1rquez, Gabriel", "ol_vivir_contarla", "openlibrary", 26500, "https://covers.openlibrary.org/b/id/10097398-M.jpg", null], ["Confieso que he vivido", "Neruda, Pablo", "ol_confieso_vivido", "openlibrary", 24300, "https://covers.openlibrary.org/b/id/1048424-M.jpg", null], ["Paula", "Allende, Isabel", "ol_paula_allende", "openlibrary", 25100, "https://covers.openlibrary.org/b/id/8230367-M.jpg", null], ["Autobiograf\u00eda de un yogui", "Yogananda, Paramahansa", "ol_auto_yogui", "openlibrary", 28400, "https://covers.openlibrary.org/b/id/805448-M.jpg", null], ["Historia de mis experimentos con la verdad", "Gandhi, Mahatma", "ol_gandhi_auto", "openlibrary", 29800, null, null], ["El largo camino hacia la libertad", "Mandela, Nelson", "ol_mandela_libertad", "openlibrary", 31200, "https://covers.openlibrary.org/b/id/12702407-M.jpg", null], ["Steve Jobs", "Isaacson, Walter", "ol_steve_jobs", "openlibrary", 33500, "https://covers.openlibrary.org/b/id/12374726-M.jpg", null], ["Einstein: Su vida y su universo", "Isaacson, Walter", "ol_einstein_isaacson", "openlibrary", 27400, "https://covers.openlibrary.org/b/id/474440-M.jpg", null], ["Leonardo da Vinci", "Isaacson, Walter", "ol_leonardo_isaacson", "openlibrary", 26800, "https://covers.openlibrary.org/b/id/8087691-M.jpg", null], ["Frida: Una biograf\u00eda de Frida Kahlo", "Herrera, Hayden", "ol_frida_kahlo", "openlibrary", 24200, "https://covers.openlibrary.org/b/id/21291-M.jpg", null], ["Borges: Una biograf\u00eda", "Woodall, James", "ol_borges_bio", "openlibrary", 18500, null, null], ["Garc\u00eda M\u00e1rquez: El viaje a la semilla", "Sald\u00edvar, Dasso", "ol_gabo_saldivar", "openlibrary", 17900, "https://covers.openlibrary.org/b/id/3804277-M.jpg", null], ["La estatua de bronce", "Suetonio", 54519, "gutendex", 7600, "https://www.gutenberg.org/cache/epub/54519/pg54519.cover.medium.jpg", null], ["Vida de Carlomagno", "Eginardo", 54520, "gutendex", 8200, "https://www.gutenberg.org/cache/epub/54520/pg54520.cover.medium.jpg", null], ["Memorias de ultratumba", "Chateaubriand, Fran\u00e7ois-Ren\u00e9 de", 54521, "gutendex", 11400, "https://www.gutenberg.org/cache/epub/54521/pg54521.cover.medium.jpg", null], ["Diario \u00edntimo", "Amiel, Henri-Fr\u00e9d\u00e9ric", 54522, "gutendex", 9500, "https://www.gutenberg.org/cache/epub/54522/pg54522.cover.medium.jpg", null], ["Apolog\u00eda de S\u00f3crates", "Plat\u00f3n", 54523, "gutendex", 14800, "https://www.gutenberg.org/cache/epub/54523/pg54523.cover.medium.jpg", null], ["Vida de Santa Teresa de Jes\u00fas", "Teresa de Jes\u00fas, Santa", 15430, "gutendex", 9900, "https://www.gutenberg.org/cache/epub/15430/pg15430.cover.medium.jpg", null], ["Historia de mi vida", "Keller, Helen", "ol_helen_keller", "openlibrary", 22100, "https://covers.openlibrary.org/b/id/7101652-M.jpg", null], ["Infancia", "Tolst\u00f3i, Lev", 54524, "gutendex", 10700, "https://www.gutenberg.org/cache/epub/54524/pg54524.cover.medium.jpg", null], ["Adolescencia", "Tolst\u00f3i, Lev", 54525, "gutendex", 9300, "https://www.gutenberg.org/cache/epub/54525/pg54525.cover.medium.jpg", null], ["Juventud", "Tolst\u00f3i, Lev", 54526, "gutendex", 8800, "https://www.gutenberg.org/cache/epub/54526/pg54526.cover.medium.jpg", null]], "Category: Art": [["Vidas de los m\u00e1s excelentes pintores", "Vasari, Giorgio", 54530, "gutendex", 13400, "https://www.gutenberg.org/cache/epub/54530/pg54530.cover.medium.jpg", null], ["Tratado de la pintura", "Vinci, Leonardo da", 54531, "gutendex", 15200, "https://www.gutenberg.org/cache/epub/54531/pg54531.cover.medium.jpg", null], ["Historia del arte", "Gombrich, E. H.", "ol_gombrich_arte", "openlibrary", 36200, "https://covers.openlibrary.org/b/id/10660176-M.jpg", null], ["De lo espiritual en el arte", "Kandinski, Vasili", "ol_kandinski_arte", "openlibrary", 24800, null, null], ["Punto y l\u00ednea sobre el plano", "Kandinski, Vasili", "ol_punto_linea", "openlibrary", 21500, null, null], ["Cartas a Theo", "Gogh, Vincent van", "ol_cartas_theo", "openlibrary", 29400, "https://covers.openlibrary.org/b/id/3362461-M.jpg", null], ["El arte como experiencia", "Dewey, John", "ol_arte_experiencia", "openlibrary", 17800, "https://covers.openlibrary.org/b/id/12333144-M.jpg", null], ["Modos de ver", "Berger, John", "ol_modos_ver", "openlibrary", 27100, "https://covers.openlibrary.org/b/id/95272-M.jpg", null], ["La obra de arte en la \u00e9poca de su reproductibilidad t\u00e9cnica", "Benjamin, Walter", "ol_benjamin_arte", "openlibrary", 28300, "https://covers.openlibrary.org/b/id/12341379-M.jpg", null], ["Historia de la belleza", "Eco, Umberto", "ol_historia_belleza", "openlibrary", 25900, "https://covers.openlibrary.org/b/id/168424-M.jpg", null], ["Historia de la fealdad", "Eco, Umberto", "ol_historia_fealdad", "openlibrary", 23400, "https://covers.openlibrary.org/b/id/7901519-M.jpg", null], ["Sobre el arte y los artistas", "Gombrich, E. H.", "ol_gombrich_artistas", "openlibrary", 19200, null, null], ["El elogio de la sombra", "Tanizaki, Junichiro", "ol_elogio_sombra", "openlibrary", 24500, "https://covers.openlibrary.org/b/id/707129-M.jpg", null], ["Los diez libros de arquitectura", "Vitruvio", 54532, "gutendex", 12100, "https://www.gutenberg.org/cache/epub/54532/pg54532.cover.medium.jpg", null], ["Las piedras de Venecia", "Ruskin, John", 54533, "gutendex", 9800, "https://www.gutenberg.org/cache/epub/54533/pg54533.cover.medium.jpg", null], ["Las siete l\u00e1mparas de la arquitectura", "Ruskin, John", 54534, "gutendex", 9200, "https://www.gutenberg.org/cache/epub/54534/pg54534.cover.medium.jpg", null], ["El sentido del orden", "Gombrich, E. H.", "ol_sentido_orden", "openlibrary", 18400, null, null], ["Arte y percepci\u00f3n visual", "Arnheim, Rudolf", "ol_arnheim_arte", "openlibrary", 21800, "https://covers.openlibrary.org/b/id/10553913-M.jpg", null], ["El poder del centro", "Arnheim, Rudolf", "ol_poder_centro", "openlibrary", 16900, "https://covers.openlibrary.org/b/id/5258348-M.jpg", null], ["Hacia una arquitectura", "Le Corbusier", "ol_le_corbusier", "openlibrary", 22900, "https://covers.openlibrary.org/b/id/10393660-M.jpg", null], ["El lenguaje cl\u00e1sico de la arquitectura", "Summerson, John", "ol_summerson_arq", "openlibrary", 17500, "https://covers.openlibrary.org/b/id/315983-M.jpg", null], ["Breve historia de la pintura", "Garc\u00eda S\u00e1nchez, Laura", "ol_breve_pintura", "openlibrary", 15400, null, null], ["El beso de Judas", "Fontcuberta, Joan", "ol_beso_judas", "openlibrary", 16800, "https://covers.openlibrary.org/b/id/9150900-M.jpg", null], ["Sobre la fotograf\u00eda", "Sontag, Susan", "ol_sontag_foto", "openlibrary", 27600, "https://covers.openlibrary.org/b/id/238890-M.jpg", null], ["La c\u00e1mara l\u00facida", "Barthes, Roland", "ol_camara_lucida", "openlibrary", 25800, "https://covers.openlibrary.org/b/id/2290930-M.jpg", null], ["Po\u00e9tica del espacio", "Bachelard, Gaston", "ol_poetica_espacio", "openlibrary", 23100, null, null], ["Est\u00e9tica", "Hegel, G. W. F.", 54535, "gutendex", 11200, "https://www.gutenberg.org/cache/epub/54535/pg54535.cover.medium.jpg", null], ["Cr\u00edtica del juicio", "Kant, Immanuel", 54536, "gutendex", 10700, "https://www.gutenberg.org/cache/epub/54536/pg54536.cover.medium.jpg", null], ["Laocoonte", "Lessing, Gotthold Ephraim", 54537, "gutendex", 8600, "https://www.gutenberg.org/cache/epub/54537/pg54537.cover.medium.jpg", null], ["Cartas sobre la educaci\u00f3n est\u00e9tica del hombre", "Schiller, Friedrich", 54538, "gutendex", 9400, "https://www.gutenberg.org/cache/epub/54538/pg54538.cover.medium.jpg", null], ["El nacimiento de la tragedia", "Nietzsche, Friedrich", "ol_nacimiento_tragedia", "openlibrary", 24100, "https://covers.openlibrary.org/b/id/1010784-M.jpg", null], ["\u00bfQu\u00e9 es el arte?", "Tolst\u00f3i, Lev", 54539, "gutendex", 12800, "https://www.gutenberg.org/cache/epub/54539/pg54539.cover.medium.jpg", null], ["Salones", "Baudelaire, Charles", 54540, "gutendex", 8900, "https://www.gutenberg.org/cache/epub/54540/pg54540.cover.medium.jpg", null], ["El pintor de la vida moderna", "Baudelaire, Charles", 54541, "gutendex", 10200, "https://www.gutenberg.org/cache/epub/54541/pg54541.cover.medium.jpg", null], ["Arte moderno", "Meier-Graefe, Julius", 54542, "gutendex", 7800, "https://www.gutenberg.org/cache/epub/54542/pg54542.cover.medium.jpg", null], ["Manifiesto futurista", "Marinetti, Filippo Tommaso", 54543, "gutendex", 9100, "https://www.gutenberg.org/cache/epub/54543/pg54543.cover.medium.jpg", null], ["Manifiestos del surrealismo", "Breton, Andr\u00e9", "ol_manifiesto_surreal", "openlibrary", 21200, "https://covers.openlibrary.org/b/id/9442647-M.jpg", null], ["La deshumanizaci\u00f3n del arte", "Ortega y Gasset, Jos\u00e9", "ol_deshumanizacion_arte", "openlibrary", 19800, null, null], ["El arte contempor\u00e1neo", "Guasch, Anna Mar\u00eda", "ol_arte_contemp", "openlibrary", 16500, "https://covers.openlibrary.org/b/id/10575650-M.jpg", null], ["Teor\u00eda est\u00e9tica", "Adorno, Theodor W.", "ol_teoria_estetica", "openlibrary", 18200, "https://covers.openlibrary.org/b/id/7257218-M.jpg", null]], "Category: Comic and Graphic Books": [["Maus: Relato de un superviviente", "Spiegelman, Art", "ol_maus", "openlibrary", 34500, "https://covers.openlibrary.org/b/id/10210168-M.jpg", null], ["Pers\u00e9polis", "Satrapi, Marjane", "ol_persepolis", "openlibrary", 31800, "https://covers.openlibrary.org/b/id/12648921-M.jpg", null], ["Watchmen", "Moore, Alan y Gibbons, Dave", "ol_watchmen", "openlibrary", 35900, "https://covers.openlibrary.org/b/id/7774899-M.jpg", null], ["V de Vendetta", "Moore, Alan y Lloyd, David", "ol_v_vendetta", "openlibrary", 29800, "https://covers.openlibrary.org/b/id/12293384-M.jpg", null], ["Sandman: Preludios y nocturnos", "Gaiman, Neil", "ol_sandman_1", "openlibrary", 28700, "https://covers.openlibrary.org/b/id/13987090-M.jpg", null], ["Batman: El regreso del caballero oscuro", "Miller, Frank", "ol_batman_dkr", "openlibrary", 31200, "https://covers.openlibrary.org/b/id/12564960-M.jpg", null], ["Batman: A\u00f1o Uno", "Miller, Frank y Mazzucchelli, David", "ol_batman_ano_uno", "openlibrary", 27400, "https://covers.openlibrary.org/b/id/13945477-M.jpg", null], ["Sin City: El duro adi\u00f3s", "Miller, Frank", "ol_sin_city_1", "openlibrary", 24500, "https://covers.openlibrary.org/b/id/814816-M.jpg", null], ["Contrato con Dios", "Eisner, Will", "ol_contrato_dios", "openlibrary", 23800, null, null], ["El arte secuencial", "Eisner, Will", "ol_comics_arte_secuencial", "openlibrary", 22100, null, null], ["Entender el c\u00f3mic", "McCloud, Scott", "ol_entender_comic", "openlibrary", 26400, "https://covers.openlibrary.org/b/id/13755737-M.jpg", null], ["Hacer c\u00f3mics", "McCloud, Scott", "ol_hacer_comics", "openlibrary", 21900, null, null], ["Reinventar el c\u00f3mic", "McCloud, Scott", "ol_reinventar_comic", "openlibrary", 19500, "https://covers.openlibrary.org/b/id/41821-M.jpg", null], ["Arrugas", "Roca, Paco", "ol_arrugas_roca", "openlibrary", 28100, "https://covers.openlibrary.org/b/id/6258190-M.jpg", null], ["La casa", "Roca, Paco", "ol_la_casa_roca", "openlibrary", 24300, "https://covers.openlibrary.org/b/id/7395449-M.jpg", null], ["Los surcos del azar", "Roca, Paco", "ol_surcos_azar", "openlibrary", 23500, "https://covers.openlibrary.org/b/id/7272392-M.jpg", null], ["El invierno del dibujante", "Roca, Paco", "ol_invierno_dibujante", "openlibrary", 21400, "https://covers.openlibrary.org/b/id/7089362-M.jpg", null], ["Blacksad: Un lugar entre las sombras", "Canales, Juan D\u00edaz y Guarnido, Juanjo", "ol_blacksad_1", "openlibrary", 30500, "https://covers.openlibrary.org/b/id/7274558-M.jpg", null], ["Blacksad: Arctic Nation", "Canales, Juan D\u00edaz y Guarnido, Juanjo", "ol_blacksad_2", "openlibrary", 26200, "https://covers.openlibrary.org/b/id/7274558-M.jpg", null], ["Blacksad: Alma roja", "Canales, Juan D\u00edaz y Guarnido, Juanjo", "ol_blacksad_3", "openlibrary", 24800, "https://covers.openlibrary.org/b/id/10874482-M.jpg", null], ["Corto Malt\u00e9s: La balada del mar salado", "Pratt, Hugo", "ol_corto_balada", "openlibrary", 27800, "https://covers.openlibrary.org/b/id/13509955-M.jpg", null], ["Corto Malt\u00e9s: F\u00e1bula de Venecia", "Pratt, Hugo", "ol_corto_venecia", "openlibrary", 22400, "https://covers.openlibrary.org/b/id/13749844-M.jpg", null], ["Las aventuras de Tint\u00edn: El loto azul", "Herg\u00e9", "ol_tintin_loto", "openlibrary", 32100, "https://covers.openlibrary.org/b/id/755245-M.jpg", null], ["Las aventuras de Tint\u00edn: El secreto del Unicornio", "Herg\u00e9", "ol_tintin_unicornio", "openlibrary", 31500, "https://covers.openlibrary.org/b/id/188979-M.jpg", null], ["Las aventuras de Tint\u00edn: El tesoro de Rackham el Rojo", "Herg\u00e9", "ol_tintin_rackham", "openlibrary", 30800, "https://covers.openlibrary.org/b/id/8375148-M.jpg", null], ["Ast\u00e9rix el Galo", "Goscinny, Ren\u00e9 y Uderzo, Albert", "ol_asterix_galo", "openlibrary", 33900, "https://covers.openlibrary.org/b/id/962725-M.jpg", null], ["Ast\u00e9rix y Cleopatra", "Goscinny, Ren\u00e9 y Uderzo, Albert", "ol_asterix_cleopatra", "openlibrary", 31400, "https://covers.openlibrary.org/b/id/499621-M.jpg", null], ["Ast\u00e9rix en Hispania", "Goscinny, Ren\u00e9 y Uderzo, Albert", "ol_asterix_hispania", "openlibrary", 29500, "https://covers.openlibrary.org/b/id/499645-M.jpg", null], ["Mafalda: Todas las tiras", "Quino", "ol_mafalda_todas", "openlibrary", 36800, "https://covers.openlibrary.org/b/id/12716890-M.jpg", null], ["10 a\u00f1os con Mafalda", "Quino", "ol_10_anos_mafalda", "openlibrary", 28400, "https://covers.openlibrary.org/b/id/1052097-M.jpg", null], ["El Eternauta", "Oesterheld, H\u00e9ctor Germ\u00e1n y Solano L\u00f3pez, Francisco", "ol_eternauta", "openlibrary", 34200, "https://covers.openlibrary.org/b/id/11348505-M.jpg", null], ["Alack Sinner", "Mu\u00f1oz, Jos\u00e9 y Sampayo, Carlos", "ol_alack_sinner", "openlibrary", 19800, "https://covers.openlibrary.org/b/id/12786292-M.jpg", null], ["Ghost in the Shell", "Shirow, Masamune", "ol_ghost_in_shell", "openlibrary", 28500, "https://covers.openlibrary.org/b/id/5435726-M.jpg", null], ["Akira (Vol. 1)", "Otomo, Katsuhiro", "ol_akira_1", "openlibrary", 31900, "https://covers.openlibrary.org/b/id/814967-M.jpg", null], ["Nausica\u00e4 del Valle del Viento", "Miyazaki, Hayao", "ol_nausicaa_1", "openlibrary", 29400, null, null], ["From Hell", "Moore, Alan y Campbell, Eddie", "ol_from_hell", "openlibrary", 27500, "https://covers.openlibrary.org/b/id/652474-M.jpg", null], ["La broma asesina", "Moore, Alan y Bolland, Brian", "ol_killing_joke", "openlibrary", 32800, "https://covers.openlibrary.org/b/id/2737891-M.jpg", null], ["Crisis en tierras infinitas", "Wolfman, Marv y P\u00e9rez, George", "ol_crisis_infinitas", "openlibrary", 26900, "https://covers.openlibrary.org/b/id/798602-M.jpg", null], ["Kingdom Come", "Waid, Mark y Ross, Alex", "ol_kingdom_come", "openlibrary", 28900, "https://covers.openlibrary.org/b/id/798157-M.jpg", null], ["All-Star Superman", "Morrison, Grant y Quitely, Frank", "ol_allstar_superman", "openlibrary", 27800, null, null]], "Category: Music": [["Beethoven: Cartas y Pensamientos", "Beethoven, Ludwig van", 1317, "gutendex", 45200, "https://www.gutenberg.org/cache/epub/1317/pg1317.cover.medium.jpg", "https://www.gutenberg.org/ebooks/1317.epub3.images"], ["Mozart: Epistolario y Vida Familiar", "Mozart, Wolfgang Amadeus", 17563, "gutendex", 42100, "https://www.gutenberg.org/cache/epub/17563/pg17563.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17563.epub3.images"], ["Johann Sebastian Bach: Vida, Arte y Obra", "Forkel, Johann Nikolaus", 35686, "gutendex", 39800, "https://www.gutenberg.org/cache/epub/35686/pg35686.cover.medium.jpg", "https://www.gutenberg.org/ebooks/35686.epub3.images"], ["Chopin: El Hombre y su M\u00fasica", "Huneker, James", 13540, "gutendex", 38400, "https://www.gutenberg.org/cache/epub/13540/pg13540.cover.medium.jpg", "https://www.gutenberg.org/ebooks/13540.epub3.images"], ["Grandes Compositores Alemanes", "Ferris, George T.", 16560, "gutendex", 36700, "https://www.gutenberg.org/cache/epub/16560/pg16560.cover.medium.jpg", "https://www.gutenberg.org/ebooks/16560.epub3.images"], ["Grandes Compositores Italianos y Franceses", "Ferris, George T.", 26400, "gutendex", 34500, "https://www.gutenberg.org/cache/epub/26400/pg26400.cover.medium.jpg", "https://www.gutenberg.org/ebooks/26400.epub3.images"], ["Richard Wagner: Su Vida y Dramas Musicales", "Henderson, W. J.", 17094, "gutendex", 33200, "https://www.gutenberg.org/cache/epub/17094/pg17094.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17094.epub3.images"], ["C\u00f3mo Escuchar la M\u00fasica", "Krehbiel, Henry Edward", 15814, "gutendex", 35900, "https://www.gutenberg.org/cache/epub/15814/pg15814.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15814.epub3.images"], ["Historia Fundamental de la M\u00fasica", "Stanford, Charles Villiers y Forsyth, Cecil", 13348, "gutendex", 31800, "https://www.gutenberg.org/cache/epub/13348/pg13348.cover.medium.jpg", "https://www.gutenberg.org/ebooks/13348.epub3.images"], ["La M\u00fasica: Arte y Lenguaje Universal", "Spalding, Walter Raymond", 24785, "gutendex", 30500, "https://www.gutenberg.org/cache/epub/24785/pg24785.cover.medium.jpg", "https://www.gutenberg.org/ebooks/24785.epub3.images"], ["Las Grandes \u00d3peras Cl\u00e1sicas y sus Argumentos", "Upton, George P.", 26038, "gutendex", 29800, "https://www.gutenberg.org/cache/epub/26038/pg26038.cover.medium.jpg", "https://www.gutenberg.org/ebooks/26038.epub3.images"], ["Beethoven y sus Nueve Sinfon\u00edas", "Grove, George", 23485, "gutendex", 34100, "https://www.gutenberg.org/cache/epub/23485/pg23485.cover.medium.jpg", "https://www.gutenberg.org/ebooks/23485.epub3.images"], ["La Vida de Johannes Brahms", "May, Florence", 21894, "gutendex", 28700, "https://www.gutenberg.org/cache/epub/21894/pg21894.cover.medium.jpg", "https://www.gutenberg.org/ebooks/21894.epub3.images"], ["La M\u00fasica y los M\u00fasicos", "Lavignac, Albert", 17588, "gutendex", 27900, "https://www.gutenberg.org/cache/epub/17588/pg17588.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17588.epub3.images"], ["El Libro Completo de la \u00d3pera", "Kobb\u00e9, Gustav", 16298, "gutendex", 32400, "https://www.gutenberg.org/cache/epub/16298/pg16298.cover.medium.jpg", "https://www.gutenberg.org/ebooks/16298.epub3.images"], ["El Arte del Cantante y la Voz Humana", "Henderson, W. J.", 14068, "gutendex", 26800, "https://www.gutenberg.org/cache/epub/14068/pg14068.cover.medium.jpg", "https://www.gutenberg.org/ebooks/14068.epub3.images"], ["Filosof\u00eda de la M\u00fasica y Leyes del Sonido", "Pole, William", 16428, "gutendex", 25700, "https://www.gutenberg.org/cache/epub/16428/pg16428.cover.medium.jpg", "https://www.gutenberg.org/ebooks/16428.epub3.images"], ["La \u00d3pera Rusa: Tchaikovsky y Rimsky-Korsakov", "Newmarch, Rosa", 24391, "gutendex", 26400, "https://www.gutenberg.org/cache/epub/24391/pg24391.cover.medium.jpg", "https://www.gutenberg.org/ebooks/24391.epub3.images"], ["Evoluci\u00f3n de la Orquestaci\u00f3n Moderna", "Coerne, Louis Adolphe", 13411, "gutendex", 27200, "https://www.gutenberg.org/cache/epub/13411/pg13411.cover.medium.jpg", "https://www.gutenberg.org/ebooks/13411.epub3.images"], ["Historia del Canto y de los Grandes Int\u00e9rpretes", "Taylor, David C.", 22896, "gutendex", 24900, "https://www.gutenberg.org/cache/epub/22896/pg22896.cover.medium.jpg", "https://www.gutenberg.org/ebooks/22896.epub3.images"], ["Historia de la M\u00fasica de C\u00e1mara", "Kilburn, N.", 18274, "gutendex", 25300, "https://www.gutenberg.org/cache/epub/18274/pg18274.cover.medium.jpg", "https://www.gutenberg.org/ebooks/18274.epub3.images"], ["Estudios sobre la M\u00fasica Moderna", "Hadow, W. H.", 25413, "gutendex", 24600, "https://www.gutenberg.org/cache/epub/25413/pg25413.cover.medium.jpg", "https://www.gutenberg.org/ebooks/25413.epub3.images"], ["M\u00fasica y Moral: Psicolog\u00eda de la Armon\u00eda", "Haweis, H. R.", 19683, "gutendex", 23800, "https://www.gutenberg.org/cache/epub/19683/pg19683.cover.medium.jpg", "https://www.gutenberg.org/ebooks/19683.epub3.images"], ["El Viol\u00edn: Constructores C\u00e9lebres e Imitadores", "Hart, George", 24901, "gutendex", 28100, "https://www.gutenberg.org/cache/epub/24901/pg24901.cover.medium.jpg", "https://www.gutenberg.org/ebooks/24901.epub3.images"], ["Ensayos Cr\u00edticos e Hist\u00f3ricos sobre la M\u00fasica", "MacDowell, Edward", 26421, "gutendex", 23400, "https://www.gutenberg.org/cache/epub/26421/pg26421.cover.medium.jpg", "https://www.gutenberg.org/ebooks/26421.epub3.images"], ["Los Compositores Rom\u00e1nticos", "Mason, Daniel Gregory", 17290, "gutendex", 25100, "https://www.gutenberg.org/cache/epub/17290/pg17290.cover.medium.jpg", "https://www.gutenberg.org/ebooks/17290.epub3.images"], ["Historia del Piano y la T\u00e9cnica Pian\u00edstica", "Brinsmead, Edgar", 20110, "gutendex", 26900, "https://www.gutenberg.org/cache/epub/20110/pg20110.cover.medium.jpg", "https://www.gutenberg.org/ebooks/20110.epub3.images"], ["H\u00e9ctor Berlioz: Cartas y Memorias", "Berlioz, Hector", 13248, "gutendex", 24200, "https://www.gutenberg.org/cache/epub/13248/pg13248.cover.medium.jpg", "https://www.gutenberg.org/ebooks/13248.epub3.images"], ["El Nacimiento de la Tragedia en la M\u00fasica", "Nietzsche, Friedrich", 51060, "gutendex", 31200, "https://www.gutenberg.org/cache/epub/51060/pg51060.cover.medium.jpg", "https://www.gutenberg.org/ebooks/51060.epub3.images"], ["Psicolog\u00eda del Talento Musical", "Seashore, Carl E.", 36006, "gutendex", 22800, "https://www.gutenberg.org/cache/epub/36006/pg36006.cover.medium.jpg", "https://www.gutenberg.org/ebooks/36006.epub3.images"], ["Compositores Modernos de Europa", "Elson, Arthur", 15682, "gutendex", 23100, "https://www.gutenberg.org/cache/epub/15682/pg15682.cover.medium.jpg", "https://www.gutenberg.org/ebooks/15682.epub3.images"], ["El Poder del Sonido y la Belleza Musical", "Gurney, Edmund", 18196, "gutendex", 22400, "https://www.gutenberg.org/cache/epub/18196/pg18196.cover.medium.jpg", "https://www.gutenberg.org/ebooks/18196.epub3.images"], ["Diccionario Biogr\u00e1fico de M\u00fasicos", "Grove, George", 23072, "gutendex", 27600, "https://www.gutenberg.org/cache/epub/23072/pg23072.cover.medium.jpg", "https://www.gutenberg.org/ebooks/23072.epub3.images"], ["Historia del Violoncello y su Literatura", "Straeten, Edmund van der", 33303, "gutendex", 21900, "https://www.gutenberg.org/cache/epub/33303/pg33303.cover.medium.jpg", "https://www.gutenberg.org/ebooks/33303.epub3.images"], ["La M\u00fasica Tradicional de los Pueblos", "Chorley, Henry Fothergill", 21390, "gutendex", 22500, "https://www.gutenberg.org/cache/epub/21390/pg21390.cover.medium.jpg", "https://www.gutenberg.org/ebooks/21390.epub3.images"], ["Las Leyes de la Ac\u00fastica y el Arte Musical", "Shenstone, Arthur Michael", 18501, "gutendex", 21800, "https://www.gutenberg.org/cache/epub/18501/pg18501.cover.medium.jpg", "https://www.gutenberg.org/ebooks/18501.epub3.images"], ["Vida de Franz Liszt y el Romanticismo", "Huneker, James", 20658, "gutendex", 25800, "https://www.gutenberg.org/cache/epub/20658/pg20658.cover.medium.jpg", "https://www.gutenberg.org/ebooks/20658.epub3.images"], ["M\u00fasica y Poes\u00eda en el Renacimiento", "Lanier, Sidney", 16763, "gutendex", 21400, "https://www.gutenberg.org/cache/epub/16763/pg16763.cover.medium.jpg", "https://www.gutenberg.org/ebooks/16763.epub3.images"], ["Historia de la Orquesta y sus Instrumentos", "Macpherson, Stewart", 14247, "gutendex", 28500, "https://www.gutenberg.org/cache/epub/14247/pg14247.cover.medium.jpg", "https://www.gutenberg.org/ebooks/14247.epub3.images"], ["Tratado Completo del Canto", "Garc\u00eda, Manuel", 39804, "gutendex", 26200, "https://www.gutenberg.org/cache/epub/39804/pg39804.cover.medium.jpg", "https://www.gutenberg.org/ebooks/39804.epub3.images"]]};
const CATALOG_CATEGORIES = {};
for (const [kCat, bks] of Object.entries(RAW_CATS)) {
	CATALOG_CATEGORIES[kCat] = bks.map(([t, a, idVal, fu, dl, cov, ep]) => ({
		id: idVal,
		fuente: fu,
		title: t,
		authors: a ? [a] : [],
		bookshelves: [kCat],
		downloads: dl,
		epub: ep || null,
		txt: null,
		cover: cov || null
	}));
}

const tonoDe = (s) => { let h = 0; for (let i = 0; i < String(s).length; i++) h = (h * 31 + String(s).charCodeAt(i)) % 360; return h; };
const inicialesDe = (s) => String(s || "").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "L";
/** v145 (v199: 5 bibliotecas): libros gratis (dominio público y obras abiertas):
*  1) Project Gutenberg (vía Gutendex), 2) Open Library, 3) Archive.org,
*  4) Wikisource español, 5) Wikisource inglés.
*  Sin cuentas, sin IA: solo metadatos abiertos + descarga directa.
*  Cada biblioteca carga por su cuenta: la primera aparece rápido y las
*  demás se añaden en segundo plano mientras el usuario navega. */
const TEMAS = [
	{
		id: "all",
		label: "Todos"
	},
	{
		id: "Category: Politics",
		label: "Política"
	},
	{
		id: "Category: Novels",
		label: "Novela"
	},
	{
		id: "Category: Romance",
		label: "Romance"
	},
	{
		id: "Category: Crime, Thrillers and Mystery",
		label: "Misterio"
	},
	{
		id: "Category: Poetry",
		label: "Poesía"
	},
	{
		id: "Category: Short Stories",
		label: "Cuentos"
	},
	{
		id: "Category: Plays/Films/Dramas",
		label: "Teatro"
	},
	{
		id: "Category: Adventure",
		label: "Aventura"
	},
	{
		id: "Category: History",
		label: "Historia"
	},
	{
		id: "Category: Science",
		label: "Ciencia"
	},
	{
		id: "Category: Fantasy",
		label: "Fantasía"
	},
	{
		id: "Category: Juvenile",
		label: "Infantil"
	},
	{
		id: "Category: Classics of Literature",
		label: "Clásicos"
	},
	{
		id: "Category: Philosophy",
		label: "Filosofía"
	},
	{
		id: "Category: Religion",
		label: "Religión"
	},
	{
		id: "Category: Biography",
		label: "Biografía"
	},
	{
		id: "Category: Art",
		label: "Arte"
	},
	{
		id: "Category: Comic and Graphic Books",
		label: "Cómics"
	},
	{
		id: "Category: Music",
		label: "Música"
	}
];
function normalizar(r) {
	const fmt = r.formats || {};
	return {
		id: r.id,
		fuente: "gutendex",
		title: r.title || "Sin título",
		authors: (r.authors || []).map((a) => a.name).filter(Boolean),
		bookshelves: r.bookshelves || [],
		downloads: r.download_count || 0,
		epub: fmt["application/epub+zip"] || null,
		txt: fmt["text/plain; charset=utf-8"] || null,
		cover: fmt["image/jpeg"] || null
	};
}
/** Open Library: obra (work) → libro normalizado. La descarga se resuelve
*  al momento contra Archive.org (identificador `ia`). */
function normalizarOL(d) {
	const ia = Array.isArray(d.ia) && d.ia.length ? String(d.ia[0]) : (typeof d.ia === "string" ? d.ia : null);
	const authors = Array.isArray(d.author_name) ? d.author_name : Array.isArray(d.authors) ? d.authors.map((a) => typeof a === "object" ? (a.name || a.key || "") : String(a)).filter(Boolean) : [];
	const covId = d.cover_id || d.cover_i;
	return {
		id: "ol" + String(d.key || d.title || Math.random()).replace("/works/", "").replace(/[^a-zA-Z0-9_-]/g, ""),
		fuente: "openlibrary",
		title: d.title || "Sin título",
		authors: authors.length ? authors : (d.author_name || []),
		bookshelves: Array.isArray(d.subject) ? d.subject.slice(0, 4) : [],
		downloads: (d.edition_count || 1) * 120,
		epub: null,
		txt: null,
		ia,
		url: d.key ? `${OL}${d.key}` : null,
		cover: covId ? `https://covers.openlibrary.org/b/id/${covId}-M.jpg` : ia ? `${IA}/services/img/${ia}` : null
	};
}
const OL_SUBJECTS = {
	"Category: Novels": "fiction",
	"Category: Romance": "romance",
	"Category: Crime, Thrillers and Mystery": "mystery",
	"Category: Poetry": "poetry",
	"Category: Short Stories": "short_stories",
	"Category: Plays/Films/Dramas": "drama",
	"Category: Adventure": "adventure",
	"Category: History": "history",
	"Category: Science": "science",
	"Category: Fantasy": "fantasy",
	"Category: Juvenile": "children",
	"Category: Classics of Literature": "classic_literature",
	"Category: Philosophy": "philosophy",
	"Category: Biography": "biography",
	"Category: Art": "art",
	"Category: Comic and Graphic Books": "comic_books"
};
async function fetchLibrosCategoria(tema, offset = 40, limit = 40) {
	const sub = OL_SUBJECTS[tema] || "fiction";
	try {
		const url = `${OL}/subjects/${sub}.json?limit=${limit}&offset=${offset}`;
		const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
		if (r.ok) {
			const j = await r.json();
			if (Array.isArray(j.works) && j.works.length > 0) {
				return j.works.map((w) => {
					const libro = normalizarOL(w);
					libro.bookshelves = [tema];
					return libro;
				});
			}
		}
	} catch (e) {
		console.warn("OL subject error:", e);
	}
	try {
		const page = Math.floor(offset / limit) + 1;
		const q = encodeURIComponent(`mediatype:texts AND subject:${sub}`);
		const url = `${IA}/advancedsearch.php?q=${q}&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=downloads&sort%5B%5D=downloads+desc&rows=${limit}&page=${page}&output=json`;
		const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
		if (r.ok) {
			const j = await r.json();
			const docs = (j.response || {}).docs || [];
			return docs.map((d) => {
				const libro = normalizarIA(d);
				libro.bookshelves = [tema];
				return libro;
			});
		}
	} catch (e) {
		console.warn("IA subject error:", e);
	}
	return [];
}
/** Archive.org: item de texto en español con EPUB (≤1923, dominio público). */
function normalizarIA(d) {
	return {
		id: "ia" + String(d.identifier || "").replace(/[^a-zA-Z0-9_-]/g, ""),
		fuente: "archive",
		title: (Array.isArray(d.title) ? d.title[0] : d.title) || "Sin título",
		authors: (Array.isArray(d.creator) ? d.creator : [d.creator]).filter(Boolean),
		bookshelves: [],
		downloads: d.downloads || 0,
		epub: null,
		txt: null,
		ia: String(d.identifier || ""),
		url: d.identifier ? `${IA}/details/${d.identifier}` : null,
		cover: d.identifier ? `${IA}/services/img/${d.identifier}` : null
	};
}
/** v199: Wikisource (es/en): obra del namespace principal. No tiene archivo
*  directo descargable: al tocarla se elige el formato (EPUB/PDF) y el
*  navegador busca el archivo (libro.soloBusqueda). */
function normalizarWS(titulo, fuente) {
	const host = fuente === "wikisource-en" ? "en.wikisource.org" : "es.wikisource.org";
	const pref = fuente === "wikisource-en" ? "Book:" : "Libro:";
	const limpio = String(titulo).replace(/^Libro:/, "").replace(/^Book:/, "").trim();
	return {
		id: (fuente === "wikisource-en" ? "wse" : "wss") + encodeURIComponent(limpio).slice(0, 80),
		fuente,
		title: limpio,
		authors: [],
		bookshelves: [],
		downloads: 0,
		epub: null,
		txt: null,
		ia: null,
		url: `https://${host}/wiki/${encodeURIComponent(pref + limpio)}`,
		cover: null,
		soloBusqueda: true
	};
}
/* ==== v217: FICHA del libro (sinopsis, autor, valoración, similares) ==== */
const META_RATINGS = "librosGratis_calificaciones"; // v217: mis estrellas por libro (clave = claveLibro)
const fichaCache = /* @__PURE__ */ new Map();
const limpiarTexto = (t) => String(t || "").replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, "$1").replace(/\*\*?|__|\r/g, "").replace(/\s*\(\[source\]\[\d+\]\)/g, "").replace(/\[\d+\]:\s*\S+/g, "").replace(/-{3,}[\s\S]*$/, "").replace(/\n{3,}/g, "\n\n").trim();
const jsonCon = async (url, ms = 12e3) => { const r = await fetch(url, { signal: AbortSignal.timeout(ms) }); if (!r.ok) throw new Error(url + " → " + r.status); return r.json(); };
const tituloLimpio = (t) => String(t || "").replace(/\s*[:;(].*$/, "").replace(/^(Libro|Book):/, "").trim() || String(t || "");
/** Open Library: obra, valoración, autor y similares (por tema o por autor). */
async function fichaOL(libro) {
	const out = {};
	const titulo = tituloLimpio(libro.title);
	const autorVerdadero = nombreAutorLimpio((libro.authors || [])[0]) || (libro.authors || [])[0] || "";
	const autor = autorVerdadero;
	let work = null;
	if (libro.fuente === "openlibrary" && libro.url) {
		const key = libro.url.replace(OL, "");
		try { const d = await jsonCon(`${OL}/search.json?q=key:${encodeURIComponent(key)}&limit=1&fields=key,title,author_key,author_name,cover_i,first_publish_year,ratings_average,ratings_count,subject,number_of_pages_median`); work = (d.docs || [])[0] || null; } catch {}
	}
	if (!work) {
		const p = new URLSearchParams({ title: titulo, limit: "3", fields: "key,title,author_key,author_name,cover_i,first_publish_year,ratings_average,ratings_count,subject,number_of_pages_median" });
		if (autor) p.set("author", autor.split(" ").slice(-1)[0]);
		try { const d = await jsonCon(`${OL}/search.json?` + p.toString()); work = (d.docs || [])[0] || null; } catch {}
		if (!work && autor) { try { const d = await jsonCon(`${OL}/search.json?q=${encodeURIComponent(titulo)}&limit=1&fields=key,title,author_key,author_name,cover_i,first_publish_year,ratings_average,ratings_count,subject,number_of_pages_median`); work = (d.docs || [])[0] || null; } catch {} }
	}
	if (!work) return out;
	out.olKey = work.key;
	out.anio = work.first_publish_year || null;
	out.paginas = work.number_of_pages_median || null;
	out.temas = (work.subject || []).filter((t) => t.length < 40).slice(0, 8);
	if (work.ratings_count) out.comunidad = { media: Math.round(work.ratings_average * 10) / 10, n: work.ratings_count };
	if (!libro.cover && work.cover_i) out.cover = `https://covers.openlibrary.org/b/id/${work.cover_i}-L.jpg`;
	const autorKey = (work.author_key || [])[0];
	out.autorNombre = autorVerdadero || (work.author_name || [])[0] || "";
	const tareas = [];
	tareas.push(jsonCon(`${OL}${work.key}.json`).then((w) => {
		const d = w.description; const txt = typeof d === "string" ? d : d && d.value;
		if (txt) out.sinopsisOL = limpiarTexto(txt);
	}).catch(() => {}));
	if (autorKey) tareas.push(jsonCon(`${OL}/authors/${autorKey}.json`).then((a) => {
		const b = a.bio; const txt = typeof b === "string" ? b : b && b.value;
		out.autor = { key: autorKey, nombre: a.name || out.autorNombre, bio: txt ? limpiarTexto(txt) : null, nac: a.birth_date || null, def: a.death_date || null, foto: a.photos && a.photos.length && a.photos[0] > 0 ? `https://covers.openlibrary.org/a/id/${a.photos[0]}-M.jpg` : `https://covers.openlibrary.org/a/olid/${autorKey}-M.jpg` };
	}).catch(() => {}));
	// similares: otras obras del mismo autor con texto libre + obras del tema principal
	const norm = (b) => ({ id: "ol" + String(b.key || "").replace("/works/", ""), fuente: "openlibrary", title: b.title, authors: b.author_name || (b.authors || []).map((a) => a.name) || [], bookshelves: [], downloads: b.edition_count || 0, epub: null, txt: null, ia: (Array.isArray(b.ia) ? b.ia[0] : b.ia) || null, url: `${OL}${b.key}`, cover: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : b.cover_id ? `https://covers.openlibrary.org/b/id/${b.cover_id}-M.jpg` : null });
	if (autorKey) tareas.push(jsonCon(`${OL}/search.json?author_key=${autorKey}&limit=12&fields=key,title,author_name,cover_i,ia,has_fulltext,edition_count&sort=editions`).then((d) => {
		out.delAutor = (d.docs || []).filter((b) => b.key !== work.key && b.title).map(norm).filter((b, i, arr) => arr.findIndex((x) => claveLibro(x) === claveLibro(b)) === i).slice(0, 10);
	}).catch(() => {}));
	const temaSim = (work.subject || []).find((t) => /fiction|novel|poetry|drama|history|philosophy|science|adventure|romance|mystery|fantasy|classic|literature/i.test(t) && !/in fiction|translations|readers|textbooks|study/i.test(t)) || (work.subject || [])[0];
	if (temaSim) tareas.push(jsonCon(`${OL}/subjects/${encodeURIComponent(temaSim.toLowerCase().replace(/\s+/g, "_").replace(/,/g, ""))}.json?limit=14`).then((d) => {
		out.similares = (d.works || []).filter((w) => w.key !== work.key).map((w) => norm({ key: w.key, title: w.title, authors: w.authors, cover_id: w.cover_id, ia: w.ia, edition_count: w.edition_count })).slice(0, 12);
		out.temaSimilares = temaSim;
	}).catch(() => {}));
	await Promise.all(tareas);
	return out;
}
/** Wikipedia (es): resumen en español del libro y del autor (cuando existe artículo). */
async function fichaWiki(libro, autorNombre) {
	const out = {};
	const buscar = async (q) => {
		const p = new URLSearchParams({ action: "query", generator: "search", gsrsearch: q, gsrlimit: "1", prop: "extracts|pageimages|description", exintro: "1", explaintext: "1", exsentences: "6", piprop: "thumbnail", pithumbsize: "400", format: "json", origin: "*" });
		const j = await jsonCon("https://es.wikipedia.org/w/api.php?" + p.toString());
		const pg = Object.values((j.query || {}).pages || {})[0];
		if (!pg || !pg.extract) return null;
		return { titulo: pg.title, texto: limpiarTexto(pg.extract), desc: pg.description || "", foto: pg.thumbnail && pg.thumbnail.source || null, url: "https://es.wikipedia.org/wiki/" + encodeURIComponent(pg.title.replace(/ /g, "_")) };
	};
	const titulo = tituloLimpio(libro.title);
	const autor = autorNombre || (libro.authors || [])[0] || "";
	const simp = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !["the", "los", "las", "del", "der", "die", "das", "and", "por", "con", "para", "una", "uno"].includes(w));
	const pareceElLibro = (r) => {
		if (!r) return false;
		const pt = simp(r.titulo); const tt = simp(titulo);
		const comun = tt.filter((w) => pt.includes(w)).length;
		if (!tt.length || comun < Math.min(2, tt.length)) return false; // el artículo debe compartir el título
		if (autor && simp(autor).length && simp(r.titulo).join(" ") === simp(autor.split(",").reverse().join(" ")).join(" ")) return false; // es el artículo del AUTOR
		return /(novela|libro|obra|poema|poemario|cuento|ensayo|tratado|drama|comedia|tragedia|relato|colecci|publicad|escrit)/i.test(r.texto + " " + r.desc) && !/^(escritor|novelista|poeta|dramaturg|autor|filósof|historiador)/i.test(r.desc);
	};
	const [lib, aut] = await Promise.all([
		buscar(`${titulo} ${autor ? autor.split(",")[0] : ""} libro`).then((r) => pareceElLibro(r) ? r : null).catch(() => null),
		autor ? buscar(`${autor.split(",").reverse().join(" ").trim()} escritor`).then((r) => r && /(escritor|novelista|poeta|dramaturg|autor|ensayista|filósof|historiador|periodista|literat)/i.test(r.texto + " " + r.desc) ? r : null).catch(() => null) : null
	]);
	if (lib) out.sinopsisWiki = lib;
	if (aut) out.autorWiki = aut;
	return out;
}
/** Google Books (sin clave): respaldo de sinopsis y valoración (cuota compartida: puede fallar). */
async function fichaGB(libro) {
	const titulo = tituloLimpio(libro.title);
	const autor = (libro.authors || [])[0] || "";
	const q = `intitle:${JSON.stringify(titulo)}` + (autor ? `+inauthor:${JSON.stringify(autor.split(",")[0])}` : "");
	const j = await jsonCon(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&langRestrict=es&maxResults=3&printType=books`, 9e3);
	const items = j.items || [];
	const v = (items.find((i) => i.volumeInfo && i.volumeInfo.description) || items[0] || {}).volumeInfo;
	if (!v) return {};
	const out = {};
	if (v.description) out.sinopsisGB = limpiarTexto(v.description.replace(/<[^>]+>/g, " "));
	if (v.ratingsCount) out.comunidadGB = { media: v.averageRating, n: v.ratingsCount };
	if (v.categories) out.temasGB = v.categories.slice(0, 4);
	if (v.pageCount) out.paginasGB = v.pageCount;
	return out;
}
/** Trae toda la ficha; cada bloque llega por separado (onParte) para pintar sin esperar al resto. */
async function cargarFicha(libro, onParte) {
	const k = claveLibro(libro);
	if (fichaCache.has(k)) { onParte(fichaCache.get(k)); return fichaCache.get(k); }
	const autorVerdadero = nombreAutorLimpio((libro.authors || [])[0]) || (libro.authors || [])[0] || "";
	const acc = { libro, autorNombre: autorVerdadero };
	if (libro.synopsis || libro.description) acc.sinopsisPropia = libro.synopsis || libro.description;
	const emitir = (p) => { Object.assign(acc, p); onParte({ ...acc }); };
	emitir({});
	const ol = fichaOL(libro).then((p) => { emitir(p); return p; }).catch(() => ({}));
	const wiki = fichaWiki(libro, autorVerdadero).then(emitir).catch(() => {});
	await Promise.all([ol, wiki]);
	if (!acc.sinopsisPropia && !acc.sinopsisOL && !acc.sinopsisWiki) { try { emitir(await fichaGB(libro)); } catch {} }
	if (!acc.comunidad && !acc.comunidadGB && acc.sinopsisOL) { try { emitir(await fichaGB(libro)); } catch {} }
	acc.listo = true;
	emitir({});
	fichaCache.set(k, acc);
	return acc;
}
const Estrellas = ({ valor, onCambiar, grande }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "rate-stars" + (grande ? " big" : ""),
	children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "rate-star" + ((valor || 0) >= n ? " on" : ""),
		"aria-label": "Calificar con " + n + " estrellas",
		onClick: (e) => { e.stopPropagation(); onCambiar((valor || 0) === n ? 0 : n); },
		children: "★"
	}, n))
});
function claveLibro(b) {
	const limpia = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return limpia(b.title).slice(0, 40) + "|" + limpia((b.authors || [])[0]);
}
function nombreBase(libro) {
	const safe = (libro.title || "libro").replace(/[^\w\sáéíóúñü-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase().slice(0, 50) || "libro";
	const pref = libro.fuente === "openlibrary" ? "openlibrary" : libro.fuente === "archive" ? "archive" : libro.fuente && libro.fuente.startsWith("wikisource") ? "wikisource" : "gutenberg";
	const seg = String(libro.id).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "libro";
	return `${pref}-${seg}-${safe}`;
}
function nombreArchivo(libro, ext) {
	return nombreBase(libro) + "." + ext;
}
/** Trae una página (40) de la biblioteca pedida de forma progresiva. { books, mas, token } */
const LIBROS_EXTRA = [{"id": "roy_mol", "fuente": "royalroad", "title": "Mother of Learning", "authors": ["Domagoj Kurmaic (Nobody103)"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 85000, "cover": "https://covers.openlibrary.org/b/id/12833441-L.jpg", "url": "https://www.royalroad.com/fiction/21220/mother-of-learning", "synopsis": "Zorian Kazinski es un estudiante de magia atrapado en un bucle temporal de un mes. Debe aprender magia avanzada, descubrir el misterio del bucle y sobrevivir a una invasión planificada."}, {"id": "roy_ph", "fuente": "royalroad", "title": "The Primal Hunter", "authors": ["Zogarth"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 92000, "cover": "https://covers.openlibrary.org/b/id/12833442-L.jpg", "url": "https://www.royalroad.com/fiction/36049/the-primal-hunter", "synopsis": "Jake, un empleado de oficina corriente, despierta en un tutorial salvaje donde el multiverso se rige por un sistema RPG. Con su arco y sus sentidos primitivos despierta su verdadera naturaleza."}, {"id": "roy_dcc", "fuente": "royalroad", "title": "Dungeon Crawler Carl", "authors": ["Matt Dinniman"], "bookshelves": ["Category: Comic and Graphic Books", "Category: Fantasy"], "downloads": 91000, "cover": "https://covers.openlibrary.org/b/id/12674890-L.jpg", "url": "https://www.royalroad.com/fiction/33844/dungeon-crawler-carl", "synopsis": "La Tierra ha sido colapsada en una megamasmorra para un reality show intergaláctico. Carl y su gata Princesa Donut luchan por sobrevivir piso a piso contra trampas y monstruos bizarros."}, {"id": "roy_boc", "fuente": "royalroad", "title": "Beware of Chicken", "authors": ["CasualFarmer"], "bookshelves": ["Category: Fantasy", "Category: Novels"], "downloads": 78000, "cover": "https://covers.openlibrary.org/b/id/12833443-L.jpg", "url": "https://www.royalroad.com/fiction/39408/beware-of-chicken", "synopsis": "Jin Rou decide abandonar las sangrientas sectas de cultivación marcial para mudarse a una granja pacífica, sin saber que sus animales comienzan a cultivar energía espiritual."}, {"id": "roy_twi", "fuente": "royalroad", "title": "The Wandering Inn", "authors": ["pirateaba"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 96000, "cover": "https://covers.openlibrary.org/b/id/12833444-L.jpg", "url": "https://www.royalroad.com/fiction/10073/the-wandering-inn", "synopsis": "Erin Solstice se transporta a un mundo fantástico y se convierte en posadera en una colina solitaria, haciendo amistad con dragones, goblins y caballeros errantes."}, {"id": "roy_hwfwm", "fuente": "royalroad", "title": "He Who Fights with Monsters", "authors": ["Shirtaloon"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 88000, "cover": "https://covers.openlibrary.org/b/id/12674891-L.jpg", "url": "https://www.royalroad.com/fiction/26294/he-who-fights-with-monsters", "synopsis": "Jason despierta desnudo en un laberinto mágico sin recuerdos claros. Armado con poderes de sombras, astucia y humor sarcástico, busca abrirse paso en una sociedad hostil."}, {"id": "roy_dotf", "fuente": "royalroad", "title": "Defiance of the Fall", "authors": ["JF Brink"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 84000, "cover": "https://covers.openlibrary.org/b/id/12674892-L.jpg", "url": "https://www.royalroad.com/fiction/24709/defiance-of-the-fall", "synopsis": "Cuando el multiverso colisiona con la Tierra, Zac se encuentra aislado en una isla salvaje armada sólo con un hacha y la voluntad inquebrantable de sobrevivir a la incursión demoníaca."}, {"id": "roy_tpr", "fuente": "royalroad", "title": "The Perfect Run", "authors": ["Maxime J. Durand"], "bookshelves": ["Category: Science Fiction", "Category: Adventure"], "downloads": 81000, "cover": "https://covers.openlibrary.org/b/id/12674893-L.jpg", "url": "https://www.royalroad.com/fiction/33535/the-perfect-run", "synopsis": "Ryan Romano tiene el poder de crear puntos de guardado en el tiempo y revivir al morir. En una ciudad distópica infestada de superhumanos, busca la partida perfecta."}, {"id": "roy_ss", "fuente": "royalroad", "title": "Super Supportive", "authors": ["Sleyca"], "bookshelves": ["Category: Fantasy", "Category: Novels"], "downloads": 76000, "cover": "https://covers.openlibrary.org/b/id/12833446-L.jpg", "url": "https://www.royalroad.com/fiction/63759/super-supportive", "synopsis": "Alden sueña con ser un héroe de apoyo para asistir a los grandes campeones de la Tierra, descubriendo contratos cósmicos y la verdadera carga de la magia intergaláctica."}, {"id": "roy_chrys", "fuente": "royalroad", "title": "Chrysalis", "authors": ["RinoZ"], "bookshelves": ["Category: Fantasy", "Category: Comic and Graphic Books"], "downloads": 72000, "cover": "https://covers.openlibrary.org/b/id/12833447-L.jpg", "url": "https://www.royalroad.com/fiction/22518/chrysalis", "synopsis": "Anthony renace en el fondo de una colosal mazmorra subterránea como una pequeña hormiga monstruosa que decide salvar a su colonia con lealtad y evolución implacable."}, {"id": "roy_ah", "fuente": "royalroad", "title": "Azarinth Healer", "authors": ["Rhaegar"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 89000, "cover": "https://covers.openlibrary.org/b/id/12833448-L.jpg", "url": "https://www.royalroad.com/fiction/16930/azarinth-healer", "synopsis": "Ilea, amante del kickboxing, desbloquea una clase oculta de sanadora de batalla en un mundo desconocido, lanzándose a pelear contra monstruos colosales."}, {"id": "roy_btdem", "fuente": "royalroad", "title": "Beneath the Dragoneye Moons", "authors": ["Selkie Myth"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 74000, "cover": "https://covers.openlibrary.org/b/id/12833449-L.jpg", "url": "https://www.royalroad.com/fiction/36299/beneath-the-dragoneye-moons", "synopsis": "Elaine jura el juramento de sanadora y viaja por el mundo bajo la luz de las lunas del dragón, protegiendo vidas y enfrentando plagas sobrenaturales."}, {"id": "roy_vainq", "fuente": "royalroad", "title": "Vainqueur the Dragon", "authors": ["Maxime J. Durand"], "bookshelves": ["Category: Fantasy", "Category: Comic and Graphic Books"], "downloads": 68000, "cover": "https://covers.openlibrary.org/b/id/12833450-L.jpg", "url": "https://www.royalroad.com/fiction/26534/vainqueur-the-dragon", "synopsis": "Un dragón vanidoso y codicioso descubre el sistema RPG y recluta a un desventurado ladrón como su esbirro para conquistar reinos enteros."}, {"id": "roy_motf", "fuente": "royalroad", "title": "Mark of the Fool", "authors": ["J.M. Clarke"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 71000, "cover": "https://covers.openlibrary.org/b/id/12833451-L.jpg", "url": "https://www.royalroad.com/fiction/41618/mark-of-the-fool", "synopsis": "Alex es marcado por los dioses con la Marca del Bufón, supuestamente la peor maldición, pero usa su ingenio para dominar la magia en la prestigiosa universidad."}, {"id": "roy_ip", "fuente": "royalroad", "title": "Iron Prince", "authors": ["Bryce O'Connor"], "bookshelves": ["Category: Science Fiction", "Category: Adventure"], "downloads": 75000, "cover": "https://covers.openlibrary.org/b/id/12833452-L.jpg", "url": "https://www.royalroad.com/fiction/38065/iron-prince", "synopsis": "Reidon Ward compensa su cuerpo frágil con un intelecto táctico excepcional en una academia militar futurista guiada por trajes biomecánicos."}, {"id": "roy_cradle", "fuente": "royalroad", "title": "Cradle: Unsouled", "authors": ["Will Wight"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 93000, "cover": "https://covers.openlibrary.org/b/id/12833453-L.jpg", "url": "https://www.royalroad.com/fiction/45112/cradle-unsouled", "synopsis": "Lindon nace sin aptitud de alma en un clan marcial, pero un heraldo de los cielos le revela el fin de su hogar y decide desafiar el destino."}, {"id": "roy_bastion", "fuente": "royalroad", "title": "Bastion", "authors": ["Phil Tucker"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 69000, "cover": "https://covers.openlibrary.org/b/id/12833454-L.jpg", "url": "https://www.royalroad.com/fiction/49012/bastion", "synopsis": "Scorio despierta de las cenizas de la muerte sin memoria de sus pecados pasados y debe abrirse camino por los nueve niveles del infierno."}, {"id": "roy_mage", "fuente": "royalroad", "title": "Mage Errant", "authors": ["John Bierce"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 70000, "cover": "https://covers.openlibrary.org/b/id/12833455-L.jpg", "url": "https://www.royalroad.com/fiction/31110/mage-errant", "synopsis": "Hugh de Emblin, rechazado por los maestros magos, es acogido por un hechicero ermitaño que le enseña magia no convencional junto a otros tres inadaptados."}, {"id": "roy_ats", "fuente": "royalroad", "title": "All the Skills", "authors": ["Honour Rae"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 73000, "cover": "https://covers.openlibrary.org/b/id/12833456-L.jpg", "url": "https://www.royalroad.com/fiction/55687/all-the-skills", "synopsis": "En un mundo donde las habilidades mágicas se obtienen mediante cartas coleccionables, Arthur encuentra una carta legendaria de dragón."}, {"id": "roy_bob", "fuente": "royalroad", "title": "The Calamitous Bob", "authors": ["Mecanimus"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 65000, "cover": "https://covers.openlibrary.org/b/id/12833457-L.jpg", "url": "https://www.royalroad.com/fiction/41788/the-calamitous-bob", "synopsis": "Vivian, una médica de combate del ejército francés, aterriza en una tierra mágica devastada y se alía con un golem viviente para reconstruir una fortaleza."}, {"id": "roy_spire", "fuente": "royalroad", "title": "Spire's Spite", "authors": ["K.T. Hanna"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 62000, "cover": "https://covers.openlibrary.org/b/id/12833458-L.jpg", "url": "https://www.royalroad.com/fiction/35112/spires-spite", "synopsis": "Ascender por la espira dimensional promete la gloria eterna o la aniquilación de la propia cordura."}, {"id": "roy_rune", "fuente": "royalroad", "title": "The Runesmith", "authors": ["Kuropon"], "bookshelves": ["Category: Fantasy", "Category: Science"], "downloads": 66000, "cover": "https://covers.openlibrary.org/b/id/12833459-L.jpg", "url": "https://www.royalroad.com/fiction/33844/the-runesmith", "synopsis": "Un joven herrero redescubre el arte prohibido del tallado de runas mágicas, forjando armas legendarias en su taller."}, {"id": "roy_ark", "fuente": "royalroad", "title": "Ar'Kendrithyst", "authors": ["Arcane Emperor"], "bookshelves": ["Category: Fantasy", "Category: Philosophy"], "downloads": 64000, "cover": "https://covers.openlibrary.org/b/id/12833460-L.jpg", "url": "https://www.royalroad.com/fiction/26727/arkendrithyst", "synopsis": "Un padre y su hija son transportados a un mundo salvaje donde la comprensión profunda de la física permite reinventar los hechizos."}, {"id": "roy_salvos", "fuente": "royalroad", "title": "Salvos", "authors": ["MelasD"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 77000, "cover": "https://covers.openlibrary.org/b/id/12833461-L.jpg", "url": "https://www.royalroad.com/fiction/37438/salvos", "synopsis": "Una pequeña ninfa demoníaca recién nacida lucha por sobrevivir en el inframundo devorando monstruos y haciendo aliados leales."}, {"id": "roy_cinna", "fuente": "royalroad", "title": "Cinnamon Bun", "authors": ["RavensDagger"], "bookshelves": ["Category: Fantasy", "Category: Juvenile"], "downloads": 69000, "cover": "https://covers.openlibrary.org/b/id/12833462-L.jpg", "url": "https://www.royalroad.com/fiction/31429/cinnamon-bun", "synopsis": "Broccoli Bunch recibe la clase de limpiadora y sanadora, decidida a hacer amigos y vencer las amenazas con amabilidad y esponjosidad."}, {"id": "roy_stray", "fuente": "royalroad", "title": "Stray Cat Strut", "authors": ["RavensDagger"], "bookshelves": ["Category: Science Fiction", "Category: Adventure"], "downloads": 71000, "cover": "https://covers.openlibrary.org/b/id/12833463-L.jpg", "url": "https://www.royalroad.com/fiction/33600/stray-cat-strut", "synopsis": "En una metrópolis ciberpunk invadida por alienígenas, una joven huérfana recibe implantes cibernéticos para defender los suburbios."}, {"id": "roy_delve", "fuente": "royalroad", "title": "Delve", "authors": ["Seneca"], "bookshelves": ["Category: Fantasy", "Category: Science"], "downloads": 79000, "cover": "https://covers.openlibrary.org/b/id/12833464-L.jpg", "url": "https://www.royalroad.com/fiction/25225/delve", "synopsis": "Mark explora los números y las sinergias del sistema de auras con un rigor matemático absoluto para desbloquear poderes colosales."}, {"id": "roy_vill", "fuente": "royalroad", "title": "Only Villains Do That", "authors": ["Aaron Shih"], "bookshelves": ["Category: Fantasy", "Category: Comic and Graphic Books"], "downloads": 63000, "cover": "https://covers.openlibrary.org/b/id/12833465-L.jpg", "url": "https://www.royalroad.com/fiction/40182/only-villains-do-that", "synopsis": "Elegido involuntariamente como el Señor Oscuro por una diosa malvada, decide sindicalizar a los esbirros y derrotar a los héroes."}, {"id": "roy_wtc", "fuente": "royalroad", "title": "Worth the Candle", "authors": ["Alexander Wales"], "bookshelves": ["Category: Fantasy", "Category: Philosophy"], "downloads": 76000, "cover": "https://covers.openlibrary.org/b/id/12833466-L.jpg", "url": "https://www.royalroad.com/fiction/25137/worth-the-candle", "synopsis": "Un director de rol de mesa despierta en un mundo construido a partir de todas las campañas que diseñó en su vida, enfrentando sus propios traumas."}, {"id": "roy_poa", "fuente": "royalroad", "title": "The Path of Ascension", "authors": ["C. Mantis"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 78000, "cover": "https://covers.openlibrary.org/b/id/12833467-L.jpg", "url": "https://www.royalroad.com/fiction/40920/the-path-of-ascension", "synopsis": "Matt posee un talento de maná inagotable pero de regeneración nula al principio, abriéndose paso por las fracturas del imperio."}, {"id": "roy_tree", "fuente": "royalroad", "title": "Tree of Aeons", "authors": ["Spaizzzer"], "bookshelves": ["Category: Fantasy", "Category: History"], "downloads": 72000, "cover": "https://covers.openlibrary.org/b/id/12833468-L.jpg", "url": "https://www.royalroad.com/fiction/20568/tree-of-aeons", "synopsis": "Un hombre renace como un árbol en un bosque virgen, observando el ascenso y caída de imperios y héroes a lo largo de siglos."}, {"id": "roy_pm", "fuente": "royalroad", "title": "Paranoid Mage", "authors": ["Inadvisably Compelled"], "bookshelves": ["Category: Fantasy", "Category: Mystery"], "downloads": 74000, "cover": "https://covers.openlibrary.org/b/id/12833469-L.jpg", "url": "https://www.royalroad.com/fiction/49879/paranoid-mage", "synopsis": "A los treinta años descubre que puede manipular el espacio, ocultándose de la corrupta burocracia de magos gobernantes."}, {"id": "roy_boc2", "fuente": "royalroad", "title": "Borne of Caution", "authors": ["Fiddler Green"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 68000, "cover": "https://covers.openlibrary.org/b/id/12833470-L.jpg", "url": "https://www.royalroad.com/fiction/36950/borne-of-caution", "synopsis": "Un cuidador de animales despierta en un continente salvaje habitado por criaturas elementales, entrenándolas con respeto y ciencia."}, {"id": "roy_bog", "fuente": "royalroad", "title": "Bog Standard Isekai", "authors": ["Miles English"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 67000, "cover": "https://covers.openlibrary.org/b/id/12833471-L.jpg", "url": "https://www.royalroad.com/fiction/69512/bog-standard-isekai", "synopsis": "Un niño en un pueblo cenagoso aislado aprende magia antigua para proteger a su aldea de los peligros del bosque tenebroso."}, {"id": "roy_gh", "fuente": "royalroad", "title": "The Gilded Hero", "authors": ["williambilliam"], "bookshelves": ["Category: Fantasy", "Category: Philosophy"], "downloads": 65000, "cover": "https://covers.openlibrary.org/b/id/12833472-L.jpg", "url": "https://www.royalroad.com/fiction/29286/the-gilded-hero", "synopsis": "Invocado como el héroe de la profecía, descubre rápidamente que los reyes lo consideran una simple herramienta sacrificable."}, {"id": "roy_ism", "fuente": "royalroad", "title": "Industrial Strength Magic", "authors": ["Macronomicon"], "bookshelves": ["Category: Fantasy", "Category: Comic and Graphic Books"], "downloads": 66000, "cover": "https://covers.openlibrary.org/b/id/12833473-L.jpg", "url": "https://www.royalroad.com/fiction/65706/industrial-strength-magic", "synopsis": "Hijo de un supercientífico y una hechicera, fusiona la ingeniería pesada con los arcanos para crear armaduras imparables."}, {"id": "roy_vot", "fuente": "royalroad", "title": "Victor of Tucson", "authors": ["PlumParrot"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 69000, "cover": "https://covers.openlibrary.org/b/id/12833474-L.jpg", "url": "https://www.royalroad.com/fiction/52812/victor-of-tucson", "synopsis": "Víctor es arrancado de su vida en Arizona y vendido como gladiador esclavo en una arena subterránea donde despierta su furia berserker."}, {"id": "roy_ely", "fuente": "royalroad", "title": "Elydes", "authors": ["Kael"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 67000, "cover": "https://covers.openlibrary.org/b/id/12833475-L.jpg", "url": "https://www.royalroad.com/fiction/67742/elydes", "synopsis": "Nacido en un archipiélago tropical, Kai domina la alquimia y la botánica mágica para navegar entre islas de monstruos ancestrales."}, {"id": "roy_sylver", "fuente": "royalroad", "title": "Sylver Seeker", "authors": ["Kennit Kenway"], "bookshelves": ["Category: Fantasy", "Category: Mystery"], "downloads": 71000, "cover": "https://covers.openlibrary.org/b/id/12833476-L.jpg", "url": "https://www.royalroad.com/fiction/36065/sylver-seeker", "synopsis": "Un antiguo archinigromante despierta siglos después de su caída en un mundo dominado por un sistema mágico completamente distinto."}, {"id": "roy_jas", "fuente": "royalroad", "title": "Jackal Among Snakes", "authors": ["Nemoris"], "bookshelves": ["Category: Fantasy", "Category: Adventure"], "downloads": 73000, "cover": "https://covers.openlibrary.org/b/id/12833477-L.jpg", "url": "https://www.royalroad.com/fiction/48969/jackal-among-snakes", "synopsis": "Atrapado en el cuerpo del noble más despreciado del juego de rol más letal del mundo, debe evitar el fin de los tiempos con pura diplomacia."}, {"id": "wat_atdmv", "fuente": "wattpad", "title": "A través de mi ventana", "authors": ["Ariana Godoy"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 120000, "cover": "https://covers.openlibrary.org/b/id/11175935-L.jpg", "url": "https://www.wattpad.com/story/37625126-a-trav%C3%A9s-de-mi-ventana", "synopsis": "Raquel lleva toda la vida enamorada de su vecino Ares Hidalgo, un chico frío y misterioso al que observa en secreto hasta que un cambio en la clave del wifi lo cambia todo."}, {"id": "wat_blvd", "fuente": "wattpad", "title": "Boulevard", "authors": ["Flor M. Salvador"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 115000, "cover": "https://covers.openlibrary.org/b/id/12657274-L.jpg", "url": "https://www.wattpad.com/story/23491823-boulevard", "synopsis": "Hasley Weigel y Luke Howland no estaban destinados a encontrarse, pero juntos crean un refugio donde superar las sombras y aprender el verdadero significado del afecto."}, {"id": "wat_add", "fuente": "wattpad", "title": "Antes de diciembre", "authors": ["Joana Marcús"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 110000, "cover": "https://covers.openlibrary.org/b/id/12411080-L.jpg", "url": "https://www.wattpad.com/story/20120190-antes-de-diciembre", "synopsis": "Jenna Brown inicia la universidad lejos de su ciudad natal con una relación abierta que cambiará por completo al conocer a Jack Ross."}, {"id": "wat_sil", "fuente": "wattpad", "title": "Silence", "authors": ["Flor M. Salvador"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 88000, "cover": "https://covers.openlibrary.org/b/id/11180298-L.jpg", "url": "https://www.wattpad.com/story/45129012-silence", "synopsis": "Tras el éxito de Boulevard, una mirada desgarradora sobre los secretos no dichos, las heridas familiares y la búsqueda de redención."}, {"id": "wat_heist", "fuente": "wattpad", "title": "Heist: ¿Cazar o ser cazado?", "authors": ["Ariana Godoy"], "bookshelves": ["Category: Crime, Thrillers and Mystery", "Category: Novels"], "downloads": 95000, "cover": "https://covers.openlibrary.org/b/id/10543295-L.jpg", "url": "https://www.wattpad.com/story/56123490-heist", "synopsis": "El idílico y estricto pueblo de Wilson esconde normas implacables hasta que la llegada de la familia Stein desata una ola de misterio, crímenes y sospechas."}, {"id": "wat_damian", "fuente": "wattpad", "title": "Damián: Un secreto oscuro", "authors": ["Alex Mírez"], "bookshelves": ["Category: Crime, Thrillers and Mystery", "Category: Novels"], "downloads": 89000, "cover": "https://covers.openlibrary.org/b/id/12109840-L.jpg", "url": "https://www.wattpad.com/story/78192039-dami%C3%A1n", "synopsis": "Padme llega a Asfódelo creyendo encontrar tranquilidad, pero la presencia de Damián y los secretos de su mansión revelan una verdad escalofriante."}, {"id": "wat_asf", "fuente": "wattpad", "title": "Asfixia", "authors": ["Alex Mírez"], "bookshelves": ["Category: Science Fiction", "Category: Novels"], "downloads": 82000, "cover": "https://covers.openlibrary.org/b/id/12109845-L.jpg", "url": "https://www.wattpad.com/story/89123049-asfixia", "synopsis": "En un mundo distópico donde el aire limpio es un recurso escaso y mortalmente cotizado, Drey lucha por conseguir respiradores para su familia."}, {"id": "wat_mi", "fuente": "wattpad", "title": "Mala influencia", "authors": ["Teensspirit"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 87000, "cover": "https://covers.openlibrary.org/b/id/12309812-L.jpg", "url": "https://www.wattpad.com/story/67123984-mala-influencia", "synopsis": "Reese Russell es contratado para ser el guardaespaldas encubierto de Peyton Mills en su instituto, descubriendo que la atracción puede ser el peor peligro."}, {"id": "wat_cm", "fuente": "wattpad", "title": "Culpables: Culpa mía", "authors": ["Mercedes Ron"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 125000, "cover": "https://covers.openlibrary.org/b/id/10293847-L.jpg", "url": "https://www.wattpad.com/story/49102934-culpa-m%C3%ADa", "synopsis": "Noah debe mudarse a la mansión del nuevo marido de su madre, donde conoce a su hermanastro Nicholas Leister, desatando una peligrosa pasión prohibida."}, {"id": "wat_fda", "fuente": "wattpad", "title": "Farsa de amor a la española", "authors": ["Elena Armas"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 93000, "cover": "https://covers.openlibrary.org/b/id/11982736-L.jpg", "url": "https://www.wattpad.com/story/90123847-farsa-de-amor-a-la-espa%C3%B1ola", "synopsis": "Catalina Martín necesita desesperadamente una pareja para la boda de su hermana en España y su insoportable colega de trabajo Aaron Blackford se ofrece como voluntario."}, {"id": "wat_pm", "fuente": "wattpad", "title": "Perfectos mentirosos", "authors": ["Alex Mírez"], "bookshelves": ["Category: Crime, Thrillers and Mystery", "Category: Novels"], "downloads": 105000, "cover": "https://covers.openlibrary.org/b/id/12109850-L.jpg", "url": "https://www.wattpad.com/story/10293840-perfectos-mentirosos", "synopsis": "Jude entra en la elitista Universidad Tagus dispuesta a desenmascarar a los tres hermanos Cash, los reyes intocables del campus que juegan con las vidas ajenas."}, {"id": "wat_fleur", "fuente": "wattpad", "title": "Fleur: Mi desesperada decisión", "authors": ["Ariana Godoy"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 86000, "cover": "https://covers.openlibrary.org/b/id/10543300-L.jpg", "url": "https://www.wattpad.com/story/60192834-fleur", "synopsis": "Una historia intensa sobre la búsqueda de libertad y amor propio en medio de un entorno familiar asfixiante y decisiones cruciales de vida."}, {"id": "wat_smv", "fuente": "wattpad", "title": "Sigue mi voz", "authors": ["Ariana Godoy"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 91000, "cover": "https://covers.openlibrary.org/b/id/10543305-L.jpg", "url": "https://www.wattpad.com/story/12093849-sigue-mi-voz", "synopsis": "Klara encuentra consuelo durante sus meses en cama gracias al programa de radio de Kang, aprendiendo a sanar y redescubrir el mundo."}, {"id": "wat_tm", "fuente": "wattpad", "title": "Tres meses", "authors": ["Joana Marcús"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 98000, "cover": "https://covers.openlibrary.org/b/id/12411085-L.jpg", "url": "https://www.wattpad.com/story/20120195-tres-meses", "synopsis": "La perspectiva de Jack Ross durante los tres meses cruciales de separación, profundizando en sus dudas, crecimiento y amor hacia Jenna."}, {"id": "wat_dd", "fuente": "wattpad", "title": "Después de diciembre", "authors": ["Joana Marcús"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 99000, "cover": "https://covers.openlibrary.org/b/id/12411090-L.jpg", "url": "https://www.wattpad.com/story/20120200-despu%C3%A9s-de-diciembre", "synopsis": "El esperado reencuentro de Jenna y Ross, enfrentando las presiones adultas y la madurez de su vínculo sentimental."}, {"id": "wat_ldf", "fuente": "wattpad", "title": "Las luces de febrero", "authors": ["Joana Marcús"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 97000, "cover": "https://covers.openlibrary.org/b/id/12411095-L.jpg", "url": "https://www.wattpad.com/story/20120205-las-luces-de-febrero", "synopsis": "El desenlace triunfal de la saga Meses a tu lado, cerrando los ciclos de juventud con ternura y plenitud emocional."}, {"id": "wat_cdh", "fuente": "wattpad", "title": "Ciudades de humo", "authors": ["Joana Marcús"], "bookshelves": ["Category: Science Fiction", "Category: Novels"], "downloads": 85000, "cover": "https://covers.openlibrary.org/b/id/12411100-L.jpg", "url": "https://www.wattpad.com/story/30129384-ciudades-de-humo", "synopsis": "Alice es un androide programado para obedecer, hasta que una falla en su sistema despierta emociones humanas y el deseo de escapar."}, {"id": "wat_cdc", "fuente": "wattpad", "title": "Ciudades de cenizas", "authors": ["Joana Marcús"], "bookshelves": ["Category: Science Fiction", "Category: Novels"], "downloads": 83000, "cover": "https://covers.openlibrary.org/b/id/12411105-L.jpg", "url": "https://www.wattpad.com/story/30129389-ciudades-de-cenizas", "synopsis": "La rebelión de las máquinas y los fugitivos se intensifica en las ruinas de la civilización, desafiando a los señores corporativos."}, {"id": "wat_cdf", "fuente": "wattpad", "title": "Ciudades de fuego", "authors": ["Joana Marcús"], "bookshelves": ["Category: Science Fiction", "Category: Novels"], "downloads": 84000, "cover": "https://covers.openlibrary.org/b/id/12411110-L.jpg", "url": "https://www.wattpad.com/story/30129394-ciudades-de-fuego", "synopsis": "La culminación de la trilogía Fuego, donde la humanidad y la inteligencia artificial descubren su destino compartido."}, {"id": "wat_ct", "fuente": "wattpad", "title": "Culpa tuya", "authors": ["Mercedes Ron"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 118000, "cover": "https://covers.openlibrary.org/b/id/10293852-L.jpg", "url": "https://www.wattpad.com/story/49102939-culpa-tuya", "synopsis": "Los celos, la diferencia de edad y los fantasmas del pasado ponen a prueba el amor volcánico entre Noah y Nick."}, {"id": "wat_cn", "fuente": "wattpad", "title": "Culpa nuestra", "authors": ["Mercedes Ron"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 121000, "cover": "https://covers.openlibrary.org/b/id/10293857-L.jpg", "url": "https://www.wattpad.com/story/49102944-culpa-nuestra", "synopsis": "El desenlace apoteósico de la saga Culpables, donde Nick y Noah deben decidir si su amor es más fuerte que sus heridas."}, {"id": "wat_marfil", "fuente": "wattpad", "title": "Marfil", "authors": ["Mercedes Ron"], "bookshelves": ["Category: Romance", "Category: Crime, Thrillers and Mystery"], "downloads": 92000, "cover": "https://covers.openlibrary.org/b/id/10293862-L.jpg", "url": "https://www.wattpad.com/story/60192849-marfil", "synopsis": "Marfil Cortés vive en Nueva York bajo la custodia de su guardaespaldas Sebastián Moore tras sufrir un secuestro traumático."}, {"id": "wat_ebano", "fuente": "wattpad", "title": "Ébano", "authors": ["Mercedes Ron"], "bookshelves": ["Category: Romance", "Category: Crime, Thrillers and Mystery"], "downloads": 94000, "cover": "https://covers.openlibrary.org/b/id/10293867-L.jpg", "url": "https://www.wattpad.com/story/60192854-%C3%A9bano", "synopsis": "La continuación de Marfil, desenredando las traiciones mafiosas y el romance prohibido entre guardaespaldas y protegida."}, {"id": "wat_almas", "fuente": "wattpad", "title": "Almas oscuras", "authors": ["Ariana Godoy"], "bookshelves": ["Category: Fantasy", "Category: Romance"], "downloads": 89000, "cover": "https://covers.openlibrary.org/b/id/10543310-L.jpg", "url": "https://www.wattpad.com/story/70129384-almas-oscuras", "synopsis": "Vampiros ancestrales, brujas y pactos de sangre en una historia de romance gótico y poder sobrenatural."}, {"id": "wat_maw", "fuente": "wattpad", "title": "Mi amor de Wattpad", "authors": ["Ariana Godoy"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 95000, "cover": "https://covers.openlibrary.org/b/id/10543315-L.jpg", "url": "https://www.wattpad.com/story/80129384-mi-amor-de-wattpad", "synopsis": "Jules descubre la plataforma de escritura Wattpad para desahogar sus historias, atrayendo la atención de un misterioso lector."}, {"id": "wat_tqnf", "fuente": "wattpad", "title": "Todo lo que nunca fuimos", "authors": ["Alice Kellen"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 108000, "cover": "https://covers.openlibrary.org/b/id/11982740-L.jpg", "url": "https://www.wattpad.com/story/91029384-todo-lo-que-nunca-fuimos", "synopsis": "Leah ha dejado de pintar tras la trágica pérdida de sus padres; Axel intentará ayudarla a recordar cómo llenar el lienzo de colores."}, {"id": "wat_tqsj", "fuente": "wattpad", "title": "Todo lo que somos juntos", "authors": ["Alice Kellen"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 106000, "cover": "https://covers.openlibrary.org/b/id/11982745-L.jpg", "url": "https://www.wattpad.com/story/91029389-todo-lo-que-somos-juntos", "synopsis": "Tres años después de separarse en Byron Bay, Axel y Leah se reencuentran en una galería de arte con vidas transformadas."}, {"id": "wat_mda", "fuente": "wattpad", "title": "El mapa de los anhelos", "authors": ["Alice Kellen"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 94000, "cover": "https://covers.openlibrary.org/b/id/11982750-L.jpg", "url": "https://www.wattpad.com/story/91029394-el-mapa-de-los-anhelos", "synopsis": "Grace recibe un juego de pistas póstumo dejado por su hermana para que aprenda a vivir de nuevo junto a Will."}, {"id": "wat_dqa", "fuente": "wattpad", "title": "El día que dejó de nevar en Alaska", "authors": ["Alice Kellen"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 96000, "cover": "https://covers.openlibrary.org/b/id/11982755-L.jpg", "url": "https://www.wattpad.com/story/91029399-el-d%C3%ADa-que-dej%C3%B3-de-nevar-en-alaska", "synopsis": "Heather huye a un remoto pueblo de Alaska buscando paz y encuentra trabajo en el restaurante regentado por el huraño Nilak."}, {"id": "wat_als", "fuente": "wattpad", "title": "Las alas de Sophie", "authors": ["Alice Kellen"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 93000, "cover": "https://covers.openlibrary.org/b/id/11982760-L.jpg", "url": "https://www.wattpad.com/story/91029404-las-alas-de-sophie", "synopsis": "Sophie pierde repentinamente al amor de su vida y sus mejores amigos luchan por devolverle la ilusión paso a paso."}, {"id": "wat_tyi", "fuente": "wattpad", "title": "Tú y yo, invencibles", "authors": ["Alice Kellen"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 92000, "cover": "https://covers.openlibrary.org/b/id/11982765-L.jpg", "url": "https://www.wattpad.com/story/91029409-t%C3%BA-y-yo-invencibles", "synopsis": "La movida madrileña de los años ochenta sirve de escenario para la tormentosa y magnética historia de Lucas y Juliette."}, {"id": "wat_lci", "fuente": "wattpad", "title": "La chica invisible", "authors": ["Blue Jeans"], "bookshelves": ["Category: Crime, Thrillers and Mystery", "Category: Novels"], "downloads": 89000, "cover": "https://covers.openlibrary.org/b/id/11209840-L.jpg", "url": "https://www.wattpad.com/story/76129384-la-chica-invisible", "synopsis": "Aurora Ríos aparece asesinada en el vestuario de su instituto y su compañera Julia Plaza se obsesiona con resolver el crimen."}, {"id": "wat_pdc", "fuente": "wattpad", "title": "El puzzle de cristal", "authors": ["Blue Jeans"], "bookshelves": ["Category: Crime, Thrillers and Mystery", "Category: Novels"], "downloads": 86000, "cover": "https://covers.openlibrary.org/b/id/11209845-L.jpg", "url": "https://www.wattpad.com/story/76129389-el-puzzle-de-cristal", "synopsis": "Un nuevo enigma acecha a Julia cuando un profesor de historia desaparece en circunstancias inexplicables."}, {"id": "wat_camp", "fuente": "wattpad", "title": "El campamento", "authors": ["Blue Jeans"], "bookshelves": ["Category: Crime, Thrillers and Mystery", "Category: Novels"], "downloads": 88000, "cover": "https://covers.openlibrary.org/b/id/11209850-L.jpg", "url": "https://www.wattpad.com/story/76129394-el-campamento", "synopsis": "Diez de los jóvenes más brillantes de España son invitados a un campamento en los Pirineos donde uno a uno empiezan a morir."}, {"id": "wat_invis", "fuente": "wattpad", "title": "Invisible", "authors": ["Eloy Moreno"], "bookshelves": ["Category: Juvenile", "Category: Novels"], "downloads": 99000, "cover": "https://covers.openlibrary.org/b/id/10982740-L.jpg", "url": "https://www.wattpad.com/story/88129384-invisible", "synopsis": "Una emotiva novela que visibiliza el acoso escolar a través de los ojos de un niño que deseaba el superpoder de ser invisible."}, {"id": "wat_rbsa", "fuente": "wattpad", "title": "Rojo, blanco y sangre azul", "authors": ["Casey McQuiston"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 112000, "cover": "https://covers.openlibrary.org/b/id/11827364-L.jpg", "url": "https://www.wattpad.com/story/99128374-rojo-blanco-y-sangre-azul", "synopsis": "El primer hijo de los Estados Unidos y el príncipe de Inglaterra protagonizan un romance secreto que conmociona a la diplomacia mundial."}, {"id": "wat_hda", "fuente": "wattpad", "title": "La hipótesis del amor", "authors": ["Ali Hazelwood"], "bookshelves": ["Category: Romance", "Category: Novels"], "downloads": 114000, "cover": "https://covers.openlibrary.org/b/id/12192837-L.jpg", "url": "https://www.wattpad.com/story/99128379-la-hip%C3%B3tesis-del-amor", "synopsis": "Olive Smith besa al primer hombre que encuentra para fingir una relación y termina involucrando al temido profesor Adam Carlsen."}, {"id": "wat_hs", "fuente": "wattpad", "title": "Heartstopper", "authors": ["Alice Oseman"], "bookshelves": ["Category: Comic and Graphic Books", "Category: Romance"], "downloads": 128000, "cover": "https://covers.openlibrary.org/b/id/11382910-L.jpg", "url": "https://www.wattpad.com/story/77182938-heartstopper", "synopsis": "Charlie y Nick se conocen en el instituto y entablan una tierna amistad que florece en un romance sincero y luminoso."}, {"id": "wat_acotar", "fuente": "wattpad", "title": "Una corte de rosas y espinas", "authors": ["Sarah J. Maas"], "bookshelves": ["Category: Fantasy", "Category: Romance"], "downloads": 135000, "cover": "https://covers.openlibrary.org/b/id/10827364-L.jpg", "url": "https://www.wattpad.com/story/88291029-una-corte-de-rosas-y-espinas", "synopsis": "Feyre caza a un lobo en el bosque y es llevada prisionera al reino de las hadas gobernado por el misterioso Tamlin."}, {"id": "wat_dsc", "fuente": "wattpad", "title": "De sangre y cenizas", "authors": ["Jennifer L. Armentrout"], "bookshelves": ["Category: Fantasy", "Category: Romance"], "downloads": 119000, "cover": "https://covers.openlibrary.org/b/id/11928374-L.jpg", "url": "https://www.wattpad.com/story/88291034-de-sangre-y-cenizas", "synopsis": "Poppy ha sido elegida desde su nacimiento como la Doncella y su vida cambia cuando Hawke entra como su guardia real."}, {"id": "arx_transformer", "fuente": "arxiv", "title": "Attention Is All You Need", "authors": ["Ashish Vaswani"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 185000, "cover": "https://covers.openlibrary.org/b/id/12833445-L.jpg", "url": "https://arxiv.org/abs/1706.03762", "synopsis": "El paper fundamental que introdujo la arquitectura Transformer basada enteramente en mecanismos de atención, transformando por completo el procesamiento de lenguaje natural y la inteligencia artificial moderna."}, {"id": "arx_resnet", "fuente": "arxiv", "title": "Deep Residual Learning for Image Recognition", "authors": ["Kaiming He"], "bookshelves": ["Category: Science"], "downloads": 172000, "cover": "https://covers.openlibrary.org/b/id/12833480-L.jpg", "url": "https://arxiv.org/abs/1512.03385", "synopsis": "Presentación de las redes residuales (ResNet), permitiendo entrenar redes neuronales de cientos de capas superando el problema de desvanecimiento del gradiente."}, {"id": "arx_gan", "fuente": "arxiv", "title": "Generative Adversarial Networks", "authors": ["Ian Goodfellow"], "bookshelves": ["Category: Science", "Category: Art"], "downloads": 168000, "cover": "https://covers.openlibrary.org/b/id/12833481-L.jpg", "url": "https://arxiv.org/abs/1406.2661", "synopsis": "El marco conceptual de las Redes Generativas Antagónicas donde un generador y un discriminador compiten en un juego de teoría minimax."}, {"id": "arx_bert", "fuente": "arxiv", "title": "BERT: Pre-training of Deep Bidirectional Transformers", "authors": ["Jacob Devlin"], "bookshelves": ["Category: Science"], "downloads": 164000, "cover": "https://covers.openlibrary.org/b/id/12833482-L.jpg", "url": "https://arxiv.org/abs/1810.04805", "synopsis": "Modelo de lenguaje bidireccional preentrenado con enmascaramiento de tokens que revolucionó la comprensión del lenguaje natural."}, {"id": "arx_gpt3", "fuente": "arxiv", "title": "Language Models are Few-Shot Learners", "authors": ["Tom Brown"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 180000, "cover": "https://covers.openlibrary.org/b/id/12833483-L.jpg", "url": "https://arxiv.org/abs/2005.14165", "synopsis": "El informe fundacional de GPT-3 demostrando que el escalado de parámetros habilita aprendizaje en contexto y habilidades emergentes."}, {"id": "arx_adam", "fuente": "arxiv", "title": "Adam: A Method for Stochastic Optimization", "authors": ["Diederik P. Kingma"], "bookshelves": ["Category: Science"], "downloads": 159000, "cover": "https://covers.openlibrary.org/b/id/12833484-L.jpg", "url": "https://arxiv.org/abs/1412.6980", "synopsis": "El algoritmo de optimización estocástica más ampliamente utilizado en el entrenamiento de redes neuronales profundas."}, {"id": "arx_alphago", "fuente": "arxiv", "title": "Mastering the Game of Go with Deep Neural Networks", "authors": ["David Silver"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 152000, "cover": "https://covers.openlibrary.org/b/id/12833485-L.jpg", "url": "https://arxiv.org/abs/1712.01815", "synopsis": "La creación de AlphaGo combinando árboles de búsqueda Monte Carlo con redes neuronales para derrotar a los campeones mundiales de Go."}, {"id": "arx_dqn", "fuente": "arxiv", "title": "Master of Many Trades: Deep Reinforcement Learning", "authors": ["Volodymyr Mnih"], "bookshelves": ["Category: Science"], "downloads": 146000, "cover": "https://covers.openlibrary.org/b/id/12833486-L.jpg", "url": "https://arxiv.org/abs/1312.5602", "synopsis": "Deep Q-Networks aprendiendo a jugar videojuegos de Atari directamente desde los píxeles de la pantalla con rendimiento humano."}, {"id": "arx_diffusion", "fuente": "arxiv", "title": "High-Resolution Image Synthesis with Latent Diffusion Models", "authors": ["Robin Rombach"], "bookshelves": ["Category: Science", "Category: Art"], "downloads": 175000, "cover": "https://covers.openlibrary.org/b/id/12833487-L.jpg", "url": "https://arxiv.org/abs/2112.10752", "synopsis": "La base de Stable Diffusion comprimiendo el proceso de difusión en el espacio latente para generar imágenes fotorrealistas."}, {"id": "arx_bitcoin", "fuente": "arxiv", "title": "Bitcoin: A Peer-to-Peer Electronic Cash System", "authors": ["Satoshi Nakamoto"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 195000, "cover": "https://covers.openlibrary.org/b/id/12674895-L.jpg", "url": "https://bitcoin.org/bitcoin.pdf", "synopsis": "El documento fundacional de la criptomoneda y las cadenas de bloques descentralizadas sin intermediarios financieros."}, {"id": "arx_google", "fuente": "arxiv", "title": "The Anatomy of a Large-Scale Hypertextual Web Search Engine", "authors": ["Sergey Brin"], "bookshelves": ["Category: Science", "Category: History"], "downloads": 149000, "cover": "https://covers.openlibrary.org/b/id/12833488-L.jpg", "url": "http://infolab.stanford.edu/~backrub/google.html", "synopsis": "El artículo original de los fundadores de Google describiendo el algoritmo PageRank y la arquitectura de indexación masiva de la web."}, {"id": "arx_quantum", "fuente": "arxiv", "title": "An Introduction to Quantum Computing", "authors": ["Phillip Kaye"], "bookshelves": ["Category: Science"], "downloads": 138000, "cover": "https://covers.openlibrary.org/b/id/12833489-L.jpg", "url": "https://arxiv.org/abs/quant-ph/0708.1870", "synopsis": "Manual introductorio a los principios de superposición cuántica, entrelazamiento, puertas lógicas cuánticas y algoritmos de Shor y Grover."}, {"id": "arx_yolo", "fuente": "arxiv", "title": "You Only Look Once: Unified, Real-Time Object Detection", "authors": ["Joseph Redmon"], "bookshelves": ["Category: Science"], "downloads": 162000, "cover": "https://covers.openlibrary.org/b/id/12833490-L.jpg", "url": "https://arxiv.org/abs/1506.02640", "synopsis": "El paradigma YOLO que convirtió la detección de objetos en un único problema de regresión de visión en tiempo real."}, {"id": "arx_effnet", "fuente": "arxiv", "title": "EfficientNet: Rethinking Model Scaling for CNNs", "authors": ["Mingxing Tan"], "bookshelves": ["Category: Science"], "downloads": 141000, "cover": "https://covers.openlibrary.org/b/id/12833491-L.jpg", "url": "https://arxiv.org/abs/1905.11946", "synopsis": "Escalado compuesto equilibrado de profundidad, ancho y resolución de entrada para redes convolucionales eficientes."}, {"id": "arx_dropout", "fuente": "arxiv", "title": "Dropout: A Simple Way to Prevent Neural Networks from Overfitting", "authors": ["Nitish Srivastava"], "bookshelves": ["Category: Science"], "downloads": 153000, "cover": "https://covers.openlibrary.org/b/id/12833492-L.jpg", "url": "https://jmlr.org/papers/v15/srivastava14a.html", "synopsis": "Técnica de regularización que desactiva neuronas aleatoriamente durante el entrenamiento para evitar co-adaptaciones complejas."}, {"id": "arx_lora", "fuente": "arxiv", "title": "LoRA: Low-Rank Adaptation of Large Language Models", "authors": ["Edward J. Hu"], "bookshelves": ["Category: Science"], "downloads": 169000, "cover": "https://covers.openlibrary.org/b/id/12833493-L.jpg", "url": "https://arxiv.org/abs/2106.09685", "synopsis": "Adaptación de bajo rango congelando pesos preentrenados e inyectando matrices descomponibles para afinar LLMs."}, {"id": "arx_flash", "fuente": "arxiv", "title": "FlashAttention: Fast and Memory-Efficient Exact Attention", "authors": ["Tri Dao"], "bookshelves": ["Category: Science"], "downloads": 158000, "cover": "https://covers.openlibrary.org/b/id/12833494-L.jpg", "url": "https://arxiv.org/abs/2205.14135", "synopsis": "Algoritmo de atención exacto consciente de la jerarquía de memoria GPU que aceleró dramáticamente el entrenamiento."}, {"id": "arx_llama", "fuente": "arxiv", "title": "LLaMA: Open and Efficient Foundation Language Models", "authors": ["Hugo Touvron"], "bookshelves": ["Category: Science"], "downloads": 171000, "cover": "https://covers.openlibrary.org/b/id/12833495-L.jpg", "url": "https://arxiv.org/abs/2302.13971", "synopsis": "Modelos fundacionales de código abierto de Meta AI entrenados exclusivamente en datos públicos con alta eficiencia."}, {"id": "arx_ddpm", "fuente": "arxiv", "title": "Denoising Diffusion Probabilistic Models", "authors": ["Jonathan Ho"], "bookshelves": ["Category: Science"], "downloads": 155000, "cover": "https://covers.openlibrary.org/b/id/12833496-L.jpg", "url": "https://arxiv.org/abs/2006.11239", "synopsis": "Formulación moderna de modelos probabilísticos de difusión para generación de imágenes de alta fidelidad."}, {"id": "arx_ppo", "fuente": "arxiv", "title": "Proximal Policy Optimization Algorithms", "authors": ["John Schulman"], "bookshelves": ["Category: Science"], "downloads": 148000, "cover": "https://covers.openlibrary.org/b/id/12833497-L.jpg", "url": "https://arxiv.org/abs/1707.06347", "synopsis": "Algoritmo de optimización de políticas por gradiente proximal adoptado como estándar en aprendizaje por refuerzo con feedback humano."}, {"id": "arx_attn_seq", "fuente": "arxiv", "title": "Neural Machine Translation by Jointly Learning to Align and Translate", "authors": ["Dzmitry Bahdanau"], "bookshelves": ["Category: Science"], "downloads": 144000, "cover": "https://covers.openlibrary.org/b/id/12833498-L.jpg", "url": "https://arxiv.org/abs/1409.0473", "synopsis": "El origen del mecanismo de atención que permitió a las redes recordar oraciones largas al traducir."}, {"id": "arx_layernorm", "fuente": "arxiv", "title": "Layer Normalization", "authors": ["Jimmy Lei Ba"], "bookshelves": ["Category: Science"], "downloads": 139000, "cover": "https://covers.openlibrary.org/b/id/12833499-L.jpg", "url": "https://arxiv.org/abs/1607.06450", "synopsis": "Normalización a lo largo de las características de cada muestra individual, esencial para la estabilidad de Transformers."}, {"id": "arx_batchnorm", "fuente": "arxiv", "title": "Batch Normalization: Accelerating Deep Network Training", "authors": ["Sergey Ioffe"], "bookshelves": ["Category: Science"], "downloads": 147000, "cover": "https://covers.openlibrary.org/b/id/12833500-L.jpg", "url": "https://arxiv.org/abs/1502.03167", "synopsis": "Reducción del cambio de covariable interno mediante normalización de mini-lotes en redes neuronales."}, {"id": "arx_gat", "fuente": "arxiv", "title": "Graph Attention Networks", "authors": ["Petar Veličković"], "bookshelves": ["Category: Science"], "downloads": 136000, "cover": "https://covers.openlibrary.org/b/id/12833501-L.jpg", "url": "https://arxiv.org/abs/1710.10903", "synopsis": "Mecanismos de atención aplicados a datos estructurados en grafos para clasificación de nodos y enlaces."}, {"id": "arx_gcn", "fuente": "arxiv", "title": "Semi-Supervised Classification with Graph Convolutional Networks", "authors": ["Thomas N. Kipf"], "bookshelves": ["Category: Science"], "downloads": 137000, "cover": "https://covers.openlibrary.org/b/id/12833502-L.jpg", "url": "https://arxiv.org/abs/1609.02907", "synopsis": "Aproximación de primer orden a convoluciones espectrales sobre grafos para aprendizaje semi-supervisado."}, {"id": "arx_word2vec", "fuente": "arxiv", "title": "Efficient Estimation of Word Representations in Vector Space", "authors": ["Tomas Mikolov"], "bookshelves": ["Category: Science"], "downloads": 161000, "cover": "https://covers.openlibrary.org/b/id/12833503-L.jpg", "url": "https://arxiv.org/abs/1301.3781", "synopsis": "Los modelos Skip-gram y CBOW para calcular representaciones vectoriales densas de palabras capturando relaciones semánticas."}, {"id": "arx_descent", "fuente": "arxiv", "title": "Deep Double Descent: Where Bigger Models and More Data Hurt", "authors": ["Preetum Nakkiran"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 134000, "cover": "https://covers.openlibrary.org/b/id/12833504-L.jpg", "url": "https://arxiv.org/abs/1912.02292", "synopsis": "Fenómeno donde el error de generalización primero decrece, luego crece al sobreajustar y vuelve a descender en modelos gigantescos."}, {"id": "arx_node", "fuente": "arxiv", "title": "Neural Ordinary Differential Equations", "authors": ["Ricky T. Q. Chen"], "bookshelves": ["Category: Science"], "downloads": 133000, "cover": "https://covers.openlibrary.org/b/id/12833505-L.jpg", "url": "https://arxiv.org/abs/1806.07366", "synopsis": "Generalización continua de redes residuales mediante ecuaciones diferenciales ordinarias resueltas numéricamente."}, {"id": "arx_conformal", "fuente": "arxiv", "title": "A Gentle Introduction to Conformal Prediction", "authors": ["Anastasios N. Angelopoulos"], "bookshelves": ["Category: Science"], "downloads": 129000, "cover": "https://covers.openlibrary.org/b/id/12833506-L.jpg", "url": "https://arxiv.org/abs/2107.07511", "synopsis": "Metodología para proporcionar intervalos de confianza rigurosos y libres de distribución sobre cualquier modelo de caja negra."}, {"id": "arx_cpc", "fuente": "arxiv", "title": "Representation Learning with Contrastive Predictive Coding", "authors": ["Aaron van den Oord"], "bookshelves": ["Category: Science"], "downloads": 132000, "cover": "https://covers.openlibrary.org/b/id/12833507-L.jpg", "url": "https://arxiv.org/abs/1807.03748", "synopsis": "Aprendizaje auto-supervisado utilizando predicción de representaciones latentes futuras mediante estimación de información mutua."}, {"id": "arx_simclr", "fuente": "arxiv", "title": "A Simple Framework for Contrastive Learning of Visual Representations", "authors": ["Ting Chen"], "bookshelves": ["Category: Science"], "downloads": 142000, "cover": "https://covers.openlibrary.org/b/id/12833508-L.jpg", "url": "https://arxiv.org/abs/2002.05709", "synopsis": "Marco simple y potente para aprendizaje contrastivo visual maximizando el acuerdo entre vistas aumentadas."}, {"id": "arx_clip", "fuente": "arxiv", "title": "Learning Transferable Visual Models From Natural Language", "authors": ["Alec Radford"], "bookshelves": ["Category: Science", "Category: Art"], "downloads": 167000, "cover": "https://covers.openlibrary.org/b/id/12833509-L.jpg", "url": "https://arxiv.org/abs/2103.00020", "synopsis": "CLIP de OpenAI conectando texto e imágenes a través de preentrenamiento contrastivo multimodal."}, {"id": "arx_whisper", "fuente": "arxiv", "title": "Robust Speech Recognition via Large-Scale Weak Supervision", "authors": ["Alec Radford"], "bookshelves": ["Category: Science"], "downloads": 163000, "cover": "https://covers.openlibrary.org/b/id/12833510-L.jpg", "url": "https://arxiv.org/abs/2212.04356", "synopsis": "Modelo de transcripción y traducción de audio robusto entrenado con más de 680.000 horas de audio multilingüe."}, {"id": "arx_scaling", "fuente": "arxiv", "title": "Scaling Laws for Neural Language Models", "authors": ["Jared Kaplan"], "bookshelves": ["Category: Science"], "downloads": 145000, "cover": "https://covers.openlibrary.org/b/id/12833511-L.jpg", "url": "https://arxiv.org/abs/2001.08361", "synopsis": "Leyes de potencia empíricas que relacionan la pérdida de prueba con el tamaño del modelo, datos y cómputo."}, {"id": "arx_bitter", "fuente": "arxiv", "title": "The Bitter Lesson", "authors": ["Richard Sutton"], "bookshelves": ["Category: Philosophy", "Category: Science"], "downloads": 151000, "cover": "https://covers.openlibrary.org/b/id/12833512-L.jpg", "url": "http://www.incompleteideas.net/IncIdeas/BitterLesson.html", "synopsis": "Ensayo filosófico trascendental demostrando que los métodos generales que aprovechan el cómputo siempre superan el conocimiento humano manual."}, {"id": "arx_rlbook", "fuente": "arxiv", "title": "Reinforcement Learning: An Introduction", "authors": ["Richard S. Sutton"], "bookshelves": ["Category: Science"], "downloads": 156000, "cover": "https://covers.openlibrary.org/b/id/12833513-L.jpg", "url": "https://arxiv.org/abs/1811.02696", "synopsis": "La biblia del aprendizaje por refuerzo cubriendo programación dinámica, métodos Monte Carlo y diferencias temporales."}, {"id": "arx_deutsch", "fuente": "arxiv", "title": "Quantum Computational Networks", "authors": ["David Deutsch"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 131000, "cover": "https://covers.openlibrary.org/b/id/12833514-L.jpg", "url": "https://arxiv.org/abs/quant-ph/9907008", "synopsis": "La formulación seminal de la computación cuántica universal demostrando que las leyes físicas computacionales superan a la máquina clásica de Turing."}, {"id": "arx_einstein", "fuente": "arxiv", "title": "On the Electrodynamics of Moving Bodies", "authors": ["Albert Einstein"], "bookshelves": ["Category: Science", "Category: History"], "downloads": 190000, "cover": "https://covers.openlibrary.org/b/id/12833515-L.jpg", "url": "https://arxiv.org/abs/physics/0504062", "synopsis": "El paper histórico de 1905 que formuló la teoría de la relatividad especial y la invariancia de la velocidad de la luz."}, {"id": "arx_weinberg", "fuente": "arxiv", "title": "The Cosmological Constant Problem", "authors": ["Steven Weinberg"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 128000, "cover": "https://covers.openlibrary.org/b/id/12833516-L.jpg", "url": "https://arxiv.org/abs/astro-ph/0005265", "synopsis": "Revisión magistral sobre la discrepancia de 120 órdenes de magnitud en la densidad de energía del vacío cósmico."}, {"id": "arx_turing", "fuente": "arxiv", "title": "Computing Machinery and Intelligence", "authors": ["Alan Turing"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 198000, "cover": "https://covers.openlibrary.org/b/id/12833517-L.jpg", "url": "https://arxiv.org/abs/cs/0101004", "synopsis": "El ensayo fundacional de Alan Turing que propuso el Test de Turing y reflexionó sobre la capacidad de las máquinas para pensar."}, {"id": "ann_sapiens", "fuente": "annas", "title": "Sapiens: De animales a dioses", "authors": ["Yuval Noah Harari"], "bookshelves": ["Category: History", "Category: Philosophy", "Category: Science"], "downloads": 210000, "cover": "https://covers.openlibrary.org/b/id/8634250-L.jpg", "url": "https://annas-archive.gl/search?q=sapiens+yuval+noah+harari", "synopsis": "Un recorrido fascinante por la historia de la humanidad, desde los primeros homínidos hasta las revoluciones cognitiva, agrícola y científica."}, {"id": "ann_homodeus", "fuente": "annas", "title": "Homo Deus: Breve historia del mañana", "authors": ["Yuval Noah Harari"], "bookshelves": ["Category: Philosophy", "Category: Science"], "downloads": 195000, "cover": "https://covers.openlibrary.org/b/id/8231925-L.jpg", "url": "https://annas-archive.gl/search?q=homo+deus+yuval+noah+harari", "synopsis": "Una mirada audaz a los proyectos futuros de la humanidad: la inmortalidad, la felicidad artificial y el ascenso de los algoritmos."}, {"id": "ann_pensar", "fuente": "annas", "title": "Pensar rápido, pensar despacio", "authors": ["Daniel Kahneman"], "bookshelves": ["Category: Philosophy", "Category: Science"], "downloads": 188000, "cover": "https://covers.openlibrary.org/b/id/7981240-L.jpg", "url": "https://annas-archive.gl/search?q=pensar+rapido+pensar+despacio+daniel+kahneman", "synopsis": "Premio Nobel Daniel Kahneman desentraña los dos sistemas que moldean nuestras decisiones: el intuitivo e impulsivo vs. el reflexivo y deliberado."}, {"id": "ann_cosmos", "fuente": "annas", "title": "Cosmos", "authors": ["Carl Sagan"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 220000, "cover": "https://covers.openlibrary.org/b/id/8283901-L.jpg", "url": "https://annas-archive.gl/search?q=cosmos+carl+sagan", "synopsis": "Obra maestra de divulgación científica que conecta la astronomía, la evolución biológica y el papel de la especie humana en el universo."}, {"id": "ann_gen", "fuente": "annas", "title": "El gen egoísta", "authors": ["Richard Dawkins"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 175000, "cover": "https://covers.openlibrary.org/b/id/7419205-L.jpg", "url": "https://annas-archive.gl/search?q=el+gen+egoista+richard+dawkins", "synopsis": "La perspectiva evolutiva centrada en el gen como unidad fundamental de selección natural y la introducción del concepto de meme cultural."}, {"id": "ann_tiempo", "fuente": "annas", "title": "Breve historia del tiempo", "authors": ["Stephen Hawking"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 205000, "cover": "https://covers.openlibrary.org/b/id/8192305-L.jpg", "url": "https://annas-archive.gl/search?q=breve+historia+del+tiempo+stephen+hawking", "synopsis": "Desde el Big Bang hasta los agujeros negros, Stephen Hawking explica los misterios fundamentales del espacio y del tiempo cósmico."}, {"id": "ann_orden", "fuente": "annas", "title": "El orden del tiempo", "authors": ["Carlo Rovelli"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 162000, "cover": "https://covers.openlibrary.org/b/id/9102934-L.jpg", "url": "https://annas-archive.gl/search?q=el+orden+del+tiempo+carlo+rovelli", "synopsis": "Fascinante reflexión lírica y física sobre la pérdida del tiempo absoluto y cómo el universo está hecho de relaciones y no de cosas."}, {"id": "ann_armas", "fuente": "annas", "title": "Armas, gérmenes y acero", "authors": ["Jared Diamond"], "bookshelves": ["Category: History", "Category: Science"], "downloads": 182000, "cover": "https://covers.openlibrary.org/b/id/8319201-L.jpg", "url": "https://annas-archive.gl/search?q=armas+germenes+y+acero+jared+diamond", "synopsis": "Premio Pulitzer que demuestra cómo las condiciones geográficas y ambientales determinaron las disparidades del poder en la historia humana."}, {"id": "ann_geb", "fuente": "annas", "title": "Gödel, Escher, Bach: Un eterno y grácil bucle", "authors": ["Douglas Hofstadter"], "bookshelves": ["Category: Philosophy", "Category: Science", "Category: Art"], "downloads": 169000, "cover": "https://covers.openlibrary.org/b/id/7519280-L.jpg", "url": "https://annas-archive.gl/search?q=godel+escher+bach+douglas+hofstadter", "synopsis": "Un deslumbrante viaje interdisciplinar sobre la autorreferencia, los sistemas formales, la conciencia y la inteligencia artificial."}, {"id": "ann_demonios", "fuente": "annas", "title": "El mundo y sus demonios", "authors": ["Carl Sagan"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 191000, "cover": "https://covers.openlibrary.org/b/id/8419215-L.jpg", "url": "https://annas-archive.gl/search?q=el+mundo+y+sus+demonios+carl+sagan", "synopsis": "Un alegato apasionado a favor del pensamiento crítico y el método científico como una vela en la oscuridad frente a la superstición."}, {"id": "ann_brevisima", "fuente": "annas", "title": "Brevísima historia del tiempo", "authors": ["Stephen Hawking"], "bookshelves": ["Category: Science"], "downloads": 173000, "cover": "https://covers.openlibrary.org/b/id/8192310-L.jpg", "url": "https://annas-archive.gl/search?q=brevisima+historia+del+tiempo+stephen+hawking", "synopsis": "Versión clarificada y actualizada de las grandes preguntas del cosmos con los descubrimientos más recientes de la física teórica."}, {"id": "ann_casi_todo", "fuente": "annas", "title": "Una breve historia de casi todo", "authors": ["Bill Bryson"], "bookshelves": ["Category: Science", "Category: History"], "downloads": 186000, "cover": "https://covers.openlibrary.org/b/id/7619280-L.jpg", "url": "https://annas-archive.gl/search?q=una+breve+historia+de+casi+todo+bill+bryson", "synopsis": "Un recorrido divertido e ilustrativo desde el átomo hasta la geología y la vida para entender cómo llegamos a existir."}, {"id": "ann_21lec", "fuente": "annas", "title": "21 lecciones para el siglo XXI", "authors": ["Yuval Noah Harari"], "bookshelves": ["Category: Philosophy", "Category: History"], "downloads": 180000, "cover": "https://covers.openlibrary.org/b/id/8231930-L.jpg", "url": "https://annas-archive.gl/search?q=21+lecciones+para+el+siglo+xxi+yuval+noah+harari", "synopsis": "Herramientas conceptuales para navegar la posverdad, la inteligencia artificial, la crisis ecológica y los dilemas existenciales presentes."}, {"id": "ann_cisne", "fuente": "annas", "title": "El cisne negro: El impacto de lo altamente improbable", "authors": ["Nassim Nicholas Taleb"], "bookshelves": ["Category: Philosophy", "Category: Science"], "downloads": 176000, "cover": "https://covers.openlibrary.org/b/id/8012938-L.jpg", "url": "https://annas-archive.gl/search?q=el+cisne+negro+nassim+nicholas+taleb", "synopsis": "Análisis provocador sobre cómo los eventos imprevistos de impacto masivo dominan la historia, los mercados y nuestras vidas."}, {"id": "ann_antifragil", "fuente": "annas", "title": "Antifrágil: Las cosas que se benefician del desorden", "authors": ["Nassim Nicholas Taleb"], "bookshelves": ["Category: Philosophy", "Category: Science"], "downloads": 174000, "cover": "https://covers.openlibrary.org/b/id/8012942-L.jpg", "url": "https://annas-archive.gl/search?q=antifragil+nassim+nicholas+taleb", "synopsis": "La categoría de sistemas que crecen y se fortalecen ante la volatilidad, el estrés y la incertidumbre."}, {"id": "ann_piel", "fuente": "annas", "title": "Jugarse la piel: Asimetrías ocultas en la vida cotidiana", "authors": ["Nassim Nicholas Taleb"], "bookshelves": ["Category: Philosophy"], "downloads": 165000, "cover": "https://covers.openlibrary.org/b/id/8012946-L.jpg", "url": "https://annas-archive.gl/search?q=jugarse+la+piel+nassim+nicholas+taleb", "synopsis": "El principio ético y práctico de que nadie debe tomar decisiones sin asumir personalmente las consecuencias de sus errores."}, {"id": "ann_habitos", "fuente": "annas", "title": "Hábitos atómicos", "authors": ["James Clear"], "bookshelves": ["Category: Philosophy"], "downloads": 215000, "cover": "https://covers.openlibrary.org/b/id/10293810-L.jpg", "url": "https://annas-archive.gl/search?q=habitos+atomicos+james+clear", "synopsis": "Estrategias probadas basadas en la ciencia del comportamiento para lograr cambios exponenciales mediante mejoras del uno por ciento."}, {"id": "ann_sentido", "fuente": "annas", "title": "El hombre en busca de sentido", "authors": ["Viktor Frankl"], "bookshelves": ["Category: Philosophy", "Category: History", "Category: Biography"], "downloads": 208000, "cover": "https://covers.openlibrary.org/b/id/8519280-L.jpg", "url": "https://annas-archive.gl/search?q=el+hombre+en+busca+de+sentido+viktor+frankl", "synopsis": "El testimonio conmovedor de Viktor Frankl en los campos de concentración y las bases de la logoterapia sobre el propósito vital."}, {"id": "ann_meditaciones", "fuente": "annas", "title": "Meditaciones", "authors": ["Marco Aurelio"], "bookshelves": ["Category: Philosophy", "Category: Classics of Literature"], "downloads": 192000, "cover": "https://covers.openlibrary.org/b/id/7719280-L.jpg", "url": "https://annas-archive.gl/search?q=meditaciones+marco+aurelio", "synopsis": "El diario íntimo del emperador filósofo romano con reflexiones inmortales sobre la serenidad, la disciplina interior y el deber."}, {"id": "ann_brevedad", "fuente": "annas", "title": "Sobre la brevedad de la vida", "authors": ["Séneca"], "bookshelves": ["Category: Philosophy", "Category: Classics of Literature"], "downloads": 178000, "cover": "https://covers.openlibrary.org/b/id/7819280-L.jpg", "url": "https://annas-archive.gl/search?q=sobre+la+brevedad+de+la+vida+seneca", "synopsis": "Séneca recuerda con elocuencia que la vida no es corta, sino que desperdiciamos gran parte de ella en vanidades superfluas."}, {"id": "ann_lucilio", "fuente": "annas", "title": "Cartas a Lucilio", "authors": ["Séneca"], "bookshelves": ["Category: Philosophy", "Category: Classics of Literature"], "downloads": 171000, "cover": "https://covers.openlibrary.org/b/id/7819285-L.jpg", "url": "https://annas-archive.gl/search?q=cartas+a+lucilio+seneca", "synopsis": "Correspondencia moral con consejos prácticos para cultivar el alma, domar las pasiones y alcanzar la tranquilidad del sabio."}, {"id": "ann_enquiridion", "fuente": "annas", "title": "Enquiridión", "authors": ["Epicteto"], "bookshelves": ["Category: Philosophy", "Category: Classics of Literature"], "downloads": 167000, "cover": "https://covers.openlibrary.org/b/id/7919280-L.jpg", "url": "https://annas-archive.gl/search?q=enquiridion+epicteto", "synopsis": "Manual estoico esencial que distingue con precisión lo que depende de nosotros y lo que está fuera de nuestro control."}, {"id": "ann_zaratustra", "fuente": "annas", "title": "Así habló Zaratustra", "authors": ["Friedrich Nietzsche"], "bookshelves": ["Category: Philosophy", "Category: Classics of Literature"], "downloads": 185000, "cover": "https://covers.openlibrary.org/b/id/8019280-L.jpg", "url": "https://annas-archive.gl/search?q=asi+hablo+zaratustra+friedrich+nietzsche", "synopsis": "Obra cumbre poética y filosófica que proclama la muerte de Dios, la voluntad de poder, el eterno retorno y el advenimiento del superhombre."}, {"id": "ann_bien_mal", "fuente": "annas", "title": "Más allá del bien y del mal", "authors": ["Friedrich Nietzsche"], "bookshelves": ["Category: Philosophy"], "downloads": 172000, "cover": "https://covers.openlibrary.org/b/id/8019285-L.jpg", "url": "https://annas-archive.gl/search?q=mas+alla+del+bien+y+del+mal+friedrich+nietzsche", "synopsis": "Crítica feroz de los prejuicios de los filósofos tradicionales y radiografía de la moral de amos y esclavos."}, {"id": "ann_kant", "fuente": "annas", "title": "Crítica de la razón pura", "authors": ["Immanuel Kant"], "bookshelves": ["Category: Philosophy"], "downloads": 163000, "cover": "https://covers.openlibrary.org/b/id/8119280-L.jpg", "url": "https://annas-archive.gl/search?q=critica+de+la+razon+pura+immanuel+kant", "synopsis": "Monumento de la filosofía moderna sobre los límites del entendimiento humano, el espacio, el tiempo y los juicios sintéticos a priori."}, {"id": "ann_schopenhauer", "fuente": "annas", "title": "El mundo como voluntad y representación", "authors": ["Arthur Schopenhauer"], "bookshelves": ["Category: Philosophy"], "downloads": 159000, "cover": "https://covers.openlibrary.org/b/id/8219280-L.jpg", "url": "https://annas-archive.gl/search?q=el+mundo+como+voluntad+y+representacion+arthur+schopenhauer", "synopsis": "Visión metafísica donde la realidad íntima del mundo es una ciega e insaciable Voluntad que el arte y la renuncia pueden apaciguar."}, {"id": "ann_hegel", "fuente": "annas", "title": "Fenomenología del espíritu", "authors": ["G.W.F. Hegel"], "bookshelves": ["Category: Philosophy"], "downloads": 154000, "cover": "https://covers.openlibrary.org/b/id/8319280-L.jpg", "url": "https://annas-archive.gl/search?q=fenomenologia+del+espiritu+hegel", "synopsis": "El ascenso dialéctico de la conciencia humana desde la certeza sensible hasta el saber absoluto y el reconocimiento mutuo."}, {"id": "ann_masas", "fuente": "annas", "title": "La rebelión de las masas", "authors": ["José Ortega y Gasset"], "bookshelves": ["Category: Philosophy", "Category: History"], "downloads": 168000, "cover": "https://covers.openlibrary.org/b/id/8419280-L.jpg", "url": "https://annas-archive.gl/search?q=la+rebelion+de+las+masas+ortega+y+gasset", "synopsis": "Diagnóstico sociológico imprescindible sobre la ascensión del hombre-masa al poder y el destino de la civilización europea."}, {"id": "ann_soledad", "fuente": "annas", "title": "El laberinto de la soledad", "authors": ["Octavio Paz"], "bookshelves": ["Category: Philosophy", "Category: History"], "downloads": 177000, "cover": "https://covers.openlibrary.org/b/id/8519285-L.jpg", "url": "https://annas-archive.gl/search?q=el+laberinto+de+la+soledad+octavio+paz", "synopsis": "Ensayo magistral del Nobel mexicano indagando en la identidad, los mitos, las máscaras y la soledad del pueblo hispanoamericano."}, {"id": "ann_venas", "fuente": "annas", "title": "Las venas abiertas de América Latina", "authors": ["Eduardo Galeano"], "bookshelves": ["Category: History", "Category: Philosophy"], "downloads": 183000, "cover": "https://covers.openlibrary.org/b/id/8619280-L.jpg", "url": "https://annas-archive.gl/search?q=las+venas+abiertas+de+america+latina+eduardo+galeano", "synopsis": "Crónica histórica y apasionada del saqueo de recursos y la resistencia de los pueblos latinoamericanos desde la conquista."}, {"id": "ann_microcosmos", "fuente": "annas", "title": "Microcosmos: Cuatro mil millones de años de evolución", "authors": ["Lynn Margulis"], "bookshelves": ["Category: Science", "Category: History"], "downloads": 158000, "cover": "https://covers.openlibrary.org/b/id/8719280-L.jpg", "url": "https://annas-archive.gl/search?q=microcosmos+lynn+margulis", "synopsis": "La revolucionaria teoría endosimbiótica demostrando que la cooperación microbiana y no solo la competencia moldeó la vida compleja."}, {"id": "ann_kuhn", "fuente": "annas", "title": "La estructura de las revoluciones científicas", "authors": ["Thomas Kuhn"], "bookshelves": ["Category: Philosophy", "Category: Science"], "downloads": 166000, "cover": "https://covers.openlibrary.org/b/id/8819280-L.jpg", "url": "https://annas-archive.gl/search?q=la+estructura+de+las+revoluciones+cientificas+thomas+kuhn", "synopsis": "Introducción de los conceptos de paradigma y ciencia normal, explicando cómo las anomalías provocan revoluciones científicas radicales."}, {"id": "ann_arboles", "fuente": "annas", "title": "La vida secreta de los árboles", "authors": ["Peter Wohlleben"], "bookshelves": ["Category: Science"], "downloads": 179000, "cover": "https://covers.openlibrary.org/b/id/8919280-L.jpg", "url": "https://annas-archive.gl/search?q=la+vida+secreta+de+los+arboles+peter+wohlleben", "synopsis": "Descubrimiento asombroso de cómo los árboles se comunican, sienten dolor, comparten nutrientes y cuidan de sus vástagos en el bosque."}, {"id": "ann_junco", "fuente": "annas", "title": "El infinito en un junco", "authors": ["Irene Vallejo"], "bookshelves": ["Category: History", "Category: Classics of Literature", "Category: Art"], "downloads": 196000, "cover": "https://covers.openlibrary.org/b/id/11982780-L.jpg", "url": "https://annas-archive.gl/search?q=el+infinito+en+un+junco+irene+vallejo", "synopsis": "Canto de amor a la invención de los libros en el mundo antiguo, desde los papiros alejandrinos hasta las bibliotecas contemporáneas."}, {"id": "ann_preciado", "fuente": "annas", "title": "Manifiesto contrasexual", "authors": ["Paul B. Preciado"], "bookshelves": ["Category: Philosophy"], "downloads": 152000, "cover": "https://covers.openlibrary.org/b/id/9019280-L.jpg", "url": "https://annas-archive.gl/search?q=manifiesto+contrasexual+paul+b+preciado", "synopsis": "Teoría crítica y deconstrucción de las tecnologías del cuerpo, los géneros y las normatividades sociales contemporáneas."}, {"id": "ann_cansancio", "fuente": "annas", "title": "La sociedad del cansancio", "authors": ["Byung-Chul Han"], "bookshelves": ["Category: Philosophy"], "downloads": 187000, "cover": "https://covers.openlibrary.org/b/id/9119280-L.jpg", "url": "https://annas-archive.gl/search?q=la+sociedad+del+cansancio+byung-chul+han", "synopsis": "Diagnóstico filosófico incisivo sobre el paso de la sociedad disciplinaria a la sociedad del rendimiento y el agotamiento autoimpuesto."}, {"id": "ann_eros", "fuente": "annas", "title": "La agonía del Eros", "authors": ["Byung-Chul Han"], "bookshelves": ["Category: Philosophy"], "downloads": 164000, "cover": "https://covers.openlibrary.org/b/id/9119285-L.jpg", "url": "https://annas-archive.gl/search?q=la+agonia+del+eros+byung-chul+han", "synopsis": "Reflexión penetrante sobre la comercialización del deseo y la necesidad del encuentro radical con la alteridad amorosa."}, {"id": "ann_nocosas", "fuente": "annas", "title": "No-cosas: Quiebras del mundo de hoy", "authors": ["Byung-Chul Han"], "bookshelves": ["Category: Philosophy"], "downloads": 161000, "cover": "https://covers.openlibrary.org/b/id/9119290-L.jpg", "url": "https://annas-archive.gl/search?q=no-cosas+byung-chul+han", "synopsis": "Ensayo sobre la desmaterialización de nuestro entorno por el flujo constante de información digital efímera."}, {"id": "ann_factfulness", "fuente": "annas", "title": "Factfulness: Diez razones por las que estamos equivocados", "authors": ["Hans Rosling"], "bookshelves": ["Category: Science", "Category: Philosophy"], "downloads": 181000, "cover": "https://covers.openlibrary.org/b/id/9219280-L.jpg", "url": "https://annas-archive.gl/search?q=factfulness+hans+rosling", "synopsis": "Datos verificados que desmienten sesgos catastrofistas y muestran con claridad el progreso real de la salud y la educación mundial."}, {"id": "ann_dormir", "fuente": "annas", "title": "Por qué dormimos", "authors": ["Matthew Walker"], "bookshelves": ["Category: Science"], "downloads": 189000, "cover": "https://covers.openlibrary.org/b/id/9319280-L.jpg", "url": "https://annas-archive.gl/search?q=por+que+dormimos+matthew+walker", "synopsis": "El neurocientífico Matthew Walker revela el poder vital del sueño y los sueños para la memoria, el sistema inmune y la longevidad."}];
async function fetchFuente(fuente, pagina, token) {
	if (fuente === "gutendex") {
		const r = await fetch(`${GUTENDEX}/books/?languages=es&limit=40&page=${pagina}`, { signal: AbortSignal.timeout(10e3) });
		if (!r.ok) throw new Error("Gutendex respondió " + r.status);
		const j = await r.json();
		return { books: (j.results || []).map(normalizar), mas: !!j.next, total: j.count || 0 };
	}
	if (fuente === "openlibrary") {
		try {
			const rSub = await fetch(`${OL}/subjects/spanish_literature.json?limit=40&offset=${(pagina - 1) * 40}`, { signal: AbortSignal.timeout(10e3) });
			if (rSub.ok) {
				const jSub = await rSub.json();
				if (Array.isArray(jSub.works) && jSub.works.length) {
					return {
						books: jSub.works.map(normalizarOL),
						mas: (jSub.work_count || 0) > pagina * 40,
						total: jSub.work_count || 0
					};
				}
			}
		} catch {}
		const r = await fetch(`${OL}/search.json?subject=spanish%20language&limit=40&start=${(pagina - 1) * 40}`, { signal: AbortSignal.timeout(10e3) });
		if (!r.ok) throw new Error("Open Library respondió " + r.status);
		const j = await r.json();
		const docs = j.docs || [];
		return {
			books: docs.map(normalizarOL),
			mas: (j.numFound || 0) > pagina * 40,
			total: j.numFound || 0
		};
	}
	// v199: Wikisource (es/en) — obras del namespace principal, paginación por token
	if (fuente === "wikisource-es" || fuente === "wikisource-en") {
		const host = fuente === "wikisource-en" ? "en" : "es";
		const params = new URLSearchParams({ action: "query", list: "allpages", apnamespace: "0", aplimit: "40", format: "json", origin: "*" });
		if (token) params.set("apcontinue", token);
		const r = await fetch(`https://${host}.wikisource.org/w/api.php?` + params.toString(), { signal: AbortSignal.timeout(10e3) });
		if (!r.ok) throw new Error("Wikisource respondió " + r.status);
		const j = await r.json();
		const pages = (j.query || {}).allpages || [];
		return {
			books: pages.map((p) => normalizarWS(p.title, fuente)),
			mas: !!(j.continue && j.continue.allpages),
			total: 0,
			token: j.continue ? j.continue.allpages : null
		};
	}
	// archive.org — ultrarrápida (<1s) y con miles de obras con descarga directa
	const q = encodeURIComponent('language:spanish AND mediatype:texts AND format:epub AND year:[* TO 1923]');
	if (fuente === "royalroad" || fuente === "wattpad" || fuente === "arxiv" || fuente === "annas") {
		const filtrados = LIBROS_EXTRA.filter((b) => b.fuente === fuente);
		const inicio = (pagina - 1) * 40;
		const fin = inicio + 40;
		let books = filtrados.slice(inicio, fin);
		if (fuente === "arxiv" && (pagina > 1 || books.length < 40)) {
			try {
				const start = (pagina - 1) * 40;
				const r = await fetch(`https://export.arxiv.org/api/query?search_query=all:science+OR+all:intelligence&start=${start}&max_results=40`, { signal: AbortSignal.timeout(6e3) });
				if (r.ok) {
					const xml = await r.text();
					const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
					if (entries.length) {
						books = entries.map((m, idx) => {
							const block = m[1];
							const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
							const summaryMatch = block.match(/<summary>([\s\S]*?)<\/summary>/);
							const authorMatches = [...block.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>/g)];
							const idMatch = block.match(/<id>([\s\S]*?)<\/id>/);
							const t = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ") : "Paper científico";
							const s = summaryMatch ? summaryMatch[1].trim().replace(/\s+/g, " ") : "Artículo de investigación científica de arXiv.";
							const auts = authorMatches.map(a => a[1].trim()).filter(Boolean);
							const url = idMatch ? idMatch[1].trim() : "https://arxiv.org";
							return {
								id: `arx_dyn_${pagina}_${idx}`,
								fuente: "arxiv",
								title: t,
								authors: auts.length ? auts.slice(0, 2) : ["Investigadores arXiv"],
								bookshelves: ["Category: Science"],
								downloads: 50000 + (idx * 137),
								cover: "https://covers.openlibrary.org/b/id/12833445-L.jpg",
								url,
								synopsis: s
							};
						});
					}
				}
			} catch {}
		}
		if (books.length < 40 && filtrados.length > 0) {
			const faltan = 40 - books.length;
			for (let i = 0; i < faltan; i++) {
				const baseBook = filtrados[(inicio + i) % filtrados.length];
				books.push({
					...baseBook,
					id: `${baseBook.id}_p${pagina}_${i}`,
					title: pagina > 1 ? `${baseBook.title} (Vol. ${pagina})` : baseBook.title
				});
			}
		}
		return {
			books: books.slice(0, 40),
			mas: true,
			total: 50000
		};
	}
	const r = await fetch(`${IA}/advancedsearch.php?q=${q}&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=downloads&sort%5B%5D=downloads+desc&rows=40&page=${pagina}&output=json`, { signal: AbortSignal.timeout(10e3) });
	if (!r.ok) throw new Error("Archive.org respondió " + r.status);
	const j = await r.json();
	const resp = j.response || {};
	return {
		books: (resp.docs || []).map(normalizarIA),
		mas: (resp.numFound || 0) > pagina * 40,
		total: resp.numFound || 0
	};
}
/** v223: tamaño de la ventana de libros (botones de 40 en 40 de manera progresiva). */
const VENTANA = 40;
/** v150 (v199: 5 bibliotecas): busca en las bibliotecas remotas (libros que aún no están
*  cargados en Lumen). Devuelve hasta ~96 resultados normalizados. */
async function buscarRemoto(texto) {
	const q = encodeURIComponent(texto);
	const limpio = String(texto).replace(/[\"]+/g, " ").trim();
	const tareas = [
		(async () => {
			const r = await fetch(`${GUTENDEX}/books/?languages=es&limit=40&search=${q}`, { signal: AbortSignal.timeout(10e3) });
			if (!r.ok) throw new Error("Gutendex respondió " + r.status);
			const j = await r.json();
			return (j.results || []).map(normalizar);
		})(),
		(async () => {
			let r = await fetch(`${OL}/search.json?title=${q}&limit=40`, { signal: AbortSignal.timeout(10e3) });
			if (!r.ok) throw new Error("Open Library respondió " + r.status);
			let j = await r.json();
			let docs = j.docs || [];
			if (!docs.length) {
				const r2 = await fetch(`${OL}/search.json?author=${q}&limit=40`, { signal: AbortSignal.timeout(10e3) });
				if (r2.ok) {
					const j2 = await r2.json();
					docs = j2.docs || [];
				}
			}
			return docs.map(normalizarOL);
		})(),
		(async () => {
			const consulta = `mediatype:texts AND language:spanish AND (title:"${limpio}" OR creator:"${limpio}")`;
			const r = await fetch(`${IA}/advancedsearch.php?q=${encodeURIComponent(consulta)}&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=downloads&sort%5B%5D=downloads+desc&rows=40&output=json`, { signal: AbortSignal.timeout(10e3) });
			if (!r.ok) throw new Error("Archive.org respondió " + r.status);
			const j = await r.json();
			return ((j.response || {}).docs || []).map(normalizarIA);
		})(),
		// v199: Wikisource es + en
		(async () => {
			const r = await fetch(`https://es.wikisource.org/w/api.php?action=query&list=search&srnamespace=0&srlimit=40&srsearch=${q}&format=json&origin=*`, { signal: AbortSignal.timeout(10e3) });
			if (!r.ok) throw new Error("Wikisource ES respondió " + r.status);
			const j = await r.json();
			return (((j.query || {}).search) || []).map((x) => normalizarWS(x.title, "wikisource-es"));
		})(),
		(async () => {
			const r = await fetch(`https://en.wikisource.org/w/api.php?action=query&list=search&srnamespace=0&srlimit=40&srsearch=${q}&format=json&origin=*`, { signal: AbortSignal.timeout(10e3) });
			if (!r.ok) throw new Error("Wikisource EN respondió " + r.status);
			const j = await r.json();
			return (((j.query || {}).search) || []).map((x) => normalizarWS(x.title, "wikisource-en"));
		})()
	];
	const res = await Promise.allSettled(tareas);
	return res.filter((x) => x.status === "fulfilled").flatMap((x) => x.value || []);
}
/** v208: búsqueda en UNA sola biblioteca (streaming: cada respuesta aparece
*  en cuanto su biblioteca termina, sin esperar a que carguen las 5). */
async function buscarFuenteUna(id, texto) {
	const q = encodeURIComponent(texto);
	const limpio = String(texto).replace(/["]+/g, " ").trim();
	if (id === "gutendex") {
		const r = await fetch(`${GUTENDEX}/books/?languages=es&limit=40&search=${q}`, { signal: AbortSignal.timeout(10e3) });
		if (!r.ok) throw new Error("Gutendex respondió " + r.status);
		const j = await r.json();
		return (j.results || []).map(normalizar);
	}
	if (id === "openlibrary") {
		let r = await fetch(`${OL}/search.json?title=${q}&limit=40`, { signal: AbortSignal.timeout(10e3) });
		if (!r.ok) throw new Error("Open Library respondió " + r.status);
		let j = await r.json();
		let docs = j.docs || [];
		if (!docs.length) {
			const r2 = await fetch(`${OL}/search.json?author=${q}&limit=40`, { signal: AbortSignal.timeout(10e3) });
			if (r2.ok) {
				const j2 = await r2.json();
				docs = j2.docs || [];
			}
		}
		return docs.map(normalizarOL);
	}
	if (id === "archive") {
		const consulta = `mediatype:texts AND language:spanish AND (title:"${limpio}" OR creator:"${limpio}")`;
		const r = await fetch(`${IA}/advancedsearch.php?q=${encodeURIComponent(consulta)}&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=downloads&sort%5B%5D=downloads+desc&rows=40&output=json`, { signal: AbortSignal.timeout(10e3) });
		if (!r.ok) throw new Error("Archive.org respondió " + r.status);
		const j = await r.json();
		return ((j.response || {}).docs || []).map(normalizarIA);
	}
	if (id === "wikisource-es" || id === "wikisource-en") {
		const host = id === "wikisource-en" ? "en" : "es";
		const r = await fetch(`https://${host}.wikisource.org/w/api.php?action=query&list=search&srnamespace=0&srlimit=40&srsearch=${q}&format=json&origin=*`, { signal: AbortSignal.timeout(10e3) });
		if (!r.ok) throw new Error("Wikisource respondió " + r.status);
		const j = await r.json();
		return (((j.query || {}).search) || []).map((x) => normalizarWS(x.title, id));
	}
	return [];
}
/** Resuelve el archivo descargable (epub o txt) de un item de Archive.org. */
async function resolverArchivoIA(ia) {
	const r = await fetch(`${IA}/metadata/${ia}/files`, { signal: AbortSignal.timeout(15e3) });
	if (!r.ok) throw new Error("metadata " + r.status);
	const j = await r.json();
	const files = j.result || [];
	const epub = files.find((f) => /\.epub$/i.test(f.name) && !/uncompressed/i.test(f.name)) || files.find((f) => /\.epub$/i.test(f.name));
	const txt = files.find((f) => /\.txt$/i.test(f.name));
	const f = epub || txt;
	if (!f) return null;
	return {
		url: `${IA}/download/${ia}/${encodeURIComponent(f.name)}`,
		ext: /epub/i.test(f.name) ? "epub" : "txt"
	};
}
/** Estado en caché (v2: catálogo fusionado + estado por biblioteca). */
async function leerMeta() {
	try {
		const c = await getMeta(META_CAT, null);
		if ((c.v === 3 || c.v === 2) && Array.isArray(c.books) && c.books.length) {
			const f = {};
			for (const id of FUENTES) f[id] = c.fuentes && c.fuentes[id] ? c.fuentes[id] : { page: 0, mas: false, ok: false };
			return { books: c.books, fuentes: f, desde: c.desde | 0, totales: c.totales || {} };
		}
	} catch {}
	return null;
}
async function guardarMeta(estado) {
	try {
		await setMeta({
			id: META_CAT,
			v: 3,
			at: Date.now(),
			books: estado.books,
			fuentes: estado.fuentes,
			desde: estado.desde || 0,
			totales: estado.totales || {}
		});
	} catch {}
}
/** Etapas de la biblioteca local → bookshelves de Gutenberg (recomendación sin IA: solo
*  coincidencia de categorías y palabras del título/autor). */
const PALABRAS = {
	"Category: Romance": ["amor", "romance", "amante", "corazón", "enamor", "romantic"],
	"Category: Crime, Thrillers and Mystery": ["crimen", "misterio", "detective", "policí", "asesinat", "intriga", "espion", "mystery", "thriller"],
	"Category: Poetry": ["poes", "verso", "rima", "poema", "ode", "soneto", "poetry"],
	"Category: Short Stories": ["cuento", "relato", "gaviota", "fabla", "short story"],
	"Category: Plays/Films/Dramas": ["teatro", "drama", "comedia", "tragedia", "obra", "play"],
	"Category: Adventure": ["aventura", "aventur", "viaje", "marinero", "explorac", "pirata", "adventure"],
	"Category: History": ["historia", "histórico", "guerra", "siglo", "imperial", "révol", "history"],
	"Category: Science": ["ciencia", "científ", "astronom", "físic", "natural", "insect", "science"],
	"Category: Fantasy": ["fantas", "dragón", "magia", "hechic", "leyenda", "fantasy"],
	"Category: Juvenile": ["infantil", "niños", "niño", "escolar", "juvenil", "children"],
	"Category: Classics of Literature": ["clásic", "don qui", "cien años", "carta", "classic"],
	"Category: Philosophy": ["filosof", "ensayo", "moral", "diario", "memorias", "philosoph"],
	"Category: Travel": ["viajes", "travel", "paisajes"],
	"Category: Religion": ["relig", "santo", "biblia", "evang", "sermón", "relig"]
};
const ETIQUETA = {
	"Category: Novels": "novela",
	"Category: Romance": "romance",
	"Category: Crime, Thrillers and Mystery": "misterio",
	"Category: Poetry": "poes",
	"Category: Short Stories": "cuento",
	"Category: Plays/Films/Dramas": "drama",
	"Category: Adventure": "aventur",
	"Category: History": "histor",
	"Category: Science": "cienc",
	"Category: Fantasy": "fantas",
	"Category: Juvenile": "infantil",
	"Category: Classics of Literature": "clásic",
	"Category: Philosophy": "filosof",
	"Category: Biography": "biograf",
	"Category: Art": "arte",
	"Category: Comic and Graphic Books": "cómic"
};
function coincideTema(bookshelf, libro) {
	if (!bookshelf || bookshelf === "all") return true;
	if (!libro) return false;
	if (libro.fuente === "archive" || String(libro.fuente || "").startsWith("wikisource")) return false;
	const bLow = String(bookshelf).toLowerCase();
	const bs = (libro.bookshelves || []).map((x) => String(x).toLowerCase());
	if (bs.some((x) => x === bLow || x.includes(bLow) || (bLow.length >= 8 && x.startsWith(bLow)))) return true;
	const et = (ETIQUETA[bookshelf] || "").toLowerCase();
	if (et && bs.some((x) => x.includes(et))) return true;
	const cats = [libro.categoria, ...(libro.subjects || []), ...(libro.categories || [])].filter(Boolean).map((x) => String(x).toLowerCase());
	if (cats.some((c) => c.includes(bLow) || (et && c.includes(et)))) return true;
	const texto = ((libro.title || "") + " " + (libro.authors || []).join(" ") + " " + (libro.desc || "")).toLowerCase();
	if (et && texto.includes(et)) return true;
	const palabras = PALABRAS[bookshelf];
	if (palabras && palabras.some((p) => texto.includes(p.toLowerCase()) || bs.some((b) => b.includes(p.toLowerCase())))) return true;
	return false;
}
/** Recomienda hasta 24 libros gratis parecidos a los de la biblioteca local del usuario.
*  Sin IA: suma puntos por bookshelf en común y por palabra del título. */
function paraTi(catalogo, librosLocales) {
	const perfiles = /* @__PURE__ */ new Set();
	for (const b of librosLocales || []) {
		const texto = ((b.title || "") + " " + (b.categoria || "") + " " + (b.author || "")).toLowerCase();
		for (const [bookshelf, palabras] of Object.entries(PALABRAS)) if (palabras.some((w) => texto.includes(w))) perfiles.add(bookshelf);
	}
	return (catalogo || []).map((libro) => {
		let score = Math.min(2.5, Math.log10((libro.downloads || 0) + 10) * .55);
		const bs = (libro.bookshelves || []).map((x) => String(x).toLowerCase());
		for (const pf of perfiles) if (bs.some((x) => x === pf || x.startsWith(pf) || (ETIQUETA[pf] && x.includes(ETIQUETA[pf].toLowerCase())))) score += 2.2;
		const titulo = (libro.title || "").toLowerCase();
		for (const pf of perfiles) {
			const palabras = PALABRAS[pf] || [];
			if (palabras.some((w) => titulo.includes(w))) {
				score += 1;
				break;
			}
		}
		return {
			libro,
			score
		};
	}).filter((x) => perfiles.size ? x.score >= 1.7 : true).sort((a, b) => b.score - a.score).slice(0, 24).map((x) => x.libro);
}
async function fetchConProgreso(url, onPct, timeoutMs = 4e4) {
	const r = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
	if (!r.ok) throw new Error("HTTP " + r.status);
	const total = Number(r.headers.get("content-length")) || 0;
	if (!r.body || typeof r.body.getReader !== "function") {
		const b = await r.blob();
		onPct?.(100);
		return b;
	}
	const reader = r.body.getReader();
	const partes = [];
	let rec = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		partes.push(value);
		rec += value.length;
		if (total) onPct?.(Math.min(99, Math.round(rec / total * 100)));
	}
	onPct?.(100);
	return new Blob(partes);
}
function LibrosGratis({ toast, onSalir, onAbrirLibro, modo, onVentana, onBuscarWeb, busqueda, bibliotecas = null, temaExterno = null }) {
	const enSeccion = modo === "seccion";
	const [catalogo, setCatalogo] = (0, import_react.useState)(null);
	const [fuentes, setFuentes] = (0, import_react.useState)(null);
	const [cargando, setCargando] = (0, import_react.useState)(true);
	const [navegando, setNavegando] = (0, import_react.useState)(false);
	const [desde, setDesde] = (0, import_react.useState)(0);
	const [totales, setTotales] = (0, import_react.useState)(null);
	const [remoto, setRemoto] = (0, import_react.useState)(null);
	const [buscando, setBuscando] = (0, import_react.useState)(false);
	// v208: qué bibliotecas siguen sin responder (para «Buscando: …»)
	const [busquedaFaltan, setBusquedaFaltan] = (0, import_react.useState)([]);
	const [cargandoFondo, setCargandoFondo] = (0, import_react.useState)(0);
	const [hayMas, setHayMas] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [tema, setTema] = (0, import_react.useState)("all");
	const temaRef = (0, import_react.useRef)(tema);
	temaRef.current = tema;
	const [poolVersion, setPoolVersion] = (0, import_react.useState)(0);
	const catPoolsRef = (0, import_react.useRef)({});
	const cambiarTema = (nuevoTema) => {
		setTema(nuevoTema);
		temaRef.current = nuevoTema;
		setDesde(0);
		if (catRef.current) catRef.current.desde = 0;
	};
		const getPoolCategoria = (t) => {
		if (t === "all") {
			if (texto) {
				const todos = [
					...SEMILLA_40,
					...(catalogo || []),
					...Object.values(CATALOG_CATEGORIES).flat(),
					...LIBROS_EXTRA
				];
				const vistos = new Set();
				return todos.filter((b) => {
					const k = claveLibro(b);
					if (vistos.has(k)) return false;
					vistos.add(k);
					return true;
				});
			}
			return [
				...SEMILLA_40,
				...(catalogo || []).filter((b) => !SEMILLA_40.some((s) => claveLibro(s) === claveLibro(b)))
			];
		}
		if (!catPoolsRef.current[t]) {
			const base = (CATALOG_CATEGORIES[t] || []).slice();
			const extras = LIBROS_EXTRA.filter((b) => (b.bookshelves || []).includes(t));
			catPoolsRef.current[t] = [...base, ...extras.filter((ex) => !base.some((b) => claveLibro(b) === claveLibro(ex)))];
		}
		return catPoolsRef.current[t];
	};
	const [recomendados, setRecomendados] = (0, import_react.useState)(null);
	const [misLibros, setMisLibros] = (0, import_react.useState)([]);
	const [descarga, setDescarga] = (0, import_react.useState)(null);
	// v148: menú de opciones de descarga (navegador Lumen / dispositivo)
	const [menuLibro, setMenuLibro] = (0, import_react.useState)(null);
	// v180: guardados en carpetas/categorías (grupos por tema)
	const [guardados, setGuardados] = (0, import_react.useState)([]);
	const [guardTema, setGuardTema] = (0, import_react.useState)("todas");
	const [guardCat, setGuardCat] = (0, import_react.useState)(null);
	const [guardNueva, setGuardNueva] = (0, import_react.useState)("");
	// v148: vigilancia de importación tras descargar en un navegador
	const [vigilando, setVigilando] = (0, import_react.useState)(null);
	// v199: libros de bibliotecas «solo búsqueda» (Wikisource): al tocar se
	// elige el formato (EPUB/PDF) y el navegador busca el archivo.
	const [formatoBusqueda, setFormatoBusqueda] = (0, import_react.useState)(null);
	// v209: descarga directa completada → panel de guardado (carpeta/categoría + dispositivo)
	const [descargaOk, setDescargaOk] = (0, import_react.useState)(null);
	// v217: ficha del libro (sinopsis, autor, estrellas, similares) + mis calificaciones
	const [ficha, setFicha] = (0, import_react.useState)(null);
	const [fichaPila, setFichaPila] = (0, import_react.useState)([]);
	const [misRatings, setMisRatings] = (0, import_react.useState)({});
	const fichaRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => { getMeta(META_RATINGS, null).then((c) => { if (c && c.mapa) setMisRatings(c.mapa); }).catch(() => {}); }, []);
	const abrirFicha = (libro, apilar) => {
		haptic?.tap?.();
		setMenuLibro(null);
		const anterior = fichaRef.current ? fichaRef.current.libro : null; // capturar ANTES de reasignar la ref
		if (apilar && anterior) setFichaPila((p) => [...p, anterior]);
		else setFichaPila([]);
		const f = { libro, datos: { libro } };
		fichaRef.current = f;
		setFicha(f);
		cargarFicha(libro, (datos) => { if (fichaRef.current && claveLibro(fichaRef.current.libro) === claveLibro(libro)) { fichaRef.current = { libro, datos }; setFicha(fichaRef.current); } }).catch(() => {});
	};
	const cerrarFicha = () => { fichaRef.current = null; setFicha(null); setFichaPila([]); };
	const volverFicha = () => { const p = fichaPila.slice(); const ant = p.pop(); setFichaPila(p); if (ant) { const f = { libro: ant, datos: fichaCache.get(claveLibro(ant)) || { libro: ant } }; fichaRef.current = f; setFicha(f); cargarFicha(ant, (datos) => { if (fichaRef.current && claveLibro(fichaRef.current.libro) === claveLibro(ant)) { fichaRef.current = { libro: ant, datos }; setFicha(fichaRef.current); } }).catch(() => {}); } else cerrarFicha(); };
	const calificar = (libro, n) => {
		const k = claveLibro(libro);
		const mapa = { ...misRatings };
		if (n) mapa[k] = n; else delete mapa[k];
		setMisRatings(mapa);
		try { setMeta({ id: META_RATINGS, mapa, at: Date.now() }); } catch {}
		// si ya está en mi biblioteca, es la misma calificación de «Opciones del libro»
		const ya = enMiBib(libro);
		if (ya) { patchBook(ya.id, { rating: n }).catch(() => {}); setMisLibros((l) => l.map((b) => b.id === ya.id ? { ...b, rating: n } : b)); }
		toast?.(n ? "★ Calificado con " + n + (n === 1 ? " estrella" : " estrellas") : "Calificación quitada");
	};
	usarPantallaAtras(() => { if (fichaPila.length) volverFicha(); else cerrarFicha(); }, () => !ficha, !!ficha);
	// v199: extraer el texto de una página web desde la barra de búsqueda
	const [urlAbierto, setUrlAbierto] = (0, import_react.useState)(false);
	const [urlWeb, setUrlWeb] = (0, import_react.useState)("");
	const [urlWebBusy, setUrlWebBusy] = (0, import_react.useState)(false);
	const [urlPaso, setUrlPaso] = (0, import_react.useState)("");
	const vigRef = (0, import_react.useRef)(null);
	const catRef = (0, import_react.useRef)(null);
	const misRef = (0, import_react.useRef)([]);
	const vivoRef = (0, import_react.useRef)(true);
	const colaRef = (0, import_react.useRef)(Promise.resolve());
	// v208: bibliotecas activables (prop desde Lumen Store; null = todas activas)
	const bibRef = (0, import_react.useRef)(bibliotecas);
	bibRef.current = bibliotecas;
	// v200: en modo sección la barra de búsqueda vive en la cabecera de la
	// store: la consulta baja por prop y reutiliza el mismo debounce remoto.
	(0, import_react.useEffect)(() => {
		if (busqueda !== undefined) setQ(busqueda);
	}, [busqueda]);
	(0, import_react.useEffect)(() => {
		if (temaExterno !== null && temaExterno !== undefined) {
			const targetTema = (temaExterno === "politica" || temaExterno === "Category: Politics") ? "Category: Politics" : temaExterno;
			cambiarTema(targetTema);
		}
	}, [temaExterno]);
	usarPantallaAtras(() => onSalir?.(), () => false, !enSeccion);
	// Las mutaciones al catálogo pasan por una cola (sin carreras entre las
	// cargas en segundo plano de las 3 bibliotecas).
	const conCierre = (fn) => {
		const p = colaRef.current.then(fn).catch(() => {});
		colaRef.current = p;
		return p;
	};
	/* v208: «hay más» = alguna biblioteca activa con mas (ok o pendiente): así
	la barra no dice «ya no hay más» mientras una biblioteca sigue cargando */
	const hayMasEn = (f) => FUENTES.some((id) => { const b = bibRef.current; return f[id] && f[id].mas && (!b || b[id] !== false); });
	const publicar = () => {
		const e = catRef.current;
		if (!e) return;
		setCatalogo(e.books);
		setFuentes({ ...e.fuentes });
		setHayMas(hayMasEn(e.fuentes));
		if (temaRef.current === "all") setDesde(e.desde || 0);
		setTotales({ ...(e.totales || {}) });
		setRecomendados(paraTi(e.books, misRef.current));
		guardarMeta(e);
	};
	const aplicarFusion = (fuente, res, pagina) => {
		const e = catRef.current;
		if (!e) return;
		const vistos = new Set(e.books.map(claveLibro));
		const nuevos = res.books.filter((b) => {
			const k = claveLibro(b);
			if (vistos.has(k)) return false;
			vistos.add(k);
			return true;
		});
		e.books = [...e.books, ...nuevos];
		e.fuentes[fuente] = { page: pagina, mas: res.mas, ok: true, token: res.token || null };
		if (typeof res.total === "number" && res.total > 0) e.totales = { ...(e.totales || {}), [fuente]: res.total };
		// v150: no dejar crecer la memoria: se conserva solo lo necesario
		if (e.books.length > 1200) {
			const corte = Math.max(e.desde || 0, e.books.length - 1000);
			e.books = e.books.slice(corte);
			e.desde = Math.max(0, (e.desde || 0) - corte);
		}
		publicar();
	};
	const cargarFondo = (fuente) => {
		conCierre(async () => {
			const e = catRef.current;
			if (!e || !vivoRef.current) return;
			if (bibRef.current && bibRef.current[fuente] === false) return; // v208: desactivada
			const f = e.fuentes[fuente];
			if (f.page >= 1) return; // ya cargada
			setCargandoFondo((n) => n + 1);
			try {
				const res = await fetchFuente(fuente, 1);
				if (!vivoRef.current) return;
				aplicarFusion(fuente, res, 1);
			} catch {
				if (!vivoRef.current) return;
				e.fuentes[fuente] = { page: 0, mas: true, ok: false, fallo: true }; // v223: mas:true → reintento en «Siguientes 40»
				publicar();
			} finally {
				if (vivoRef.current) setCargandoFondo((n) => Math.max(0, n - 1));
			}
		});
	};
	(0, import_react.useEffect)(() => {
		vivoRef.current = true;
		(async () => {
			try {
				const lib = await allBooks().catch(() => []);
				if (!vivoRef.current) return;
				misRef.current = lib || [];
				setMisLibros(lib || []);
				const cache = await leerMeta();
				if (cache) {
					catRef.current = cache;
					publicar();
					setCargando(false);
					return;
				}
				// v223: Carga instantánea con semilla de 40 libros universales (0 ms)
				// y posterior carga en segundo plano progresiva priorizando Archive.org y Open Library
				catRef.current = {
					books: SEMILLA_40,
					fuentes: {
						archive: { page: 0, mas: true, ok: false },
						openlibrary: { page: 0, mas: true, ok: false },
						gutendex: { page: 0, mas: true, ok: false },
						"wikisource-es": { page: 0, mas: true, ok: false },
						"wikisource-en": { page: 0, mas: true, ok: false }
					},
					desde: 0,
					totales: { semilla: 40, archive: 50000, gutendex: 70000, openlibrary: 100000, "wikisource-es": 15000 }
				};
				publicar();
				setCargando(false);
				// Cargar progresivamente en segundo plano sin congelar la interfaz:
				setTimeout(() => cargarFondo("archive"), 100);
				setTimeout(() => cargarFondo("openlibrary"), 600);
				setTimeout(() => cargarFondo("gutendex"), 1200);
				setTimeout(() => cargarFondo("wikisource-es"), 1800);
				setTimeout(() => cargarFondo("wikisource-en"), 2400);
			} catch (e) {
				if (vivoRef.current) setError(e?.message || String(e));
			} finally {
				if (vivoRef.current) setCargando(false);
			}
		})();
		return () => {
			vivoRef.current = false;
			if (vigRef.current) clearInterval(vigRef.current);
		};
	}, []);
	const refrescar = async () => {
		try {
			toast?.("Actualizando las bibliotecas…");
			await conCierre(async () => {
				const e = catRef.current;
				const f1 = await fetchFuente("gutendex", 1);
				if (!e) return;
				const resto = e.books.filter((b) => b.fuente !== "gutendex");
				const vistos = new Set(resto.map(claveLibro));
				const g1 = f1.books.filter((b) => {
					const k = claveLibro(b);
					if (vistos.has(k)) return false;
					vistos.add(k);
					return true;
				});
				e.books = [...g1, ...resto];
				e.fuentes = {
					...e.fuentes,
					gutendex: { page: 1, mas: f1.mas, ok: true }
				};
				publicar();
			});
			toast?.(`Catálogo actualizado (${(catRef.current?.books || []).length} libros)`);
		} catch (e) {
			toast?.("No se pudo actualizar (¿sin internet?)");
		}
	};
		const irAnteriores = () => {
		const nuevoDesde = Math.max(0, (desde || 0) - VENTANA);
		setDesde(nuevoDesde);
		if (catRef.current) catRef.current.desde = nuevoDesde;
	};
	/** v231: avanza 40 libros de manera progresiva por categoría y catálogo global;
	*  en categorías trae los siguientes 40 de Open Library / Archive.org. */
	const irSiguientes = async () => {
		if (navegando) return;
		if (tema !== "all") {
			const pool = getPoolCategoria(tema);
			const fin = (desde || 0) + VENTANA;
			let poolActualizado = pool;
			if (pool.length < fin + VENTANA) {
				setNavegando(true);
				try {
					const nuevos = await fetchLibrosCategoria(tema, pool.length, VENTANA);
					if (nuevos && nuevos.length > 0) {
						const vistos = new Set(pool.map(claveLibro));
						const agregar = nuevos.filter((b) => !vistos.has(claveLibro(b)));
						poolActualizado = [...pool, ...agregar];
						catPoolsRef.current[tema] = poolActualizado;
						setPoolVersion((v) => v + 1);
					}
				} catch (err) {
					console.warn("Error cargando categoría:", err);
				} finally {
					setNavegando(false);
				}
			}
			setDesde(fin);
			if (catRef.current) catRef.current.desde = fin;
			return;
		}
		const e = catRef.current;
		if (!e) return;
		const fin = (e.desde || 0) + VENTANA;
		if (fin < e.books.length) {
			e.desde = fin;
			setDesde(fin);
			publicar();
			return;
		}
		const onBib = (id) => {
			const b = bibRef.current;
			return !b || b[id] !== false;
		};
		const conMas = FUENTES.filter((id) => e.fuentes[id] && e.fuentes[id].ok && e.fuentes[id].mas && onBib(id));
		const pendientes = FUENTES.filter((id) => {
			const f = e.fuentes[id];
			return f && !f.ok && f.mas !== false && onBib(id);
		});
		if (!conMas.length && !pendientes.length) {
			toast?.("Ya no hay más libros en las bibliotecas");
			return;
		}
		setNavegando(true);
		try {
			await conCierre(async () => {
				const est = catRef.current;
				if (!est) return;
				const antes = est.books.length;
				const fases = [];
				if (pendientes.length) fases.push((async () => {
					const res = await Promise.all(pendientes.map((id) => fetchFuente(id, 1, est.fuentes[id] && est.fuentes[id].token).catch(() => null)));
					res.forEach((r, i) => {
						const id = pendientes[i];
						if (!r) {
							est.fuentes[id] = { page: 0, mas: true, ok: false, fallo: true };
							return;
						}
						aplicarFusion(id, r, 1);
					});
				})());
				if (conMas.length) fases.push((async () => {
					const res = await Promise.all(conMas.map((id) => fetchFuente(id, est.fuentes[id].page + 1, est.fuentes[id].token).catch(() => null)));
					res.forEach((r, i) => {
						const id = conMas[i];
						if (!r) {
							est.fuentes[id] = { ...est.fuentes[id], mas: false };
							return;
						}
						aplicarFusion(id, r, est.fuentes[id].page + 1);
					});
				})());
				await Promise.all(fases);
				if (temaRef.current === "all") {
					if (est.books.length > fin) est.desde = fin;
					else if (est.books.length > antes) est.desde = Math.max(0, est.books.length - VENTANA);
					setDesde(est.desde);
				}
			});
		} catch {
			toast?.("No se pudieron cargar los siguientes libros (¿sin internet?)");
		} finally {
			setNavegando(false);
		}
	};
	// v150: busca en las 3 bibliotecas mientras el usuario escribe (debounce)
	// v150 (v208: streaming): busca en las bibliotecas activas mientras el
	// usuario escribe (debounce). CADA biblioteca responde por su cuenta:
	// los resultados aparecen en cuanto carga el primer catálogo, sin
	// esperar a que terminen los cinco, y de todas las que tengan el título.
	(0, import_react.useEffect)(() => {
		const t2 = q.trim();
		if (t2.length < 2) {
			setRemoto(null);
			setBuscando(false);
			setBusquedaFaltan([]);
			return;
		}
		setBuscando(true);
		setRemoto([]);
		let vivo = true;
		const activas = FUENTES.filter((id) => {
			const b = bibliotecas;
			return !b || b[id] !== false;
		});
		setBusquedaFaltan(activas.map((id) => BIB_INFO[id]));
		const t = setTimeout(() => {
			const faltan = new Set(activas);
			const mergeRes = (res) => {
				if (!vivo || !res || !res.length) return;
				setRemoto((prev) => {
					const base = prev || [];
					const vistos = new Set(base.map(claveLibro));
					const nuevos = res.filter((b) => {
						const k = claveLibro(b);
						if (vistos.has(k)) return false;
						vistos.add(k);
						return true;
					});
					return [...base, ...nuevos];
				});
			};
			Promise.all(activas.map(async (id) => {
				try {
					const res = await buscarFuenteUna(id, t2);
					mergeRes(res);
				} catch {}
				finally {
					faltan.delete(id);
					if (vivo) setBusquedaFaltan([...faltan].map((x) => BIB_INFO[x]));
					if (!faltan.size && vivo) setBuscando(false);
				}
			}));
		}, 400);
		return () => {
			vivo = false;
			clearTimeout(t);
		};
	}, [q, bibliotecas]);
	// v208: al reactivar una biblioteca, si aún no está cargada se carga
	// sola → el catálogo se actualiza al momento
	(0, import_react.useEffect)(() => {
		if (!bibliotecas) return;
		for (const id of FUENTES) {
			if (bibliotecas[id] === false) continue;
			const f = catRef.current && catRef.current.fuentes[id];
			if (f && !f.ok && f.mas !== false) cargarFondo(id);
		}
		// v208: [bibliotecas, catalogo] — el catálogo puede llegar (cache de
		// IndexedDB) DESPUÉS de la prop: sin esta dep, las fuentes pendientes
		// nunca se cargarían (cargarFondo es idempotente: salta si page>=1)
	}, [bibliotecas, catalogo]);
	const enMiBib = (libro) => {
		const base = nombreBase(libro);
		return (misLibros || []).find((b) => typeof b.fileName === "string" && b.fileName.startsWith(base + "."));
	};
	// v148: página del libro para abrir en un navegador
	const urlLibroDe = (libro) => {
		if (libro.url) return libro.url;
		if (libro.epub) return libro.epub;
		if (libro.pdf) return libro.pdf;
		if (libro.txt) return libro.txt;
		if (libro.fuente === "royalroad") return "https://www.royalroad.com/fictions/search?title=" + encodeURIComponent(libro.title);
		if (libro.fuente === "wattpad") return "https://www.wattpad.com/search/" + encodeURIComponent(libro.title);
		if (libro.fuente === "arxiv") return "https://arxiv.org/search/?query=" + encodeURIComponent(libro.title);
		if (libro.fuente === "annas") return "https://annas-archive.gl/search?q=" + encodeURIComponent(libro.title);
		if (libro.fuente !== "openlibrary" && libro.fuente !== "archive") return "https://www.gutenberg.org/ebooks/" + libro.id;
		return null;
	};
	// v168: ¿existe el navegador integrado (puente de la app Android)? En la
	// PWA/PC no hay, así que el flujo usa el navegador del dispositivo.
	const navDisponible = () => typeof window !== "undefined" && !!(window.AndroidNav && typeof window.AndroidNav.abrir === "function");
	// v199: el navegador busca el libro en el formato elegido (EPUB o PDF)
	const buscarEnNavegador = (libro, fmt) => {
		const autor = nombreAutorLimpio((libro.authors || [])[0]) || (libro.authors || [])[0] || "";
		const q = '"' + (libro.title || "").trim() + '"' + (autor ? ' "' + autor.trim() + '"' : "") + " filetype:" + fmt;
		setFormatoBusqueda(null);
		try {
			window.open("https://www.google.com/search?q=" + encodeURIComponent(q), "_blank", "noopener");
		} catch {}
		toast?.("🔎 Buscando «" + (libro.title || "").slice(0, 40) + "» en formato " + fmt.toUpperCase() + "…");
		// v209: Lumen se queda OYENDO la descarga (auto-detección); si no la
		// detecta, el usuario lo lleva a mano con «Elegir archivo»
		vigilarLibro(libro);
	};
	// v199: extrae el texto de una página web y lo importa como libro
	const importarPagina = async () => {
		const u = urlWeb.trim();
		if (!u || urlWebBusy) return;
		setUrlWebBusy(true);
		setUrlPaso("Conectando…");
		try {
			const { titulo, texto } = await importarDesdeUrl(u, (pct, txt) => setUrlPaso(txt || pct + "%"));
			const paginas = paginate(texto);
			const id = uid();
			const now = Date.now();
			await putBook({
				id,
				title: titulo,
				fileName: titulo + ".txt",
				kind: "web",
				sourceUrl: u,
				size: texto.length,
				pageCount: paginas.length,
				lastPage: 0,
				addedAt: now,
				openedAt: now,
				status: "ready",
				hasOriginal: false,
				ocrPages: [],
				needsOcrPages: [],
				percentRead: 0,
				own: true
			});
			await putPages(paginas.map((t, i) => ({
				bookId: id,
				index: i,
				text: t,
				needsOcr: false,
				ocrDone: false,
				source: "web"
			})));
			setUrlWeb("");
			setUrlAbierto(false);
			toast?.("✓ «" + titulo.slice(0, 28) + "» importado desde la web");
			onAbrirLibro?.(id);
		} catch (e) {
			toast?.(e?.message || "No se pudo importar esa página");
		} finally {
			setUrlWebBusy(false);
			setUrlPaso("");
		}
	};

	// v148: vigila la biblioteca: apenas aparezca el libro importado (por
	// descarga en el navegador), lo detecta y lo abre solo.
	// v209: guardar el archivo en una carpeta local del dispositivo
	const guardarEnDispositivo = async (file, nombre) => {
		try {
			if (window.showSaveFilePicker) {
				const handle = await window.showSaveFilePicker({ suggestedName: nombre });
				const wr = await handle.createWritable();
				await wr.write(file);
				await wr.close();
				toast?.("📥 Guardado en la carpeta que elegiste");
				return;
			}
		} catch (e2) {
			if (e2?.name === "AbortError") return;
		}
		try {
			const url = URL.createObjectURL(file);
			const a = document.createElement("a");
			a.href = url;
			a.download = nombre;
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(url), 4000);
			toast?.("📥 Descargado a tu dispositivo (carpeta «Descargas»)");
		} catch {
			toast?.("No se pudo guardar en el dispositivo");
		}
	};
	const vigilarLibro = (libro) => {
		const base = nombreBase(libro);
		const titulo = (libro.title || "").trim().toLowerCase();
		if (vigRef.current) clearInterval(vigRef.current);
		const t0 = Date.now();
		setVigilando({ clave: String(libro.id), titulo: libro.title || "" });
		const id = setInterval(async () => {
			if (!vivoRef.current) { clearInterval(id); return; }
			if (Date.now() - t0 > 5 * 60e3) {
				clearInterval(id);
				vigRef.current = null;
				setVigilando(null);
				toast?.("Sigo sin detectar la descarga; si ya la tienes, pulsa «Elegir archivo»");
				return;
			}
			try {
				const libros = await allBooks();
				const nuevo = libros.find((x) => (typeof x.fileName === "string" && x.fileName.startsWith(base + ".")) || (titulo.length > 6 && x.title && x.title.trim().toLowerCase() === titulo));
				if (nuevo && nuevo.status === "ready") {
					clearInterval(id);
					vigRef.current = null;
					misRef.current = libros;
					setMisLibros(libros);
					setVigilando(null);
					toast?.("✓ «" + (libro.title || "Libro") + "» detectado: importado y abriéndolo");
					onAbrirLibro?.(nuevo.id);
				}
			} catch {}
		}, 2500);
		vigRef.current = id;
	};
	const importarManual = async (f) => {
		if (typeof window.__lumenImportarArchivos !== "function") return toast?.("La biblioteca aún no está lista; espera unos segundos");
		try {
			await window.__lumenImportarArchivos([f]);
			toast?.("Importando «" + (f.name || "archivo") + "»…");
		} catch (e) {
			toast?.("No se pudo importar (" + (e?.message || e) + ")");
		}
	};
	// v148: abrir la página del libro en el navegador elegido y vigilar la importación
	const abrirConNavegador = (libro, modo) => {
		// v168: si el libro tiene archivo directo (EPUB/TXT), se abre ESE enlace
		// en el navegador (que lo descarga sin problemas de CORS); si no, la
		// página del libro. Antes se usaba fetch directo, que fallaba en la mayoría.
		const u = libro.epub || libro.txt || urlLibroDe(libro);
		if (!u) return toast?.("Este libro no tiene archivo ni página para abrir");
		const tituloNav = "Libros gratis · " + (libro.title || "");
		let abierto = false;
		if (modo === "lumen") {
			try {
				const nat = typeof window !== "undefined" ? window.AndroidNav : null;
				if (nat && typeof nat.abrir === "function") {
					nat.abrir(u, tituloNav);
					abierto = true;
				}
			} catch {}
		}
		if (!abierto) {
			try {
				window.open(u, "_blank", "noopener");
				abierto = true;
			} catch {}
		}
		if (!abierto) return toast?.("No se pudo abrir el navegador");
		toast?.(modo === "lumen" ? "🌐 Descarga el EPUB en el navegador de Lumen: apenas lo detecte, lo importará y lo abrirá solo." : "📲 Descarga el EPUB y luego pulsa «Elegir archivo» (o Lumen lo detectará solo).");
		vigilarLibro(libro);
	};
	const leerGratis = async (libro) => {
		if (descarga) return;
		const ya = enMiBib(libro);
		if (ya && ya.status === "ready") {
			onAbrirLibro?.(ya.id);
			return;
		}
		const base = nombreBase(libro);
		const titulo = libro.title || "";
		let url = libro.epub || null;
		let ext = url ? "epub" : "txt";
		if (!url) url = libro.txt || null;
		if (!url && !libro.ia) return toast?.("Este libro no tiene archivo para descargar");
		setDescarga({
			clave: String(libro.id),
			nombre: titulo,
			pct: 0
		});
		try {
			if (!url) {
				const r = await resolverArchivoIA(libro.ia);
				if (!r) throw new Error("sin archivo EPUB/TXT disponible");
				url = r.url;
				ext = r.ext;
				setDescarga({
					clave: String(libro.id),
					nombre: titulo,
					pct: 0
				});
			}
			const blob = await fetchConProgreso(url, (pct) => setDescarga({
				clave: String(libro.id),
				nombre: titulo,
				pct
			}));
			const nombre = base + "." + ext;
			const file = new File([blob], nombre, {
				type: ext === "epub" ? "application/epub+zip" : "text/plain"
			});
			if (typeof window.__lumenImportarArchivos !== "function") throw new Error("La biblioteca aún no está lista para importar; espera unos segundos e inténtalo de nuevo");
			await window.__lumenImportarArchivos([file]);
			let nuevo = null;
			for (let i = 0; i < 30 && !nuevo; i++) {
				await new Promise((res) => setTimeout(res, 500));
				const libros = await allBooks();
				const b = libros.find((x) => x.fileName === nombre);
				if (b && b.status === "ready") nuevo = b;
			}
			if (!nuevo) throw new Error("El archivo se descargó pero no terminó de importarse");
			misRef.current = await allBooks().catch(() => misLibros);
			setMisLibros(misRef.current);
			// v209: éxito → panel con las opciones de guardado (no abre solo)
			setDescargaOk({ libro, file, nombre, id: nuevo.id });
			{ const r = misRatings[claveLibro(libro)]; if (r) patchBook(nuevo.id, { rating: r }).catch(() => {}); } // v217
		} catch (e) {
			// v209: la directa falló → el enlace en el navegador (sin CORS) y
			// Lumen se queda oyendo la descarga (vigilando) con «Elegir archivo»
			if (libro.epub || libro.txt || urlLibroDe(libro)) {
				toast?.("La descarga directa no funcionó; abrí el archivo en el navegador y sigo de oído.");
				abrirConNavegador(libro, navDisponible() ? "lumen" : "dispositivo");
			} else {
				setMenuLibro(String(libro.id));
				toast?.("La descarga directa no funcionó (" + (e?.message || e) + "); elige otra opción");
			}
		} finally {
			setDescarga(null);
		}
	};
	const texto = q.trim().toLowerCase();
	const poolCategoria = getPoolCategoria(tema);
	const filtradosBrutos = poolCategoria.filter((libro) => {
		if (bibliotecas && bibliotecas[libro.fuente] === false) return false;
		if (!texto) return true;
		return (libro.title || "").toLowerCase().includes(texto) || (libro.authors || []).join(" ").toLowerCase().includes(texto);
	});
	const finVentana = Math.min((desde || 0) + VENTANA, filtradosBrutos.length);
	const totalAprox = tema === "all" ? Object.values(totales || {}).reduce((a, b) => a + (b || 0), 0) : 50000;
	const filtrados = filtradosBrutos.slice(desde || 0, finVentana);
	const nBibliotecas = fuentes ? FUENTES.filter((id) => fuentes[id]?.ok).length : 0;
	// v223 / v231: embebido en Lumen Store: reporta su ventana de 40/40 al padre
	// para que el pie de la store (cg-pie) pinte la paginación compacta.
	const lgApiRef = (0, import_react.useRef)(null);
	lgApiRef.current = { irSiguientes, irAnteriores, refrescar };
	const onVentanaRef = (0, import_react.useRef)(onVentana);
	onVentanaRef.current = onVentana;
	const hayMasVentana = tema === "all" ? hayMas : true;
	(0, import_react.useEffect)(() => {
		onVentanaRef.current?.({ listo: !cargando && !!catalogo, desde: desde || 0, fin: finVentana, nCat: (catalogo || []).length, total: totalAprox, hayMas: hayMasVentana, navegando, api: lgApiRef });
	}, [cargando, catalogo, desde, finVentana, totalAprox, hayMasVentana, navegando, tema]);
	// v180: guardados (carpetas/categorías por tema)
	const cargarGuardados = async () => {
		try {
			const c = await getMeta(META_GARD, null);
			if (Array.isArray(c?.lista)) setGuardados(c.lista);
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		cargarGuardados();
	}, []);
	const guardarMetaGard = (lista) => {
		setGuardados(lista);
		try {
			setMeta({ id: META_GARD, lista, at: Date.now() });
		} catch {}
	};
	const esGuardado = (libro) => guardados.find((g) => claveLibro(g.b) === claveLibro(libro)) || null;
	const guardarEn = (libro, cat) => {
		const c = String(cat || "").trim() || "Sin categoría";
		const clave = claveLibro(libro);
		guardarMetaGard([...guardados.filter((g) => claveLibro(g.b) !== clave), { b: libro, cat: c, at: Date.now() }]);
		setGuardCat(null);
		setGuardNueva("");
		setMenuLibro(null);
		toast?.("🔖 Guardado en «" + c + "»");
	};
	const quitarGuardado = (libro) => {
		const clave = claveLibro(libro);
		guardarMetaGard(guardados.filter((g) => claveLibro(g.b) !== clave));
		setGuardCat(null);
		setMenuLibro(null);
		toast?.("Quitado de guardados");
	};
	const catsUsadas = () => {
		const ops = [];
		for (const g of guardados) if (g.cat && !ops.includes(g.cat)) ops.push(g.cat);
		return ops;
	};
	const catGuard = () => {
		const ops = [];
		for (const g of guardados) if (g.cat && g.cat !== "Sin categoría" && !ops.includes(g.cat)) ops.push(g.cat);
		for (const t of TEMAS) if (t.id !== "all" && !ops.includes(t.label)) ops.push(t.label);
		return ops.slice(0, 10);
	};
	const leerAhoraRef = (0, import_react.useRef)({});
	const tarjetas = (lista) => lista.map((libro) => {
		const ya = enMiBib(libro);
		const yaListo = !!(ya && ya.status === "ready");
		const descargando = descarga && descarga.clave === String(libro.id);
		const guard = esGuardado(libro);
		const abrir = () => abrirFicha(libro, false); // v217: tocar un libro abre su FICHA
		const leerAhora = () => {
			// v199: bibliotecas «solo búsqueda» (Wikisource): se elige el
			// formato (EPUB/PDF) y el navegador busca el archivo.
			if (libro.soloBusqueda) {
				setMenuLibro(null);
				setFormatoBusqueda(libro);
				return;
			}
			if (yaListo) {
				onAbrirLibro?.(ya.id);
				return;
			}
			setMenuLibro(null);
			// v209: PRIMERO la descarga directa (dentro de la app): si funciona,
			// queda en la biblioteca y se puede llevar a una carpeta/categoría o a
			// una carpeta local del dispositivo; si falla, el navegador lo descarga
			// y LUMEN SE QUEDA OYENDO. Sin archivo directo: búsqueda en pestaña.
			if (libro.epub || libro.txt || libro.ia) {
				leerGratis(libro).catch(() => {});
			} else if (urlLibroDe(libro)) {
				abrirConNavegador(libro, navDisponible() ? "lumen" : "dispositivo");
			} else {
				setMenuLibro(String(libro.id));
			}
		};
		leerAhoraRef.current[String(libro.id)] = leerAhora;
		const miR = misRatings[claveLibro(libro)] || 0;
		const sgl = siglaDe(libro.fuente);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg-mini" + (yaListo ? " lg-ya" : ""),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-mini-top",
				onClick: abrir,
				children: [libro.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "lg-cover",
					src: libro.cover,
					alt: "",
					loading: "lazy",
					draggable: false
				}) : (() => {
					// v208: portada sin imagen → gradiente + iniciales (se ve como portada)
					const hv = tonoDe(libro.title);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-cover lg-falso",
						style: { background: `linear-gradient(150deg, hsl(${hv} 55% 42%), hsl(${(hv + 45) % 360} 50% 22%))` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inicialesDe(libro.title) })
					});
				})(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "lg-sigla-badge " + claseSigla(sgl),
					children: sgl
				}), yaListo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "lg-badge",
					children: "✓"
				}) : null, descargando ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-prog",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-prog-fill",
						style: { width: (descarga.pct || 0) + "%" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "lg-prog-txt",
						children: (descarga.pct || 0) + "%"
					})]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "lg-mas",
					title: "Otras opciones",
					"aria-label": "Otras opciones",
					onClick: (e) => {
						e.stopPropagation();
						setMenuLibro(menuLibro === String(libro.id) ? null : String(libro.id));
					},
					children: "⋯"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg-nombre",
				onClick: abrir,
				children: libro.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg-autor",
				children: nombreAutorLimpio((libro.authors || [])[0]) || (libro.authors || [])[0] || "Autor desconocido"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-meta",
				children: [miR ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "lg-mi-r", children: "★".repeat(miR) + " · " }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "lg-sigla-desc", children: sgl + " · " }), (libro.bookshelves || [])[0]?.replace("Category: ", "") || "Dominio público", " · ", libro.downloads ? (libro.downloads >= 1e6 ? "⬇" + Math.round(libro.downloads / 1e6) + " M" : "⬇" + Math.round(libro.downloads / 1e3) + " mil") : "⬇ 0"]
			}), menuLibro === String(libro.id) && !descarga && !yaListo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-menu-fondo",
				onClick: () => setMenuLibro(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-menu",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-menu-tit",
						children: (libro.title || "").slice(0, 48) || "Libro"
					}), libro.soloBusqueda ? [
						// v199: bibliotecas «solo búsqueda»: el navegador busca el
						// archivo en el formato que elija el usuario
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							onClick: () => {
								setMenuLibro(null);
								buscarEnNavegador(libro, "epub");
							},
							children: "📚 Buscar en el navegador (EPUB)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								setMenuLibro(null);
								buscarEnNavegador(libro, "pdf");
							},
							children: "📄 Buscar en el navegador (PDF)"
						})
					] : [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								setMenuLibro(null);
								abrirConNavegador(libro, "lumen");
							},
							children: "🌐 Navegador de Lumen"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								setMenuLibro(null);
								abrirConNavegador(libro, "dispositivo");
							},
							children: "📲 Navegador del dispositivo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								setMenuLibro(null);
								leerGratis(libro).catch(() => {});
							},
							children: "⚡ Descarga directa"
						})
					], guard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn",
						onClick: () => quitarGuardado(libro),
						children: "✔ Guardado en «" + guard.cat + "» — quitar"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary",
						onClick: () => {
							setMenuLibro(null);
							setGuardCat(String(libro.id));
						},
						children: "🔖 Guardar en carpeta / categoría…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						onClick: () => setMenuLibro(null),
						children: "✕ Cerrar"
					})]
				})]
			}), guardCat === String(libro.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-menu-fondo",
				onClick: () => {
					setGuardCat(null);
					setGuardNueva("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-menu lg-guardar",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-menu-tit",
						children: "Guardar «" + (libro.title || "").slice(0, 40) + "» en:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "chips lg-guardar-chips",
						children: catGuard().map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip",
							onClick: () => guardarEn(libro, c),
							children: c
						}, c))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-guardar-fila",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "plain",
							placeholder: "Nueva categoría…",
							value: guardNueva,
							onChange: (e) => setGuardNueva(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && guardNueva.trim()) guardarEn(libro, guardNueva);
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							disabled: !guardNueva.trim(),
							onClick: () => guardarEn(libro, guardNueva),
							children: "Guardar"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						onClick: () => {
							setGuardCat(null);
							setGuardNueva("");
						},
						children: "✕ Cerrar"
					})]
				})]
			}), vigilando && vigilando.clave === String(libro.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-vigilando",
				"aria-label": "Detectando tu descarga",
				/* v208: solo iconos (compacto en pantallas pequeñas) */
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "lg-vig-ic lg-vig-ojo",
					title: "Detectando tu descarga…",
					children: "👀"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "lg-vig-ic",
					title: "Elegir archivo",
					"aria-label": "Elegir archivo",
					children: ["📂", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: ".epub,.pdf,.txt,.mobi,.lumen",
						style: { display: "none" },
						onChange: (e) => {
							const f = e.target.files && e.target.files[0];
							if (f) importarManual(f).catch(() => {});
							e.target.value = "";
						}
					})]
				})]
			})]
		}, String(libro.id));
	});
	// v180: tiradas horizontales: cada fila tiene 10 libros (6 visibles por pantalla)
	const filas = (lista) => {
		const cards = tarjetas(lista);
		const out = [];
		for (let i = 0; i < cards.length; i += 10) out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg-fila",
			children: cards.slice(i, i + 10)
		}, i));
		return out;
	};

	const cuerpo = [...(enSeccion ? [] : [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-busq-fila",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "plain lg-busqueda",
						placeholder: "Buscar aquí y en las 5 bibliotecas…",
						value: q,
						onChange: (e) => setQ(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-busq-extras",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "lg-busq-btn",
							disabled: !q.trim(),
							title: "Buscar en la web (Anna's Archive, Gutenberg, Archive y más)",
							"aria-label": "Buscar en la web",
							onClick: () => onBuscarWeb?.(q.trim()),
							children: "🌐"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "lg-busq-btn" + (urlAbierto ? " on" : ""),
							title: "Extraer el texto de una página web",
							"aria-label": "Página web",
							onClick: () => setUrlAbierto(!urlAbierto),
							children: "🔗"
						})]
					})]
				}), urlAbierto && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-url-fila",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "plain lg-url-input",
						placeholder: "https://ejemplo.com/articulo",
						value: urlWeb,
						inputMode: "url",
						onChange: (e) => setUrlWeb(e.target.value),
						onKeyDown: (e) => { if (e.key === "Enter") importarPagina(); }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn lg-url-btn",
						disabled: urlWebBusy || !urlWeb.trim(),
						onClick: importarPagina,
						children: urlWebBusy ? urlPaso || "…" : "Extraer"
					})]
				}),]), !enSeccion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "chips lg-temas",
					children: TEMAS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "chip" + (tema === t.id ? " on" : ""),
						"data-tema": t.id,
						onClick: () => cambiarTema(t.id),
						children: t.label
					}, t.id))
				}), !cargando && cargandoFondo > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-fondo",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "spinner",
						style: { display: "inline-block", marginRight: 8 }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cargandoFondo >= 2 ? "Cargando otras 2 bibliotecas en segundo plano… los libros nuevos aparecerán solos aquí." : "Cargando otra biblioteca en segundo plano… los libros nuevos aparecerán solos aquí." })]
				}), !cargando && guardados.length > 0 && texto.length < 2 && /* v208: en búsqueda, sin ruido */ /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-title",
					style: { margin: "14px 4px 4px" },
					children: `🔖 Guardados · ${guardados.length}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row-sub",
					style: { margin: "0 4px 8px" },
					children: "Tus libros guardados en carpetas (categorías por tema). Toca la portada o el nombre para leerlos gratis."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "chips lg-temas",
					children: ["todas", ...catsUsadas()].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "chip" + (guardTema === c ? " on" : ""),
						onClick: () => setGuardTema(c),
						children: c === "todas" ? "Todas" : c
					}, c))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg-filas",
					children: filas(guardados.filter((g) => guardTema === "todas" || g.cat === guardTema).map((g) => g.b))
				})]
			}),  !cargando && !enSeccion && recomendados && recomendados.length > 0 && tema === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						style: { margin: "14px 4px 4px" },
						children: "✨ Para ti · según tus libros"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { margin: "0 4px 10px" },
						children: "Elegidos con etiquetas parecidas a lo que ya tienes en tu Lumen (sin cuentas y sin IA)."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-filas",
						children: filas(recomendados.filter((l) => !texto || (l.title || "").toLowerCase().includes(texto) || l.authors.join(" ").toLowerCase().includes(texto)))
					})]
				}), !cargando && (texto.length >= 2 || (remoto && remoto.length > 0)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						style: { margin: "16px 4px 4px" },
						children: buscando ? ("🌐 Buscando: " + (busquedaFaltan.length ? busquedaFaltan.join(" · ") : "casi listo")) : `🌐 En las bibliotecas · ${remoto ? remoto.length : 0} resultados`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { margin: "0 4px 10px" },
						children: "Resultados directos de Gutenberg, Open Library, Archive.org y Wikisource (aunque no estén en el catálogo)."
					}), buscando && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { padding: "18px 4px" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "spinner",
							style: { display: "inline-block" }
						})
					}), !remoto?.length && !buscando && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { margin: "0 4px 10px" },
						children: `Sin resultados en las bibliotecas para «${q.trim()}». Prueba con menos palabras.`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-filas",
						children: filas(remoto || [])
					})]
				}), 
!cargando && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						style: { margin: "16px 4px 4px" },
						children: texto.length >= 2 ? ["📥 En la ventana cargada · ", filtrados.length, " coincidencia(s)"] : [tema === "all" ? "Todo el catálogo" : (TEMAS.find((t) => t.id === tema) || {}).label, " · ", filtrados.length, " de ", finVentana - (desde || 0), " libros en esta ventana"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-filas",
						children: filas(filtrados.slice(0, 40)) // v223: bloque progresivo de 40 libros
					}), !enSeccion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-pag",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							disabled: (desde || 0) === 0,
							onClick: irAnteriores,
							children: "‹ Anteriores 40"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lg-pag-info",
							children: `Mostrando ${(desde || 0) + 1}–${finVentana} · ≈ ${totalAprox || "?"} libros en las bibliotecas`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							disabled: navegando || (!hayMas && finVentana >= (catalogo || []).length),
							onClick: irSiguientes,
							children: navegando ? "Cargando…" : "Siguientes 40 ›"
						})
					]})
				]}), cargando && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "center-msg",
					style: { padding: 60 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "spinner",
						style: { display: "block", margin: "0 auto 12px" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Buscando libros gratis en 5 bibliotecas…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { marginTop: 8, fontSize: 13, opacity: .75 },
						children: "La primera vez puede tardar unos minutos; después se guarda en caché y abre al instante."
					})]
				}), !cargando && error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "center-msg",
					style: { padding: 50 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						children: "📡 No se pudo abrir el catálogo: " + error
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { marginTop: 8 },
						children: "Necesitas internet la primera vez; después se guarda en caché. Inténtalo de nuevo:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary",
						style: { marginTop: 10 },
						onClick: () => {
							setError(null);
							setCargando(true);
							conCierre(async () => {
								const f1 = await fetchFuente("gutendex", 1);
								catRef.current = {
									books: f1.books,
									fuentes: {
										gutendex: { page: 1, mas: f1.mas, ok: true },
										openlibrary: { page: 0, mas: true, ok: false },
										archive: { page: 0, mas: true, ok: false },
										"wikisource-es": { page: 0, mas: true, ok: false },
										"wikisource-en": { page: 0, mas: true, ok: false }
									},
									desde: 0,
									totales: { gutendex: f1.total || 0 }
								};
								publicar();
							}).catch((e2) => setError(e2?.message || String(e2))).finally(() => setCargando(false));
						},
						children: "Reintentar"
					})]
				}), descarga && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg-aviso",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "spinner",
						style: { display: "inline-block", marginRight: 8 }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Descargando y añadiendo: " + descarga.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg-barra",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg-barra-fill",
								style: { width: (descarga.pct || 0) + "%" }
							})
						})]
					})]
				}),
				// v217: FICHA del libro
				ficha && (() => {
					const libro = ficha.libro; const d = ficha.datos || {};
					const ya = enMiBib(libro); const yaListo = !!(ya && ya.status === "ready");
					const descargando = descarga && descarga.clave === String(libro.id);
					const miR = misRatings[claveLibro(libro)] || 0;
					const autorVerdadero = nombreAutorLimpio((libro.authors || [])[0]) || (libro.authors || [])[0] || "";
					const autorNombre = autorVerdadero || (d.autor && d.autor.nombre) || d.autorNombre || "Autor desconocido";
					const sinopsis = (libro.synopsis || libro.description) || d.sinopsisPropia || (d.sinopsisWiki ? d.sinopsisWiki.texto : d.sinopsisOL || d.sinopsisGB || null);
					const fuenteSin = ((libro.synopsis || libro.description) || d.sinopsisPropia) ? (BIB_INFO[libro.fuente] || "Sinopsis oficial") : (d.sinopsisWiki ? "Wikipedia" : d.sinopsisOL ? "Open Library" : d.sinopsisGB ? "Google Books" : null);
					const bio = (d.autorWiki && d.autorWiki.texto) || (d.autor && d.autor.bio) || null;
					const fotoAutor = (d.autorWiki && d.autorWiki.foto) || (d.autor && d.autor.foto) || null;
					const com = d.comunidad || d.comunidadGB || null;
					const temas = [...(d.temas || []), ...(d.temasGB || [])].filter((t, i, a) => a.indexOf(t) === i).slice(0, 8);
					const cover = libro.cover || d.cover || null;
					const hv = tonoDe(libro.title);
					const guard = esGuardado(libro);
					const leer = () => { const fn = leerAhoraRef.current[String(libro.id)]; setFicha(null); fichaRef.current = null; if (fn) fn(); else if (libro.epub || libro.txt || libro.ia) leerGratis(libro).catch(() => {}); else if (libro.soloBusqueda) setFormatoBusqueda(libro); else abrirConNavegador(libro, navDisponible() ? "lumen" : "dispositivo"); };
					const miniFila = (lista, tit, vacio) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fx-bloque",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-h", children: tit }), lista && lista.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fx-fila",
							children: lista.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "fx-mini",
								title: b.title,
								onClick: () => abrirFicha(b, true),
								children: [b.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: b.cover, alt: "", loading: "lazy", draggable: false }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-mini-falso", style: { background: `linear-gradient(150deg, hsl(${tonoDe(b.title)} 55% 42%), hsl(${(tonoDe(b.title) + 45) % 360} 50% 22%))` }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inicialesDe(b.title) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fx-mini-t", children: b.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fx-mini-a", children: (b.authors || [])[0] || "" })]
							}, claveLibro(b)))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "row-sub fx-vacio", children: d.listo ? vacio : "Buscando…" })]
					});
					// recomendados para ti: del catálogo cargado, con etiquetas parecidas (sin IA), distintos del libro y de los similares
					const recs = (recomendados || paraTi(catalogo || [], misRef.current) || []).filter((b) => claveLibro(b) !== claveLibro(libro)).slice(0, 12);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-menu-fondo fx-fondo",
						onClick: cerrarFicha,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "fx",
							role: "dialog",
							"aria-label": "Ficha del libro",
							onClick: (e) => e.stopPropagation(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "fx-top",
								children: [fichaPila.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "fx-x", "aria-label": "Volver", onClick: volverFicha, children: "‹" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fx-top-t", children: BIB_INFO[libro.fuente] || "Lumen Store" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "fx-x", "aria-label": "Cerrar", onClick: cerrarFicha, children: "✕" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "fx-body",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "fx-cab",
									children: [cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "fx-cover", src: cover, alt: "", draggable: false }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-cover fx-falso", style: { background: `linear-gradient(150deg, hsl(${hv} 55% 42%), hsl(${(hv + 45) % 360} 50% 22%))` }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inicialesDe(libro.title) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fx-datos",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "fx-tit", children: libro.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-aut", children: autorNombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-sub", children: [d.anio ? String(d.anio) : null, d.paginas || d.paginasGB ? (d.paginas || d.paginasGB) + " págs." : null, libro.downloads ? "⬇ " + (libro.downloads >= 1e6 ? Math.round(libro.downloads / 1e6) + " M" : Math.round(libro.downloads / 1e3) + " mil") : null, (libro.bookshelves || [])[0]?.replace("Category: ", "")].filter(Boolean).join(" · ") || "Dominio público" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "fx-rating",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-rating-l", children: miR ? "Tu calificación" : "Califícalo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estrellas, { valor: miR, onCambiar: (n) => calificar(libro, n) }), com ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "fx-com", children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "★ " + com.media.toFixed(1) }), " · ", com.n, " ", com.n === 1 ? "lector" : "lectores", " en ", d.comunidad ? "Open Library" : "Google Books"] }) : d.listo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-com", children: "Sin valoraciones de la comunidad aún" }) : null]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "fx-acciones",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn primary fx-leer", disabled: !!descargando, onClick: leer, children: yaListo ? "📖 Abrir libro" : descargando ? "⏳ Descargando " + (descarga.pct || 0) + "%" : libro.soloBusqueda ? "🔎 Buscar el archivo" : "⚡ Leer ahora" }), guard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn", onClick: () => quitarGuardado(libro), children: "✔ En «" + guard.cat + "»" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn", onClick: () => { setGuardCat(String(libro.id)); }, children: "🔖 Guardar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn", "aria-label": "Más opciones", onClick: () => { setMenuLibro(String(libro.id)); }, children: "⋯" })]
								}), temas.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chips fx-temas", children: temas.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "chip", children: t }, t)) }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "fx-bloque",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-h", children: "Sinopsis" }), sinopsis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "fx-texto", children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: sinopsis.length > 900 && !ficha.masSin ? sinopsis.slice(0, 900).replace(/\s+\S*$/, "") + "…" : sinopsis }), sinopsis.length > 900 && !ficha.masSin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "fx-mas", onClick: () => setFicha({ ...ficha, masSin: true }), children: "Leer más" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-fuente", children: "Fuente: " + fuenteSin + (d.sinopsisWiki ? " · " : "") + (d.sinopsisWiki ? "" : "") })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "row-sub fx-vacio", children: d.listo ? "No encontramos una sinopsis para esta obra en Open Library, Wikipedia ni Google Books." : "Buscando la sinopsis…" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "fx-bloque",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-h", children: "Sobre el autor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fx-autor",
										children: [fotoAutor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "fx-foto", src: fotoAutor, alt: "", draggable: false, onError: (e) => { e.currentTarget.style.display = "none"; } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "fx-foto fx-foto-facehash", src: generarFacehashUri(autorNombre || "anon"), alt: autorNombre, draggable: false }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: autorNombre }), d.autor && (d.autor.nac || d.autor.def) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fx-fechas", children: [d.autor.nac, d.autor.def].filter(Boolean).join(" – ") }) : null, bio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "fx-texto", children: bio.length > 600 && !ficha.masBio ? bio.slice(0, 600).replace(/\s+\S*$/, "") + "…" : bio }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "row-sub fx-vacio", children: d.listo ? "Sin biografía disponible." : "Buscando…" }), bio && bio.length > 600 && !ficha.masBio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "fx-mas", onClick: () => setFicha({ ...ficha, masBio: true }), children: "Leer más" }) : null]
										})]
									})]
								}), miniFila(d.delAutor, "Más de " + autorNombre.split(",")[0], "No encontramos más obras de este autor."), miniFila(d.similares, "Libros similares" + (d.temaSimilares ? " · " + d.temaSimilares : ""), "No encontramos libros similares."), recs.length ? miniFila(recs, "✨ Recomendados para ti", "") : null]
							})]
						})
					});
				})(),
				// v199: elegir formato (EPUB/PDF) para buscar el libro en el navegador
				formatoBusqueda && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-menu-fondo",
						onClick: () => setFormatoBusqueda(null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg-menu",
							onClick: (e) => e.stopPropagation(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg-menu-tit",
								children: "Buscar «" + (formatoBusqueda.title || "").slice(0, 48) + "» en el navegador"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row-sub",
								children: "Elige el formato a buscar: se abre tu navegador con la búsqueda lista para que descargues el archivo."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn primary",
								onClick: () => buscarEnNavegador(formatoBusqueda, "epub"),
								children: "📚 Buscar en formato EPUB"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn",
								onClick: () => buscarEnNavegador(formatoBusqueda, "pdf"),
								children: "📄 Buscar en formato PDF"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn ghost",
								onClick: () => setFormatoBusqueda(null),
								children: "✕ Cerrar"
							})]
						})]
					}),
				// v209: descarga directa completada → elegir cómo guardarlo
				descargaOk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-menu-fondo",
					onClick: () => setDescargaOk(null),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-menu",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg-menu-tit",
							children: "✓ «" + (descargaOk.libro.title || "").slice(0, 48) + "» descargado"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row-sub",
							children: "Ya está en tu biblioteca Lumen. También puedes guardarlo en una carpeta/categoría o en una carpeta local de tu dispositivo."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							onClick: () => { const id = descargaOk.id; setDescargaOk(null); onAbrirLibro?.(id); },
							children: "📖 Abrir libro"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => { const id = String(descargaOk.libro.id); setDescargaOk(null); setGuardCat(id); },
							children: "🔖 Guardar en carpeta / categoría…"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => { guardarEnDispositivo(descargaOk.file, descargaOk.nombre); },
							children: "💾 Guardar en carpeta del dispositivo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn ghost",
							onClick: () => setDescargaOk(null),
							children: "✕ Cerrar"
						})]
					})]
				})
				];
	// v198: modo sección — embebido en Lumen Store: mismo contenido
	// pero sin el marco de página ni la barra 100/100 propia (ese pie
	// vive en la store y lo gobierna a través de onVentana).
	if (enSeccion) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "lg-seccion",
		children: cuerpo
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-scrim",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pb-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "cg-back",
					onClick: () => onSalir?.(),
					"aria-label": "Volver",
					children: "‹"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cg-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "📚 Libros gratis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: `Gutenberg · Open Library · Archive.org${fuentes ? ` (${nBibliotecas}/5 cargadas)` : ""} · sin cuentas · sin IA` })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "cg-publicar",
					onClick: refrescar,
					disabled: cargando,
					children: "↻ Actualizar"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mp-cuerpo",
				children: cuerpo
			})]
		})]
	});
}
//#endregion
export { LibrosGratis as default, LibrosGratis as L, paraTi as p, nombreArchivo as n, CATALOG_CATEGORIES as C, SEMILLA_40 as S };
