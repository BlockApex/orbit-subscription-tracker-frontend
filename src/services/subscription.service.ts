import { Subscription } from "@/app/import-subscriptions/manual/page";
import { Api } from "../config";




export type CreateSubscriptionPayload = Omit<Subscription, "merchant"> & {
    merchant: string | {
        name: string;
        logo?: string;
        website?: string;
        custom?: boolean;
    };
};

export const createSubscription = async (data: CreateSubscriptionPayload) => {
    try {
        const response = await Api.post("/subscriptions/me", data);
        return response.data;
    } catch (error) {
        throw error
    }
};

export const updateSubscription = async (id: string, data: CreateSubscriptionPayload) => {
    try {
        const response = await Api.patch(`/subscriptions/me/${id}`, data);
        return response.data;
    } catch (error) {
        throw error
    }
};


export const deleteSubscription = async (id: string) => {
    try {
        const response = await Api.delete(`/subscriptions/me/${id}`);
        return response.data;
    } catch (error) {
        throw error
    }
};



export const getMySubscriptions = async () => {
    try {
        const response = await Api.get(`/subscriptions/me`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getSubscriptionById = async (id: string) => {
    try {
        const response = await Api.get(`/subscriptions/me/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const renewSubscription = async (id: string) => {
    try {
        const response = await Api.patch(`/subscriptions/me/${id}/mark-renewed`);
        return response.data;
    } catch (error) {
        throw error
    }
};


export const activeSubscription = async (id: string) => {
    try {
        const response = await Api.patch(`/subscriptions/me/${id}/mark-active`);
        return response.data;
    } catch (error) {
        throw error
    }
};

export const cancelSubscription = async (id: string) => {
    try {
        const response = await Api.patch(`/subscriptions/me/${id}/mark-cancelled`);
        return response.data;
    } catch (error) {
        throw error
    }
};

export const deleteMySubscription = async (id: string) => {
    try {
        const response = await Api.delete(`/subscriptions/me/${id}`);
        return response.data;
    } catch (error) {
        throw error
    }
};