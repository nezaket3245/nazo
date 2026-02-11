Add-Type -AssemblyName System.Drawing

$bp = "c:\Users\ibo\Desktop\12\egepenakcayapi.com\wp-content\uploads\2022\05"

# Crop big1 (1200x800) to portrait 540x720 (ratio 3:4)
# From 1200x800: target ratio 3:4 -> height 800, width = 800*3/4 = 600
# Center crop: x = (1200-600)/2 = 300, y = 0, w = 600, h = 800
$src = [System.Drawing.Image]::FromFile("$bp\kedi-sineklik-big1.jpg")
$cropRect = New-Object System.Drawing.Rectangle(300, 0, 600, 800)
$dest = New-Object System.Drawing.Bitmap(540, 720)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, 540, 720)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90L)
$dest.Save("$bp\kedi-sineklik.jpg", $jpegCodec, $encoderParams)
$dest.Dispose()
$src.Dispose()

# Also process big3 as second option  
$src2 = [System.Drawing.Image]::FromFile("$bp\kedi-sineklik-big3.jpg")
$cropRect2 = New-Object System.Drawing.Rectangle(300, 0, 600, 800)
$dest2 = New-Object System.Drawing.Bitmap(540, 720)
$g2 = [System.Drawing.Graphics]::FromImage($dest2)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.DrawImage($src2, (New-Object System.Drawing.Rectangle(0, 0, 540, 720)), $cropRect2, [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$dest2.Save("$bp\kedi-sineklik-2.jpg", $jpegCodec, $encoderParams)
$dest2.Dispose()
$src2.Dispose()

Write-Host "Done! kedi-sineklik.jpg and kedi-sineklik-2.jpg created"
