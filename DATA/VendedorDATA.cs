using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.DATA
{
    public class VendedorDATA
    {
        public static String obtenerNombre(String usuario)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_VENDEDOR", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "1");
                cmd.Parameters.AddWithValue("@USUARIO", usuario);
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            return dr["NombreVendedor"].ToString();
                        }

                    }
                    return "";
                }
                catch (Exception ex)
                {
                    return "";
                }
            }
        }
    }
}