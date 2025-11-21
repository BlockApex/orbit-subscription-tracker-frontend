import { Api } from "../config";
import { Bundle, ClaimPackagePayload, CreateBundleRequest, MyBundle, QuoteRequest, Subscription } from "../types/bundle.types";


export const getActiveServices = async () => {
    try {
        const response = await Api.get("/dvm/services/active");
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch services.");
    }
};



export const getQuote = async (
    packages: QuoteRequest["selectedPackages"]
) => {
    try {
        const response = await Api.post("/bundle/preview", {
            selectedPackages: packages,
        });
        return response.data;
    } catch (error) {
        throw error
    }
};



export const createBundle = async (data: CreateBundleRequest) => {
    try {
        const response = await Api.post("/bundle", data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create bundle.");
    }
};


export const getPresetBundles = async (): Promise<Bundle[]> => {
    try {
        const response = await Api.get("/bundle/preset");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch bundles:", error);
        throw new Error("Failed to fetch bundles.");
    }
};

export const getBundleById = async (id: string): Promise<Bundle> => {
    try {
        const response = await Api.get(`/bundle/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch bundle:", error);
        throw new Error("Failed to fetch bundle.");
    }
};


export const getSubscriptionById = async (id: string): Promise<Subscription> => {
    try {
        const response = await Api.get(`/subscription/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch subscription:", error);
        throw new Error("Failed to fetch subscription.");
    }
};



export const subscribeBundle = async (id: string) => {
    try {
        const response = await Api.post(`/subscription`, { bundleId: id });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to subscribe bundle.");
    }
};

export const prepareSubscription = async (id: string, intervals: number) => {
    try {
        const response = await Api.post(`/subscription/prepare`, { numberOfIntervals: intervals, bundleId: id });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const paymentBundle = async (id: string) => {
    try {
        const response = await Api.post(`/payment/begin-subscription`, { subscriptionId: id });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getMyBundles = async () => {
  try {
    // Fetch subscriptions only
    const subsRes = await Api.get('/subscription');

    // Force-cast to keep compatibility with existing MyBundle[] type
    const subscriptions =
      Array.isArray(subsRes.data)
        ? subsRes.data.map((s: Subscription) => ({
            ...s,
            isSubscription: true,
          }))
        : [];

    if (subscriptions.length === 0) {
      console.warn('No subscriptions found.');
      return [];
    }

    // ✅ Return type compatible with MyBundle[]
    return subscriptions as MyBundle[];
  } catch (error) {
    console.error('❌ Failed to fetch subscriptions:', error);
    return [] as MyBundle[];
  }
};


export const recentActiveBundles = async () => {
    try {
        const response = await Api.get("/subscription");
        // ✅ Ensure response.data is an array
        const data = Array.isArray(response.data) ? response.data : [];
        const  filtered = data.filter((s)=>s.status === 'active');
        // ✅ Return only up to 3 items
        const recentBundles =  filtered.length > 3 ? filtered.slice(0, 3) : filtered;

        return recentBundles;
    } catch (error) {
        console.error("❌ Failed to fetch bundles:", error);
        throw new Error("Failed to fetch bundles.");
    }
};






export const claimSubscription = async (id: string, data: ClaimPackagePayload) => {
    try {
        const response = await Api.post(`/subscription/${id}/claim`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const pauseSubscription = async (id: string) => {
    try {
        const response = await Api.patch(`/subscription/${id}/pause`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const resumeSubscription = async (id: string) => {
    try {
        const response = await Api.patch(`/subscription/${id}/resume`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const cancelSubscription = async (id: string) => {
    try {
        const response = await Api.patch(`/subscription/${id}/cancel`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}