'use client'
import "../style.css";

import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
} from '@chakra-ui/react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'

const EditImage = ({ getData }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [crop, setCrop] = useState<any>({
        unit: '%', // Can be 'px' or '%'
        x: 25,
        y: 25,
    })
    const [imageSrc, setImageSrc] = useState('');
    const [file, setFile] = useState<any>();
    const [blob, setBlob] = useState<any>();

    const getImage = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleCropImage = () => {
        if (imageSrc) {
            // Cria um novo elemento de imagem
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleX = img.naturalWidth / img.width;
                const scaleY = img.naturalHeight / img.height;
                canvas.width = crop.width!;
                canvas.height = crop.height!;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(
                    img,
                    crop.x! * scaleX,
                    crop.y! * scaleY,
                    crop.width! * scaleX,
                    crop.height! * scaleY,
                    0,
                    0,
                    crop.width!,
                    crop.height!
                );
                // Obtém a imagem cortada como base64
                const croppedImageUrl = canvas.toDataURL('image/jpeg');
                console.log('Imagem cortada:', croppedImageUrl);
                // Aqui você pode salvar ou usar `croppedImageUrl` conforme necessário
                //onClose(); // Fecha o modal após cortar e salvar
                setCrop({
                    unit: '%', // Can be 'px' or '%'
                    x: 25,
                    y: 25,
                })
                setImageSrc(croppedImageUrl)
                const blob = new Blob([croppedImageUrl], { type: 'image/jpeg' });
                setBlob(blob)
                const file: any = new File([blob], 'nova-imagem-cortada.jpg', { type: 'image/jpeg' });
                setFile(file)
            };
            img.src = imageSrc;
        }
    }

    const save = () => {
        getData({
            blob: blob,
            file: file,
            imageUrl: imageSrc
        });
        onClose();
    }
	
	return (
        <>
        <Button onClick={onOpen}>Discard</Button>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cortar Imagem</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div className="grid grid-cols-1">
                        <div className="col-span-1">
                            <div className="flex justify-center">
                                <label htmlFor="image-upload" className="cursor-pointer bg-green-700/75 rounded px-4 py-1 text-white shadow-lg" tabIndex={0} role="dialog">
                                    Escolher imagem
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
                        <div className="flex items-center justify-center bg-slate-100/75 p-3 rounded">
                            <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={16/9}>
                                <img src={imageSrc} />
                            </ReactCrop>
                        </div>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button colorScheme='blue' mr={3} onClick={handleCropImage}>Cortar</Button>
                    <Button colorScheme='green' onClick={save}>Continuar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
	)
}

export default EditImage;