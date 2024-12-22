'use client'
import "../style.css";

import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
} from '@chakra-ui/react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { MdCancel, MdContentCut, MdImage } from "react-icons/md";

const CropImage = ({ getData, titleButton, imageInitial, isImage, aspect }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [imageSrc, setImageSrc] = useState('');
    const [file, setFile] = useState<any>();
    const [img, setImg] = useState<any>();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isLoadedImage, setIsLoadedImage] = useState<boolean>(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState<any>(null)
    const [showTooltipZoom, setShowTooltipZoom] = useState<boolean>(false)
    const [showTooltipRotation, setShowTooltipRotation] = useState<boolean>(false)

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const showCroppedImage = async () => {
        try {
            const croppedImage: any = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            console.log('donee', { croppedImage })
            setCroppedImage(croppedImage.url)
            setFile(croppedImage.file)
            setImg(croppedImage.url)
        } catch (e) {
            console.error(e)
        }
    }

    const onCloseModal = () => {
        onClose()
        setCroppedImage(null)
    }

    const getImage = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setIsLoadedImage(true)
            };
            reader.readAsDataURL(file);
        }
    }

    const save = () => {
        getData({
            file: file,
            url: img
        });
        setImageSrc('')
        setFile(null)
        setImg(null)
        setIsLoaded(false)
        setIsLoadedImage(false)
        setCrop({ x: 0, y: 0 })
        setRotation(0)
        setZoom(1)
        setCroppedAreaPixels(null)
        setCroppedImage(null)
        setShowTooltipZoom(false)
        setShowTooltipRotation(false)
        onClose();
    }

    useEffect(() => {
        if(imageInitial) {
            setImageSrc(imageInitial)
        }
    }, [])

    useEffect(() => {
        if(imageInitial) {
            setImageSrc(imageInitial)
        }
    }, [isImage])

    useEffect(() => {
        if(isLoaded) {
            save()
        } else {
            setIsLoaded(true)
        }
    }, [img])
	
	return (
        <>
        <Button leftIcon={<MdImage size={25} />} onClick={onOpen} colorScheme="orange">{titleButton}</Button>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cortar Imagem</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div className="grid grid-cols-1">
                        {/*<div className="col-span-1">
                            <img src={croppedImage} alt="" />
                        </div>*/}
                        <div className="col-span-1">
                            <div className="flex justify-center">
                                <label htmlFor="image-upload" className="cursor-pointer bg-green-700/75 rounded px-4 py-1 text-white shadow-lg flex items-center" tabIndex={0} role="dialog">
                                    <MdImage size={20} className="mr-2" />Selecionar imagem
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(value) => getImage(value)}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 mt-3">
                            <div className="flex items-center justify-center bg-slate-100/75 p-3 rounded min-h-[300px] md:min-h-[330px] xl:min-h-[360px] relative">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    rotation={rotation}
                                    zoom={zoom}
                                    aspect={aspect}
                                    onCropChange={setCrop}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                        </div>
                        {
                            isLoadedImage
                            &&
                            <div className="col-span-1 mt-6">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <div className="w-[22%] px-1">
                                            <span className="text-sm font-[500]">Zoom:</span>
                                        </div>
                                        <div className="w-[78%]">
                                            <Slider aria-label='slider-zoom' colorScheme='green' value={zoom}
                                                defaultValue={zoom}
                                                onChange={setZoom}
                                                onMouseEnter={() => setShowTooltipZoom(true)}
                                                onMouseLeave={() => setShowTooltipZoom(false)}
                                            >
                                                <SliderTrack>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <Tooltip
                                                    hasArrow
                                                    bg='green.800'
                                                    color='white'
                                                    placement='top'
                                                    isOpen={showTooltipZoom}
                                                    label={`${zoom}`}
                                                >
                                                    <SliderThumb bgColor='green.800' />
                                                </Tooltip>
                                            </Slider>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <div className="w-[22%] px-1">
                                            <span className="text-sm font-[500]">Girar:</span>
                                        </div>
                                        <div className="w-[78%]">
                                            <Slider aria-label='slider-rotacionar'
                                                value={rotation}
                                                defaultValue={rotation}
                                                onChange={setRotation}
                                                colorScheme='green'
                                                onMouseEnter={() => setShowTooltipRotation(true)}
                                                onMouseLeave={() => setShowTooltipRotation(false)}
                                            >
                                                <SliderTrack>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <Tooltip
                                                    hasArrow
                                                    bg='green.800'
                                                    color='white'
                                                    placement='top'
                                                    isOpen={showTooltipRotation}
                                                    label={`${rotation}`}
                                                >
                                                    <SliderThumb bgColor='green.800' />
                                                </Tooltip>
                                            </Slider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' leftIcon={<MdCancel size={25} />} mr={3} onClick={onCloseModal}>
                        Cancelar
                    </Button>
                    <Button colorScheme='blue' leftIcon={<MdContentCut size={25} />} mr={3} onClick={showCroppedImage}>Cortar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
	)
}

export default CropImage;