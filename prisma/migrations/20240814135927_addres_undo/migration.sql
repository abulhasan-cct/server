/*
  Warnings:

  - You are about to drop the `customeraddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `customeraddress` DROP FOREIGN KEY `CustomerAddress_customer_id_fkey`;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `address` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `customeraddress`;
