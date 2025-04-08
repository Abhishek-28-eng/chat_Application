const getDatabaseConnection = require("../config/db");

exports.getUserNameById = async (req, res) => {
    const { college_db, role, id } = req.params;

    if (!college_db || !role || !id) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    const db = getDatabaseConnection(college_db);

    let table, idField, nameField;

    if (role === "student") {
        table = "Student";
        idField = "studentid";
        nameField = "Name"; // Case-sensitive based on your DB
    } else if (role === "teacher") {
        table = "teacher";
        idField = "teacher_code";
        nameField = "tname";
    } else {
        return res.status(400).json({ error: "Invalid role" });
    }

    try {
        const [rows] = await db.execute(
            `SELECT ${nameField} AS name FROM ${table} WHERE ${idField} = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ name: rows[0].name });
    } catch (err) {
        console.error("❌ Error fetching name:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
