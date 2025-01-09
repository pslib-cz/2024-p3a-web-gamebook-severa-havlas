using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class _04 : Migration
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

            migrationBuilder.DropForeignKey(
                name: "FK_Options_Actions_GameBookActionActionId",
                table: "Options");

            migrationBuilder.DropIndex(
                name: "IX_Options_GameBookActionActionId",
                table: "Options");

            migrationBuilder.DropColumn(
                name: "GameBookActionActionId",
                table: "Options");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Actions_ActionTypes_ActionTypeId",
                table: "Actions");

            migrationBuilder.DropForeignKey(
                name: "FK_Options_Actions_ActionId",
                table: "Options");

            migrationBuilder.AddColumn<int>(
                name: "GameBookActionActionId",
                table: "Options",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Options_GameBookActionActionId",
                table: "Options",
                column: "GameBookActionActionId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Options_Actions_GameBookActionActionId",
                table: "Options",
                column: "GameBookActionActionId",
                principalTable: "Actions",
                principalColumn: "ActionId");
        }
    }
}
