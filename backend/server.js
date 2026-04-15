// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
// Mã JWT Secret Key
const JWT_SECRET = 'LETDIV_BACKEND';
// Mô phỏng Database người dùng với dữ liệu mẫu
// db.js

const categories = [
    {
        id: "cat-001",
        name: "Chăm sóc da",
        slug: "cham-soc-da",
        parent_id: null,
        image_url: "/images/categories/skincare.jpg",
        is_active: true,
        sort_order: 1,
        created_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "cat-002",
        name: "Trang điểm",
        slug: "trang-diem",
        parent_id: null,
        image_url: "/images/categories/makeup.jpg",
        is_active: true,
        sort_order: 2,
        created_at: "2024-01-01T00:00:00Z",
    },
];

const products = [
    {
        id: "prod-001",
        category_id: "cat-001",
        name: "Kem Dưỡng Ẩm Laneige Water Bank Blue Hyaluronic",
        slug: "kem-duong-am-laneige-water-bank-blue-hyaluronic",
        brand: "Laneige",
        description:
            "Kem dưỡng ẩm chuyên sâu với công nghệ Water Science™, cấp nước liên tục 24 giờ, phù hợp da thường đến da hỗn hợp.",
        images: [
            "/images/products/prod-001-1.jpg",
            "/images/products/prod-001-2.jpg",
        ],
        tags: ["dưỡng ẩm", "hàn quốc", "hyaluronic acid"],
        base_price: 890000,
        is_active: true,
        is_featured: true,
        rating: 4.8,
        review_count: 124,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-06-01T00:00:00Z",
    },
    {
        id: "prod-002",
        category_id: "cat-001",
        name: "Serum Vitamin C Some By Mi Galactomyces Pure Vitamin C Glow",
        slug: "serum-vitamin-c-some-by-mi-galactomyces",
        brand: "Some By Mi",
        description:
            "Serum dưỡng sáng với 77% Galactomyces và Vitamin C thuần, giúp mờ thâm, đều màu da sau 4 tuần.",
        images: [
            "/images/products/prod-002-1.jpg",
            "/images/products/prod-002-2.jpg",
        ],
        tags: ["serum", "vitamin c", "dưỡng sáng", "hàn quốc"],
        base_price: 350000,
        is_active: true,
        is_featured: true,
        rating: 4.6,
        review_count: 210,
        created_at: "2024-01-15T00:00:00Z",
        updated_at: "2024-05-20T00:00:00Z",
    },
    {
        id: "prod-003",
        category_id: "cat-001",
        name: "Toner Klairs Supple Preparation Unscented",
        slug: "toner-klairs-supple-preparation-unscented",
        brand: "Klairs",
        description:
            "Toner không mùi dịu nhẹ, cân bằng độ pH, tăng cường hàng rào bảo vệ da, phù hợp da nhạy cảm.",
        images: [
            "/images/products/prod-003-1.jpg",
            "/images/products/prod-003-2.jpg",
        ],
        tags: ["toner", "da nhạy cảm", "không mùi", "hàn quốc"],
        base_price: 420000,
        is_active: true,
        is_featured: false,
        rating: 4.7,
        review_count: 185,
        created_at: "2024-01-20T00:00:00Z",
        updated_at: "2024-04-10T00:00:00Z",
    },
    {
        id: "prod-004",
        category_id: "cat-001",
        name: "Kem Chống Nắng Anessa Perfect UV Sunscreen Skincare Milk",
        slug: "kem-chong-nang-anessa-perfect-uv-skincare-milk",
        brand: "Anessa",
        description:
            "Kem chống nắng SPF50+ PA++++ dạng sữa, chống nước, chống mồ hôi, bảo vệ tối đa dưới nắng hè.",
        images: [
            "/images/products/prod-004-1.jpg",
            "/images/products/prod-004-2.jpg",
        ],
        tags: ["chống nắng", "spf50+", "nhật bản", "chống nước"],
        base_price: 620000,
        is_active: true,
        is_featured: true,
        rating: 4.9,
        review_count: 432,
        created_at: "2024-02-01T00:00:00Z",
        updated_at: "2024-06-10T00:00:00Z",
    },
    {
        id: "prod-005",
        category_id: "cat-001",
        name: "Sữa Rửa Mặt CeraVe Hydrating Facial Cleanser",
        slug: "sua-rua-mat-cerave-hydrating-facial-cleanser",
        brand: "CeraVe",
        description:
            "Sữa rửa mặt dịu nhẹ với Ceramide và Hyaluronic Acid, làm sạch không làm mất ẩm, được bác sĩ da liễu khuyên dùng.",
        images: [
            "/images/products/prod-005-1.jpg",
            "/images/products/prod-005-2.jpg",
        ],
        tags: ["sữa rửa mặt", "ceramide", "da khô", "mỹ"],
        base_price: 290000,
        is_active: true,
        is_featured: false,
        rating: 4.7,
        review_count: 318,
        created_at: "2024-02-10T00:00:00Z",
        updated_at: "2024-05-01T00:00:00Z",
    },
    {
        id: "prod-006",
        category_id: "cat-001",
        name: "Mặt Nạ Đất Sét Innisfree Super Volcanic Pore Clay Mask",
        slug: "mat-na-dat-set-innisfree-super-volcanic",
        brand: "Innisfree",
        description:
            "Mặt nạ đất sét núi lửa giúp loại bỏ bã nhờn, thu nhỏ lỗ chân lông, làm sạch sâu chỉ trong 10 phút.",
        images: [
            "/images/products/prod-006-1.jpg",
            "/images/products/prod-006-2.jpg",
        ],
        tags: ["mặt nạ", "đất sét", "lỗ chân lông", "hàn quốc"],
        base_price: 250000,
        is_active: true,
        is_featured: false,
        rating: 4.5,
        review_count: 267,
        created_at: "2024-02-15T00:00:00Z",
        updated_at: "2024-04-20T00:00:00Z",
    },
    {
        id: "prod-007",
        category_id: "cat-001",
        name: "Essence SK-II Facial Treatment Essence",
        slug: "essence-skii-facial-treatment",
        brand: "SK-II",
        description:
            "Essence nước thần huyền thoại với 90% Pitera™, giúp tái tạo da, mờ thâm nám và căng bóng rạng rỡ.",
        images: [
            "/images/products/prod-007-1.jpg",
            "/images/products/prod-007-2.jpg",
        ],
        tags: ["essence", "pitera", "cao cấp", "nhật bản"],
        base_price: 2800000,
        is_active: true,
        is_featured: true,
        rating: 4.9,
        review_count: 89,
        created_at: "2024-03-01T00:00:00Z",
        updated_at: "2024-06-05T00:00:00Z",
    },
    {
        id: "prod-008",
        category_id: "cat-001",
        name: "Kem Mắt The Ordinary Caffeine Solution 5% + EGCG",
        slug: "kem-mat-the-ordinary-caffeine-solution",
        brand: "The Ordinary",
        description:
            "Dung dịch chứa 5% Caffeine và EGCG giúp giảm quầng thâm, bọng mắt và dấu hiệu mệt mỏi quanh vùng mắt.",
        images: [
            "/images/products/prod-008-1.jpg",
            "/images/products/prod-008-2.jpg",
        ],
        tags: ["kem mắt", "caffeine", "quầng thâm", "canada"],
        base_price: 310000,
        is_active: true,
        is_featured: false,
        rating: 4.4,
        review_count: 156,
        created_at: "2024-03-10T00:00:00Z",
        updated_at: "2024-05-25T00:00:00Z",
    },
    {
        id: "prod-009",
        category_id: "cat-002",
        name: "Son Kem Lì Black Rouge Air Fit Velvet Tint",
        slug: "son-kem-li-black-rouge-air-fit-velvet-tint",
        brand: "Black Rouge",
        description:
            "Son kem lì siêu mịn, không khô môi, lên màu chuẩn chỉ với một lớp, bền màu suốt 8 tiếng.",
        images: [
            "/images/products/prod-009-1.jpg",
            "/images/products/prod-009-2.jpg",
        ],
        tags: ["son môi", "lì", "lâu trôi", "hàn quốc"],
        base_price: 185000,
        is_active: true,
        is_featured: true,
        rating: 4.6,
        review_count: 310,
        created_at: "2024-01-05T00:00:00Z",
        updated_at: "2024-05-15T00:00:00Z",
    },
    {
        id: "prod-010",
        category_id: "cat-002",
        name: "Cushion Laneige Neo Cushion Matte",
        slug: "cushion-laneige-neo-cushion-matte",
        brand: "Laneige",
        description:
            "Cushion lì kiểm soát dầu, che phủ hoàn hảo, giữ lớp trang điểm bền vẹn cả ngày dài trong thời tiết nóng ẩm.",
        images: [
            "/images/products/prod-010-1.jpg",
            "/images/products/prod-010-2.jpg",
        ],
        tags: ["cushion", "lì", "kiểm soát dầu", "hàn quốc"],
        base_price: 760000,
        is_active: true,
        is_featured: true,
        rating: 4.7,
        review_count: 198,
        created_at: "2024-01-08T00:00:00Z",
        updated_at: "2024-06-12T00:00:00Z",
    },
    {
        id: "prod-011",
        category_id: "cat-002",
        name: "Mascara Maybelline Sky High Waterproof",
        slug: "mascara-maybelline-sky-high-waterproof",
        brand: "Maybelline",
        description:
            "Mascara chống nước với cọ uốn cong độc đáo, tạo mi dài và cong vút từ gốc tới ngọn không vón cục.",
        images: [
            "/images/products/prod-011-1.jpg",
            "/images/products/prod-011-2.jpg",
        ],
        tags: ["mascara", "chống nước", "dài mi", "mỹ"],
        base_price: 220000,
        is_active: true,
        is_featured: false,
        rating: 4.8,
        review_count: 425,
        created_at: "2024-01-12T00:00:00Z",
        updated_at: "2024-04-30T00:00:00Z",
    },
    {
        id: "prod-012",
        category_id: "cat-002",
        name: "Phấn Phủ NARS Light Reflecting Setting Powder",
        slug: "phan-phu-nars-light-reflecting-setting-powder",
        brand: "NARS",
        description:
            "Phấn phủ dạng bột mịn tạo hiệu ứng ánh sáng tự nhiên, cố định lớp nền, kiểm soát dầu nhẹ nhàng suốt cả ngày.",
        images: [
            "/images/products/prod-012-1.jpg",
            "/images/products/prod-012-2.jpg",
        ],
        tags: ["phấn phủ", "bột", "kiểm soát dầu", "cao cấp"],
        base_price: 1150000,
        is_active: true,
        is_featured: false,
        rating: 4.7,
        review_count: 143,
        created_at: "2024-01-18T00:00:00Z",
        updated_at: "2024-05-08T00:00:00Z",
    },
    {
        id: "prod-013",
        category_id: "cat-002",
        name: "Kem Nền Fenty Beauty Pro Filt'r Soft Matte",
        slug: "kem-nen-fenty-beauty-pro-filtr-soft-matte",
        brand: "Fenty Beauty",
        description:
            "Kem nền lì với 50+ tông màu, độ che phủ vừa đến cao, kiểm soát dầu 24 giờ, không tắc lỗ chân lông.",
        images: [
            "/images/products/prod-013-1.jpg",
            "/images/products/prod-013-2.jpg",
        ],
        tags: ["kem nền", "lì", "50 shade", "che phủ cao"],
        base_price: 980000,
        is_active: true,
        is_featured: true,
        rating: 4.8,
        review_count: 276,
        created_at: "2024-02-05T00:00:00Z",
        updated_at: "2024-06-08T00:00:00Z",
    },
    {
        id: "prod-014",
        category_id: "cat-002",
        name: "Bảng Phấn Mắt Morphe 35O Nature Glow",
        slug: "bang-phan-mat-morphe-35o-nature-glow",
        brand: "Morphe",
        description:
            "Bảng 35 màu mắt tông đất, kết hợp màu matte và nhũ, dễ pha trộn, phù hợp từ trang điểm nhẹ nhàng đến khói.",
        images: [
            "/images/products/prod-014-1.jpg",
            "/images/products/prod-014-2.jpg",
        ],
        tags: ["mắt", "bảng phấn", "tông đất", "35 màu"],
        base_price: 650000,
        is_active: true,
        is_featured: false,
        rating: 4.5,
        review_count: 189,
        created_at: "2024-02-20T00:00:00Z",
        updated_at: "2024-05-10T00:00:00Z",
    },
    {
        id: "prod-015",
        category_id: "cat-002",
        name: "Highlight Becca Shimmering Skin Perfector Pressed",
        slug: "highlight-becca-shimmering-skin-perfector-pressed",
        brand: "Becca",
        description:
            "Highlight dạng nén với hiệu ứng ánh ngọc trai mịn màng, tạo vùng sáng tự nhiên không bị glitter thô.",
        images: [
            "/images/products/prod-015-1.jpg",
            "/images/products/prod-015-2.jpg",
        ],
        tags: ["highlight", "ánh ngọc trai", "contouring", "cao cấp"],
        base_price: 820000,
        is_active: true,
        is_featured: false,
        rating: 4.6,
        review_count: 112,
        created_at: "2024-03-05T00:00:00Z",
        updated_at: "2024-05-22T00:00:00Z",
    },
    {
        id: "prod-016",
        category_id: "cat-002",
        name: "Má Hồng Benefit Dandelion Brightening Blush",
        slug: "ma-hong-benefit-dandelion-brightening-blush",
        brand: "Benefit",
        description:
            "Phấn má hồng tông nude hồng nhẹ nhàng, kết hợp shimmer mịn giúp da ửng hồng tự nhiên và rạng rỡ cả ngày.",
        images: [
            "/images/products/prod-016-1.jpg",
            "/images/products/prod-016-2.jpg",
        ],
        tags: ["má hồng", "nude", "tự nhiên", "mỹ"],
        base_price: 720000,
        is_active: true,
        is_featured: true,
        rating: 4.7,
        review_count: 203,
        created_at: "2024-03-15T00:00:00Z",
        updated_at: "2024-06-01T00:00:00Z",
    },
];

const variants = [
    { id: "var-001", product_id: "prod-001", sku: "LGW-50ML", name: "50ml", shade: null, size: "50ml", price: 890000, sale_price: null, stock: 45, image_url: "/images/variants/prod-001-50ml.jpg", is_default: true },
    { id: "var-002", product_id: "prod-001", sku: "LGW-100ML", name: "100ml", shade: null, size: "100ml", price: 1450000, sale_price: 1300000, stock: 20, image_url: "/images/variants/prod-001-100ml.jpg", is_default: false },
    { id: "var-003", product_id: "prod-002", sku: "SBM-VC-30ML", name: "30ml", shade: null, size: "30ml", price: 350000, sale_price: null, stock: 60, image_url: "/images/variants/prod-002-30ml.jpg", is_default: true },
    { id: "var-004", product_id: "prod-002", sku: "SBM-VC-50ML", name: "50ml", shade: null, size: "50ml", price: 520000, sale_price: 480000, stock: 30, image_url: "/images/variants/prod-002-50ml.jpg", is_default: false },
    { id: "var-005", product_id: "prod-003", sku: "KLR-180ML", name: "180ml", shade: null, size: "180ml", price: 420000, sale_price: null, stock: 55, image_url: "/images/variants/prod-003-180ml.jpg", is_default: true },
    { id: "var-006", product_id: "prod-003", sku: "KLR-320ML", name: "320ml", shade: null, size: "320ml", price: 680000, sale_price: 620000, stock: 25, image_url: "/images/variants/prod-003-320ml.jpg", is_default: false },
    { id: "var-007", product_id: "prod-004", sku: "ANS-60ML", name: "60ml", shade: null, size: "60ml", price: 620000, sale_price: null, stock: 80, image_url: "/images/variants/prod-004-60ml.jpg", is_default: true },
    { id: "var-008", product_id: "prod-004", sku: "ANS-90ML", name: "90ml", shade: null, size: "90ml", price: 850000, sale_price: 780000, stock: 35, image_url: "/images/variants/prod-004-90ml.jpg", is_default: false },
    { id: "var-009", product_id: "prod-005", sku: "CVH-236ML", name: "236ml", shade: null, size: "236ml", price: 290000, sale_price: null, stock: 90, image_url: "/images/variants/prod-005-236ml.jpg", is_default: true },
    { id: "var-010", product_id: "prod-005", sku: "CVH-473ML", name: "473ml", shade: null, size: "473ml", price: 480000, sale_price: 440000, stock: 40, image_url: "/images/variants/prod-005-473ml.jpg", is_default: false },
    { id: "var-011", product_id: "prod-006", sku: "INF-100ML", name: "100ml", shade: null, size: "100ml", price: 250000, sale_price: null, stock: 70, image_url: "/images/variants/prod-006-100ml.jpg", is_default: true },
    { id: "var-012", product_id: "prod-006", sku: "INF-200ML", name: "200ml", shade: null, size: "200ml", price: 420000, sale_price: 380000, stock: 30, image_url: "/images/variants/prod-006-200ml.jpg", is_default: false },
    { id: "var-013", product_id: "prod-007", sku: "SKII-75ML", name: "75ml", shade: null, size: "75ml", price: 2800000, sale_price: null, stock: 15, image_url: "/images/variants/prod-007-75ml.jpg", is_default: true },
    { id: "var-014", product_id: "prod-007", sku: "SKII-160ML", name: "160ml", shade: null, size: "160ml", price: 5200000, sale_price: 4900000, stock: 8, image_url: "/images/variants/prod-007-160ml.jpg", is_default: false },
    { id: "var-015", product_id: "prod-008", sku: "TOC-30ML", name: "30ml", shade: null, size: "30ml", price: 310000, sale_price: null, stock: 50, image_url: "/images/variants/prod-008-30ml.jpg", is_default: true },
    { id: "var-016", product_id: "prod-009", sku: "BR-A01", name: "A01 Soft Pink", shade: "A01", size: null, price: 185000, sale_price: 165000, stock: 100, image_url: "/images/variants/prod-009-a01.jpg", is_default: true },
    { id: "var-017", product_id: "prod-009", sku: "BR-R02", name: "R02 Cherry Red", shade: "R02", size: null, price: 185000, sale_price: null, stock: 80, image_url: "/images/variants/prod-009-r02.jpg", is_default: false },
    { id: "var-018", product_id: "prod-009", sku: "BR-B05", name: "B05 Wine Berry", shade: "B05", size: null, price: 185000, sale_price: null, stock: 65, image_url: "/images/variants/prod-009-b05.jpg", is_default: false },
    { id: "var-019", product_id: "prod-010", sku: "LGC-21N", name: "21N Beige", shade: "21N", size: null, price: 760000, sale_price: null, stock: 40, image_url: "/images/variants/prod-010-21n.jpg", is_default: true },
    { id: "var-020", product_id: "prod-010", sku: "LGC-23C", name: "23C Cool Beige", shade: "23C", size: null, price: 760000, sale_price: null, stock: 38, image_url: "/images/variants/prod-010-23c.jpg", is_default: false },
    { id: "var-021", product_id: "prod-010", sku: "LGC-25N", name: "25N Natural Beige", shade: "25N", size: null, price: 760000, sale_price: 690000, stock: 30, image_url: "/images/variants/prod-010-25n.jpg", is_default: false },
    { id: "var-022", product_id: "prod-011", sku: "MBL-BLACK", name: "Blackest Black", shade: "Blackest Black", size: null, price: 220000, sale_price: 195000, stock: 120, image_url: "/images/variants/prod-011-black.jpg", is_default: true },
    { id: "var-023", product_id: "prod-011", sku: "MBL-BROWN", name: "Brownish Black", shade: "Brownish Black", size: null, price: 220000, sale_price: null, stock: 60, image_url: "/images/variants/prod-011-brown.jpg", is_default: false },
    { id: "var-024", product_id: "prod-012", sku: "NRS-CRYSTAL", name: "Crystal", shade: "Crystal", size: null, price: 1150000, sale_price: null, stock: 25, image_url: "/images/variants/prod-012-crystal.jpg", is_default: true },
    { id: "var-025", product_id: "prod-012", sku: "NRS-MOONRISE", name: "Moonrise", shade: "Moonrise", size: null, price: 1150000, sale_price: 1050000, stock: 18, image_url: "/images/variants/prod-012-moonrise.jpg", is_default: false },
    { id: "var-026", product_id: "prod-013", sku: "FBP-120W", name: "120W Alabaster", shade: "120W", size: null, price: 980000, sale_price: null, stock: 20, image_url: "/images/variants/prod-013-120w.jpg", is_default: false },
    { id: "var-027", product_id: "prod-013", sku: "FBP-235N", name: "235N Almond", shade: "235N", size: null, price: 980000, sale_price: null, stock: 30, image_url: "/images/variants/prod-013-235n.jpg", is_default: true },
    { id: "var-028", product_id: "prod-013", sku: "FBP-385C", name: "385C Chocolate Truffle", shade: "385C", size: null, price: 980000, sale_price: 890000, stock: 15, image_url: "/images/variants/prod-013-385c.jpg", is_default: false },
    { id: "var-029", product_id: "prod-014", sku: "MPH-35O", name: "35O Nature Glow", shade: "35O", size: null, price: 650000, sale_price: 580000, stock: 35, image_url: "/images/variants/prod-014-35o.jpg", is_default: true },
    { id: "var-030", product_id: "prod-015", sku: "BCC-CHAMPAGNE", name: "Champagne Pop", shade: "Champagne Pop", size: null, price: 820000, sale_price: null, stock: 28, image_url: "/images/variants/prod-015-champagne.jpg", is_default: true },
    { id: "var-031", product_id: "prod-015", sku: "BCC-OPAL", name: "Opal", shade: "Opal", size: null, price: 820000, sale_price: 750000, stock: 20, image_url: "/images/variants/prod-015-opal.jpg", is_default: false },
    { id: "var-032", product_id: "prod-016", sku: "BNF-DNDN", name: "Dandelion", shade: "Dandelion", size: null, price: 720000, sale_price: null, stock: 42, image_url: "/images/variants/prod-016-dandelion.jpg", is_default: true },
    { id: "var-033", product_id: "prod-016", sku: "BNF-MINI", name: "Dandelion Mini", shade: "Dandelion", size: "mini", price: 450000, sale_price: 410000, stock: 55, image_url: "/images/variants/prod-016-mini.jpg", is_default: false },
];

const users = [
    {
        id: "user-001",
        email: "nguyen.thi.a@email.com",
        password_hash: "$2b$10$hashedpassword1",
        full_name: "Nguyễn Thị A",
        phone: "0901234567",
        avatar_url: "/images/avatars/user-001.jpg",
        role: "customer",
        is_active: true,
        created_at: "2024-03-01T00:00:00Z",
        last_login: "2024-06-15T08:30:00Z",
    },
    {
        id: "user-002",
        email: "tran.van.b@email.com",
        password_hash: "$2b$10$hashedpassword2",
        full_name: "Trần Văn B",
        phone: "0912345678",
        avatar_url: null,
        role: "customer",
        is_active: true,
        created_at: "2024-03-15T00:00:00Z",
        last_login: "2024-06-14T10:00:00Z",
    },
    {
        id: "user-003",
        email: "admin@cosmeticshop.vn",
        password_hash: "$2b$10$hashedpassword3",
        full_name: "Admin Shop",
        phone: "0909999999",
        avatar_url: null,
        role: "admin",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        last_login: "2024-06-16T09:00:00Z",
    },
];

const addresses = [
    {
        id: "addr-001",
        user_id: "user-001",
        label: "Nhà",
        full_name: "Nguyễn Thị A",
        phone: "0901234567",
        street: "123 Nguyễn Huệ",
        district: "Quận 1",
        city: "Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh",
        is_default: true,
    },
    {
        id: "addr-002",
        user_id: "user-001",
        label: "Công ty",
        full_name: "Nguyễn Thị A",
        phone: "0901234567",
        street: "456 Lê Lợi",
        district: "Quận 3",
        city: "Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh",
        is_default: false,
    },
    {
        id: "addr-003",
        user_id: "user-002",
        label: "Nhà",
        full_name: "Trần Văn B",
        phone: "0912345678",
        street: "78 Hoàn Kiếm",
        district: "Quận Hoàn Kiếm",
        city: "Hà Nội",
        province: "Hà Nội",
        is_default: true,
    },
];

// Lấy tất cả danh mục
app.get('/api/categories', (req, res) => {
    res.json(categories);
});

// Lấy tất cả sản phẩm kèm tên danh mục
app.get('/api/products', (req, res) => {
    const productsWithCategory = products.map(product => {
        const category = categories.find(cat => cat.id === product.category_id);
        return { ...product, category_name: category ? category.name : null };
    });
    res.json(productsWithCategory);
});

// Lấy một sản phẩm dựa vào slug kèm category và variants
app.get('/api/products/:slug', (req, res) => {
    const product = products.find(p => p.slug === req.params.slug);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const category = categories.find(cat => cat.id === product.category_id);
    const productVariants = variants.filter(v => v.product_id === product.id);
    res.json({ ...product, category_name: category ? category.name : null, variants: productVariants });
});

// Lấy sản phẩm liên quan dựa vào slug
app.get('/api/productsrelated/:slug', (req, res) => {
    const product = products.find(p => p.slug === req.params.slug);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const relatedProducts = products.filter(p => p.category_id === product.category_id && p.slug !== product.slug);
    res.json(relatedProducts);
});

// Middleware xác thực JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// API Đăng ký (Signup)
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: 'Username already exists' });
    }
    const newUser = { username, password };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
});

// API Đăng nhập (Login)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const accessToken = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});