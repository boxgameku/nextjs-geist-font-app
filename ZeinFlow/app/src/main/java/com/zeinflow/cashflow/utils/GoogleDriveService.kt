package com.zeinflow.cashflow.utils

import android.content.Context
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.api.client.extensions.android.http.AndroidHttp
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential
import com.google.api.client.json.gson.GsonFactory
import com.google.api.services.drive.Drive
import com.google.api.services.drive.DriveScopes
import com.google.api.services.drive.model.File
import com.google.api.client.http.ByteArrayContent
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.zeinflow.cashflow.data.entities.Transaction
import com.zeinflow.cashflow.data.entities.Category
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.util.*

class GoogleDriveService(private val context: Context) {
    
    private var driveService: Drive? = null
    private val gson = Gson()
    
    companion object {
        private const val BACKUP_FOLDER_NAME = "ZeinFlow Backup"
        private const val TRANSACTIONS_FILE_NAME = "transactions.json"
        private const val CATEGORIES_FILE_NAME = "categories.json"
        private const val MIME_TYPE_JSON = "application/json"
        private const val MIME_TYPE_FOLDER = "application/vnd.google-apps.folder"
    }
    
    fun initializeDriveService(): Boolean {
        return try {
            val account = GoogleSignIn.getLastSignedInAccount(context)
            if (account != null) {
                val credential = GoogleAccountCredential.usingOAuth2(
                    context, listOf(DriveScopes.DRIVE_FILE)
                )
                credential.selectedAccount = account.account
                
                driveService = Drive.Builder(
                    AndroidHttp.newCompatibleTransport(),
                    GsonFactory(),
                    credential
                )
                    .setApplicationName("ZeinFlow")
                    .build()
                true
            } else {
                false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
    
    suspend fun backupData(transactions: List<Transaction>, categories: List<Category>): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                val drive = driveService ?: return@withContext false
                
                // Buat atau dapatkan folder backup
                val folderId = getOrCreateBackupFolder(drive)
                
                // Backup transactions
                val transactionsJson = gson.toJson(transactions)
                val transactionsSuccess = uploadFile(
                    drive,
                    TRANSACTIONS_FILE_NAME,
                    transactionsJson,
                    folderId
                )
                
                // Backup categories
                val categoriesJson = gson.toJson(categories)
                val categoriesSuccess = uploadFile(
                    drive,
                    CATEGORIES_FILE_NAME,
                    categoriesJson,
                    folderId
                )
                
                transactionsSuccess && categoriesSuccess
            } catch (e: Exception) {
                e.printStackTrace()
                false
            }
        }
    }
    
    suspend fun restoreTransactions(): List<Transaction>? {
        return withContext(Dispatchers.IO) {
            try {
                val drive = driveService ?: return@withContext null
                val folderId = findBackupFolder(drive) ?: return@withContext null
                
                val fileContent = downloadFile(drive, TRANSACTIONS_FILE_NAME, folderId)
                    ?: return@withContext null
                
                val type = object : TypeToken<List<Transaction>>() {}.type
                gson.fromJson<List<Transaction>>(fileContent, type)
            } catch (e: Exception) {
                e.printStackTrace()
                null
            }
        }
    }
    
    suspend fun restoreCategories(): List<Category>? {
        return withContext(Dispatchers.IO) {
            try {
                val drive = driveService ?: return@withContext null
                val folderId = findBackupFolder(drive) ?: return@withContext null
                
                val fileContent = downloadFile(drive, CATEGORIES_FILE_NAME, folderId)
                    ?: return@withContext null
                
                val type = object : TypeToken<List<Category>>() {}.type
                gson.fromJson<List<Category>>(fileContent, type)
            } catch (e: Exception) {
                e.printStackTrace()
                null
            }
        }
    }
    
    private fun getOrCreateBackupFolder(drive: Drive): String {
        return findBackupFolder(drive) ?: createBackupFolder(drive)
    }
    
    private fun findBackupFolder(drive: Drive): String? {
        return try {
            val result = drive.files().list()
                .setQ("name='$BACKUP_FOLDER_NAME' and mimeType='$MIME_TYPE_FOLDER' and trashed=false")
                .setSpaces("drive")
                .execute()
            
            result.files?.firstOrNull()?.id
        } catch (e: IOException) {
            e.printStackTrace()
            null
        }
    }
    
    private fun createBackupFolder(drive: Drive): String {
        val folderMetadata = File().apply {
            name = BACKUP_FOLDER_NAME
            mimeType = MIME_TYPE_FOLDER
        }
        
        val folder = drive.files().create(folderMetadata)
            .setFields("id")
            .execute()
        
        return folder.id
    }
    
    private fun uploadFile(
        drive: Drive,
        fileName: String,
        content: String,
        parentFolderId: String
    ): Boolean {
        return try {
            // Cek apakah file sudah ada
            val existingFileId = findFileInFolder(drive, fileName, parentFolderId)
            
            val fileMetadata = File().apply {
                name = fileName
                if (existingFileId == null) {
                    parents = listOf(parentFolderId)
                }
            }
            
            val mediaContent = ByteArrayContent(MIME_TYPE_JSON, content.toByteArray())
            
            if (existingFileId != null) {
                // Update file yang sudah ada
                drive.files().update(existingFileId, fileMetadata, mediaContent).execute()
            } else {
                // Buat file baru
                drive.files().create(fileMetadata, mediaContent)
                    .setFields("id")
                    .execute()
            }
            true
        } catch (e: IOException) {
            e.printStackTrace()
            false
        }
    }
    
    private fun downloadFile(drive: Drive, fileName: String, parentFolderId: String): String? {
        return try {
            val fileId = findFileInFolder(drive, fileName, parentFolderId) ?: return null
            
            val outputStream = ByteArrayOutputStream()
            drive.files().get(fileId).executeMediaAndDownloadTo(outputStream)
            outputStream.toString("UTF-8")
        } catch (e: IOException) {
            e.printStackTrace()
            null
        }
    }
    
    private fun findFileInFolder(drive: Drive, fileName: String, parentFolderId: String): String? {
        return try {
            val result = drive.files().list()
                .setQ("name='$fileName' and '$parentFolderId' in parents and trashed=false")
                .setSpaces("drive")
                .execute()
            
            result.files?.firstOrNull()?.id
        } catch (e: IOException) {
            e.printStackTrace()
            null
        }
    }
    
    suspend fun isConnected(): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                driveService?.about()?.get()?.execute() != null
            } catch (e: Exception) {
                false
            }
        }
    }
}