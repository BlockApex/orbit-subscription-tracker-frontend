import { Api } from "../config";

export const getVerificationMessage = async () => {
    try {
        const response = await Api.get("/user/verification-message");
        if (!response?.data) throw new Error("Empty response from server.");
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch verification message.");
    }
};

export const login = async (walletAddress: string, signature: string) => {
    try {
        const response = await Api.post("/user/login", { walletAddress, signature });
        if (!response?.data) throw new Error("Empty response from server.");
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch verification message.");
    }
}


export const getUserActivity = async () => {
    try {
        const response = await Api.get("/user/activity");
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch activity.");
    }
};


export const getUserStats = async () => {
    try {
        const response = await Api.get("/user/profile-stats");
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch stats.");
    }
};


export const getUserProfile = async () => {
    try {
        const response = await Api.get("/user/kyc-info");
        return response.data;
    } catch (error) {
        throw error
    }
};



export const uploadImage = async (image: File) => {
    try {
        const formData = new FormData();
        formData.append("file", image);

        const response = await Api.post("/user/upload-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};



export const updateProfile = async (info: { name: string, email: string, profileImage?: string, country: string }) => {
    const data = {
        kycInfo: { ...info }
    }
    try {
        const response = await Api.put("/user/kyc-info", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const waitlist = async (email: string) => {
    const data = {
        email
    }
    try {
        const response = await Api.post("/waitlist", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}