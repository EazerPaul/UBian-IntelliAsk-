<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "intelliask";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle Save Request
if ($_POST['action'] === 'save') {
    $title = $_POST['title'];
    $message = $_POST['message'];
    $category = $_POST['category'];
    $created_at = date('Y-m-d H:i:s');
    $photo_path = '';

    // Handle File Upload
    if (!empty($_FILES['photo']['name'])) {
        $targetDir = "uploads/";
        $photo_path = $targetDir . basename($_FILES['photo']['name']);
        move_uploaded_file($_FILES['photo']['tmp_name'], $photo_path);
    }

    $sql = "INSERT INTO updates (title, message, photo_path, category, created_at)
            VALUES ('$title', '$message', '$photo_path', '$category', '$created_at')";
    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Handle Delete Request
if ($_POST['action'] === 'delete') {
    $id = $_POST['id'];
    $sql = "DELETE FROM updates WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully";
    } else {
        echo "Error deleting record: " . $conn->error;
    }
}

$conn->close();
?>
