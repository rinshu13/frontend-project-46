@echo off
if "%1"=="lint" (
  npx eslint .
) else if "%1"=="test" (
  npx jest
) else (
  echo Usage: make lint ^| test
  exit /b 1
)