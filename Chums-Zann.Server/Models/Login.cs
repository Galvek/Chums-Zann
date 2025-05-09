using Microsoft.Data.SqlClient;

namespace Chums_Zann.Server.Models
{
    public class Login
    {
        private readonly IConfiguration Configuration;
        private readonly string ConnStr;
        public Login(IConfiguration configuration)
        {
            Configuration = configuration;
            ConnStr = Configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        public string ValidateLogin(string username, string password)
        {
            byte[] salt = [];
            byte[] dbPwHash = [];

            string query = "SELECT [pwHash], [salt]" +
                " FROM [User].[dbo].[Logins]" +
                " WHERE [username] = @user;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@user", username.ToLower());
                    using (SqlDataReader reader = cmd.ExecuteReader())
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

        string GenerateLongliveToken(string username)
        {
            string token = Guid.NewGuid().ToString();
            string query = "UPDATE [User].[dbo].[Logins] SET [token] = @token, [lastCheckTime] = @checkTime WHERE [username] = @user;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@token", token);
                    cmd.Parameters.AddWithValue("@checkTime", DateTime.Now);
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

        public bool ValidateToken(string username, string token)
        {
            int timeOut = 30; //timeout in minutes
            string dbToken = string.Empty;
            string query = "SELECT [token], [lastCheckTime]" +
                " FROM [User].[dbo].[Logins]" +
                " WHERE [username] = @user;";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@user", username.ToLower());
                    cmd.Parameters.AddWithValue("@token", token);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            if (!reader.IsDBNull(0)) dbToken = reader.GetString(0);
                            if (!reader.IsDBNull(1))
                            {
                                DateTime lastCheckTime = reader.GetDateTime(1);
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
                query = "UPDATE [User].[dbo].[Logins] SET [lastCheckTime] = @checkTime WHERE [username] = @user;";

                try
                {
                    using (SqlConnection conn = new SqlConnection(ConnStr))
                    using (SqlCommand cmd = conn.CreateCommand())
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
