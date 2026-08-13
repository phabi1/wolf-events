import { useRef, useState } from 'react';
export type FileUploadProps = {
	message?: string;
	fileExtensions?: string[];
	maxFileSize?: number; // in bytes
	onFileSelect: ( file: File ) => void;
};

export default function UiFileUpload( {
	message,
	fileExtensions,
	maxFileSize,
	onFileSelect,
}: FileUploadProps ) {
	const inputRef = useRef< HTMLInputElement >( null );
	const [ isDragging, setDragging ] = useState( false );

	const handleDragOver = ( e: React.DragEvent ) => {
		e.preventDefault();
		setDragging( true );
	};

	const handleDragLeave = ( e: React.DragEvent ) => {
		e.preventDefault();
		setDragging( false );
	};

	const handleDrop = ( e: React.DragEvent ) => {
		e.preventDefault();
		setDragging( false );
		if ( e.dataTransfer.files && e.dataTransfer.files[ 0 ] ) {
			const file = e.dataTransfer.files[ 0 ];
			if ( maxFileSize && file.size > maxFileSize ) {
				alert(
					`File size exceeds the maximum limit of ${ maxFileSize } bytes.`
				);
				return;
			}
			onFileSelect( file );
		}
	};

	const handleClick = () => {
		if ( inputRef.current ) {
			inputRef.current.click();
		}
	};

	return (
		<div>
			<div
				onDragOver={ handleDragOver }
				onDragLeave={ handleDragLeave }
				onDrop={ handleDrop }
				onClick={ handleClick }
			>
				<div
					style={ {
						border: '2px dashed #ccc',
						padding: '20px',
						textAlign: 'center',
						backgroundColor: isDragging ? '#eee' : '#fff',
					} }
				>
					<div>
						{ message ||
							'Drag and drop a CSV file here, or click to select a file.' }
					</div>
					{ fileExtensions && (
						<div
							style={ {
								marginTop: '10px',
								fontSize: '12px',
								color: '#666',
							} }
						>
							Accepted file types: { fileExtensions.join( ', ' ) }
						</div>
					) }
					{ maxFileSize && (
						<div
							style={ {
								marginTop: '10px',
								fontSize: '12px',
								color: '#666',
							} }
						>
							Max file size: { maxFileSize } bytes
						</div>
					) }
				</div>
			</div>
			<input
				ref={ inputRef }
				type="file"
				accept={ fileExtensions ? fileExtensions.join( ',' ) : '.csv' }
				style={ { display: 'none' } }
				onChange={ ( e ) => {
					if ( e.target.files && e.target.files[ 0 ] ) {
						const file = e.target.files[ 0 ];
						if ( maxFileSize && file.size > maxFileSize ) {
							alert(
								`File size exceeds the maximum limit of ${ maxFileSize } bytes.`
							);
							return;
						}
						onFileSelect( file );
					}
				} }
			/>
		</div>
	);
}
