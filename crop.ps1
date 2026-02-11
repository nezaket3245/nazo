Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile("c:\Users\ibo\Desktop\12\egepenakcayapi.com\wp-content\uploads\2022\05\sineklik-wm1.jpg")
$cropRect = New-Object System.Drawing.Rectangle(357, 0, 918, 1224)
$dest = New-Object System.Drawing.Bitmap(540, 720)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, 540, 720)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90L)
$dest.Save("c:\Users\ibo\Desktop\12\egepenakcayapi.com\wp-content\uploads\2022\05\sineklik-crop1.jpg", $jpegCodec, $encoderParams)
$dest.Dispose()
$src.Dispose()
Write-Host "OK"
