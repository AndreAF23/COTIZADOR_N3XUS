using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.Models
{
    public class Cotizacion
    {
        public string NroCot { get; set; }
        public string FechaEmision { get; set; }
        public string Cliente { get; set; }
    }
}