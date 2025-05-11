using Chums_Zann.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chums_Zann.Server.Controllers
{
    [ApiController]
    public class CategoriesController : Controller
    {
        private readonly IConfiguration _config;
        public CategoriesController(IConfiguration configuration)
        {
            _config = configuration;
        }

        [Route("api/[controller]/[action]")]
        public JsonResult GetPrimaries()
        {
            return Json(new Categories(_config).GetPrimaries());
        }

        [Route("api/[controller]/[action]")]
        public JsonResult CreatePrimary(string description)
        {
            return Json(new Categories(_config).CreatePrimary(description));
        }

        [Route("api/[controller]/[action]")]
        public JsonResult EditPrimary(long id, string description)
        {
            return Json(new Categories(_config).EditPrimary(id, description));
        }

        [Route("api/[controller]/[action]")]
        public JsonResult DeletePrimary(long id)
        {
            Categories categories = new Categories(_config);
            categories.DeletePrimary(id);
            return Json(categories.GetPrimaries());
        }

        [Route("api/[controller]/[action]")]
        public JsonResult GetSubs()
        {
            return Json(new Categories(_config).GetSubs());
        }

        [Route("api/[controller]/[action]")]
        public JsonResult CreateSub(long primId, string description)
        {
            return Json(new Categories(_config).CreateSub(primId, description));
        }

        [Route("api/[controller]/[action]")]
        public JsonResult EditSub(long id, long primId, string description)
        {
            return Json(new Categories(_config).EditSub(id, primId, description));
        }

        [Route("api/[controller]/[action]")]
        public JsonResult DeleteSub(long id)
        {
            Categories categories = new Categories(_config);
            categories.DeleteSub(id);
            return Json(categories.GetSubs());
        }
    }
}
