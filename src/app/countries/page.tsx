"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import Input from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Spinner } from "@/components/common/Spinner";
import { getCountries, updateMyCountry } from "@/services/misc.service";
import toast from "react-hot-toast";

interface Country {
    _id: string;
    code: string;
    name: string;
    flag: string;
    dialCode?: string;
    createdAt?: string;
    updatedAt?: string;
}

const Countries: React.FC = () => {
    const router = useRouter();

    const [countries, setCountries] = useState<Country[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selectedCountryId, setSelectedCountryId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);

    // Filter countries based on search input
    const filteredCountries = countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true);
                const data: Country[] = await getCountries();
                setCountries(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message || "Failed to fetch countries");
                } else {
                    toast.error("Failed to fetch countries");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const handleSelectCountry = (id: string) => {
        setSelectedCountryId(id);
    };

    const handleContinue = async () => {
        if (!selectedCountryId) {
            toast.error("Please select a country first");
            return;
        }

        try {
            setSaving(true);
            await updateMyCountry(selectedCountryId);
            toast.success("Country updated successfully!");
            router.push("/sources");
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || "Failed to update country");
            } else {
                toast.error("Failed to update country");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="w-full min-h-screen bg-gray-50 relative overflow-hidden p-4">
            <div className="p-2">
                <h5 className="text-xl font-normal text-black">Country of Residence</h5>
                <p className="text-base text-foreground text-left mt-1">
                    We'll tailor payment connectors available in your region
                </p>

                <div className="w-full flex flex-col gap-4 mt-4">
                    <Input
                        label=""
                        value={search}
                        onChange={setSearch}
                        placeholder="Search countries..."
                        className="text-black"
                        icon={<Search className="text-dark" />}
                    />

                    <div className="w-full max-h-[600px] lg:max-h-[500px] overflow-y-scroll flex flex-col gap-4">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Spinner />
                            </div>
                        ) : filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => {
                                const selected = c._id === selectedCountryId;

                                return (
                                    <div
                                        key={c._id}
                                        className={`w-full flex items-center justify-between border border-gray-300 p-4 rounded-xl ${selected ? "bg-primary/30 border-primary" : ""
                                            }`}
                                        onClick={() => handleSelectCountry(c._id)}
                                    >
                                        <p className="flex items-center gap-2">
                                            {c.flag} <span className="ms-1">{c.name}</span>
                                        </p>
                                        {selected && (
                                            <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                <span className="w-2 h-2 bg-white rounded-full"></span>
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 py-4">No countries found</p>
                        )}
                    </div>
                </div>

                <div className="w-full z-50 lg:max-w-3xl mx-auto flex items-center justify-center gap-4 fixed bottom-2 left-0 right-0 p-2">
                    <Button
                        onClick={handleContinue}
                        variant="primary"
                        size="full"
                        className="flex items-center gap-4"
                        disabled={saving}
                        loading={saving}
                    >
                        Continue <ArrowRight size={17} />
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default Countries;
