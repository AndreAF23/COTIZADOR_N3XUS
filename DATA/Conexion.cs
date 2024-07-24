using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiCotizFesepsa.DATA
{
    public class Conexion
    {
        //static string servidor = "MAESTRO\\SQLFESEPSA2017";
        //static string bd = "ERP";

        //public static string rutaConexion = "Data Source=" + servidor + ";Database=" + bd + "Trusted_Connection=True;Persist Security Info=true";


        static string servidor = "MAESTRO\\SQLFESEPSA2017";
        static string bd = "ERP";
        static string usuario = "user_adm";
        static string password = "zRye_aAfWSod";

        public static string rutaConexion = "Data Source=" + servidor + ";" + "user id=" + usuario + ";" + "password=" + password + ";" + "Initial Catalog=" + bd + ";" + "Persist Security Info=true";
    }
}