'use client'
import "../style.css";

import React, { useState, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { IoMdWarning } from "react-icons/io";
import { NavContext } from "../context/NavContext";
import UserMenu from "./UserMenu";
import { UserContext } from "../context/UserContext";
import WarningsQuickStats from "./WarningsQuickStats";

const Topbar = () => {
  const context = useContext(NavContext)
  const _userContext = useContext(UserContext)

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

  const changeIsShowNavRef = (value: Boolean) => {
    if(value) {
      context?.onOpen()
    } else {
      context?.onClose()
    }
  }

	/*useEffect(() => {
		//alert(pathname)
	}, [pathname])*/
	
	return (
		<div className="flex justify-between items-center w-full">
      <div className="flex items-center">
        <button className="hidden lg:block mr-2">
          {
            context?.nav.isShowNav ? <AiOutlineMenuFold onClick={() => changeIsShowNav(false)} className="text-xl" /> : <AiOutlineMenuUnfold onClick={() => changeIsShowNav(true)}  className="text-xl" />
          }
        </button>
        <button className="lg:hidden mr-2">
          {
            context?.isOpen ? <AiOutlineMenuFold onClick={() => changeIsShowNavRef(false)} className="text-xl" /> : <AiOutlineMenuUnfold onClick={() => changeIsShowNavRef(true)}  className="text-xl" />
          }
        </button>
        <button className="mr-2">
          <IoMdWarning onClick={changeNavTest} className="text-xl" />
        </button>
        <WarningsQuickStats />
      </div>
      <div className="flex items-center">
        <span className="mr-2">{_userContext?.user.username}</span>
        <UserMenu />
      </div>
    </div>
	)
}

export default Topbar;