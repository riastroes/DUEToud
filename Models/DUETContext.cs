using System;
using Microsoft.EntityFrameworkCore;

namespace DUET.Models
{
    public class DUETContext : DbContext
    {

        public DUETContext(DbContextOptions<DUETContext> options)
                : base(options)
        {
        }

        public DbSet<Member> Members { get; set; }
        public DbSet<Design> Designs { get; set; }
        public DbSet<Inspiration> Inspirations { get; set; }
        public DbSet<Stamp> Stamps { get; set; }
        public DbSet<Proces> Processes { get; set; }
        public DbSet<Order> Orders { get; set; }



    }
}


