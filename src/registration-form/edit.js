import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { eventId } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Paramètres', 'registration-form' ) }>
					<TextControl
						label={ __( "ID de l'événement", 'registration-form' ) }
						value={ eventId ?? '' }
						type="number"
						onChange={ ( value ) =>
							setAttributes( {
								eventId: value ? parseInt( value, 10 ) : null,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				{ eventId ? (
					<p>
						{ __(
							"Formulaire d'inscription — événement #",
							'registration-form'
						) }
						{ eventId }
					</p>
				) : (
					<p>
						{ __(
							"Veuillez sélectionner un événement dans le panneau latéral.",
							'registration-form'
						) }
					</p>
				) }
			</div>
		</>
	);
}
