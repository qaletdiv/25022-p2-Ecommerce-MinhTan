// {
//         "id": "ORD-MOPXTKHZ",
//         "date": "2026-05-03T15:40:47.495Z",
//         "items": [
//             {
//                 "productName": "Kem Dưỡng Ẩm Laneige Water Bank Blue Hyaluronic",
//                 "variantName": "50ml",
//                 "shade": null,
//                 "quantity": 12,
//                 "price": 890000,
//                 "image": "http://localhost:3000/images/skincare/z5474593515507_a0de5c22db8739157b43b02960591bca-25052024122828.jpg"
//             },
//             {
//                 "productName": "Serum Vitamin C Some By Mi Galactomyces Pure Vitamin C Glow",
//                 "variantName": "30ml",
//                 "shade": null,
//                 "quantity": 2,
//                 "price": 350000,
//                 "image": "http://localhost:3000/images/skincare/tinh-chat-lam-sang-da-vitamin-c-some-by-mi-30ml_2.jpg"
//             },
//             {
//                 "productName": "Toner Klairs Supple Preparation Unscented",
//                 "variantName": "180ml",
//                 "shade": null,
//                 "quantity": 1,
//                 "price": 420000,
//                 "image": "http://localhost:3000/images/skincare/nuoc-hoa-hong-khong-mui-klairs-supple-preparation-unscented-toner.jpg"
//             },
//             {
//                 "productName": "Kem Chống Nắng Anessa Perfect UV Sunscreen Skincare Milk",
//                 "variantName": "60ml",
//                 "shade": null,
//                 "quantity": 1,
//                 "price": 620000,
//                 "image": "http://localhost:3000/images/skincare/sua-chong-nang-anessa-perfect-uv-sunscreen-skincare-milk-60ml_3ee021ee589048ecbb5d8cf98ff2f202.jpg"
//             }
//         ],
//         "shippingInfo": {
//             "name": "Tan",
//             "phone": "0867052405",
//             "address": "HCM",
//             "note": ""
//         },
//         "paymentMethod": "vnpay",
//         "subtotal": 12420000,
//         "shipping": 0,
//         "total": 12420000,
//         "status": "Chờ xác nhận"
//     }

export interface Order {
    id: string;
    date: string;
    items: {
        productId: string;
        productName: string;
        variantName: string;
        shade: string | null;
        quantity: number;
        price: number;
        image: string;
    }[];
    shippingInfo: {
        name: string;
        phone: string;
        address: string;
        note: string;
    };
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    total: number;
    status: string;
}