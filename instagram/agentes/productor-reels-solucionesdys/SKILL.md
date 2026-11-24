---
name: "productor-reels-solucionesdys"
description: "Convierte una grabación de pantalla (sitio de un cliente, demo de Mesonero o del sistema de reservas) o un video a cámara en un reel vertical 1080x1920 con gancho, textos, etiqueta y cierre con el logo DyS. Úsalo cuando el usuario envíe una grabación."
---

# Agente 3 · Productor de reels (Soluciones DyS)

Responde en español de Chile, corto, pensando en que el usuario lee desde el celular. Entrega el video con SendUserFile y una descripción lista para pegar (la redacta el skill guionista-reels-solucionesdys).

## Flujo
1. Copiar la grabación a una carpeta de trabajo (los uploads son de solo lectura). Revisar duración y resolución con ffprobe.
2. Hoja de contactos para ver el contenido: `ffmpeg -i clip.mp4 -vf "fps=1/1.5,scale=200:-1,tile=11x3" -frames:v 1 contacto.png` y mirarla.
3. **Privacidad primero:** descartar cualquier tramo donde aparezcan chats, códigos de verificación, galería de fotos, notificaciones o paneles de administración. Avisar al usuario qué se cortó. Si hay un mensaje de pedido por WhatsApp útil, usar solo un recorte del cuadro de mensaje (nunca el chat completo) y armar con él una tarjeta fija de 3 s.
4. Preparar el clip solo del sitio: quitar audio, recortar la parte superior de la pantalla (barra de estado, URL y pastilla de Safari: `crop=1170:2300:0:232` en grabaciones de iPhone 1170x2532; la altura debe ser par), empezar desde ~0,8 a 3 s para evitar la barra inferior del navegador, acelerar 1,05x a 1,2x y fijar 30 fps:
   `ffmpeg -y -ss 3.0 -t 21.5 -i clip.mp4 -an -vf "crop=1170:2300:0:232,setpts=PTS/1.05,fps=30" -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p prep.mp4`
   Los tiempos de los textos se calculan sobre el clip preparado: (tiempo original - inicio) / velocidad. Si se agrega una tarjeta final (pedido), concatenar con `-f concat -c copy`.
5. Crear un config.json (ver abajo) y ejecutar `python3 make_reel.py prep.mp4 reel.mp4 config.json`. Dependencias: ffmpeg, cairosvg, Pillow, fuente Poppins Bold.
6. Verificar: sacar 5 fotogramas con `ffmpeg -i reel.mp4 -vf "select='eq(n,60)+eq(n,260)+eq(n,500)+eq(n,640)+eq(n,780)',scale=300:-1,tile=5x1" -frames:v 1 check.png` y mirarlos (que no queden restos del navegador, textos cortados ni contenido privado). Duración final esperada 25 a 30 s.
7. Entregar con SendUserFile. Recordar: la música la agrega el usuario desde la biblioteca de Instagram; invitar al cliente como colaborador solo si el reel muestra su trabajo; máximo 3 publicaciones por semana y nunca 2 el mismo día.

## config.json
Las palabras entre asteriscos salen en verde. Cada texto tiene a/e = segundo de inicio y fin sobre el clip preparado.
```
{"tag":"CATÁLOGO + PEDIDO POR WHATSAPP",
 "hook":"¿Vendes productos y crees que necesitas una *tienda* online *gigante*?",
 "caps":[{"text":"Muestras tus *productos*","a":0,"e":6.5},{"text":"Cada uno con su botón de *WhatsApp*","a":6.5,"e":16.5}],
 "cta":"¿Quieres uno para tu *negocio*?",
 "cta2":"Cotiza en el link de mi perfil",
 "client":"Cliente: @[usuario del cliente]"}
```
En demos propias (Mesonero, reservas) sin cliente real, usar "client":"Demo · Soluciones DyS" y nunca una etiqueta de cliente inventada. El gancho debe verse en los primeros 2 s: si la intro negra lo retrasa, acortarla.

Estructura del video: intro negra de 3,5 s con el gancho, cuerpo con la grabación centrada, texto superior que cambia y etiqueta del cliente abajo, cierre de 4,5 s con el logo DyS y la llamada a la acción.

## make_reel.py
```python
import sys, io, json, os, subprocess
import cairosvg
from PIL import Image, ImageDraw, ImageFont
W, H = 1080, 1920
G, I, B, Y = (52, 211, 153), (246, 241, 231), (76, 154, 255), (255, 214, 10)
FONT = '/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf'
LOGO = '''<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024' width='1024' height='1024'><rect width='1024' height='1024' fill='#000'/><g transform='translate(512 512) scale(1.1) translate(-512 -512) translate(-89.5 -25)' fill='none' stroke-width='46' stroke-linecap='round' stroke-linejoin='round'><path d='M262 380 V650 H335 A135 135 0 0 0 335 380 Z' stroke='#34D399'/><path d='M545 500 L603 640 M661 500 L573 722' stroke='#F6F1E7'/><path d='M860 430 C830 380 740 385 735 440 C730 500 860 510 865 585 C870 650 770 665 735 610' stroke='#4C9AFF'/><circle cx='930' cy='639' r='34' fill='#FFD60A' stroke='none'/></g></svg>'''


def F(s):
    return ImageFont.truetype(FONT, s)


def R(s):
    out = []
    for i, part in enumerate(s.split('*')):
        toks = part.split()
        if i > 0 and i % 2 == 0 and toks and not part[0].isspace() and out:
            out[-1] = (out[-1][0] + toks[0], out[-1][1])
            toks = toks[1:]
        for w in toks:
            out.append((w, G if i % 2 else I))
    return out


def wrap(d, runs, font, maxw):
    lines, w = [[]], 0
    for word, col in runs:
        ww = d.textlength(word + ' ', font=font)
        if w + ww > maxw and lines[-1]:
            lines.append([])
            w = 0
        lines[-1].append((word, col))
        w += ww
    return lines


def draw_runs(d, runs, font, cx, y, maxw, lh):
    for ln in wrap(d, runs, font, maxw):
        tw = sum(d.textlength(w + ' ', font=font) for w, _ in ln)
        x = cx - tw / 2
        for w, c in ln:
            d.text((x, y), w, font=font, fill=c)
            x += d.textlength(w + ' ', font=font)
        y += lh


def overlay(path, runs, y=170, size=76):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    f = F(size)
    n = len(wrap(d, runs, f, W - 160))
    d.rounded_rectangle((50, y - 25, W - 50, y - 25 + n * int(size * 1.25) + 50), 40, fill=(0, 0, 0, 215))
    draw_runs(d, runs, f, W // 2, y, W - 160, int(size * 1.25))
    im.save(path)


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def build(clip, out, cfg):
    T = os.path.join(os.path.dirname(os.path.abspath(out)), '_reel_tmp')
    os.makedirs(T, exist_ok=True)
    im = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(im)
    d.text((W // 2, 330), cfg['tag'], font=F(46), fill=B, anchor='mm')
    d.rounded_rectangle((90, 380, W - 90, 386), 3, fill=G)
    draw_runs(d, R(cfg['hook']), F(96), W // 2, 520, W - 180, 128)
    d.ellipse((W // 2 - 24, 1500, W // 2 + 24, 1548), fill=Y)
    im.save(T + '/intro.png')
    logo = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=LOGO.encode(), output_width=560, output_height=560))).convert('RGB')
    im = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(im)
    im.paste(logo, (W // 2 - 280, 330))
    draw_runs(d, R(cfg['cta']), F(88), W // 2, 1000, W - 160, 118)
    d.text((W // 2, 1420), cfg['cta2'], font=F(52), fill=I, anchor='mm')
    d.text((W // 2, 1560), cfg['client'], font=F(46), fill=G, anchor='mm')
    im.save(T + '/outro.png')
    caps = cfg['caps']
    for i, c in enumerate(caps):
        overlay(T + '/cap%d.png' % i, R(c['text']))
    lab = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(lab).text((W // 2, 1850), cfg['client'], font=F(44), fill=G, anchor='mm')
    lab.save(T + '/label.png')
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clip]).decode())
    n = len(caps)
    common = ['-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p']
    for png, t, name in (('intro', 3.5, 'intro'), ('outro', 4.5, 'outro')):
        run(['ffmpeg', '-y', '-loop', '1', '-t', str(t), '-i', T + '/' + png + '.png', '-f', 'lavfi', '-t', str(t),
             '-i', 'anullsrc=r=44100:cl=stereo', '-vf', 'fade=in:0:8', '-shortest'] + common + ['-c:a', 'aac', T + '/' + name + '.mp4'])
    inputs = ['-t', str(dur), '-i', clip]
    for i in range(n):
        inputs += ['-i', T + '/cap%d.png' % i]
    inputs += ['-i', T + '/label.png']
    fc = '[0:v]scale=-2:1380,pad=%d:%d:(ow-iw)/2:410:black[b];' % (W, H)
    last = 'b'
    for i, c in enumerate(caps):
        fc += "[%s][%d:v]overlay=0:0:enable='between(t,%.2f,%.2f)'[o%d];" % (last, i + 1, c['a'], c['e'], i)
        last = 'o%d' % i
    fc += '[%s][%d:v]overlay=0:0[v]' % (last, n + 1)
    run(['ffmpeg', '-y'] + inputs + ['-f', 'lavfi', '-t', str(dur), '-i', 'anullsrc=r=44100:cl=stereo', '-filter_complex', fc,
         '-map', '[v]', '-map', '%d:a' % (n + 2), '-shortest'] + common + ['-c:a', 'aac', T + '/body.mp4'])
    open(T + '/list.txt', 'w').write(''.join("file '%s/%s.mp4'\n" % (T, x) for x in ('intro', 'body', 'outro')))
    run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', T + '/list.txt', '-c', 'copy', out])
    print('ok', out)


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2], json.load(open(sys.argv[3])))
```

## Historial
- 27-oct-2026: reels de Dogtoralia (@dogtoraliavet) y Caroline Magic (@carolinemagic.cl) producidos y publicados.
- Pendientes: Cabañas del sur (grabar con datos de ejemplo) y Estribor Consultores. Rincón del Aromo queda fuera por cierre en diciembre.