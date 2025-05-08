using Chums_Zann.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chums_Zann.Server.Controllers
{
    [Route("[controller]")]
    public class LoginController : Controller
    {
        [Route("[action]")]
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
            string result = Login.ValidateLogin(username, password);

            return Json(new
            {
                Username = username,
                token = result,
                validated = !string.IsNullOrEmpty(result)
            });
#endif
        }

        [Route("[action]")]
        public bool ValidateToken(string username, string token)
        {
#if DEBUG
            return true;
#else
            return Login.ValidateToken(username, token);
#endif
        }
    }
}
