# Setup Instructions untuk ZeinFlow

## Prerequisites
1. Android Studio Arctic Fox atau lebih baru
2. Android SDK 24 (API level 24) minimum
3. JDK 8 atau lebih baru
4. Akun Google Developer Console

## Setup Google Drive API

### 1. Buat Project di Google Cloud Console
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik "Select a project" dan buat project baru
3. Beri nama project (misal: "ZeinFlow")

### 2. Enable Google Drive API
1. Di dashboard project, klik "Enable APIs and Services"
2. Cari "Google Drive API" dan enable
3. Juga enable "Google Sign-In API"

### 3. Buat OAuth 2.0 Credentials
1. Pergi ke "Credentials" di sidebar
2. Klik "Create Credentials" → "OAuth 2.0 Client IDs"
3. Pilih "Android" sebagai application type
4. Masukkan package name: `com.zeinflow.cashflow`
5. Dapatkan SHA-1 fingerprint:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
6. Masukkan SHA-1 fingerprint ke form
7. Klik "Create"

### 4. Download Configuration File
1. Klik "Download JSON" untuk OAuth client
2. Rename file menjadi `google-services.json`
3. Letakkan di folder `app/` (sejajar dengan build.gradle)

## Setup Project

### 1. Clone dan Setup
```bash
git clone <repository-url>
cd ZeinFlow

# Copy template files
cp local.properties.template local.properties
cp app/google-services.json.template app/google-services.json
```

### 2. Edit local.properties
Buka `local.properties` dan update path SDK:
```
sdk.dir=/path/to/your/Android/Sdk
```

### 3. Edit google-services.json
Buka `app/google-services.json` dan ganti dengan nilai dari Google Cloud Console:
- `YOUR_PROJECT_NUMBER`
- `YOUR_PROJECT_ID`
- `YOUR_MOBILE_SDK_APP_ID`
- `YOUR_OAUTH_CLIENT_ID`
- `YOUR_WEB_CLIENT_ID`
- `YOUR_API_KEY`
- `YOUR_SHA1_FINGERPRINT`

### 4. Build Project
```bash
./gradlew clean build
```

## Struktur File yang Dibuat

```
ZeinFlow/
├── app/
│   ├── build.gradle                 # Dependencies dan konfigurasi app
│   ├── google-services.json         # Konfigurasi Google Services (WAJIB)
│   ├── proguard-rules.pro          # Rules untuk obfuscation
│   └── src/main/
│       ├── AndroidManifest.xml      # Manifest aplikasi
│       ├── java/com/zeinflow/cashflow/
│       │   ├── MainActivity.kt      # Activity utama
│       │   ├── data/               # Layer data (Room, Repository)
│       │   ├── ui/                 # UI components (Fragments, Adapters)
│       │   └── utils/              # Utility classes
│       └── res/                    # Resources (layout, values, drawable)
├── build.gradle                    # Konfigurasi project level
├── settings.gradle                 # Settings project
├── gradle.properties              # Properties Gradle
├── local.properties               # Local SDK path (WAJIB)
└── README.md                      # Dokumentasi
```

## Fitur yang Sudah Diimplementasi

### ✅ Sudah Selesai
- **Struktur Project**: MVVM architecture dengan Room database
- **Google Authentication**: Login dengan Google Sign-In
- **Database Layer**: Room entities, DAO, dan Repository
- **UI Framework**: Material Design 3 dengan Navigation Component
- **Dashboard**: Layout dengan ringkasan keuangan dan transaksi terbaru
- **Google Drive Integration**: Service untuk backup/restore data
- **Utility Classes**: Format currency, date, dan converter
- **Theme & Styling**: Professional theme dengan warna yang konsisten

### 🚧 Perlu Dilengkapi
- **Transaction Management**: Form tambah/edit transaksi
- **Category Management**: CRUD kategori dengan color picker
- **Reports**: Grafik dan laporan per periode
- **Settings**: Backup/restore, logout, dan pengaturan lain
- **Navigation**: Implementasi navigasi antar fragment
- **Data Sync**: Sinkronisasi otomatis dengan Google Drive

## Next Steps

1. **Setup Google Services**: Ikuti instruksi di atas untuk setup Google Drive API
2. **Test Login**: Jalankan aplikasi dan test login dengan Google
3. **Implement Features**: Lanjutkan implementasi fitur-fitur yang belum selesai
4. **Testing**: Test semua fitur dan flow aplikasi
5. **Icon & Assets**: Tambahkan icon aplikasi dan assets yang diperlukan

## Troubleshooting

### Google Sign-In Error
- Pastikan SHA-1 fingerprint benar
- Cek package name di Google Cloud Console
- Pastikan Google Sign-In API sudah enabled

### Build Error
- Pastikan Android SDK sudah terinstall
- Update gradle wrapper jika perlu
- Sync project dengan Gradle files

### Database Error
- Cek Room annotations
- Pastikan TypeConverter sudah diregister
- Clear app data jika ada perubahan schema

## Support

Jika ada masalah dalam setup atau development, silakan buat issue di repository atau hubungi developer.