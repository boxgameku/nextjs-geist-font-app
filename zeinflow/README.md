# ZeinFlow - Cash Flow Management App

ZeinFlow is a professional Android cash flow management application built with React Native (Expo) that features Google Drive integration for secure data storage and synchronization.

## Features

- **Google Authentication**: Secure login using Google OAuth 2.0
- **Google Drive Integration**: Automatic backup and sync of financial data
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Custom Categories**: Create and manage custom transaction categories
- **Detailed Reports**: View comprehensive financial reports by period
- **Professional UI**: Modern Material Design interface with smooth animations
- **Offline Support**: Works offline with local storage, syncs when online

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your Android device
- Google Cloud Console account for OAuth setup

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zeinflow
```

2. Install dependencies:
```bash
npm install
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Add authorized redirect URIs:
     - `https://auth.expo.io/@your-expo-username/zeinflow`
     - `exp://localhost:19000`
5. Copy the Client ID

6. Update the client ID in `src/screens/LoginScreen.js`:
```javascript
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

## Running the App

1. Start the development server:
```bash
npm start
```

2. Scan the QR code with Expo Go app on your Android device

3. For Android emulator:
```bash
npm run android
```

## Project Structure

```
zeinflow/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/          # App screens
│   ├── navigation/       # Navigation configuration
│   ├── services/         # Business logic and API services
│   ├── constants/        # App constants and theme
│   └── utils/           # Utility functions and contexts
├── assets/              # Images and static assets
├── App.js              # Main application component
└── app.json           # Expo configuration
```

## Key Technologies

- **React Native (Expo)**: Cross-platform mobile framework
- **React Navigation**: Navigation library
- **React Native Paper**: Material Design components
- **Google OAuth**: Authentication
- **Google Drive API**: Cloud storage
- **AsyncStorage**: Local data persistence
- **Moment.js**: Date handling

## Features Overview

### Authentication
- Google Sign-In integration
- Secure token management
- Auto-login functionality

### Transaction Management
- Add income/expense transactions
- Edit existing transactions
- Delete transactions with confirmation
- Filter by date range
- Search functionality

### Categories
- Default categories for common expenses
- Create custom categories with icons
- Edit category details
- Category-wise transaction filtering

### Reports
- Monthly/Weekly/Daily summaries
- Income vs Expense charts
- Category-wise breakdowns
- Export reports functionality

### Data Sync
- Automatic Google Drive backup
- Offline mode with local storage
- Sync status indicators
- Manual sync option

## Building for Production

1. Update app.json with your app details
2. Build APK:
```bash
expo build:android
```

3. Follow Expo's build process instructions

## Troubleshooting

### Google Sign-In Issues
- Ensure redirect URIs are correctly configured
- Check if Google Drive API is enabled
- Verify client ID is correct

### Build Errors
- Clear cache: `expo start -c`
- Delete node_modules and reinstall
- Check for version conflicts in package.json

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.