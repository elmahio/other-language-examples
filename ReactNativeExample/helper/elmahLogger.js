import config from "../config";
import {getDevice, getAppVersion} from "./deviceInfo";

const SEVERITY_LEVEL = {
    Verbose: 1,
    Debug: 2,
    Warning: 3,
    Error: 4,
    Fatal: 5
};

function log(error, severity) {
    console.log({
        severity,
        detail: `${error.detail ? error.detail : error.message || error} \n Device: ${getDevice()}`,
        title: error.name || "Error",
        version: getAppVersion()
    })
    if (SEVERITY_LEVEL[severity] >= SEVERITY_LEVEL[config.LOG_MODE]) {
        fetch(
            `https://api.elmah.io/v3/messages/${config.ELMAH_LOG_ID}?api_key=${config.ELMAH_API_KEY}`,
            {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    severity,
                    detail: `${error.detail ? error.detail : error.message || error} \n Device: ${getDevice()}`,
                    title: error.name || "Error",
                    version: getAppVersion()
                })
            }
        );
    }
}

export default {
    log
};
