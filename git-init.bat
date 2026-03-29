@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"
cd /d "C:\Users\Martin\Desktop\stirparo-reader"

%GIT% init
%GIT% config user.email "mstirparo77@gmail.com"
%GIT% config user.name "Martin Stirparo"
%GIT% add .
%GIT% commit -m "Initial commit - Guia consultorio medicos clinicos"
echo === COMMIT DONE ===
%GIT% log --oneline -3
