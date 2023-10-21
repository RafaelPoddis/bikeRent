/*
  Warnings:

  - The primary key for the `Bike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Rent` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bodySize" REAL NOT NULL,
    "maxLoad" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "ratings" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Bike" ("available", "bodySize", "description", "id", "maxLoad", "name", "rate", "ratings", "type") SELECT "available", "bodySize", "description", "id", "maxLoad", "name", "rate", "ratings", "type" FROM "Bike";
DROP TABLE "Bike";
ALTER TABLE "new_Bike" RENAME TO "Bike";
CREATE TABLE "new_Images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "bikeId" TEXT NOT NULL,
    CONSTRAINT "Images_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Images" ("bikeId", "id", "url") SELECT "bikeId", "id", "url" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
CREATE UNIQUE INDEX "Images_url_key" ON "Images"("url");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "bikeId" TEXT NOT NULL,
    CONSTRAINT "Location_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Location" ("bikeId", "id", "latitude", "longitude") SELECT "bikeId", "id", "latitude", "longitude" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE TABLE "new_Rent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start" DATETIME NOT NULL,
    "end" DATETIME,
    "userId" TEXT NOT NULL,
    "bikeId" TEXT NOT NULL,
    CONSTRAINT "Rent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rent_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rent" ("bikeId", "end", "id", "start", "userId") SELECT "bikeId", "end", "id", "start", "userId" FROM "Rent";
DROP TABLE "Rent";
ALTER TABLE "new_Rent" RENAME TO "Rent";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
