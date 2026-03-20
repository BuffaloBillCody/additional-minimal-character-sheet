<?php

define('ROOT_DIR', dirname(__DIR__));

require ROOT_DIR . '/vendor/autoload.php';

$pdo = new PDO('sqlite:'.ROOT_DIR.'/data/db.sqlite3');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec('PRAGMA foreign_keys = ON;');

// Get existing columns to check what needs to be added
$stmt = $pdo->query('PRAGMA table_info(sheet);');
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
$columnNames = array_column($columns, 'name');

// Add system column if it doesn't exist
if (!in_array('system', $columnNames)) {
    echo "Adding 'system' column to 'sheet' table...\n";
    $pdo->exec('ALTER TABLE "sheet" ADD COLUMN "system" text DEFAULT "dnd5e_2014";');
}

// Migrate data based on is_2024
echo "Migrating existing sheets to new system identifiers...\n";
$pdo->exec("UPDATE \"sheet\" SET \"system\" = 'dnd5e_2024' WHERE \"is_2024\" = 1;");
$pdo->exec("UPDATE \"sheet\" SET \"system\" = 'dnd5e_2014' WHERE \"is_2024\" = 0 OR \"is_2024\" IS NULL;");

echo "Migration complete.\n";

exit;
