# Invitación de casamiento — Camila & Julián

Landing estática de una sola página con la info del evento. Sin backend, sin
formularios, sin base de datos. Astro + Tailwind + JS vanilla.

## Correr localmente

```bash
npm install
npm run dev      # http://localhost:4321
```

Otros comandos:

```bash
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

Requiere Node 20.3+ (el proyecto está fijado a Astro 5 por eso; Astro 6 pide
Node 22.12+).

## Dónde editar los datos del evento

**Todo** está en un único archivo: [`src/data/evento.js`](src/data/evento.js).

Nombres, fecha, direcciones, horarios, dress code, alias/CBU y el mensaje de
cierre. Todos los valores actuales son **placeholder** y están marcados como
tales con comentarios.

Dos cosas para tener en cuenta:

- **`fechaISO`** tiene que llevar el offset horario (`-03:00` para Argentina).
  Sin él, la cuenta regresiva se calcula en la zona horaria de cada invitado y
  le da mal a cualquiera que esté afuera del país.
- **`mapaQuery`** es lo que se le pasa a Google Maps. No hace falta API key: el
  iframe usa `https://www.google.com/maps?q=...&output=embed`.

Además, antes de desplegar cambiá `site` en
[`astro.config.mjs`](astro.config.mjs) por el dominio real. De ahí sale la URL
absoluta de la imagen de Open Graph (la tarjeta que se ve al compartir por
WhatsApp).

## Imágenes

| Archivo | Qué es | Tamaño sugerido |
|---|---|---|
| `public/images/hero.webp` | Foto de fondo de la portada | ~1080 px de ancho, vertical |
| `public/images/og.jpg` | Preview al compartir el link | 1200 × 630 px |
| `public/favicon.svg` | Ícono de la pestaña | — |

`hero.webp` y `og.jpg` salen del video del save the date (segundos 30.8 y 44.6).
Para cambiarlas por otro cuadro del video:

```bash
FF=$(node -p "require('ffmpeg-static')")

# portada: cualquier segundo, vertical, 1080 de ancho
"$FF" -ss 30.8 -i video.mp4 -vf "hqdn3d=3:2:5:4,scale=1080:-1" \
      -frames:v 1 -c:v libwebp -quality 72 -y public/images/hero.webp

# open graph: recorte apaisado 1200×630 (el 1500 es el desplazamiento vertical)
"$FF" -ss 44.6 -i video.mp4 -vf "crop=2160:1134:0:1500,scale=1200:630" \
      -frames:v 1 -q:v 4 -y public/images/og.jpg
```

El velo oscuro sobre la foto de portada está calibrado para una imagen de tono
medio (`bg-tinta/45` en [`Hero.astro`](src/components/Hero.astro)). Si la foto
real es clara, subilo a `/55` o `/60` para que el texto blanco siga legible.

## Reemplazar los frames de la animación de scroll

La sección `ScrollVideo` no usa un `<video>`: dibuja una secuencia de imágenes
en un `<canvas>` según la posición de scroll. Es la técnica de las páginas de
producto de Apple, y es la que hay que usar acá porque `<video>` +
`currentTime` controlado por scroll parpadea y se traba en iOS Safari — que es
justo donde más se va a ver esta invitación.

Los frames viven en `public/frames/` con el nombre `frame_001.webp` …
`frame_096.webp` (padding de 3 dígitos). Los actuales salen del video del save
the date: **segundos 41 a 49, a 12 fps**.

`ffmpeg` no está instalado en el sistema; el proyecto usa el binario que trae
[`ffmpeg-static`](https://www.npmjs.com/package/ffmpeg-static) como dependencia
de desarrollo. Comando exacto con el que se generaron:

```bash
FF=$(node -p "require('ffmpeg-static')")

rm -f public/frames/*.webp
"$FF" -ss 41 -i video.mp4 \
      -vf "fps=12,hqdn3d=4:3:6:4,scale=810:-1" -frames:v 96 \
      -c:v libwebp -quality 42 public/frames/frame_%03d.webp
```

Qué hace cada parte:

- `-ss 41` / `-frames:v 96` — arranca en el segundo 41 y toma 96 cuadros
  (8 segundos a 12 fps).
- `hqdn3d` — quita grano de película. El grano es ruido aleatorio: sin esto los
  WebP pesan ~30% más sin verse mejor.
- `scale=810:-1` — 810 px de ancho cubre pantallas de celular a 2× de densidad.
- `-quality 42` — comparado a ojo contra 60 y 75, indistinguible a tamaño real.

Si cambiás el tramo o los fps, ajustá `FRAME_COUNT` arriba de
[`src/components/ScrollVideo.astro`](src/components/ScrollVideo.astro) para que
coincida con la cantidad de archivos. Ahí al lado está `SCROLL_VIEWPORTS`, que
controla cuánto scroll dura la animación (3 = tres pantallas de alto). Más alto
= animación más lenta y con más control; más bajo = pasa más rápido.

### Techo de velocidad

El frame que se dibuja **no sigue al scroll uno a uno**. Si lo hiciera, un flick
de dedo en el celular consumiría el clip entero en dos o tres cuadros y no se
vería nada.

En su lugar hay dos posiciones: `targetPos`, que es adónde pide ir el scroll, y
`displayPos`, que es el cuadro que se está mostrando y persigue al primero con
un tope de velocidad. Dos constantes lo gobiernan, arriba del `<script>` de
`ScrollVideo.astro`:

- **`MAX_FPS = 30`** — techo de reproducción en cuadros por segundo. El clip es
  de 12 fps, así que 30 es como mucho 2,5× la velocidad original. Es lo que
  garantiza que el video se vea aunque alguien tire el scroll de un saque.
- **`RESPONSE = 8`** — qué tan pegado al dedo persigue, en 1/segundo. Más alto
  responde más directo, más bajo se siente más pesado.

Ambos usan el delta de tiempo real entre cuadros, no "un paso por cuadro de
rAF": los iPhone nuevos corren a 120 Hz y con un paso fijo el video iría al
doble de velocidad justo ahí.

Medido en Chromium a 390×844:

| Gesto | Cuadros dibujados | Tiempo | Velocidad |
|---|---|---|---|
| Rueda chica (~120 px) | 6 | 245 ms | 24 fps |
| Media pantalla (~420 px) | 23 | 829 ms | 28 fps |
| Sección entera de un saque | 95 | 3,3 s | 29 fps |

O sea: nunca pasa de 30 fps, y un scroll normal igual responde en ~250 ms, así
que no se siente lento.

### Peso

Los 96 frames pesan **4,6 MB** (~49 KB cada uno). Es lo más caro del sitio: el
plano tiene reja, adoquines y follaje, que comprimen mal. El componente no los
baja hasta que la sección se acerca al viewport y muestra un preloader con
porcentaje, así que la portada entra igual de rápido.

Tiempo hasta que el efecto se habilita, medido con throttling de red en
Chromium sobre caché vacía:

| Conexión | Tiempo |
|---|---|
| 4G típico (4 Mbps) | 9,7 s |
| 4G bueno (10 Mbps) | 4,0 s |
| Wi-Fi | inmediato |

Si querés moverlo, subir o bajar los fps es más eficiente que tocar la calidad:
de q42 a q35 se ahorra poco, y el scrub no se ve peor con menos cuadros porque
la velocidad del scroll ya varía sola. Referencias medidas sobre este mismo
tramo:

| Cambio | Frames | Peso | 4G típico |
|---|---|---|---|
| `fps=24` | 192 | 9,1 MB | 19,0 s |
| `fps=18` | 144 | ~6,8 MB | ~14 s |
| `fps=12` (actual) | 96 | 4,6 MB | 9,7 s |
| `fps=12` + `scale=640:-1` | 96 | ~3,2 MB | ~7 s |


## Desplegar

Salida 100% estática, sin configuración de servidor.

**Netlify** — build command `npm run build`, publish directory `dist`.

**Vercel** — detecta Astro solo; si lo pide, mismo par: `npm run build` / `dist`.

También sirve cualquier hosting estático (GitHub Pages, Cloudflare Pages, S3):
subí el contenido de `dist/`.

## Estructura

```
src/
  components/   Hero, ScrollVideo, Countdown, Ceremonia, Fiesta,
                Vestimenta, Regalos, Footer
  data/
    evento.js   ← todos los datos del evento, editar acá
  layouts/
    Layout.astro  <head>, fuentes, Open Graph, fade-in de secciones
  pages/
    index.astro   ordena las secciones
  styles/
    global.css    paleta y tipografías (Tailwind v4: se configura en CSS,
                  no hay tailwind.config.js)
public/
  frames/       secuencia de la animación de scroll
  images/       hero + imagen de Open Graph
```

Solo dos componentes mandan JavaScript al navegador: `Countdown` y
`ScrollVideo`. El resto es HTML y CSS.

Para cambiar la paleta o las tipografías, editá el bloque `@theme` de
[`src/styles/global.css`](src/styles/global.css). Tailwind v4 se configura
desde el CSS.
