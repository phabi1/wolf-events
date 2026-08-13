import Stack from '@mui/material/Stack';
import { useFormContext } from 'react-hook-form';
import InputField from '../../forms/fields/InputField';
import SwitchPanelField from '../../forms/fields/SwitchPanelField';
import MachineNameField from '../../forms/fields/MachineNameField';

export default function EventInformationsForm() {
	const { setValue } = useFormContext();

	const handleRegistrationClose = () => {
		setValue( 'registration_start', null );
		setValue( 'registration_end', null );
	};

	return (
		<div>
			<InputField name="title" label="Title" />
			<MachineNameField name="slug" label="Slug" fieldName="title" />
			<Stack direction="row" spacing={ 2 } mb={ 2 }>
				<InputField
					name="event_start"
					label="Event Start"
					type="datetime-local"
				/>
				<InputField
					name="event_end"
					label="Event End"
					type="datetime-local"
				/>
			</Stack>
			<SwitchPanelField
				name="has_registration"
				label="Has Registration"
				onClose={ handleRegistrationClose }
			>
				<Stack direction="row" spacing={ 2 } mb={ 2 }>
					<InputField
						name="registration_start"
						label="Registration Start"
						type="datetime-local"
					/>
					<InputField
						name="registration_end"
						label="Registration End"
						type="datetime-local"
					/>
				</Stack>
			</SwitchPanelField>
			<InputField
				name="participant_max"
				label="Max Participants"
				type="number"
			/>
		</div>
	);
}
