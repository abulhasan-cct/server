/*
  Warnings:

  - You are about to alter the column `payment_method` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `payment_method` ENUM('UPI', 'COD', 'CARD', 'NETBANKING') NOT NULL;
