# Logiciel — CMS Académico

Sistema web para gestión de publicaciones científicas, proyectos de investigación, miembros, eventos y noticias.

**Stack:** React 19 + Vite · TailwindCSS · Django 5 · Firestore · JWT en HTTP Only Cookies

---

## Requisitos previos

- Python **3.10+**
- Node.js **18+**
- Cuenta Firebase con Firestore habilitado
- Archivo `serviceAccount.json` de Firebase (pedírselo al equipo, no está en el repo)

---

## Backend (Django)

```bash
# 1. Entrar a la carpeta del backend
cd backend

# 2. Crear entorno virtual
python -m venv env

# 3. Activar entorno virtual
# Windows:
env\Scripts\activate
# Mac/Linux:
source env/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 6. Correr el servidor
python manage.py runserver
```

### Variables de entorno — Backend (`.env`)
```
SECRET_KEY=tu_clave_secreta_django
DEBUG=True
FIREBASE_CREDENTIALS=ruta/al/serviceAccount.json
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## Frontend (React + Vite)

```bash
# 1. Entrar a la carpeta del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# 4. Correr en desarrollo
npm run dev
```

### Variables de entorno — Frontend (`.env`)
```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## Estructura del repositorio

```
/
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   └── manage.py
├── frontend/
│   ├── package.json
│   ├── .env.example
│   └── src/
└── README.md
```

---

## Importante — archivos que NO están en el repositorio

Estos archivos contienen credenciales y deben pedirse al equipo:

- `serviceAccount.json` — credenciales de Firebase
- `.env` del backend
- `.env` del frontend

Nunca los subas a GitHub.
