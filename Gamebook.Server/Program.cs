using Gamebook.Server.Data;
using Microsoft.EntityFrameworkCore;
using Gamebook.Server.Controllers;
using Gamebook.Server.models;
using Microsoft.AspNetCore.Identity;

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

builder.Services.AddDbContext<GamebookDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("GamebookDb")));

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<GamebookDbContext>()
    .AddDefaultTokenProviders();


builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 2;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
});

// Add authentication & authorization middleware
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.UseAuthentication(); // Add authentication middleware
app.UseAuthorization();

app.MapControllers();



app.MapFallbackToFile("/index.html");





app.Run();
