using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class _03 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ActionId",
                table: "Options",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Options_ActionId",
                table: "Options",
                column: "ActionId");

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
                name: "FK_Options_Actions_ActionId",
                table: "Options");

            migrationBuilder.DropIndex(
                name: "IX_Options_ActionId",
                table: "Options");

            migrationBuilder.DropColumn(
                name: "ActionId",
                table: "Options");
        }
    }
}
