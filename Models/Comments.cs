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
using DUET.Shared;



namespace DUET.Models
{
    public class Comments
    {
        public int Id { get; set; }
        public string Content { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Date { get; set; }
        public string Response { get; set; }
        public bool Active { get; set; }

        public int MemberId { get; set; }
        public Member Member { get; set; }
    }

}
// Add profile data for application users by adding properties to the ApplicationUser class
