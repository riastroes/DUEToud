using System;
using Microsoft.AspNetCore.Hosting;
using DUET.Models;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.IO;


namespace DUET
{
    public class App
    {
        public static readonly DUET.Models.DUETContext DB;
        public static string ROOT { get; set; }
        public static int PROCESDAYS { get; set; }
        public static int MAXDESIGNWIDTH { get; set; }
        public static int MAXDESIGNHEIGHT { get; set; }
        public static int DPI { get; set; }
        
       
        public  static int userInToScreen(int _in)
        {
            return _in * 118;
        }
        public static byte[] ImageToByte(Image img, Size size, ImageFormat resultformat)
        {
            byte[] result;
            using (Image newImage = new Bitmap(img, size))
            {
                //using (Graphics graphics = Graphics.FromImage(newImage))
                //{
                //    // do some drawing
                //}

                using (MemoryStream ms = new MemoryStream())
                {
                    newImage.Save(ms, resultformat);
                    result = ms.ToArray();
                }
            }
            return result;
        }
       
        public static int factor(int w, int vw, int dw){
            
            return  (int)Math.Ceiling( (w * (dw*1.0) )/ vw);
        }
        public static Bitmap ResizeImage(Image img, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(img.HorizontalResolution, img.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(img, destRect, 0, 0, img.Width,img.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }
        


       

    }

}
