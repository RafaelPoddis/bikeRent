-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Bike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bodySize" REAL NOT NULL,
    "maxLoad" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "ratings" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "bikeId" INTEGER NOT NULL,
    CONSTRAINT "Images_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "bikeId" INTEGER NOT NULL,
    CONSTRAINT "Location_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "start" DATETIME NOT NULL,
    "end" DATETIME,
    "userId" INTEGER NOT NULL,
    "bikeId" INTEGER NOT NULL,
    CONSTRAINT "Rent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rent_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Images_url_key" ON "Images"("url");
