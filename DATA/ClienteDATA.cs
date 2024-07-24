using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using ApiCotizFesepsa.Models;
using System.Collections;

namespace ApiCotizFesepsa.DATA
{
    public class ClienteDATA
    {
        public static List<Cliente> listar(String usuario)
        {
            List<Cliente> oLista = new List<Cliente>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_CLIENTE", oConexion);
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
                            oLista.Add(new Cliente()
                            {
                                Nombre = dr["Nombre"].ToString(),
                                RUC = dr["RUC"].ToString()
                            });
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


        public static List<string> listarDirecciones(String ndoc)
        {
            List<String> oLista = new List<String>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_CLIENTE", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "3");
                cmd.Parameters.AddWithValue("@NDOC", ndoc);
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            oLista.Add(dr["Direcciones"].ToString());
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

        public static bool registrar(String usuario, String tipodoc, String ndoc, String rsocial, String appat, String apmat, String nombres,String ubigeo,String correo,String direccion,String telef1,String telef2)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_CLIENTE", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "2");
                cmd.Parameters.AddWithValue("@USUARIO", usuario);
                cmd.Parameters.AddWithValue("@DOC", tipodoc);
                cmd.Parameters.AddWithValue("@NDOC", ndoc);
                cmd.Parameters.AddWithValue("@RSOCIAL", rsocial);
                cmd.Parameters.AddWithValue("@APPAT", appat);
                cmd.Parameters.AddWithValue("@APMAT", apmat);
                cmd.Parameters.AddWithValue("@NOMBRES", nombres);
                cmd.Parameters.AddWithValue("@UBIGEO", ubigeo);
                cmd.Parameters.AddWithValue("@CORREO", correo);
                cmd.Parameters.AddWithValue("@DIREC", direccion);
                cmd.Parameters.AddWithValue("@TELEF1", telef1);
                cmd.Parameters.AddWithValue("@TELEF2", telef2);
                try
                {
                    String res="";
                    oConexion.Open();
                    cmd.ExecuteNonQuery();
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        
                        while (dr.Read())
                        {
                            res = dr["Respuesta"].ToString();
                        }

                    }
                    if (res == "TRUE")
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                    
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

    }
}