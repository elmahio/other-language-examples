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
        public MyApp(IntPtr javaReference, JniHandleOwnership transfer)
            : base(javaReference, transfer) { }

        public override void OnCreate()
        {
            base.OnCreate();
            AndroidEnvironment.UnhandledExceptionRaiser += MyApp_UnhandledExceptionHandler;
        }

        void MyApp_UnhandledExceptionHandler(object sender, RaiseThrowableEventArgs e)
        {
            var api = ElmahioAPI.Create("API_KEY");

            var packageInfo = PackageManager.GetPackageInfo(PackageName, PackageInfoFlags.MetaData);

            // Do your error handling here.

            api.Messages.Create("LOG_ID", new CreateMessage
            {
                Data = e.Exception.ToDataList(),
                DateTime = DateTime.UtcNow,
                Detail = e.Exception.ToString(),
                Severity = "Error",
                Source = e.Exception.Source,
                Title = e.Exception.Message,
                Type = e.Exception.GetType().FullName,
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