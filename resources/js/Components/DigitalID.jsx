import { QRCodeCanvas } from 'qrcode.react';

export default function DigitalID({
    userIdNo = 'DRAFT-ID-0000',
    name = 'Student Name',
    profilePhoto = null,
}) {
    return (
        <div className="max-w-sm mx-auto border rounded-lg p-4 shadow-sm bg-white space-y-6">

            {/* Header */}
            <div className="text-center">
                <div className="text-sm fw-semibold text-gray-700">
                    QR Code
                </div>
            </div>

            {/* Profile + QR */}
            <div className="flex items-center justify-center gap-4">

                {/* QR Code */}
                <QRCodeCanvas
                    value={userIdNo}
                    size={150}
                    bgColor="#ffffff"
                    fgColor="#023473"
                    level="H"
                />
            </div>

            {/* User ID No */}
            <div className="text-center border-t pt-2">
                <div className="text-xs text-gray-500">
                    ID No.
                </div>
                <div className="font-mono text-md font-bold text-gray-700">
                    {userIdNo}
                </div>
            </div>


        </div>
    );
}
