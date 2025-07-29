-- CreateTable
CREATE TABLE "NodeType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NodeType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NodeType_name_key" ON "NodeType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NodeType_type_key" ON "NodeType"("type");
