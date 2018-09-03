using System;
using System.Collections.Generic;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DUET.Models;
using DUET.Shared;
using Newtonsoft.Json.Linq;
using System.IO;

namespace DUET.Controllers
{
    [Route("api/[controller]")]
    public class OrderController : Controller
    {
        private readonly DUET.Models.DUETContext _context;
        private Visitor visitor;

        public OrderController(DUET.Models.DUETContext context)
        {
            _context = context;
        }


        [HttpPost("{json}")]
        public string Post(string json)
        {
            dynamic data = JObject.Parse(json);
            string GUID = data.GUID;
            visitor = Visitor.GetOrCreate(GUID);

            if (data.func == "neworder")
            {
                int id = data.id;
                return  visitor.GetOrCreateOrder(_context, id);
            }
            else if(data.func == "confirmorder"){
                using (StreamReader sr = new StreamReader(Request.Body))
                {
                    dynamic data1 = JObject.Parse(sr.ReadToEnd());
                    return visitor.ConfirmOrder(_context, data1);
                }
                    
            }
            else if (data.func == "getmyorders")
            {
                return visitor.GetMyOrders(_context);
            }
            else if (data.func == "getallorders")
            {
                return visitor.GetAllOrders(_context);
            }
            else if (data.func == "orderstatus")
            {
                int id = data.orderid;
                string status = data.status;
                return visitor.SetOrderStatus(_context, id, status);
            }
            else
            {
                return "Unkown webservice.";
            }
        }
    }
}