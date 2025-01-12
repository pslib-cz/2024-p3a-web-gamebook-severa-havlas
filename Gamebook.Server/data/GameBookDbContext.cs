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


            base.OnModelCreating(modelBuilder);

            // Connection configuration
            modelBuilder.Entity<Connection>()
                .HasOne(c => c.FromRoom)
                .WithMany(r => r.ConnectionsFrom)
                .HasForeignKey(c => c.FromRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Connection>()
                .HasOne(c => c.ToRoom)
                .WithMany(r => r.ConnectionsTo)
                .HasForeignKey(c => c.ToRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            // GameBookAction -> RequiredRoom
            modelBuilder.Entity<GameBookAction>()
                .HasOne(gba => gba.RequiredRoom)
                .WithMany(r => r.RequiredActions) // Assuming RequiredActions holds actions requiring the room
                .HasForeignKey(gba => gba.RequiredRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            // GameBookAction -> CurrentRoom
            modelBuilder.Entity<GameBookAction>()
                .HasOne(gba => gba.CurrentRoom)
                .WithMany(r => r.TriggerActions) // Assuming TriggerActions holds actions triggered in the room
                .HasForeignKey(gba => gba.CurrentRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            // Item relationships
            modelBuilder.Entity<Item>()
                .HasOne(i => i.CurrentRoom)
                .WithMany(r => r.Items) // Assuming ItemPositions represents items in the room
                .HasForeignKey(i => i.CurrentRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Item>()
                .HasOne(i => i.RequiredRoom)
                .WithMany(r => r.RequiredItems)
                .HasForeignKey(i => i.RequiredRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            // NPC relationships
            modelBuilder.Entity<NPC>()
                .HasOne(i => i.CurrentRoom)
                .WithMany(r => r.NPCs) // Assuming NPCs represents NPCs in the room
                .HasForeignKey(i => i.CurrentRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<NPC>()
                .HasOne(i => i.RequiredRoom)
                .WithMany(r => r.RequiredNPCs)
                .HasForeignKey(i => i.RequiredRoomId)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}

