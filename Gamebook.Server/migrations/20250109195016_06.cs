using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class _06 : Migration
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
                    ReqAction = table.Column<int>(type: "INTEGER", nullable: true)
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
                name: "GameBookActionRoom",
                columns: table => new
                {
                    RequiredActionsActionId = table.Column<int>(type: "INTEGER", nullable: false),
                    RoomId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameBookActionRoom", x => new { x.RequiredActionsActionId, x.RoomId });
                    table.ForeignKey(
                        name: "FK_GameBookActionRoom_Actions_RequiredActionsActionId",
                        column: x => x.RequiredActionsActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameBookActionRoom_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    ItemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    GameBookActionId = table.Column<int>(type: "INTEGER", nullable: false),
                    Target = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.ItemId);
                    table.ForeignKey(
                        name: "FK_Items_Actions_GameBookActionId",
                        column: x => x.GameBookActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NPCs",
                columns: table => new
                {
                    NPCId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    ActionId = table.Column<int>(type: "INTEGER", nullable: false),
                    Target = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NPCs", x => x.NPCId);
                    table.ForeignKey(
                        name: "FK_NPCs_Actions_ActionId",
                        column: x => x.ActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Options",
                columns: table => new
                {
                    OptionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    Text = table.Column<string>(type: "TEXT", nullable: false),
                    NextActionId = table.Column<int>(type: "INTEGER", nullable: false),
                    GameBookActionActionId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Options", x => x.OptionId);
                    table.ForeignKey(
                        name: "FK_Options_Actions_GameBookActionActionId",
                        column: x => x.GameBookActionActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId");
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
                name: "ItemRoom",
                columns: table => new
                {
                    ItemsItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    RoomId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemRoom", x => new { x.ItemsItemId, x.RoomId });
                    table.ForeignKey(
                        name: "FK_ItemRoom_Items_ItemsItemId",
                        column: x => x.ItemsItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemRoom_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemRoom1",
                columns: table => new
                {
                    RequiredItemsItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    Room1RoomId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemRoom1", x => new { x.RequiredItemsItemId, x.Room1RoomId });
                    table.ForeignKey(
                        name: "FK_ItemRoom1_Items_RequiredItemsItemId",
                        column: x => x.RequiredItemsItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemRoom1_Rooms_Room1RoomId",
                        column: x => x.Room1RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NPCRoom",
                columns: table => new
                {
                    NPCsNPCId = table.Column<int>(type: "INTEGER", nullable: false),
                    RoomId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NPCRoom", x => new { x.NPCsNPCId, x.RoomId });
                    table.ForeignKey(
                        name: "FK_NPCRoom_NPCs_NPCsNPCId",
                        column: x => x.NPCsNPCId,
                        principalTable: "NPCs",
                        principalColumn: "NPCId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NPCRoom_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NPCRoom1",
                columns: table => new
                {
                    RequiredNPCsNPCId = table.Column<int>(type: "INTEGER", nullable: false),
                    Room1RoomId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NPCRoom1", x => new { x.RequiredNPCsNPCId, x.Room1RoomId });
                    table.ForeignKey(
                        name: "FK_NPCRoom1_NPCs_RequiredNPCsNPCId",
                        column: x => x.RequiredNPCsNPCId,
                        principalTable: "NPCs",
                        principalColumn: "NPCId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NPCRoom1_Rooms_Room1RoomId",
                        column: x => x.Room1RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Actions_ActionTypeId",
                table: "Actions",
                column: "ActionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_FromRoomId",
                table: "Connections",
                column: "FromRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_ToRoomId",
                table: "Connections",
                column: "ToRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_GameBookActionRoom_RoomId",
                table: "GameBookActionRoom",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemPositions_ItemId",
                table: "ItemPositions",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemPositions_RoomId",
                table: "ItemPositions",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemRoom_RoomId",
                table: "ItemRoom",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemRoom1_Room1RoomId",
                table: "ItemRoom1",
                column: "Room1RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_GameBookActionId",
                table: "Items",
                column: "GameBookActionId");

            migrationBuilder.CreateIndex(
                name: "IX_NPCRoom_RoomId",
                table: "NPCRoom",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_NPCRoom1_Room1RoomId",
                table: "NPCRoom1",
                column: "Room1RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_NPCs_ActionId",
                table: "NPCs",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_Options_GameBookActionActionId",
                table: "Options",
                column: "GameBookActionActionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "GameBookActionRoom");

            migrationBuilder.DropTable(
                name: "ItemPositions");

            migrationBuilder.DropTable(
                name: "ItemRoom");

            migrationBuilder.DropTable(
                name: "ItemRoom1");

            migrationBuilder.DropTable(
                name: "NPCRoom");

            migrationBuilder.DropTable(
                name: "NPCRoom1");

            migrationBuilder.DropTable(
                name: "Options");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "NPCs");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Actions");

            migrationBuilder.DropTable(
                name: "ActionTypes");
        }
    }
}
