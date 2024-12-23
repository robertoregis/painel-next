'use client'
import "../style.css";

import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';


export default ({ content, setContent }: any) => {
	const editor: any = useRef(null);

	const config = useMemo(
    () => ({
			readonly: false,
			placeholder: 'Digite alguma coisa',
			buttons: [
				'source',
				'|',
				'bold',
				'italic',
				'underline',
				'|',
				'ul',
				'ol',
				'|',
				'font',
				'fontsize',
				'brush',
				'paragraph',
				'|',
				'image',
				'video',
				'table',
				'link',
				'|',
				'left',
				'center',
				'right',
				'justify',
				'|',
				'undo',
				'redo',
				'|',
				'hr',
				'eraser',
				'fullsize',
			],
			removeButtons: ['file'],
			showCharsCounter: false,
			showWordsCounter: false,
			toolbarAdaptive: true,
			readonlyImageInEditor: true, // Desativa a edição de imagens no editor
			toolbarSticky: true,
			style: {
				//background: '#27272E',
				//color: 'rgba(255,255,255,0.5)',
			},
			language: 'pt_br',
			events: {
				afterInit: function (editor: any) {
					editor.editor.addEventListener('mousedown', function (event: any) {
						if (event.target.tagName.toLowerCase() === 'img') {
						  event.preventDefault();
						  event.stopPropagation();
						}
					});
				},
				afterInsertImage: function(image: any){
					let textarea = editor.current
					let texto = textarea.value
					console.log(texto)
					// Expressão regular para encontrar o padrão "<img s"
					let regex = /<img s/g;


					// Função de substituição para substituir "Get(" por "<img s"
					let textoModificado = texto.replace(regex, '<img style="max-width: 100%;" s');
					console.log(textoModificado)
					setContent(textoModificado)
				},
			}
		}),
		[]
	);

	const handleContentChange = (newContent: string) => {
		// Verificar se o novo conteúdo contém marcação de vídeo
		const regex = /<iframe wid/g;
		const matches = newContent.match(regex);
		if (matches) {
			let textoModificado = newContent.replace(regex, '<div class="videoWrapper"><iframe class="video" wid');
			const regex2 = /""><\/iframe>/g;
			let textoModificado2 = textoModificado.replace(regex2, 'style="opacity: 1;"></iframe></div>')
			setContent(textoModificado2)
		} else {
			setContent(newContent);
		}
	};
	
	return (
		<JoditEditor
			ref={editor}
			value={content}
			config={config}
			onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={handleContentChange}
		/>
	)
}