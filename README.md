# Smart Complaint & Service Tracking System

A comprehensive complaint management system for colleges/offices where users can submit complaints and track their status, and admins can manage them.

## Features

### User Side
- User registration and login system
- Submit complaint form (title, description, category, priority, location)
- Upload image/file with complaint
- Auto-generate tracking ID
- Track complaint status (pending, in progress, resolved)
- View complaint history
- Receive status updates
- Feedback/rating after resolution

### Admin Side
- Admin login
- Dashboard showing total, pending, resolved complaints
- Assign complaints to staff
- Update complaint status
- Manage categories
- View all complaints
- Add internal notes
- Complaint prioritization

## Project Structure

```
smart-complaint-system/
├── app.py                  # Main Flask application
├── config.py               # Configuration settings
├── requirements.txt        # Python dependencies
├── database.db            # SQLite database (created automatically)
├── static/
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   └── forms.css
│   ├── js/
│   │   ├── main.js
│   │   ├── dashboard.js
│   │   └── complaints.js
│   └── uploads/           # For complaint attachments
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── admin_dashboard.html
│   ├── submit_complaint.html
│   ├── complaint_detail.html
│   ├── complaint_history.html
│   └── admin_complaints.html
```

## Setup Guide for VS Code

### Prerequisites
1. Install Python 3.8 or higher
2. Install VS Code
3. Install Git (optional)

### Installation Steps

1. **Clone or Download the Project**
   - Copy the project folder to your desired location

2. **Create Virtual Environment**
   
```
   python -m venv venv
   
```

3. **Activate Virtual Environment**
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. **Install Dependencies**
   
```
   pip install -r requirements.txt
   
```

5. **Run the Application**
   
```
   python app.py
   
```

6. **Access the Application**
   - Open your browser and go to: `http://127.0.0.1:5000`

### Default Admin Credentials
- Email: admin@college.com
- Password: admin123

## Database Schema

### Users Table
```
sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Complaints Table
```
sql
CREATE TABLE complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_id TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    location TEXT,
    status TEXT DEFAULT 'pending',
    assigned_to INTEGER,
    attachment TEXT,
    rating INTEGER,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

### Categories Table
```
sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Complaint Notes Table
```
sql
CREATE TABLE complaint_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    complaint_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/current_user` - Get current user

### Complaints
- `GET /api/complaints` - Get all complaints (admin)
- `GET /api/complaints/user` - Get user's complaints
- `GET /api/complaints/<tracking_id>` - Get complaint by tracking ID
- `POST /api/complaints` - Submit new complaint
- `PUT /api/complaints/<id>` - Update complaint (admin)
- `POST /api/complaints/<id>/rate` - Rate resolved complaint

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `DELETE /api/categories/<id>` - Delete category (admin)

### Dashboard
- `GET /api/stats` - Get dashboard statistics (admin)

## How to Test

1. **Test User Registration**
   - Go to `/register`
   - Fill in the form and submit
   - Verify email format and password strength

2. **Test User Login**
   - Go to `/login`
   - Enter credentials
   - Should redirect to user dashboard

3. **Test Complaint Submission**
   - Log in as user
   - Click "Submit Complaint"
   - Fill in all fields
   - Upload an image (optional)
   - Submit and note the tracking ID

4. **Test Complaint Tracking**
   - Go to "My Complaints"
   - Enter tracking ID to check status

5. **Test Admin Functions**
   - Log in with admin credentials
   - View dashboard statistics
   - Update complaint status
   - Add internal notes

## Security Features
- Password hashing with bcrypt
- Session management
- Role-based access control
- SQL injection prevention
- File upload validation
- CSRF protection

## License
MIT License
