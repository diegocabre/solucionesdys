# Registra (o actualiza) la tarea programada de Windows que corre scripts/aviso-farmacias.ps1
# todos los dias a las 09:30, despues del cambio de turno de las 09:00.
#
# - StartWhenAvailable: si el PC estaba apagado a esa hora, corre apenas se encienda.
# - Si falla (MINSAL caido, turno aun no publicado), reintenta cada 30 min hasta 4 veces.
# - Corre con tu usuario solo cuando tienes la sesion iniciada (no pide contrasena).
#
# Uso:  powershell -ExecutionPolicy Bypass -File scripts\registrar-tarea-aviso.ps1

$nombre = 'SolucionesDyS - Aviso farmacias'
$script = Join-Path $PSScriptRoot 'aviso-farmacias.ps1'

$accion = New-ScheduledTaskAction -Execute 'powershell.exe' `
  -Argument "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$script`""
$cuando = New-ScheduledTaskTrigger -Daily -At '09:30'
$ajustes = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 4 -RestartInterval (New-TimeSpan -Minutes 30) `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 10) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName $nombre -Action $accion -Trigger $cuando -Settings $ajustes `
  -Description 'Descarga las farmacias de turno del MINSAL y dispara el aviso diario de solucionesdys.cl' -Force | Out-Null

Get-ScheduledTask -TaskName $nombre | Select-Object TaskName, State
