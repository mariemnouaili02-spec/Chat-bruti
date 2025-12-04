# PowerShell helper to setup and start the Flask app
param(
    [switch]$RecreateVenv
)

if ($RecreateVenv -or -not (Test-Path .\venv)) {
    python -m venv venv
}

Write-Host "Activating venv..."
.\venv\Scripts\Activate.ps1

Write-Host "Installing requirements..."
pip install -r requirements.txt

Write-Host "Starting app on http://0.0.0.0:5000"
python app.py
