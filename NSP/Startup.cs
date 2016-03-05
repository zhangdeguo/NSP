using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(NSP.Startup))]
namespace NSP
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
