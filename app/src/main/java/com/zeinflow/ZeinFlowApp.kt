package com.zeinflow

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.zeinflow.ui.theme.ZeinFlowTheme

@Composable
fun ZeinFlowApp() {
    ZeinFlowTheme {
        Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
            val navController = rememberNavController()
            ZeinFlowNavGraph(navController = navController)
        }
    }
}

@Composable
fun ZeinFlowNavGraph(navController: NavHostController) {
    NavHost(navController, startDestination = "dashboard") {
        composable("dashboard") {
            // TODO: DashboardScreen()
        }
        composable("transactions") {
            // TODO: TransactionsScreen()
        }
        composable("categories") {
            // TODO: CategoriesScreen()
        }
        composable("reports") {
            // TODO: ReportsScreen()
        }
    }
}