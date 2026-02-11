Add-Type -AssemblyName System.Drawing
$bp = "c:\Users\ibo\Desktop\12\egepenakcayapi.com\wp-content\uploads\2022\05"
Get-ChildItem "$bp\kedi-sineklik-p*.jpg" | ForEach-Object {
    $i = [System.Drawing.Image]::FromFile($_.FullName)
    Write-Host "$($_.Name): $($i.Width)x$($i.Height) ($([math]::Round($_.Length/1024))KB)"
    $i.Dispose()
}
