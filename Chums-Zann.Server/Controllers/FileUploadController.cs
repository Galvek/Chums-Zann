using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace Chums_Zann.Server.Controllers
{
    [ApiController]
    public class FileUploadController : Controller
    {
        [Route("api/[controller]/[action]")]
        public async Task<JsonResult> Save()
        {
            using var memoryStream = new MemoryStream();
            await Request.Form.Files[0].CopyToAsync(memoryStream);
            return Json(Convert.ToBase64String(memoryStream.ToArray()));
        }
    }
}
