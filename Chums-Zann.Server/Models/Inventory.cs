using Microsoft.Data.SqlClient;
using System.Data;
using System.Text;

namespace Chums_Zann.Server.Models
{
    public class Inventory
    {
        private readonly IConfiguration Configuration;
        private readonly string ConnStr;
        public Inventory(IConfiguration configuration)
        {
            Configuration = configuration;
            ConnStr = Configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        public List<Merchandise> GetInventory(long primaryCategory = 0, long subCategory = 0)
        {
            List<Merchandise> inventory = [];

            string query = 
                @"SELECT m.[id],m.[name],m.[description], " +
                 "   m.[price],m.[image],m.[category],pc.[description]," +
                 "   m.[subcategory], sc.[description], m.[onsale], m.[outofstock]," +
                 "   m.[saleprice], m.[saledescription]" +
                 " FROM [Inventory].[dbo].[Merchandise] AS m" +
                 " LEFT JOIN [Inventory].[dbo].[PrimaryCategory] AS pc ON pc.[id] = m.[category]" +
                 " LEFT JOIN [Inventory].[dbo].[SubCategory] AS sc ON sc.[id] = m.[subcategory]";

            if (primaryCategory > 0 || subCategory > 0)
            {
                query += " WHERE";
                if (primaryCategory > 0)
                {
                    query += " m.[category] = @primCat";
                }
                if (subCategory > 0)
                {
                    if (primaryCategory > 0) query += " AND";
                    query += " m.[subCategory] = @subCat";
                }
            }
            query += " ORDER BY m.[name];";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    if (primaryCategory > 0) cmd.Parameters.AddWithValue("@primCat", primaryCategory);
                    if (subCategory > 0) cmd.Parameters.AddWithValue("subCat", subCategory);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Merchandise merch = new Merchandise()
                            {
                                Id = reader.GetInt64(0),
                                Name = reader.GetString(1),
                                Description = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                Price = reader.GetDecimal(3),
                                Image = reader.IsDBNull(4) ? "" : Convert.ToBase64String(reader.GetValue(4) as byte[] ?? []),
                                PrimCategory = reader.IsDBNull(6) ? new() : new()
                                {
                                    Id = reader.GetInt64(5),
                                    Description = reader.GetString(6)
                                },
                                SubCategory = reader.IsDBNull(8) ? new() : new()
                                {
                                    Id = reader.GetInt64(7),
                                    PrimaryCategory = reader.IsDBNull(6) ? new() : new()
                                    {
                                      Id = reader.GetInt64(5), //adding primary category here is meh and annoying, FIX AT SOME POINT PLEASE
                                      Description = reader.GetString(6)
                                    },
                                    Description = reader.GetString(8)
                                },
                                OnSale = reader.GetBoolean(9),
                                OutOfStock = reader.GetBoolean(10),
                                SalePrice = reader.GetDecimal(11),
                                SaleDescription = reader.IsDBNull(12) ? "" : reader.GetString(12)
                            };
                            inventory.Add(merch);
                        }
                    }
                }
            }
            catch (Exception e)
            {

            }

            return inventory;
        }

        public bool CreateItem(Merchandise merch)
        {
            string query =
                @"SELECT COUNT([id])" +
                 " FROM [Inventory].[dbo].[Merchandise]" +
                 " WHERE [name] = @name;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@name", merch.Name);
                    if ((int)cmd.ExecuteScalar() > 0)
                        return false;
                }
            }
            catch(Exception e)
            {
                return false;
            }

            query =
                "INSERT INTO [Inventory].[dbo].[Merchandise]" +
                " ([Name], [Description], [Price], [Image], [Category], [SubCategory],[OnSale],[OutOfStock],[SalePrice],[SaleDescription])" +
                " VALUES" +
                " (@name, @desc, @price, @img, @primCat, @subCat, @sale, @stock, @saleprice, @saleDesc);";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@name", merch.Name);
                    cmd.Parameters.AddWithValue("@desc", merch.Description);
                    cmd.Parameters.AddWithValue("@price", merch.Price);
                    cmd.Parameters.Add("@img", SqlDbType.VarBinary).Value = Convert.FromBase64String(merch.Image);
                    cmd.Parameters.AddWithValue("@primCat", merch.PrimCategory.Id);
                    cmd.Parameters.AddWithValue("@subCat", merch.SubCategory.Id);
                    cmd.Parameters.AddWithValue("@sale", merch.OnSale);
                    cmd.Parameters.AddWithValue("@stock", merch.OutOfStock);
                    cmd.Parameters.AddWithValue("@saleprice", merch.SalePrice);
                    cmd.Parameters.AddWithValue("@saleDesc", merch.SaleDescription);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                return false;
            }

            return true;
        }

        public bool EditItem(Merchandise merch)
        {
            string query =
                "UPDATE [Inventory].[dbo].[Merchandise]" +
                " SET [Name] = @name, [Description] = @desc, [Price] = @price, [Image] = @img, [Category] = @primCat," +
                "     [SubCategory] = @subCat, [OnSale] = @sale, [OutOfStock] = @stock, [SalePrice] = @saleprice," +
                "     [SaleDescription] = @saleDesc" +
                " WHERE [id] = @id;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@name", merch.Name);
                    cmd.Parameters.AddWithValue("@desc", merch.Description);
                    cmd.Parameters.AddWithValue("@price", merch.Price);
                    cmd.Parameters.Add("@img", SqlDbType.VarBinary).Value = Convert.FromBase64String(merch.Image);
                    cmd.Parameters.AddWithValue("@primCat", merch.PrimCategory.Id);
                    cmd.Parameters.AddWithValue("@subCat", merch.SubCategory.Id);
                    cmd.Parameters.AddWithValue("@sale", merch.OnSale);
                    cmd.Parameters.AddWithValue("@stock", merch.OutOfStock);
                    cmd.Parameters.AddWithValue("@saleprice", merch.SalePrice);
                    cmd.Parameters.AddWithValue("@saleDesc", merch.SaleDescription);
                    cmd.Parameters.AddWithValue("@id", merch.Id);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                return false;
            }

            return true;
        }

        public bool DeleteItem(long id)
        {
            string query =
                "DELETE FROM [Inventory].[dbo].[Merchandise] WHERE [id] = @id;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                return false;
            }

            return true;
        }
    }
}
