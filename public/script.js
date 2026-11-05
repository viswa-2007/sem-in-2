
let editingId = null;

// DISPLAY MESSAGE
function showMessage(message) {
    document.getElementById("message").innerText = message;
}

// ADD OR UPDATE STUDENT
document.getElementById("studentForm")
.addEventListener("submit", async function(e) {

    e.preventDefault();

    const student = {
        rollNo: document.getElementById("rollNo").value.trim(),
        name: document.getElementById("name").value.trim(),
        age: Number(document.getElementById("age").value),
        course: document.getElementById("course").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    try {
        const url = editingId
            ? `/students/${editingId}`
            : "/students";

        const method = editingId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        showMessage(result.message);
        resetForm();
        loadStudents();

    } catch (error) {
        showMessage(error.message);
    }
});

// LOAD ALL STUDENTS
async function loadStudents() {

    try {
        const response = await fetch("/students");
        const students = await response.json();

        if (!response.ok) {
            throw new Error(students.message);
        }

        displayStudents(students);

    } catch (error) {
        showMessage(error.message);
    }
}

// DISPLAY STUDENTS
function displayStudents(students) {

    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    if (students.length === 0) {
        table.innerHTML =
            "<tr><td colspan='6'>No Students Found</td></tr>";
        return;
    }

    students.forEach(student => {

        const row = document.createElement("tr");

        [
            student.rollNo,
            student.name,
            student.age,
            student.course,
            student.email
        ].forEach(value => {

            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);

        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.className = "edit-btn";
        editButton.onclick = () => editStudent(student);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.onclick = () => deleteStudent(student._id);

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);
        table.appendChild(row);
    });
}

// SEARCH STUDENT
async function searchStudent() {

    const value = document.getElementById("searchValue").value.trim();
    const type = document.getElementById("searchType").value;

    if (!value) {
        showMessage("Please enter a search value");
        return;
    }

    try {
        const response = await fetch(
            `/students/search?${type}=${encodeURIComponent(value)}`
        );

        const students = await response.json();

        if (!response.ok) {
            throw new Error(students.message);
        }

        displayStudents(students);

        showMessage(students.length + " record(s) found");

    } catch (error) {
        showMessage(error.message);
    }
}

// EDIT STUDENT
function editStudent(student) {

    editingId = student._id;

    document.getElementById("rollNo").value = student.rollNo;
    document.getElementById("name").value = student.name;
    document.getElementById("age").value = student.age;
    document.getElementById("course").value = student.course;
    document.getElementById("email").value = student.email;

    document.getElementById("submitBtn").innerText =
        "Update Student";

    window.scrollTo(0, 0);
}

// DELETE STUDENT
async function deleteStudent(id) {

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {
        const response = await fetch(`/students/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        showMessage(result.message);
        loadStudents();

    } catch (error) {
        showMessage(error.message);
    }
}

// CLEAR FORM
function resetForm() {

    document.getElementById("studentForm").reset();

    editingId = null;

    document.getElementById("submitBtn").innerText =
        "Add Student";
}

// INITIAL LOAD
loadStudents();

