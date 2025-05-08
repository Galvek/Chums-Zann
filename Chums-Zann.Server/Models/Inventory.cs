using Microsoft.Data.Sqlite;
using System.Data;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Chums_Zann.Server.Models
{
    public class Inventory
    {
        public Inventory() { }

        public static List<Merchandise> GetInventory(long primaryCategory = 0, long subCategory = 0)
        {
            List<Merchandise> inventory = [];

            string connStr = "./chums.db";
            string query = 
                @"SELECT m.[id],m.[name],m.[description], " +
                 "   m.[price],m.[image],m.[category],pc.[description]," +
                 "   m.[subcategory], sc.[description], m.[onsale], m.[outofstock]," +
                 "   m.[saleprice], m.[saledescription]" +
                 " FROM [Merchandise] AS m" +
                 " LEFT JOIN [PrimaryCategory] AS pc ON pc.[id] = m.[category]" +
                 " LEFT JOIN [SubCategory] AS sc ON sc.[id] = m.[subcategory]";

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

            using(SqliteConnection conn = new SqliteConnection("Data Source="+connStr))
            using(SqliteCommand cmd = conn.CreateCommand())
            {
                conn.Open();
                cmd.CommandText = query;
                if (primaryCategory > 0) cmd.Parameters.AddWithValue("@primCat", primaryCategory);
                if (subCategory > 0) cmd.Parameters.AddWithValue("subCat", subCategory);
                using(SqliteDataReader reader = cmd.ExecuteReader())
                {
                    while(reader.Read())
                    {
                        Merchandise merch = new Merchandise()
                        {
                            Id = reader.GetInt64(0),
                            Name = reader.GetString(1),
                            Description = reader.IsDBNull(2) ? "" : reader.GetString(2),
                            Price = reader.GetDecimal(3),
                            Image = reader.IsDBNull(4) ? "" : reader.GetString(4),
                            PrimCategory = reader.IsDBNull(6) ? new() : new()
                            {
                                Id = reader.GetInt64(5),
                                Description = reader.GetString(6)
                            },
                            SubCategory = reader.IsDBNull(8) ? new() : new()
                            {
                                Id = reader.GetInt64(7),
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
            return inventory;
        }

        public static bool CreateItem(Merchandise merch)
        {
            string connStr = "./chums.db";
            string query =
                @"SELECT COUNT([id])" +
                 " FROM [Merchandise]" +
                 " WHERE [name] = @name;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@name", merch.Name);
                    if ((long)cmd.ExecuteScalar() > 0)
                        return false;
                }
            }
            catch(Exception e)
            {
                return false;
            }

            query = 
                "INSERT INTO [Merchandise]" +
                " ([Name], [Description], [Price], [Image], [Category], [SubCategory],[OnSale],[OutOfStock],[SalePrice],[SaleDescription])" +
                " VALUES" +
                " (@name, @desc, @price, @img, @primCat, @subCat, @sale, @stock, @saleprice, @saleDesc);";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@name", merch.Name);
                    cmd.Parameters.AddWithValue("@desc", merch.Description);
                    cmd.Parameters.AddWithValue("@price", merch.Price);
                    cmd.Parameters.Add("@img", SqliteType.Blob).Value = merch.Image;
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

        public static bool EditItem(Merchandise merch)
        {
            string connStr = "./chums.db";
            string query =
                "UPDATE [Merchandise]" +
                " SET [Name] = @name, [Description] = @desc, [Price] = @price, [Image] = @img, [Category] = @primCat," +
                "     [SubCategory] = @subCat, [OnSale] = @sale, [OutOfStock] = @stock, [SalePrice] = @saleprice," +
                "     [SaleDescription] = @saleDesc" +
                " WHERE [id] = @id;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@name", merch.Name);
                    cmd.Parameters.AddWithValue("@desc", merch.Description);
                    cmd.Parameters.AddWithValue("@price", merch.Price);
                    cmd.Parameters.Add("@img", SqliteType.Blob).Value = merch.Image;
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

        public static bool DeleteItem(long id)
        {
            string connStr = "./chums.db";
            string query =
                "DELETE FROM [Merchandise] WHERE [id] = @id;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
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
