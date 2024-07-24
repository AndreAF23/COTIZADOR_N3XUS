using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.DATA
{
    public class FormaPagoDATA
    {
        public static List<string> listar()
        {
            List<String> oLista = new List<String>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_FORMAPAGO", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "1");
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            oLista.Add(dr["FormaPago"].ToString());
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
    }
}