'use client'
import "../style.css";
import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Button,
	Input,
} from '@chakra-ui/react';
import React, { useState, useRef, useMemo, useEffect, useContext } from 'react';
import { MdDashboard } from "react-icons/md";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavContext } from "../context/NavContext";
import { UserContext } from "../context/UserContext";

const Navbar = () => {

	const pathname = usePathname()
	const _navContext = useContext(NavContext)
	const _userContext = useContext(UserContext)
	const router = useRouter();

	const isIncludesPermission = (permission: string) => {
		if(_userContext?.permissions.includes('all')) {
			return true
		}
		const isIncludes = _userContext?.permissions.includes(permission)
		if(isIncludes) {
			return true
		} else {
			return false
		}
	}

	const goRouter = (url: string) => {
		router.push(url);
	}

	const goRouterMobile = (url: string) => {
		router.push(url);
		_navContext?.onClose()
	}
	
	return (
		<>
			{
				_navContext?.nav.isShowNav && <div className="hidden lg:flex lg:w-[260px] 2xl:w-[300px] bg-white">
					<div className="w-full flex flex-col">
							<div className="h-[40px] 2xl:h-[50px] flex justify-center items-center border-r-2 border-b-2 border-neutral-300/50 p-2">
								<button>
									<h1 className="text-xl mb-0">Título da empresa</h1>
								</button>
							</div>
							<div className="h-[calc(100%_-_40px)] 2xl:h-[calc(100%_-_50px)] p-2 overflow-x-hidden">
								<div className="flex flex-col">
									<div onClick={() => goRouter('/feed/dashboard')} tabIndex={0} className={`flex items-center rounded no-underline px-2 py-1 mb-2 cursor-pointer ${pathname === '/feed/editor' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
										<MdDashboard className="text-base" />
										<span className="ml-2 text-base">Dashboard</span>
									</div>
									<div onClick={() => goRouter('/feed/meu-perfil')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/meu-perfil' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
										<MdDashboard className="text-base" />
										<span className="ml-2 text-base">Meu perfil</span>
									</div>
									<div onClick={() => goRouter('/feed/configuracao')} tabIndex={0} className={`flex items-center rounded no-underline px-2 py-1 mb-2 cursor-pointer ${pathname === '/feed/configuracao' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
										<MdDashboard className="text-base" />
										<span className="ml-2 text-base">Configuração</span>
									</div>
									{
										isIncludesPermission('users') &&
										<div onClick={() => goRouter('/feed/usuarios')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/usuarios' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
											<MdDashboard className="text-base" />
											<span className="ml-2 text-base">Usuarios</span>
										</div>
									}
									{
										isIncludesPermission('roles') &&
										<div onClick={() => goRouter('/feed/regras')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/regras' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
											<MdDashboard className="text-base" />
											<span className="ml-2 text-base">Regras</span>
										</div>
									}
									{
										isIncludesPermission('warnings') &&
										<div onClick={() => goRouter('/feed/avisos')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/avisos' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
											<MdDashboard className="text-base" />
											<span className="ml-2 text-base">Avisos</span>
										</div>
									}
									{
										isIncludesPermission('posts') &&
										<div onClick={() => goRouter('/feed/publicacoes')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/publicacoes' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
											<MdDashboard className="text-base" />
											<span className="ml-2 text-base">Publicações</span>
										</div>
									}
									{
										isIncludesPermission('languagens') &&
										<div onClick={() => goRouter('/feed/linguagens')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/linguagens' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
											<MdDashboard className="text-base" />
											<span className="ml-2 text-base">Linguagens</span>
										</div>
									}
									{
										isIncludesPermission('frameworks') &&
										<div onClick={() => goRouter('/feed/frameworks')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/frameworks' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
											<MdDashboard className="text-base" />
											<span className="ml-2 text-base">Frameworks</span>
										</div>
									}
									{
										isIncludesPermission('curriculuns') &&
										<div onClick={() => goRouter('/feed/curriculos')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/curriculos' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
											<MdDashboard className="text-base" />
											<span className="ml-2 text-base">Currículos</span>
										</div>
									}
									{
										isIncludesPermission('jobs') &&
										<div onClick={() => goRouter('/feed/trabalhos')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/trabalhos' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
											<MdDashboard className="text-base" />
											<span className="ml-2 text-base">Trabalhos</span>
										</div>
									}
								</div>
							</div>
					</div>
				</div>
			}
			<Drawer
				isOpen={_navContext?.isOpen}
				placement='right'
				onClose={_navContext?.onClose}
				finalFocusRef={_navContext?.navRef.current}
			>
				<DrawerOverlay />
				<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Título da empresa</DrawerHeader>

				<DrawerBody>
				<div className="">
						<div className="flex flex-col">
							<div onClick={() => goRouterMobile('/feed/dashboard')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/editor' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
								<MdDashboard className="text-base" />
								<span className="ml-2 text-base">Dashboard</span>
							</div>
							<div onClick={() => goRouterMobile('/feed/meu-perfil')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/meu-perfil' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
								<MdDashboard className="text-base" />
								<span className="ml-2 text-base">Meu perfil</span>
							</div>
							<div onClick={() => goRouterMobile('/feed/configuracao')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/configuracao' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
								<MdDashboard className="text-base" />
								<span className="ml-2 text-base">Configuração</span>
							</div>
							{
								isIncludesPermission('users') &&
								<div onClick={() => goRouterMobile('/feed/usuarios')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/usuarios' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
									<MdDashboard className="text-base" />
									<span className="ml-2 text-base">Usuarios</span>
								</div>
							}
							{
								isIncludesPermission('roles') &&
								<div onClick={() => goRouterMobile('/feed/regras')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/regras' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
									<MdDashboard className="text-base" />
									<span className="ml-2 text-base">Regras</span>
								</div>
							}
							{
								isIncludesPermission('warnings') &&
								<div onClick={() => goRouterMobile('/feed/avisos')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/avisos' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
									<MdDashboard className="text-base" />
									<span className="ml-2 text-base">Avisos</span>
								</div>
							}
							{
								isIncludesPermission('posts') &&
								<div onClick={() => goRouterMobile('/feed/publicacoes')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/publicacoes' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
									<MdDashboard className="text-base" />
									<span className="ml-2 text-base">Publicações</span>
								</div>
							}
							{
								isIncludesPermission('languagens') &&
								<div onClick={() => goRouterMobile('/feed/linguagens')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/linguagens' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
									<MdDashboard className="text-base" />
									<span className="ml-2 text-base">Linguagens</span>
								</div>
							}
							{
								isIncludesPermission('frameworks') &&
								<div onClick={() => goRouterMobile('/feed/frameworks')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/frameworks' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
									<MdDashboard className="text-base" />
									<span className="ml-2 text-base">Frameworks</span>
								</div>
							}
							{
								isIncludesPermission('curriculuns') &&
								<div onClick={() => goRouterMobile('/feed/curriculos')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/curriculos' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
									<MdDashboard className="text-base" />
									<span className="ml-2 text-base">Currículos</span>
								</div>
							}
							{
								isIncludesPermission('jobs') &&
								<div onClick={() => goRouterMobile('/feed/trabalhos')} tabIndex={0} className={`flex items-center rounded no-underline p-2 mb-2 cursor-pointer ${pathname === '/feed/trabalhos' ? `border-b-gray-200/75 bg-gray-200/75` : `border-b-gray-100/25 bg-gray-100/25`}`}>
									<MdDashboard className="text-base" />
									<span className="ml-2 text-base">Trabalhos</span>
								</div>
							}
						</div>
					</div>
				</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	)
}

export default Navbar;