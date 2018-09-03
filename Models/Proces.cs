using System;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace DUET.Models
{
    public class Proces
    {

        public int Id { get; set; }
        public int Index { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public int StampId { get; set; }
        public Stamp Stamp { get; set; }

        public int DesignId { get; set; }
        public Design Design { get; set; }


        public Proces() { }
        public Proces(int designid, int stampid, int x, int y, int index)
        {
            StampId = stampid;
            DesignId = designid;
            X = x;
            Y = y;
            Index = index;
        }
    }
}
