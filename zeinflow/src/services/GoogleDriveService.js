import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';

class GoogleDriveService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expirationTime = null;
  }

  async authenticate() {
    const [request, response, promptAsync] = Google.useAuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      redirectUri: 'https://auth.expo.io/@your-username/zeinflow',
    });

    return { request, response, promptAsync };
  }

  async saveTokens(authentication) {
    this.accessToken = authentication.accessToken;
    this.refreshToken = authentication.refreshToken;
    this.expirationTime = authentication.expirationTime;

    await AsyncStorage.setItem('googleAccessToken', authentication.accessToken);
    await AsyncStorage.setItem('googleRefreshToken', authentication.refreshToken || '');
    await AsyncStorage.setItem('googleExpirationTime', authentication.expirationTime.toString());
  }

  async loadTokens() {
    this.accessToken = await AsyncStorage.getItem('googleAccessToken');
    this.refreshToken = await AsyncStorage.getItem('googleRefreshToken');
    const expTime = await AsyncStorage.getItem('googleExpirationTime');
    this.expirationTime = expTime ? parseInt(expTime) : null;
  }

  async getUserInfo() {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return await response.json();
  }

  async createAppFolder() {
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'ZeinFlow Data',
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create app folder');
    }

    const folder = await response.json();
    await AsyncStorage.setItem('appFolderId', folder.id);
    return folder.id;
  }

  async getAppFolderId() {
    let folderId = await AsyncStorage.getItem('appFolderId');
    
    if (!folderId) {
      // Search for existing folder
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='ZeinFlow Data' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search for app folder');
      }

      const data = await response.json();
      
      if (data.files && data.files.length > 0) {
        folderId = data.files[0].id;
        await AsyncStorage.setItem('appFolderId', folderId);
      } else {
        folderId = await this.createAppFolder();
      }
    }

    return folderId;
  }

  async saveData(fileName, data) {
    const folderId = await this.getAppFolderId();
    
    // Check if file exists
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${folderId}' in parents and trashed=false`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search for file');
    }

    const searchData = await searchResponse.json();
    const fileExists = searchData.files && searchData.files.length > 0;

    if (fileExists) {
      // Update existing file
      const fileId = searchData.files[0].id;
      const response = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update file');
      }

      return await response.json();
    } else {
      // Create new file
      const metadata = {
        name: fileName,
        parents: [folderId],
        mimeType: 'application/json',
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: form,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create file');
      }

      return await response.json();
    }
  }

  async loadData(fileName) {
    const folderId = await this.getAppFolderId();
    
    // Search for file
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${folderId}' in parents and trashed=false`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search for file');
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.files || searchData.files.length === 0) {
      return null; // File doesn't exist
    }

    const fileId = searchData.files[0].id;
    
    // Download file content
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return await response.json();
  }

  async deleteData(fileName) {
    const folderId = await this.getAppFolderId();
    
    // Search for file
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${folderId}' in parents and trashed=false`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search for file');
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.files || searchData.files.length === 0) {
      return; // File doesn't exist
    }

    const fileId = searchData.files[0].id;
    
    // Delete file
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  }
}

export default new GoogleDriveService();