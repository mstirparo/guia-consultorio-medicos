@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"
cd /d "C:\Users\Martin\Desktop\stirparo-reader"

%GIT% rm -r --cached .next > nul 2>&1
%GIT% rm --cached .env.local > nul 2>&1
%GIT% rm --cached node_modules -r > nul 2>&1
%GIT% add .
%GIT% commit -m "Initial commit - Guia consultorio medicos clinicos"
echo DONE
