'use client'
import "../style.css";

import React, { useState, useRef, useMemo, useEffect, useContext } from 'react';
import { MdDashboard } from "react-icons/md";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiFillAlert } from "react-icons/ai";
import { IoMdWarning } from "react-icons/io";
import { NavContext } from "../context/NavContext";
import Topbar from "./Topbar";

const Main = ({children}: any) => {

	const pathname = usePathname()
	const [isShowMenu, setIsShowMenu] = useState(true)
  const context = useContext(NavContext)

  const changeNavTest = () => {
    context?.setNav((newState: any) => ({
      ...newState,
      test: 'novo'
    }))
  }

  const changeIsShowNav = (value: Boolean) => {
    context?.setNav((newState: any) => ({
      ...newState,
      isShowNav: value
    }))
  }

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