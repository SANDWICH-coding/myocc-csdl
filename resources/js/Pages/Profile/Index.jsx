import {
    UserIcon,
    Mail,
    Phone,
    Calendar,
    MapPin,
    LogOut,
    VenusAndMars,
} from "lucide-react";
import AppLayout from "../../Layouts/AppLayout";
import { router } from "@inertiajs/react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from 'axios';
import Cropper from "react-easy-crop";

export default function Index({ auth, studentData, userInfoData, avatar }) {
    const user = auth?.user;

    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);

    const [isUploading, setIsUploading] = useState(false);

    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleLogout = () => {
        router.post("/logout");
    };

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    // Password form states
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.setAttribute("crossOrigin", "anonymous");
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        const size = 400;
        const scale = window.devicePixelRatio || 1;

        canvas.width = size * scale;
        canvas.height = size * scale;

        ctx.scale(scale, scale);

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            size,
            size
        );

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => resolve(blob),
                "image/jpeg",
                0.9
            );
        });
    };

    const handleCropSave = async () => {
        if (!croppedAreaPixels || isUploading) return;

        setIsUploading(true);

        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedBlob) return;

            await new Promise((resolve, reject) => {
                router.post("/profile/avatar", { avatar: croppedBlob }, {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowCropModal(false);
                        setImageSrc(null);
                        setCrop({ x: 0, y: 0 });
                        setZoom(1);
                        setCroppedAreaPixels(null);
                        router.reload({ only: ['avatar'] });
                        resolve();
                    },
                    onError: () => reject(),
                });
            });

            toast.success("Profile picture updated!");
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const isPasswordMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;


    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoadingPassword(true);

        try {
            const res = await axios.post('/profile/change-password', {
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            toast.success(res.data.message);
            setNewPassword('');
            setConfirmPassword('');

        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                if (errors.new_password) {
                    toast.error(errors.new_password[0]);
                }
            } else {
                toast.error("Failed to change password");
            }
        } finally {
            setLoadingPassword(false);
        }
    };


    return (
        <AppLayout user={user} breadcrumbs={["Profile"]}>
            <div className="bg-gray-100 pb-6 sm:pt-0 pt-8">

                {/* Profile Content */}
                <div className="px-4 max-w-md mx-auto">

                    {/* Profile Header */}
                    <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="relative group w-32 h-32 sm:w-32 sm:h-32 md:w-40 md:h-40 shadow-md">

                            <div
                                onClick={handleAvatarClick}
                                className="cursor-pointer w-full h-full border-4 border-gray-300 overflow-hidden shadow-sm relative"
                            >
                                {avatar ? (
                                    <img src={avatar} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <UserIcon className="w-24 h-24 text-gray-500" />
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                    <span className="text-white text-sm font-medium">
                                        Change
                                    </span>
                                </div>
                            </div>

                            {/* Hidden Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div className="flex flex-col justify-center">
                            <h2 className="text-2xl font-bold">
                                {studentData?.last_name || userInfoData?.first_name}
                            </h2>
                            <p className="text-gray-800 font-bold text-md">
                                {studentData?.first_name || userInfoData?.middle_name} {studentData?.middle_name || userInfoData?.last_name}
                            </p>
                            <div className="flex items-center text-sm border-t space-x-2 text-gray-500 mt-1">
                                <span className="pt-1">User ID: {user?.user_id_no}</span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Info for non-students */}
                    {user?.user_role !== "student" && userInfoData && (
                        <>
                            <div className="mt-6 bg-white rounded-lg shadow-xs border p-5 space-y-4">
                                <InfoRow
                                    icon={<VenusAndMars size={18} />}
                                    label="Gender"
                                    value={userInfoData.gender || '-'}
                                />
                                <InfoRow
                                    icon={<Calendar size={18} />}
                                    label="Birthday"
                                    value={userInfoData.birthday || '-'}
                                />
                            </div>

                            <div className="mt-6 bg-white rounded-lg shadow-xs border p-5 space-y-4">
                                <InfoRow
                                    icon={<Mail size={18} />}
                                    label="Email"
                                    value={userInfoData.email_address || '-'}
                                />
                                <InfoRow
                                    icon={<Phone size={18} />}
                                    label="Contact"
                                    value={userInfoData.contact_number || '-'}
                                />
                                <InfoRow
                                    icon={<MapPin size={18} />}
                                    label="Address"
                                    value={`${userInfoData.present_address || ''} ${userInfoData.zip_code || ''}`.trim() || '-'}
                                />
                            </div>
                        </>
                    )}


                    {/* Profile Info */}
                    {user?.user_role === "student" && studentData && (
                        <>
                            <div className="mt-6 bg-white rounded-lg shadow-xs border p-5 space-y-4">
                                <InfoRow
                                    icon={<VenusAndMars size={18} />}
                                    label="Gender"
                                    value={studentData.gender}
                                />
                                <InfoRow
                                    icon={<Calendar size={18} />}
                                    label="Birthday"
                                    value={studentData.birthday}
                                />
                            </div>

                            <div className="mt-6 bg-white rounded-lg shadow-xs border p-5 space-y-4">
                                <InfoRow
                                    icon={<Mail size={18} />}
                                    label="Email"
                                    value={studentData.email_address}
                                />
                                <InfoRow
                                    icon={<Phone size={18} />}
                                    label="Contact"
                                    value={studentData.contact_number}
                                />
                                <InfoRow
                                    icon={<MapPin size={18} />}
                                    label="Address"
                                    value={`${studentData.present_address} ${studentData.zip_code}`}
                                />
                            </div>
                        </>
                    )}

                    <div className="mt-6 bg-white rounded-lg shadow-xs border overflow-hidden">
                        {/* Header (Clickable) */}
                        <button
                            type="button"
                            onClick={() => setShowChangePassword((prev) => !prev)}
                            className="w-full flex justify-between items-center p-5 text-left"
                        >
                            <h6 className="font-semibold text-sm text-gray-700">
                                Change Password
                            </h6>

                            <span
                                className={`text-gray-500 transform transition-transform duration-200 ${showChangePassword ? "rotate-180" : ""
                                    }`}
                            >
                                ▼
                            </span>
                        </button>

                        {/* Collapsible Content */}
                        <div
                            className={`transition-all duration-300 ease-in-out ${showChangePassword ? "max-h-[500px] opacity-100 p-5 pt-0" : "max-h-0 opacity-0"
                                } overflow-hidden`}
                        >
                            <form onSubmit={handleChangePassword} className="space-y-3 mt-2">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border text-sm border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border text-sm border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={loadingPassword || isPasswordMismatch}
                                    className={`
                    text-sm
                    w-full
                    bg-indigo-600
                    text-white
                    py-2
                    rounded-md
                    shadow-md
                    hover:bg-indigo-700
                    active:scale-95
                    transition
                    duration-150
                    ${loadingPassword || isPasswordMismatch ? "opacity-50 cursor-not-allowed" : ""}
                `}
                                >
                                    {loadingPassword ? "Changing..." : "Submit"}
                                </button>

                                {isPasswordMismatch && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Passwords do not match
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>


                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md shadow-md transition active:scale-95"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {showCropModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">

                        <h1 className="text-lg font-semibold text-gray-800 mb-4">Crop Image</h1>

                        <div className="relative w-full h-64 bg-gray-200">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} //
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
                                onChange={(e) => setZoom(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    if (isUploading) return;
                                    setShowCropModal(false);
                                    setImageSrc(null);
                                }}
                                disabled={isUploading}
                                className={`
            px-4 py-2 text-sm rounded-md transition
            ${isUploading
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-300 hover:bg-gray-400"}
        `}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCropSave}
                                disabled={isUploading}
                                className={`
            px-4 py-2 text-sm text-white rounded-md shadow-md transition
            ${isUploading
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700"}
        `}
                            >
                                {isUploading ? "Uploading..." : "Save"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </AppLayout>
    );
}

/* Reusable Info Row Component */
function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-indigo-500 mt-1">{icon}</div>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-700">{value}</p>
            </div>
        </div>
    );
}
