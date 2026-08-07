# Startup Guide (Frontend + Backend + DB Troubleshooting)

## 1) Project layout
- Backend (Spring Boot): `C:\Users\ASUS\Downloads\sr\backend`
- Frontend (React + Vite): `C:\Users\ASUS\Downloads\sr\frontend`

## 2) Prerequisites
- Java 21
- Node.js 18+ (recommended 20+)
- npm
- MongoDB Atlas URI (or local MongoDB on `localhost:27017`)

## 2.1) Environment files
- Backend template: `backend/.env.example`
- Backend local: `backend/.env`
- Frontend template: `frontend/.env.example`
- Frontend local: `frontend/.env.local`

---

## 3) Backend setup and run
Open terminal in:
`C:\Users\ASUS\Downloads\sr\backend`

### Run tests
```powershell
.\mvnw.cmd test
```

### Start server
```powershell
.\start-backend.ps1
```

Backend URL: `http://localhost:8080`

---

## 4) Frontend setup and run
Open terminal in:
`C:\Users\ASUS\Downloads\sr\frontend`

### Install dependencies
```powershell
npm install
```

### Validate
```powershell
npm run lint
npm run build
```

### Start dev server
```powershell
npm run dev
```

Frontend URL: `http://localhost:5173`

---

## 5) Status after fixes
1. Frontend/backend route mismatch is fixed (`/api/chat` is now used).
2. Frontend lint issues are fixed.
3. Secrets are no longer hardcoded in backend config; environment variables are required.
4. Remaining blocker: valid MongoDB Atlas connectivity and credentials.

---

## 6) Your DB error (`connection reset` / `connection refused`) - fix checklist

Use a valid Atlas URI format:
```properties
spring.mongodb.uri=mongodb+srv://<user>:<pass>@<cluster-host>/<db-name>?retryWrites=true&w=majority&appName=<app-name>
```

Then verify:
1. Atlas Network Access includes your public IP (or temporarily `0.0.0.0/0` for test only).
2. Atlas DB user exists and password is correct.
3. Cluster host is correct.
4. VPN/proxy/firewall/antivirus is not blocking DB traffic.
5. If you are testing local MongoDB, ensure Mongo service is running on `localhost:27017`.

---

## 7) Recommended secure config
Use env vars instead of hardcoding:
```properties
GEMINI_API_KEY=${GEMINI_API_KEY}
spring.mongodb.uri=${SPRING_MONGODB_URI:${SPRING_DATA_MONGODB_URI:${MONGODB_URI}}}
```

Set env vars before backend start:
```powershell
$env:GEMINI_API_KEY="your_real_key"
$env:SPRING_MONGODB_URI="your_real_mongodb_uri"
.\mvnw.cmd spring-boot:run
```
