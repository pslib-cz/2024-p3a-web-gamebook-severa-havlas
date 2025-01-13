using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class _16 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ActionTypes",
                columns: table => new
                {
                    ActionTypeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActionTypes", x => x.ActionTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    RoomId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Img = table.Column<byte[]>(type: "BLOB", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Text = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.RoomId);
                });

            migrationBuilder.CreateTable(
                name: "Actions",
                columns: table => new
                {
                    ActionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ActionTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    ReqItem = table.Column<int>(type: "INTEGER", nullable: true),
                    ReqProgress = table.Column<int>(type: "INTEGER", nullable: true),
                    ReqNPC = table.Column<int>(type: "INTEGER", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    ReqAction = table.Column<int>(type: "INTEGER", nullable: true),
                    MiniGameData = table.Column<string>(type: "TEXT", nullable: false),
                    RequiredRoomId = table.Column<int>(type: "INTEGER", nullable: true),
                    CurrentRoomId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actions", x => x.ActionId);
                    table.ForeignKey(
                        name: "FK_Actions_ActionTypes_ActionTypeId",
                        column: x => x.ActionTypeId,
                        principalTable: "ActionTypes",
                        principalColumn: "ActionTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Actions_Rooms_CurrentRoomId",
                        column: x => x.CurrentRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Actions_Rooms_RequiredRoomId",
                        column: x => x.RequiredRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Connections",
                columns: table => new
                {
                    ConnectionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FromRoomId = table.Column<int>(type: "INTEGER", nullable: false),
                    ToRoomId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connections", x => x.ConnectionId);
                    table.ForeignKey(
                        name: "FK_Connections_Rooms_FromRoomId",
                        column: x => x.FromRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Connections_Rooms_ToRoomId",
                        column: x => x.ToRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    ItemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    GameBookActionId = table.Column<int>(type: "INTEGER", nullable: true),
                    CurrentRoomId = table.Column<int>(type: "INTEGER", nullable: true),
                    Img = table.Column<byte[]>(type: "BLOB", nullable: true),
                    RequiredRoomId = table.Column<int>(type: "INTEGER", nullable: true),
                    Target = table.Column<int>(type: "INTEGER", nullable: true),
                    Price = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.ItemId);
                    table.ForeignKey(
                        name: "FK_Items_Actions_GameBookActionId",
                        column: x => x.GameBookActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId");
                    table.ForeignKey(
                        name: "FK_Items_Rooms_CurrentRoomId",
                        column: x => x.CurrentRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Items_Rooms_RequiredRoomId",
                        column: x => x.RequiredRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NPCs",
                columns: table => new
                {
                    NPCId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    ActionId = table.Column<int>(type: "INTEGER", nullable: true),
                    CurrentRoomId = table.Column<int>(type: "INTEGER", nullable: true),
                    RequiredRoomId = table.Column<int>(type: "INTEGER", nullable: true),
                    Img = table.Column<byte[]>(type: "BLOB", nullable: true),
                    Target = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NPCs", x => x.NPCId);
                    table.ForeignKey(
                        name: "FK_NPCs_Actions_ActionId",
                        column: x => x.ActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId");
                    table.ForeignKey(
                        name: "FK_NPCs_Rooms_CurrentRoomId",
                        column: x => x.CurrentRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NPCs_Rooms_RequiredRoomId",
                        column: x => x.RequiredRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ItemPositions",
                columns: table => new
                {
                    ItemPositionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoomId = table.Column<int>(type: "INTEGER", nullable: false),
                    ItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    X = table.Column<int>(type: "INTEGER", nullable: false),
                    Y = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemPositions", x => x.ItemPositionId);
                    table.ForeignKey(
                        name: "FK_ItemPositions_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemPositions_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Dialogs",
                columns: table => new
                {
                    DialogId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NPCId = table.Column<int>(type: "INTEGER", nullable: true),
                    ActionId = table.Column<int>(type: "INTEGER", nullable: true),
                    ParentDialogId = table.Column<int>(type: "INTEGER", nullable: true),
                    Text = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dialogs", x => x.DialogId);
                    table.ForeignKey(
                        name: "FK_Dialogs_Actions_ActionId",
                        column: x => x.ActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId");
                    table.ForeignKey(
                        name: "FK_Dialogs_Dialogs_ParentDialogId",
                        column: x => x.ParentDialogId,
                        principalTable: "Dialogs",
                        principalColumn: "DialogId");
                    table.ForeignKey(
                        name: "FK_Dialogs_NPCs_NPCId",
                        column: x => x.NPCId,
                        principalTable: "NPCs",
                        principalColumn: "NPCId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Actions_ActionTypeId",
                table: "Actions",
                column: "ActionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Actions_CurrentRoomId",
                table: "Actions",
                column: "CurrentRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Actions_RequiredRoomId",
                table: "Actions",
                column: "RequiredRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_FromRoomId",
                table: "Connections",
                column: "FromRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_ToRoomId",
                table: "Connections",
                column: "ToRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Dialogs_ActionId",
                table: "Dialogs",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_Dialogs_NPCId",
                table: "Dialogs",
                column: "NPCId");

            migrationBuilder.CreateIndex(
                name: "IX_Dialogs_ParentDialogId",
                table: "Dialogs",
                column: "ParentDialogId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemPositions_ItemId",
                table: "ItemPositions",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemPositions_RoomId",
                table: "ItemPositions",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_CurrentRoomId",
                table: "Items",
                column: "CurrentRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_GameBookActionId",
                table: "Items",
                column: "GameBookActionId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_RequiredRoomId",
                table: "Items",
                column: "RequiredRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_NPCs_ActionId",
                table: "NPCs",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_NPCs_CurrentRoomId",
                table: "NPCs",
                column: "CurrentRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_NPCs_RequiredRoomId",
                table: "NPCs",
                column: "RequiredRoomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "Dialogs");

            migrationBuilder.DropTable(
                name: "ItemPositions");

            migrationBuilder.DropTable(
                name: "NPCs");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "Actions");

            migrationBuilder.DropTable(
                name: "ActionTypes");

            migrationBuilder.DropTable(
                name: "Rooms");
        }
    }
}
