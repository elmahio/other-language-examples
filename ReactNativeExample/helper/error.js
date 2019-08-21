import elmahLogger from "./elmahLogger";

export const catchError = () => error => {

    ///Your custom error handler here

    alert(error);
    elmahLogger.log(error, error.severity || "Error",);
};
