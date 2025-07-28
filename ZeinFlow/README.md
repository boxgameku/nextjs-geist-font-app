# ZeinFlow - Aplikasi Cash Flow Management

ZeinFlow adalah aplikasi Android untuk mengelola cash flow (arus kas) pribadi dengan fitur sinkronisasi Google Drive, kategori kustom, dan laporan keuangan yang komprehensif.

## Fitur Utama

### 🔐 Autentikasi Google
- Login menggunakan akun Google
- Integrasi dengan Google Drive untuk backup dan sinkronisasi data

### 💰 Manajemen Transaksi
- Tambah, edit, dan hapus transaksi pemasukan/pengeluaran
- Kategorisasi transaksi dengan ikon dan warna kustom
- Pencarian dan filter transaksi

### 📊 Dashboard Interaktif
- Ringkasan saldo bersih, total pemasukan, dan pengeluaran
- Grafik visual untuk analisis keuangan
- Transaksi terbaru

### 🏷️ Kategori Kustom
- Buat kategori sendiri dengan ikon emoji dan warna pilihan
- Kategori default yang sudah tersedia
- Manajemen kategori untuk pemasukan dan pengeluaran

### 📈 Laporan Keuangan
- Laporan per periode (bulanan, tahunan, kustom)
- Analisis pengeluaran berdasarkan kategori
- Export laporan ke format yang dapat dibagikan

### ☁️ Sinkronisasi Google Drive
- Backup otomatis ke Google Drive
- Restore data dari backup
- Sinkronisasi antar perangkat

## Teknologi yang Digunakan

- **Language**: Kotlin
- **Architecture**: MVVM (Model-View-ViewModel)
- **Database**: Room (SQLite)
- **UI**: Material Design 3
- **Navigation**: Navigation Component
- **Async**: Coroutines + LiveData
- **Cloud**: Google Drive API
- **Auth**: Google Sign-In
- **Charts**: MPAndroidChart

## Struktur Proyek

```
app/
├── src/main/java/com/zeinflow/cashflow/
│   ├── data/
│   │   ├── database/         # Room database
│   │   ├── entities/         # Data entities
│   │   ├── dao/             # Data Access Objects
│   │   └── repository/      # Repository pattern
│   ├── ui/
│   │   ├── auth/            # Login/Authentication
│   │   ├── dashboard/       # Dashboard utama
│   │   ├── transactions/    # Manajemen transaksi
│   │   ├── categories/      # Manajemen kategori
│   │   ├── reports/         # Laporan keuangan
│   │   └── settings/        # Pengaturan
│   ├── utils/               # Utility classes
│   └── viewmodel/           # ViewModels
└── src/main/res/
    ├── layout/              # XML layouts
    ├── values/              # Colors, strings, themes
    ├── drawable/            # Icons dan drawables
    └── navigation/          # Navigation graph
```

## Instalasi dan Setup

### Prerequisites
- Android Studio Arctic Fox atau lebih baru
- Android SDK 24 (API level 24) atau lebih tinggi
- Akun Google Developer untuk Google Drive API

### Setup Google Drive API
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Enable Google Drive API
4. Buat credentials (OAuth 2.0 Client ID) untuk Android
5. Tambahkan SHA-1 fingerprint dari keystore Anda
6. Download file `google-services.json` dan letakkan di folder `app/`

### Build dan Run
1. Clone repository ini
2. Buka project di Android Studio
3. Sync project dengan Gradle files
4. Pastikan file `google-services.json` sudah ada di folder `app/`
5. Build dan run aplikasi

## Cara Penggunaan

### 1. Login
- Buka aplikasi dan tap "Masuk dengan Google"
- Pilih akun Google dan berikan izin akses

### 2. Dashboard
- Lihat ringkasan keuangan di halaman utama
- Monitor saldo bersih, pemasukan, dan pengeluaran
- Akses transaksi terbaru

### 3. Tambah Transaksi
- Tap tombol "+" di halaman Transaksi
- Pilih jenis (Pemasukan/Pengeluaran)
- Masukkan jumlah, deskripsi, kategori, dan tanggal
- Simpan transaksi

### 4. Manajemen Kategori
- Buka halaman Kategori
- Tambah kategori baru dengan nama, ikon emoji, dan warna
- Edit atau hapus kategori yang ada

### 5. Laporan
- Akses halaman Laporan
- Pilih periode yang diinginkan
- Lihat analisis pengeluaran dan grafik
- Export laporan jika diperlukan

### 6. Sinkronisasi
- Data otomatis tersinkronisasi dengan Google Drive
- Akses Pengaturan untuk backup/restore manual
- Logout untuk mengganti akun

## Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository ini
2. Buat branch untuk fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## Kontak

Developer: Zein
Email: [your-email@example.com]
Project Link: [https://github.com/yourusername/zeinflow](https://github.com/yourusername/zeinflow)

## Acknowledgments

- [Material Design](https://material.io/) untuk design system
- [MPAndroidChart](https://github.com/PhilJay/MPAndroidChart) untuk chart library
- [Google Drive API](https://developers.google.com/drive) untuk cloud storage
- [Room](https://developer.android.com/training/data-storage/room) untuk local database