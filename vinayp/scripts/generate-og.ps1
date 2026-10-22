# Generates the Open Graph preview card at public/og-image.png (1200x630).
#
#   powershell -ExecutionPolicy Bypass -File scripts/generate-og.ps1
#
# Windows-only helper: it uses GDI+ so the card is rendered with the real
# system typefaces instead of relying on SVG text support in the image
# pipeline. Run it again whenever the palette or copy changes.

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'public\og-image.png'
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $out) | Out-Null

$W = 1200
$H = 630

$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::FromArgb(13, 14, 17))

# ---------------------------------------------------------------- helpers
function New-Font([string]$name, [single]$size, [System.Drawing.FontStyle]$style) {
  return New-Object System.Drawing.Font($name, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}
function New-Brush([int]$a, [int]$r, [int]$gg, [int]$b) {
  return New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($a, $r, $gg, $b))
}
function New-Pen([int]$a, [int]$r, [int]$gg, [int]$b, [single]$w) {
  return New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb($a, $r, $gg, $b), $w)
}
# Draws text with manual letter spacing so the mono eyebrows read as designed.
function Write-Spaced([string]$text, [string]$fontName, [single]$size, [System.Drawing.FontStyle]$style,
                      [System.Drawing.Brush]$brush, [single]$x, [single]$y, [single]$tracking) {
  $f = New-Font $fontName $size $style
  $cx = $x
  foreach ($ch in $text.ToCharArray()) {
    $g.DrawString($ch, $f, $brush, $cx, $y)
    $cx += $g.MeasureString($ch, $f).Width + $tracking
  }
  $f.Dispose()
}

# ------------------------------------------------------------ blueprint grid
$gridPen = New-Pen 12 255 255 255 1
for ($x = 0; $x -le $W; $x += 40) { $g.DrawLine($gridPen, $x, 0, $x, $H) }
for ($y = 0; $y -le $H; $y += 40) { $g.DrawLine($gridPen, 0, $y, $W, $y) }
$gridPen.Dispose()

# ------------------------------------------------------------- corner glow
$glowRect = New-Object System.Drawing.Rectangle(640, 40, 560, 560)
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath.AddEllipse($glowRect)
$glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
$glow.CenterPoint = New-Object System.Drawing.PointF(920, 320)
$glow.CenterColor = [System.Drawing.Color]::FromArgb(56, 106, 139, 255)
$glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 106, 139, 255))
$g.FillEllipse($glow, $glowRect)
$glow.Dispose()
$glowPath.Dispose()

# --------------------------------------------------------------- orbit mark
$cx = 905.0
$cy = 315.0
$ring1 = New-Pen 16 255 255 255 1
$g.DrawEllipse($ring1, $cx - 210, $cy - 210, 420, 420)
$ring2 = New-Pen 46 106 139 255 1.2
$g.DrawEllipse($ring2, $cx - 150, $cy - 150, 300, 300)
$ring3 = New-Pen 30 255 255 255 1
$g.DrawEllipse($ring3, $cx - 92, $cy - 92, 184, 184)
$ring1.Dispose(); $ring2.Dispose(); $ring3.Dispose()

$dash = New-Pen 26 236 234 228 1
$dash.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$g.DrawEllipse($dash, $cx - 262, $cy - 262, 524, 524)
$dash.Dispose()

# faceted core - an icosahedron-like wireframe
$core = New-Pen 120 106 139 255 1.5
$pts = @(
  ,@($cx, ($cy - 74))
  ,@(($cx + 74), ($cy - 22))
  ,@(($cx + 46), ($cy + 58))
  ,@(($cx - 46), ($cy + 58))
  ,@(($cx - 74), ($cy - 22))
  ,@($cx, ($cy + 6))
  ,@(($cx + 30), ($cy - 34))
  ,@(($cx - 30), ($cy - 34))
)
$edges = @(@(0,1),@(1,2),@(2,3),@(3,4),@(4,0),@(0,5),@(1,5),@(2,5),@(3,5),@(4,5),@(6,0),@(6,4),@(6,5),@(7,0),@(7,1),@(7,5))
foreach ($e in $edges) {
  $p1 = $pts[$e[0]]
  $p2 = $pts[$e[1]]
  $g.DrawLine($core, [single]$p1[0], [single]$p1[1], [single]$p2[0], [single]$p2[1])
}
$core.Dispose()

# orbital nodes
$nodeBrush = New-Brush 255 236 234 228
foreach ($ang in @(18, 140, 262)) {
  $rad = $ang * [Math]::PI / 180
  $nx = [single]($cx + [Math]::Cos($rad) * 262)
  $ny = [single]($cy + [Math]::Sin($rad) * 262)
  $g.FillEllipse($nodeBrush, $nx - 4, $ny - 4, 8, 8)
}
$nodeBrush.Dispose()

$dot = New-Brush 255 106 139 255
$g.FillEllipse($dot, $cx - 5, $cy - 5, 10, 10)
$dot.Dispose()

# ------------------------------------------------------------------- copy
$bone = New-Brush 255 236 234 228
$mute = New-Brush 255 147 149 156
$dim = New-Brush 255 99 102 110
$volt = New-Brush 255 106 139 255

$g.FillRectangle($volt, 72, 92, 44, 3)

Write-Spaced 'COMPUTER SCIENCE ENGINEERING STUDENT' 'Consolas' 19 ([System.Drawing.FontStyle]::Regular) $mute 72 118 3.4

$serif = New-Font 'Georgia' 124 ([System.Drawing.FontStyle]::Italic)
$g.DrawString('Vinay.', $serif, $bone, 64, 166)
$serif.Dispose()

$g.FillRectangle($volt, 74, 332, 110, 2)

$sub = New-Font 'Segoe UI Light' 36 ([System.Drawing.FontStyle]::Regular)
$g.DrawString('Building ideas into interactive', $sub, $bone, 72, 362)
$g.DrawString('digital experiences.', $sub, $bone, 72, 408)
$sub.Dispose()

$hair = New-Pen 26 255 255 255 1
$g.DrawLine($hair, 72, 516, 1128, 516)
$hair.Dispose()

Write-Spaced 'RV COLLEGE OF ENGINEERING' 'Consolas' 18 ([System.Drawing.FontStyle]::Regular) $dim 72 542 2.6
Write-Spaced 'BENGALURU, INDIA' 'Consolas' 18 ([System.Drawing.FontStyle]::Regular) $dim 340 542 2.6
Write-Spaced 'SEMESTER 03' 'Consolas' 18 ([System.Drawing.FontStyle]::Regular) $dim 592 542 2.6

$mono = New-Font 'Consolas' 17 ([System.Drawing.FontStyle]::Regular)
$g.DrawString('CSE  ·  RVCE', $mono, $dim, 72, 574)
$g.DrawString('PORTFOLIO', $mono, $dim, 1006, 574)
$mono.Dispose()

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output "wrote $out"

# --------------------------------------------------------- apple touch icon
$icon = New-Object System.Drawing.Bitmap(180, 180)
$ig = [System.Drawing.Graphics]::FromImage($icon)
$ig.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$ig.Clear([System.Drawing.Color]::FromArgb(13, 14, 17))
$ipen = New-Pen 255 236 234 228 15
$ipen.StartCap = [System.Drawing.Drawing2D.LineCap]::Square
$ipen.EndCap = [System.Drawing.Drawing2D.LineCap]::Square
$ig.DrawLines($ipen, @(
  (New-Object System.Drawing.PointF(50, 46)),
  (New-Object System.Drawing.PointF(90, 130)),
  (New-Object System.Drawing.PointF(130, 46))
))
$ipen.Dispose()
$ig.FillRectangle((New-Brush 255 106 139 255), 48, 150, 84, 8)
$iconPath = Join-Path $root 'public\apple-touch-icon.png'
$icon.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$ig.Dispose()
$icon.Dispose()
Write-Output "wrote $iconPath"
