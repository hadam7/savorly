using Savorly.API.Models;

namespace Savorly.API.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        var categories = new Category[]
        {
            new Category { Name = "Reggeli", Slug = "reggeli" },
            new Category { Name = "Ebéd", Slug = "ebed" },
            new Category { Name = "Vacsora", Slug = "vacsora" },
            new Category { Name = "Desszert", Slug = "desszert" },
            new Category { Name = "Leves", Slug = "leves" },
            new Category { Name = "Főétel", Slug = "foetel" },
            new Category { Name = "Egytálétel", Slug = "egytaletel" },
            new Category { Name = "Könnyű", Slug = "konnyu" },
            new Category { Name = "Vegetáriánus", Slug = "vegetarianus" },
            new Category { Name = "Indiai", Slug = "indiai" },
            new Category { Name = "Olasz", Slug = "olasz" },
            new Category { Name = "Előétel", Slug = "eloetel" },
            new Category { Name = "Tészta", Slug = "teszta" }
        };

        foreach (var c in categories)
        {
            if (!context.Categories.Any(x => x.Name == c.Name))
            {
                context.Categories.Add(c);
            }
        }

        context.SaveChanges();

        // Users
        if (!context.Users.Any())
        {
            var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();

            var admin = new User
            {
                UserName = "admin",
                Email = "admin@savorly.com",
                Role = "Admin",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
            admin.PasswordHash = hasher.HashPassword(admin, "admin123");

            var user = new User
            {
                UserName = "user",
                Email = "user@savorly.com",
                Role = "User",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
            user.PasswordHash = hasher.HashPassword(user, "user123");

            context.Users.AddRange(admin, user);
            context.SaveChanges();
        }

        // Recipes
        if (!context.Recipes.Any())
        {
            var user = context.Users.FirstOrDefault(u => u.UserName == "user");
            if (user != null)
            {
                var recipes = new List<Recipe>();

                // Helper to get category IDs
                List<RecipeCategory> GetCats(string[] slugs)
                {
                    var cats = context.Categories.Where(c => slugs.Contains(c.Name)).ToList();
                    return cats.Select(c => new RecipeCategory { CategoryId = c.Id }).ToList();
                }

                recipes.Add(new Recipe
                {
                    Title = "Krémes fokhagymás csirke",
                    Description = "Selymes fokhagymás mártásban párolt csirke, gyors vacsorához.",
                    PrepTimeMinutes = 25,
                    Servings = 4,
                    IsVegan = false,
                    ImageUrl = "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "500g csirkemell filé", "3 gerezd fokhagyma", "2 dl főzőtejszín", "1 ek vaj", "Só, bors, petrezselyem" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A csirkemellet kockákra vágjuk, sózzuk, borsozzuk.", "Egy serpenyőben felhevítjük a vajat, és aranybarnára pirítjuk a húst.", "Hozzáadjuk a zúzott fokhagymát, majd felöntjük a tejszínnel.", "Pár percig forraljuk, amíg a szósz besűrűsödik.", "Friss petrezselyemmel megszórva tálaljuk." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Tej" }),
                    UserId = user.Id,
                    Likes = 120,
                    Difficulty = "Közepes",
                    RecipeCategories = GetCats(new[] { "Egytálétel" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Mediterrán tésztasaláta",
                    Description = "Olivabogyó, paradicsom és feta – friss, üde ízek.",
                    PrepTimeMinutes = 20,
                    Servings = 2,
                    IsVegan = false,
                    ImageUrl = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "200g penne tészta", "100g koktélparadicsom", "50g fekete olívabogyó", "100g feta sajt", "Olívaolaj, oregánó" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A tésztát sós vízben kifőzzük, majd leszűrjük és hagyjuk kihűlni.", "A paradicsomokat félbevágjuk, az olívabogyót felkarikázzuk.", "A feta sajtot felkockázzuk.", "Egy tálban összekeverjük a tésztát a zöldségekkel és a sajttal.", "Meglocsoljuk olívaolajjal, megszórjuk oregánóval, és hűtve tálaljuk." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Glutén", "Tej" }),
                    UserId = user.Id,
                    Likes = 85,
                    Difficulty = "Könnyű",
                    RecipeCategories = GetCats(new[] { "Könnyű", "Vegetáriánus", "Olasz" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Csokis brownie",
                    Description = "Kívül roppanós, belül krémes csoda.",
                    PrepTimeMinutes = 35,
                    Servings = 6,
                    IsVegan = false,
                    ImageUrl = "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "200g étcsokoládé", "150g vaj", "200g cukor", "3 tojás", "100g liszt" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A csokoládét és a vajat vízgőz felett megolvasztjuk.", "A tojásokat a cukorral habosra keverjük.", "Hozzáadjuk a vajas csokoládét, majd óvatosan belekeverjük a lisztet.", "Sütőpapírral bélelt tepsibe öntjük.", "180 fokon kb. 20-25 percig sütjük." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Tojás", "Glutén", "Tej" }),
                    UserId = user.Id,
                    Likes = 200,
                    Difficulty = "Közepes",
                    RecipeCategories = GetCats(new[] { "Desszert" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Zöldborsókrémleves",
                    Description = "Selymes, mentás zöldborsó, pirított magokkal.",
                    PrepTimeMinutes = 18,
                    Servings = 4,
                    IsVegan = false,
                    ImageUrl = "https://images.unsplash.com/photo-1547592166-23acbe3a624b?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "400g zöldborsó (mirelit is jó)", "1 fej vöröshagyma", "1 gerezd fokhagyma", "1 dl tejszín", "Friss menta" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A hagymát apróra vágjuk és kevés olajon megdinszteljük.", "Hozzáadjuk a borsót, felöntjük annyi vízzel, amennyi ellepi, és puhára főzzük.", "Botmixerrel pürésítjük, majd hozzáadjuk a tejszínt.", "Sózzuk, borsozzuk, és friss mentával ízesítjük.", "Pirított magvakkal tálaljuk." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Tej" }),
                    UserId = user.Id,
                    Likes = 65,
                    Difficulty = "Közepes",
                    RecipeCategories = GetCats(new[] { "Leves", "Vegetáriánus" })
                });
                
                recipes.Add(new Recipe
                {
                    Title = "Sütőtökös gnocchi zsályával",
                    Description = "Vajas-zsályás öntet, őszi ízekkel.",
                    PrepTimeMinutes = 30,
                    Servings = 2,
                    IsVegan = false,
                    ImageUrl = "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "500g gnocchi", "200g sütőtök püré", "50g vaj", "Friss zsálya", "Parmezán sajt" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A gnocchit sós vízben kifőzzük.", "Egy serpenyőben felolvasztjuk a vajat, és megpirítjuk benne a zsályaleveleket.", "Hozzáadjuk a sütőtök pürét, és összemelegítjük.", "Belekeverjük a kifőtt gnocchit.", "Reszelt parmezánnal megszórva tálaljuk." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Glutén", "Tej" }),
                    UserId = user.Id,
                    Likes = 95,
                    Difficulty = "Közepes",
                    RecipeCategories = GetCats(new[] { "Vegetáriánus", "Tészta", "Olasz" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Csirke tikka masala",
                    Description = "Illatos, paradicsomos szószban párolt csirke.",
                    PrepTimeMinutes = 40,
                    Servings = 4,
                    IsVegan = false,
                    ImageUrl = "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "500g csirkemell", "1 konzerv darabolt paradicsom", "1 dl joghurt", "Garam masala fűszerkeverék", "Rizs a tálaláshoz" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A csirkét felkockázzuk, és bepácoljuk a joghurtba és a fűszerekbe.", "Egy serpenyőben megpirítjuk a húst.", "Hozzáadjuk a paradicsomkonzervet, és puhára főzzük.", "Ha szükséges, kevés vízzel hígítjuk.", "Főtt rizzsel tálaljuk." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Tej" }),
                    UserId = user.Id,
                    Likes = 150,
                    Difficulty = "Közepes",
                    RecipeCategories = GetCats(new[] { "Indiai", "Egytálétel" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Avokádós toast buggyantott tojással",
                    Description = "Gyors, tápláló indítás a naphoz.",
                    PrepTimeMinutes = 10,
                    Servings = 1,
                    IsVegan = false,
                    ImageUrl = "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "2 szelet teljes kiőrlésű kenyér", "1 érett avokádó", "2 tojás", "Chili pehely", "Citromlé" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A kenyeret megpirítjuk.", "Az avokádót villával összetörjük, sózzuk, borsozzuk, citromlével ízesítjük.", "A tojásokat buggyantjuk (forró, ecetes vízben 3 percig főzzük).", "A pirítósra kenjük az avokádót, ráhelyezzük a tojást.", "Chili pehellyel megszórva tálaljuk." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Glutén", "Tojás" }),
                    UserId = user.Id,
                    Likes = 110,
                    Difficulty = "Könnyű",
                    RecipeCategories = GetCats(new[] { "Reggeli" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Ropogós sült karfiol tahinivel",
                    Description = "Füstös, citromos tahiniöntettel.",
                    PrepTimeMinutes = 35,
                    Servings = 2,
                    IsVegan = true,
                    ImageUrl = "https://images.unsplash.com/photo-1568271991133-4b699820943f?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "1 fej karfiol", "2 ek olívaolaj", "1 tk római kömény", "2 ek tahini", "Citromlé" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A karfiolt rózsáira szedjük, összeforgatjuk az olajjal és a fűszerekkel.", "Sütőpapírral bélelt tepsiben 200 fokon 25 percig sütjük.", "A tahinit kikeverjük kevés vízzel és citromlével.", "A sült karfiolt a tahini szósszal meglocsolva tálaljuk." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Szezámmag" }),
                    UserId = user.Id,
                    Likes = 78,
                    Difficulty = "Könnyű",
                    RecipeCategories = GetCats(new[] { "Vegetáriánus", "Könnyű" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Citromos-mákos süti",
                    Description = "Frissítő, illatos tepsissüti.",
                    PrepTimeMinutes = 45,
                    Servings = 8,
                    IsVegan = false,
                    ImageUrl = "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "200g liszt", "150g cukor", "100g darált mák", "2 citrom reszelt héja és leve", "3 tojás" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A tojásokat a cukorral habosra keverjük.", "Hozzáadjuk a citromlevet és a héjat.", "Belekeverjük a lisztet és a mákot.", "Kivajazott tepsibe öntjük.", "180 fokon 30 percig sütjük." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Glutén", "Tojás" }),
                    UserId = user.Id,
                    Likes = 130,
                    Difficulty = "Közepes",
                    RecipeCategories = GetCats(new[] { "Desszert" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Gyors wok zöldségekkel",
                    Description = "Ropogós zöldségek, szójaszószos glaze.",
                    PrepTimeMinutes = 15,
                    Servings = 2,
                    IsVegan = true,
                    ImageUrl = "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "Vegyes zöldségek (répa, brokkoli, paprika)", "2 ek szójaszósz", "1 ek szezámolaj", "Gyömbér, fokhagyma", "Szezámmag" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A zöldségeket csíkokra vágjuk.", "Wokban felhevítjük az olajat, és hirtelen kisütjük a zöldségeket.", "Hozzáadjuk a reszelt gyömbért és fokhagymát.", "Meglocsoljuk szójaszósszal.", "Szezámmaggal megszórva tálaljuk." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Szója", "Szezámmag" }),
                    UserId = user.Id,
                    Likes = 92,
                    Difficulty = "Könnyű",
                    RecipeCategories = GetCats(new[] { "Könnyű", "Vegetáriánus" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Paradicsomos bruschetta",
                    Description = "Fokhagymás pirítóson, balzsamecettel.",
                    PrepTimeMinutes = 12,
                    Servings = 4,
                    IsVegan = true,
                    ImageUrl = "https://images.unsplash.com/photo-1572695157363-bc31c5dd3386?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "4 szelet ciabatta", "3 paradicsom", "1 gerezd fokhagyma", "Friss bazsalikom", "Olívaolaj" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A kenyeret megpirítjuk, és bedörzsöljük fokhagymával.", "A paradicsomot apróra vágjuk, összekeverjük az olajjal és a bazsalikommal.", "A keveréket a pirítósra halmozzuk.", "Azonnal tálaljuk." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Glutén" }),
                    UserId = user.Id,
                    Likes = 105,
                    Difficulty = "Könnyű",
                    RecipeCategories = GetCats(new[] { "Előétel", "Vegetáriánus", "Olasz" })
                });

                recipes.Add(new Recipe
                {
                    Title = "Klasszikus karbonára",
                    Description = "Tojás, pecorino, guanciale – krémes és gyors.",
                    PrepTimeMinutes = 22,
                    Servings = 2,
                    IsVegan = false,
                    ImageUrl = "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
                    Ingredients = System.Text.Json.JsonSerializer.Serialize(new[] { "200g spagetti", "100g guanciale vagy bacon", "3 tojássárgája", "50g pecorino sajt", "Fekete bors" }),
                    InstructionsJson = System.Text.Json.JsonSerializer.Serialize(new[] { "A tésztát sós vízben kifőzzük.", "A szalonnát ropogósra sütjük.", "A tojássárgáját elkeverjük a reszelt sajttal és sok borssal.", "A kifőtt tésztát a szalonnához adjuk, majd levesszük a tűzről.", "Belekeverjük a tojásos masszát (a tészta hője főzi meg a tojást)." }),
                    Allergens = System.Text.Json.JsonSerializer.Serialize(new[] { "Glutén", "Tojás", "Tej" }),
                    UserId = user.Id,
                    Likes = 156,
                    Difficulty = "Közepes",
                    RecipeCategories = GetCats(new[] { "Tészta", "Olasz" })
                });

                context.Recipes.AddRange(recipes);
                context.SaveChanges();
            }
        }
    }
}
