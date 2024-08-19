/*
  Warnings:

  - You are about to drop the column `delivery_address_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `deliveryaddress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `deliveryaddress` DROP FOREIGN KEY `DeliveryAddress_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_delivery_address_id_fkey`;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `address` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `delivery_address_id`;

-- AlterTable
ALTER TABLE `ordertracking` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `product_name`;

-- AlterTable
ALTER TABLE `shipment` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL,
    ADD COLUMN `zip_code` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `deliveryaddress`;
