using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.DATA
{
    public class UsuarioDATA
    {
        public static List<String> listarUsuarios()
        {
            List<String> oLista = new List<String>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("SELECT NOMUSU AS Usuario FROM USUARIO", oConexion);
                //cmd.CommandType = CommandType.StoredProcedure;
                //cmd.Parameters.AddWithValue("@OPC", "1");
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            oLista.Add(dr["Usuario"].ToString());
                        }

                    }
                    return oLista;
                }
                catch (Exception ex)
                {
                    return oLista;
                }
            }
        }


        public static bool validarUsuario(String usuario, String contrasena)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_USUARIO", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "1");
                cmd.Parameters.AddWithValue("@USUARIO", usuario);
                cmd.Parameters.AddWithValue("@CONTRASENA", contrasena);
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            return Convert.ToBoolean(dr["respuesta"]);
                        }

                    }

                    return false;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }


    }
}