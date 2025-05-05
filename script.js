document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'http://localhost:3000/employees';

    // Fetch and display employees
    function fetchEmployees() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('employee-table-body');
                tbody.innerHTML = ''; // Clear the table before adding new rows
                data.forEach(emp => {
                    const row = `
              <tr data-id="${emp.id}">
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${emp.salary}</td>
                <td>
                  <button class="edit-btn">Edit</button>
                  <button class="delete-btn">Delete</button>
                </td>
              </tr>
            `;
                    tbody.innerHTML += row;
                });

                // Attach event listeners to edit and delete buttons
                attachEventListeners();
            })
            .catch(err => console.error('Failed to load employees:', err));
    }

    // Function to attach event listeners for Edit and Delete buttons
    function attachEventListeners() {
        // Edit employee
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function () {
                const row = button.closest('tr');
                const id = row.dataset.id;
                const name = row.children[1].textContent;
                const position = row.children[2].textContent;
                const salary = row.children[3].textContent;

                // Pre-fill form with employee data
                document.getElementById('name').value = name;
                document.getElementById('position').value = position;
                document.getElementById('salary').value = salary;

                // Update form to send PUT request when submitting
                const form = document.getElementById('add-employee-form');
                form.onsubmit = function (event) {
                    event.preventDefault();
                    updateEmployee(id);
                };
            });
        });

        // Delete employee
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const row = button.closest('tr');
                const id = row.dataset.id;
                deleteEmployee(id);
            });
        });
    }

    // Add employee
    const addEmployeeForm = document.getElementById('add-employee-form');
    addEmployeeForm.onsubmit = function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const salary = document.getElementById('salary').value;

        const newEmployee = { name, position, salary };

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEmployee)
        })
            .then(res => res.json())
            .then(() => {
                fetchEmployees();
                addEmployeeForm.reset();
            })
            .catch(err => console.error('Failed to add employee:', err));
    };

    // Update employee
    function updateEmployee(id) {
        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const salary = document.getElementById('salary').value;

        const updatedEmployee = { name, position, salary };

        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEmployee)
        })
            .then(res => res.json())
            .then(() => {
                fetchEmployees();
                addEmployeeForm.reset();
            })
            .catch(err => console.error('Failed to update employee:', err));
    }

    // Delete employee
    function deleteEmployee(id) {
        fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                fetchEmployees();
            })
            .catch(err => console.error('Failed to delete employee:', err));
    }

    // Initially fetch and display employees
    fetchEmployees();
});
