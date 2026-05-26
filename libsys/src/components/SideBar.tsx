// src/components/Sidebar.tsx
// C# equivalent: _Layout.cshtml sidebar section
// Accordion menu — Book / Setting / logout
// Color: #1282A2 (Glacial Blue Ice — same as original)
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

//import { useRouter} from  'next/router'
//平平是useRouter,別用錯了,「next/navigation」是Next.js 12版的
//而next/navigation才是Next.js 13+,別被auto complete帶錯了
import { useRouter } from 'next/navigation';

import { useState } from 'react';   
import { useUIStore } from '@/store/uiStore';   
import MENU from '@/lib/menuConfig'
//Menu structure (see _Layout.cshtml)
const SystemMenu=MENU;

export default function SideBar(){
    const pathName=usePathname();
    const router=useRouter();
    const showModal=useUIStore(state=>state.showModal);//for 「logout」need
    //重點來了,你如何就目前的url展開menu?
    const getDefaultOpen=()=>{
        if(pathName.startsWith('/backend/books')||
        pathName.startsWith('/backend/borrow')||
        pathName.startsWith('/backend/return')) return'book';

        if(pathName.startsWith('/backend/calendar')||
        pathName.startsWith('/backend/role-quota')||
        pathName.startsWith('/backend/categories')) return'setting';

        return 'book';//as default
    }
    const [openMenu,setOpenMenu]=useState<string>(getDefaultOpen);
    /**↑為什麼「useState」明明是要回傳一個string,但初值卻放入一個函數「getDefaultOpen」!?
     * 這招叫「lazy initializer」
     * 
     * 因為useState的API是長這樣的「 useState<S>(initialState: S | (() => S)): [S, setState] 」,意即:initialState不是S型態要不就是一個回傳S的callback
     * 
     * 只有在最初會呼叫getDefaultOpen()<--那個callback ref; 
     * 之後render就不會呼叫了,但如果是寫做useState<string>(getDefaultOpen())
     * 那每次render都會呼叫getDefaultOpen()
     * 這樣可以省下很多事(事實上這種lazy init會出現在很多地方ex:useMemo、useReducer、useRef、useMemo....,這時就知道會不會看API文件真的有差了)
     **/
    const toggleMenu=(key:string)=>{
        setOpenMenu(prev=>prev===key?'':key);
    }

    const handleLogout=()=>{
        showModal({
                title:'Logout',
                message:'<p>Are you sure to logout</p>',
                onOk:async()=>{
                    //do logout process
                    await fetch('/api/auth/logout',{method:'POST'});
                    router.push('/login');
                },
                onCancel:()=>{},
                hideCancel:false
        });
    }
  // ── Styles ────────────────────────────────────────────────────
  // C#: background-color: #1282A2 (Glacial Blue Ice)
  const sidebarBg  = 'bg-[#1282A2]'
  const hoverBg    = 'hover:bg-[#0C6170]'
  const submenuBg  = 'bg-white'
  const submenuText = 'text-[#1282A2]'    
  return (
    <div className={`${sidebarBg} w-32 h-full flex-shrink-0
                     flex flex-col pt-5`}>
      {/* ── Menu Items ────────────────────────────────────────── */}       
      { SystemMenu.map(section=>(
            <div key={section.key}>
                {/* Section Header — Book / Setting */}
                {/* C#: expandable-link with ▲ / ▼               */}
                <button
                    onClick={() => toggleMenu(section.key)}
                    className={`w-full text-white font-bold
                                text-left px-3 py-3
                                flex items-center justify-between
                                ${hoverBg} transition-colors`}
                >
                    <span>{section.label}</span>
                    <span className="text-xs">
                    {openMenu === section.key ? '▲' : '▼'}
                    </span>
                </button>  
          {/* Submenu Items */}
          {/* C#: collapse show / collapse                  */}                
            {openMenu ===section.key &&(
                <div className={submenuBg}>
                    {section.items.map(item=>(
                        <Link 
                        key={item.href}
                        href={item.href}
                        className={`block px-3 py-2 text-sm
                              ${submenuText} font-medium
                              hover:bg-gray-100
                              transition-colors
                              ${pathName === item.href
                                ? 'bg-yellow-200 font-bold'  // active item highlight
                                : ''
                              }`}
                        >
                            {item.label}
                        </Link>
                    ))
                    }
                </div>
            )}       
            </div>
         ))
     }
     {/*-------Logout------------------------ */}
     <button
         onClick={handleLogout}
        className={`mt-auto w-full text-white
                            font-bold text-left
                            px-3 py-3 ${hoverBg}
                            transition-colors`}     
     >
        Logout
     </button>
    </div>
  );  

}