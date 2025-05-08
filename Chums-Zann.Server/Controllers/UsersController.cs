using Chums_Zann.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chums_Zann.Server.Controllers
{
    [Route("[controller]")]
    public class UsersController : Controller
    {
        [Route("[action]")]
        public JsonResult All()
        {
            return Json(Users.GetUsers());
        }

        [Route("[action]")]
        public JsonResult UserById(int id)
        {
            List<User> users = Users.GetUsers(id);
            return Json(users);
        }

        [Route("[action]")]
        public bool Create(string username, string password)
        {
            return Users.CreateNewUser(username, password);
        }

        [Route("[action]")]
        public bool Edit(long id, string password)
        {
            return Users.EditUser(id, password);
        }

        [Route("[action]")]
        public JsonResult Delete(long id)
        {
            Users.DeleteUser(id);
            return Json(Users.GetUsers());
        }
    }
}
