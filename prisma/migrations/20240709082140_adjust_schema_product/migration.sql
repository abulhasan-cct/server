-- DropForeignKey
ALTER TABLE `productimage` DROP FOREIGN KEY `ProductImage_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `wishlistproduct` DROP FOREIGN KEY `WishlistProduct_product_id_fkey`;

-- AddForeignKey
ALTER TABLE `WishlistProduct` ADD CONSTRAINT `WishlistProduct_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
