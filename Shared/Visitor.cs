using System;
using System.Linq;
using System.Collections.Concurrent;
using DUET.Models;
using Newtonsoft.Json;
using System.Drawing;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DUET.Shared
{
    public class Visitor
    {
        private static readonly ConcurrentDictionary<string, Visitor> Visitors = new ConcurrentDictionary<string, Visitor>();
        private string GUID;
        private Design CurrentDesign;
        

        public Visitor(string GUID = null)
        {
            this.GUID = GUID;
        }
        public static Visitor GetOrCreate(string GUID)
        {
            return Visitors.GetOrAdd(GUID, new Visitor(GUID));
        }
        //members
        public bool TryUpdate(string GUID, Member Member, Visitor Visitor){
            
               return Visitors.TryUpdate(GUID, Member, Visitor);

        }
        public string Login(DUETContext db, dynamic data)
        {
            try
            {
                string email = data.email;
                var member = db.Members.FirstOrDefault(m => m.Email == email);

                if (member == null)
                {
                    return "Error: Emailaddress unknown.";
                }
                else
                {
                    string password = data.password;
                    if (member.Password == password)
                    {
                        member.Visits += 1;
                        db.Members.Update(member);
                        db.SaveChanges();

                        string GUID = data.GUID;
                        Visitors.TryUpdate(GUID, member, this);

                        return member.Name;

                    }
                    else
                    {
                        return "Error: Password unkown.";
                    }
                }

            }
            catch
            {
                return "Error: Sorry, something went wrong. Please try again. <br/>" ;
            }

        }
        public string GetName(){
            
            var member = this as Member;
            if(member == null)
            {
                return ""; //just a visitor
            }
            else
            {
                return member.Name;
            }

        }
        public string Register(DUETContext db, dynamic data)
        {
            try
            {
                string email = data.email;
                var member = db.Members.FirstOrDefault(m => m.Email == email);

                if (member == null)
                {
                    member = new Member();
                    member.GUID = this.GUID;
                    member.Name = data.name;
                    member.Email = data.email;
                    member.Password = data.password;
                    member.Phone = data.phone;
                    member.Address = data.address;
                    member.Zipcode = data.zipcode;
                    member.City = data.city;
                    string country = data.country;
                    country = country.ToUpper();
                    if(country == "" || country == "NETHERLANDS" || country == "NETHERLAND" || country == "NEDERLANDS"){
                        country = "NEDERLAND";
                    }
                    member.Country = country;
                    member.StartDate = DateTime.Now;

                    db.Members.Add(member);
                    db.SaveChanges();

                   return Login(db, data);

                }
                else
                {
                    if (member.Password == data.password)
                    {
                        member.Name = data.name;
                        member.Email = data.email;
                        member.Password = data.password;
                        member.Phone = data.phone;
                        member.Address = data.address;
                        member.Zipcode = data.zipcode;
                        member.City = data.city;
                        string country = data.country;
                        country = country.ToUpper();
                        if (country == "" || country == "NETHERLANDS" || country == "NETHERLAND" || country == "NEDERLANDS")
                        {
                            country = "NEDERLAND";
                        }
                        member.Country = country;

                        db.Members.Update(member);
                        db.SaveChanges();

                        return Login(db, data);
                    }
                    else
                    {

                        return "Error: Password unknown.";
                    }
                }

            }
            catch (Exception exception)
            {
                return "Error:" +exception.Message;
            }

        }
        public string ChangeRegistration(DUETContext db, dynamic data)
        {
            try
            {
                var member = this as Member;
                member.GUID = this.GUID;
                member.Name = data.name;
                member.Email = data.email;
                member.Password = data.password;
                member.Email = data.email;
                member.Password = data.password;
                member.Phone = data.phone;
                member.Address = data.address;
                member.Zipcode = data.zipcode;
                member.City = data.city;
                string country = data.country;
                country = country.ToUpper();
                if (country == "" || country == "NETHERLANDS" || country == "NETHERLAND" || country == "NEDERLANDS")
                {
                    country = "NEDERLAND";
                }
                member.Country = country;

                db.Members.Update(member);
                db.SaveChanges();
                return "";
 
            }
            catch (Exception exception)
            {
                return "Error 11:" +exception.Message;
            }

        }
        public string Unsubscribe(DUETContext db, dynamic data)
        {
            try
            {
                string email = data.email;
                var dbmember = db.Members.FirstOrDefault(m => m.Email == email);

                if (dbmember == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    string password = data.password;
                    if (dbmember.Password == password)
                    {
                        dbmember.Name = data.name;
                        db.Members.Remove(dbmember);
                        db.SaveChanges();
                        return "";
                    }
                    else
                    {

                        return "Error: wrong password.";
                    }
                }

            }
            catch (Exception exception)
            {
                return "Error 12:" +exception.Message;
            }

        }
        public string GetMemberData(){

            var member = this as Member;
            if (member == null){
                return "";
            }
            else{
                return JsonConvert.SerializeObject(member);
            }

        }
        public string GetMembers(DUETContext db)
        {
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    return JsonConvert.SerializeObject(db.Members);

                }
            }
            catch (Exception exception)
            {
                return "Error 16:" + exception.Message;
            }
        }

        //design
        public string NewDesign(DUETContext db, dynamic _design)
        {
            var member = this as Member;
            if (member == null)
            {
                return "Error: Member unknown";
            }
            else
            {
                if (CurrentDesign == null || CurrentDesign.Saved == true)
                {
                    CurrentDesign = Design.GetOpenOrNewDesign(db, member, _design);
                    return JsonConvert.SerializeObject(CurrentDesign);
                }
                return Design.GetDesignData(db, CurrentDesign.Id);
                
            }
        }
        public string GetOrCreateDesign(DUETContext db, dynamic _design, dynamic _inspiration ){
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown";
                }
                else
                {
                    if(CurrentDesign == null){

                        CurrentDesign = db.Designs.LastOrDefault(d => d.MemberId == member.Id );
                        if (CurrentDesign == null)
                        {
                            CurrentDesign = new Design(db, member, _design);
                            CurrentDesign.Init(db, _design);

                            return JsonConvert.SerializeObject(CurrentDesign);

                        }
                        else{
                            CurrentDesign.Init(db,_design);
                            return JsonConvert.SerializeObject(CurrentDesign);
                        }
                    }
                    else{
                        //int id = design.ID;
                        //design = new Design(db, Member, _design);
                        //design.ID = id;
                        //design.Init(db);
                        return JsonConvert.SerializeObject(CurrentDesign);
                    }
                   
                }
                            }
            catch (Exception exception)
            {
                return "Error 13: " + exception.Message;
            }


        }
        public string DeleteDesignProcesses(DUETContext db)
        {
            var member = this as Member;
            if (member == null)
            {
                return "Error: Member unknown";
            }
            else
            {
                CurrentDesign.Processes = new List<Proces>();
                CurrentDesign.Stamps = new List<Stamp>();
                var stamps = db.Stamps.Where(d => d.DesignId == CurrentDesign.Id && d.Id != CurrentDesign.CurrentStamp.Id);
                db.Stamps.RemoveRange(stamps);
                return "";
            }
            
        }
        public string DeleteDesign(DUETContext db, int id){
            
            try{
                //verwijder design uit designs

                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown";
                }
                else
                {
                    return Design.DeleteDesign(db, id);
                }
                
            }
            catch(Exception exception){
                
                return "Error 14: " + exception.Message;
            }
           
        }
        public string SaveDesign(DUETContext db,dynamic _design)
        {
            var member = this as Member;
            if(member == null){
                return "Error 1: Member Unknown.";
            }
            else{
                return CurrentDesign.Save(db, _design);
            }
        }
        public string SetBgColor(DUETContext db, int id, int red, int green, int blue){
            var member = this as Member;
            if (member == null)
            {
                return "Error: Member unknown.";
            }
            else if (CurrentDesign == null)
            {
                return "Error: design unknown.";
            }
            else
            {
                if (CurrentDesign.Id == id)
                {
                    CurrentDesign.SetBackgroundColor(db, red, green, blue);
                    return "";
                }
                else{
                    return "Error: Different Design was active.";
                }

            }
        }
        //public string GetStamp(DUETContext db, dynamic _stamp, dynamic _inspiration)
        //{


        //    var member = this as Member;
        //    if (member == null)
        //    {
        //        return "Error: Member unknown.";
        //    }
        //    else 
        //    {
        //        if (CurrentDesign == null) {
        //            return "Error: design unknown.";
        //        }
        //        else
        //        {
        //            if (CurrentDesign.CurrentStamp != null)
        //            {
        //                return CurrentDesign.CurrentStamp.Id.ToString();
        //            }
        //            else
        //            {
        //                return CurrentDesign.CreateStamp(db, _stamp, _inspiration);
        //            }
        //        }
        //    }
            
        //}
        public string CreateStamp(DUETContext db, dynamic _stamp, dynamic _inspiration)
        {


            var member = this as Member;
            if (member == null)
            {
                return "Error: Member unknown.";
            }
            else if (CurrentDesign == null)
            {
                return "Error: design unknown.";
            }
            else
            {

                return CurrentDesign.CreateStamp(db, _stamp, _inspiration);

            }
        }
        public string Proces(DUETContext db, dynamic _proces )
        {
            var member = this as Member;
            if (member == null)
            {
                return "Error: Member unknown";
            }
            else
            {
                if (CurrentDesign == null)
                {
                    return "Error: Design unknown";
                }
                else
                {
                    return CurrentDesign.Proces(db, _proces);
                }
             }
        }
        public string GetDesign(DUETContext db, int designid){
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    return Design.GetDesignData(db, designid);
                }
            }
            catch (Exception exception)
            {
                return "Error 16:" + exception.Message;
            }
        }
        public string GetMyDesigns(DUETContext db)
        {
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    return Design.GetMyDesignsData(db, member);
                }
            }
            catch(Exception exception){
                return "Error 16:" + exception.Message;
            }
        }
        public string MySharedDesigns(DUETContext db)
        {
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    return Design.MySharedDesigns(db, member.Id);

                }
            }
            catch (Exception exception)
            {
                return "Error 16:" + exception.Message;
            }
        }
        public string AllSharedDesigns(DUETContext db)
        {
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    return Design.AllSharedDesigns(db);

                }
            }
            catch (Exception exception)
            {
                return "Error 16:" + exception.Message;
            }
        }
        
        public string AllDesigns(DUETContext db)
        {
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    var designs = db.Designs.OrderByDescending(d => d.Date).Select(d => new { d.Id, d.Name, d.Date, d.Shared, d.Width, d.Height, d.ViewWidth, d.ViewHeight, Owner = d.Member.Name }).ToArray();
                    if (designs.Length == 0)
                    {
                        return "Error: There are no saved designs, yet!";
                    }
                    else
                    {
                        return JsonConvert.SerializeObject(designs);
                    }

                }
            }
            catch (Exception exception)
            {
                return "Error 16:" + exception.Message;
            }
        }
        public bool checkDesignID(DUETContext db, int id)
        {

            bool check = false;
            var member = this as Member;
            if (member == null)
            {
                check = false;
            }
            else
            {
                var adesign = db.Designs.SingleOrDefault(d => d.Id == id && (d.MemberId == member.Id || d.Shared == true));
                if (adesign == null)
                {
                    check = false;
                }
                else
                {
                    check = true;
                }
            }
            return check;
        }
        public string ResizeDesign(DUETContext db, int width, int height){
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: No Member.";
                }
                else
                {
                    if (CurrentDesign == null)
                    {
                        return "";
                    }
                    else
                    {
                        CurrentDesign.ViewWidth = width;
                        CurrentDesign.ViewHeight = height;
                        db.Designs.Update(CurrentDesign);
                        db.SaveChanges();
                        return "";
                    }
                }
            }
            catch (Exception exception)
            { return "Error: " + exception.Message; 
            }
        }
        public string CopyDesign(DUETContext db, int id)
        {
            try
            {


                var member = this as Member;
                if (member == null)
                {
                    return "Error: No Member.";
                }
                else
                {
                    if (CurrentDesign == null)
                    {
                        return "Error: design unknown";
                    }
                    else
                    {
                        
                        var adesign = db.Designs.SingleOrDefault(d => d.Id == id && (d.MemberId == member.Id || d.Shared == true));
                        if (adesign == null)
                        {
                            return "Error: No design.";
                        }
                        else
                        {

                            ///change
                            //design.Processes = new List<Proces>();
                            //design.DPI = adesign.DPI;
                            //design.Width = adesign.Width;
                            //design.Height = adesign.Height;
                            //design.Red = adesign.Red;
                            //design.Green = adesign.Green;
                            //design.Blue = adesign.Blue;

                            //design.Saved = false;

                            //db.Designs.Update(design);
                            //db.SaveChanges();
                           
                            //var processes = db.Processes.Where(p => p.designID == id).ToArray();
                            //foreach (var proces in processes)
                            //{
                            //    var newproces = new Proces();
                            //    newproces.Index = proces.Index;
                            //    newproces.X = proces.X;
                            //    newproces.Y = proces.Y;
        


                            //    var stamp = db.Stamps.SingleOrDefault(s => s.ID == proces.stampID);
                            //    var newstamp = new Stamp();

                            //        newstamp.inspirationID = stamp.inspirationID;
                            //        newstamp.Width = stamp.Width;
                            //        newstamp.Height = stamp.Height;

                            //        newstamp.X = stamp.X;
                            //        newstamp.Y = stamp.Y;
                            //        newstamp.InspirationWidth = stamp.InspirationWidth;
                            //        newstamp.InspirationHeight = stamp.InspirationHeight;


                            //        newstamp.Shape = stamp.Shape;
                            //        newstamp.Type = stamp.Type;
                            //        newstamp.Scale = stamp.Scale;
                            //        newstamp.Rotate = stamp.Rotate;
                            //        newstamp.Red = stamp.Red;
                            //        newstamp.Green = stamp.Green;
                            //        newstamp.Blue = stamp.Blue;

                            //        newstamp.designID = design.ID;

                            //        db.Stamps.Add(newstamp);
                            //        db.SaveChanges();


                            //    newproces.stampID = newstamp.ID;
                            //    newproces.designID = design.ID;
                            //    db.Processes.Add(newproces);
                            //    design.Processes.Add(newproces);

                            //}


                            //db.SaveChanges();
                            
                            //return processes.Length.ToString();
                        }
                        return "";
                    }
                   // return "";
                }
                //return "";
            }
            catch(Exception exception){
                return "Error: " + exception.Message;
            }

        }

        //orders
        public string GetOrCreateOrder(DUETContext db, int id)
        {
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else 
                {
                    var adesign = db.Designs.SingleOrDefault(d => d.Id == id);
                    if(adesign == null){
                        return "Error: design unknown.";
                    }
                    else{


                        var anorder = db.Orders.LastOrDefault(o => o.MemberId == member.Id && o.DesignId == adesign.Id);
                        if (anorder == null)
                        {
                            anorder = new Order(member, adesign);
                            anorder.Save(db);
                        }

                        var orderdata = new OrderData();
                        orderdata.designid = id;
                        orderdata.ordernr = anorder.GetNr();
                        orderdata.name = member.Name;
                        orderdata.address = member.Address;
                        orderdata.zipcode = member.Zipcode;
                        orderdata.city = member.City;
                        orderdata.country = member.Country;
                        return JsonConvert.SerializeObject(orderdata);
;

                    }    

                }
            }
            catch (Exception exception)
            {
                return "Error 36:" + exception.Message;
            }
        }
        public string ConfirmOrder(DUETContext db, dynamic data)
        {
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    int id = data.orderid;
                    var anorder = db.Orders.SingleOrDefault(o => o.Id == id);
                    if (anorder == null)
                    {
                        return "Error: order unknown";
                    }
                    else
                    {
                        anorder.Sample = (data.ordertype == "sample") ? true : false;
                        anorder.Fabric = (data.ordertype == "fabric") ? true : false;
                        anorder.Meters = data.meters;
                        anorder.Photo = (data.ordertype == "photo") ? true : false;
                        anorder.Photosize = data.photosize; 
                        anorder.DeliveryType = data.deliverytype;
                        anorder.OrderCost = data.costorder;
                        anorder.DeliveryCost = data.costdelivery;
                        anorder.BTW = data.btw;
                        anorder.Total = data.total;
                        anorder.OrderDate = DateTime.Now;
                        anorder.ProcessedDate = DateTime.Now.AddDays(App.PROCESDAYS);
                        anorder.Confirmed = true;

                        db.Orders.Update(anorder);
                        db.SaveChanges();
                        return "";

                    }

                }
            }
            catch (Exception exception)
            {
                return "Error 37:" + exception.Message;
            }
        }
        public string GetAllOrders(DUETContext db)
        {

            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    var orders = db.Orders.Select(o => new
                    {
                        o.Id,
                        o.MemberId,
                        o.DesignId,
                        o.OrderDate,
                        o.Sample,
                        o.Photo,
                        o.Photosize,
                        o.Fabric,
                        o.Meters,
                        o.DeliveryType,
                        o.OrderCost,
                        o.DeliveryCost,
                        o.BTW,
                        o.Total,
                        o.Confirmed,
                        o.Payed,
                        o.PayDate,
                        o.Processed,
                        o.ProcessedDate,
                        o.Shipped,
                        o.ShippedDate,
                        o.Ready,
                        o.ReadyDate,
                        MemberName = member.Name,
                        MemberPhone = member.Phone,
                        MemberEmail = member.Email,
                        MemberAddress = member.Address,
                        MemberZipcode = member.Zipcode,
                        MemberCity = member.City,
                        MemberCountry = member.Country
                    }).OrderByDescending(o => o.OrderDate);
                    return JsonConvert.SerializeObject(orders);
                }
            }
            catch (Exception exception)
            {
                return "Error 38:" + exception.Message;
            }
        }
        public string GetMyOrders(DUETContext db)
        {

            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    return JsonConvert.SerializeObject(db.Orders.Where(o => o.MemberId == member.Id && o.Confirmed).OrderByDescending(o => o.OrderDate));
                }
            }
            catch (Exception exception)
            {
                return "Error 39:" + exception.Message;
            }
        }
        public string OrderDesign(DUETContext db, int id)
        {
            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    var orderdesign = db.Designs.SingleOrDefault(d => d.MemberId == member.Id && d.Id == id);
                    if (orderdesign == null)
                    {
                        return "Error: design unknown.";
                    }
                    else
                    {
                        Order order = new Order(member, CurrentDesign);
                        return "";
                    }

                }
            }
            catch (Exception exception)
            {
                return "Error 16:" + exception.Message;
            }
        }
        public string SetOrderStatus(DUETContext db, int id, string status)
        {

            try
            {
                var member = this as Member;
                if (member == null)
                {
                    return "Error: Member unknown.";
                }
                else
                {
                    var order = db.Orders.SingleOrDefault(o => o.Id == id);
                    if(order != null){
                        if(status == "Payed"){
                            order.Payed = true;
                            order.PayDate = DateTime.Now;
                        }
                        else if (status == "Processed")
                        {
                            order.Processed = true;
                            order.ProcessedDate = DateTime.Now;
                        }

                        else if (status == "Shipped")
                        {
                            order.Shipped = true;
                            order.ShippedDate = DateTime.Now;
                        }
                        else if (status == "Ready")
                        {
                            order.Ready = true;
                            order.ReadyDate = DateTime.Now;
                        }
                        db.Orders.Update(order);
                        db.SaveChanges();
                        return "";
                    }
                    else{
                        return "Error: Order Unknown.";
                    }
                    
                }
            }
            catch (Exception exception)
            {
                return "Error 39:" + exception.Message;
            }
        }
    }
}

