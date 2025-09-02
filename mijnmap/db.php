<?php
// Databasegegevens
$host = '#';
$user = '#';
$pass = '#'; 
$db   = 'oefenen';  

// Maak verbinding met de database
$conn = new mysqli($host, $user, $pass, $db);

// Controleer de verbinding
if ($conn->connect_error) {
   
    die("Verbinding met de database is mislukt.");
}

$conn->set_charset("utf8mb4");
?>
