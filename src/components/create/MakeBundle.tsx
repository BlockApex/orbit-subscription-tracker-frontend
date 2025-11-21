"use client";
import { Check, ChevronLeft, MoveRight, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Input from "../common/Input";
import Image from "next/image";
import { Button } from "../common/Button";
import TierModal from "./TierModal";
import { Package, QuoteRequest, Service } from "@/types/bundle.types";
import { getActiveServices, getQuote } from "@/services/bundle.service";
import { Spinner } from "../common/Spinner";
import { Bundle, useBundleStore } from "@/store/bundleStore";
import { categories } from "@/config";
import ExpandableText from "../common/ExpandableText";
import toast from "react-hot-toast";
import { AxiosError } from "axios";



interface MakeBundleProps {
    onClick: () => void;
}

const MakeBundle: React.FC<MakeBundleProps> = ({ onClick }) => {
    const router = useRouter();
    const { setBundle } = useBundleStore();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [tierOpen, setTierOpen] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedPackages, setSelectedPackages] = useState<Record<string, string>>({});
    const [_bundle, _setBundle] = useState<Bundle | null>(null);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const data = await getActiveServices();
                setServices(data || []);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const filteredServices = services.filter((s) => {
        const matchesSearch = s?.category.toLowerCase().includes(search?.toLowerCase()) || s.name?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
            category.label === "All" ||
            s.category?.toLowerCase() === category.label.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const getOffers = (pkg?: Package) => {
        if (!pkg?.offers) return { freeOffer: undefined, discountOffer: undefined };
        const freeOffer = pkg.offers.find((o) => o.type === "free");
        const discountOffer = pkg.offers.find((o) => o.type === "%discount");
        return { freeOffer, discountOffer };
    };

    useEffect(() => {
        const fetchQuote = async () => {
            if (Object.keys(selectedPackages).length === 0) {
                _setBundle(null);
                return;
            }


            const packagesPayload: QuoteRequest["selectedPackages"] = Object.entries(selectedPackages).map(
                ([service, _package]) => ({ service, package: _package })
            );
            setFetching(true);
            try {
                const result = await getQuote(packagesPayload);
                console.log(result)
                _setBundle(result);
                setFetching(false);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    setSelectedPackages(prev => {
                        const keys = Object.keys(prev);
                        if (keys.length === 0) return prev; // nothing to remove

                        const lastKey = keys[keys.length - 1];
                        const updated = { ...prev };
                        delete updated[lastKey];
                        return updated;
                    });

                    toast.error(error.response?.data?.message || "Something went wrong");
                    return;
                }
                toast.error((error as Error)?.message || "Something went wrong");
                setFetching(false);
            }
        };

        fetchQuote();
    }, [selectedPackages]);

    const handleSelectPackage = (serviceId: string, packageId: string) => {
        setSelectedPackages((prev) => ({ ...prev, [serviceId]: packageId }));
        setTierOpen(false);
    };

    const handleAddClick = (service: Service) => {
        if (selectedPackages[service._id]) {
            // ❌ Remove package and trigger re-quote automatically via useEffect
            setSelectedPackages((prev) => {
                const updated = { ...prev };
                delete updated[service._id];
                return updated;
            });
        } else {
            setSelectedService(service);
            setTierOpen(true);
        }
    };


    const handleNavigateReview = () => {
        setBundle(_bundle!);
        router.push('/review');
    }

    return (
        <div className="w-full h-auto relative">
            {/* Header */}
            <section className="w-full bg-dark rounded-b-xl px-4">
                <br />
                <div className="flex items-center justify-start gap-2">
                    <button
                        onClick={onClick}
                        className="w-10 h-10 rounded-full bg-dark-50 flex items-center justify-center hover:bg-primary-100 transition"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                    <h5 className="text-xl font-normal text-white">
                        Build your first Bundle
                    </h5>
                </div>

                <div className="w-full mt-6 pb-4">
                    <Input
                        label=""
                        value={search}
                        onChange={setSearch}
                        placeholder="Search subscriptions..."
                        className="text-white"
                        icon={<Search className="text-white" />}
                    />

                    <div className="w-full flex gap-3 items-center overflow-x-auto hide-scrollbar mt-4">
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setCategory(c)}
                                className={`whitespace-nowrap px-4 py-2 rounded-xl border transition-all ${category.id === c.id
                                    ? "bg-primary/60 border-primary text-black"
                                    : "border-white text-white hover:bg-primary/20"
                                    }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="w-full h-[600px] overflow-scroll pb-16 lg:pb-20 relative flex flex-col gap-3 p-4">
                {loading ? (
                    <div className="p-4 flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : filteredServices.length === 0 ? (
                    <p className="text-center text-gray-500">No services found.</p>
                ) : (
                    filteredServices.map((service) => {
                        const hasMultiplePackages = service.packages?.length > 1;
                        const pkg = service.packages?.[0];
                        const { freeOffer, discountOffer } = getOffers(pkg);

                        return (
                            <div
                                key={service._id}
                                className="w-full relative border border-gray-300 px-3 py-4 rounded-xl"
                            >
                                <div className="w-full h-full flex items-start justify-between gap-4">
                                    <Image
                                        src={service.logo}
                                        alt={service.name}
                                        width={50}
                                        height={50}
                                        className="rounded-lg"
                                    />

                                    <div className="w-full">
                                        <h6 className="text-md font-normal text-black">
                                            {service.name}
                                        </h6>
                                        <ExpandableText text={service.description} charLimit={120} />


                                        <div className="flex items-center justify-start gap-2 my-2 flex-wrap">
                                            {service.category && (
                                                <span className="px-3 py-1 text-foreground text-sm bg-gray-200 rounded-lg capitalize">
                                                    {service.category}
                                                </span>
                                            )}

                                            {/* Only show offers if there’s one package */}
                                            {!hasMultiplePackages && (
                                                <>
                                                    {discountOffer && (
                                                        <span className="px-3 py-1 text-primary text-xs bg-primary/20 rounded-lg">
                                                            {discountOffer.amount}% off
                                                        </span>
                                                    )}
                                                    {freeOffer && (
                                                        <span className="px-3 py-1 text-green-600 text-xs bg-green-100 rounded-lg">
                                                            {freeOffer.period} Free Trial
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Show pricing only if single package */}
                                        {!hasMultiplePackages && pkg && (
                                            <div className="flex items-center justify-start gap-2">
                                                <p className="text-base font-normal text-black">
                                                    ${pkg.amount.toFixed(2)}/{pkg.frequency}
                                                </p>
                                                <p className="text-sm text-foreground">• {pkg.name}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-h-full">
                                        {/* <button className="text-foreground absolute top-4 right-4">
                                            <ChevronRight size={20} />
                                        </button> */}
                                        <button
                                            onClick={() => handleAddClick(service)}
                                            className={`p-1 ${selectedPackages[service._id] ? 'bg-primary' : 'bg-dark'} rounded-md absolute bottom-4 right-4`}
                                        >
                                            {selectedPackages[service._id] ? (
                                                <Check size={15} className="text-white" />
                                            ) : (
                                                <Plus size={15} className="text-white" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {/* Checkout Section */}
            <section className="w-full z-50 lg:max-w-3xl mx-auto flex items-center justify-center fixed bottom-0 left-0 right-0 p-2">
                <div className="w-full max-w-[100%] bg-dark p-2 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 p-4">
                        <div className="flex items-center">
                            {_bundle && _bundle !== null && _bundle.packages.map((p, i: number) => {
                                return (
                                    <Image
                                        key={i}
                                        src={p.service.logo}
                                        alt="Subscription"
                                        width={20}
                                        height={20}
                                        className="rounded-full"
                                    />
                                )
                            })}
                        </div>
                        {_bundle && (
                            <p className="text-sm lg:text-base text-white font-normal hidden lg:flex">
                                {_bundle?.packages?.length} services
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-4 p-4">
                        {_bundle ? (
                            <div className="flex items-center gap-2">
                                <p className="text-white font-normal text-sm line-through lg:text-base">
                                    {_bundle.totalOriginalPrice.toFixed(1)}
                                </p>
                                <p className="text-white font-normal text-sm lg:text-base">
                                    {_bundle?.totalFirstDiscountedPrice?.toFixed(2)}/{_bundle.frequency}
                                </p>
                            </div>
                        ) : ''}
                        <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={!_bundle || fetching}
                            onClick={handleNavigateReview}

                        >
                            Review <MoveRight size={18} />
                        </Button>
                    </div>
                </div>
            </section>

            <TierModal
                open={tierOpen}
                setOpen={setTierOpen}
                service={selectedService}
                onSelectPackage={handleSelectPackage}

            />
        </div>
    );
};

export default MakeBundle;
