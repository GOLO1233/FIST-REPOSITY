@echo off
setlocal EnableExtensions

rem GOLO Client + EaglercraftX 1.8.8 build helper
rem Usage: build-golo-client.bat "C:\path\to\Eaglercraftx-1.8.8-src"

set "GOLO=%~dp0"
set "EAGLER=%~1"
if "%EAGLER%"=="" set "EAGLER=..\Eaglercraftx-1.8.8-src"

if not exist "%EAGLER%\sources\main\java" (
  echo [GOLO] EaglercraftX source not found:
  echo        %EAGLER%
  echo.
  echo Usage:
  echo   build-golo-client.bat "C:\path\to\Eaglercraftx-1.8.8-src"
  pause
  exit /b 1
)

where java >nul 2>&1
if errorlevel 1 (
  echo [GOLO] Java was not found in PATH.
  echo [GOLO] EaglercraftX requires Java 11+, Java 17 is recommended.
  pause
  exit /b 1
)

set "DST=%EAGLER%\sources\main\java\me\golo\client"
mkdir "%DST%\gui" >nul 2>&1
mkdir "%DST%\module\impl" >nul 2>&1

xcopy /E /I /Y "%GOLO%src\main\java\me\golo\client" "%DST%" >nul
if errorlevel 1 (
  echo [GOLO] Failed to copy Java sources.
  pause
  exit /b 1
)

echo [GOLO] Java sources copied.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$p = Join-Path '%EAGLER%' 'patches\minecraft\net\minecraft\client\Minecraft.edit.java';" ^
  "if (!(Test-Path -LiteralPath $p)) { throw 'Minecraft.edit.java not found: ' + $p };" ^
  "$s = Get-Content -LiteralPath $p -Raw;" ^
  "$bak = $p + '.golo-backup';" ^
  "if (!(Test-Path -LiteralPath $bak)) { Copy-Item -LiteralPath $p -Destination $bak };" ^
  "if ($s -notmatch 'import me\.golo\.client\.GoloClient;') { $s = $s -replace '(?m)^((?:~|\+)?\s*import\s+[^;]+;\s*)$', '$1' + [Environment]::NewLine + '+ import me.golo.client.GoloClient;', 1 };" ^
  "if ($s -notmatch 'GoloClient\.init\(\)') { $needle = 'this.gameSettings = new GameSettings(this);'; if ($s.Contains($needle)) { $s = $s.Replace($needle, $needle + [Environment]::NewLine + '~        GoloClient.init();') } else { throw 'Could not locate gameSettings initialization in Minecraft.edit.java' } };" ^
  "if ($s -notmatch 'GoloClient\.handleKeyboard\(this\)') { $patterns = @('Keyboard\.next\(\);','Keyboard\.next\(\)'); $done=$false; foreach ($rx in $patterns) { $m=[regex]::Match($s,$rx); if ($m.Success) { $lineEnd=$m.Index+$m.Length; $s=$s.Insert($lineEnd,[Environment]::NewLine+'+        GoloClient.handleKeyboard(this);'); $done=$true; break } }; if (!$done) { Write-Host '[GOLO] Keyboard hook was not auto-inserted; the native client still has the GOLO sources and init hook.' } };" ^
  "Set-Content -LiteralPath $p -Value $s -Encoding UTF8;"
if errorlevel 1 (
  echo [GOLO] Patch integration failed. The original patch was backed up as *.golo-backup when possible.
  pause
  exit /b 1
)

echo [GOLO] Minecraft patch updated.

echo.
echo [GOLO] Starting the normal EaglercraftX compiler...
if exist "%EAGLER%\CompileLatestClient.bat" (
  call "%EAGLER%\CompileLatestClient.bat"
) else (
  echo [GOLO] CompileLatestClient.bat was not found.
  pause
  exit /b 1
)

endlocal
