using System;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Runtime.Serialization;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json.Linq;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Drawing2D;

namespace DUET.Models
{
    public class Design
    {

        public int Id { get; set; }
        public string Name { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Date { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int DPI { get; set; }
        public int ViewWidth { get; set; }
        public int ViewHeight { get; set; }
        public bool Saved { get; set; }
        public bool Shared { get; set; }
        public int Red { get; set; }
        public int Blue { get; set; }
        public int Green { get; set; }
        public int Likes { get; set; }

        public int MemberId { get; set; }
        public Member Member { get; set; }

        public List<Proces> Processes { get; set; } = new List<Proces>();
        public List<Stamp> Stamps { get; set; } = new List<Stamp>();

        [NotMapped]
        [JsonIgnore]
        [IgnoreDataMember]
        public Stamp CurrentStamp;
        [NotMapped]
        [JsonIgnore]
        [IgnoreDataMember]
        public Color Bgcolor { get; set; }

        public Design() {

        }
        public Design(DUETContext db, Member Member, dynamic _design)
        {

            MemberId = Member.Id;
            Name = "DUET";
            if(_design.width == null)
            {
                Width = App.DESIGNWIDTH;
                Height = App.DESIGNHEIGHT;
               
            }
            else
            {
                Width = _design.width;
                Height = _design.height;
                
            }
            DPI = App.DPI;

            ViewWidth = _design.viewwidth;
            ViewHeight = _design.viewheight;
            
            Date = DateTime.Now;
            
            Saved = false;
            Shared = false;
            Likes = 0;
        }
        /********************TEST******/
        public static string TestGetDesigns(DUETContext db, int id)
        {
            try
            {
               Design adesign = db.Designs.Include(d => d.Member).First();

                return adesign.Member.Name;
            }
            catch(Exception exception)
            {
                return "Error: " + exception;
            }

        }

       /********************END TEST******/
        public void Init(DUETContext db, dynamic _design)
        {
            MemberId = Member.Id;
            Name = "DUET";
            Width = _design.width;
            Height = _design.height;
            DPI = App.DPI;
            ViewWidth = _design.viewwidth;
            ViewHeight = _design.viewheight;
            Date = DateTime.Now;
            Saved = false;
            Shared = false;
            Likes = 0;
            Red = 255;
            Green = 255;
            Blue = 255;
            Bgcolor = Color.FromArgb(Red, Green, Blue);

            Processes = new List<Proces>();
            Stamps = new List<Stamp>();
            CurrentStamp = null;

            db.Update(this);
            db.SaveChanges();
        }
        public static Design GetOpenOrNewDesign(DUETContext db, Member member, dynamic _design)
        {
            Design aDesign = db.Designs.LastOrDefault(d => d.MemberId == member.Id && d.Saved == false);
            if(aDesign == null)
            {
                aDesign = new Design(db, member, _design);
                db.Designs.Add(aDesign);
                db.SaveChanges();
            }
            
            return aDesign;
        }
        public void SetBackgroundColor(DUETContext db, int red, int green, int blue)
        {
            Red = red;
            Green = green;
            Blue = blue;
            Bgcolor = Color.FromArgb(red, green, blue);
            db.Designs.Update(this);
            db.SaveChanges();
        }
        public string Save(DUETContext db, dynamic _design)
        {
            try
            {
                Width = _design.width;
                Height = _design.height; 
                DPI = App.DPI;
                ViewWidth = _design.viewwidth;
                ViewHeight = _design.viewheight;
                Saved = true;
                db.Designs.Update(this);
                //verwijder niet gebruikte stamps.
                var stamps = db.Stamps.Where(d => d.Used == false );
                db.Stamps.RemoveRange(stamps);
                db.SaveChanges();

                return "";
            }
            catch (Exception exception)
            {
                return "Error: " + exception.Message;
            }
        }
        public string CreateStamp(DUETContext db, dynamic _stamp, dynamic _inspiration)
        {
            try
            {
                CurrentStamp = new Stamp(db, Id, _stamp, _inspiration);
                CurrentStamp.Save(db);
                Stamps.Add(CurrentStamp);

                
                return CurrentStamp.CreateBitmap(db, this);
            }
            catch (Exception exception)
            {
                return "Error 2: " + exception.Message;
            }

        }
        public string Proces(DUETContext db, dynamic _proces)
        {
            try {

                var index = ((JArray)_proces.index).Select(i => (int)i).ToArray();
                var x = ((JArray)_proces.x).Select(i => (int)i).ToArray();
                var y = ((JArray)_proces.y).Select(i => (int)i).ToArray();

                if (x.Length > 0)
                {
                    if (CurrentStamp.Used == false)
                    {
                        CurrentStamp.Used = true;
                        db.Stamps.Update(CurrentStamp);
                        db.SaveChanges();
                    }
                    {
                        for (var i = 0; i < x.Length; i++)
                        {

                            int a = App.factor(x[i], ViewWidth, Width);
                            int b = App.factor(y[i], ViewHeight, Height);  //square
                            int andex = index[i];

                            Proces proces = new Proces(Id, CurrentStamp.Id, a, b, andex);
                            Processes.Add(proces);

                        }
                        db.SaveChanges();
                    }
                }
                return "";
             }
            catch(Exception exception)
            {
                return "Error in Design Proces: " + exception.Message;
            }
        }
        public string CopyDesign(DUETContext db, int designid)
        {
            try
            {
                if (Saved == false)
                {
                    var copydesign = db.Designs.Where(d => d.Id == designid)
                                        .Include(d => d.Member)
                                        .Include(d => d.Processes)
                                        .ThenInclude(p => p.Stamp).First();

                    if (copydesign == null)
                    {
                        return "Error in Design Copy: No design found to copy.";
                    }
                    else
                    {

                        Width = copydesign.Width;
                        Height = copydesign.Height;

                        Red = copydesign.Red;
                        Green = copydesign.Green;
                        Blue = copydesign.Blue;

                        Processes = new List<Proces>();
                        Stamps = new List<Stamp>();
                        //db.Designs.Update(this);
                        var laststampid = -1;

                        for (var i = 0; i < copydesign.Processes.Count; i++)
                        {
                            Proces proces = new Proces();
                            proces.DesignId = Id;
                            proces.Index = copydesign.Processes[i].Index;
                            proces.X = copydesign.Processes[i].X;
                            proces.Y = copydesign.Processes[i].Y;

                            if (copydesign.Processes[i].StampId != laststampid) { 
                                var stamp = new Stamp();
                                stamp.DesignId = Id;
                                stamp.InspirationId = copydesign.Processes[i].Stamp.InspirationId;
                                stamp.InspirationWidth = copydesign.Processes[i].Stamp.InspirationWidth;
                                stamp.InspirationHeight = copydesign.Processes[i].Stamp.InspirationHeight;
                                stamp.Width = copydesign.Processes[i].Stamp.Width;
                                stamp.Height = copydesign.Processes[i].Stamp.Height;
                                stamp.X = copydesign.Processes[i].Stamp.X;
                                stamp.Y = copydesign.Processes[i].Stamp.Y;
                                stamp.Type = copydesign.Processes[i].Stamp.Type;
                                stamp.Shape = copydesign.Processes[i].Stamp.Shape;
                                stamp.Scale = copydesign.Processes[i].Stamp.Scale;
                                stamp.Rotate = copydesign.Processes[i].Stamp.Rotate;
                                stamp.Red = copydesign.Processes[i].Stamp.Red;
                                stamp.Green = copydesign.Processes[i].Stamp.Green;
                                stamp.Blue = copydesign.Processes[i].Stamp.Blue;
                                stamp.Used = true;

                                Stamps.Add(stamp);
                                db.Stamps.Add(stamp);
                                db.SaveChanges(); // deze moet anders heb je geen stampId in je proces

                                laststampid = copydesign.Processes[i].StampId;
                            }
                            proces.StampId = laststampid;
                            db.Processes.Add(proces);
                        }

                        db.SaveChanges();
                    }
                    return GetDesignData(db, designid);
                }
                else
                {
                    return "Error in Design Copy: Your design is already saved. First create a new Design.";
                }
            }
            catch(Exception exception)
            {
                return "Error in Design Copy: " + exception.Message;
            }
        }

               
        public static string DeleteDesign(DUETContext db, int designid)
        {
            try
            {
                
                var design = db.Designs.SingleOrDefault(d => d.Id == designid);
                if (design != null)
                {
                    db.Designs.Remove(design);
                    db.SaveChanges();
                    return "";
                }
                else
                {
                    return "";
                }
            }
            catch (Exception exception)
            {
                return "Error 4:" + exception.Message;
            }

        }      
        public static string GetInfo(DUETContext db, int id)
        {
            try
            {
                string str = "";
                //var adesign = db.Designs.Select(d => new { d.ID, d.Name, d.PathToDesign, d.Date, Owner = d.member.Name , d.Width, d.Height}).SingleOrDefault(d => d.ID == id);
                var adesign = db.Designs.SingleOrDefault(d => d.Id == id);
                var astamps = db.Stamps.Where(d => d.DesignId == id).ToArray();
                ///change
                //var aprocesses = db.Processes.Where(d => d.designID == id).ToArray();
                if (adesign != null)
                {

                    adesign.Member = db.Members.SingleOrDefault(d => d.Id == adesign.MemberId);
                    str += "<h3>" + adesign.Name + "-" + adesign.Id + "</h3>";
                    str += "<img src='' />";
                    str += "<p>";
                    str += "created by:" + adesign.Member.Name + "</br>";
                    str += "created on:" + adesign.Date + "</br>";
                    str += "width: " + adesign.Width + "</br>";
                    str += "height:" + adesign.Height + "</br>";
                    str += "used stamps:" + astamps.Length + "</br>";
                    ///change
                   // str += "stampings:" + aprocesses.Length + "</br>";
                    str += "</p>";

                    return str;

                }
                else
                {
                    str = id.ToString() + " not found.";
                    return str;
                }

            }
            catch (Exception exception)
            {
                return "Error 18:" + exception.Message;
            }
        }
        public static string GetDesignData(DUETContext db, int designid){
            try
            {
                var design = db.Designs.Where(d => d.Id == designid)
                                .Include(d => d.Member)
                                .Include(d => d.Processes)
                                .Include(d => d.Stamps).First();
                if (design != null)
                {

                    DesignData adesign = new DesignData();

                    adesign.Id = design.Id;
                    adesign.Name = design.Name;
                    adesign.Width = design.Width;
                    adesign.Height = design.Height;
                    adesign.DPI = design.DPI;
                    adesign.Owner = design.Member.Name;
                    adesign.Date = design.Date.ToShortDateString();
                    adesign.Shared = design.Shared;
                    adesign.Red = design.Red;
                    adesign.Blue = design.Blue;
                    adesign.Green = design.Green;
                    adesign.UsedStamps = design.Stamps.Count;
                    adesign.UsedStampings = design.Processes.Count;
                        
                    return JsonConvert.SerializeObject(adesign);
                }
                else
                {
                    return "Error: No Design";
                }

            }
            catch (Exception exception)
            {
                return "Error 27:" + exception.Message;
            }
        }
        public static string GetMyDesignsData(DUETContext db, Member Member)
        {
            try
            {
                var designs = db.Designs.Where(d => d.MemberId == Member.Id)
                                .Include(d => d.Processes)
                                .Include(d => d.Stamps).ToArray();
                if (designs != null)
                {
                    var designdata = new List<DesignData>();
                    for (var i = 0; i < designs.Length; i++)
                    {
                        DesignData adesign = new DesignData();

                        adesign.Id = designs[i].Id;
                        adesign.Name = designs[i].Name;
                        adesign.Width = designs[i].Width;
                        adesign.Height = designs[i].Height;
                        adesign.DPI = designs[i].DPI;
                        adesign.Owner = Member.Name;
                        adesign.Date = designs[i].Date.ToShortDateString();
                        adesign.Shared = designs[i].Shared;
                        adesign.Red = designs[i].Red;
                        adesign.Blue = designs[i].Blue;
                        adesign.Green = designs[i].Green;
                        adesign.UsedStamps = designs[i].Stamps.Count;
                        adesign.UsedStampings = designs[i].Processes.Count;

                        designdata.Add(adesign);
                    }

                    return JsonConvert.SerializeObject(designdata);
                }
                else
                {
                    return "Error: No Design";
                }

            }
            catch (Exception exception)
            {
                return "Error 27:" + exception.Message;
            }
        }
        public static string Share(DUETContext db, int id)
        {
            try
            {

                var adesign = db.Designs.SingleOrDefault(d => d.Id == id);
                if (adesign != null)
                {
                    adesign.Shared = !adesign.Shared;
                    db.Designs.Update(adesign);
                    db.SaveChanges();

                }
                return "";
            }
            catch (Exception exception)
            {
                return "Error 18:" + exception.Message;
            }
        }
        public static string AllSharedDesigns(DUETContext db)
        {
            
        try
            {
                var designs = db.Designs.Where(d => d.Shared == true)
                                .Include(d => d.Member).ToArray();
                                
                if (designs != null)
                {
                    var designdata = new List<DesignData>();
                    for (var i = 0; i<designs.Length; i++)
                    {
                        DesignData adesign = new DesignData();

                        adesign.Id = designs[i].Id;
                        adesign.Name = designs[i].Name;
                        adesign.Width = designs[i].Width;
                        adesign.Height = designs[i].Height;
                        adesign.DPI = designs[i].DPI;
                        adesign.Owner = designs[i].Member.Name;
                        adesign.Date = designs[i].Date.ToShortDateString();
                        adesign.Shared = designs[i].Shared;
                        adesign.Red = designs[i].Red;
                        adesign.Blue = designs[i].Blue;
                        adesign.Green = designs[i].Green;
                       

                        designdata.Add(adesign);
                    }

                    return JsonConvert.SerializeObject(designdata);
                }
                else
                {
                    return "Error: No Design";
                }

            }
            catch (Exception exception)
            {
                return "Error 27:" + exception.Message;
            }
        }
        public static string MySharedDesigns(DUETContext db, int memberid)
        {
            try
            {

                
                var designs = db.Designs.Where(d => d.MemberId == memberid && d.Shared == true).OrderByDescending(d => d.Date).Select(d => new { d.Id, d.Name, d.Date, Owner = d.Member.Name }).ToArray();
                if (designs.Length == 0)
                {
                    return "You did not share any designs yet!";
                }
                else
                {
                    return JsonConvert.SerializeObject(designs);
                }

            }
            catch (Exception exception)
            {
                return "Error 17:" + exception.Message;
            }
        }
        //public static string GetDesignData(DUETContext db,  int id)
        //{
        //    try
        //    {
        //        var adesign = db.Designs.SingleOrDefault(d => d.Id == id);
        //        if (adesign != null)
        //        {
        //            var designdata = new DesignData
        //            {
        //                Id = id,
        //                Width = adesign.Width,
        //                Height = adesign.Height,
        //                Owner =adesign.Member.Name,
        //                Date = adesign.Date.ToShortDateString(),
        //                Shared = adesign.Shared,
        //                Red = adesign.Red,
        //                Blue = adesign.Blue,
        //                Green = adesign.Green,
        //                UsedStamps = adesign.Stamps.Count,
        //                UsedStampings = adesign.Processes.Count
        //            };
        //            return JsonConvert.SerializeObject(designdata);
        //        }
        //        else
        //        {
        //            return "Error: No Design";
        //        }

        //    }
        //    catch (Exception exception)
        //    {
        //        return "Error 27:" + exception.Message;
        //    }
        //}
        public static Bitmap GenerateBitmap(DUETContext db, int id, int genwidth, int genheight)
        {
            try
            {
                var adesign = db.Designs.Where(d => d.Id == id)
                                .Include(d => d.Processes)
                                .ThenInclude(p => p.Stamp)
                                .First();


                var factor = (genwidth * 1.0) / adesign.Width;

                Bitmap designbitmap = new Bitmap(genwidth, genheight, PixelFormat.Format32bppArgb);

                if (adesign.Processes.Count > 0)
                {
                    using (Graphics GE = Graphics.FromImage(designbitmap))
                    {
                        GE.CompositingMode = CompositingMode.SourceOver;
                        float[][] matrixItems ={new float[] {1, 0, 0, 0, 0},
                                                    new float[] {0, 1, 0, 0, 0},
                                                    new float[] {0, 0, 1, 0, 0},
                                                    new float[] {0, 0, 0, 1, 0},
                                                    new float[] {0, 0, 0, 0, 1}};
                        ColorMatrix colorMatrix = new ColorMatrix(matrixItems);

                        ImageAttributes imageAtt = new ImageAttributes();
                        imageAtt.SetColorMatrix(colorMatrix, ColorMatrixFlag.Default, ColorAdjustType.Bitmap);

                        //Set backgroundcolor
                        using (SolidBrush brush = new SolidBrush(Color.FromArgb(adesign.Red, adesign.Green, adesign.Blue)))
                        {

                            Rectangle rectangle = new Rectangle(0, 0, adesign.Width, adesign.Height);
                            GE.FillRectangle(brush, rectangle);
                        }

                        ////doorloop alle processes

                        Bitmap bstamp = null;
                        int laststampid = -1;
                        foreach (var proces in adesign.Processes)
                        {
                            if(proces.StampId != laststampid){
                                proces.Stamp.CreateBitmap(db, adesign);
                                laststampid = proces.StampId;
                                Size size = new Size((int)(proces.Stamp.Bitmap.Width * factor), (int)(proces.Stamp.Bitmap.Height * factor));
                                bstamp = new Bitmap(proces.Stamp.Bitmap, size);
                            }
                            if (bstamp != null)
                            {


                                int w = bstamp.Width;
                                int h = bstamp.Height;
                                int tx = (int)((proces.X * factor) + (w / 2 * proces.Stamp.Scale));
                                int ty = (int)((proces.Y * factor) + (h / 2 * proces.Stamp.Scale));

                                if (proces.Stamp.Rotate > 0)
                                {
                                    Rectangle designrect = new Rectangle((int)(-w / 2 * proces.Stamp.Scale), (int)(-h / 2 * proces.Stamp.Scale), (int)(w * proces.Stamp.Scale), (int)(h * proces.Stamp.Scale));

                                    GE.TranslateTransform(tx, ty);
                                    GE.RotateTransform(proces.Stamp.Rotate);
                                    GE.DrawImage(bstamp, designrect, 0, 0, bstamp.Width, bstamp.Height, GraphicsUnit.Pixel, imageAtt);
                                    GE.ResetTransform();
                                }
                                else
                                {
                                    Rectangle designrect = new Rectangle((int)(proces.X * factor), (int)(proces.Y * factor), (int)(w * proces.Stamp.Scale), (int)(h * proces.Stamp.Scale));
                                    GE.DrawImage(bstamp, designrect, 0, 0, bstamp.Width, bstamp.Height, GraphicsUnit.Pixel, imageAtt);

                                }
                            }
                        }
                        //astamp.Bitmap.Dispose();
                        //bstamp.Dispose();
                    }

                }
                return designbitmap;
            }
            catch (Exception exception)
            {
                Console.Write("Error in Generate Bitmap:" + exception.Message);
                return null;
            }
        }
        public static Bitmap GeneratePattern(DUETContext db, int id, int width, int height)
        {

            var design = db.Designs.SingleOrDefault(d => d.Id == id);
            if (design != null)
            {
                // Create a Bitmap object from a file.
                Bitmap pattern = new Bitmap(width, height);

                using (Bitmap bitmap = GenerateBitmap(db, id, width / 2, height / 2))
                {
                    Size size = new Size(width, height);
                    Size halfsize = new Size(width / 2, height / 2);


                    using (Graphics GE = Graphics.FromImage(pattern))
                    {

                        Rectangle correct = new Rectangle(0, 0, halfsize.Width, halfsize.Height);

                        GE.DrawImage(bitmap, new Rectangle(0, 0, halfsize.Width, halfsize.Height), correct, GraphicsUnit.Pixel);
                        GE.DrawImage(bitmap, new Rectangle(halfsize.Width, 0, halfsize.Width, halfsize.Height), correct, GraphicsUnit.Pixel);
                        GE.DrawImage(bitmap, new Rectangle(halfsize.Width, halfsize.Height, halfsize.Width, halfsize.Height), correct, GraphicsUnit.Pixel);
                        GE.DrawImage(bitmap, new Rectangle(0, halfsize.Height, halfsize.Width, halfsize.Height), correct, GraphicsUnit.Pixel);

                        return pattern;
                    }
                }

            }
            return null;
        }

    }
}
public class FileData{
    public string filename { get; set; }
    //public Bitmap bitmap { get; set; }
    public int width { get; set; }
    public int height { get; set; }
    public int id { get; set; }
    //public string raw { get; set; }
}
public class DesignData
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public int DPI { get; set; }
    public string Owner { get; set; }
    public string Date { get; set; }
    public bool Shared { get; set; }
    public int Likes { get; set; }
    public int UsedStamps { get; set; }
    public int UsedStampings { get; set; }

    public int Red { get; set; }
    public int Green { get; set; }
    public int Blue { get; set; }
}

                                   
//https://osbornm.com/2010/07/02/webimage-introduction/