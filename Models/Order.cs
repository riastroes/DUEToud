using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json.Linq;

namespace DUET.Models
{
    public class Order
    {

        public int Id { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime OrderDate { get; set; }


        public int DesignId { get; set; }
        public Design Design { get; set; }

        public int MemberId { get; set; }
        public Member Member { get; set; }

        public bool Sample { get; set; }
        public bool Photo { get; set; }
        public string Photosize { get; set; }
        public bool Fabric { get; set; }
        public decimal Meters { get; set; }

        public string DeliveryType { get; set; }

        public decimal OrderCost { get; set; }
        public decimal DeliveryCost { get; set; }
        public decimal BTW { get; set; }
        public decimal Total { get; set; }

        public bool Confirmed { get; set; }
        public bool Payed { get; set; }
        public bool Processed { get; set; }
        public bool Shipped { get; set; }
        public bool Ready { get; set; }

        public DateTime PayDate { get; set; }
        public DateTime ProcessedDate { get; set; }
        public DateTime ShippedDate { get; set; }
        public DateTime ReadyDate { get; set; }



        public Order() { }
        public Order(Member _member, Design _design)
        {
            MemberId = _member.Id;
            DesignId = _design.Id;
            OrderDate = DateTime.Now;

        }
        public string Save(DUETContext db)
        {
            try
            {
                db.Orders.Add(this);
                db.SaveChanges();
                return GetNr();
            }
            catch (Exception exception)
            {
                return "Error: " + exception.Message;
            }
        }
        public string GetNr()
        {
            return "DUET" + DesignId + "-" + MemberId + "-" + this.Id;
        }
        public static void ResetProcessedDate(DUETContext db)
        {
            var orders = db.Orders.Where(o => o.Processed == false).ToArray();
            for (int i = 0; i < orders.Length;i++)
            {
                orders[i].ProcessedDate = orders[i].OrderDate.AddDays(App.PROCESDAYS);
            }
            db.Orders.UpdateRange(orders);
            db.SaveChanges();
        }

    }
    public class OrderData
    {
        public int designid { get; set; }
        public string ordernr { get; set; }
        public string name { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string address { get; set; }
        public string zipcode { get; set; }
        public string city { get; set; }
        public string country { get; set; }

    }
}