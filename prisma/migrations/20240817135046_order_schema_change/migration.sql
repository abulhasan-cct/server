-- AlterTable
ALTER TABLE `order_items` MODIFY `price` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orders` MODIFY `total_price` VARCHAR(191) NOT NULL;
