"use client";
import { Api } from "@/app/config";
import { useAuthStore } from "@/app/store/authStore";
import { useEffect } from "react";

const AppRefresh = () => {
    const { setAuthenticated } = useAuthStore();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthenticated(true);
            Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, []);
    return null; // we don't need to render anything
};

export default AppRefresh;
