# ZeinFlow - Aplikasi Cash Flow Android

ZeinFlow adalah aplikasi Android untuk mengelola cash flow (arus kas) dengan fitur sinkronisasi ke Google Drive. Aplikasi ini dirancang dengan tampilan yang profesional dan modern menggunakan Material Design 3.

## 🚀 Fitur Utama

### 💰 Manajemen Transaksi
- **Tambah Transaksi**: Input pendapatan dan pengeluaran dengan mudah
- **Kategori Kustom**: Buat kategori sendiri sesuai kebutuhan
- **Deskripsi Detail**: Tambahkan deskripsi untuk setiap transaksi
- **Tanggal Transaksi**: Pilih tanggal transaksi yang fleksibel

### 📊 Dashboard & Laporan
- **Dashboard Real-time**: Lihat saldo, pendapatan, dan pengeluaran secara real-time
- **Laporan Bulanan**: Analisis keuangan per bulan
- **Laporan Kustom**: Filter laporan berdasarkan periode tertentu
- **Grafik Visual**: Visualisasi data dengan chart yang informatif

### ☁️ Google Drive Integration
- **Sinkronisasi Otomatis**: Data tersinkronisasi otomatis ke Google Drive
- **Backup & Restore**: Backup data dan restore dari Google Drive
- **Multi-device**: Akses data dari berbagai perangkat
- **Keamanan**: Data tersimpan aman di Google Drive

### 🎨 Kategori Kustom
- **Kategori Default**: Kategori bawaan untuk pendapatan dan pengeluaran
- **Kategori Kustom**: Buat kategori sendiri dengan ikon dan warna
- **Manajemen Kategori**: Edit dan hapus kategori sesuai kebutuhan

## 🛠️ Teknologi yang Digunakan

### Backend & Database
- **Room Database**: Local database untuk penyimpanan data
- **Kotlin Coroutines**: Asynchronous programming
- **Flow**: Reactive programming untuk data streams
- **ViewModel & LiveData**: Architecture components

### UI/UX
- **Material Design 3**: Design system modern
- **ViewBinding**: Type-safe view binding
- **Navigation Component**: Navigation antar screen
- **RecyclerView**: List dan grid components
- **CardView**: Material cards untuk layout

### Google Services
- **Google Sign-In**: Authentication dengan Google
- **Google Drive API**: Sinkronisasi data ke Google Drive
- **Google Play Services**: Integration dengan Google services

## 📱 Screenshots

### Dashboard
- Tampilan ringkasan keuangan
- Kartu saldo, pendapatan, dan pengeluaran
- Transaksi terbaru
- Tombol cepat untuk tambah transaksi

### Transaksi
- List semua transaksi
- Filter berdasarkan tipe dan kategori
- Search dan sort functionality
- Detail transaksi

### Kategori
- Manajemen kategori
- Tambah kategori kustom
- Edit warna dan ikon
- Hapus kategori

### Laporan
- Laporan periode tertentu
- Grafik visual
- Export ke Google Drive
- Analisis tren

## 🏗️ Architecture

Aplikasi menggunakan **MVVM (Model-View-ViewModel)** architecture pattern:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      View       │    │   ViewModel     │    │     Model       │
│   (Fragment)    │◄──►│                 │◄──►│  (Repository)   │
│   (Activity)    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   LiveData      │    │   Room Database │
                       │   StateFlow     │    │   Google Drive  │
                       └─────────────────┘    └─────────────────┘
```

## 📦 Setup & Installation

### Prerequisites
- Android Studio Arctic Fox atau yang lebih baru
- Android SDK API 24+ (Android 7.0)
- Google Play Services
- Google Account untuk Google Drive integration

### Build Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/ZeinFlow.git
   cd ZeinFlow
   ```

2. **Open in Android Studio**
   - Buka Android Studio
   - Pilih "Open an existing project"
   - Pilih folder ZeinFlow

3. **Configure Google Services**
   - Buat project di Google Cloud Console
   - Enable Google Drive API
   - Download `google-services.json`
   - Place di folder `app/`

4. **Build & Run**
   ```bash
   ./gradlew build
   ./gradlew installDebug
   ```

### Google Drive Setup

1. **Google Cloud Console**
   - Buat project baru
   - Enable Google Drive API
   - Create OAuth 2.0 credentials
   - Download credentials

2. **Android Configuration**
   - Add SHA-1 fingerprint ke project
   - Configure OAuth consent screen
   - Set up scopes untuk Google Drive

## 🔧 Configuration

### Build Configuration
```gradle
android {
    compileSdk 34
    defaultConfig {
        minSdk 24
        targetSdk 34
        applicationId "com.zeinflow.cashflow"
    }
}
```

### Dependencies
```gradle
dependencies {
    // Google Drive API
    implementation 'com.google.apis:google-api-services-drive:v3-rev20220815-2.0.0'
    
    // Room Database
    implementation 'androidx.room:room-runtime:2.6.1'
    implementation 'androidx.room:room-ktx:2.6.1'
    
    // Material Design
    implementation 'com.google.android.material:material:1.11.0'
    
    // Navigation
    implementation 'androidx.navigation:navigation-fragment-ktx:2.7.6'
}
```

## 📊 Database Schema

### Transaction Table
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    categoryId INTEGER NOT NULL,
    date INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);
```

### Category Table
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    type TEXT NOT NULL,
    isDefault INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
);
```

## 🔐 Permissions

Aplikasi memerlukan permissions berikut:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.GET_ACCOUNTS" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 🎨 UI Components

### Color Scheme
- **Primary**: #2196F3 (Blue)
- **Secondary**: #4CAF50 (Green)
- **Accent**: #FF9800 (Orange)
- **Income**: #4CAF50 (Green)
- **Expense**: #F44336 (Red)

### Typography
- **Headline**: Roboto Bold 24sp
- **Title**: Roboto Medium 20sp
- **Subtitle**: Roboto Medium 16sp
- **Body**: Roboto Regular 14sp
- **Caption**: Roboto Regular 12sp

## 🚀 Roadmap

### Version 1.1
- [ ] Export laporan ke PDF
- [ ] Notifikasi pengingat transaksi
- [ ] Widget untuk home screen
- [ ] Dark mode support

### Version 1.2
- [ ] Multi-currency support
- [ ] Budget planning
- [ ] Recurring transactions
- [ ] Data import/export

### Version 1.3
- [ ] Cloud backup ke multiple providers
- [ ] Family sharing
- [ ] Advanced analytics
- [ ] Investment tracking

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ZeinFlow Team**
- Email: contact@zeinflow.com
- Website: https://zeinflow.com
- GitHub: https://github.com/zeinflow

## 🙏 Acknowledgments

- Material Design team untuk design system
- Google untuk Google Drive API
- Android team untuk Android framework
- Open source community untuk libraries

---

**ZeinFlow** - Manage your money, master your life! 💰✨