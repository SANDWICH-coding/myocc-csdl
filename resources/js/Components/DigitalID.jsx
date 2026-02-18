import { QRCodeCanvas } from 'qrcode.react';

export default function DigitalID({
    userIdNo = 'DRAFT-ID-0000',
}) {
    return (
        <div className="w-full flex justify-center px-2 sm:px-0">
            <div className="
                relative w-full max-w-md
                rounded-3xl overflow-hidden shadow-2xl
                bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9]
                text-white
                p-5 sm:p-6 md:p-8
                transition-all duration-300
            ">

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md"></div>

                <div className="relative z-10 flex flex-col h-full">

                    {/* TOP SECTION */}
                    <div className="flex items-center justify-between gap-3">

                        <div className="min-w-0">
                            <h1 className="
            text-[11px] sm:text-sm md:text-base
            font-semibold tracking-wide uppercase
            whitespace-nowrap overflow-hidden text-ellipsis
        ">
                                OPOL COMMUNITY COLLEGE
                            </h1>

                            <p className="
            text-[10px] sm:text-xs text-gray-200
            whitespace-nowrap overflow-hidden text-ellipsis
        ">
                                Center for Student Development and Leadership
                            </p>
                        </div>

                        <img
                            src="/assets/images/csdl-logo.jpg"
                            alt="CSDL Logo"
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 
                   rounded-full border border-white/40 shadow-md"
                        />
                    </div>


                    {/* CENTER SECTION */}
                    <div className="flex flex-col items-center justify-center flex-grow mt-6 mb-6">

                        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-xl">
                            <QRCodeCanvas
                                value={userIdNo}
                                size={window.innerWidth < 400 ? 130 : 150}
                                bgColor="#ffffff"
                                fgColor="#0f172a"
                                level="H"
                            />
                        </div>
                    </div>

                    {/* BOTTOM SECTION */}
                    <div className="text-center">
                        <div className="font-mono text-lg sm:text-xl md:text-2xl tracking-widest font-semibold mt-1 break-all">
                            {userIdNo}
                        </div>
                    </div>

                </div>

                {/* Decorative Glow */}
                <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
