using ApiCotizFesepsa.Models;
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
    public class CotizacionDATA
    {
        public static List<Cotizacion> listar(String usuario)
        {
            List<Cotizacion> oLista = new List<Cotizacion>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_COTIZACION", oConexion);
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
                            oLista.Add(new Cotizacion()
                            {
                                NroCot = dr["NroCot"].ToString(),
                                FechaEmision = dr["FechaEmision"].ToString(),
                                Cliente = dr["Cliente"].ToString()
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

        public static List<CotizacionDetalle> listarDetalle(String numcot)
        {
            List<CotizacionDetalle> oLista = new List<CotizacionDetalle>();
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_COTIZACION", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "4");
                cmd.Parameters.AddWithValue("@NUMCOT", numcot);

                try
                {
                    oConexion.Open();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        CotizacionDetalle cotizacion = null;

                        while (dr.Read())
                        {
                            if (cotizacion == null)
                            {
                                cotizacion = new CotizacionDetalle
                                {
                                    DocumentoCliente = dr["DocumentoCliente"].ToString(),
                                    NombreCliente = dr["NombreCliente"].ToString(),
                                    DireccionCliente = dr["DireccionCliente"].ToString(),
                                    TelefonoCliente = dr["TelefonoCliente"].ToString(),
                                    CorreoCliente = dr["CorreoCliente"].ToString(),
                                    FechaEmision = dr["FechaEmision"].ToString(),
                                    Moneda = dr["Moneda"].ToString(),
                                    NombreVendedor = dr["NombreVendedor"].ToString(),
                                    TelefonoVendedor = dr["TelefonoVendedor"].ToString(),
                                    CorreoVendedor = dr["CorreoVendedor"].ToString(),
                                    // ... otros campos de la cotización
                                    FechaVencimiento = dr["FechaVencimiento"].ToString(),
                                    FechaCaducidad = dr["FechaCaducidad"].ToString(),
                                    FormaPago = dr["FormaPago"].ToString(),
                                    Observaciones = dr["Observaciones"].ToString(),
                                    SubTotal = dr["SubTotal"].ToString(),
                                    IGV = dr["IGV"].ToString(),
                                    Total = dr["Total"].ToString(),
                                    ListaPrecio = dr["ListaPrecio"].ToString(),
                                    OC = dr["OC"].ToString(),
                                };
                            }

                            Detalle detalle = new Detalle
                            {
                                Item = dr["Item"].ToString(),
                                Codigo = dr["Codigo"].ToString(),
                                Descripcion = dr["Descripcion"].ToString(),
                                Marca = dr["Marca"].ToString(),
                                Cantidad = dr["Cantidad"].ToString(),
                                Stock = dr["Stock"].ToString(),
                                PrecioUnitario = dr["PrecioUnitario"].ToString(),
                                ValorUnitario = dr["ValorUnitario"].ToString(),
                                Importe = dr["Importe"].ToString()
                            };
                            cotizacion.Detalles.Add(detalle);
                        }

                        if (cotizacion != null)
                        {
                            oLista.Add(cotizacion);
                        }
                    }
                }
                catch (Exception ex)
                {
                    return oLista;
                }
            }
            return oLista;
        }

        public static String traerCorrelativo()
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_COTIZACION", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "5");
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            return dr["Correlativo"].ToString();
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

        public static String traerEstado(String numcot)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_COTIZACION", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "7");
                cmd.Parameters.AddWithValue("@NUMCOT", numcot);
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            return dr["Estado"].ToString();
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

        public static bool registrar(String usuario,String numcot, String formapago, String ruc, String total, String listaprecios, String moneda, String tipocambio,String oc,String direcent,String obs)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_COTIZACION", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "2");
                cmd.Parameters.AddWithValue("@USUARIO", usuario);
                cmd.Parameters.AddWithValue("@NUMCOT", numcot);
                cmd.Parameters.AddWithValue("@FPAGO", formapago);
                cmd.Parameters.AddWithValue("@RUC", ruc);
                cmd.Parameters.AddWithValue("@TOTAL", total);
                cmd.Parameters.AddWithValue("@LPRECIO", listaprecios);
                cmd.Parameters.AddWithValue("@MONEDA", moneda);
                cmd.Parameters.AddWithValue("@TIPOCAMBIO", tipocambio);
                cmd.Parameters.AddWithValue("@ORDENCOMPRA", oc);
                cmd.Parameters.AddWithValue("@DIRECENT", direcent);
                cmd.Parameters.AddWithValue("@OBS", obs);
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

        public static bool registrarDetalle(String numcot, String codigo, String cantidad, String precio,String listaprecio, String obs)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_COTIZACION", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "3");
                cmd.Parameters.AddWithValue("@NUMCOT", numcot);
                cmd.Parameters.AddWithValue("@CODPROD", codigo);
                cmd.Parameters.AddWithValue("@CANTIDAD", cantidad);
                cmd.Parameters.AddWithValue("@PRECIOUNIT", precio);
                cmd.Parameters.AddWithValue("@LPRECIO", listaprecio);
                cmd.Parameters.AddWithValue("@OBS", obs);
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

        public static String eliminar(String nrocot)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.rutaConexion))
            {
                SqlCommand cmd = new SqlCommand("FESEPSA_MNG_COTIZACION", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@OPC", "6");
                cmd.Parameters.AddWithValue("@NUMCOT", nrocot);
                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            return dr["Respuesta"].ToString();
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