using Chums_Zann.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chums_Zann.Server.Controllers
{
    [Route("[controller]")]
    public class CategoriesController : Controller
    {
        private readonly IConfiguration _config;
        public CategoriesController(IConfiguration configuration)
        {
            _config = configuration;
        }

        [Route("[action]")]
        public JsonResult GetPrimaries()
        {
            return Json(new Categories(_config).GetPrimaries());
        }

        [Route("[action]")]
        public JsonResult CreatePrimary(string description)
        {
            return Json(new Categories(_config).CreatePrimary(description));
        }

        [Route("[action]")]
        public JsonResult EditPrimary(long id, string description)
        {
            return Json(new Categories(_config).EditPrimary(id, description));
        }

        [Route("[action]")]
        public JsonResult DeletePrimary(long id)
        {
            Categories categories = new Categories(_config);
            categories.DeletePrimary(id);
            return Json(categories.GetPrimaries());
        }

        [Route("[action]")]
        public JsonResult GetSubs()
        {
            return Json(new Categories(_config).GetSubs());
        }

        [Route("[action]")]
        public JsonResult CreateSub(long primId, string description)
        {
            return Json(new Categories(_config).CreateSub(primId, description));
        }

        [Route("[action]")]
        public JsonResult EditSub(long id, long primId, string description)
        {
            return Json(new Categories(_config).EditSub(id, primId, description));
        }

        [Route("[action]")]
        public JsonResult DeleteSub(long id)
        {
            Categories categories = new Categories(_config);
            categories.DeleteSub(id);
            return Json(categories.GetSubs());
        }
    }
}
