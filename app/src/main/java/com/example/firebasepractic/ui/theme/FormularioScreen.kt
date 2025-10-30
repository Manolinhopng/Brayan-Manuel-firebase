package com.example.firebasepractic.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.google.firebase.Firebase
import com.google.firebase.app
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.firestore

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FormularioScreen() {

    val db = Firebase.firestore(
        Firebase.app,
        "dbprincipal"
    )

    // Variables de estado
    var name by remember { mutableStateOf("") }
    var grade by remember { mutableStateOf("") }
    var message by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Registrar estudiante", style = MaterialTheme.typography.headlineMedium)

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Nombre") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = grade,
            onValueChange = { grade = it },
            label = { Text("Grado") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(onClick = {
            if (name.isNotBlank() && grade.isNotBlank()) {
                val data = hashMapOf(
                    "name" to name,
                    "grade" to grade
                )

                db.collection("students")
                    .add(data)
                    .addOnSuccessListener {
                        message = "Estudiante guardado correctamente ✅"
                        name = ""
                        grade = ""
                    }
                    .addOnFailureListener {
                        message = "Error al guardar ❌"
                    }
            } else {
                message = "Por favor completa todos los campos ⚠️"
            }
        }) {
            Text("Guardar")
        }

        Spacer(modifier = Modifier.height(16.dp))
        Text(text = message)
    }
}
