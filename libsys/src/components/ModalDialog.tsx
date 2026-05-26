// src/components/ModalDialog.tsx
// 萬用 Modal — replaces alert() / confirm()
// Supports HTML content — styled text, H1, colors etc.
// C# equivalent: showDialog(title, message, okCb, cancelCb, hideCancel)
'use client'
import {useUIStore} from '@/store/uiStore';
import {useEffect } from 'react';

export default function ModalDialog(){
    const modal=useUIStore(state=>state.modal);
    const hideModal=useUIStore(state=>state.hideModal);
    //Keydown event--Escape key to cancel
    useEffect(()=>{
        //--setup ----
        const handleKey=(e:KeyboardEvent)=>{
            if(e.key==='Escape' && modal){
                if(modal?.hideCancel)return;
                modal.onCancel?.();
                hideModal()
            }
        }
        document.addEventListener('keydown',handleKey);
        //below function runs when component unload/before effect runs again .must learn sure-kill skill!!
        return ()=>{
            document.removeEventListener('keydown',handleKey);
        }
        //↑常用於「用useEffect subscribe後,離開要執行unsubscribe」這類的資源控管情境
        //websocket、timer/interval、Event listener...其他被要求離開要關閉的應用
        //故請會使用這招,以後會常遇到!!

    },[modal,hideModal]);
    if(!modal) return null;
    const handleOk=()=>{
        modal.onOk();
        hideModal();
    }
    const handleCancel=()=>{
        //if hide cancel button,means user must click ok,
        //so we have to disable "click outside to close "feature if "modal.hideCancel===true".
        if(modal.hideCancel) return ;
        modal.onCancel?.();
        hideModal();
    }
    return (
        // ── Backdrop ─────────────────────────────────────────────────
        <div
        className="fixed inset-0 z-50
                    bg-black/50 backdrop-blur-sm
                    flex items-center justify-center
                    animate-in fade-in duration-200"
        onClick={handleCancel}   // click outside = cancel
        >
        {/* ── Modal Box ─────────────────────────────────────────── */}
        <div
            className="bg-white rounded-xl shadow-2xl
                    w-full max-w-md mx-4
                    animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}  // prevent backdrop click
        >
            {/* Title */}
            <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
                {modal.title}
            </h2>
            </div>

            {/* ── Content — supports HTML ───────────────────────────── */}
            {/* C# equivalent: @Html.Raw(message) */}
            {/* dangerouslySetInnerHTML safe here —                     */}
            {/* content comes from OUR own code, not user input         */}
            <div
            className="px-6 py-5 text-gray-700
                        prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: modal.message }}
            />

            {/* ── Buttons ───────────────────────────────────────────── */}
            <div className="px-6 py-4 border-t border-gray-200
                            flex justify-end gap-3">

            {/* Cancel — hidden when hideCancel = true */}
            {/* C#: hideCancelButton parameter          */}
            {!modal.hideCancel && (
                <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium
                            text-gray-700 bg-gray-100
                            rounded-lg hover:bg-gray-200
                            transition-colors"
                >
                Cancel
                </button>
            )}

            {/* OK */}
            <button
                onClick={handleOk}
                className="px-4 py-2 text-sm font-medium
                        text-white bg-teal-600
                        rounded-lg hover:bg-teal-700
                        transition-colors"
            >
                OK
            </button>

            </div>
        </div>
        </div>
    )    
}