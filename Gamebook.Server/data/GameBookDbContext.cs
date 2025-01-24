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

        public DbSet<ConnectionPosition> ConnectionPositions { get; set; }
        public DbSet<Progress> Progress { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            base.OnModelCreating(modelBuilder);



            modelBuilder.Entity<Connection>()
          .HasOne(c => c.Room)
          .WithMany(r => r.ConnectionsFrom)
          .HasForeignKey(c => c.FromRoomId)
          .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            modelBuilder.Entity<Connection>()
                .HasOne(c => c.ToRoom)
                .WithMany(r => r.ConnectionsTo)
                .HasForeignKey(c => c.ToRoomId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // GameBookAction -> RequiredRoom
            modelBuilder.Entity<GameBookAction>()
                .HasOne(gba => gba.RequiredRoom)
                .WithMany(r => r.RequiredActions) // Assuming RequiredActions holds actions requiring the room
                .HasForeignKey(gba => gba.RequiredRoomId)
                .OnDelete(DeleteBehavior.Cascade);

            // GameBookAction -> CurrentRoom
            modelBuilder.Entity<GameBookAction>()
                .HasOne(gba => gba.CurrentRoom)
                .WithMany(r => r.TriggerActions) // Assuming TriggerActions holds actions triggered in the room
                .HasForeignKey(gba => gba.CurrentRoomId)
                .OnDelete(DeleteBehavior.Cascade);

          

            modelBuilder.Entity<ItemPosition>()
                .HasOne(ip => ip.Room)
                .WithMany()
                .HasForeignKey(ip => ip.RoomId);



 

            modelBuilder.Entity<Item>()
                .HasOne(i => i.RequiredRoom)
                .WithMany(r => r.RequiredItems)
                .HasForeignKey(i => i.RequiredRoomId)
                .OnDelete(DeleteBehavior.Cascade);

            // NPC relationships
            modelBuilder.Entity<NPC>()
                .HasOne(i => i.CurrentRoom)
                .WithMany(r => r.NPCs) // Assuming NPCs represents NPCs in the room
                .HasForeignKey(i => i.CurrentRoomId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NPC>()
                .HasOne(i => i.RequiredRoom)
                .WithMany(r => r.RequiredNPCs)
                .HasForeignKey(i => i.RequiredRoomId)
                .OnDelete(DeleteBehavior.Cascade);

            

            modelBuilder.Entity<ItemPosition>()
       .HasOne(ip => ip.Room)
       .WithMany(r => r.Items)
       .HasForeignKey(ip => ip.RoomId);

            modelBuilder.Entity<Item>()
       .HasOne(i => i.ItemPosition)
       .WithOne(ip => ip.Item)
       .HasForeignKey<Item>(i => i.ItemPositionId); // Use ItemPositionId as the foreign key

            // Configure ItemPosition to Room relationship
            modelBuilder.Entity<ItemPosition>()
                .HasOne(ip => ip.Room)
                .WithMany(r => r.Items)
                .HasForeignKey(ip => ip.RoomId);
        }

    }
}

