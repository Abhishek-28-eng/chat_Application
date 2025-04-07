const getDatabaseConnection = require("../config/db");

// ✅ Fetch subjects assigned to a teacher with subject names
exports.getTeacherSubjects = async (req, res) => {
  const { college_db, teacher_code } = req.params;

  // Connect to school and global databases
  const schoolDB = getDatabaseConnection(college_db); // School-specific DB
  const collegesDB = getDatabaseConnection("colleges"); // Global subjects DB

  try {
    // 1️⃣ Fetch assigned subject codes from `subject_teacher` table
    const [assignedSubjects] = await schoolDB.execute(
      `SELECT subject_code FROM subject_teacher WHERE teacher_code = ?`, 
      [teacher_code]
    );

    if (assignedSubjects.length === 0) {
      return res.status(404).json({ message: "No subjects assigned to this teacher." });
    }

    // 2️⃣ Extract subject codes
    const subjectCodes = assignedSubjects.map(row => row.subject_code);
    console.log("Subject Codes for Teacher:", subjectCodes);

    // 3️⃣ Fetch subject details (name, standard, division) from `Subject` table
    if (subjectCodes.length === 0) {
      return res.json({ subjects: [] }); // No subjects found
    }

    const placeholders = subjectCodes.map(() => "?").join(","); // Dynamic placeholders
    const [subjects] = await collegesDB.execute(
      `SELECT subject_code_prefixed AS subject_id, subject_name, stand, division  
       FROM Subject WHERE subject_code_prefixed IN (${placeholders})`, 
      subjectCodes
    );

    console.log("Fetched Subjects with Names:", subjects);

    res.json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Server error" });
  }
};
