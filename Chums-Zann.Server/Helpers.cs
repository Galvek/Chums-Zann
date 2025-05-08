using System.Security.Cryptography;
using System.Text;

namespace Chums_Zann.Server
{
    public static class Helpers
    {
        public static byte[] GetPasswordHash(byte[] salt, string password)
        {
            byte[] pwdBytes = Encoding.UTF8.GetBytes(password);

            byte[] saltedPass = new byte[pwdBytes.Length + salt.Length];

            Buffer.BlockCopy(pwdBytes, 0, saltedPass, 0, pwdBytes.Length);
            Buffer.BlockCopy(salt, 0, saltedPass, pwdBytes.Length, salt.Length);

            SHA1 sha = SHA1.Create();
            return sha.ComputeHash(saltedPass);
        }
    }
}
