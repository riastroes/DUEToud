using System;
using System.IO.Compression;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Drawing;
using System.Drawing.Imaging;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.ResponseCompression;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using DUET.Models;
using System.IO;
using System.Net.Mime;

namespace DUET
{
    public class Startup
    {

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DUETContext>(options =>
                                               options.UseSqlite(Configuration.GetConnectionString("DUETContext")));

            // Adds a default in-memory implementation of IDistributedCache.
            services.AddDistributedMemoryCache();
            //services.AddResponseCompression(options =>
            //{
            //    options.Providers.Add<GzipCompressionProvider>();
            //    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "image/png" });
            //});

            //services.Configure<GzipCompressionProviderOptions>(options =>
            //{
            //    options.Level = CompressionLevel.Optimal;
            //});

            services.AddSession(options =>
            {
                options.Cookie.Name = ".DUET.Session";
                options.IdleTimeout = TimeSpan.FromSeconds(10);
            });

            services.AddMvc().AddRazorOptions(options =>
            {
                options.PageViewLocationFormats.Add("/Pages/Partials/{0}.cshtml");
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {

            App.ROOT = "wwwroot/"; //env.WebRootPath + "/";
            App.DPI = 300;
            App.MAXDESIGNWIDTH = 6000;
            App.MAXDESIGNHEIGHT = 6000;
            App.PROCESDAYS = 10;

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }
            app.UseStaticFiles();
            app.UseSession();
            //app.UseResponseCompression();
            app.UseMvc();
            //app.MapWhen(context => context.Request.Path.StartsWithSegments("/STAMP") &&
            //                       context.Request.Query.ContainsKey("id"), getSTAMP);
            app.MapWhen(context => context.Request.Path.StartsWithSegments("/DUETBMP") &&
                                   context.Request.Query.ContainsKey("id"), getBMP);
            app.MapWhen(context => context.Request.Path.StartsWithSegments("/DUET") &&
                                    context.Request.Query.ContainsKey("id"), getDUET);
            app.MapWhen(context => context.Request.Path.StartsWithSegments("/DUETPATTERN") &&
                                    context.Request.Query.ContainsKey("id"), getDUETPATTERN);
            app.MapWhen(context => context.Request.Path.StartsWithSegments("/IMG"), getIMG);
                                   

           // app.Run(async context =>
           // {
           //     await context.Response.WriteAsync("NONE");
           // });



        }
        private static void getIMG(IApplicationBuilder app){
            app.Run(async context =>
            {
                    string filename = context.Request.Query["file"];
                    int width = Convert.ToInt32(context.Request.Query["w"]);

                    using( Bitmap bitmap = new Bitmap(filename)){
                        var factor = width / bitmap.Width;
                        Size size = new Size(width, bitmap.Height * factor);
                    using (Bitmap corbitmap = new Bitmap(bitmap, size))
                    {

                        using (MemoryStream ms = new MemoryStream())
                        {
                            corbitmap.Save(ms, ImageFormat.Png);

                            context.Response.StatusCode = 200;
                            context.Response.ContentType = "image/png";
                            context.Response.Headers["Cache-Control"] = "private, max-age=86400"; //
                           //context.Response.Headers["Last-Modified"] = hier moet nog een datum komen.ToUniversalTime().ToString("r");

                            byte[] buffer = new byte[4096];
                            int count;

                            do
                            {
                                count = ms.Read(buffer, 0, buffer.Length);
                                await context.Response.Body.WriteAsync(buffer, 0, count);
                            } while (count >= buffer.Length);
                        }
                    }
                }
                                         
            });
        }
        private static void getBMP(IApplicationBuilder app)
        {

            app.Run(async context =>
            {
                int designid = Convert.ToInt32(context.Request.Query["id"]);
                int width = Convert.ToInt32(context.Request.Query["w"]);
                int height = Convert.ToInt32(context.Request.Query["h"]);

                DUETContext dbcontext = context.RequestServices.GetService<DUETContext>();
                Design adesign = dbcontext.Designs.SingleOrDefault(d => d.Id == designid);
                if (adesign != null)
                {
                    var headers = new RequestHeaders(context.Request.Headers);
                    if (!headers.IfModifiedSince.HasValue || (adesign.Date - headers.IfModifiedSince) >= TimeSpan.FromSeconds(1.0))
                    {
                        using (Bitmap raw = Design.GenerateBitmap(dbcontext, designid, width, height))
                        {
                            using (MemoryStream ms = new MemoryStream())
                            {
                                raw.Save(ms, ImageFormat.Bmp);
                                ms.Seek(0, SeekOrigin.Begin);

                                context.Response.StatusCode = 200;
                                context.Response.ContentType = "image/bmp";
                                context.Response.Headers["Cache-Control"] = "private, max-age=86400"; //
                                context.Response.Headers["Last-Modified"] = adesign.Date.ToUniversalTime().ToString("r");

                                byte[] buffer = new byte[4096];
                                int count;

                                do
                                {
                                    count = ms.Read(buffer, 0, buffer.Length);
                                    await context.Response.Body.WriteAsync(buffer, 0, count);
                                } while (count >= buffer.Length);

                            }
                        }
                    }
                    else
                    {
                        context.Response.StatusCode = 304;
                        //context.Response.StatusDescription = "Not Modified";
                    }
                }


            });
        }
        private static void getDUET(IApplicationBuilder app)
        {

            app.Run(async context =>
            {
                int designid = Convert.ToInt32(context.Request.Query["id"]);
                int width = Convert.ToInt32(context.Request.Query["w"]);
                int height = Convert.ToInt32(context.Request.Query["h"]);

                DUETContext dbcontext = context.RequestServices.GetService<DUETContext>();
                Design adesign = dbcontext.Designs.SingleOrDefault(d => d.Id == designid);
                if (adesign != null)
                {
                    var headers = new RequestHeaders(context.Request.Headers);
                    if (!headers.IfModifiedSince.HasValue || (adesign.Date - headers.IfModifiedSince) >= TimeSpan.FromSeconds(1.0))
                    {
                        using (Bitmap raw = Design.GenerateBitmap(dbcontext, designid, width, height))
                        {
                            using (MemoryStream ms = new MemoryStream())
                            {
                                raw.Save(ms, ImageFormat.Png);
                                ms.Seek(0, SeekOrigin.Begin);

                                context.Response.StatusCode = 200;
                                context.Response.ContentType = "image/png";
                                context.Response.Headers["Cache-Control"] = "private, max-age=86400"; //
                                context.Response.Headers["Last-Modified"] = adesign.Date.ToUniversalTime().ToString("r");

                                byte[] buffer = new byte[4096];
                                int count;

                                do
                                {
                                    count = ms.Read(buffer, 0, buffer.Length);
                                    await context.Response.Body.WriteAsync(buffer, 0, count);
                                } while (count >= buffer.Length);

                            }
                        }
                    }
                    else
                    {
                        context.Response.StatusCode = 304;
                        //context.Response.StatusDescription = "Not Modified";
                    }
                }


            });
        }
       /* private static void getSTAMP(IApplicationBuilder app)
        {

            app.Run(async context =>
            {
                int stampid = Convert.ToInt32(context.Request.Query["id"]);
                
                DUETContext dbcontext = context.RequestServices.GetService<DUETContext>();
                Stamp astamp = dbcontext.Stamps.SingleOrDefault(d => d.Id == stampid);
                if (astamp != null)
                {
                    //var headers = new RequestHeaders(context.Request.Headers);
                    //if (!headers.IfModifiedSince.HasValue || (astamp.Date - headers.IfModifiedSince) >= TimeSpan.FromSeconds(1.0))
                    //{
                        using (Bitmap raw = astamp.GenerateBitmap(dbcontext, astamp.DesignId))
                        {
                            using (MemoryStream ms = new MemoryStream())
                            {
                                raw.Save(ms, ImageFormat.Png);
                                ms.Seek(0, SeekOrigin.Begin);

                                context.Response.StatusCode = 200;
                                context.Response.ContentType = "image/png";
                                context.Response.Headers["Cache-Control"] = "private, max-age=86400"; //
                                //context.Response.Headers["Last-Modified"] = astamp.Date.ToUniversalTime().ToString("r");

                                byte[] buffer = new byte[4096];
                                int count;

                                do
                                {
                                    count = ms.Read(buffer, 0, buffer.Length);
                                    await context.Response.Body.WriteAsync(buffer, 0, count);
                                } while (count >= buffer.Length);

                            }
                        }
                    }
                    else
                    {
                        context.Response.StatusCode = 304;
                        //context.Response.StatusDescription = "Not Modified";
                    }
                //}


            });
        }
        */
        private static void getDUETPATTERN(IApplicationBuilder app)
        {

            app.Run(async context =>
            {
                int designid = Convert.ToInt32(context.Request.Query["id"]);
                int width = Convert.ToInt32(context.Request.Query["w"]);
                int height = Convert.ToInt32(context.Request.Query["h"]);

                DUETContext dbcontext = context.RequestServices.GetService<DUETContext>();
                Design adesign = dbcontext.Designs.SingleOrDefault(d => d.Id == designid);
                if (adesign != null)
                {
                    var headers = new RequestHeaders(context.Request.Headers);
                    if (!headers.IfModifiedSince.HasValue || (adesign.Date - headers.IfModifiedSince) >= TimeSpan.FromSeconds(1.0))
                    {
                        using (Bitmap pattern = Design.GeneratePattern(dbcontext, designid, width, height))
                        {
                            
                            using (MemoryStream ms = new MemoryStream())
                            {
                                pattern.Save(ms, ImageFormat.Png);
                                ms.Seek(0, SeekOrigin.Begin);

                                context.Response.StatusCode = 200;
                                context.Response.ContentType = "image/png";
                                context.Response.Headers["Cache-Control"] = "private, max-age=86400"; //
                                context.Response.Headers["Last-Modified"] = adesign.Date.ToUniversalTime().ToString("r");

                                byte[] buffer = new byte[4096];
                                int count;

                                do
                                {
                                    count = ms.Read(buffer, 0, buffer.Length);
                                    await context.Response.Body.WriteAsync(buffer, 0, count);
                                } while (count >= buffer.Length);

                            }

                        }
                    }
                    else
                    {
                        context.Response.StatusCode = 304;
                        //context.Response.StatusDescription = "Not Modified";
                    }
                }


            });
        }
    }
}


//docu:  https://docs.microsoft.com/en-us/aspnet/core/tutorials/razor-pages/page?view=aspnetcore-2.0 
//dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
//dotnet restore
//dotnet ef migrations add InitialCreate
//dotnet ef database update

