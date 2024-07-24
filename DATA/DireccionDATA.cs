using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.DATA
{
    public class DireccionDATA
    {
        public static List<string> listar()
        {
            List<String> oLista = new List<String>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_UBIGEO", oConexion);
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
                            oLista.Add(dr["Nombre"].ToString());
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

        public static bool registrarDireccion(String ndoc, String direcent, String distrito)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_CLIENTE", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "4");
                cmd.Parameters.AddWithValue("@NDOC", ndoc);
                cmd.Parameters.AddWithValue("@DIREC", direcent);
                cmd.Parameters.AddWithValue("@UBIGEO", distrito);
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

    }
}