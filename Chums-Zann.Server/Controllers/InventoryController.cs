using Microsoft.AspNetCore.Mvc;
using Chums_Zann.Server.Models;

namespace Chums_Zann.Server.Controllers
{
    [Route("[controller]")]
    public class InventoryController : Controller
    {
        [Route("")]
        public JsonResult Get(long primCategory = 0, long subCategory = 0)
        {
            return Json(Inventory.GetInventory(primCategory, subCategory));
        }

        [Route("[action]")]
        [HttpPost]
        public JsonResult AddItem([FromBody] Merchandise merch)
        {
            return Json(Inventory.CreateItem(merch));
        }

        [Route("[action]")]
        [HttpPost]
        public JsonResult EditItem([FromBody] Merchandise merch)
        {
            return Json(Inventory.EditItem(merch));
        }

        [Route("[action]")]
        public JsonResult DeleteItem([FromBody] long id)
        {
            Inventory.DeleteItem(id);
            return Json(Inventory.GetInventory());
        }
    }
}
