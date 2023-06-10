/*
  Warnings:

  - You are about to alter the column `date` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorName" TEXT NOT NULL,
    "chatIdByEmployee" TEXT NOT NULL,
    "messageValue" TEXT NOT NULL,
    "replaceMessageId" TEXT,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_Message" ("authorName", "chatIdByEmployee", "date", "id", "messageValue", "replaceMessageId") SELECT "authorName", "chatIdByEmployee", "date", "id", "messageValue", "replaceMessageId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
