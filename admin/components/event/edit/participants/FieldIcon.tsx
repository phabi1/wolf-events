export default function FieldIcon( { type }: { type: string } ) {
	switch ( type ) {
		case 'text':
			return <span>📝</span>;
		case 'number':
			return <span>🔢</span>;
		default:
			return <span>❓</span>;
	}
}
