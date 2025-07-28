package com.zeinflow.cashflow.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.zeinflow.cashflow.R
import com.zeinflow.cashflow.databinding.ActivityMainBinding
import com.zeinflow.cashflow.ui.auth.GoogleSignInActivity

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var googleSignInClient: GoogleSignInClient

    companion object {
        private const val RC_SIGN_IN = 9001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupGoogleSignIn()
        setupNavigation()
        checkSignInStatus()
    }

    private fun setupGoogleSignIn() {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestScopes(com.google.android.gms.common.api.Scope(com.google.api.services.drive.DriveScopes.DRIVE_FILE))
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)
    }

    private fun setupNavigation() {
        val navView: BottomNavigationView = binding.bottomNavigation
        val navController = findNavController(R.id.nav_host_fragment)
        
        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.navigation_dashboard,
                R.id.navigation_transactions,
                R.id.navigation_categories,
                R.id.navigation_reports,
                R.id.navigation_settings
            )
        )
        
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
    }

    private fun checkSignInStatus() {
        val account = GoogleSignIn.getLastSignedInAccount(this)
        if (account == null) {
            // User not signed in, redirect to sign in activity
            startActivity(Intent(this, GoogleSignInActivity::class.java))
            finish()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                // Handle successful sign in
            } catch (e: ApiException) {
                // Handle sign in failure
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        return findNavController(R.id.nav_host_fragment).navigateUp()
                || super.onSupportNavigateUp()
    }
}