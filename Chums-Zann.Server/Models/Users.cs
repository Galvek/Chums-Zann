using Microsoft.Data.SqlClient;
using System.Data;
using System.Text;
using System.Text.RegularExpressions;

namespace Chums_Zann.Server.Models
{
    public class Users
    {
        private readonly IConfiguration Configuration;
        private readonly string ConnStr;
        public Users(IConfiguration configuration)
        {
            Configuration = configuration;
            ConnStr = Configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        public List<User> GetUsers(long id = -1)
        {
            List<User> users = [];

            string query = 
                "SELECT [id], [username]" +
                " FROM [User].[dbo].[Logins]";

            if (id > 0) query += " WHERE [id] = @id";
            query += ";";

            using(SqlConnection conn = new SqlConnection(ConnStr))
            using(SqlCommand cmd = conn.CreateCommand())
            {
                conn.Open();
                cmd.CommandText = query;
                if (id > 0) cmd.Parameters.AddWithValue("@id", id);
                using(SqlDataReader reader = cmd.ExecuteReader())
                {
                    while(reader.Read())
                    {
                        User user = new User()
                        {
                            Id = reader.GetInt64(0),
                            Username = reader.GetString(1)
                        };
                        users.Add(user);
                    }
                }
            }

            return users;
        }


        public bool CreateNewUser(string username, string password)
        {
            if (!ValidateUser(username))
                return false;

            if (!ValidatePass(password))
                return false;

            byte[] salt = Encoding.UTF8.GetBytes(Guid.NewGuid().ToString());
            byte[] passHash = Helpers.GetPasswordHash(salt, password);

            //store passHash and saltedPass in database along with username
            string query = "SELECT COUNT([username])" +
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
                    cmd.Parameters.Add("@hash", SqlDbType.VarBinary).Value = passHash;
                    cmd.Parameters.Add("@salt", SqlDbType.VarBinary).Value = salt;
                    if ((int)cmd.ExecuteScalar() > 0)
                        return false; //TODO maybe return user already exists message as this will only be handled by logged in admins
                }
            }
            catch (Exception e)
            {
                //TODO may need to handle this with something
                return false;
            }

            query = "INSERT INTO [User].[dbo].[Logins] ([username],[pwHash],[salt]) VALUES (@user, @hash, @salt);";

            try
            {
                using (SqlConnection conn = new SqlConnection(ConnStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@user", username.ToLower());
                    cmd.Parameters.Add("@hash", SqlDbType.VarBinary).Value = passHash;
                    cmd.Parameters.Add("@salt", SqlDbType.VarBinary).Value = salt;
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                //TODO may need to handle this with something
                return false;
            }

            return true;
        }

        public bool EditUser(long id, string password)
        {
            if (!ValidatePass(password))
                return false;

            byte[] salt = [];

            string connStr = "./chums.db";
            string query = 
                "SELECT [salt]" +
                " FROM [User].[dbo].[Logins]" +
                " WHERE [id] = @id;";

            try
            {
                using (SqlConnection conn = new SqlConnection("Data Source=" + connStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@id", id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read() && !reader.IsDBNull(0))
                            //reuse same salt
                            salt = (byte[])reader["salt"];
                    }
                }
            }
            catch (Exception e)
            {
                return false;
            }

            if (salt.Length == 0) return false;

            byte[] passHash = Helpers.GetPasswordHash(salt, password);

            if (passHash.Length == 0) return false;

            query = "UPDATE [User].[dbo].[Logins] SET [pwHash] = @hash WHERE [id] = @id;";

            try
            {
                using (SqlConnection conn = new SqlConnection("Data Source=" + connStr))
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.Add("@hash", SqlDbType.VarBinary).Value = passHash;
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                //TODO may need to handle this with something
                return false;
            }

            return true;
        }

        public bool DeleteUser(long id)
        {
            string connStr = "./chums.db";
            string query = "DELETE FROM [User].[dbo].[Logins] WHERE [id] = @id;";

            try
            {
                using (SqlConnection conn = new SqlConnection("Data Source=" + connStr))
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
                //TODO may need to handle this with something
                return false;
            }

            return true;
        }

        bool ValidateUser(string username)
        {
            return username.Contains('@') && (username.Substring(username.LastIndexOf('@') + 1).Length > 0);
        }

        bool ValidatePass(string password)
        {
            Regex reg = new("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$");
            return reg.IsMatch(password);
        }
    }
}
