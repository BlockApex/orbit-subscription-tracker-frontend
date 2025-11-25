import { Api } from "../config";


export const getCountries = async () => {
    try {
        const response = await Api.get("/countries");
        return response.data;
    } catch (error) {
        throw error
    }
};



export const updateMyCountry = async (id: string) => {
    try {
        const response = await Api.patch(`/users/me/country`, { country: id });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getMerchants = async () => {
    try {
        const response = await Api.get(`/merchants`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const searchMerchant = async (q: string) => {
    try {
        const response = await Api.get(`/merchants/search?query=${q}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getCategories = async () => {
    try {
        const response = await Api.get(`/categories`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMyPaymentMethods = async () => {
    try {
        const response = await Api.get(`/payment-methods/me`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPaymentRails = async () => {
    try {
        const response = await Api.get(`/payment-rails`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const createPaymentRail = async (data: { paymentRail: string, name: string }) => {
    try {
        const response = await Api.post(`/payment-methods/me`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const updatePaymentMethod = async (id: string, data: { paymentRail: string, name: string }) => {
    try {
        const response = await Api.patch(`/payment-methods/me/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const deletePaymentMethod = async (id: string) => {
    try {
        const response = await Api.delete(`/payment-methods/me/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


