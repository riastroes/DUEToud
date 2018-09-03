 using System;
using System.Collections.Generic;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DUET.Models;
using DUET.Shared;
using Newtonsoft.Json.Linq;

namespace DUET.Controllers
{
    [Route("api/[controller]")]
    public class InspirationController : Controller
    {
        private readonly DUET.Models.DUETContext _context;
        private Visitor visitor;

        public InspirationController(DUET.Models.DUETContext context)
        {
             _context = context;
        }


        [HttpPost("{json}")]
        public string Post(string json)
        {
            dynamic data = JObject.Parse(json);
            string GUID = data.GUID;
            visitor = Visitor.GetOrCreate(GUID);


            var member = visitor as Member;
            if (member != null)
            {
                if(member.Name == "Ria Stroes" || member.Name == "JOLANTA IZABELA"){

                    if (data.func == "seed")
                    {
                        return DUET.Models.Inspiration.Seed(_context);
                    }
                    if (data.func == "addinspiration")
                    {
                        string title = data.title;
                        string src = data.src;
                        return DUET.Models.Inspiration.Add(_context, title, src);
                    }
                    if (data.func == "deleteinspiration")
                    {
                        int id = data.id;
                        return DUET.Models.Inspiration.Delete(_context, id);
                    }

                    else
                    {
                        return "Error: Unkown webservice.";
                    }
                    
                }

            }
            return "Error: Unkown member.";
            
        }



        // DELETE api/member/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
