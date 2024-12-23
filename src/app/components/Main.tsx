'use client'
import "../style.css";

import React, { useState, useEffect, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { NavContext } from "../context/NavContext";
import Topbar from "./Topbar";

const Main = ({children}: any) => {

	const pathname = usePathname()
  const context = useContext(NavContext)

	useEffect(() => {
		//alert(pathname)
	}, [pathname])
	
	return (
		<div className={`flex flex-col ${context?.nav.isShowNav ? 'w-[100%] lg:w-[calc(100%_-_260px)] 2xl:w-[calc(100%_-_300px)]' : 'w-[100%]'}`}>
                <div className="h-[40px] 2xl:h-[50px] w-full flex items-center bg-white px-4 border-b-2 border-neutral-300/50">
                  <Topbar />
                </div>
                <div className="h-[calc(100%_-_40px)] 2xl:h-[calc(100%_-_50px)] w-full flex flex-col items-center justify-between overflow-x-hidden overflow-y-auto bg-neutral-300/75">
                  {children}
                </div>
              </div>
	)
}

export default Main;