using Chums_Zann.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chums_Zann.Server.Controllers
{
    [ApiController]
    public class LoginController : Controller
    {
        private readonly IConfiguration _config;
        public LoginController(IConfiguration configuration)
        {
            _config = configuration;
        }

        [Route("api/[controller]/[action]")]
        public JsonResult Validate(string username, string password)
        {
#if DEBUG
            return Json(new
            {
                Username = "DEBUG USER",
                token = "",
                validated = true
            });
#else
            string result = new Login(_config).ValidateLogin(username, password);

            return Json(new
            {
                Username = username,
                token = result,
                validated = !string.IsNullOrEmpty(result)
            });
#endif
        }

        [Route("api/[controller]/[action]")]
        public bool ValidateToken(string username, string token)
        {
#if DEBUG
            return true;
#else
            return new Login(_config).ValidateToken(username, token);
#endif
        }
    }
}
