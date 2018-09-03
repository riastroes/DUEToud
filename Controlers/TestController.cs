using System;
using System.Collections.Generic;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DUET.Models;
using DUET.Shared;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;

namespace DUET.Controllers
{
    [Route("api/[controller]")]
    public class TestController : Controller
    {
        private readonly DUET.Models.DUETContext _context;
        private Visitor visitor;

        public TestController(DUET.Models.DUETContext context)
        {
             _context = context;
        }


        [HttpPost("{json}")]
        public string Post(string json)
        {
            dynamic data = JObject.Parse(json);
            string GUID = data.GUID;
            visitor = Visitor.GetOrCreate(GUID);

            if (data.func == "testdesign")
            {
                int id = data.designid;
                return Design.TestGetDesigns(_context, id);
            }
           

            else{
                return "Unkown webservice.";
            }

        }



    }
}
