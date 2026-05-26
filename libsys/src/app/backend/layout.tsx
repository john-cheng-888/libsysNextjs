// src/app/backend/layout.tsx
import SideBar from "@/components/SideBar";
import ModalDialog from "@/components/ModalDialog";
import ToastMessage from "@/components/ToastMessage";
import LoadingOverLay from "@/components/LoadingOverLay";
import React from "react";
export default function BackendLayout(
    {children}:{children:React.ReactNode}
){
    return(
        <div className="flex h-screen overflow-hidden">
            {/*--side bar */}
            <SideBar />
            {/*Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50" >
                {children}
            </main>
            {/* ── Global UI Components ────────────────── */}
            {/* Mounted once — available to ALL pages     */}
            {/* C#: defined in _Layout.cshtml             */}            
            <LoadingOverLay />
            <ModalDialog />
            <ToastMessage />
        </div>
    );
}