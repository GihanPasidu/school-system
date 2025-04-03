:: filepath: c:\Users\sahan\Documents\GitHub\school\run-school-system.bat
@echo off
echo ========================================================
echo    Sri Lanka School Management System - Professional    
echo ========================================================
echo.
echo Starting system... Please wait.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is required but not installed.
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing required packages...
    call npm install
)

:: Create data directory if it doesn't exist
if not exist "data" (
    echo [INFO] Creating data directory...
    mkdir data
)

:: Create empty JSON files if they don't exist (these will be tracked in GitHub)
if not exist "data\students.json" (
    echo [INFO] Creating students database...
    echo [] > data\students.json
)
if not exist "data\teachers.json" (
    echo [INFO] Creating teachers database...
    echo [] > data\teachers.json
)
if not exist "data\settings.json" (
    echo [INFO] Creating settings database...
    echo [] > data\settings.json
)

:: Start the browser
echo [INFO] Starting server...
start "" http://localhost:3000
echo.
echo [INFO] Opening application in browser...
echo.
echo [SUCCESS] School Management System is now running!
echo.
echo --------------------------------------------------------
echo  DO NOT CLOSE THIS WINDOW WHILE USING THE APPLICATION
echo --------------------------------------------------------
echo.
echo IMPORTANT: Your data is stored in JSON files in the data directory
echo          and can be committed to GitHub for version control.
echo.

:: Start Node.js server in a separate process
start /B "" node server.js > nul 2>&1

:: Wait for user to press a key to shutdown
echo Press any key to shutdown the server when you're done...
pause > nul

:: Kill the Node.js server process
taskkill /f /im node.exe >nul 2>nul
echo.
echo [INFO] Server stopped successfully. You can close this window.
timeout /t 3 >nul