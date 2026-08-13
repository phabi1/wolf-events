import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

type MappingFieldsProps = {
	mapping: Record< string, string >;
	fields: string[];
	sampleRows: any[];
	onMappingChange?: ( fieldKey: string, mappedValue: string ) => void;
};

export default function MappingFields( {
	mapping,
	fields,
	sampleRows,
	onMappingChange,
}: MappingFieldsProps ) {
	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						{ Object.keys( mapping ).map( ( key ) => (
							<TableCell key={ key }>{ key }</TableCell>
						) ) }
					</TableRow>
					<TableRow>
						{ Object.keys( mapping ).map( ( key ) => (
							<TableCell key={ key }>
								<Select
									value={ mapping[ key ] || '' }
									onChange={ ( e ) =>
										onMappingChange &&
										onMappingChange( key, e.target.value )
									}
								>
									<MenuItem value="">---</MenuItem>
									{ fields.map( ( field ) => (
										<MenuItem key={ field } value={ field }>
											{ field }
										</MenuItem>
									) ) }
								</Select>
							</TableCell>
						) ) }
					</TableRow>
				</TableHead>
				<TableBody>
					{ sampleRows.map( ( row, index ) => (
						<TableRow key={ index }>
							{ Object.keys( mapping ).map( ( key ) => (
								<TableCell key={ key }>
									{ row[ mapping[ key ] ] }
								</TableCell>
							) ) }
						</TableRow>
					) ) }
				</TableBody>
			</Table>
		</TableContainer>
	);
}
