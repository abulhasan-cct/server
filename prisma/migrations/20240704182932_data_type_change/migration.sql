/*
  Warnings:

  - You are about to alter the column `trending` on the `product` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `price` VARCHAR(191) NOT NULL,
    MODIFY `stock` VARCHAR(191) NOT NULL,
    MODIFY `trending` VARCHAR(191) NOT NULL;
