using System;
using Android.App;
using Android.Content.PM;
using Android.Runtime;
using Elmah.Io.Client;
using Elmah.Io.Client.Models;

namespace App5
{
    [Application]
    public class MyApp : Application
    {
        private IElmahioAPI api;

        public MyApp(IntPtr javaReference, JniHandleOwnership transfer)
            : base(javaReference, transfer) { }

        public override void OnCreate()
        {
            base.OnCreate();
            AndroidEnvironment.UnhandledExceptionRaiser += MyApp_UnhandledExceptionHandler;
        }

        void MyApp_UnhandledExceptionHandler(object sender, RaiseThrowableEventArgs e)
        {
            var packageInfo = PackageManager.GetPackageInfo(PackageName, PackageInfoFlags.MetaData);

            // Do your error handling here.

            if (api == null)
            {
                api = ElmahioAPI.Create("API_KEY");
            }

            var exception = e.Exception;
            var baseException = exception?.GetBaseException();
            api.Messages.Create("LOG_ID", new CreateMessage
            {
                Data = exception?.ToDataList(),
                DateTime = DateTime.UtcNow,
                Detail = exception?.ToString(),
                Severity = "Error",
                Source = baseException?.Source,
                Title = baseException.Message ?? "Unhandled Xamarin exception",
                Type = baseException?.GetType().FullName,
                Version = packageInfo.VersionName,
                Application = packageInfo.PackageName,
            });
        }

        protected override void Dispose(bool disposing)
        {
            AndroidEnvironment.UnhandledExceptionRaiser -= MyApp_UnhandledExceptionHandler;
            base.Dispose(disposing);
        }
    }
}