# BookingDoctor

BookingDoctor là hệ thống đặt lịch khám bệnh (Backend + ADMIN + Frontend).  
Dự án gồm 3 phần chính:

- `backend` — Node/Express + MongoDB (API)
- `ADMIN` — React + Vite (Admin & Doctor dashboard)
- `frontend` — React + Vite (Giao diện bệnh nhân)

## Tính năng chính

- Quản lý 3 role: Admin, Doctor, Patient
- Book lịch khám, hủy và hoàn tất lịch
- Quản lý profile bác sĩ và trạng thái sẵn sàng (availability)
- Dashboard tổng quan (thu nhập, số lượt đặt, bệnh nhân)

## Cấu trúc repo

- `/backend` — mã backend (routes, controllers, middlewares)
- `/ADMIN` — ứng dụng admin/doctor
- `/frontend` — ứng dụng dành cho bệnh nhân

## Biến môi trường

Tạo file `.env` trong `backend` và `Vite` apps.

Ví dụ `backend/.env`:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/bookingdoctor
JWT_SECRET=your_jwt_secret
```

Ví dụ `ADMIN/.env` và `frontend/.env`:

```
VITE_BACKEND_URL=http://localhost:4000
```

## Cài đặt & chạy (Windows)

1. Cài dependencies

- Backend:
  cd e:\Code\BookingDoctor\backend
  npm install

- ADMIN:
  cd e:\Code\BookingDoctor\ADMIN
  npm install

- Frontend:
  cd e:\Code\BookingDoctor\frontend
  npm install

2. Chạy ứng dụng (phát triển)

- Backend:
  cd e:\Code\BookingDoctor\backend
  npm run server

- ADMIN:
  cd e:\Code\BookingDoctor\ADMIN
  npm run dev

- Frontend:
  cd e:\Code\BookingDoctor\frontend
  npm run dev
