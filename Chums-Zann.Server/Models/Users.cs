using Microsoft.Data.Sqlite;
using System.Text;
using System.Text.RegularExpressions;

namespace Chums_Zann.Server.Models
{
    public class Users
    {
        public static List<User> GetUsers(long id = -1)
        {
            List<User> users = [];

            string connStr = "./chums.db";
            string query = 
                "SELECT [id], [username]" +
                " FROM [Users]";

            if (id > 0) query += " WHERE [id] = @id";
            query += ";";

            using(SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
            using(SqliteCommand cmd = conn.CreateCommand())
            {
                conn.Open();
                cmd.CommandText = query;
                if (id > 0) cmd.Parameters.AddWithValue("@id", id);
                using(SqliteDataReader reader = cmd.ExecuteReader())
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


        public static bool CreateNewUser(string username, string password)
        {
            if (!ValidateUser(username))
                return false;

            if (!ValidatePass(password))
                return false;

            byte[] salt = Encoding.UTF8.GetBytes(Guid.NewGuid().ToString());
            byte[] passHash = Helpers.GetPasswordHash(salt, password);

            //store passHash and saltedPass in database along with username
            string connStr = "./chums.db";
            string query = "SELECT COUNT([username])" +
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
                    cmd.Parameters.Add("@hash", SqliteType.Blob).Value = passHash;
                    cmd.Parameters.Add("@salt", SqliteType.Blob).Value = salt;
                    if ((long)cmd.ExecuteScalar() > 0)
                        return false; //TODO maybe return user already exists message as this will only be handled by logged in admins
                }
            }
            catch (Exception e)
            {
                //TODO may need to handle this with something
                return false;
            }

            query = "INSERT INTO [Users] ([username],[pwHash],[salt]) VALUES (@user, @hash, @salt);";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@user", username.ToLower());
                    cmd.Parameters.Add("@hash", SqliteType.Blob).Value = passHash;
                    cmd.Parameters.Add("@salt", SqliteType.Blob).Value = salt;
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

        public static bool EditUser(long id, string password)
        {
            if (!ValidatePass(password))
                return false;

            byte[] salt = [];

            string connStr = "./chums.db";
            string query = 
                "SELECT [salt]" +
                " FROM [Users]" +
                " WHERE [id] = @id;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.AddWithValue("@id", id);
                    using (SqliteDataReader reader = cmd.ExecuteReader())
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

            query = "UPDATE [Users] SET [pwHash] = @hash WHERE [id] = @id;";

            try
            {
                using (SqliteConnection conn = new SqliteConnection("Data Source=" + connStr))
                using (SqliteCommand cmd = conn.CreateCommand())
                {
                    conn.Open();
                    cmd.CommandText = query;
                    cmd.Parameters.Add("@hash", SqliteType.Blob).Value = passHash;
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

        public static bool DeleteUser(long id)
        {
            string connStr = "./chums.db";
            string query = "DELETE FROM [Users] WHERE [id] = @id;";

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
                //TODO may need to handle this with something
                return false;
            }

            return true;
        }

        static bool ValidateUser(string username)
        {
            return username.Contains('@') && (username.Substring(username.LastIndexOf('@') + 1).Length > 0);
        }

        static bool ValidatePass(string password)
        {
            Regex reg = new("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$");
            return reg.IsMatch(password);
        }
    }
}
