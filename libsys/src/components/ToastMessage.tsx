// src/components/ToastMessage.tsx
// Auto-disappearing notification
// C# equivalent: toastMessage(msg, duration)
'use client'
import { useEffect } from "react";
import {useUIStore} from '@/store/uiStore'
export default function ToastMessage(){
    const toast=useUIStore(state=>state.toast);
    const hideToast=useUIStore(state=>state.hideToast);
    //auto hide store after duration
    useEffect(()=>{
        if(!toast)return;
         const timer=setTimeout(()=>{
                hideToast();
         },toast.duration);
         //don't forget to clear timer after this component unload,as we said in "ModalDialog.tsx"' useEffect
         return ()=>clearTimeout(timer);
    },
    [toast,hideToast]);
    if(!toast)return null;
    return(
        <div className="fixed bottom-6 left-1/2 z-50
                    -translate-x-1/2
                    bg-gray-800 text-white
                    px-6 py-3 rounded-full
                    shadow-xl text-sm font-medium
                    animate-in fade-in
                    slide-in-from-bottom-4
                    duration-300">
            {toast.message}
        </div>
    )
}