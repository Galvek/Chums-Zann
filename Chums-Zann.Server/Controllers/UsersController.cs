using Chums_Zann.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chums_Zann.Server.Controllers
{
    [Route("[controller]")]
    public class UsersController : Controller
    {
        private readonly IConfiguration _config;
        public UsersController(IConfiguration configuration)
        {
            _config = configuration;
        }

        [Route("[action]")]
        public JsonResult All()
        {
            return Json(new Users(_config).GetUsers());
        }

        [Route("[action]")]
        public JsonResult UserById(int id)
        {
            List<User> users = new Users(_config).GetUsers(id);
            return Json(users);
        }

        [Route("[action]")]
        public bool Create(string username, string password)
        {
            return new Users(_config).CreateNewUser(username, password);
        }

        [Route("[action]")]
        public bool Edit(long id, string password)
        {
            return new Users(_config).EditUser(id, password);
        }

        [Route("[action]")]
        public JsonResult Delete(long id)
        {
            Users users = new Users(_config);
            users.DeleteUser(id);
            return Json(users.GetUsers());
        }
    }
}
