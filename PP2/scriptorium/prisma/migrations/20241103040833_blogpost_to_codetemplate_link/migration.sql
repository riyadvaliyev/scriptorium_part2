-- CreateTable
CREATE TABLE "_BlogPostCodeTemplates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostCodeTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostCodeTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "CodeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostCodeTemplates_AB_unique" ON "_BlogPostCodeTemplates"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostCodeTemplates_B_index" ON "_BlogPostCodeTemplates"("B");
