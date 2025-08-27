@echo off
echo 🚀 Starting Enhanced Homepage Server...
echo 📂 Directory: %cd%

REM Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🐍 Using Python...
    echo ✅ Server starting on http://localhost:8080
    echo 🔧 Press Ctrl+C to stop server
    echo.
    python -m http.server 8080
) else (
    echo ❌ Python not found. Please install Python to run local server.
    echo 💡 Alternatively, you can:
    echo    - Use 'npx serve .' if you have Node.js
    echo    - Use 'php -S localhost:8080' if you have PHP
    echo    - Open index.html directly in browser
    pause
)
