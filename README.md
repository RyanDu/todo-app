
# ⭐ Todo App

  

A modern full-stack Todo application with a **React + TypeScript + Bootstrap 5** frontend and a **.NET Core Web API** backend.

It supports categorized tasks, color-coded tags, and a clean, responsive UI — perfect for learning, practice, or portfolio demonstration.

  

---

  

## ✨ Features

  

-  **Task Categories** – Each todo belongs to a category. Categories can be searched or created instantly.

-  **Color-coded Category Tags** – Tasks are displayed with pill-shaped tags that are consistently colored based on category name.

-  **Modern UI/UX** – Responsive layout with Bootstrap 5. Category input supports typeahead suggestions with Trie-based search.

-  **Extensible Design** – Clear architecture, ready for enhancements such as tags, filters, or user authentication.

  

---

  

## 🛠 Tech Stack

  

|  Layer | Technology |
|-------------|-----------------------------------|
| Frontend | React, TypeScript, Bootstrap 5 |
| Backend | .NET Core, Entity Framework Core |
| Database | SQLite|

  

---

  

## 📂 Project Structure

  
```bash
todo-web/                 # Frontend (React + TS + Bootstrap)
├── src/
│   ├── components/       # UI components
│   │   ├── AddToDoModel.tsx
│   │   ├── CategoryTag.tsx
│   │   ├── Card.tsx
│   │   └── Sections.tsx
│   ├── hooks/            # Custom hooks & contexts
│   │   └── useCategoryIndex.tsx
│   ├── utils/            # Helpers & data structures
│   │   └── CategoriesTrie.ts
│   ├── App.tsx           # Root React component
│   └── main.tsx          # Entry point
└── package.json


backend/
└── Todo.Api/                 # Backend (.NET Core Web API)
    ├── Controllers/          
    │   ├── CategoriesController.cs
    │   └── TodosController.cs
    ├── Data/
    │   └── AppDbContext.cs
    ├── Models/
    │   ├── Category.cs
    │   └── Todo.cs
    ├── Dtos/  
    │   ├── TodoCreateDto.cs 
    │   └── TodoUpdateDto.cs 
    ├── Migrations/           # EF Core migrations
    ├── Program.cs
    └── Todo.Api.csproj
```
  

## 🚀 Getting Started

  

### Frontend

  

```bash
cd  todo-web
npm  install
npm  run  dev
```

Frontend runs on http://localhost:5173.

  

### Backend

```bash
cd  backend
cd Todo.Api
dotnet  ef  migrations  add  Init
dotnet  ef  database  update
dotnet  run
```

Backend runs on http://localhost:5000.
  

## 🎯 Bonus Features

|Action |Behavior|
|-------------|-----------------------------------|
|Category search |Trie-based typeahead suggestions|
|Missing category| Automatically created & added to the index|
|Create task |Title + category + optional dates|
|Category tag| Colored outline style, ellipsis for long names|

  

## 📖 API Overview

`GET /api/categories?page=1&pageSize=100&q=foo` – Paginated categories with optional search
`POST /api/categories` – Create a new category
`PUT /api/categories/{id}` – Update a category
`DELETE /api/categories/{id}` – Soft delete a category
`POST /api/todos` – Create a todo (requires categoryId)
`PUT /api/todos/{id}` – Update a todo with full payload

  

## 🔮 Roadmap

- Add multiple tags per task (many-to-many between tasks and tags)
- Extend search & filters (by category, date, completion)
- Support offline mode with local storage sync
- Add user authentication (JWT, Identity, or NextAuth for SSR setups)
- Improve UI – dark mode, animations, drag-and-drop sorting

  

## 🤝 Contributing

Fork the repo & clone locally

Run npm install in todo-app and dotnet restore in todo-api

Create a feature branch (feature/add-tags)

Commit changes and open a PR with clear description

  

## 📌 Author

Developed by Ryan Du

  

If you find this project helpful, please ⭐ star the repo!

Feedback and contributions are very welcome 