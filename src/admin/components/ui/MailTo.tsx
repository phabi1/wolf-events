export default function MailTo( { email }: { email: string } ) {
	return (
		<a
			href={ `mailto:${ email }` }
			style={ { color: 'var(--wp-admin-theme-color)' } }
		>
			{ email }
		</a>
	);
}
