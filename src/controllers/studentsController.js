const admin = require('firebase-admin');
const db = admin.firestore();

exports.getAllStudents = async (req, res) => {
  try {
    const studentsSnapshot = await db.collection('students').get();
    const students = [];

    studentsSnapshot.forEach(doc => {
      students.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, count: students.length, data: students });

  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};


exports.getStudentById = async (req, res) => {
  try {
    const doc = await db.collection('students').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'No encontrado', message: 'ID no válido' });
    }

    res.json({ success: true, data: { id: doc.id, ...doc.data() } });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};


exports.createStudent = async (req, res) => {
  try {
    const { name, grade } = req.body;

    if (!name || !grade) {
      return res.status(400).json({ error: 'Faltan campos', message: 'name y grade son obligatorios' });
    }

    const docRef = await db.collection('students').add({
      name: name.trim(),
      grade: grade.trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ success: true, message: 'Estudiante agregado', id: docRef.id });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};


exports.updateStudent = async (req, res) => {
  try {
    const docRef = db.collection('students').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'No encontrado', message: 'ID no válido' });
    }

    await docRef.update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: 'Estudiante actualizado' });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const docRef = db.collection('students').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'No encontrado', message: 'ID no válido' });
    }

    await docRef.delete();
    res.json({ success: true, message: 'Estudiante eliminado' });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};
