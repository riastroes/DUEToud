using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace DUET.Controllers
{
    [Route("api/[controller]")]
    public class WebTextController : Controller
    {
        // GET api/WebText
        [HttpGet]
        public IEnumerable<string> Get()
        {
            
            return new string[] { "value1", "value2" };
        }

        // GET api/WebText/5
        [HttpGet("{title}")]
        public string Get(string title)
        {
            return WebText.Html(title);
        }

        // POST api/WebText
        [HttpPost]
        public string Post([FromBody]string value)
        {
            return "ok";
        }

        // PUT api/WebText/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/WebText/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
