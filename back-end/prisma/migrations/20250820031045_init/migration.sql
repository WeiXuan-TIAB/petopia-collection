-- CreateTable
CREATE TABLE `admin_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `credential_hash` VARCHAR(255) NULL,
    `status` ENUM('pending', 'active', 'suspended') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adoption_agencies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NULL,
    `email` VARCHAR(100) NULL,
    `phone` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adoption_pets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agency_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `species` VARCHAR(50) NULL,
    `breed` VARCHAR(50) NULL,
    `age` INTEGER NULL,
    `sex` ENUM('M', 'F', 'U') NOT NULL DEFAULT 'U',
    `description` TEXT NULL,
    `status` ENUM('available', 'pending', 'adopted') NOT NULL DEFAULT 'available',
    `condition_text` TEXT NULL,
    `valid_until` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATETIME(0) NULL,

    INDEX `agency_id`(`agency_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area_geometries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `place_id` INTEGER NOT NULL,
    `type` ENUM('point', 'polygon', 'circle') NOT NULL,
    `data` JSON NOT NULL,

    INDEX `place_id`(`place_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` CHAR(4) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `parent_id` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_categories_parent_id`(`parent_id`),
    INDEX `parent_id`(`parent_id`),
    UNIQUE INDEX `uq_categories_parent_name`(`parent_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_details` (
    `content_id` INTEGER NOT NULL,
    `content` TEXT NULL,
    `video_url` VARCHAR(255) NULL,
    `cover_url` VARCHAR(255) NULL,
    `duration` INTEGER NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`content_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(30) NOT NULL,
    `description` TEXT NULL,
    `type` ENUM('percent', 'amount', 'free_shipping') NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `min_order_amount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `usage_limit` INTEGER NULL,
    `start_time` DATETIME(0) NOT NULL,
    `end_time` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `code`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forum_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content_id` INTEGER NOT NULL,
    `member_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATETIME(0) NULL,
    `content` TEXT NOT NULL,
    `target_id` INTEGER NULL,
    `target_type` ENUM('blog', 'vlog', 'comment') NOT NULL,

    INDEX `content_id`(`content_id`),
    INDEX `member_id`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forum_contents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` LONGTEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `hashtags` JSON NULL,
    `image_url` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `pet_category` VARCHAR(191) NULL,

    INDEX `forum_contents_member_id_idx`(`member_id`),
    INDEX `forum_contents_status_idx`(`status`),
    INDEX `forum_contents_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forum_interactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `target_type` ENUM('blog', 'vlog', 'comment') NOT NULL,
    `target_id` INTEGER NOT NULL,
    `interaction_type` ENUM('like', 'dislike', 'share') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATETIME(0) NULL,

    INDEX `member_id`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forum_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `target_type` ENUM('comment', 'content') NOT NULL,
    `target_id` INTEGER NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('pending', 'reviewed', 'dismissed', 'action_taken') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `reviewed_at` DATETIME(0) NULL,
    `handled_by` INTEGER NULL,

    INDEX `handled_by`(`handled_by`),
    INDEX `member_id`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itineraries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `days` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `original_price` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(10) NOT NULL,
    `discount_price` DECIMAL(10, 2) NULL,
    `photo` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itinerary_id` INTEGER NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `Prefecture` VARCHAR(100) NOT NULL,
    `Place` VARCHAR(100) NOT NULL,

    INDEX `itinerary_id`(`itinerary_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_nodes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itinerary_id` INTEGER NOT NULL,
    `activity_name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `activity_date` DATE NOT NULL,
    `time_slot` VARCHAR(10) NOT NULL,
    `location` VARCHAR(255) NULL,

    INDEX `itinerary_id`(`itinerary_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_order_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itinerary_orders_id` INTEGER NOT NULL,
    `itinerary_nodes_before` INTEGER NOT NULL,
    `itinerary_nodes_after` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `itinerary_nodes_after`(`itinerary_nodes_after`),
    INDEX `itinerary_nodes_before`(`itinerary_nodes_before`),
    INDEX `itinerary_orders_id`(`itinerary_orders_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_order_nodes` (
    `itinerary_orders_id` INTEGER NOT NULL,
    `itinerary_nodes_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `itinerary_nodes_id`(`itinerary_nodes_id`),
    PRIMARY KEY (`itinerary_orders_id`, `itinerary_nodes_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `total_price` DECIMAL(10, 2) NULL,
    `status` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `member_id`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_actions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `action_type` ENUM('like', 'favorite', 'click', 'rating') NOT NULL,
    `value` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `member_id`(`member_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `zipcode` INTEGER NOT NULL,
    `city` VARCHAR(16) NOT NULL,
    `area` VARCHAR(16) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `name` VARCHAR(32) NOT NULL,
    `mobile` VARCHAR(16) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `is_main` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_address_member`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_coupons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `coupon_id` INTEGER NOT NULL,
    `is_used` BOOLEAN NULL DEFAULT false,
    `used_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `coupon_id`(`coupon_id`),
    INDEX `member_id`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_credentials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `type` VARCHAR(20) NULL DEFAULT 'password',
    `provider` VARCHAR(20) NULL,
    `oauth_uid` VARCHAR(255) NULL,
    `credential_hash` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(0) NULL,
    `is_force_reset` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uniq_credential`(`member_id`, `type`, `provider`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_levels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(16) NULL DEFAULT 'starter',
    `name` VARCHAR(32) NULL DEFAULT '新手鏟屎官',
    `min_points` INTEGER NOT NULL,
    `discount_rate` DECIMAL(5, 2) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `code`(`code`),
    UNIQUE INDEX `name`(`name`),
    UNIQUE INDEX `min_points`(`min_points`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_likes` (
    `member_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`member_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_login_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `provider` VARCHAR(20) NULL,
    `status` VARCHAR(20) NOT NULL,
    `ip_address` VARCHAR(45) NOT NULL,
    `user_agent` TEXT NOT NULL,
    `error_msg` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_loginlog_member`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_point_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `ref_type` ENUM('purchase', 'refund', 'adjust', 'redeem') NOT NULL,
    `ref_id` INTEGER NULL,
    `points_before` INTEGER NULL DEFAULT 0,
    `points_change` INTEGER NOT NULL,
    `description` TEXT NULL,
    `created_by` INTEGER NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_pointlog_admin`(`created_by`),
    INDEX `fk_pointlog_member`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_point_status` (
    `member_id` INTEGER NOT NULL,
    `level_id` INTEGER NOT NULL,
    `points` INTEGER NULL DEFAULT 0,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_point_level`(`level_id`),
    PRIMARY KEY (`member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NULL,
    `nickname` VARCHAR(16) NULL,
    `gender` ENUM('male', 'female', 'other') NULL,
    `email` VARCHAR(255) NOT NULL,
    `birthday` DATE NULL,
    `mobile` VARCHAR(16) NULL,
    `status` ENUM('pending', 'active', 'suspended') NOT NULL DEFAULT 'pending',
    `avatar` VARCHAR(255) NULL,
    `last_login` DATETIME(0) NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `is_online` BOOLEAN NULL DEFAULT false,
    `location_visibility` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `nickname`(`nickname`),
    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `mobile`(`mobile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `password_resets_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NULL,
    `var_id` INTEGER NULL,
    `price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `order_id`(`order_id`),
    INDEX `var_id`(`var_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_status_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NULL,
    `order_status` ENUM('pending', 'stocking', 'shipped', 'arrived', 'canceled', 'returned') NULL,
    `changed_by` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `changed_by`(`changed_by`),
    INDEX `order_id`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `order_num` VARCHAR(20) NULL,
    `order_status` ENUM('pending', 'stocking', 'shipped', 'arrived', 'canceled', 'returned') NULL DEFAULT 'pending',

    UNIQUE INDEX `order_num`(`order_num`),
    INDEX `customer_id`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_breeds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `species_id` INTEGER NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_breed_species`(`species_id`),
    UNIQUE INDEX `uniq_species_breed`(`species_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_chat_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `match_id` INTEGER NOT NULL,
    `sender_member_id` INTEGER NOT NULL,
    `message_text` TEXT NOT NULL,
    `message_type` ENUM('text', 'image', 'sticker') NULL DEFAULT 'text',
    `image_url` VARCHAR(500) NULL,
    `is_read` BOOLEAN NULL DEFAULT false,
    `sent_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_match_messages`(`match_id`, `sent_at` DESC),
    INDEX `idx_sender_messages`(`sender_member_id`, `sent_at` DESC),
    INDEX `idx_sender_unread`(`sender_member_id`, `is_read`),
    INDEX `idx_unread_messages`(`match_id`, `is_read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_chat_read_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `match_id` INTEGER NOT NULL,
    `member_id` INTEGER NOT NULL,
    `last_read_message_id` INTEGER NULL,
    `last_read_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_last_read_message`(`last_read_message_id`),
    INDEX `idx_member_read`(`member_id`),
    UNIQUE INDEX `uniq_match_member`(`match_id`, `member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_member_id` INTEGER NOT NULL,
    `to_pet_profile_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_member_likes`(`from_member_id`),
    INDEX `idx_pet_likes`(`to_pet_profile_id`),
    UNIQUE INDEX `uniq_member_like_pet`(`from_member_id`, `to_pet_profile_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_matches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member1_id` INTEGER NOT NULL,
    `member2_id` INTEGER NOT NULL,
    `pet1_profile_id` INTEGER NOT NULL,
    `pet2_profile_id` INTEGER NOT NULL,
    `matched_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_active` BOOLEAN NULL DEFAULT true,
    `member_low_id` INTEGER NULL,
    `member_high_id` INTEGER NULL,

    INDEX `idx_member1_matches`(`member1_id`, `is_active`),
    INDEX `idx_member2_matches`(`member2_id`, `is_active`),
    INDEX `idx_pet1_matches`(`pet1_profile_id`),
    INDEX `idx_pet2_matches`(`pet2_profile_id`),
    UNIQUE INDEX `uniq_member_pair`(`member_low_id`, `member_high_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_personalities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personality` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `personality`(`personality`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_profile_personalities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pet_profile_id` INTEGER NOT NULL,
    `personality_id` INTEGER NOT NULL,

    INDEX `fk_personality`(`personality_id`),
    UNIQUE INDEX `uniq_pet_personality`(`pet_profile_id`, `personality_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_profile_photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pet_profile_id` INTEGER NOT NULL,
    `photo_url` VARCHAR(300) NOT NULL,
    `photo_order` TINYINT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_profile_photos`(`pet_profile_id`, `photo_order`),
    UNIQUE INDEX `uniq_pet_profile_photo_order`(`pet_profile_id`, `photo_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `name` VARCHAR(32) NOT NULL,
    `species` INTEGER NOT NULL,
    `breed` VARCHAR(64) NOT NULL,
    `gender` ENUM('male', 'female', 'unknown') NOT NULL,
    `birthday` DATE NULL,
    `weight_kg` DECIMAL(5, 2) NOT NULL,
    `is_neutered` BOOLEAN NULL DEFAULT false,
    `avatar_url` VARCHAR(255) NULL,
    `vaccinated_at` DATE NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_pet_species`(`species`),
    INDEX `idx_pet_member`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_species` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(32) NOT NULL,
    `name` VARCHAR(32) NOT NULL,
    `icon_url` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `code`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_titles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `title`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `place_business_hours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `place_id` INTEGER NOT NULL,
    `day_of_week` TINYINT NOT NULL,
    `open_time` TIME(0) NULL,
    `close_time` TIME(0) NULL,
    `is_closed` BOOLEAN NULL DEFAULT false,

    INDEX `idx_bh_place`(`place_id`),
    UNIQUE INDEX `uniq_place_day`(`place_id`, `day_of_week`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `place_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `color` VARCHAR(7) NULL DEFAULT '#666666',
    `icon` VARCHAR(255) NULL,
    `pin_color` CHAR(7) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `place_favorites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `place_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_place_fav_member`(`member_id`),
    INDEX `idx_place_fav_place`(`place_id`),
    UNIQUE INDEX `uniq_member_place`(`member_id`, `place_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `place_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `place_id` INTEGER NOT NULL,
    `indoor_dining` BOOLEAN NULL DEFAULT false,
    `takeout` BOOLEAN NULL DEFAULT false,
    `outdoor_seating` BOOLEAN NULL DEFAULT false,
    `pet_menu` BOOLEAN NULL DEFAULT false,
    `parking` BOOLEAN NULL DEFAULT false,
    `wheelchair_accessible` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `uniq_place_features`(`place_id`),
    INDEX `idx_pf_place`(`place_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `place_photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `place_id` INTEGER NOT NULL,
    `member_id` INTEGER NULL,
    `review_id` INTEGER NULL,
    `url` VARCHAR(500) NOT NULL,
    `caption` VARCHAR(200) NULL,
    `photo_type` ENUM('official', 'user_review') NOT NULL,
    `is_main` BOOLEAN NULL DEFAULT false,
    `is_approved` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_pp_member`(`member_id`),
    INDEX `idx_pp_place_type_main`(`place_id`, `photo_type`, `is_main`),
    INDEX `idx_pp_review`(`review_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `place_reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `place_id` INTEGER NOT NULL,
    `member_id` INTEGER NOT NULL,
    `rating` TINYINT UNSIGNED NOT NULL,
    `comment` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_member_reviews`(`member_id`, `place_id`),
    INDEX `idx_place_reviews`(`place_id`, `rating`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `places` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `district` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `description` TEXT NULL,
    `website` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_places_district`(`district`),
    INDEX `idx_places_location`(`latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_colors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hex_code` VARCHAR(7) NOT NULL,
    `color_name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_flavors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flav_name` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `var_id` INTEGER NULL,
    `img_url` TEXT NOT NULL,
    `img_type` ENUM('main', 'minor', 'desc') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `product_id`(`product_id`),
    INDEX `var_id`(`var_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `var_id` INTEGER NULL,
    `stock_quantity` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `product_id` INTEGER NULL,

    INDEX `var_id`(`var_id`),
    UNIQUE INDEX `product_id`(`product_id`, `var_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `log_action` ENUM('create', 'update', 'delete', 'send') NOT NULL,
    `changed_by` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `changed_by`(`changed_by`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `rating` TINYINT NOT NULL,
    `review` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_product_member`(`product_id`, `member_id`),
    UNIQUE INDEX `uniq_member_product_review`(`member_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_sizes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `size_name` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `color_id` INTEGER NULL,
    `size_id` INTEGER NULL,
    `flavor_id` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `color_id`(`color_id`),
    INDEX `flavor_id`(`flavor_id`),
    INDEX `product_id`(`product_id`),
    INDEX `size_id`(`size_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cat_id` INTEGER NULL,
    `price` INTEGER NOT NULL,
    `cost` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `product_code` VARCHAR(20) NOT NULL,
    `product_desc` TEXT NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,

    INDEX `cat_id`(`cat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotion_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `promo_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `cat_id` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `cat_id`(`cat_id`),
    INDEX `product_id`(`product_id`),
    INDEX `promo_id`(`promo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_time` DATETIME(0) NOT NULL,
    `end_time` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `promo_name` VARCHAR(100) NULL,
    `promo_status` ENUM('pending', 'active', 'ended') NULL DEFAULT 'pending',
    `promo_type` ENUM('count', 'combo', 'itemType', 'amount', 'freeShipping') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotions_rules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `promo_id` INTEGER NULL,
    `rule_type` ENUM('count', 'combo', 'itemType', 'amount', 'freeShipping') NULL,
    `threshold` DECIMAL(10, 2) NOT NULL,
    `discount_type` ENUM('percent', 'amount', 'fixed_price') NULL,
    `discount_value` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `promo_id`(`promo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pur_order` INTEGER NULL,
    `product_id` INTEGER NULL,
    `var_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `product_id`(`product_id`),
    INDEX `pur_order`(`pur_order`),
    INDEX `var_id`(`var_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `send_by` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `order_code` VARCHAR(20) NOT NULL,
    `order_status` ENUM('rough', 'send', 'stock_in') NULL,

    UNIQUE INDEX `order_code`(`order_code`),
    INDEX `send_by`(`send_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NOT NULL,
    `admin_id` INTEGER NOT NULL,
    `notes` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `admin_id`(`admin_id`),
    INDEX `report_id`(`report_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation_notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservation_id` INTEGER NOT NULL,
    `note` TEXT NOT NULL,
    `created_by` INTEGER NULL,
    `created_by_type` ENUM('member', 'admin', 'system') NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_note_reservation`(`reservation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation_pets` (
    `reservation_id` INTEGER NOT NULL,
    `pet_id` INTEGER NOT NULL,
    `note` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_rsv_pet_profile`(`pet_id`),
    PRIMARY KEY (`reservation_id`, `pet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation_reminders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservation_id` INTEGER NOT NULL,
    `reminder_type` ENUM('email', 'sms', 'app_push', 'line_bot') NOT NULL,
    `reminder_time` DATETIME(0) NOT NULL,
    `sent_at` DATETIME(0) NULL,
    `status` ENUM('pending', 'sent', 'failed') NOT NULL,
    `error_message` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_reminder_reservation`(`reservation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation_seats` (
    `reservation_id` INTEGER NOT NULL,
    `seat_id` INTEGER NOT NULL,
    `created_by` INTEGER NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_rsv_seat_created_by`(`created_by`),
    INDEX `fk_rsv_seat_seat`(`seat_id`),
    PRIMARY KEY (`reservation_id`, `seat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation_status_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservation_id` INTEGER NOT NULL,
    `from_status` ENUM('pending', 'confirmed', 'arrived', 'cancelled', 'no_show', 'completed') NOT NULL,
    `to_status` ENUM('pending', 'confirmed', 'arrived', 'cancelled', 'no_show', 'completed') NOT NULL,
    `changed_by` INTEGER NULL,
    `changed_by_type` ENUM('member', 'admin', 'system') NOT NULL,
    `reason` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_statuslog_reservation`(`reservation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `restaurant_id` INTEGER NOT NULL,
    `reservation_date` DATETIME(0) NOT NULL,
    `start_time` DATETIME(0) NOT NULL,
    `end_time` DATETIME(0) NULL,
    `party_size` INTEGER NOT NULL,
    `has_pet` BOOLEAN NULL DEFAULT false,
    `status` ENUM('pending', 'confirmed', 'arrived', 'cancelled', 'no_show', 'completed') NOT NULL DEFAULT 'pending',
    `contact_phone` VARCHAR(16) NULL,
    `expire_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_reservation_created_by`(`created_by`),
    INDEX `fk_reservation_member`(`member_id`),
    INDEX `fk_reservation_updated_by`(`updated_by`),
    UNIQUE INDEX `uniq_rest_date_start`(`restaurant_id`, `reservation_date`, `start_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant_business_hours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `restaurant_id` INTEGER NOT NULL,
    `weekday` TINYINT NOT NULL,
    `start_time` TIME(0) NOT NULL,
    `end_time` TIME(0) NOT NULL,
    `note` VARCHAR(255) NULL,
    `is_closed` BOOLEAN NOT NULL DEFAULT false,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_bh_created_by`(`created_by`),
    INDEX `fk_bh_updated_by`(`updated_by`),
    INDEX `idx_bh_rest_week_start`(`restaurant_id`, `weekday`, `start_time`),
    UNIQUE INDEX `uniq_business_hours`(`restaurant_id`, `weekday`, `start_time`, `end_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant_closures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `restaurant_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `start_time` TIME(0) NULL DEFAULT '00:00:00',
    `end_time` TIME(0) NULL DEFAULT '23:59:59',
    `closure_note` TEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_closure_created_by`(`created_by`),
    INDEX `fk_closure_updated_by`(`updated_by`),
    UNIQUE INDEX `uniq_closure_per_day`(`restaurant_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant_photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `restaurant_id` INTEGER NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_restaurant_photos_restaurant`(`restaurant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant_seat_rules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seat_id` INTEGER NOT NULL,
    `species_id` INTEGER NOT NULL,
    `max_weight_kg` DECIMAL(5, 2) NULL,
    `note` TEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_rule_created_by`(`created_by`),
    INDEX `fk_rule_seat`(`seat_id`),
    INDEX `fk_rule_species`(`species_id`),
    INDEX `fk_rule_updated_by`(`updated_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant_seats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `restaurant_id` INTEGER NOT NULL,
    `code` VARCHAR(16) NOT NULL,
    `area` VARCHAR(32) NOT NULL,
    `seats` INTEGER NOT NULL,
    `pet_allowed` BOOLEAN NULL DEFAULT false,
    `status` ENUM('available', 'occupied', 'unavailable') NULL DEFAULT 'available',
    `note` TEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_seat_created_by`(`created_by`),
    INDEX `fk_seat_updated_by`(`updated_by`),
    UNIQUE INDEX `uniq_restaurant_seat_code`(`restaurant_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(254) NOT NULL,
    `tax_id` CHAR(8) NOT NULL,
    `name` VARCHAR(32) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `zipcode` INTEGER NOT NULL,
    `city` VARCHAR(16) NOT NULL,
    `area` VARCHAR(16) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `type` ENUM('cat_friendly', 'dog_friendly', 'pet_friendly') NOT NULL,
    `rating` DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    `latitude` DECIMAL(10, 7) NOT NULL,
    `longitude` DECIMAL(10, 7) NOT NULL,
    `contact_name` VARCHAR(32) NOT NULL,
    `contact_phone` VARCHAR(16) NOT NULL,
    `status` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
    `description` TEXT NOT NULL,
    `thumbnail_url` VARCHAR(255) NOT NULL,
    `banner_url` VARCHAR(255) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `tax_id`(`tax_id`),
    UNIQUE INDEX `name`(`name`),
    UNIQUE INDEX `phone`(`phone`),
    UNIQUE INDEX `contact_phone`(`contact_phone`),
    INDEX `fk_restaurant_created_by`(`created_by`),
    INDEX `fk_restaurant_updated_by`(`updated_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `return_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NULL,
    `return_order` INTEGER NULL,
    `return_id` INTEGER NULL,
    `item_condition` ENUM('normal', 'scrap') NULL,
    `quantity` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `customer_id`(`customer_id`),
    INDEX `return_id`(`return_id`),
    INDEX `return_order`(`return_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales_report_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `var_id` INTEGER NULL,
    `sales_qty` INTEGER NOT NULL DEFAULT 0,
    `sales_amount` INTEGER NOT NULL DEFAULT 0,

    INDEX `product_id`(`product_id`),
    INDEX `report_id`(`report_id`),
    INDEX `var_id`(`var_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_type` ENUM('weekly', 'monthly', 'yearly') NULL DEFAULT 'monthly',
    `report_startdate` DATE NOT NULL,
    `report_enddate` DATE NOT NULL,
    `generated_at` DATETIME(0) NOT NULL,
    `generated_by` INTEGER NOT NULL,

    INDEX `generated_by`(`generated_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ship_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NULL,
    `ship_order` INTEGER NULL,
    `ship_item` INTEGER NULL,
    `var_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `delivery` ENUM('stocking', 'delivered', 'arrived') NULL DEFAULT 'stocking',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `customer_id`(`customer_id`),
    INDEX `ship_item`(`ship_item`),
    INDEX `ship_order`(`ship_order`),
    INDEX `var_id`(`var_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `place_category_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `place_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_place_category_relations_category`(`category_id`),
    INDEX `idx_place_category_relations_place`(`place_id`),
    UNIQUE INDEX `unique_place_category`(`place_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `adoption_pets` ADD CONSTRAINT `adoption_pets_ibfk_1` FOREIGN KEY (`agency_id`) REFERENCES `adoption_agencies`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `forum_comments` ADD CONSTRAINT `forum_comments_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `forum_comments` ADD CONSTRAINT `forum_comments_ibfk_2` FOREIGN KEY (`content_id`) REFERENCES `forum_contents`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `forum_contents` ADD CONSTRAINT `forum_contents_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_interactions` ADD CONSTRAINT `forum_interactions_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `itinerary_locations` ADD CONSTRAINT `itinerary_locations_ibfk_1` FOREIGN KEY (`itinerary_id`) REFERENCES `itineraries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `member_actions` ADD CONSTRAINT `member_actions_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `member_actions` ADD CONSTRAINT `member_actions_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `member_coupons` ADD CONSTRAINT `member_coupons_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `member_coupons` ADD CONSTRAINT `member_coupons_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `member_credentials` ADD CONSTRAINT `fk_member_credentials_member` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_likes` ADD CONSTRAINT `member_likes_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `member_likes` ADD CONSTRAINT `member_likes_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `password_resets` ADD CONSTRAINT `password_resets_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pet_breeds` ADD CONSTRAINT `fk_breed_species` FOREIGN KEY (`species_id`) REFERENCES `pet_species`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pet_likes` ADD CONSTRAINT `fk_pet_likes_member` FOREIGN KEY (`from_member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pet_likes` ADD CONSTRAINT `fk_pet_likes_pet_profile` FOREIGN KEY (`to_pet_profile_id`) REFERENCES `pet_profiles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pet_profile_personalities` ADD CONSTRAINT `fk_pet_profile_personalities_personality` FOREIGN KEY (`personality_id`) REFERENCES `pet_personalities`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pet_profile_personalities` ADD CONSTRAINT `fk_pet_profile_personalities_profile` FOREIGN KEY (`pet_profile_id`) REFERENCES `pet_profiles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pet_profile_photos` ADD CONSTRAINT `fk_pet_profile_photos_profile` FOREIGN KEY (`pet_profile_id`) REFERENCES `pet_profiles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pet_profiles` ADD CONSTRAINT `fk_pet_member` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pet_profiles` ADD CONSTRAINT `fk_pet_species` FOREIGN KEY (`species`) REFERENCES `pet_species`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_business_hours` ADD CONSTRAINT `fk_bh_place` FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_favorites` ADD CONSTRAINT `fk_place_favorites_member` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_favorites` ADD CONSTRAINT `fk_place_favorites_place` FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_features` ADD CONSTRAINT `fk_place_features_place` FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_photos` ADD CONSTRAINT `fk_pp_member` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_photos` ADD CONSTRAINT `fk_pp_place` FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_photos` ADD CONSTRAINT `fk_pp_review` FOREIGN KEY (`review_id`) REFERENCES `place_reviews`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_reviews` ADD CONSTRAINT `fk_pr_member` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_reviews` ADD CONSTRAINT `fk_pr_place` FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_ibfk_2` FOREIGN KEY (`var_id`) REFERENCES `product_variants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_inventory` ADD CONSTRAINT `fk_product_inventory_variant` FOREIGN KEY (`var_id`) REFERENCES `product_variants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `fk_review_member` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `fk_product_variants_color` FOREIGN KEY (`color_id`) REFERENCES `product_colors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `fk_product_variants_flavor` FOREIGN KEY (`flavor_id`) REFERENCES `product_flavors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `fk_product_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `fk_product_variants_size` FOREIGN KEY (`size_id`) REFERENCES `product_sizes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `fk_products_categories` FOREIGN KEY (`cat_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotion_products` ADD CONSTRAINT `fk_promo_products_categories` FOREIGN KEY (`cat_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotion_products` ADD CONSTRAINT `fk_promo_products_products` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotion_products` ADD CONSTRAINT `fk_promo_products_promotions` FOREIGN KEY (`promo_id`) REFERENCES `promotions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `fk_resv_member` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `fk_resv_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurant_business_hours` ADD CONSTRAINT `restaurant_business_hours_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurant_photos` ADD CONSTRAINT `fk_restaurant_photos_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `place_category_relations` ADD CONSTRAINT `place_category_relations_ibfk_1` FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `place_category_relations` ADD CONSTRAINT `place_category_relations_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `place_categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
