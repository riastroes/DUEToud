using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace DUET.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Inspirations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DPIH = table.Column<float>(type: "REAL", nullable: false),
                    DPIV = table.Column<float>(type: "REAL", nullable: false),
                    Height = table.Column<int>(type: "INTEGER", nullable: false),
                    Src = table.Column<string>(type: "TEXT", nullable: true),
                    Title = table.Column<string>(type: "TEXT", nullable: true),
                    Width = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inspirations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Members",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Address = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: true),
                    Country = table.Column<string>(type: "TEXT", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 60, nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Visits = table.Column<int>(type: "INTEGER", nullable: false),
                    Zipcode = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Members", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Designs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Blue = table.Column<int>(type: "INTEGER", nullable: false),
                    DPI = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Green = table.Column<int>(type: "INTEGER", nullable: false),
                    Height = table.Column<int>(type: "INTEGER", nullable: false),
                    Likes = table.Column<int>(type: "INTEGER", nullable: false),
                    MemberId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Red = table.Column<int>(type: "INTEGER", nullable: false),
                    Saved = table.Column<bool>(type: "INTEGER", nullable: false),
                    Shared = table.Column<bool>(type: "INTEGER", nullable: false),
                    ViewHeight = table.Column<int>(type: "INTEGER", nullable: false),
                    ViewWidth = table.Column<int>(type: "INTEGER", nullable: false),
                    Width = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Designs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Designs_Members_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BTW = table.Column<decimal>(type: "TEXT", nullable: false),
                    Confirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeliveryCost = table.Column<decimal>(type: "TEXT", nullable: false),
                    DeliveryType = table.Column<string>(type: "TEXT", nullable: true),
                    DesignId = table.Column<int>(type: "INTEGER", nullable: false),
                    Fabric = table.Column<bool>(type: "INTEGER", nullable: false),
                    MemberId = table.Column<int>(type: "INTEGER", nullable: false),
                    Meters = table.Column<decimal>(type: "TEXT", nullable: false),
                    OrderCost = table.Column<decimal>(type: "TEXT", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PayDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Payed = table.Column<bool>(type: "INTEGER", nullable: false),
                    Photo = table.Column<bool>(type: "INTEGER", nullable: false),
                    Photosize = table.Column<string>(type: "TEXT", nullable: true),
                    Processed = table.Column<bool>(type: "INTEGER", nullable: false),
                    ProcessedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Ready = table.Column<bool>(type: "INTEGER", nullable: false),
                    ReadyDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Sample = table.Column<bool>(type: "INTEGER", nullable: false),
                    Shipped = table.Column<bool>(type: "INTEGER", nullable: false),
                    ShippedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Total = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Designs_DesignId",
                        column: x => x.DesignId,
                        principalTable: "Designs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_Members_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stamps",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Blue = table.Column<int>(type: "INTEGER", nullable: false),
                    DesignId = table.Column<int>(type: "INTEGER", nullable: false),
                    Green = table.Column<int>(type: "INTEGER", nullable: false),
                    Height = table.Column<int>(type: "INTEGER", nullable: false),
                    InspirationHeight = table.Column<int>(type: "INTEGER", nullable: false),
                    InspirationId = table.Column<int>(type: "INTEGER", nullable: false),
                    InspirationWidth = table.Column<int>(type: "INTEGER", nullable: false),
                    Red = table.Column<int>(type: "INTEGER", nullable: false),
                    Rotate = table.Column<float>(type: "REAL", nullable: false),
                    Scale = table.Column<float>(type: "REAL", nullable: false),
                    Shape = table.Column<string>(type: "TEXT", nullable: true),
                    Type = table.Column<string>(type: "TEXT", nullable: true),
                    Width = table.Column<int>(type: "INTEGER", nullable: false),
                    X = table.Column<int>(type: "INTEGER", nullable: false),
                    Y = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stamps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stamps_Designs_DesignId",
                        column: x => x.DesignId,
                        principalTable: "Designs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Processes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DesignId = table.Column<int>(type: "INTEGER", nullable: false),
                    Index = table.Column<int>(type: "INTEGER", nullable: false),
                    StampId = table.Column<int>(type: "INTEGER", nullable: false),
                    X = table.Column<int>(type: "INTEGER", nullable: false),
                    Y = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Processes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Processes_Designs_DesignId",
                        column: x => x.DesignId,
                        principalTable: "Designs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Processes_Stamps_StampId",
                        column: x => x.StampId,
                        principalTable: "Stamps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Designs_MemberId",
                table: "Designs",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DesignId",
                table: "Orders",
                column: "DesignId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_MemberId",
                table: "Orders",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Processes_DesignId",
                table: "Processes",
                column: "DesignId");

            migrationBuilder.CreateIndex(
                name: "IX_Processes_StampId",
                table: "Processes",
                column: "StampId");

            migrationBuilder.CreateIndex(
                name: "IX_Stamps_DesignId",
                table: "Stamps",
                column: "DesignId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Inspirations");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Processes");

            migrationBuilder.DropTable(
                name: "Stamps");

            migrationBuilder.DropTable(
                name: "Designs");

            migrationBuilder.DropTable(
                name: "Members");
        }
    }
}
