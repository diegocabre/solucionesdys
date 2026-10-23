# Aviso diario de farmacia de turno, disparado desde el PC de Diego.
#
# El Cloudflare del MINSAL bloquea a Vercel y a GitHub Actions (403), pero no a una IP
# residencial. Este script descarga la respuesta del MINSAL y se la entrega al sitio, que la
# valida, la guarda en cache y envia los avisos (POST /api/cron/aviso-farmacias).
#
# Lo ejecuta la tarea programada "SolucionesDyS - Aviso farmacias" (scripts/registrar-tarea-aviso.ps1).
# Lee CRON_SECRET de .env.local. Deja un registro en %LOCALAPPDATA%\solucionesdys\aviso-farmacias.log.
# Sale con codigo 1 si hay que reintentar (la tarea reintenta cada 30 min, hasta 4 veces).

$ErrorActionPreference = 'Stop'
$MinsalUrl = 'https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php'
$SitioUrl = 'https://www.solucionesdys.cl/api/cron/aviso-farmacias'

$dir = Join-Path $env:LOCALAPPDATA 'solucionesdys'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$log = Join-Path $dir 'aviso-farmacias.log'
function Log([string]$msg) { Add-Content -Path $log -Value ("{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg) }

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

try {
  $envFile = Join-Path $PSScriptRoot '..\.env.local'
  $linea = Get-Content $envFile | Where-Object { $_ -match '^CRON_SECRET=' } | Select-Object -First 1
  $secret = if ($linea) { $linea.Substring('CRON_SECRET='.Length).Trim() } else { '' }
  if (-not $secret) { throw "Falta CRON_SECRET en $envFile" }

  $tmp = Join-Path $dir 'minsal.json'
  Invoke-WebRequest -Uri $MinsalUrl -UseBasicParsing -TimeoutSec 60 -OutFile $tmp `
    -Headers @{ Accept = 'application/json' } -UserAgent 'SolucionesDyS/1.0 (+https://www.solucionesdys.cl)'

  $r = Invoke-RestMethod -Uri $SitioUrl -Method Post -InFile $tmp -TimeoutSec 280 `
    -ContentType 'application/json; charset=utf-8' -Headers @{ Authorization = "Bearer $secret" }
  Remove-Item $tmp -ErrorAction SilentlyContinue

  Log ("turno {0}: enviados={1} fallidos={2} motivo={3}" -f $r.fecha, $r.enviados, $r.fallidos, $r.motivo)
  # El MINSAL aun no publica el turno de hoy: reintentar mas tarde.
  if ($r.motivo -eq 'sin-turno-publicado') { exit 1 }
  exit 0
} catch {
  Log ("ERROR: {0}" -f $_.Exception.Message)
  exit 1
}
