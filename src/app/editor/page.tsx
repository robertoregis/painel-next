"use client"; // Marca este arquivo como um Client Component
import React, { useState, useRef, useMemo, useEffect } from 'react';
import EditImage from '../components/EditImage';
import CropImage from '../components/CropImage';

export default function Home ({ placeholder }: any) {
	const [loaded, setLoaded] = useState(false)
	const [img, setImg] = useState<any>()
	const [isImg, setIsImg] = useState(false)

	const getData = (returnImg: any) => {
		setImg(returnImg)
		setIsImg(true)
		console.log('oii')
		console.log(returnImg)
	}

	useEffect(() => {
		setLoaded(true)
	}, [])

	return (
		<>
			<main className="flex w-full p-4">
			<CropImage getData={getData} />
			<div className="grid grid-cols-1 overflow-auto bg-red-900">
				<div className="col-span-1 max-h-[400px]">
					{ isImg && <img src={img.url} alt="" className='max-h-full' /> }
				</div>
			</div>
			</main>
		</>
	);
};