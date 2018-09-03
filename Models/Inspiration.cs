using System;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Runtime.Serialization;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;

namespace DUET.Models
{
    public class Inspiration
    {

        public int Id { get; set; }
        public string Title { get; set; }
        public string Src { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public float DPIH { get; set; } 
        public float DPIV { get; set; } 


        public static int Get(DUETContext db, string title)
        {
            Inspiration aInspiration = db.Inspirations.SingleOrDefault(i => i.Title == title);
           return aInspiration.Id;
        }
        public static Inspiration GetWithID(DUETContext db, int ID)
        {
            return db.Inspirations.SingleOrDefault(i => i.Id == ID);
        }

        public static string Seed(DUETContext db){
            string result = "";
            if(result == ""){
                result = Inspiration.Add(db, "GDansk", "img1.jpg");
            }
            if (result == "")
            {
                result = Inspiration.Add(db, "GDinia", "img2.jpg");
            }
            if (result == "")
            {
                result = Inspiration.Add(db, "Chicago", "img3.jpg");
            }
            if (result == "")
            {
                result = Inspiration.Add(db, "Miami", "img4.jpg");
            }
            //if (result == "")
            //{
            //    result = Inspiration.Add(db, "Bali", "img5.jpg");
            //}
            //if (result == "")
            //{
            //    result = Inspiration.Add(db, "Curacau", "img6.jpg");
            //}
            //if (result == "")
            //{
            //    result = Inspiration.Add(db, "Enschede", "img7.jpg");
            //}
            //if (result == "")
            //{
            //    result = Inspiration.Add(db, "Amsterdam", "img8.jpg");
            //}
            db.SaveChanges();
            return result;
        }
        public static string Add( DUETContext db, string title, string src){
            
            try
            {
                string path = App.ROOT + "images/big/" + src;
                using(var bitmap = new Bitmap(path)){
                    var inspiration = new Inspiration();
                    inspiration.Title = title;
                    inspiration.Src = "images/big/" + src;
                    inspiration.Width = bitmap.Width;
                    inspiration.Height = bitmap.Height;
                    inspiration.DPIH = bitmap.HorizontalResolution;  //pixels per inch
                    inspiration.DPIV = bitmap.VerticalResolution;   //pixels per inch

                    db.Inspirations.Add(inspiration);
                    db.SaveChanges();
                }
                return "";
            }
            catch(Exception exception){
                return "Error: " + exception.Message;
            }
        }

        public static string Delete(DUETContext db, int ID)
        {
            string result = "";
            try
            {
                Inspiration inspiration = db.Inspirations.FirstOrDefault(i => i.Id == ID);
                if (inspiration != null)
                {
                    db.Remove(inspiration);
                    db.SaveChanges();
                    return result;
                }
                else{
                    return "Error: Inspiration " + ID + " not found.";
                }


            }
            catch (Exception exception)
            {
                return "Error: " + exception.Message;
            }
        }


       


    }
}

