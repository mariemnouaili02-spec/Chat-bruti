# Chat-bruti Backend (Flask)

Minimal Flask backend for the Chat-bruti project.

Quick start (PowerShell on Windows):

```powershell
# from repository root
cd backend
# create venv
python -m venv venv
# activate
.\venv\Scripts\Activate.ps1
# install deps
pip install -r requirements.txt
# run
python app.py
```

The app will be available at `http://127.0.0.1:5000/`.

API
---

Health:

```powershell
Invoke-RestMethod http://127.0.0.1:5000/api/v1/health
```

List messages:

```powershell
Invoke-RestMethod http://127.0.0.1:5000/api/v1/messages
```

Create message (POST):

```powershell
Invoke-RestMethod -Method POST -Uri http://127.0.0.1:5000/api/v1/messages -Body (ConvertTo-Json @{ text = 'hi'; author = 'alice' }) -ContentType 'application/json'
```

Get a single message by id:

```powershell
Invoke-RestMethod http://127.0.0.1:5000/api/v1/messages/1
```

Update a message (PUT/PATCH):

```powershell
Invoke-RestMethod -Method PUT -Uri http://127.0.0.1:5000/api/v1/messages/1 -Body (ConvertTo-Json @{ text = 'updated text' }) -ContentType 'application/json'
```

Delete a message:

```powershell
Invoke-RestMethod -Method DELETE http://127.0.0.1:5000/api/v1/messages/1
```

List with pagination, filtering and search:

```powershell
# limit and offset
Invoke-RestMethod 'http://127.0.0.1:5000/api/v1/messages?limit=10&offset=0'

# filter by author
Invoke-RestMethod 'http://127.0.0.1:5000/api/v1/messages?author=alice'

# search text
Invoke-RestMethod 'http://127.0.0.1:5000/api/v1/messages?q=welcome'
```
