
// Import built-in modules
const http = require('http');
const fs = require('fs');

// Create HTTP server
const server = http.createServer((req, res) => {

    // 1. Load CSS file
    if (req.url === '/style.css' && req.method === 'GET') {

        res.writeHead(200, {
            'Content-Type': 'text/css'
        });

        res.end(fs.readFileSync('style.css', 'utf8'));
    }

    // 2. Display student registration form
    else if (req.url === '/' && req.method === 'GET') {

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Management System</title>
            <link rel="stylesheet" href="/style.css">
        </head>

        <body>

            <div class="container">

                <h1>Student Records</h1>

                <p class="subtitle">
                    A little space to organize student details
                </p>

                <h2>Add New Student</h2>

                <form action="/add" method="POST">

                    <label>Student Name</label>
                    <input type="text" name="name"
                    placeholder="Enter your name" required>

                    <label>Roll Number</label>
                    <input type="text" name="roll"
                    placeholder="Enter roll number" required>

                    <label>Course</label>
                    <input type="text" name="course"
                    placeholder="Enter your course" required>

                    <label>Email Address</label>
                    <input type="email" name="email"
                    placeholder="Enter your email" required>

                    <button type="submit">
                        Add Student
                    </button>

                </form>

                <a href="/students">
                    View All Students →
                </a>

            </div>

        </body>
        </html>
        `);
    }

    // 3. Receive and save student information
    else if (req.url === '/add' && req.method === 'POST') {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {

            const data = new URLSearchParams(body);

            const student = {
                name: data.get('name'),
                roll: data.get('roll'),
                course: data.get('course'),
                email: data.get('email')
            };

            let students = [];

            // Read existing records
            if (fs.existsSync('students.json')) {
                students = JSON.parse(
                    fs.readFileSync('students.json', 'utf8')
                );
            }

            // Add new student
            students.push(student);

            // Save records
            fs.writeFileSync(
                'students.json',
                JSON.stringify(students, null, 2)
            );

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.end(`
                <html>
                <head>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <div class="container">
                        <h1>Successfully Added!</h1>
                        <p class="subtitle">
                            Student record saved successfully.
                        </p>
                        <a href="/">Add Another Student</a>
                        <a href="/students">View All Students</a>
                    </div>
                </body>
                </html>
            `);
        });
    }

    // 4. Display all student records
    else if (req.url === '/students' && req.method === 'GET') {

        let students = [];

        if (fs.existsSync('students.json')) {
            students = JSON.parse(
                fs.readFileSync('students.json', 'utf8')
            );
        }

        let output = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>All Students</title>
            <link rel="stylesheet" href="/style.css">
        </head>

        <body>
        <div class="container">

        <h1>Student Directory</h1>
        <p class="subtitle">Your student records in one place</p>
        `;

        students.forEach((student) => {

            output += `
                <div class="student">
                    <b>Name:</b> ${student.name}<br>
                    <b>Roll Number:</b> ${student.roll}<br>
                    <b>Course:</b> ${student.course}<br>
                    <b>Email:</b> ${student.email}
                </div>
            `;
        });

        output += `
            <a href="/">← Back to Home</a>
        </div>
        </body>
        </html>
        `;

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(output);
    }

    // 5. Handle invalid routes
    else {

        res.writeHead(404, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>404 - Page Not Found</h1>');
    }

});

// 6. Start server on port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
