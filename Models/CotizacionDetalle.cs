using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.Models
{
    public class CotizacionDetalle
    {
        public string DocumentoCliente { get; set; }
        public string NombreCliente { get; set; }
        public string DireccionCliente { get; set; }
        public string TelefonoCliente { get; set; }
        public string CorreoCliente { get; set; }
        public string FechaEmision { get; set; }
        public string Moneda { get; set; }
        public string NombreVendedor { get; set; }
        public string TelefonoVendedor { get; set; }
        public string CorreoVendedor { get; set; }
        public string FechaVencimiento { get; set; }
        public string FechaCaducidad { get; set; }
        public string FormaPago { get; set; }
        public string Observaciones { get; set; }
        public string SubTotal { get; set; }
        public string IGV { get; set; }
        public string Total { get; set; }
        public string ListaPrecio { get; set; }
        public string OC { get; set; }
        public List<Detalle> Detalles { get; set; }
        public CotizacionDetalle()
        {
            Detalles = new List<Detalle>();
        }
    }

    public class Detalle
    {
        public string Item { get; set; }
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public string Marca { get; set; }
        public string Cantidad { get; set; }
        public string Stock { get; set; }
        public string PrecioUnitario { get; set; }
        public string ValorUnitario { get; set; }
        public string Importe { get; set; }
    }

}