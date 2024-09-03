

# Twitter Clone Project Setup

This guide will walk you through setting up and running the Twitter clone project, which includes a React frontend and a Django backend. You'll need to have Docker Desktop, Node.js, and Python installed on your machine.

## Prerequisites

Before you start, make sure you have the following installed on your system:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) - For container management.
- [Node.js and npm](https://nodejs.org/) - For managing and running the frontend React application.
- [Python](https://www.python.org/downloads/) - For running the Django backend.

## Project Setup

### 1. Clone the Repository

First, clone the project repository from GitHub:

```bash
git clone https://github.com/your-username/twitter-clone.git
cd twitter-clone
```

### 2. Set Up the Frontend (React)

Navigate to the `frontend` directory and install the required dependencies:

```bash
cd frontend
npm install
```

Once the dependencies are installed, you can start the React development server:

```bash
npm run dev
```

This will start the React frontend, usually available at `http://localhost:3000`.

### 3. Set Up the Backend (Django)

Navigate to the `backend` directory and set up your virtual environment:

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 4. Start Docker Desktop

Ensure that Docker Desktop is running. You'll need Docker to run Redis and other services.

### 5. Start Redis Using Docker

You can start Redis as a Docker container using the following command:

```bash
docker run -d --name redis -p 6379:6379 redis
```

This command runs Redis in a detached mode and maps it to port `6379` on your local machine.

### 6. Run the Django Development Server

With Redis running, you can now start the Django development server:

```bash
python manage.py runserver
```

This will start the Django backend, typically available at `http://localhost:8000`.

## Running the Project

With both the frontend and backend servers running, you can now open your browser and navigate to `http://localhost:3000` to see the Twitter clone in action.

### Useful Commands

- **Stop Redis Container**: If you need to stop the Redis container, you can do so with:
  
  ```bash
  docker stop redis
  ```

- **Restart Redis Container**: To restart the Redis container:
  
  ```bash
  docker start redis
  ```

- **Deactivate Virtual Environment**: If you want to deactivate the Python virtual environment:
  
  ```bash
  deactivate
  ```

## Conclusion

That's it! Your Twitter clone project should now be up and running. If you encounter any issues, make sure all dependencies are installed correctly and that Docker Desktop is running.

---

Feel free to customize the commands or structure according to your specific project setup.
