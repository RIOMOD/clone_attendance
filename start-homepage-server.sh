#!/bin/bash

# Enhanced Homepage Development Server
echo "🚀 Starting Enhanced Homepage Server..."
echo "📂 Directory: $(pwd)"

# Kiểm tra Python
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python3..."
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "🐍 Using Python..."
    python -m http.server 8080
else
    echo "❌ Python not found. Please install Python to run local server."
    echo "💡 Alternatively, you can:"
    echo "   - Use 'npx serve .' if you have Node.js"
    echo "   - Use 'php -S localhost:8080' if you have PHP"
    echo "   - Open index.html directly in browser"
    exit 1
fi

echo ""
echo "✅ Server started successfully!"
echo "🌐 Open: http://localhost:8080"
echo "📱 Mobile test: http://localhost:8080"
echo "🔧 Press Ctrl+C to stop server"
