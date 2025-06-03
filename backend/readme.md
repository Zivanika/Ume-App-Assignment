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

### `/api/meetings/`
- **GET**: Fetch a list of all meetings  
- **POST**: Create a new meeting  

### `/api/meetings/<id>/`
- **GET**: Retrieve details of a specific meeting  
- **PUT**: Update the meeting by ID  
- **DELETE**: Delete the meeting by ID  

---

## 🧪 Example JSON (Meeting)

```json
{
  "agenda": "Technical interview with Carl",
  "status": "Upcoming",
  "date": "2025-06-10",
  "start_time": "10:00:00",
  "meeting_url": "https://www.todoi.com/tech"
}
