namespace Chums_Zann.Server.Models
{
    public class SubCategory
    {
        public long Id { get; set; }
        public PrimaryCategory PrimaryCategory { get; set; }
        public string Description { get; set; }
    }
}
