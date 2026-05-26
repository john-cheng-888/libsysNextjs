'use client'
import {useUIStore} from '@/store/uiStore';
export default function LoadingOverLay(){
     const loading=useUIStore(state=>state.loading);
     /**
      * ↑上述的程式片段當然可以寫做const { loading, modal, toast } = useUIStore()
      * 但就失去用zustand的義意了--只關注想要的目標,其他的異動通知不需要知會我
      * 而「state」指的是Zustand來的異動通知,詳見以下說明
         What Zustand does internally ??:
        -------------------------------------------
        function useUIStore(selector?) {
            const state = getCurrentState()  // gets { loading, modal, toast... }
            if (selector) {
                return selector(state)         // calls YOUR function with state
                //     ↑
                //     selector = state => state.loading
                //     selector(state) = state.loading = false
            }
            return state                     // returns everything
        }
       -----------------------------------------------
      *另一個比較完整的說法是要用value (when in subscriber/getter)時,請用selector找出來
      *而如果是要function (when in publisher/setter)時,就不必要用selector 
      */
     if(!loading)return null;
     return (
        <div className="fixed inset-0 z-50
                        bg-black/50 backdrop-blur-sm
                        flex items-center justify-center">
        <div className="bg-white rounded-xl p-8
                        flex flex-col items-center gap-4
                        shadow-2xl">
            {/* Spinner */}
            <div className="w-12 h-12 border-4
                            border-teal-600 border-t-transparent
                            rounded-full animate-spin" />
            <p className="text-sm text-gray-600">
            Processing...
            </p>
        </div>
        </div>
     );
}