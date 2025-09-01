export interface Department {
    id: number;
    name: string;
}

export interface User {
    id: string;
    name: string;
    role?: string;
    departmentId?: number;
}

export interface FoodItem {
    id: number;
    name: string;
    price: number;
    supplierId?: string;
}

export interface OrderItem {
    foodItemId: number;
    userId: string;
    quantity: number;
}

