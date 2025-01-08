using Gamebook.Server.Data;
using Microsoft.EntityFrameworkCore;
using Gamebook.Server.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin() // Nahra�te port spr�vn�m portem React aplikace
               .AllowAnyMethod() // Povolen� v�ech HTTP metod (GET, POST, DELETE, atd.)
               .AllowAnyHeader(); // Povolen� v�ech hlavi�ek
    });
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<GamebookDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("GamebookDb")));
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseRouting();

app.UseCors(); // Move UseCors here, after UseRouting

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();



app.MapFallbackToFile("/index.html");





app.Run();
