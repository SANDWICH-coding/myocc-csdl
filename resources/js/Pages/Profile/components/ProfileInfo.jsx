import InfoRow from "./InfoRow";
import { Mail, Phone, Calendar, MapPin, VenusAndMars } from "lucide-react";

export default function ProfileInfo({ user, studentData, userInfoData }) {
    const data =
        user?.user_role === "student" ? studentData : userInfoData;

    if (!data) return null;

    return (
        <>
            <div className="bg-white rounded-lg border p-5 space-y-4">
                <InfoRow icon={<VenusAndMars size={18} />} label="Gender" value={data.gender || "-"} />
                <InfoRow icon={<Calendar size={18} />} label="Birthday" value={data.birthday || "-"} />
            </div>

            <div className="bg-white rounded-lg border p-5 space-y-4">
                <InfoRow icon={<Mail size={18} />} label="Email" value={data.email_address || "-"} />
                <InfoRow icon={<Phone size={18} />} label="Contact" value={data.contact_number || "-"} />
                <InfoRow
                    icon={<MapPin size={18} />}
                    label="Address"
                    value={`${data.present_address || ""} ${data.zip_code || ""}`.trim() || "-"}
                />
            </div>
        </>
    );
}