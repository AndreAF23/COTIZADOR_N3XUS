using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.DATA
{
    public class PrecioDATA
    {
        public static List<String> precioUnitario(String codigo) {
            List<String> oLista = new List<String>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("SELECT TOP 1 PRE.ValVta as Precio,IIF(PRE.Cd_Mda='01','S','D') AS Moneda FROM Producto2 AS PR INNER JOIN Precio AS PRE ON (PR.Cd_Prod=PRE.Cd_Prod)\r\nWHERE PR.CodCo1_='" + codigo + "'", oConexion);
                
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            oLista.Add(dr["Precio"].ToString());
                            oLista.Add(dr["Moneda"].ToString());
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