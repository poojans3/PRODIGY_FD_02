const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));



// Create DB connection
const db = mysql.createConnection({
    user: 'root',
    password: 'Sachin#5',
    host: 'localhost',
    database: "employee_management"
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');

});

// db.query('create database employee_management', (err, results) => {
//     if (err) console.log(err);
//     console.log("Created Database");
// })




app.post('/employees', (req, res) => {
    const { name, position, salary } = req.body;
    db.query(
        'INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)',
        [name, position, salary],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Employee added', employeeId: result.insertId });
        }
    );
});

// READ - Get all employees
app.get('/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.get('/', (req, res) => {
    res.send('API is working!');
});


// UPDATE - Update employee by ID
app.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, position, salary } = req.body;
    db.query(
        'UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?',
        [name, position, salary, id],

        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Employee updated' });
        }
    );
});

// DELETE - Delete employee by ID
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Employee deleted' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// Insert dummy data if table is empty
db.query('SELECT COUNT(*) AS count FROM employees', (err, results) => {
    if (err) throw err;

    if (results[0].count === 0) {
        const dummyData = [
            ['Rahul Sharma', 'Software Engineer', 60000.00],
            ['Priya Singh', 'HR Manager', 55000.00],
            ['Amit Verma', 'Sales Executive', 45000.00],
            ['Sneha Reddy', 'UI/UX Designer', 50000.00],
            ['Karan Patel', 'Backend Developer', 65000.00],
        ];

        db.query(
            'INSERT INTO employees (name, position, salary) VALUES ?',
            [dummyData],
            (err, result) => {
                if (err) throw err;
                console.log('Dummy data inserted');
            }
        );
    } else {
        console.log('Dummy data already exists');
    }
});
