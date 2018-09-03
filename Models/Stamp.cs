using System;
using System.IO;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Runtime.Serialization;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;

namespace DUET.Models
{
    public class Stamp
    {

        public int Id { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        public int X { get; set; }
        public int Y { get; set; }
        public int InspirationWidth { get; set; }
        public int InspirationHeight { get; set; }

        public string Shape { get; set; }
        public string Type { get; set; }
        public float Scale { get; set; }
        public float Rotate { get; set; }
        public bool Used { get; set; }
        //Bgcolor values for filter types
        public int Red { get; set; }
        public int Green { get; set; }
        public int Blue { get; set; }

        public int DesignId { get; set; }
        public List<Design> Designs = new List<Design>();

        public int InspirationId { get; set; }
        
        [NotMapped]
        public int DestX { get; set; }
        [NotMapped]
        public int DestY { get; set; }
        [NotMapped]
        private static List<string> Shapes = new List<string> { "stamp1.png", "stamp2.png", "stamp3.png", "stamp4.png", "stamp5.png", "stamp6.png" };
        [NotMapped]
        private static List<string> Types = new List<string> { "color", "lightness", "copy" };
       
        [NotMapped]
        public Bitmap Bitmap { get; set; }
        


        public Stamp() { }
       
        public Stamp(DUETContext db, int Id, dynamic _stamp, dynamic _inspiration)
        {
            DesignId = Id;
            String title = _inspiration.title;
            InspirationId = Inspiration.Get(db, title);
            X = _inspiration.x;
            Y = _inspiration.y;
            InspirationWidth = _inspiration.width;
            InspirationHeight = _inspiration.height;
            Width = _stamp.width;
            Height = _stamp.height;
            int index = _stamp.shapeindex;
            Shape = Stamp.GetShape(index);
            Type = _stamp.type;
            Scale = _stamp.scale;
            Rotate = _stamp.rotate;
            Red = _stamp.r;
            Green = _stamp.g;
            Blue = _stamp.b;
            Used = false;

        }
        public String Save(DUETContext db)
        {
            try
            {
                db.Stamps.Add(this);
                db.SaveChanges();
                return "";
            }
            catch (Exception exception)
            {
                return "Error in Stamp Save: " + exception.Message;
            }
        }
        public static String GetShape(int index)
        {
            return Stamp.Shapes[index];
        }
        public static string Delete(DUETContext db, int designID){
            try
            {
                var stamps = db.Stamps.Where(s => s.DesignId == designID).ToArray();
                for (int s = 0; s < stamps.Length; s++){
                    if(stamps[s].Bitmap != null){
                        stamps[s].Bitmap.Dispose();
                    }

                }
                db.Stamps.RemoveRange(stamps);
                db.SaveChanges();
                return "";
            }
            catch(Exception exception){
                return "Error in Stamp Class: " + exception.Message;
            }
        }
        public Bitmap GenerateBitmap(DUETContext db, int designid)
        {

            try
            {
                Design design = db.Designs.SingleOrDefault(d => d.Id == designid);
                Inspiration aInspiration = Inspiration.GetWithID(db, this.InspirationId);

                string path = App.ROOT + aInspiration.Src;


                // Create a Bitmap object from a file.
                using (Bitmap bitmapInspire = new Bitmap(path))
                {
                    bitmapInspire.SetResolution(96.0F, 96.0F);

                    Size viewstampsize = new Size((int)(Width), (int)(Height));
                    int inspirex = App.factor(X, this.InspirationWidth, bitmapInspire.Width);
                    int inspirey = App.factor(Y, this.InspirationHeight, bitmapInspire.Height);


                    int inspirestampwidth = App.factor((int)(Width), design.ViewWidth, design.Width);
                    int inspirestampheight = App.factor((int)(Height), design.ViewWidth, design.Width); //make square
                    Size inspirestampsize = new Size(inspirestampwidth, inspirestampheight);
                    inspirex = (int)(inspirex - (inspirestampwidth / 2));
                    inspirey = (int)(inspirey - (inspirestampheight / 2));



                    //get bitmap from inspire
                    if (inspirex < 0) { inspirex = 0; }
                    if (inspirey < 0) { inspirey = 0; }
                    if (inspirex > bitmapInspire.Width - inspirestampwidth)
                    {
                        inspirex = bitmapInspire.Width - inspirestampwidth;
                    }
                    if (inspirey > bitmapInspire.Height - inspirestampheight)
                    {
                        inspirey = bitmapInspire.Height - inspirestampheight;
                    }
                    Rectangle inspirestampRect = new Rectangle(inspirex, inspirey, (int)(inspirestampwidth), (int)(inspirestampheight));

                    using (var inspirestampBitmap = bitmapInspire.Clone(inspirestampRect, PixelFormat.Format32bppPArgb))
                    {
                        byte[] inspireBytes = App.ImageToByte(inspirestampBitmap, inspirestampsize, ImageFormat.Bmp);


                        //Set filter with mask image
                        string maskpath = App.ROOT + "images/" + Shape;
                        using (Bitmap stampshape = new Bitmap(maskpath))
                        {
                            stampshape.SetResolution(96.0F, 96.0F);
                            using (var mask = App.ResizeImage(stampshape, inspirestampwidth, inspirestampheight))
                            {
                                byte[] maskBytes = App.ImageToByte(mask, inspirestampsize, ImageFormat.Bmp);

                                Color bgcolor = Color.FromArgb(Red, Green, Blue);
                                float hue = bgcolor.GetHue();
                                float saturation = bgcolor.GetSaturation();
                                float brightness = bgcolor.GetBrightness();
                                var sumcolor = bgcolor.R + bgcolor.G + bgcolor.B;

                                int start = maskBytes.Length - (inspirestampwidth * inspirestampheight * 4);
                                for (int i = start; i < maskBytes.Length; i += 4)
                                {
                                    if (maskBytes[i + 3] == 255)
                                    {
                                        maskBytes[i] = 0;
                                        maskBytes[i + 1] = 0;
                                        maskBytes[i + 2] = 0;
                                        maskBytes[i + 3] = 255;

                                    }
                                    else
                                    {
                                        maskBytes[i] = 255;
                                        maskBytes[i + 1] = 255;
                                        maskBytes[i + 2] = 255;
                                        maskBytes[i + 3] = 0;
                                    }
                                }
                                //in een bitmap wordt de array met kleuren van achteren naar voren opgebouwd dus het is elke keer B,G,R,A
                                if (Type == "copy")
                                {
                                    for (var i = start; i < maskBytes.Length; i += 4)
                                    {
                                        if (maskBytes[i + 3] < 255)
                                        {
                                            //transparant 
                                            inspireBytes[i] = 255;
                                            inspireBytes[i + 1] = 255;
                                            inspireBytes[i + 2] = 255;
                                            inspireBytes[i + 3] = 255;
                                        }

                                    }
                                }
                                else if (Type == "color")
                                {
                                    for (var i = start; i < maskBytes.Length; i += 4)
                                    {
                                        //if (maskBytes[i] == 255 && maskBytes[i + 1] == 255 && maskBytes[i + 2] == 255 && maskBytes[i + 3] == 0){
                                        if (maskBytes[i + 3] < 100)
                                        {
                                            //transparant 
                                            inspireBytes[i] = 255;
                                            inspireBytes[i + 1] = 255;
                                            inspireBytes[i + 2] = 255;
                                            inspireBytes[i + 3] = 255;
                                        }
                                        else
                                        {
                                            //color vergelijk color met bgcolor;
                                            Color acolor = Color.FromArgb(inspireBytes[i + 2], inspireBytes[i + 1], inspireBytes[i]);
                                            if (Math.Abs(acolor.GetHue() - hue) < 30)
                                            { //dezelfde kleur => verander niet
                                            }
                                            else
                                            {
                                                //maak wit => wit wordt transparant
                                                inspireBytes[i] = 255;
                                                inspireBytes[i + 1] = 255;
                                                inspireBytes[i + 2] = 255;
                                                inspireBytes[i + 3] = 255;
                                            }

                                        }
                                    }
                                }
                                else if (Type == "lightness")
                                {
                                    for (var i = start; i < maskBytes.Length; i += 4)
                                    {
                                        //if (maskBytes[i] == 255 && maskBytes[i +1] == 255 && maskBytes[i + 2] == 255 && maskBytes[i + 3] == 0)
                                        if (maskBytes[i + 3] < 100)
                                        {
                                            //transparant 
                                            inspireBytes[i] = 255;
                                            inspireBytes[i + 1] = 255;
                                            inspireBytes[i + 2] = 255;
                                            inspireBytes[i + 3] = 255;
                                        }
                                        else
                                        {
                                            //lightness vergelijk sum met stamp.bgcolor sum;
                                            Color acolor = Color.FromArgb(inspireBytes[i + 2], inspireBytes[i + 1], inspireBytes[i]);
                                            if (Math.Abs(acolor.GetBrightness() - brightness) < 0.1)
                                            {
                                                //dezefde lightness => verander niets
                                            }
                                            else
                                            {
                                                inspireBytes[i] = 255;
                                                inspireBytes[i + 1] = 255;
                                                inspireBytes[i + 2] = 255;
                                                inspireBytes[i + 3] = 255;
                                            }
                                        }
                                    }
                                }


                                //coversie van bytes[] naar memorystream naar bitmap
                                using (var ms = new MemoryStream(inspireBytes))
                                {
                                    Bitmap = new Bitmap(ms);
                                    Bitmap.MakeTransparent(Color.FromArgb(255, 255, 255));
                                    Bitmap.SetResolution(96.0F, 96.0F);

                                    //now create client site image
                                    //using (var bitmap1 = App.ResizeImage(Bitmap, this.Width, this.Height))
                                    //{
                                    //    bitmap1.MakeTransparent(Color.FromArgb(255, 255, 255));
                                    //    // Byte[] bytes = App.ImageToByte(bitmap1, viewstampsize, ImageFormat.Png);
                                    //    //conversie van bytes naar dataurl
                                    //    return bitmap1;
                                    //}
                                    return Bitmap;
                                }

                            }
                        }
                    }
                }
            }
            catch(Exception exception)
            {
                Console.Write("Error in stamp class: "+ exception.Message);
                return null;
            }

        }
        public string CreateBitmap(DUETContext db, Design design)
        {
            try
            {
                
               
                Inspiration aInspiration = Inspiration.GetWithID(db, this.InspirationId);
                
               

                string path = App.ROOT + aInspiration.Src;


                // Create a Bitmap object from a file.
                using (Bitmap bitmapInspire = new Bitmap(path))
                {
                    bitmapInspire.SetResolution(96.0F, 96.0F);

                    Size viewstampsize = new Size((int)(Width),(int)(Height));
                    int inspirex = App.factor(X, this.InspirationWidth, bitmapInspire.Width);
                    int inspirey = App.factor(Y, this.InspirationHeight, bitmapInspire.Height);


                    int inspirestampwidth = App.factor((int)(Width), design.ViewWidth, design.Width);
                    int inspirestampheight = App.factor((int)(Height), design.ViewWidth, design.Width); //make square
                    Size inspirestampsize = new Size(inspirestampwidth, inspirestampheight);
                    inspirex = (int)(inspirex - (inspirestampwidth/ 2));
                    inspirey = (int)(inspirey - (inspirestampheight / 2));



                    //get bitmap from inspire
                    if (inspirex < 0) { inspirex = 0; }
                    if (inspirey < 0) { inspirey = 0; }
                    if (inspirex > bitmapInspire.Width - inspirestampwidth) { 
                        inspirex = bitmapInspire.Width - inspirestampwidth; }
                    if (inspirey > bitmapInspire.Height - inspirestampheight) { 
                        inspirey = bitmapInspire.Height - inspirestampheight; }
                    Rectangle inspirestampRect = new Rectangle(inspirex, inspirey, (int)(inspirestampwidth), (int)(inspirestampheight));

                    using (var inspirestampBitmap = bitmapInspire.Clone(inspirestampRect, PixelFormat.Format32bppPArgb)){
                        byte[] inspireBytes = App.ImageToByte(inspirestampBitmap, inspirestampsize, ImageFormat.Bmp);
                            

                        //Set filter with mask image
                        string maskpath = App.ROOT + "images/" + Shape;
                        using (Bitmap stampshape = new Bitmap(maskpath))
                        {
                            stampshape.SetResolution(96.0F, 96.0F);
                            using (var mask = App.ResizeImage(stampshape, inspirestampwidth, inspirestampheight))
                            {
                                byte[] maskBytes = App.ImageToByte(mask, inspirestampsize, ImageFormat.Bmp);

                                Color bgcolor = Color.FromArgb(Red, Green, Blue);
                                float hue = bgcolor.GetHue();
                                float saturation = bgcolor.GetSaturation();
                                float brightness = bgcolor.GetBrightness();
                                var sumcolor = bgcolor.R + bgcolor.G + bgcolor.B;
                                
                                int start = maskBytes.Length - (inspirestampwidth * inspirestampheight * 4);
                                for (int i = start; i < maskBytes.Length; i+=4)
                                {
                                    if (maskBytes[i+3] == 255){
                                        maskBytes[i] = 0;
                                        maskBytes[i + 1] = 0;
                                        maskBytes[i + 2] = 0;
                                        maskBytes[i + 3] = 255;

                                    }
                                    else{
                                        maskBytes[i] = 255;
                                        maskBytes[i + 1] = 255;
                                        maskBytes[i + 2] = 255;
                                        maskBytes[i + 3] = 0;
                                    }
                                }
                                //in een bitmap wordt de array met kleuren van achteren naar voren opgebouwd dus het is elke keer B,G,R,A
                                if (Type == "copy")
                                {
                                    for (var i = start; i < maskBytes.Length; i += 4)
                                    {
                                        if (maskBytes[i + 3] < 255)
                                        {
                                            //transparant 
                                            inspireBytes[i] = 255;
                                            inspireBytes[i + 1] = 255;
                                            inspireBytes[i + 2] = 255;
                                            inspireBytes[i + 3] = 255;
                                        }

                                    }
                                }
                                else if (Type == "color")
                                {
                                    for (var i = start; i < maskBytes.Length; i += 4)
                                    {
                                        //if (maskBytes[i] == 255 && maskBytes[i + 1] == 255 && maskBytes[i + 2] == 255 && maskBytes[i + 3] == 0){
                                        if (maskBytes[i + 3] < 100)
                                        {
                                            //transparant 
                                            inspireBytes[i] = 255;
                                            inspireBytes[i + 1] = 255;
                                            inspireBytes[i + 2] = 255;
                                            inspireBytes[i + 3] = 255;
                                        }
                                        else
                                        {
                                            //color vergelijk color met bgcolor;
                                            Color acolor = Color.FromArgb(inspireBytes[i + 2], inspireBytes[i + 1], inspireBytes[i]);
                                            if (Math.Abs(acolor.GetHue() - hue) < 30)
                                            { //dezelfde kleur => verander niet
                                            }
                                            else
                                            {
                                                //maak wit => wit wordt transparant
                                                inspireBytes[i] = 255;
                                                inspireBytes[i + 1] = 255;
                                                inspireBytes[i + 2] = 255;
                                                inspireBytes[i + 3] = 255;
                                            }

                                        }
                                    }
                                }
                                else if (Type == "lightness")
                                {
                                    for (var i = start; i < maskBytes.Length; i += 4)
                                    {
                                        //if (maskBytes[i] == 255 && maskBytes[i +1] == 255 && maskBytes[i + 2] == 255 && maskBytes[i + 3] == 0)
                                        if (maskBytes[i + 3] < 100)
                                        {
                                            //transparant 
                                            inspireBytes[i] = 255;
                                            inspireBytes[i + 1] = 255;
                                            inspireBytes[i + 2] = 255;
                                            inspireBytes[i + 3] = 255;
                                        }
                                        else
                                        {
                                            //lightness vergelijk sum met stamp.bgcolor sum;
                                            Color acolor = Color.FromArgb(inspireBytes[i + 2], inspireBytes[i + 1], inspireBytes[i]);
                                            if (Math.Abs(acolor.GetBrightness() - brightness) < 0.1)
                                            {
                                                //dezefde lightness => verander niets
                                            }
                                            else
                                            {
                                                inspireBytes[i] = 255;
                                                inspireBytes[i + 1] = 255;
                                                inspireBytes[i + 2] = 255;
                                                inspireBytes[i + 3] = 255;
                                            }
                                        }
                                    }
                                }


                                //coversie van bytes[] naar memorystream naar bitmap
                                using (var ms = new MemoryStream(inspireBytes))
                                {
                                    Bitmap = new Bitmap(ms);
                                    Bitmap.MakeTransparent(Color.FromArgb(255, 255, 255));
                                    Bitmap.SetResolution(96.0F, 96.0F);

                                    //now create client site image
                                    using( var bitmap1 = App.ResizeImage(Bitmap, this.Width, this.Height)){
                                        bitmap1.MakeTransparent(Color.FromArgb(255, 255, 255));
                                        Byte[] bytes = App.ImageToByte(bitmap1, viewstampsize, ImageFormat.Png);
                                        //conversie van bytes naar dataurl
                                        return Convert.ToBase64String(bytes);
                                    }
                                }

                            }
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                return "Error in stamp class: "+ exception.Message;
            }

        }

    }
}

