/*
  Warnings:

  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `price` VARCHAR(191) NOT NULL,
    MODIFY `stock` VARCHAR(191) NOT NULL;
