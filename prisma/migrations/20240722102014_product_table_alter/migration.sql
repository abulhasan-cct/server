/*
  Warnings:

  - You are about to drop the column `address` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `shipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `address`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `delivery_address_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ordertracking` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `product` ADD COLUMN `product_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `shipment` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `state`,
    DROP COLUMN `zip_code`;

-- CreateTable
CREATE TABLE `DeliveryAddress` (
    `address_id` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `zip_code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DeliveryAddress` ADD CONSTRAINT `DeliveryAddress_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_delivery_address_id_fkey` FOREIGN KEY (`delivery_address_id`) REFERENCES `DeliveryAddress`(`address_id`) ON DELETE SET NULL ON UPDATE CASCADE;
