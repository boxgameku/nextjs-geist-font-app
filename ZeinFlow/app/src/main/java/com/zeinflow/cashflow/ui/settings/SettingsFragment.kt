package com.zeinflow.cashflow.ui.settings

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.zeinflow.cashflow.ZeinFlowApplication
import com.zeinflow.cashflow.databinding.FragmentSettingsBinding
import com.zeinflow.cashflow.ui.auth.GoogleSignInActivity
import kotlinx.coroutines.launch

class SettingsFragment : Fragment() {

    private var _binding: FragmentSettingsBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var googleSignInClient: GoogleSignInClient

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupGoogleSignIn()
        setupUserInfo()
        setupClickListeners()
    }

    private fun setupGoogleSignIn() {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .build()

        googleSignInClient = GoogleSignIn.getClient(requireActivity(), gso)
    }

    private fun setupUserInfo() {
        val account = GoogleSignIn.getLastSignedInAccount(requireContext())
        account?.let {
            binding.tvUserEmail.text = it.email
        }
    }

    private fun setupClickListeners() {
        binding.btnSyncToDrive.setOnClickListener {
            syncToDrive()
        }
        
        binding.btnSyncFromDrive.setOnClickListener {
            syncFromDrive()
        }
        
        binding.btnBackupData.setOnClickListener {
            backupData()
        }
        
        binding.btnRestoreData.setOnClickListener {
            restoreData()
        }
        
        binding.btnSignOut.setOnClickListener {
            signOut()
        }
    }

    private fun syncToDrive() {
        lifecycleScope.launch {
            try {
                val account = GoogleSignIn.getLastSignedInAccount(requireContext())
                if (account != null) {
                    // TODO: Implement sync to drive
                    Toast.makeText(requireContext(), "Sinkronisasi ke Drive berhasil", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(requireContext(), "Silakan masuk terlebih dahulu", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Gagal sinkronisasi: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun syncFromDrive() {
        lifecycleScope.launch {
            try {
                val account = GoogleSignIn.getLastSignedInAccount(requireContext())
                if (account != null) {
                    // TODO: Implement sync from drive
                    Toast.makeText(requireContext(), "Sinkronisasi dari Drive berhasil", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(requireContext(), "Silakan masuk terlebih dahulu", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Gagal sinkronisasi: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun backupData() {
        lifecycleScope.launch {
            try {
                val account = GoogleSignIn.getLastSignedInAccount(requireContext())
                if (account != null) {
                    // TODO: Implement backup
                    Toast.makeText(requireContext(), "Backup data berhasil", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(requireContext(), "Silakan masuk terlebih dahulu", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Gagal backup: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun restoreData() {
        lifecycleScope.launch {
            try {
                val account = GoogleSignIn.getLastSignedInAccount(requireContext())
                if (account != null) {
                    // TODO: Implement restore
                    Toast.makeText(requireContext(), "Restore data berhasil", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(requireContext(), "Silakan masuk terlebih dahulu", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Gagal restore: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun signOut() {
        googleSignInClient.signOut().addOnCompleteListener {
            val intent = Intent(requireContext(), GoogleSignInActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}