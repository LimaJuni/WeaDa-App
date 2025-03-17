<?php
// Update with your InfinityFree database credentials
define('DB_HOST', 'sql113.infinityfree.com'); // Usually something like sql.infinityfree.com
define('DB_USER', 'if0_38375915');    // From step 4
define('DB_PASS', 'WeaDa123');    // From step 4
define('DB_NAME', 'if0_38375915_weada_db');        // From step 4

// Create database connection
try {
    $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?> 