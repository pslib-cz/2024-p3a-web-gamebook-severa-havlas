using Gamebook.Server.models;
using Microsoft.EntityFrameworkCore;


namespace Gamebook.Server.Data
{
    public class GamebookDbContext : DbContext
    {
        public GamebookDbContext(DbContextOptions<GamebookDbContext> options) : base(options) { }
       
        public DbSet<GameBookAction> Actions { get; set; }
        public DbSet<ActionType> ActionTypes { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemPosition> ItemPositions { get; set; }
        public DbSet<NPC> NPCs { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Dialog> Dialogs { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            // Room -> NPC relationship
            modelBuilder.Entity<NPC>()
                .HasOne(n => n.CurrentRoom) // Explicit navigation for Room
                .WithMany(r => r.NPCs)      // Room can have many NPCs
                .HasForeignKey(n => n.CurrentRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            // Room -> Item relationship
            modelBuilder.Entity<Item>()
                .HasOne(i => i.RequiredRoom) // Explicit navigation for Room
                .WithMany(r => r.RequiredItems)
                .HasForeignKey(i => i.RequiredRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            // ItemPosition -> Room relationship
            modelBuilder.Entity<ItemPosition>()
                .HasOne(ip => ip.Room)
                .WithMany(r => r.ItemPositions)
                .HasForeignKey(ip => ip.RoomId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }

    }
}

