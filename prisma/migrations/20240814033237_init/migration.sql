-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Instance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "imgSrc" TEXT,
    "ownerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Manga" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "_InstanceToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_InstanceToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Instance" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_InstanceToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_InstanceToManga" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_InstanceToManga_A_fkey" FOREIGN KEY ("A") REFERENCES "Instance" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_InstanceToManga_B_fkey" FOREIGN KEY ("B") REFERENCES "Manga" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_InstanceToWebhook" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_InstanceToWebhook_A_fkey" FOREIGN KEY ("A") REFERENCES "Instance" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_InstanceToWebhook_B_fkey" FOREIGN KEY ("B") REFERENCES "Webhook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_InstanceToUser_AB_unique" ON "_InstanceToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_InstanceToUser_B_index" ON "_InstanceToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InstanceToManga_AB_unique" ON "_InstanceToManga"("A", "B");

-- CreateIndex
CREATE INDEX "_InstanceToManga_B_index" ON "_InstanceToManga"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InstanceToWebhook_AB_unique" ON "_InstanceToWebhook"("A", "B");

-- CreateIndex
CREATE INDEX "_InstanceToWebhook_B_index" ON "_InstanceToWebhook"("B");
