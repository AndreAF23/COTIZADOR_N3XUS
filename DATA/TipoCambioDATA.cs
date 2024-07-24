using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.DATA
{
    public class TipoCambioDATA
    {
        public static String traerTCActual()
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_TC", oConexion);
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
                            return dr["TC"].ToString();
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


        public static String traerTC(String fecha)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_TC", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "2");
                cmd.Parameters.AddWithValue("@FECHA", fecha);
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            return dr["TC"].ToString();
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

        public static String tcmanual(String usuario)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_TC", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "3");
                cmd.Parameters.AddWithValue("@USUARIO", usuario);
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();
                    
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            return dr["TCManual"].ToString();
                        }

                    }
                    return "0";
                }
                catch (Exception ex)
                {
                    return "0";
                }
            }
        }

    }
}