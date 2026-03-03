import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { getCroppedImageBlob } from "../utils/cropImage";

export default function CropModal({ imageSrc, onClose }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels || isUploading) return;

        setIsUploading(true);

        try {
            const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);

            if (!blob) {
                toast.error("Failed to crop image");
                return;
            }

            await new Promise((resolve, reject) => {
                router.post(
                    "/profile/avatar",
                    { avatar: blob },
                    {
                        forceFormData: true,
                        preserveScroll: true,
                        onSuccess: () => {
                            router.reload({ only: ["avatar"] });
                            resolve();
                        },
                        onError: () => reject(),
                    }
                );
            });

            toast.success("Profile picture updated!");
            onClose();
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">

                <h2 className="text-lg font-semibold mb-4">
                    Crop Image
                </h2>

                <div className="relative w-full h-64 bg-gray-200">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                <div className="mt-4">
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className={`px-4 py-2 text-sm rounded-md transition ${isUploading
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-300 hover:bg-gray-400"
                            }`}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isUploading}
                        className={`px-4 py-2 text-sm text-white rounded-md transition ${isUploading
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {isUploading ? "Uploading..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}