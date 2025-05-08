using Chums_Zann.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chums_Zann.Server.Controllers
{
    [Route("[controller]")]
    public class CategoriesController : Controller
    {
        [Route("[action]")]
        public JsonResult GetPrimaries()
        {
            return Json(Categories.GetPrimaries());
        }

        [Route("[action]")]
        public JsonResult CreatePrimary(string description)
        {
            return Json(Categories.CreatePrimary(description));
        }

        [Route("[action]")]
        public JsonResult EditPrimary(long id, string description)
        {
            return Json(Categories.EditPrimary(id, description));
        }

        [Route("[action]")]
        public JsonResult DeletePrimary(long id)
        {
            Categories.DeletePrimary(id);
            return Json(Categories.GetPrimaries());
        }

        [Route("[action]")]
        public JsonResult GetSubs()
        {
            return Json(Categories.GetSubs());
        }

        [Route("[action]")]
        public JsonResult CreateSub(long primId, string description)
        {
            return Json(Categories.CreateSub(primId, description));
        }

        [Route("[action]")]
        public JsonResult EditSub(long id, long primId, string description)
        {
            return Json(Categories.EditSub(id, primId, description));
        }

        [Route("[action]")]
        public JsonResult DeleteSub(long id)
        {
            Categories.DeleteSub(id);
            return Json(Categories.GetSubs());
        }
    }
}
