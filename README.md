# 🚀 Hackathon-II-Phase-II: Advanced To-Do Application

Welcome to the **Hackathon-II-Phase-II** project! This repository contains an advanced To-Do application, designed to help you manage your tasks efficiently. It features both a powerful backend and a user-friendly frontend.

## ✨ Features

-   **Task Management**: Create, read, update, and delete your To-Do items.
-   **Robust Backend**: Built with Python, ensuring reliable data handling.
-   **Interactive Frontend**: A modern web interface for seamless interaction.
-   **Easy Setup**: Get started quickly with `poetry`.

## 🛠️ Setup

To get this project up and running, follow these simple steps:

1.  **Install Poetry**:
    If you don't have Poetry installed, you can get it with:
    ```bash
    pip install poetry
    ```

2.  **Install Dependencies**:
    Navigate to the project root and install all required dependencies:
    ```bash
    poetry install
    ```

## ▶️ How to Run

### Backend Application

To start the backend server, execute:

```bash
poetry run python main.py
```

### Frontend Application

To run the frontend, navigate to the `frontend` directory and start the development server:

```bash
cd frontend
npm install # or yarn install
npm run dev # or yarn dev
```

## 🧪 How to Run Tests

Ensure everything is working as expected by running the tests:

```bash
poetry run pytest
```

## 🔄 Reset Database

If you need to reset the application's database to a clean state, use the provided script:

```bash
poetry run python cleanup_db.py
```

---

**Happy Task Managing!** 📝
                      