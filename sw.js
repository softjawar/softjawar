const VERSION = "1.00"

const CACHE = "pwamd"

/**
 * Archivos requeridos para que la aplicación funcione fuera de
 * línea.
 */
const ARCHIVOS = [
    "archivos.html",
    "ayuda.html",
    "camara.html",
    "gps.html",
    "index.html"
    "css/dark-hc.css",
    "css/dark-mc.css",
    "css/dark.css",
    "css/estilos.css",
    "css/light-hc.css",
    "css/light-mc.css",
    "css/light.css",
    "img/icono2048.png",
    "img/maskable_icon.png",
    "img/maskable_icon_x128.png",
    "img/maskable_icon_x192.png",
    "img/maskable_icon_x384.png",
    "img/maskable_icon_x48.png",
    "img/maskable_icon_x512.png",
    "img/maskable_icon_x72.png",
    "img/maskable_icon_x96.png",
    "js/configura.js",
    "js/nav-bar.js",
    "js/nav-drw.js",
    "site.webmanifest",
    "/"
]

// Verifica si el código corre dentro de un service worker.
if (self instanceof ServiceWorkerGlobalScope) {
    // Evento al empezar a instalar el servide worker,
    self.addEventListener("install",
        ( /** @type {ExtendableEvent} */ evt) => {
            console.log("El service worker se está instalando.")
            evt.waitUntil(llenaElCache())
        })

    // Evento al solicitar información a la red.
    self.addEventListener("fetch", ( /** @type {FetchEvent} */ evt) => {
        if (evt.request.method === "GET") {
            evt.respondWith(buscaLaRespuestaEnElCache(evt))
        }
    })

    // Evento cuando el service worker se vuelve activo.
    self.addEventListener("activate",
        () => console.log("El service worker está activo."))
}

async function llenaElCache() {
    console.log("Intentando cargar caché:", CACHE)
        // Borra todos los cachés.
    const keys = await caches.keys()
    for (const key of keys) {
        await caches.delete(key)
    }
    // Abre el caché de este service worker.
    const cache = await caches.open(CACHE)
        // Carga el listado de ARCHIVOS.
    await cache.addAll(ARCHIVOS)
    console.log("Cache cargado:", CACHE)
    console.log("Versión:", VERSION)
}

/** @param {FetchEvent} evt */
async function buscaLaRespuestaEnElCache(evt) {
    // Abre el caché.
    const cache = await caches.open(CACHE)
    const request = evt.request
        /* Busca la respuesta a la solicitud en el contenido del caché, sin
         * tomar en cuenta la parte después del símbolo "?" en la URL. */
    const response = await cache.match(request, { ignoreSearch: true })
    if (response === undefined) {
        /* Si no la encuentra, empieza a descargar de la red y devuelve
         * la promesa. */
        return fetch(request)
    } else {
        // Si la encuentra, devuelve la respuesta encontrada en el caché.
        return response
    }
}
