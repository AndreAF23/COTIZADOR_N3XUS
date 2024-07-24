using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.Models
{
    public class Articulo
    {
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public string Marca { get; set; }
        public string Stock { get; set; }
        public string Precio { get; set; }
        public string Moneda { get; set; }
    }
}