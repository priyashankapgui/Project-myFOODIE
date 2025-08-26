// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId: string;
}

export interface AuthData {
  token: string;
    user: {
    id: string;
    email: string;
    name: string;
    role: string;
    roleId: string;
  };
}


//Normal Employees
export interface NormalEmployee  {
  id: string;
  userId: string;
  departmentId: number;
  position: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
  department: {
    name: string;  
  };
}


// Department Types
export interface DepartmentAttributes {
  id: string;
  name: string;
  totalemp: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Feedback Types
export interface FeedbackAttributes {
  id?: number;
  userId: string;
  supplierId: string;
  comment?: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Food Item Types
export interface FoodItemAttributes {
  id?: number;
  name: string;
  description?: string;
  supplierId: string;
  price: number;
  employeeprice: number;
  hospitalprice: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Management Employee Types
export interface MgmtEmployeeAttributes {
  id?: string;
  userId: string;
  position: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Normal Employee Types
export interface NormalEmployeeAttributes {
  id?: string;
  userId: string;
  departmentId: number;
  position: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Order Types
export interface OrderAttributes {
  id?: string;
  collectedByUserId: string;
  orderCreatorUserId: string;
  orderDate: Date;
  departmentId: number;
  totalRequestOrderItems: number;
  totalPreparedOrderItems: number;
  totalOrderPrice: number;
  totalOrderEmployeePrice: number;
  totalOrderHospitalPrice: number;
  status: string;
  mealType: string;
  toBePaidHospitalPrice?: number;
  toBePaidEmployeePrice?: number;
  toBePaidTotalPrice?: number;
  supplierId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderTotals {
  totalRequestOrderItems: number;
  totalOrderPrice: number;
  totalOrderEmployeePrice: number;
  totalOrderHospitalPrice: number;
}

export interface OrderItemTotals {
  tobePaidPrice: number;
  tobePaidEmployeePrice: number;
  tobePaidHospitalPrice: number;
}

// Order Item Types
export interface OrderItemAttributes {
  id?: number;
  orderId: string;
  foodItemId: number;
  userId: string;
  quantity: number;
  receivedNumberOfItem?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Supplier Types (if needed)
export interface SupplierAttributes {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Generic Response Types
export interface MetaData {
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  [key: string]: unknown;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// HTTP Response Types
export interface HttpResponse<T> {
  code: number;
  statusText: string;
  ok: boolean;
  data: T;
  meta?: MetaData;
  success: boolean;
  statusCode: number;
  searchResultFound?: boolean;
  message: string;
  timestamp?: Date;
}

// Specific Response Data Types
export interface LoginResponseData {
  token: string;
  user: User;
}

export interface DepartmentResponseData {
  department: DepartmentAttributes;
  departments?: DepartmentAttributes[];
}

export interface FoodItemResponseData {
  foodItem: FoodItemAttributes;
  foodItems?: FoodItemAttributes[];
}

export interface OrderResponseData {
  order: OrderAttributes;
  orders?: OrderAttributes[];
  totals?: OrderTotals;
}

export interface OrderItemResponseData {
  orderItem: OrderItemAttributes;
  orderItems?: OrderItemAttributes[];
  itemTotals?: OrderItemTotals;
}

export interface EmployeeResponseData {
  employee: MgmtEmployeeAttributes | NormalEmployeeAttributes;
  employees?: (MgmtEmployeeAttributes | NormalEmployeeAttributes)[];
}

export interface FeedbackResponseData {
  feedback: FeedbackAttributes;
  feedbacks?: FeedbackAttributes[];
}

// Specific Response Types
export type LoginResponseType = HttpResponse<LoginResponseData>;
export type DepartmentResponseType = HttpResponse<DepartmentResponseData>;
export type FoodItemResponseType = HttpResponse<FoodItemResponseData>;
export type OrderResponseType = HttpResponse<OrderResponseData>;
export type OrderItemResponseType = HttpResponse<OrderItemResponseData>;
export type EmployeeResponseType = HttpResponse<EmployeeResponseData>;
export type FeedbackResponseType = HttpResponse<FeedbackResponseData>;

// Generic List Response Type
export interface ListResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API Request Types
export interface LoginCredentials {
  employeeId: string;
  password: string;
}

export interface PasswordChangeData {
  employeeId: string;
  currentPassword: string;
  newPassword: string;
}

export interface CreateOrderData {
  collectedByUserId: string;
  orderCreatorUserId: string;
  departmentId: number;
  mealType: string;
  orderItems: Array<{
    foodItemId: number;
    quantity: number;
    userId: string;
  }>;
}

export interface UpdateOrderStatusData {
  status: string;
  receivedItems?: Array<{
    orderItemId: number;
    receivedQuantity: number;
  }>;
}

// Filter Types
export interface FoodItemFilters {
  category?: string;
  available?: boolean;
  supplierId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface OrderFilters {
  status?: string;
  mealType?: string;
  departmentId?: number;
  startDate?: Date;
  endDate?: Date;
  supplierId?: string;
}