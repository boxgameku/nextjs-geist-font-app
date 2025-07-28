package com.zeinflow.cashflow.ui.report

import android.app.DatePickerDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.zeinflow.cashflow.R
import com.zeinflow.cashflow.databinding.FragmentReportBinding
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class ReportFragment : Fragment() {

    private var _binding: FragmentReportBinding? = null
    private val binding get() = _binding!!
    
    private var startDate: Date = Date()
    private var endDate: Date = Date()
    private val dateFormatter = SimpleDateFormat("dd/MM/yyyy", Locale("id"))

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentReportBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupDatePickers()
        setupClickListeners()
    }

    private fun setupDatePickers() {
        binding.btnStartDate.text = dateFormatter.format(startDate)
        binding.btnEndDate.text = dateFormatter.format(endDate)
        
        binding.btnStartDate.setOnClickListener {
            showDatePicker(true)
        }
        
        binding.btnEndDate.setOnClickListener {
            showDatePicker(false)
        }
    }

    private fun showDatePicker(isStartDate: Boolean) {
        val calendar = Calendar.getInstance()
        calendar.time = if (isStartDate) startDate else endDate
        
        DatePickerDialog(
            requireContext(),
            { _, year, month, dayOfMonth ->
                calendar.set(year, month, dayOfMonth)
                val selectedDate = calendar.time
                
                if (isStartDate) {
                    startDate = selectedDate
                    binding.btnStartDate.text = dateFormatter.format(startDate)
                } else {
                    endDate = selectedDate
                    binding.btnEndDate.text = dateFormatter.format(endDate)
                }
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        ).show()
    }

    private fun setupClickListeners() {
        binding.btnGenerateReport.setOnClickListener {
            generateReport()
        }
        
        binding.btnExport.setOnClickListener {
            exportToDrive()
        }
    }

    private fun generateReport() {
        // TODO: Implement report generation
        Toast.makeText(requireContext(), "Generating report...", Toast.LENGTH_SHORT).show()
    }

    private fun exportToDrive() {
        // TODO: Implement export to Google Drive
        Toast.makeText(requireContext(), "Exporting to Google Drive...", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}