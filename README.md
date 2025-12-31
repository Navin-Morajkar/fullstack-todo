# Full Stack To-Do App

A responsive To-Do list application built with React, Node.js, TypeScript, and PostgreSQL.

**Live Demo:** https://fullstack-todo-navin.vercel.app/

**Note on Deployment:** The backend is hosted on Render's Free Tier. It may take roughly **60 seconds** to wake up upon the first request. Please be patient!


## Technologies
- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Supabase) via Prisma ORM
- **Deployment:** Vercel (Frontend) & Render (Backend)

## Features
- Create new tasks
- View list of tasks (sorted by newest)
- Mark tasks as Complete/Incomplete
- Delete tasks
- Responsive Design

## How to Run Locally

### Prerequisites
- Node.js installed
- A PostgreSQL connection string

### Steps
1. **Clone the repo**
   ```bash
   git clone [your-repo-link]
   cd fullstack-todo
    ```
2. **Setup Backend**
    ```bash
    cd server
    npm install

    # Create a .env file with:
    # DATABASE_URL="your-postgres-url"
    # PORT=5000

    # Run Migrations
    npx prisma migrate dev

    # Start Server
    npm run dev
    ```
3. **Setup Frontend**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```