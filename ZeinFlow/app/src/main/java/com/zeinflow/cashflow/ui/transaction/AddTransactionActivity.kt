package com.zeinflow.cashflow.ui.transaction

import android.app.DatePickerDialog
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.zeinflow.cashflow.R
import com.zeinflow.cashflow.data.model.Category
import com.zeinflow.cashflow.data.model.Transaction
import com.zeinflow.cashflow.data.model.TransactionType
import com.zeinflow.cashflow.databinding.ActivityAddTransactionBinding
import com.zeinflow.cashflow.ZeinFlowApplication
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class AddTransactionActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAddTransactionBinding
    private var selectedDate: Date = Date()
    private var selectedCategory: Category? = null
    private val dateFormatter = SimpleDateFormat("dd/MM/yyyy", Locale("id"))

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddTransactionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar()
        setupDatePicker()
        setupCategorySpinner()
        setupClickListeners()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Tambah Transaksi"
        
        binding.toolbar.setNavigationOnClickListener {
            onBackPressed()
        }
    }

    private fun setupDatePicker() {
        binding.btnSelectDate.text = dateFormatter.format(selectedDate)
        
        binding.btnSelectDate.setOnClickListener {
            val calendar = Calendar.getInstance()
            calendar.time = selectedDate
            
            DatePickerDialog(
                this,
                { _, year, month, dayOfMonth ->
                    calendar.set(year, month, dayOfMonth)
                    selectedDate = calendar.time
                    binding.btnSelectDate.text = dateFormatter.format(selectedDate)
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
            ).show()
        }
    }

    private fun setupCategorySpinner() {
        lifecycleScope.launch {
            val categories = (application as ZeinFlowApplication)
                .categoryRepository
                .getCategoriesByType(TransactionType.EXPENSE)
                .first()
            
            val categoryNames = categories.map { it.name }
            val adapter = ArrayAdapter(this@AddTransactionActivity, android.R.layout.simple_spinner_item, categoryNames)
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            
            binding.spinnerCategory.adapter = adapter
            
            // Set default category
            if (categories.isNotEmpty()) {
                selectedCategory = categories[0]
            }
        }
    }

    private fun setupClickListeners() {
        binding.btnSave.setOnClickListener {
            saveTransaction()
        }
        
        // Update categories when transaction type changes
        binding.rgTransactionType.setOnCheckedChangeListener { _, checkedId ->
            val transactionType = when (checkedId) {
                R.id.rb_income -> TransactionType.INCOME
                R.id.rb_expense -> TransactionType.EXPENSE
                else -> TransactionType.EXPENSE
            }
            updateCategoriesForType(transactionType)
        }
    }

    private fun updateCategoriesForType(transactionType: TransactionType) {
        lifecycleScope.launch {
            val categories = (application as ZeinFlowApplication)
                .categoryRepository
                .getCategoriesByType(transactionType)
                .first()
            
            val categoryNames = categories.map { it.name }
            val adapter = ArrayAdapter(this@AddTransactionActivity, android.R.layout.simple_spinner_item, categoryNames)
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            
            binding.spinnerCategory.adapter = adapter
            
            if (categories.isNotEmpty()) {
                selectedCategory = categories[0]
            }
        }
    }

    private fun saveTransaction() {
        val amountText = binding.etAmount.text.toString()
        val description = binding.etDescription.text.toString()
        
        if (amountText.isEmpty()) {
            binding.etAmount.error = "Jumlah harus diisi"
            return
        }
        
        if (description.isEmpty()) {
            binding.etDescription.error = "Deskripsi harus diisi"
            return
        }
        
        val amount = amountText.toDoubleOrNull()
        if (amount == null || amount <= 0) {
            binding.etAmount.error = "Jumlah harus berupa angka positif"
            return
        }
        
        val transactionType = when (binding.rgTransactionType.checkedRadioButtonId) {
            R.id.rb_income -> TransactionType.INCOME
            R.id.rb_expense -> TransactionType.EXPENSE
            else -> TransactionType.EXPENSE
        }
        
        // Get selected category
        val selectedCategoryName = binding.spinnerCategory.selectedItem as String
        lifecycleScope.launch {
            val categories = (application as ZeinFlowApplication)
                .categoryRepository
                .getCategoriesByType(transactionType)
                .first()
            
            selectedCategory = categories.find { it.name == selectedCategoryName }
            
            if (selectedCategory == null) {
                Toast.makeText(this@AddTransactionActivity, "Kategori tidak ditemukan", Toast.LENGTH_SHORT).show()
                return@launch
            }
            
            val transaction = Transaction(
                amount = amount,
                description = description,
                type = transactionType,
                categoryId = selectedCategory!!.id,
                date = selectedDate
            )
            
            try {
                (application as ZeinFlowApplication).transactionRepository.insertTransaction(transaction)
                Toast.makeText(this@AddTransactionActivity, "Transaksi berhasil disimpan", Toast.LENGTH_SHORT).show()
                finish()
            } catch (e: Exception) {
                Toast.makeText(this@AddTransactionActivity, "Gagal menyimpan transaksi: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}