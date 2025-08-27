@echo off
echo Starting CTSV Attendance System Server...
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak > nul

REM Start Python HTTP Server
start "" cmd /c "python -m http.server 8080"

REM Wait a moment for server to start
timeout /t 2 /nobreak > nul

REM Open browser
start "" "http://127.0.0.1:8080/index.html"

echo.
echo Server is running at: http://127.0.0.1:8080
echo Press Ctrl+C to stop the server
echo.
pause
