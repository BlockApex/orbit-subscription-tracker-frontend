// types/service.ts
export interface Offer {
    type: string; // "%discount" | "free"
    amount: number;
    period: string;
    termsAndConditions: string;
}

export interface Package {
    _id: string;
    name: string;
    description: string;
    amount: number;
    frequency: string;
    offers: Offer[];
    isActive: boolean;
    requiredFormFields?: { fieldName: string, fieldType: string, optional: boolean }[]

}


export interface ClaimedPackage {
    _id: string;
    service: string;
    package: Package;
    providedFormFields: {
        fieldName: string;
        fieldValue: string;
    }[];
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    claimInstructions?: string;
}


export interface Service {
    _id: string;
    name: string;
    logo: string;
    description: string;
    category: string;
    packages: Package[];
    isActive: boolean;
}


export interface QuoteRequest {
    selectedPackages: {
        service: string;
        package: string;
    }[];
}

export interface QuoteResponse {
    totalPrice: number;
    totalDiscount: number;
    bundleItems: {
        serviceId: string;
        packageId: string;
        price: number;
        discount: number;
    }[];
}


export interface SelectedPackage {
    service: string;
    package: string;
}




export interface CreateBundleRequest {
    name: string;
    description: string;
    color: string;
    selectedPackages: SelectedPackage[];
}



export interface BundleService {
    _id: string;
    name: string;
    logo: string;
}

export interface BundleItem {
    service: {
        _id: string;
        name: string;
        description?: string;
        logo: string;
        category: string;
    };
    package: Package;
    applicableOffers: Offer[]
}

export interface Bundle {
    _id: string;
    name: string;
    description: string;
    color: string;
    totalFirstDiscountedPrice: number;
    totalOriginalPrice: number;
    selectedPackages: BundleItem[];
    frequency: string;
}




export interface Subscription {
    _id: string;
    bundle: Bundle;
    user: string;
    __v: number;
    createdAt: string;
    invoices: Invoice[];
    nextPaymentDate: string;
    status: "active" | "inactive" | "pending" | 'paused' | 'intended' | 'grace-period' | 'cancelled' | 'suspended';
    subscribeDate: string;
    updatedAt: string;
    tx: string;
    claimedPackages?: ClaimedPackage[]
    isSubscription?: boolean;
}



export interface Invoice {
    date: string;
    status: "paid" | "unpaid" | "failed";
    amount: number;
    paymentHistory: PaymentHistory[];
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentHistory {
    time: string;
    status: "success" | "failed" | "pending";
    txHash: string;
}



export type MyBundle =
    | Bundle
    | (Subscription & { isSubscription: true, status: string });


export interface ClaimPackagePayload {
    subscription: string;
    service: string;
    package: string;
    providedFormFields: {
        fieldName: string;
        fieldValue: string;
    }[];
}




export interface UserStats {
    activeSubscriptionsCount: number;
    totalMonthlySavings: number;
    totalMonthlySpending: number;
    lastPaymentDate: string | null;
    paymentsDueNext30Days: number;
}




export interface DiscoverFilterType {
    category: { id: number; label: string };
    perk: { id: number; label: string }| null;
    discount: number;
    min: string;
    max: string;
}
