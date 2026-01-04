# Setup Innosetup Portable
# 此脚本帮助设置 Innosetup 便携版

$innosetupInstallPaths = @(
    "C:\Program Files (x86)\Inno Setup 6",
    "C:\Program Files\Inno Setup 6",
    "C:\Program Files (x86)\Inno Setup 5",
    "C:\Program Files\Inno Setup 5"
)

$vendorPath = Join-Path $PSScriptRoot "vendor\innosetup"

Write-Host "Setting up Innosetup portable version..." -ForegroundColor Cyan
Write-Host ""

# 查找已安装的 Innosetup
$installedPath = $null
foreach ($path in $innosetupInstallPaths) {
    if (Test-Path $path) {
        $installedPath = $path
        Write-Host "Found Innosetup at: $installedPath" -ForegroundColor Green
        break
    }
}

if (-not $installedPath) {
    Write-Host "Innosetup not found on system." -ForegroundColor Yellow
    Write-Host "Please download and install Innosetup from: https://jrsoftware.org/isdl.php" -ForegroundColor Yellow
    exit 1
}

# 创建 vendor 目录
if (-not (Test-Path $vendorPath)) {
    New-Item -ItemType Directory -Path $vendorPath -Force | Out-Null
    Write-Host "Created directory: $vendorPath" -ForegroundColor Green
}

# 需要复制的文件
$filesToCopy = @(
    "ISCC.exe",
    "ISCmplr.dll",
    "Default.isl",
    "Setup.e32",
    "SetupLdr.e32",
    "ISPP.dll",
    "ISPPBuiltins.iss"
)

# 复制文件
Write-Host ""
Write-Host "Copying files..." -ForegroundColor Cyan

foreach ($file in $filesToCopy) {
    $sourcePath = Join-Path $installedPath $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination $vendorPath -Force
        Write-Host "  Copied: $file" -ForegroundColor Gray
    } else {
        Write-Host "  Skipped: $file (not found)" -ForegroundColor DarkGray
    }
}

# 复制 Languages 目录
$sourceLangPath = Join-Path $installedPath "Languages"
$destLangPath = Join-Path $vendorPath "Languages"

if (Test-Path $sourceLangPath) {
    if (-not (Test-Path $destLangPath)) {
        New-Item -ItemType Directory -Path $destLangPath -Force | Out-Null
    }
    
    Copy-Item "$sourceLangPath\*" -Destination $destLangPath -Force -Recurse
    $langCount = (Get-ChildItem $destLangPath -Filter "*.isl").Count
    Write-Host "  Copied: Languages directory ($langCount language files)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Portable version location: $vendorPath" -ForegroundColor Cyan
Write-Host ""

# 显示文件大小
$totalSize = (Get-ChildItem $vendorPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Total size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Gray
Write-Host ""
Write-Host "You can now use the maker without system-installed Innosetup!" -ForegroundColor Green
