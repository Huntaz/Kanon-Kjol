<?php
function db_fetch_rows($result) {
  $rows = array();
  while($obj = mysqli_fetch_object($result)) {
  $rows[] = $obj;
  }
return $rows;
}

function db_connect($create) {

    // Define connection as a static variable, to avoid connecting more than once
    static $connection;

    // Try and connect to the database, if a connection has not been established yet
    if(!isset($connection)) {
         // Load configuration as an array. Use the actual location of your configuration file
        $config = parse_ini_file('../../Db_connection/configDB.ini');
        if ($create) {
          $connection = mysqli_connect('localhost:3307',$config['username'],$config['password']);
        } else {
          $connection = mysqli_connect('localhost:3307',$config['username'],$config['password'],$config['dbname']);
        }
    }

    // If connection was not successful, handle the error
    if($connection === false) {
        // Handle error - notify administrator, log to a file, show an error screen, etc.
        return mysqli_connect_error();
    }
    return $connection;
}

function db_query($query) {
    $connection = db_connect(false);
    $result = mysqli_query($connection,$query);
    return $result;
}

function db_query_ID($query) {
    $connection = db_connect(false);
    $result = mysqli_query($connection,$query);
    if ($result) {
      return mysqli_insert_id($connection);
    }
    else {
      return -1;
    }
}

function db_error() {
    $connection = db_connect(false);
    return mysqli_error($connection);
}
 ?>
