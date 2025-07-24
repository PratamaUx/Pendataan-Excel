# Setup Instructions - JCS Excel Export

## Langkah-langkah Setup Backend

### 1. Persiapan Environment
```bash
# Masuk ke direktori backend
cd backend

# Buat virtual environment baru
python3 -m venv venv

# Aktifkan virtual environment
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies
```bash
# Install semua dependensi yang diperlukan
pip install -r requirements.txt

# Atau install manual:
pip install flask flask-cors pandas openpyxl
```

### 3. Jalankan Server
```bash
# Jalankan server Flask
python src/main.py
```

Server akan berjalan di `http://localhost:5000`

### 4. Test Backend
Untuk menguji apakah backend berjalan dengan benar:
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '[{"id":1,"kategori":"VIP","klien":"Test","pic":"Test PIC","jumlah":5,"noHp":"081234567890","daerah":"Jakarta","status":"Confirmed","jamReservasi":"2024-01-15T10:00","show":true,"createdAt":"2024-01-14T09:00"}]' \
  http://localhost:5000/export-excel \
  --output test.xlsx
```

## Langkah-langkah Setup Frontend

### 1. Buka Aplikasi
- Buka file `index.html` di browser web
- Pastikan backend sudah berjalan di port 5000

### 2. Test Fitur Export
1. Tambahkan beberapa data melalui form
2. Klik tombol "Export" di bagian tabel
3. File Excel akan otomatis terunduh

## Troubleshooting

### Error: "No module named 'pandas'"
```bash
source venv/bin/activate
pip install pandas openpyxl
```

### Error: "CORS policy"
Pastikan Flask-CORS terinstall dan dikonfigurasi dengan benar di `src/main.py`

### Error: "Connection refused"
Pastikan server Flask berjalan di port 5000:
```bash
netstat -an | grep 5000
```

### File Excel tidak terunduh
1. Periksa console browser untuk error
2. Pastikan popup blocker tidak menghalangi unduhan
3. Coba akses `http://localhost:5000/export-excel` secara manual

## Struktur Backend

```
backend/
├── src/
│   ├── main.py                 # Entry point Flask
│   ├── routes/
│   │   ├── excel_export.py     # Route untuk ekspor Excel
│   │   └── user.py            # Route default (tidak digunakan)
│   ├── models/                # Models database (tidak digunakan)
│   └── static/                # Static files
├── requirements.txt           # Dependencies Python
└── venv/                     # Virtual environment (akan dibuat)
```

## Dependencies

### Backend (Python)
- Flask: Web framework
- Flask-CORS: Cross-origin resource sharing
- pandas: Data manipulation
- openpyxl: Excel file handling

### Frontend (JavaScript)
- Vanilla JavaScript (tidak ada dependencies eksternal)
- Fetch API untuk komunikasi dengan backend

## Production Deployment

Untuk deployment production, pertimbangkan:
1. Gunakan WSGI server seperti Gunicorn
2. Setup reverse proxy dengan Nginx
3. Konfigurasi CORS yang lebih ketat
4. Setup SSL/HTTPS
5. Database persistent (jika diperlukan)

## Keamanan

- Backend dikonfigurasi untuk development (CORS terbuka)
- Untuk production, batasi CORS ke domain spesifik
- Tambahkan validasi input yang lebih ketat
- Implementasi rate limiting jika diperlukan

