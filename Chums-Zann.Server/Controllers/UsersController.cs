using Chums_Zann.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chums_Zann.Server.Controllers
{
    [ApiController]
    public class UsersController : Controller
    {
        private readonly IConfiguration _config;
        public UsersController(IConfiguration configuration)
        {
            _config = configuration;
        }

        [Route("api/[controller]/[action]")]
        public JsonResult All()
        {
            return Json(new Users(_config).GetUsers());
        }

        [Route("api/[controller]/[action]")]
        public JsonResult UserById(int id)
        {
            List<User> users = new Users(_config).GetUsers(id);
            return Json(users);
        }

        [Route("api/[controller]/[action]")]
        public bool Create(string username, string password)
        {
            return new Users(_config).CreateNewUser(username, password);
        }

        [Route("api/[controller]/[action]")]
        public bool Edit(long id, string password)
        {
            return new Users(_config).EditUser(id, password);
        }

        [Route("api/[controller]/[action]")]
        public JsonResult Delete(long id)
        {
            Users users = new Users(_config);
            users.DeleteUser(id);
            return Json(users.GetUsers());
        }
    }
}
