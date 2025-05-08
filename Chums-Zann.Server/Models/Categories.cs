using Microsoft.Data.Sqlite;

namespace Chums_Zann.Server.Models
{
    public class Categories
    {
        public static List<PrimaryCategory> GetPrimaries()
        {
            List<PrimaryCategory> primCategories = [];

            string connStr = "./chums.db";
            string query =
                @"SELECT [id],[description]" +
                 " FROM [PrimaryCategory];";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    using (SqliteDataReader reader = cmd.ExecuteReader())
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

        public static bool CreatePrimary(string description)
        {
            string connStr = "./chums.db";
            string query =
                @"SELECT COUNT([id])" +
                 " FROM [PrimaryCategory]" +
                 " WHERE [description] = @desc;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@desc", description);
                    if ((long)cmd.ExecuteScalar() > 0)
                        return false;
                }
            }
            catch (Exception e)
            {
                return false;
            }

            query = "INSERT INTO [PrimaryCategory] ([description]) VALUES (@desc);";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
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

        public static bool EditPrimary(long id, string description)
        {
            string connStr = "./chums.db";
            string query =
                @"UPDATE [PrimaryCategory] SET [description] = @desc WHERE [id] = @id;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
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

        public static bool DeletePrimary(long id)
        {
            string connStr = "./chums.db";
            string query =
                @"DELETE FROM [PrimaryCategory] WHERE [id] = @id;";

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

        public static List<SubCategory> GetSubs()
        {
            List<SubCategory> subCategories = [];

            string connStr = "./chums.db";
            string query =
                @"SELECT sc.[id],pc.[id],pc.[description],sc.[description]" +
                 " FROM [SubCategory] AS sc" +
                 " INNER JOIN [PrimaryCategory] AS pc ON pc.[id] = sc.[primarycategory];";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    using (SqliteDataReader reader = cmd.ExecuteReader())
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



        public static bool CreateSub(long primId, string description)
        {
            string connStr = "./chums.db";
            string query =
                @"SELECT COUNT([id])" +
                 " FROM [SubCategory]" +
                 " WHERE [PrimaryCategory] = @primId AND [description] = @desc;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@primId", primId);
                    cmd.Parameters.AddWithValue("@desc", description);
                    if ((long)cmd.ExecuteScalar() > 0)
                        return false;
                }
            }
            catch (Exception e)
            {
                return false;
            }

            query = "INSERT INTO [SubCategory] ([PrimaryCategory],[description]) VALUES (@primId,@desc);";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
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

        public static bool EditSub(long id, long primId, string description)
        {
            string connStr = "./chums.db";
            string query =
                @"UPDATE [SubCategory] SET [PrimaryCategory] = @primId, [description] = @desc WHERE [id] = @id;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
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

        public static bool DeleteSub(long id)
        {
            string connStr = "./chums.db";
            string query =
                @"DELETE FROM [SubCategory] WHERE [id] = @id;";

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
