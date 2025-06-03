# 🛠️ Meetings Dashboard Backend

This is the Django backend for the **Meetings Dashboard** Meetings app. It provides a RESTful API to create, manage, and retrieve meeting information.

---

## 🖥️ Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

---

## 📦 Features

- ✅ Full CRUD support for managing meetings
- 🔒 RESTful API ready for frontend integration
- 🗃️ SQLite for lightweight and fast development
- 🚀 Easy to deploy and scale with Django
postgresql://zivanika:ZRDhBcy5vtZA5IF9O4A6r8lcjQMiTy2A@dpg-d0vc957diees73co1mf0-a.oregon-postgres.render.com/zivanikadb

---

## 🔗 Backend API Endpoints

### 🧾 Authentication & User

#### `POST /api/auth/register/`
- **Description**: Register a new user.
- **Headers**:  
  `Content-Type: application/json`
- **Body**:
  ```json
  {
    "username": "admin",
    "email": "admin@example.com",
    "password": "Platinum123"
  }
  ````
- **Response**:
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "date_joined": "2025-06-01T10:00:00Z"
  },
  "token": "<JWT_ACCESS_TOKEN>"
}
```

#### `POST /api/auth/login/`
- **Description**: Log in and get a JWT token.
- **Headers**:  
  `Content-Type: application/json`
- **Body**:
  ```json
  {
    "username": "admin",
    "password": "Platinum123"
  }

  ````
- **Response**:
```json
{
  "refresh": "<JWT_REFRESH_TOKEN>",
  "access": "<JWT_ACCESS_TOKEN>"
}

```

#### `GET /api/users/me/`
- **Description**: Get the logged-in user's information.
- **Headers**:  
  `Authorization: Bearer <JWT_ACCESS_TOKEN>`

### 📅 Meetings

#### `GET /api/meetings/`
- **Description**: Fetch a list of all meetings.
- **Headers**:  
  `Authorization: Bearer <JWT_ACCESS_TOKEN>`

#### `POST /api/meetings/`
- **Description**: Create a new meeting.
- **Headers**:  
  `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  `Content-Type: application/json`
- **Body**:
  ```json
  {
    "agenda": "Team Sync",
    "description": "Weekly sync-up meeting",
    "status": "scheduled",
    "date": "2025-06-05",
    "start_time": "10:00:00",
    "meeting_url": "https://zoom.us/j/123456789"
  }
  ````

#### `GET /api/meetings/<id>/`
- **Description**: Get details of a specific meeting.
- **Headers**:  
  `Authorization: Bearer <JWT_ACCESS_TOKEN>`

#### `PUT /api/meetings/<id>/`
- **Description**:  Update a meeting by ID.
- **Headers**:  
  `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  `Content-Type: application/json`
- **Body**:
  ```json
  {
    "agenda": "Team Sync",
    "description": "Weekly sync-up meeting",
    "status": "scheduled",
    "date": "2025-06-05",
    "start_time": "10:00:00",
    "meeting_url": "https://zoom.us/j/123456789"
  }
  ````

#### `DELETE /api/meetings/<id>/`
- **Description**: Get details of a specific meeting.
- **Headers**:  
  `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---