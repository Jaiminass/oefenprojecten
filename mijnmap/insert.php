<?php
include 'db.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   
    $naam = $_POST['naam'] ?? '';
    $leeftijd = $_POST['leeftijd'] ?? '';
    $land = $_POST['land'] ?? '';
    $geslacht = $_POST['geslacht'] ?? '';
    $email = $_POST['email'] ?? '';
    $wachtwoord = $_POST['wachtwoord'] ?? '';
    $wachtwoord_hash = password_hash($wachtwoord, PASSWORD_DEFAULT);

    if (empty($naam) || empty($leeftijd) || empty($land) || empty($geslacht) || empty($email) || empty($wachtwoord)) {
        echo "Alle velden moeten worden ingevuld.";
    } elseif (!is_numeric($leeftijd) || $leeftijd < 0 || $leeftijd > 120) {
        echo "Voer een geldige leeftijd in.";
    } else {
        
        if ($stmt = $conn->prepare("INSERT INTO hoppie (naam, leeftijd, land, geslacht, email, wachtwoord) VALUES (?, ?, ?, ?, ?, ?)")) {
            $stmt->bind_param("sissss", $naam, $leeftijd, $land, $geslacht, $email, $wachtwoord_hash);

            if ($stmt->execute()) {
                echo "✅ Persoon succesvol toegevoegd!";
            } else {
                echo "❌ Fout bij uitvoeren van query: " . $stmt->error;
            }

            $stmt->close();
        } else {
            echo "❌ Fout bij voorbereiden van query: " . $conn->error;
        }
    }
}

$conn->close();
?>
