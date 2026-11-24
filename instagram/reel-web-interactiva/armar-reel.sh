#!/bin/sh
# Arma reel.mp4 (1080x1920) a partir de prep/*.mp4 y capas/*.png.
# Estructura del skill productor-reels: intro 3,5 s, cuerpo con la grabación centrada
# (alto 1380, y=410) y títulos arriba, cierre 4,5 s. Sin música: se agrega en Instagram.
set -e
cd "$(dirname "$0")"
V=1.15  # velocidad de las grabaciones
T=_tmp; mkdir -p $T
calc() { awk "BEGIN{printf \"%.3f\", $1}"; }
COMUN="-r 30 -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p"

# Duraciones de cada demo ya aceleradas (el cotizador se corta 0,6 s antes: al final asoma la sección siguiente).
d1=$(ffprobe -v error -show_entries format=duration -of csv=p=0 prep/1-cotizador.mp4)
dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
t1=$(calc "($d1 - 0.6) / $V"); t2=$(calc "$(dur prep/2-mesonero.mp4) / $V")
t3=$(calc "$(dur prep/3-cabanas.mp4) / $V"); t4=$(calc "$(dur prep/4-agente.mp4) / $V")
a1=$t1; a2=$(calc "$a1 + $t2"); a3=$(calc "$a2 + $t3"); total=$(calc "$a3 + $t4")

ffmpeg -v error -y -i prep/1-cotizador.mp4 -i prep/2-mesonero.mp4 -i prep/3-cabanas.mp4 -i prep/4-agente.mp4 \
  -i capas/cap0.png -i capas/cap1.png -i capas/cap2.png -i capas/cap3.png -i capas/label.png \
  -f lavfi -t "$total" -i anullsrc=r=44100:cl=stereo -filter_complex "
  [0:v]trim=0:$(calc "$d1 - 0.6"),setpts=(PTS-STARTPTS)/$V[c1];
  [1:v]setpts=PTS/$V[c2];[2:v]setpts=PTS/$V[c3];[3:v]setpts=PTS/$V[c4];
  [c1][c2][c3][c4]concat=n=4:v=1:a=0,scale=-2:1380,pad=1080:1920:(ow-iw)/2:410:black[b];
  [b][4:v]overlay=0:0:enable='between(t,0,$a1)'[o0];
  [o0][5:v]overlay=0:0:enable='between(t,$a1,$a2)'[o1];
  [o1][6:v]overlay=0:0:enable='between(t,$a2,$a3)'[o2];
  [o2][7:v]overlay=0:0:enable='between(t,$a3,$total)'[o3];
  [o3][8:v]overlay=0:0[v]" -map "[v]" -map 9:a -shortest $COMUN -c:a aac $T/body.mp4

for x in intro:3.5 outro:4.5; do n=${x%%:*}; s=${x##*:}
  ffmpeg -v error -y -loop 1 -t $s -i capas/$n.png -f lavfi -t $s -i anullsrc=r=44100:cl=stereo \
    -vf "format=yuv420p,fade=in:0:8" -shortest $COMUN -c:a aac $T/$n.mp4
done
# Rutas relativas a la lista: ffmpeg de Windows no entiende las rutas /e/... de Git Bash.
printf "file 'intro.mp4'\nfile 'body.mp4'\nfile 'outro.mp4'\n" > $T/lista.txt
ffmpeg -v error -y -f concat -safe 0 -i $T/lista.txt -c copy reel.mp4
rm -rf $T
ffprobe -v error -show_entries format=duration:stream=width,height -of csv=p=0 reel.mp4
