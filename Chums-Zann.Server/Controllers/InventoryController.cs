using Microsoft.AspNetCore.Mvc;
using Chums_Zann.Server.Models;

namespace Chums_Zann.Server.Controllers
{
    [ApiController]
    public class InventoryController : Controller
    {
        private readonly IConfiguration _config;
        public InventoryController(IConfiguration configuration)
        {
            _config = configuration;
        }

        [Route("api/[controller]/[action]")]
        public JsonResult Get(long primCategory = 0, long subCategory = 0)
        {
            return Json(new Inventory(_config).GetInventory(primCategory, subCategory));
        }

        [Route("api/[controller]/[action]")]
        [HttpPost]
        public JsonResult AddItem([FromBody] Merchandise merch)
        {
            return Json(new Inventory(_config).CreateItem(merch));
        }

        [Route("api/[controller]/[action]")]
        [HttpPost]
        public JsonResult EditItem([FromBody] Merchandise merch)
        {
            return Json(new Inventory(_config).EditItem(merch));
        }

        [Route("api/[controller]/[action]")]
        public JsonResult DeleteItem([FromBody] long id)
        {
            Inventory inventory = new Inventory(_config);
            inventory.DeleteItem(id);
            return Json(inventory.GetInventory());
        }
    }
}
