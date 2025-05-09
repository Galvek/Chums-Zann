using Microsoft.Data.SqlClient;

namespace Chums_Zann.Server.Models
{
    public class Categories
    {
        private readonly IConfiguration Configuration;
        private readonly string ConnStr;
        public Categories(IConfiguration configuration)
        {
            Configuration = configuration;
            ConnStr = Configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        public List<PrimaryCategory> GetPrimaries()
        {
            List<PrimaryCategory> primCategories = [];

            string query =
                @"SELECT [id],[description]" +
                 " FROM [Inventory].[dbo].[PrimaryCategory];";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            PrimaryCategory pCat = new PrimaryCategory()
                            {
                                Id = reader.GetInt64(0),
                                Description = reader.GetString(1),
                            };
                            primCategories.Add(pCat);
                        }
                    }
                }
            }
            catch (Exception e)
            {

            }

            return primCategories;
        }

        public bool CreatePrimary(string description)
        {
            string query =
                @"SELECT COUNT([id])" +
                 " FROM [Inventory].[dbo].[PrimaryCategory]" +
                 " WHERE [description] = @desc;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@desc", description);
                    if ((int)cmd.ExecuteScalar() > 0)
                        return false;
                }
            }
            catch (Exception e)
            {
                return false;
            }

            query = "INSERT INTO [Inventory].[dbo].[PrimaryCategory] ([description]) VALUES (@desc);";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@desc", description);
                    cmd.ExecuteNonQuery();
                }
            }
            catch(Exception e)
            {
                return false;
            }

            return true;
        }

        public bool EditPrimary(long id, string description)
        {
            string query =
                @"UPDATE [Inventory].[dbo].[PrimaryCategory] SET [description] = @desc WHERE [id] = @id;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@desc", description);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }

        public bool DeletePrimary(long id)
        {
            string query =
                @"DELETE FROM [Inventory].[dbo].[PrimaryCategory] WHERE [id] = @id;";

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

        public List<SubCategory> GetSubs()
        {
            List<SubCategory> subCategories = [];

            string query =
                @"SELECT sc.[id],pc.[id],pc.[description],sc.[description]" +
                 " FROM [Inventory].[dbo].[SubCategory] AS sc" +
                 " INNER JOIN [Inventory].[dbo].[PrimaryCategory] AS pc ON pc.[id] = sc.[primarycategory];";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            SubCategory sCat = new SubCategory()
                            {
                                Id = reader.GetInt64(0),
                                PrimaryCategory = new()
                                {
                                    Id = reader.GetInt64(1),
                                    Description = reader.GetString(2)
                                },
                                Description = reader.GetString(3),
                            };
                            subCategories.Add(sCat);
                        }
                    }
                }
            }
            catch (Exception e)
            {

            }

            return subCategories;
        }



        public bool CreateSub(long primId, string description)
        {
            string query =
                @"SELECT COUNT([id])" +
                 " FROM [Inventory].[dbo].[SubCategory]" +
                 " WHERE [PrimaryCategory] = @primId AND [description] = @desc;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@primId", primId);
                    cmd.Parameters.AddWithValue("@desc", description);
                    if ((int)cmd.ExecuteScalar() > 0)
                        return false;
                }
            }
            catch (Exception e)
            {
                return false;
            }

            query = "INSERT INTO [Inventory].[dbo].[SubCategory] ([PrimaryCategory],[description]) VALUES (@primId,@desc);";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@primId", primId);
                    cmd.Parameters.AddWithValue("@desc", description);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                return false;
            }

            return true;
        }

        public bool EditSub(long id, long primId, string description)
        {
            string query =
                @"UPDATE [Inventory].[dbo].[SubCategory] SET [PrimaryCategory] = @primId, [description] = @desc WHERE [id] = @id;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@primId", primId);
                    cmd.Parameters.AddWithValue("@desc", description);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }

        public bool DeleteSub(long id)
        {
            string query =
                @"DELETE FROM [Inventory].[dbo].[SubCategory] WHERE [id] = @id;";

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
