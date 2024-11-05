-- Custom SQL migration file, put you code below! --

CREATE INDEX "molidx" ON "reagents" USING GIST("structure");
