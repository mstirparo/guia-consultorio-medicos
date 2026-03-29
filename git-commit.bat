@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"
cd /d "C:\Users\Martin\Desktop\stirparo-reader"
del /f /q ".git\index.lock" 2>nul
%GIT% config user.email "mstirparo77@gmail.com"
%GIT% config user.name "Martin Stirparo"
%GIT% add .
timeout /t 2 /nobreak >nul
del /f /q ".git\index.lock" 2>nul
%GIT% commit -m "Initial commit - Guia consultorio medicos clinicos"
echo EXIT_CODE=%ERRORLEVEL%
%GIT% log --oneline -1
