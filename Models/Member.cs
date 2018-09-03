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
    public class Member : Visitor
    {
        public int Id { get; set; }
        [StringLength(60, MinimumLength = 3)]
        [Required]
        public string Name { get; set; }
        [DataType(DataType.EmailAddress)]
        [Required]
        public string Email { get; set; }
        [DataType(DataType.Password)]
        [Required]
        public string Password { get; set; }
        public int Visits { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime StartDate { get; set; }
        public string Address { get; set; }
        public string Zipcode { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }


    }

}
// Add profile data for application users by adding properties to the ApplicationUser class
