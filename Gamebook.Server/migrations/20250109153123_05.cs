using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class _05 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Actions_ActionTypes_ActionTypeId",
                table: "Actions");

            migrationBuilder.DropForeignKey(
                name: "FK_Options_Actions_ActionId",
                table: "Options");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Options",
                table: "Options");

            migrationBuilder.AddColumn<int>(
                name: "OptionId",
                table: "Options",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Options",
                table: "Options",
                column: "OptionId");

            migrationBuilder.CreateTable(
                name: "GameBookActionOption",
                columns: table => new
                {
                    GameBookActionActionId = table.Column<int>(type: "INTEGER", nullable: false),
                    OptionsOptionId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameBookActionOption", x => new { x.GameBookActionActionId, x.OptionsOptionId });
                    table.ForeignKey(
                        name: "FK_GameBookActionOption_Actions_GameBookActionActionId",
                        column: x => x.GameBookActionActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameBookActionOption_Options_OptionsOptionId",
                        column: x => x.OptionsOptionId,
                        principalTable: "Options",
                        principalColumn: "OptionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameBookActionOption_OptionsOptionId",
                table: "GameBookActionOption",
                column: "OptionsOptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Actions_ActionTypes_ActionTypeId",
                table: "Actions",
                column: "ActionTypeId",
                principalTable: "ActionTypes",
                principalColumn: "ActionTypeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Options_Actions_ActionId",
                table: "Options",
                column: "ActionId",
                principalTable: "Actions",
                principalColumn: "ActionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Actions_ActionTypes_ActionTypeId",
                table: "Actions");

            migrationBuilder.DropForeignKey(
                name: "FK_Options_Actions_ActionId",
                table: "Options");

            migrationBuilder.DropTable(
                name: "GameBookActionOption");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Options",
                table: "Options");

            migrationBuilder.DropColumn(
                name: "OptionId",
                table: "Options");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Options",
                table: "Options",
                columns: new[] { "Label", "Text" });

            migrationBuilder.AddForeignKey(
                name: "FK_Actions_ActionTypes_ActionTypeId",
                table: "Actions",
                column: "ActionTypeId",
                principalTable: "ActionTypes",
                principalColumn: "ActionTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Options_Actions_ActionId",
                table: "Options",
                column: "ActionId",
                principalTable: "Actions",
                principalColumn: "ActionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
