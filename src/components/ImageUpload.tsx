import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import clsx from "clsx";

type ImageUploadProps = {
    value?: string; // URL or base64 for preview
    onChange?: (file: File | null, previewUrl: string | null) => void;
    size?: number;
    disabled?: boolean;
    className?: string;
};

export const ImageUpload = ({
    value,
    onChange,
    size = 120,
    disabled = false,
    className,
}: ImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(value || null);

    useEffect(() => {
        if (value) setPreview(value);
        return () => setPreview(null);
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreview(result);
            onChange?.(file, result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={clsx("flex items-center justify-center", className)}>
            <div className="relative">
                {preview ? (
                    <Image
                        src={preview}
                        alt="profile picture"
                        width={size}
                        height={size}
                        className="rounded-2xl border border-dashed border-foreground object-cover"
                    />
                ) : (
                    <button
                        className="w-[120px] h-[120px] rounded-2xl border border-dashed border-foreground object-cover"
                    />
                )}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={clsx(
                        "w-8 h-8 bg-dark rounded-xl flex items-center justify-center absolute bottom-0 right-0",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <Camera size={15} className="text-white" />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};
