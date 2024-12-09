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
        public DbSet<Option> Options { get; set; }
        public DbSet<Room> Rooms { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Room and Connection relationship configuration
            modelBuilder.Entity<Connection>()
                .HasOne<Room>()
                .WithMany(r => r.ConnectionsFrom)
                .HasForeignKey(c => c.FromRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Connection>()
                .HasOne<Room>()
                .WithMany(r => r.ConnectionsTo)
                .HasForeignKey(c => c.ToRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            // Other configurations remain unchanged
            modelBuilder.Entity<ActionType>()
                .HasKey(a => a.ActionTypeId);

            modelBuilder.Entity<GameBookAction>()
                .HasKey(g => g.ActionId);

            modelBuilder.Entity<GameBookAction>()
                .HasOne(g => g.ActionType)
                .WithMany()
                .HasForeignKey(g => g.ActionTypeId);

            modelBuilder.Entity<GameBookAction>()
                .HasMany(g => g.Options)
                .WithOne();

            modelBuilder.Entity<Item>()
                .HasKey(i => i.ItemId);

            modelBuilder.Entity<Item>()
                .HasOne<ActionType>(i => i.Action)
                .WithMany();

            modelBuilder.Entity<ItemPosition>()
                .HasKey(ip => ip.ItemPositionId);

            modelBuilder.Entity<ItemPosition>()
                .HasOne(ip => ip.Room)
                .WithMany(r => r.ItemPositions)
                .HasForeignKey(ip => ip.RoomId);

            modelBuilder.Entity<ItemPosition>()
                .HasOne(ip => ip.Item)
                .WithMany();

            modelBuilder.Entity<NPC>()
                .HasKey(n => n.NPCId);

            modelBuilder.Entity<NPC>()
                .HasOne<ActionType>(n => n.Action)
                .WithMany();

            modelBuilder.Entity<Option>()
                .HasKey(o => new { o.Label, o.Text });

            modelBuilder.Entity<Room>()
                .HasKey(r => r.RoomId);

            modelBuilder.Entity<Room>()
                .HasMany(r => r.Items)
                .WithMany();

            modelBuilder.Entity<Room>()
                .HasMany(r => r.NPCs)
                .WithMany();

            modelBuilder.Entity<Room>()
                .HasMany(r => r.RequiredItems)
                .WithMany();

            modelBuilder.Entity<Room>()
                .HasMany(r => r.RequiredNPCs)
                .WithMany();

            modelBuilder.Entity<Room>()
                .HasMany(r => r.RequiredActions)
                .WithMany();
        }

    }
}

