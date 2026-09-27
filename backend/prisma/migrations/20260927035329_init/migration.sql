-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "location" TEXT,
    "userId" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "whichLanguage" TEXT,
    "davlat" TEXT NOT NULL,
    "kimBilanBorishKerak" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);
