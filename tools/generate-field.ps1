<#
    generate-field.ps1 — genera el "Parametric Knowledge Field" del hero.

    Produce tres SVG estáticos (assets/img/field-back|mid|front.svg) que son las
    capas de relieve del hero (Layer 02 en INTERACTION-SYSTEM.md).

    QUÉ DIBUJA
    ----------
    Curvas de nivel reales de un campo escalar suave, extraídas con marching
    squares. No son ondas decorativas: son isolíneas de una superficie
    matemática, que es exactamente lo que pide el brief (cartografía /
    topografía / superficies matemáticas, sin representar ninguna literalmente).

    El campo es una suma de gaussianas desplazadas hacia la derecha del lienzo
    (para que el texto del hero, a la izquierda, quede sobre zona tranquila),
    más dos ondas de baja frecuencia y una inclinación vertical.

    Los niveles se reparten en tres profundidades:
        back  = niveles exteriores  → curvas amplias, tenues
        mid   = niveles intermedios
        front = niveles interiores  → lazos cerrados junto a los máximos

    Esto hace que el paralaje sea correcto por construcción: lo que está "más
    alto" en el relieve es lo que más se desplaza.

    POR QUÉ UN GENERADOR Y NO SVG A MANO
    ------------------------------------
    Trazabilidad. La gráfica es reproducible y ajustable desde parámetros con
    nombre en vez de ser un blob de paths opaco. Cambiar la composición es
    mover un centro, no redibujar.

    USO
        powershell -ExecutionPolicy Bypass -File tools/generate-field.ps1

    Sólo hay que volver a ejecutarlo si se cambian los parámetros de abajo.
    Los SVG generados están versionados en git, así que el sitio no depende de
    este script para funcionar.
#>

param(
    [string]$OutDir
)

$ErrorActionPreference = 'Stop'
if (-not $OutDir) { $OutDir = Join-Path (Split-Path -Parent $PSScriptRoot) 'assets\img' }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# =============================================================================
# PARÁMETROS DE COMPOSICIÓN
# =============================================================================

$W  = 1600.0
$H  = 900.0
$NX = 128           # celdas en X  (paso = 12.5px)
$NY = 72            # celdas en Y  (paso = 12.5px)

$LEVELS      = 26   # número total de curvas de nivel
$LEVEL_LO    = 0.045
$LEVEL_HI    = 0.965

$SPLIT_BACK  = 11   # niveles 0..10  -> back
$SPLIT_MID   = 20   # niveles 11..19 -> mid ; 20..25 -> front

$RDP_EPS     = 1.4  # simplificación (px). Sube para archivos más ligeros.

# Centros del campo. x,y en el espacio 1600x900.
#   a  = amplitud   s = dispersión (sigma)   ay = anisotropía vertical
$CENTERS = @(
    @{ x = 1120.0; y = 430.0; a = 1.00; s = 250.0; ay = 1.15 },
    @{ x = 1382.0; y = 706.0; a = 0.72; s = 190.0; ay = 0.95 },
    @{ x =  866.0; y = 248.0; a = 0.46; s = 212.0; ay = 1.20 },
    @{ x = 1524.0; y = 196.0; a = 0.38; s = 158.0; ay = 1.00 },
    @{ x =  706.0; y = 782.0; a = 0.30; s = 232.0; ay = 1.00 }
)

# Apariencia por capa
$STYLE = @{
    back  = @{ stroke = '#8ea6ae'; width = 1.0;  o0 = 0.30; o1 = 0.50 }
    mid   = @{ stroke = '#9db4ba'; width = 1.0;  o0 = 0.45; o1 = 0.72 }
    front = @{ stroke = '#b6d0cf'; width = 1.15; o0 = 0.62; o1 = 1.00 }
}

$stepX = $W / $NX
$stepY = $H / $NY

# =============================================================================
# CAMPO ESCALAR
# =============================================================================

Write-Host "  evaluando campo escalar ($($NX+1)x$($NY+1)) ..." -ForegroundColor DarkGray

$grid = New-Object 'double[,]' ($NX + 1), ($NY + 1)
$min = [double]::MaxValue
$max = [double]::MinValue

for ($j = 0; $j -le $NY; $j++) {
    $y = $j * $stepY
    for ($i = 0; $i -le $NX; $i++) {
        $x = $i * $stepX
        $v = 0.0
        foreach ($c in $CENTERS) {
            $dx = $x - $c.x
            $dy = ($y - $c.y) * $c.ay
            $v += $c.a * [Math]::Exp( -(($dx * $dx) + ($dy * $dy)) / (2.0 * $c.s * $c.s) )
        }
        $v += 0.16 * [Math]::Sin($x * 0.0042 + $y * 0.0027)
        $v += 0.09 * [Math]::Sin($x * 0.0091 - $y * 0.0063 + 1.7)
        $v -= 0.30 * ($y / $H)

        $grid[$i, $j] = $v
        if ($v -lt $min) { $min = $v }
        if ($v -gt $max) { $max = $v }
    }
}

# Normalizar a 0..1
$span = $max - $min
Write-Host ("  campo: min={0:F4} max={1:F4} span={2:F4}" -f $min, $max, $span) -ForegroundColor DarkGray
for ($j = 0; $j -le $NY; $j++) {
    for ($i = 0; $i -le $NX; $i++) {
        $grid[$i, $j] = ($grid[$i, $j] - $min) / $span
    }
}

# =============================================================================
# MARCHING SQUARES
# =============================================================================

# Tabla de casos: bits 1=TL 2=TR 4=BR 8=BL. Cada entrada es una lista de pares
# de aristas (T=top, R=right, B=bottom, L=left).
$CASES = @{
     0 = @()
     1 = @(,@('L','T'))
     2 = @(,@('T','R'))
     3 = @(,@('L','R'))
     4 = @(,@('R','B'))
     5 = @(@('L','T'), @('R','B'))
     6 = @(,@('T','B'))
     7 = @(,@('L','B'))
     8 = @(,@('B','L'))
     9 = @(,@('T','B'))
    10 = @(@('T','R'), @('B','L'))
    11 = @(,@('R','B'))
    12 = @(,@('L','R'))
    13 = @(,@('T','R'))
    14 = @(,@('L','T'))
    15 = @()
}

function Get-Crossing {
    param([double]$va, [double]$vb, [double]$level)
    $d = $vb - $va
    if ([Math]::Abs($d) -lt 1e-12) { return 0.5 }
    $t = ($level - $va) / $d
    if ($t -lt 0.0) { return 0.0 }
    if ($t -gt 1.0) { return 1.0 }
    return $t
}

function Get-Segments {
    param([double]$level)

    $segs = New-Object System.Collections.ArrayList

    for ($j = 0; $j -lt $NY; $j++) {
        $y0 = $j * $stepY
        $y1 = $y0 + $stepY
        for ($i = 0; $i -lt $NX; $i++) {
            $v0 = $grid[$i, $j]           # TL
            $v1 = $grid[($i + 1), $j]     # TR
            $v2 = $grid[($i + 1), ($j + 1)] # BR
            $v3 = $grid[$i, ($j + 1)]     # BL

            $idx = 0
            if ($v0 -gt $level) { $idx = $idx -bor 1 }
            if ($v1 -gt $level) { $idx = $idx -bor 2 }
            if ($v2 -gt $level) { $idx = $idx -bor 4 }
            if ($v3 -gt $level) { $idx = $idx -bor 8 }

            if ($idx -eq 0 -or $idx -eq 15) { continue }

            $x0 = $i * $stepX
            $x1 = $x0 + $stepX

            # Nota: en PowerShell el operador coma liga MÁS fuerte que la
            # aritmética, así que @($a + $b * $c, $d) se parsea como
            # @($a + $b * ($c, $d)). Se calcula cada coordenada aparte.
            $ptTx = $x0 + $stepX * (Get-Crossing $v0 $v1 $level)
            $ptRy = $y0 + $stepY * (Get-Crossing $v1 $v2 $level)
            $ptBx = $x0 + $stepX * (Get-Crossing $v3 $v2 $level)
            $ptLy = $y0 + $stepY * (Get-Crossing $v0 $v3 $level)

            $pt = @{}
            $pt['T'] = @($ptTx, $y0)
            $pt['R'] = @($x1,   $ptRy)
            $pt['B'] = @($ptBx, $y1)
            $pt['L'] = @($x0,   $ptLy)

            foreach ($pair in $CASES[$idx]) {
                $a = $pt[$pair[0]]
                $b = $pt[$pair[1]]
                [void]$segs.Add(@($a[0], $a[1], $b[0], $b[1]))
            }
        }
    }
    return ,$segs
}

# =============================================================================
# UNIÓN DE SEGMENTOS EN POLILÍNEAS
# =============================================================================

function Join-Segments {
    param([System.Collections.ArrayList]$segs)

    $n = $segs.Count
    if ($n -eq 0) { return @() }

    $keyOf = { param($x, $y) ('{0:F3},{1:F3}' -f $x, $y) }

    # punto -> índices de segmentos incidentes
    $index = New-Object 'System.Collections.Generic.Dictionary[string, System.Collections.Generic.List[int]]'
    for ($i = 0; $i -lt $n; $i++) {
        $s = $segs[$i]
        foreach ($k in @((& $keyOf $s[0] $s[1]), (& $keyOf $s[2] $s[3]))) {
            if (-not $index.ContainsKey($k)) {
                $index[$k] = New-Object 'System.Collections.Generic.List[int]'
            }
            $index[$k].Add($i)
        }
    }

    $used = New-Object 'bool[]' $n
    $polys = New-Object System.Collections.ArrayList

    # Devuelve el otro extremo del segmento respecto de la clave dada.
    $other = {
        param($seg, $k)
        if ((& $keyOf $seg[0] $seg[1]) -eq $k) { return @($seg[2], $seg[3]) }
        return @($seg[0], $seg[1])
    }

    for ($i = 0; $i -lt $n; $i++) {
        if ($used[$i]) { continue }
        $used[$i] = $true
        $s = $segs[$i]

        $pts = New-Object System.Collections.ArrayList
        [void]$pts.Add(@($s[0], $s[1]))
        [void]$pts.Add(@($s[2], $s[3]))

        # extender hacia adelante
        while ($true) {
            $tail = $pts[$pts.Count - 1]
            $k = & $keyOf $tail[0] $tail[1]
            if (-not $index.ContainsKey($k)) { break }
            $next = -1
            foreach ($cand in $index[$k]) { if (-not $used[$cand]) { $next = $cand; break } }
            if ($next -lt 0) { break }
            $used[$next] = $true
            [void]$pts.Add((& $other $segs[$next] $k))
        }

        # extender hacia atrás
        while ($true) {
            $head = $pts[0]
            $k = & $keyOf $head[0] $head[1]
            if (-not $index.ContainsKey($k)) { break }
            $prev = -1
            foreach ($cand in $index[$k]) { if (-not $used[$cand]) { $prev = $cand; break } }
            if ($prev -lt 0) { break }
            $used[$prev] = $true
            $pts.Insert(0, (& $other $segs[$prev] $k))
        }

        if ($pts.Count -ge 3) { [void]$polys.Add($pts) }
    }

    return ,$polys
}

# =============================================================================
# SIMPLIFICACIÓN (Ramer–Douglas–Peucker, iterativo)
# =============================================================================

function Get-Simplified {
    param([System.Collections.ArrayList]$pts, [double]$eps)

    $n = $pts.Count
    if ($n -lt 3) { return ,$pts }

    $last = $n - 1
    $keep = New-Object 'bool[]' $n
    $keep[0] = $true
    $keep[$last] = $true

    $stack = New-Object System.Collections.Stack
    $stack.Push(@(0, $last))

    while ($stack.Count -gt 0) {
        $range = $stack.Pop()
        $a = $range[0]; $b = $range[1]
        if ($b -le $a + 1) { continue }

        $pa = $pts[$a]; $pb = $pts[$b]
        $dx = $pb[0] - $pa[0]
        $dy = $pb[1] - $pa[1]
        $len = [Math]::Sqrt($dx * $dx + $dy * $dy)

        $bestD = -1.0
        $bestI = -1
        for ($i = $a + 1; $i -lt $b; $i++) {
            $p = $pts[$i]
            if ($len -lt 1e-9) {
                $ex = $p[0] - $pa[0]; $ey = $p[1] - $pa[1]
                $d = [Math]::Sqrt($ex * $ex + $ey * $ey)
            } else {
                $d = [Math]::Abs($dy * $p[0] - $dx * $p[1] + $pb[0] * $pa[1] - $pb[1] * $pa[0]) / $len
            }
            if ($d -gt $bestD) { $bestD = $d; $bestI = $i }
        }

        if ($bestD -gt $eps) {
            $keep[$bestI] = $true
            $stack.Push(@($a, $bestI))
            $stack.Push(@($bestI, $b))
        }
    }

    $out = New-Object System.Collections.ArrayList
    for ($i = 0; $i -lt $n; $i++) { if ($keep[$i]) { [void]$out.Add($pts[$i]) } }
    return ,$out
}

# =============================================================================
# POLILÍNEA -> PATH SUAVIZADO
# Cuadráticas por punto medio: suaviza las facetas del grid sin añadir puntos.
# =============================================================================

function Get-PathData {
    param([System.Collections.ArrayList]$pts)

    $n = $pts.Count
    if ($n -lt 2) { return $null }

    $sb = New-Object System.Text.StringBuilder
    $f = [System.Globalization.CultureInfo]::InvariantCulture

    [void]$sb.Append('M' + $pts[0][0].ToString('0.##', $f) + ' ' + $pts[0][1].ToString('0.##', $f))

    if ($n -eq 2) {
        [void]$sb.Append('L' + $pts[1][0].ToString('0.##', $f) + ' ' + $pts[1][1].ToString('0.##', $f))
        return $sb.ToString()
    }

    for ($i = 1; $i -lt $n - 1; $i++) {
        $c  = $pts[$i]
        $nx2 = ($c[0] + $pts[$i + 1][0]) / 2.0
        $ny2 = ($c[1] + $pts[$i + 1][1]) / 2.0
        [void]$sb.Append('Q' + $c[0].ToString('0.##', $f) + ' ' + $c[1].ToString('0.##', $f) +
                         ' ' + $nx2.ToString('0.##', $f) + ' ' + $ny2.ToString('0.##', $f))
    }
    [void]$sb.Append('L' + $pts[$n - 1][0].ToString('0.##', $f) + ' ' + $pts[$n - 1][1].ToString('0.##', $f))

    return $sb.ToString()
}

# =============================================================================
# GENERAR
# =============================================================================

$layers = @{ back = @(); mid = @(); front = @() }
$frontPolys = New-Object System.Collections.ArrayList

for ($L = 0; $L -lt $LEVELS; $L++) {
    $level = $LEVEL_LO + ($LEVEL_HI - $LEVEL_LO) * ($L / [double]($LEVELS - 1))

    $which = if ($L -lt $SPLIT_BACK) { 'back' } elseif ($L -lt $SPLIT_MID) { 'mid' } else { 'front' }

    $segs  = Get-Segments $level
    $polys = Join-Segments $segs

    $paths = New-Object System.Collections.ArrayList
    foreach ($p in $polys) {
        $simple = Get-Simplified $p $RDP_EPS
        if ($simple.Count -lt 3) { continue }
        $d = Get-PathData $simple
        if ($d) { [void]$paths.Add($d) }
        if ($which -eq 'front') { [void]$frontPolys.Add($simple) }
    }

    if ($paths.Count -gt 0) {
        $layers[$which] += ,@{ level = $L; paths = $paths }
    }
    Write-Host ("    nivel {0,2}  {1,-5}  {2,3} curvas" -f $L, $which, $paths.Count) -ForegroundColor DarkGray
}

# --- Nodos: puntos de conexión sobre las curvas más internas -----------------
$nodes = New-Object System.Collections.ArrayList
$stride = 0
foreach ($p in $frontPolys) {
    for ($i = 2; $i -lt $p.Count - 2; $i += 5) {
        $stride++
        if ($stride % 7 -ne 0) { continue }
        [void]$nodes.Add($p[$i])
        if ($nodes.Count -ge 46) { break }
    }
    if ($nodes.Count -ge 46) { break }
}

# =============================================================================
# ESCRIBIR SVG
# =============================================================================

function Write-Layer {
    param([string]$name, [array]$groups, [bool]$withNodes = $false)

    $st = $STYLE[$name]
    $f  = [System.Globalization.CultureInfo]::InvariantCulture
    $sb = New-Object System.Text.StringBuilder

    [void]$sb.AppendLine('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" fill="none" role="presentation">')
    [void]$sb.AppendLine("<g stroke=""$($st.stroke)"" stroke-width=""$($st.width)"" stroke-linecap=""round"" stroke-linejoin=""round"" vector-effect=""non-scaling-stroke"">")

    $count = [Math]::Max($groups.Count, 1)
    for ($g = 0; $g -lt $groups.Count; $g++) {
        # las curvas más internas de la capa son ligeramente más presentes
        $t = if ($count -eq 1) { 1.0 } else { $g / [double]($count - 1) }
        $op = $st.o0 + ($st.o1 - $st.o0) * $t
        [void]$sb.AppendLine("<g opacity=""$($op.ToString('0.###', $f))"">")
        foreach ($d in $groups[$g].paths) {
            [void]$sb.AppendLine("<path d=""$d""/>")
        }
        [void]$sb.AppendLine('</g>')
    }
    [void]$sb.AppendLine('</g>')

    if ($withNodes -and $nodes.Count -gt 0) {
        [void]$sb.AppendLine('<g fill="#cfe6e3" stroke="none" opacity="0.85">')
        foreach ($nd in $nodes) {
            [void]$sb.AppendLine("<circle cx=""$($nd[0].ToString('0.#', $f))"" cy=""$($nd[1].ToString('0.#', $f))"" r=""1.5""/>")
        }
        [void]$sb.AppendLine('</g>')
    }

    [void]$sb.AppendLine('</svg>')

    $path = Join-Path $OutDir "field-$name.svg"
    [System.IO.File]::WriteAllText($path, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
    $kb = [Math]::Round((Get-Item $path).Length / 1024.0, 1)
    Write-Host ("  escrito  field-{0,-5}.svg  {1,6} KB" -f $name, $kb) -ForegroundColor Green
}

Write-Host ""
Write-Layer 'back'  $layers.back
Write-Layer 'mid'   $layers.mid
Write-Layer 'front' $layers.front $true
Write-Host ""
Write-Host "  listo." -ForegroundColor Cyan
