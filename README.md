# Todo App (.NET 8 + React + SQLite)

## Backend
```bash
cd backend
dotnet tool restore
dotnet ef database update   # initialize SQLite
dotnet run                  # start API (http://localhost:5085)

## Frontend
```bash
cd todo-web
npm install
npm run dev                 # start frontend (http://localhost:5173)
