# Tutormi - Tutoring Platform

A modern tutoring platform that connects tutors with students, allowing tutors to create lesson plans and announcements, and manage their student roster.

## 🚀 Features

- **Tutor Registration** - Tutors sign up and receive a unique Tutor ID
- **Student Registration** - Students register using their tutor's ID
- **Student Approval System** - Tutors can accept/decline student requests
- **Lesson Plans** - Tutors create and manage lesson plans
- **Announcements** - Tutors post announcements for their students
- **JWT Authentication** - Secure token-based authentication

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker + Docker Compose

## 📁 Project Structure

```
tutormi/
├── docker-compose.yml          # Production Docker config
├── docker-compose.dev.yml      # Development Docker config
├── code/
│   ├── frontend/               # React + Vite frontend
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── Dockerfile.dev
│   └── backend/                # Express API backend
│       ├── src/
│       ├── Dockerfile
│       └── Dockerfile.dev
```

## 🐳 Running with Docker

### Prerequisites
- Docker Desktop installed

### Development Mode (with hot reloading)
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up --build

# Run database migrations
docker exec tutormi-backend-dev npm run db:migrate

# Seed sample data (optional)
docker exec tutormi-backend-dev npm run db:seed
```

Access the app at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Database: localhost:3306

### Production Mode
```bash
# Build and start all services
docker-compose up --build -d

# Run database migrations
docker exec tutormi-backend npm run db:migrate
```

Access the app at http://localhost (port 80)

## 🔧 Running Locally (without Docker)

### Prerequisites
- Node.js 20+
- MySQL 8.0+

### Database Setup
```bash
# Create database (MySQL creates it automatically via Docker, or manually):
mysql -u root -p -e "CREATE DATABASE tutormi;"
```

### Backend Setup
```bash
cd code/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials

# Run migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd code/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/tutor` - Register a new tutor
- `POST /api/auth/register/student` - Register a new student
- `POST /api/auth/login/tutor` - Tutor login
- `POST /api/auth/login/student` - Student login
- `GET /api/auth/me` - Get current user (requires auth)

### Tutors
- `GET /api/tutors/profile` - Get tutor profile
- `GET /api/tutors/requests` - Get pending student requests
- `POST /api/tutors/requests/:studentId/accept` - Accept student
- `POST /api/tutors/requests/:studentId/decline` - Decline student
- `GET /api/tutors/students` - Get all approved students

### Students
- `GET /api/students/profile` - Get student profile
- `GET /api/students/tutor` - Get student's tutor info

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get single lesson
- `POST /api/lessons` - Create lesson (tutor only)
- `PUT /api/lessons/:id` - Update lesson (tutor only)
- `DELETE /api/lessons/:id` - Delete lesson (tutor only)

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (tutor only)
- `PUT /api/announcements/:id` - Update announcement (tutor only)
- `DELETE /api/announcements/:id` - Delete announcement (tutor only)

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=8000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=tutormi
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## 🚢 Deploying to DigitalOcean

### Option 1: App Platform (Recommended)
1. Push your code to GitHub
2. Create a new App in DigitalOcean App Platform
3. Connect your GitHub repo
4. Add a MySQL database
5. Set environment variables
6. Deploy!

### Option 2: Droplet with Docker
1. Create a Droplet (Ubuntu 22.04)
2. Install Docker and Docker Compose
3. Clone your repo
4. Run `docker-compose up -d`
5. Configure firewall for ports 80, 443

## 📧 Sample Login Credentials

After running `npm run db:seed`:

**Tutor Account:**
- Email: sarah@tutormi.com
- Password: password123
- Tutor ID: TUT001

**Student Account:**
- Email: alex@student.com
- Password: password123

## 📝 License

MIT
