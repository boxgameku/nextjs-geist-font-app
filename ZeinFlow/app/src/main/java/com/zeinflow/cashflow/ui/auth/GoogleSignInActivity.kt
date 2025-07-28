package com.zeinflow.cashflow.ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.common.api.Scope
import com.google.api.services.drive.DriveScopes
import com.zeinflow.cashflow.R
import com.zeinflow.cashflow.databinding.ActivityGoogleSignInBinding
import com.zeinflow.cashflow.ui.MainActivity

class GoogleSignInActivity : AppCompatActivity() {

    private lateinit var binding: ActivityGoogleSignInBinding
    private lateinit var googleSignInClient: GoogleSignInClient

    companion object {
        private const val RC_SIGN_IN = 9001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGoogleSignInBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupGoogleSignIn()
        setupClickListeners()
    }

    private fun setupGoogleSignIn() {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestScopes(Scope(DriveScopes.DRIVE_FILE))
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)
    }

    private fun setupClickListeners() {
        binding.btnSignIn.setOnClickListener {
            signIn()
        }
    }

    private fun signIn() {
        val signInIntent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                handleSignInSuccess(account)
            } catch (e: ApiException) {
                handleSignInFailure(e)
            }
        }
    }

    private fun handleSignInSuccess(account: GoogleSignInAccount) {
        // Check if user has granted Drive permission
        if (GoogleSignIn.hasPermissions(account, Scope(DriveScopes.DRIVE_FILE))) {
            // Successfully signed in with Drive permission
            startMainActivity()
        } else {
            // User signed in but didn't grant Drive permission
            requestDrivePermission()
        }
    }

    private fun handleSignInFailure(e: ApiException) {
        val errorMessage = when (e.statusCode) {
            12501 -> "Sign in cancelled"
            12500 -> "Sign in failed"
            else -> "Sign in failed: ${e.statusCode}"
        }
        Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show()
    }

    private fun requestDrivePermission() {
        val signInIntent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    private fun startMainActivity() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }

    override fun onStart() {
        super.onStart()
        // Check if user is already signed in
        val account = GoogleSignIn.getLastSignedInAccount(this)
        if (account != null && GoogleSignIn.hasPermissions(account, Scope(DriveScopes.DRIVE_FILE))) {
            startMainActivity()
        }
    }
}