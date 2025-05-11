/*
  Warnings:

  - You are about to drop the `CodeTemplateTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CodeTemplateTag";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_CodeTemplateToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CodeTemplateToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "CodeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CodeTemplateToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CodeTemplateToTag_AB_unique" ON "_CodeTemplateToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CodeTemplateToTag_B_index" ON "_CodeTemplateToTag"("B");
