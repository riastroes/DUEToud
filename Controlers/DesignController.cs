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
    public class DesignController : Controller
    {
        private readonly DUET.Models.DUETContext _context;
        private Visitor visitor;

        public DesignController(DUET.Models.DUETContext context)
        {
             _context = context;
        }


        [HttpPost("{json}")]
        public string Post(string json)
        {
            dynamic data = JObject.Parse(json);
            string GUID = data.GUID;
            visitor = Visitor.GetOrCreate(GUID);

            if (data.func == "xy")
            {
                using (StreamReader sr = new StreamReader(Request.Body))
                {
                    dynamic data1 = JObject.Parse(sr.ReadToEnd());
                    visitor.Proces(_context, data1.proces);
                    return "";
                }

            }
            else if (data.func == "setbgcolor")
            {
                int id = data.design.id;
                int red = data.design.bgred;
                int green = data.design.bggreen;
                int blue = data.design.bgblue;
                return visitor.SetBgColor(_context, id, red, green, blue);
            }
            else if (data.func == "getstamp")
            {
                var result = "";
                using (StreamReader sr = new StreamReader(Request.Body))
                {
                    dynamic data1 = JObject.Parse(sr.ReadToEnd());
                    result = visitor.Proces(_context, data1.proces);
                    if (result == "")
                    {
                        result = visitor.CreateStamp(_context, data1.stamp, data1.inspiration);
                    }
                }
                return result;
            }
            else if (data.func == "newdesign")
            {

                return visitor.NewDesign(_context, data.design);
            }
            else if (data.func == "getorcreatedesign")
            {
                return visitor.GetOrCreateDesign(_context, data.design, data.inspiration);
            }
            //else if (data.func == "designdata")
            //{
            //    int id = data.designid;
            //    return Design.GetDesignData(_context, id);
            //}
            else if (data.func == "copydesign")
            {
                string result = visitor.NewDesign(_context, data.design);
                if (!result.StartsWith("Error")) {
                    int designid = data.copyid;
                    return visitor.CopyDesign(_context, designid);
                }
                else
                {
                    return result;
                }
               
            }


            else if (data.func == "deletedesign")
            {
                int id = data.designid;
                return visitor.DeleteDesign(_context, id);
            }
            else if (data.func == "deleteprocesses")
            {
                int id = data.designid;
                return visitor.DeleteDesignProcesses(_context);
            }
            else if (data.func == "savedesign")
            {
                using (StreamReader sr = new StreamReader(Request.Body))
                {
                    dynamic data1 = JObject.Parse(sr.ReadToEnd());

                    var result  = visitor.Proces(_context, data1.proces);
                    if (result == "")
                    {
                        return visitor.SaveDesign(_context, data1.design);
                    }
                    else{
                        return "Error: Proces data.";
                    }
                }

               
            }
            else if (data.func == "resize")
            {
                int width = data.width;
                int height = data.height;
                return visitor.ResizeDesign(_context, width, height);

            }
            else if (data.func == "share")
            {
                int id = data.designid;
                return Design.Share(_context, id); ;
            }

            else if (data.func == "test12")
            {
                using (StreamReader sr = new StreamReader(Request.Body))
                {
                    //
                    dynamic data1 = JObject.Parse(sr.ReadToEnd());
                    return data1.p + " is ok!";
                }
            }
            //else if (data.func == "gendesign")  {
            //    int width = data.width;
            //    int height = data.height;
            //    int id = data.designid;
            //    FileData filedata = Design.GetFileData(_context, id, width, height, false);
            //    return JsonConvert.SerializeObject(filedata);

            //}
            //else if(data.func =="getmydesign"){
            //    return visitor.GetMyDesign(_context);
            //}
            if (data.func == "shared")
            {
                return visitor.MySharedDesigns(_context);
            }
            if (data.func == "allshared")
            {
                return visitor.AllSharedDesigns(_context);
            }
            else if (data.func == "getdesign")
            {
                int id = data.designid;
                return visitor.GetDesign(_context, id);
            }
            else if (data.func == "mydesigns")
            {

                return visitor.GetMyDesigns(_context);
            }
            else if (data.func == "alldesigns")
            {

                return visitor.AllDesigns(_context);
            }

            


            else if (data.func == "order")
            {
                int id = data.designid;
                return visitor.OrderDesign(_context, id);
            }
            else
            {
                return "Unkown webservice.";
            }

        }



    }
}
