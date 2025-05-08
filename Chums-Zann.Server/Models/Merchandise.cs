namespace Chums_Zann.Server.Models
{
    public class Merchandise
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Image { get; set; }
        public PrimaryCategory PrimCategory { get; set; }
        public SubCategory SubCategory { get; set; }
        public bool OutOfStock { get; set; }
        public bool OnSale { get; set; }
        public decimal SalePrice { get; set; }
        public string SaleDescription { get; set; }
    }
}
