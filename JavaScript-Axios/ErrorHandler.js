//ELMAH.IO error Handler:

export class ElmahIoApiUrls 
{ 
    public static CreateMessage(logId: string) 
    { 
        return "https://elmah.io/api/v2/messages?logId=" + logId; 
    } 
}

export class ErrorHandler
{
//Called from React executing root
    public static BindOnError()
    {
        window.onerror = (message) =>
        {
            ErrorHandler.LogJavascriptError(message);
        };
    }


    public static LogJavascriptError(message: string)
    {
        var messageUrl = Common.ElmahIoApiUrls.CreateMessage(elmahExternalLogId);
        axios.post(messageUrl, {
            title: message,
            url: window.location.href,
            severity: "Error"
        });
    }

    public static LogFailedRequest(requestUrl: string, statusCode: number, data: string)
    {
        var messageUrl = Common.ElmahIoApiUrls.CreateMessage(elmahExternalLogId);
        axios.post(messageUrl, {
            title: "Bad Response - " + statusCode,
            url: window.location.href,
            source: requestUrl,
            severity: "Fatal",
            detail: data
        });
    }


}


//Tie the ErrorHandler into Axios: 

public static ConfigureAxios = (): void =>
    {
        // Add a response interceptor
        axios.interceptors.response.use(response =>
            {
                Helpers.checkAjaxResponse(response);
                return response;
            }, error =>
            {
                Helpers.checkAjaxResponse(error.response);
                return Promise.reject(error);
            });
    };

    private static checkAjaxResponse = (response: any) =>
    {
        if(response.status == 401 || response.status == 403)
        {
            axios.post(Common.AccountApiUrls.Logout);
            window.location.href = "/Account/Login";
        }
        //not true, I've seen null responses
        if(response == null || response.status > 403)
        {
            ErrorHandler.LogFailedRequest(response.config.url, response.status, response.data);
        }
    };