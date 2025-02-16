using Gamebook.Server.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Gamebook.Server.Data
{
    public class GamebookDbContext : IdentityDbContext<User>
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
        public DbSet<Progress> Progress { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Prevent cascade delete for room connections
            modelBuilder.Entity<Connection>()
                .HasOne(c => c.Room)
                .WithMany(r => r.ConnectionsFrom)
                .HasForeignKey(c => c.FromRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Connection>()
                .HasOne(c => c.ToRoom)
                .WithMany(r => r.ConnectionsTo)
                .HasForeignKey(c => c.ToRoomId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GameBookAction>()
                .HasOne(gba => gba.CurrentRoom)
                .WithMany(r => r.TriggerActions)
                .HasForeignKey(gba => gba.CurrentRoomId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ItemPosition>()
                .HasOne(ip => ip.Room)
                .WithMany()
                .HasForeignKey(ip => ip.RoomId);

            modelBuilder.Entity<Item>()
                .HasOne(i => i.RequiredConnection)
                .WithMany(r => r.RequiredItems)
                .HasForeignKey(i => i.RequiredConnectionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NPC>()
                .HasOne(n => n.CurrentRoom)
                .WithMany(r => r.NPCs)
                .HasForeignKey(n => n.CurrentRoomId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NPC>()
                .HasOne(n => n.RequiredConnection)
                .WithMany(r => r.RequiredNPCs)
                .HasForeignKey(n => n.RequiredConnectionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ItemPosition>()
                .HasOne(ip => ip.Room)
                .WithMany(r => r.Items)
                .HasForeignKey(ip => ip.RoomId);

            modelBuilder.Entity<Item>()
                .HasOne(i => i.ItemPosition)
                .WithOne(ip => ip.Item)
                .HasForeignKey<Item>(i => i.ItemPositionId);

            // Configure Users table
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email) // Ensure unique emails
                .IsUnique();

            // Seed default admin user
            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "1", Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Id = "2", Name = "User", NormalizedName = "USER" }
              );

            var adminUser = new User
            {
                Id = "12345", // Use a GUID in production
                UserName = "admin@example.com",
                NormalizedUserName = "ADMIN@EXAMPLE.COM",
                Email = "admin@example.com",
                NormalizedEmail = "ADMIN@EXAMPLE.COM",
                EmailConfirmed = true
            };

           

            modelBuilder.Entity<User>().HasData(adminUser);

            // Assign Admin User to Admin Role
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string> { UserId = "12345", RoleId = "1" }
            );
        }
    }
}
