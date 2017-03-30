<?php

/*
 * 
 * It is very important to use try / catch in combination with this custom Logger Class, 
 * as in case of any errors & warnings script will stop executing without catch statement
 * 
 * Usage:
 *  Class Iinitialization: $Logger = new Logger();
 * 
 * Function Call:
 *  $Logger->Informaton("Your Custom Error Title", $e);
 *  $Logger->Warning("Your Custom Error Title", $e);
 *  $Logger->Error("Your Custom Error Title", $e);
 *  $Logger->Debug("Your Custom Error Title", $e);
 *  $Logger->Fatal("Your Custom Error Title", $e);
 * 
 *  $e is Exception parameter from Catch  -- try {} catch (Exception $e) {} --
 * 
 */


set_error_handler("customError", E_ERROR | E_WARNING | E_PARSE); // Enable Custom Error Handler

function customError($errorNo, $errorStr) {
    $Logger = new Logger();
    switch ($errorNo) {
        case '2' :
            $Logger->Warning($errorStr, "E_WARNING");
            break;
        case '4' :
            $Logger->Warning($errorStr, "E_PARSE");
            break;
        default :
            $Logger->Error($errorStr, "E_ERROR");
            break;
            
    }

    unset($Logger);
}

class Logger {

    private $elmahId = ""; // Log ID From Elmah settings page
    private $applicationName = ""; // Current Application Name

    public function Informaton($title, $exception) {
        $application = $this->applicationName;
        $this->logErrorElmahIO($title, $this->applicationName, $exception, "Information");
    }

    public function Fatal($title, $exception) {
        $application = $this->applicationName;
        $this->logErrorElmahIO($title, $this->applicationName, $exception, "Fatal");
    }

    public function Error($title, $exception) {
        $application = $this->applicationName;
        $this->logErrorElmahIO($title, $this->applicationName, $exception, "Error");
    }

    public function Warning($title, $exception) {
        $application = $this->applicationName;
        $this->logErrorElmahIO($title, $this->applicationName, $exception, "Warning");
    }

    public function Debug($title, $exception) {
        $application = $this->applicationName;
        $this->logErrorElmahIO($title, $this->applicationName, $exception, "Debug");
    }

    private function logErrorElmahIO($title, $application, $exception, $severity, $user = '') {

        $init = curl_init();
        $elmahId = $this->elmahId;


        $data = array(
            "title" => $title,
            "application" => $application,
            "hostname" => $_SERVER['HTTP_HOST'],
            "user" => $user, // Optional
            "url" => $_SERVER['REQUEST_URI'],
            "detail" => print_r($exception, true),
            "severity" => $severity
        );

        $data_string = json_encode($data);
        $log_string = "https://elmah.io/api/v2/messages?logid=$elmahId";

        curl_setopt($init, CURLOPT_URL, $log_string);
        curl_setopt($init, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($init, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($init, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($init, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string))
        );

        $result = curl_exec($init);

        curl_close($init);
    }

}
