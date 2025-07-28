package com.zeinflow.cashflow.service

import android.content.Context
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.api.client.extensions.android.http.AndroidHttp
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential
import com.google.api.client.json.gson.GsonFactory
import com.google.api.services.drive.Drive
import com.google.api.services.drive.DriveScopes
import com.google.api.services.drive.model.File
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.zeinflow.cashflow.data.model.Transaction
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.util.*

class GoogleDriveService(private val context: Context) {
    
    private val gson = Gson()
    private val appFolderName = "ZeinFlow"
    private val transactionsFileName = "transactions.json"
    private val backupFileName = "backup_${System.currentTimeMillis()}.json"
    
    private fun getDriveService(account: GoogleSignInAccount): Drive {
        val credential = GoogleAccountCredential.usingOAuth2(
            context,
            Collections.singleton(DriveScopes.DRIVE_FILE)
        ).apply {
            selectedAccount = account.account
        }
        
        return Drive.Builder(
            AndroidHttp.newCompatibleTransport(),
            GsonFactory(),
            credential
        )
            .setApplicationName("ZeinFlow")
            .build()
    }
    
    suspend fun syncTransactionToDrive(transaction: Transaction, account: GoogleSignInAccount) {
        withContext(Dispatchers.IO) {
            try {
                val driveService = getDriveService(account)
                val appFolder = getOrCreateAppFolder(driveService)
                val transactionsFile = getOrCreateTransactionsFile(driveService, appFolder.id)
                
                // Read existing transactions
                val existingTransactions = getTransactionsFromFile(driveService, transactionsFile.id)
                val updatedTransactions = existingTransactions.toMutableList()
                
                // Update or add transaction
                val existingIndex = updatedTransactions.indexOfFirst { it.id == transaction.id }
                if (existingIndex != -1) {
                    updatedTransactions[existingIndex] = transaction
                } else {
                    updatedTransactions.add(transaction)
                }
                
                // Write back to file
                writeTransactionsToFile(driveService, transactionsFile.id, updatedTransactions)
            } catch (e: Exception) {
                throw e
            }
        }
    }
    
    suspend fun deleteTransactionFromDrive(transactionId: Long, account: GoogleSignInAccount) {
        withContext(Dispatchers.IO) {
            try {
                val driveService = getDriveService(account)
                val appFolder = getOrCreateAppFolder(driveService)
                val transactionsFile = getOrCreateTransactionsFile(driveService, appFolder.id)
                
                // Read existing transactions
                val existingTransactions = getTransactionsFromFile(driveService, transactionsFile.id)
                val updatedTransactions = existingTransactions.filter { it.id != transactionId }
                
                // Write back to file
                writeTransactionsToFile(driveService, transactionsFile.id, updatedTransactions)
            } catch (e: Exception) {
                throw e
            }
        }
    }
    
    suspend fun getTransactionsFromDrive(account: GoogleSignInAccount): List<Transaction> {
        return withContext(Dispatchers.IO) {
            try {
                val driveService = getDriveService(account)
                val appFolder = getOrCreateAppFolder(driveService)
                val transactionsFile = getOrCreateTransactionsFile(driveService, appFolder.id)
                
                getTransactionsFromFile(driveService, transactionsFile.id)
            } catch (e: Exception) {
                emptyList()
            }
        }
    }
    
    suspend fun backupTransactionsToDrive(transactions: List<Transaction>, account: GoogleSignInAccount) {
        withContext(Dispatchers.IO) {
            try {
                val driveService = getDriveService(account)
                val appFolder = getOrCreateAppFolder(driveService)
                
                // Create backup file
                val backupFile = File().apply {
                    name = backupFileName
                    parents = listOf(appFolder.id)
                    mimeType = "application/json"
                }
                
                val createdFile = driveService.files().create(backupFile).execute()
                val jsonData = gson.toJson(transactions)
                val inputStream = ByteArrayInputStream(jsonData.toByteArray())
                
                driveService.files().update(createdFile.id, createdFile, inputStream).execute()
            } catch (e: Exception) {
                throw e
            }
        }
    }
    
    private fun getOrCreateAppFolder(driveService: Drive): File {
        // Try to find existing app folder
        val result = driveService.files().list()
            .setQ("name = '$appFolderName' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")
            .setSpaces("drive")
            .execute()
        
        if (result.files.isNotEmpty()) {
            return result.files[0]
        }
        
        // Create new app folder
        val folderMetadata = File().apply {
            name = appFolderName
            mimeType = "application/vnd.google-apps.folder"
        }
        
        return driveService.files().create(folderMetadata)
            .setFields("id")
            .execute()
    }
    
    private fun getOrCreateTransactionsFile(driveService: Drive, folderId: String): File {
        // Try to find existing transactions file
        val result = driveService.files().list()
            .setQ("name = '$transactionsFileName' and '$folderId' in parents and trashed = false")
            .setSpaces("drive")
            .execute()
        
        if (result.files.isNotEmpty()) {
            return result.files[0]
        }
        
        // Create new transactions file
        val fileMetadata = File().apply {
            name = transactionsFileName
            parents = listOf(folderId)
            mimeType = "application/json"
        }
        
        val emptyJson = "[]"
        val inputStream = ByteArrayInputStream(emptyJson.toByteArray())
        
        return driveService.files().create(fileMetadata, inputStream)
            .setFields("id")
            .execute()
    }
    
    private fun getTransactionsFromFile(driveService: Drive, fileId: String): List<Transaction> {
        val outputStream = driveService.files().get(fileId).executeMediaAsInputStream()
        val jsonString = outputStream.bufferedReader().use { it.readText() }
        
        return if (jsonString.isNotEmpty()) {
            val type = object : TypeToken<List<Transaction>>() {}.type
            gson.fromJson(jsonString, type) ?: emptyList()
        } else {
            emptyList()
        }
    }
    
    private fun writeTransactionsToFile(driveService: Drive, fileId: String, transactions: List<Transaction>) {
        val jsonData = gson.toJson(transactions)
        val inputStream = ByteArrayInputStream(jsonData.toByteArray())
        
        driveService.files().update(fileId, null, inputStream).execute()
    }
}