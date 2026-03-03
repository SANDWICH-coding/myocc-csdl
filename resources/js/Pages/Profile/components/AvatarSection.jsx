import { useRef, useState } from "react";
import { UserIcon } from "lucide-react";
import CropModal from "./CropModal";

export default function AvatarSection({ avatar }) {
    const fileInputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <>
            <div className="relative group w-40 h-40 mx-auto shadow-md">
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="cursor-pointer w-full h-full border-4 border-gray-300 overflow-hidden"
                >
                    {avatar ? (
                        <img
                            src={avatar}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="w-24 h-24 text-gray-500" />
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {imageSrc && (
                <CropModal imageSrc={imageSrc} onClose={() => setImageSrc(null)} />
            )}
        </>
    );
}