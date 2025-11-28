@echo off
REM Start ASP.NET WebAPI (Savorly API)
start cmd /k "cd /d %~dp0Savorly.API && dotnet run"

REM Start Vite React frontend (once created)
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo Both backend and frontend are starting.
pause
