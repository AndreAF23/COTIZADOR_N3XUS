using ApiCotizFesepsa.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.DATA
{
    public class ArticuloDATA
    {
        public static List<Articulo> listar()
        {
            List<Articulo> oLista = new List<Articulo>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_PRODUCTOS", oConexion);
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
                            oLista.Add(new Articulo()
                            {
                                Codigo = dr["Codigo"].ToString(),
                                Descripcion = dr["Descripcion"].ToString(),
                                Marca = dr["Marca"].ToString(),
                                Stock = dr["Stock"].ToString(),
                                Precio = dr["Precio"].ToString(),
                                Moneda = dr["Moneda"].ToString()
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
    }
}