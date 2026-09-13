ALTER TABLE "Booking" ADD COLUMN "archivedAt" TIMESTAMP(3);

CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Booking_archivedAt_endDate_idx" ON "Booking"("archivedAt", "endDate");
CREATE INDEX "GalleryImage_category_createdAt_idx" ON "GalleryImage"("category", "createdAt");
