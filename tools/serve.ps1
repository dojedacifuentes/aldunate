<#
    serve.ps1 — servidor estático local para Diógenes Lab.

    Sin dependencias: usa System.Net.Sockets.TcpListener directamente, por lo que
    no necesita Node, Python ni permisos de administrador (a diferencia de
    HttpListener, que exige una reserva de URL ACL).

    Uso:
        powershell -ExecutionPolicy Bypass -File tools/serve.ps1
        powershell -ExecutionPolicy Bypass -File tools/serve.ps1 -Port 3000

    Detener con Ctrl+C.
#>

param(
    [int]$Port = 8080,
    [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path $Root).Path

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'text/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.svg'  = 'image/svg+xml'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.webp' = 'image/webp'
    '.avif' = 'image/avif'
    '.gif'  = 'image/gif'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.txt'  = 'text/plain; charset=utf-8'
    '.md'   = 'text/markdown; charset=utf-8'
}

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)
try {
    $listener.Start()
} catch {
    Write-Host "No se pudo abrir el puerto $Port. Prueba con -Port 3000." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "  DIOGENES LAB - servidor estatico" -ForegroundColor Cyan
Write-Host "  raiz : $Root"
Write-Host "  url  : http://localhost:$Port" -ForegroundColor Green
Write-Host "  Ctrl+C para detener."
Write-Host ""

function Send-Response {
    param($Stream, [int]$Code, [string]$Status, [string]$ContentType, [byte[]]$Body)

    $head  = "HTTP/1.1 $Code $Status`r`n"
    $head += "Content-Type: $ContentType`r`n"
    $head += "Content-Length: $($Body.Length)`r`n"
    $head += "Cache-Control: no-store`r`n"
    $head += "Connection: close`r`n`r`n"

    $headBytes = [System.Text.Encoding]::ASCII.GetBytes($head)
    $Stream.Write($headBytes, 0, $headBytes.Length)
    if ($Body.Length -gt 0) { $Stream.Write($Body, 0, $Body.Length) }
    $Stream.Flush()
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $client.ReceiveTimeout = 5000
            $stream = $client.GetStream()

            # Leer la linea de peticion (basta con la primera linea).
            $buffer = New-Object byte[] 8192
            $read = $stream.Read($buffer, 0, $buffer.Length)
            if ($read -le 0) { continue }
            $request = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $read)
            $firstLine = ($request -split "`r`n")[0]
            $parts = $firstLine -split ' '
            if ($parts.Count -lt 2) { continue }

            $rawPath = $parts[1]
            $rawPath = ($rawPath -split '\?')[0]
            $rawPath = [System.Uri]::UnescapeDataString($rawPath)
            if ($rawPath -eq '/') { $rawPath = '/index.html' }

            # Normalizar y bloquear salidas del directorio raiz.
            $relative = $rawPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $full = [System.IO.Path]::GetFullPath((Join-Path $Root $relative))

            if (-not $full.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('403 Forbidden')
                Send-Response $stream 403 'Forbidden' 'text/plain; charset=utf-8' $body
                Write-Host "  403  $rawPath" -ForegroundColor Red
                continue
            }

            if (Test-Path -LiteralPath $full -PathType Container) {
                $full = Join-Path $full 'index.html'
            }

            if (Test-Path -LiteralPath $full -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
                $type = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
                $body = [System.IO.File]::ReadAllBytes($full)
                Send-Response $stream 200 'OK' $type $body
                Write-Host "  200  $rawPath" -ForegroundColor DarkGray
            } else {
                $body = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
                Send-Response $stream 404 'Not Found' 'text/plain; charset=utf-8' $body
                Write-Host "  404  $rawPath" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  err  $($_.Exception.Message)" -ForegroundColor Red
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
    Write-Host ""
    Write-Host "  Servidor detenido." -ForegroundColor Cyan
}
