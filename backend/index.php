<?php

use \PDO;

try {
    $db = new PDO('mysql:host=localhost;dbname=students', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
} catch (\PDOException $e) {
    die('Erreur de la db: '.$e->getMessage());
}

require_once 'headers.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $query = $db->prepare('SELECT * FROM students WHERE id = ?');
        $query->execute([$id]);
        if ($data = $query->fetch(PDO::FETCH_ASSOC)) {
            unset($data->password);
            exit(json_encode($data));
        } else {
            exit(json_encode(['error' => 'Le student est inexistant !']));
        }
    } else if (isset($_GET['q']) && $_GET['q'] === 'students') {
        $query = $db->prepare('SELECT id, name, email, created_at FROM students');
        $query->execute();
        if ($data = $query->fetchAll()) {
            exit(json_encode($data));
        } else {
            exit(json_encode(['error' => 'Aucun student present !']));
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['q'] === 'students') {
    $data = json_decode(file_get_contents("php://input"));
    $password = password_hash($data->password, PASSWORD_BCRYPT);

    $query = $db->prepare('INSERT INTO students (name, email, password) VALUE (:name, :email, :password)');
    $query->bindParam('email', $data->email);
    $query->bindParam('name', $data->name);
    $query->bindParam('password', $password);
    if ($query->execute()) {
        $data->id = $db->lastInsertId();
        exit(json_encode([
            'success' => 'Le student a bien ete cree !',
            'data' => $data
        ]));
    } else {
        exit(json_encode(['error' => 'Une erreur inatendue s\'est produite lors de la creation du student !']));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $_GET['q'] === 'students') {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $query = $db->prepare('SELECT * FROM students WHERE id = ?');
        $query->execute([$id]);

        if ($item = $query->fetch()) {
            $data = json_decode(file_get_contents("php://input"));
            if ($data->password) {
                $password = password_hash($data->password, PASSWORD_BCRYPT);
                unset($data->password);
            } else {
                $password = $item->password;
            }

            $query = $db->prepare('UPDATE students SET name = :name, email = :email, password = :password WHERE id = ' . $id);
            $query->bindParam(':email', $data->email);
            $query->bindParam(':name', $data->name);
            $query->bindParam(':password', $password);

            if ($query->execute()) {
                exit(json_encode([
                    'success' => 'Le student a bien ete modifie !',
                    'data' => $data
                ]));
            } else {
                exit(json_encode(['error' => 'Une erreur inatendue s\'est produite lors de la modification du student !']));
            }
        } else {
            exit(json_encode(['error' => 'Le student est inexistant !']));
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $_GET['q'] === 'students') {
    if (isset($_GET['id'])) {
        $query = $db->prepare('DELETE FROM students WHERE id = ?');
        if ($query->execute([$_GET['id']])) {
            exit(json_encode(['success' => 'Le student a bien ete supprime !']));
        } else {
            exit(json_encode(['error' => 'Le student est inexistant !']));
        }
    }
}
