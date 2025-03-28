﻿// <auto-generated />
using System;
using Gamebook.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Gamebook.Server.Migrations
{
    [DbContext(typeof(GamebookDbContext))]
    [Migration("20250219200122_96")]
    partial class _96
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("Gamebook.Server.models.ActionType", b =>
                {
                    b.Property<int>("ActionTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("ActionTypeId");

                    b.ToTable("ActionTypes");
                });

            modelBuilder.Entity("Gamebook.Server.models.Connection", b =>
                {
                    b.Property<int>("ConnectionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("FromRoomId")
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("Img")
                        .HasColumnType("BLOB");

                    b.Property<int?>("Size")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ToRoomId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("X")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Y")
                        .HasColumnType("INTEGER");

                    b.HasKey("ConnectionId");

                    b.HasIndex("FromRoomId");

                    b.HasIndex("ToRoomId");

                    b.ToTable("Connections");
                });

            modelBuilder.Entity("Gamebook.Server.models.Dialog", b =>
                {
                    b.Property<int>("DialogId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ActionId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Label")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("NPCId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ParentDialogId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("DialogId");

                    b.HasIndex("ActionId");

                    b.HasIndex("NPCId");

                    b.HasIndex("ParentDialogId");

                    b.ToTable("Dialogs");
                });

            modelBuilder.Entity("Gamebook.Server.models.GameBookAction", b =>
                {
                    b.Property<int>("ActionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("ActionTypeId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CurrentRoomId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("MiniGameData")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("ReqAction")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ReqItem")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ReqNPC")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ReqProgress")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("RequiredConnectionId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ActionId");

                    b.HasIndex("ActionTypeId");

                    b.HasIndex("CurrentRoomId");

                    b.HasIndex("RequiredConnectionId");

                    b.ToTable("Actions");
                });

            modelBuilder.Entity("Gamebook.Server.models.Item", b =>
                {
                    b.Property<int>("ItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("GameBookActionId")
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("Img")
                        .HasColumnType("BLOB");

                    b.Property<int?>("ItemPositionId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("Price")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("RequiredConnectionId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Target")
                        .HasColumnType("INTEGER");

                    b.HasKey("ItemId");

                    b.HasIndex("GameBookActionId");

                    b.HasIndex("ItemPositionId")
                        .IsUnique();

                    b.HasIndex("RequiredConnectionId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("Gamebook.Server.models.ItemPosition", b =>
                {
                    b.Property<int>("ItemPositionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("RoomId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Size")
                        .HasColumnType("INTEGER");

                    b.Property<int>("X")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Y")
                        .HasColumnType("INTEGER");

                    b.HasKey("ItemPositionId");

                    b.HasIndex("RoomId");

                    b.ToTable("ItemPositions");
                });

            modelBuilder.Entity("Gamebook.Server.models.NPC", b =>
                {
                    b.Property<int>("NPCId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ActionId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CurrentRoomId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("Img")
                        .HasColumnType("BLOB");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("RequiredConnectionId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Target")
                        .HasColumnType("INTEGER");

                    b.HasKey("NPCId");

                    b.HasIndex("ActionId");

                    b.HasIndex("CurrentRoomId");

                    b.HasIndex("RequiredConnectionId");

                    b.ToTable("NPCs");
                });

            modelBuilder.Entity("Gamebook.Server.models.Progress", b =>
                {
                    b.Property<int>("ProgressId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ConnectionId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CurrentRoomId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Value")
                        .HasColumnType("INTEGER");

                    b.HasKey("ProgressId");

                    b.HasIndex("ConnectionId");

                    b.HasIndex("CurrentRoomId");

                    b.ToTable("Progress");
                });

            modelBuilder.Entity("Gamebook.Server.models.Room", b =>
                {
                    b.Property<int>("RoomId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("Img")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("RoomId");

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("Gamebook.Server.models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("TEXT");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("TEXT");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Role")
                        .HasColumnType("INTEGER");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("TEXT");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserData")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);

                    b.HasData(
                        new
                        {
                            Id = "12345",
                            AccessFailedCount = 0,
                            ConcurrencyStamp = "a82374d7-4d0e-41a0-9cd7-bf0b25d949cf",
                            Email = "admin@example.com",
                            EmailConfirmed = true,
                            LockoutEnabled = false,
                            NormalizedEmail = "ADMIN@EXAMPLE.COM",
                            NormalizedUserName = "ADMIN@EXAMPLE.COM",
                            PasswordHash = "AQAAAAIAAYagAAAAEGGHe3stk18ZL+tE+Pe7E6TSFesEdg8BU2FoX31eMO5y2fsd8RUp6XTYhtIDMKVWFw==",
                            PhoneNumberConfirmed = false,
                            Role = 1,
                            SecurityStamp = "36b4e1af-0a39-4e85-9fad-b34088791b06",
                            TwoFactorEnabled = false,
                            UserName = "admin@example.com"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);

                    b.HasData(
                        new
                        {
                            Id = "1",
                            Name = "Admin",
                            NormalizedName = "ADMIN"
                        },
                        new
                        {
                            Id = "2",
                            Name = "User",
                            NormalizedName = "USER"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ClaimType")
                        .HasColumnType("TEXT");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("TEXT");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ClaimType")
                        .HasColumnType("TEXT");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("RoleId")
                        .HasColumnType("TEXT");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);

                    b.HasData(
                        new
                        {
                            UserId = "12345",
                            RoleId = "1"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Value")
                        .HasColumnType("TEXT");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("Gamebook.Server.models.Connection", b =>
                {
                    b.HasOne("Gamebook.Server.models.Room", "Room")
                        .WithMany("ConnectionsFrom")
                        .HasForeignKey("FromRoomId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Gamebook.Server.models.Room", "ToRoom")
                        .WithMany("ConnectionsTo")
                        .HasForeignKey("ToRoomId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Room");

                    b.Navigation("ToRoom");
                });

            modelBuilder.Entity("Gamebook.Server.models.Dialog", b =>
                {
                    b.HasOne("Gamebook.Server.models.GameBookAction", "GameBookAction")
                        .WithMany("Dialogs")
                        .HasForeignKey("ActionId");

                    b.HasOne("Gamebook.Server.models.NPC", "NPC")
                        .WithMany("Dialogs")
                        .HasForeignKey("NPCId");

                    b.HasOne("Gamebook.Server.models.Dialog", "ParentDialog")
                        .WithMany("ChildDialogs")
                        .HasForeignKey("ParentDialogId");

                    b.Navigation("GameBookAction");

                    b.Navigation("NPC");

                    b.Navigation("ParentDialog");
                });

            modelBuilder.Entity("Gamebook.Server.models.GameBookAction", b =>
                {
                    b.HasOne("Gamebook.Server.models.ActionType", "ActionType")
                        .WithMany("GameBookActions")
                        .HasForeignKey("ActionTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Gamebook.Server.models.Room", "CurrentRoom")
                        .WithMany("TriggerActions")
                        .HasForeignKey("CurrentRoomId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Gamebook.Server.models.Connection", "RequiredConnection")
                        .WithMany()
                        .HasForeignKey("RequiredConnectionId");

                    b.Navigation("ActionType");

                    b.Navigation("CurrentRoom");

                    b.Navigation("RequiredConnection");
                });

            modelBuilder.Entity("Gamebook.Server.models.Item", b =>
                {
                    b.HasOne("Gamebook.Server.models.GameBookAction", "GameBookAction")
                        .WithMany()
                        .HasForeignKey("GameBookActionId");

                    b.HasOne("Gamebook.Server.models.ItemPosition", "ItemPosition")
                        .WithOne("Item")
                        .HasForeignKey("Gamebook.Server.models.Item", "ItemPositionId");

                    b.HasOne("Gamebook.Server.models.Connection", "RequiredConnection")
                        .WithMany("RequiredItems")
                        .HasForeignKey("RequiredConnectionId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("GameBookAction");

                    b.Navigation("ItemPosition");

                    b.Navigation("RequiredConnection");
                });

            modelBuilder.Entity("Gamebook.Server.models.ItemPosition", b =>
                {
                    b.HasOne("Gamebook.Server.models.Room", "Room")
                        .WithMany("Items")
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Room");
                });

            modelBuilder.Entity("Gamebook.Server.models.NPC", b =>
                {
                    b.HasOne("Gamebook.Server.models.GameBookAction", "Action")
                        .WithMany()
                        .HasForeignKey("ActionId");

                    b.HasOne("Gamebook.Server.models.Room", "CurrentRoom")
                        .WithMany("NPCs")
                        .HasForeignKey("CurrentRoomId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Gamebook.Server.models.Connection", "RequiredConnection")
                        .WithMany("RequiredNPCs")
                        .HasForeignKey("RequiredConnectionId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Action");

                    b.Navigation("CurrentRoom");

                    b.Navigation("RequiredConnection");
                });

            modelBuilder.Entity("Gamebook.Server.models.Progress", b =>
                {
                    b.HasOne("Gamebook.Server.models.Connection", null)
                        .WithMany("RequiredProgress")
                        .HasForeignKey("ConnectionId");

                    b.HasOne("Gamebook.Server.models.Room", "CurrentRoom")
                        .WithMany()
                        .HasForeignKey("CurrentRoomId");

                    b.Navigation("CurrentRoom");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Gamebook.Server.models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Gamebook.Server.models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Gamebook.Server.models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Gamebook.Server.models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Gamebook.Server.models.ActionType", b =>
                {
                    b.Navigation("GameBookActions");
                });

            modelBuilder.Entity("Gamebook.Server.models.Connection", b =>
                {
                    b.Navigation("RequiredItems");

                    b.Navigation("RequiredNPCs");

                    b.Navigation("RequiredProgress");
                });

            modelBuilder.Entity("Gamebook.Server.models.Dialog", b =>
                {
                    b.Navigation("ChildDialogs");
                });

            modelBuilder.Entity("Gamebook.Server.models.GameBookAction", b =>
                {
                    b.Navigation("Dialogs");
                });

            modelBuilder.Entity("Gamebook.Server.models.ItemPosition", b =>
                {
                    b.Navigation("Item")
                        .IsRequired();
                });

            modelBuilder.Entity("Gamebook.Server.models.NPC", b =>
                {
                    b.Navigation("Dialogs");
                });

            modelBuilder.Entity("Gamebook.Server.models.Room", b =>
                {
                    b.Navigation("ConnectionsFrom");

                    b.Navigation("ConnectionsTo");

                    b.Navigation("Items");

                    b.Navigation("NPCs");

                    b.Navigation("TriggerActions");
                });
#pragma warning restore 612, 618
        }
    }
}
