# Savorly - Receptkezelő Rendszer

A projekt egy modern receptkezelő és megosztó alkalmazás ASP.NET Core alapú REST API-val és Vite + React frontenddel. A megoldás célja, hogy a felhasználók recepteket böngészhessenek, tölthessenek fel, és rendszerezhessék kedvenc ételeiket.

## Fő technológiák

*   **Backend**: .NET 9, ASP.NET Core Web API, Entity Framework Core + SQLite, JWT alapú autentikáció
*   **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, GSAP, React Router
*   **Egyéb**: Swagger UI, ESLint

## Könyvtárstruktúra

| Mappa | Tartalom |
| :--- | :--- |
| `Savorly.API/` | ASP.NET Core Web API projekt, EF Core migrációk és seed adatok |
| `frontend/` | React + Vite kliensalkalmazás forráskódja |
| `start-dev.bat` | Windows segédszkript a backend és frontend párhuzamos indításához |

## Előkövetelmények

*   .NET SDK 9.0+
*   Node.js 20+ és npm
*   SQLite (beágyazott fájl adatbázis, alapból `site.db` néven jön létre)

## Fejlesztői futtatás

### 1. Backend (ASP.NET Core API)

```bash
cd Savorly.API
dotnet restore
dotnet run
```

*   Alapértelmezett URL: `http://localhost:5044`
*   Az indításkor a `DbInitializer.cs` automatikusan seedeli az admin és teszt felhasználót, valamint a kategóriákat és minta recepteket.
*   **Swagger UI**: `http://localhost:5044/swagger`

### 2. Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

*   URL: `http://localhost:5173`
*   A frontend a `http://localhost:5173`-ról kommunikál az API-val, ezért a CORS engedélyezve van erre az originre.

### 3. Gyors indítás Windows alatt

```bash
start-dev.bat
```

Ez két parancssort nyit: az egyikben `dotnet run` indul az API számára, a másikban `npm run dev` a React klienshez.

## Build és éles üzem

*   **Frontend build**: `cd frontend && npm run build` → a Vite `dist/` könyvtárában statikus állományokat hoz létre.
*   **Backend publikálás**: `cd Savorly.API && dotnet publish -c Release -o out` → az `out/` mappában található a futtatható API.

Az éles környezetben frissítsd az `appsettings.json` értékeit (adatbázis, Jwt kulcsok) és állíts be HTTPS-t vagy reverse proxy-t.

## Konfiguráció

*   **Adatbázis**: `ConnectionStrings:DefaultConnection` → alapból `site.db` fájl a projekten belül.
*   **JWT**: `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience` → fejlesztéshez adott kulcsok, produkcióban cseréld le őket biztonságos értékekre.

## Tesztadatok és szerepkörök

Az alkalmazás indításakor az alábbi felhasználók jönnek létre automatikusan:

| Szerep | E-mail | Jelszó |
| :--- | :--- | :--- |
| **Admin** | `admin@savorly.com` | `admin123` |
| **Felhasználó** | `user@savorly.com` | `user123` |

Az `AppDbContext` seed-je gondoskodik a fenti fiókokról és az alap kategóriákról/receptekről, így a fejlesztői környezet azonnal használható.
