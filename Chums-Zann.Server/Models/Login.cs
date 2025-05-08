using Microsoft.Data.Sqlite;

namespace Chums_Zann.Server.Models
{
    public class Login
    {
        public static string ValidateLogin(string username, string password)
        {
            byte[] salt = [];
            byte[] dbPwHash = [];

            string connStr = "./chums.db";
            string query = "SELECT [pwHash], [salt]" +
                " FROM [Users]" +
                " WHERE [username] = @user;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@user", username.ToLower());
                    using (SqliteDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            salt = (byte[])reader["salt"];
                            dbPwHash = (byte[])reader["pwHash"];
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return string.Empty;
            }

            if (salt.Length == 0 || dbPwHash.Length == 0)
                return string.Empty;

            byte[] inputPwHash = Helpers.GetPasswordHash(salt, password);

            if (!inputPwHash.SequenceEqual(dbPwHash))
                return string.Empty;

            return GenerateLongliveToken(username);
        }

        static string GenerateLongliveToken(string username)
        {
            string token = Guid.NewGuid().ToString();
            string connStr = "./chums.db";
            string query = "UPDATE [Users] SET [token] = @token, [lastCheckTime] = @checkTime WHERE [username] = @user;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@token", token);
                    cmd.Parameters.AddWithValue("@checkTime", DateTime.Now.Ticks);
                    cmd.Parameters.AddWithValue("@user", username.ToLower());
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                return string.Empty;
            }

            return token;
        }

        public static bool ValidateToken(string username, string token)
        {
            int timeOut = 30; //timeout in minutes
            string dbToken = string.Empty;
            string connStr = "./chums.db";
            string query = "SELECT [token], [lastCheckTime]" +
                " FROM [Users]" +
                " WHERE [username] = @user;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@user", username.ToLower());
                    cmd.Parameters.AddWithValue("@token", token);
                    using (SqliteDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            if (!reader.IsDBNull(0)) dbToken = reader.GetString(0);
                            if (!reader.IsDBNull(1))
                            {
                                DateTime lastCheckTime = new DateTime(reader.GetInt64(1));
                                if (DateTime.Now > lastCheckTime.AddMinutes(timeOut))
                                    return false;

                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return false;
            }

            if (token.Equals(dbToken))
            {
                query = "UPDATE [Users] SET [lastCheckTime] = @checkTime WHERE [username] = @user;";

                try
                {
                    using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                    using (SqliteCommand cmd = conn.CreateCommand())
                    {
                        conn.Open();
                        cmd.CommandText = query;
                        cmd.Parameters.AddWithValue("@user", username.ToLower());
                        cmd.Parameters.AddWithValue("@checkTime", DateTime.Now.Ticks);
                        cmd.ExecuteNonQuery();
                    }
                }
                catch (Exception e)
                {
                    //if this fails, it could cause false timeout behaviour
                    //we don't return because we don't want to fail token check if update fails
                }
                return true;
            }

            return false;
        }
    }
}
