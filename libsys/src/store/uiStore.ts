// src/store/uiStore.ts
// Zustand store — replaces UIContext
// No Provider needed — just import and use anywhere
import {create } from 'zustand';
//modal 
interface ModalState{
    title:  string,
    message:    string,
    onOk: ()=>void,
    onCancel: ()=>void,
    hideCancel:boolean
};

//Toast
interface ToastState{
    message:    string,
    duration: number
}
//Full store
interface UIStore{
    //loading
    loading:    boolean,
    showLoading:    ()=>void,
    hideLoading:    ()=>void,
    //Modal
    modal: ModalState|null,
    showModal:  (state:ModalState)=>void,
    hideModal:  ()=>void,
    //Toast
    toast: ToastState|null,
    showToast: (message:string,duration:number)=>void,
    hideToast: ()=>void
}
//the set function/callback,is from zustand , execute to notify the "subscribers" the context update.
//以下set那部分,直接從上而的UIStore定義copy下來改比較快,也較不會打錯字
export const useUIStore=create<UIStore>((set)=>({
    //loading
    loading:false,
    showLoading: ()=>set({loading:true}),
    hideLoading:()=>set({loading:false}),
    //modal
    modal: null,
    showModal:  (state)=>set({modal:state}),
    hideModal:  ()=>set({modal:null}),
    //toast
    toast: null,
    showToast: (message,duration=3000)=>set(
         { toast:{
            message,
            duration
         }}
    ),
    hideToast: ()=>set({toast:null})    
}));