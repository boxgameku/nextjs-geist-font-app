package com.zeinflow.data

import android.util.Log
import com.google.api.services.drive.Drive
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject

class DriveRepository @Inject constructor(
    private val driveService: Drive
) {
    private val fileName = "zeinflow_data.json"

    suspend fun ensureDataFileId(): String = withContext(Dispatchers.IO) {
        // TODO: find or create file in appDataFolder, return fileId
        Log.d("DriveRepository", "ensureDataFileId not yet implemented")
        ""
    }

    suspend fun download(): String = withContext(Dispatchers.IO) {
        // TODO: download file content as String
        "{}"
    }

    suspend fun upload(content: String) = withContext(Dispatchers.IO) {
        // TODO: upload updated content
    }
}