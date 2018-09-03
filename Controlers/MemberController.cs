using System;
using System.Collections.Generic;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DUET.Models;
using DUET.Shared;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace DUET.Controllers
{
    [Route("api/[controller]")]
    public class MemberController : Controller
    {
        private readonly DUET.Models.DUETContext _context;
        private Visitor visitor;

        public MemberController(DUET.Models.DUETContext context)
        {
             _context = context;
        }

        // GET api/member
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/member
        [HttpGet("{GUID}")]
        public string Get(string GUID)
        {
            visitor = Visitor.GetOrCreate(GUID);
            return visitor.GetName();
        }


        [HttpPost("{json}")]
        public string Post(string json)
        {
            dynamic data = JObject.Parse(json);
            string GUID = data.GUID;
            visitor = Visitor.GetOrCreate(GUID);


            if (data.func == "login")
            {
                return visitor.Login(_context, data);
            }
            
            else if (data.func == "register")
            {
                return visitor.Register(_context, data);

            }
            else if (data.func == "initregistration")
            {
                return visitor.GetMemberData();
            }
            else if (data.func == "changeregistration")
            {
                return visitor.ChangeRegistration(_context, data);
            }
            else if (data.func == "unsubscribe")
            {
                return visitor.Unsubscribe(_context, data);
            }
            else if (data.func == "members"){
                
                return visitor.GetMembers(_context);
            }
            
            else if (data.func == "getsettings")
            {
                string str = App.ROOT + "," + App.MAXDESIGNWIDTH + "," + App.MAXDESIGNHEIGHT + "," + App.DPI +"," + App.PROCESDAYS;

                return str;
            }
            else if (data.func == "settings")
            {
                if(data.field == "inroot"){
                    App.ROOT = data.value;
                }
                else if (data.field == "inDPI")
                {
                    App.DPI = data.value;
                }
                else if (data.field == "inmaxdesignwidth")
                {
                    App.MAXDESIGNWIDTH = data.value;
                }
                else if (data.field == "inmaxdesignwidth")
                {
                    App.MAXDESIGNHEIGHT = data.value;
                }
                else if (data.field == "inprocesdays")
                {
                    App.PROCESDAYS = data.value;
                    Order.ResetProcessedDate(_context);
                }
                return "";
            }
            else{
                return "Unkown webservice.";
            }
            
        }



        // DELETE api/member/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
