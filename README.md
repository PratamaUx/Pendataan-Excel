# Aplikasi Pendataan Orang JCS - Updated

Aplikasi ini telah diperbarui dengan fitur ekspor Excel (.xlsx) yang berfungsi penuh.

## Perubahan yang Dilakukan

### 1. Frontend (JavaScript)
- **File**: `script.js`
- **Perubahan**: Fungsi `exportData()` telah dimodifikasi untuk mengirim data ke backend Flask dan mengunduh file Excel (.xlsx) alih-alih CSV.

### 2. Backend (Flask Service)
- **Direktori**: `backend/`
- **Fungsi**: Layanan Flask yang menerima data JSON dan mengonversinya menjadi file Excel dengan format yang rapi.

## Cara Menjalankan

### 1. Menjalankan Frontend
Buka file `index.html` di browser web Anda.

### 2. Menjalankan Backend (Diperlukan untuk Ekspor Excel)

```bash
# Masuk ke direktori backend
cd backend

# Aktifkan virtual environment
source venv/bin/activate

# Jalankan server Flask
python src/main.py
```

Server akan berjalan di `http://localhost:5000`

### 3. Menggunakan Fitur Ekspor
1. Tambahkan data melalui form di aplikasi web
2. Klik tombol "Export" di bagian tabel
3. File Excel akan otomatis terunduh dengan nama `data-pendaftaran-jcs.xlsx`

## Fitur Excel Export

File Excel yang dihasilkan memiliki:
- Format tabel yang rapi dengan header berwarna
- Kolom yang disesuaikan lebarnya secara otomatis
- Link WhatsApp yang dapat diklik
- Format tanggal dan waktu yang mudah dibaca
- Data lengkap termasuk status "Show" dan tanggal pembuatan

## Struktur File

```
jcs_updated_files/
├── index.html          # File HTML utama
├── script.js           # JavaScript dengan fitur ekspor Excel
├── styles.css          # File CSS (tidak berubah)
├── backend/            # Layanan Flask untuk ekspor Excel
│   ├── src/
│   │   ├── main.py
│   │   └── routes/
│   │       └── excel_export.py
│   ├── requirements.txt
│   └── venv/
└── README.md           # File ini
```

## Dependensi Backend

Backend memerlukan:
- Python 3.11+
- Flask
- Flask-CORS
- pandas
- openpyxl

Semua dependensi sudah tercantum dalam `backend/requirements.txt`.

## Catatan Penting

1. **CORS**: Backend dikonfigurasi untuk menerima request dari semua origin untuk kemudahan development.
2. **Port**: Backend berjalan di port 5000. Pastikan port ini tidak digunakan oleh aplikasi lain.
3. **Data**: Data disimpan di localStorage browser, jadi data akan tetap ada setelah refresh halaman.

## Troubleshooting

### Backend tidak bisa diakses
- Pastikan server Flask berjalan di `http://localhost:5000`
- Periksa apakah semua dependensi terinstal dengan benar
- Cek log error di terminal tempat Flask berjalan

### File Excel tidak terunduh
- Pastikan browser mengizinkan unduhan otomatis
- Periksa koneksi ke backend Flask
- Lihat console browser untuk error JavaScript

## Kontak

Untuk pertanyaan atau masalah, silakan hubungi tim pengembang JCS.

#   P e n d a t a a n - E x c e l  
 #   P e n d a t a a n - E x c e l  
 