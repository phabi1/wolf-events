import { createRoot } from "react-dom/client";
import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { create } from "zustand";
import { __, sprintf } from "@wordpress/i18n";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const TEXT_DOMAIN = "wolf-events";
const API_BASE = "/wp-json/wolf-events/v1";

const createRegistrationStore = () =>
	create((set) => ({
		info: null,
		ticketQuantities: {},
		step: 0,
		loading: true,
		submitting: false,
		error: null,
		success: false,

		setInfo: (info) => set({ info }),
		setTicketQuantity: (ticketId, qty) =>
			set((state) => ({
				ticketQuantities: { ...state.ticketQuantities, [ticketId]: qty },
			})),
		setStep: (step) => set({ step }),
		setLoading: (loading) => set({ loading }),
		setSubmitting: (submitting) => set({ submitting }),
		setError: (error) => set({ error }),
		setSuccess: (success) => set({ success }),
	}));

function slugify(str) {
	return str
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/[^\w_]/g, "");
}

function getFieldKey(field, index) {
	return field.name || slugify(field.label) || `field_${index}`;
}

function formatAmount(cents) {
	if (!cents) return __("Free", TEXT_DOMAIN);
	return (cents / 100).toLocaleString(undefined, {
		style: "currency",
		currency: "EUR",
	});
}

function TicketQuantityCard({ ticket, quantity, onChangeQuantity }) {
	const available =
		ticket.participant_max !== null
			? ticket.participant_max - ticket.participant_nb
			: Infinity;
	const isFull = available <= 0;
	const maxQty = Math.min(available, 99);

	return (
		<Card
			variant="outlined"
			sx={{
				borderColor: quantity > 0 ? "primary.main" : "divider",
				borderWidth: quantity > 0 ? 2 : 1,
				opacity: isFull ? 0.5 : 1,
			}}
		>
			<CardContent>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					flexWrap="wrap"
					gap={1}
				>
					<Box>
						<Typography variant="h6">{ticket.title}</Typography>
						<Typography variant="h6" color="primary">
							{formatAmount(ticket.amount)}
						</Typography>
						{isFull && (
							<Typography variant="caption" color="error">
								{__("Full", TEXT_DOMAIN)}
							</Typography>
						)}
						{!isFull && ticket.participant_max && (
							<Typography variant="caption" color="text.secondary">
								{sprintf(
									/* translators: %d: number of remaining spots */
									__("%d spot(s) remaining", TEXT_DOMAIN),
									available,
								)}
							</Typography>
						)}
					</Box>
					{!isFull && (
						<Box display="flex" alignItems="center" gap={1}>
							<IconButton
								size="small"
								aria-label={__("Decrease quantity", TEXT_DOMAIN)}
								onClick={() => onChangeQuantity(Math.max(0, quantity - 1))}
								disabled={quantity === 0}
							>
								<RemoveIcon fontSize="small" />
							</IconButton>
							<Typography
								variant="h6"
								sx={{ minWidth: 28, textAlign: "center" }}
							>
								{quantity}
							</Typography>
							<IconButton
								size="small"
								aria-label={__("Increase quantity", TEXT_DOMAIN)}
								onClick={() => onChangeQuantity(Math.min(maxQty, quantity + 1))}
								disabled={quantity >= maxQty}
							>
								<AddIcon fontSize="small" />
							</IconButton>
						</Box>
					)}
				</Box>
			</CardContent>
		</Card>
	);
}

function CustomField({ field, fieldIndex, baseName, control, errors }) {
	const key = getFieldKey(field, fieldIndex);
	const name = `${baseName}.fields.${key}`;
	const rules = field.required
		? {
				required: sprintf(
					/* translators: %s: field label */
					__("%s is required", TEXT_DOMAIN),
					field.label,
				),
		  }
		: {};

	const fieldErrors = baseName
		.split(".")
		.reduce((acc, part) => acc?.[part], errors);
	const error = fieldErrors?.fields?.[key];

	if (field.type === "select" && Array.isArray(field.options)) {
		return (
			<Controller
				name={name}
				control={control}
				rules={rules}
				defaultValue=""
				render={({ field: f }) => (
					<TextField
						{...f}
						select
						label={field.label}
						required={field.required}
						error={!!error}
						helperText={error?.message}
						fullWidth
						margin="normal"
					>
						<MenuItem value="">
							<em>{__("Choose…", TEXT_DOMAIN)}</em>
						</MenuItem>
						{field.options.map((opt) => (
							<MenuItem key={opt} value={opt}>
								{opt}
							</MenuItem>
						))}
					</TextField>
				)}
			/>
		);
	}

	if (field.type === "checkbox") {
		return (
			<Controller
				name={name}
				control={control}
				rules={
					field.required
						? {
								validate: (v) =>
									v === true ||
									sprintf(
										/* translators: %s: field label */
										__("%s is required", TEXT_DOMAIN),
										field.label,
									),
						  }
						: {}
				}
				defaultValue={false}
				render={({ field: f }) => (
					<Box>
						<FormControlLabel
							control={
								<Checkbox
									{...f}
									checked={!!f.value}
									onChange={(e) => f.onChange(e.target.checked)}
								/>
							}
							label={field.label}
						/>
						{error && <FormHelperText error>{error.message}</FormHelperText>}
					</Box>
				)}
			/>
		);
	}

	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			defaultValue=""
			render={({ field: f }) => (
				<TextField
					{...f}
					label={field.label}
					type={field.type || "text"}
					required={field.required}
					error={!!error}
					helperText={error?.message}
					fullWidth
					margin="normal"
				/>
			)}
		/>
	);
}

function ParticipantSection({ index, ticket, ticketFields, control, errors }) {
	return (
		<Box mb={3}>
			<Typography variant="subtitle2" color="primary" gutterBottom>
				{sprintf(
					/* translators: 1: participant number, 2: ticket title */
					__("Participant %1$d — %2$s", TEXT_DOMAIN),
					index + 1,
					ticket.title,
				)}
			</Typography>
			<Box display="flex" gap={2}>
				<Controller
					name={`participants.${index}.firstname`}
					control={control}
					rules={{ required: __("First name is required", TEXT_DOMAIN) }}
					defaultValue=""
					render={({ field }) => (
						<TextField
							{...field}
							label={__("First name", TEXT_DOMAIN)}
							required
							error={!!errors?.participants?.[index]?.firstname}
							helperText={errors?.participants?.[index]?.firstname?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>
				<Controller
					name={`participants.${index}.lastname`}
					control={control}
					rules={{ required: __("Last name is required", TEXT_DOMAIN) }}
					defaultValue=""
					render={({ field }) => (
						<TextField
							{...field}
							label={__("Last name", TEXT_DOMAIN)}
							required
							error={!!errors?.participants?.[index]?.lastname}
							helperText={errors?.participants?.[index]?.lastname?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>
			</Box>
			{ticketFields.map((field, fi) => (
				<CustomField
					key={fi}
					field={field}
					fieldIndex={fi}
					baseName={`participants.${index}`}
					control={control}
					errors={errors}
				/>
			))}
		</Box>
	);
}

function RegistrationForm({ eventId, useStore }) {
	const info = useStore((s) => s.info);
	const ticketQuantities = useStore((s) => s.ticketQuantities);
	const step = useStore((s) => s.step);
	const loading = useStore((s) => s.loading);
	const submitting = useStore((s) => s.submitting);
	const error = useStore((s) => s.error);
	const success = useStore((s) => s.success);

	const setInfo = useStore((s) => s.setInfo);
	const setTicketQuantity = useStore((s) => s.setTicketQuantity);
	const setStep = useStore((s) => s.setStep);
	const setLoading = useStore((s) => s.setLoading);
	const setSubmitting = useStore((s) => s.setSubmitting);
	const setError = useStore((s) => s.setError);
	const setSuccess = useStore((s) => s.setSuccess);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ defaultValues: { email: "", participants: [] } });

	const { fields: participantFields } = useFieldArray({
		control,
		name: "participants",
	});

	useEffect(() => {
		fetch(`${API_BASE}/events/${eventId}/registration`)
			.then((res) => {
				if (!res.ok) throw new Error(__("Event not found", TEXT_DOMAIN));
				return res.json();
			})
			.then((data) => {
				setInfo(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [eventId]);

	const participantList = useMemo(() => {
		if (!info) return [];
		const list = [];
		(info.tickets || []).forEach((ticket) => {
			const qty = ticketQuantities[ticket.id] || 0;
			for (let i = 0; i < qty; i++) {
				list.push({ ticket });
			}
		});
		return list;
	}, [info, ticketQuantities]);

	const totalAmount = useMemo(() => {
		if (!info) return 0;
		return (info.tickets || []).reduce((sum, ticket) => {
			return sum + ticket.amount * (ticketQuantities[ticket.id] || 0);
		}, 0);
	}, [info, ticketQuantities]);

	const totalParticipants = participantList.length;

	const getVisibleFields = (ticket) => {
		if (!info) return [];
		const tickets = info.tickets || [];
		const ticketIndex = tickets.findIndex((t) => t.id === ticket.id);
		return (info.event?.participant_fields || []).filter((field) => {
			const ft = field.tickets || [];
			return ft.length === 0 || ft.includes(ticketIndex);
		});
	};

	const handleGoToStep1 = () => {
		reset({
			email: "",
			participants: participantList.map(({ ticket }) => ({
				ticket_id: ticket.id,
				firstname: "",
				lastname: "",
				fields: {},
			})),
		});
		setStep(1);
	};

	const onSubmit = async (formData) => {
		setSubmitting(true);
		setError(null);

		const firstParticipant = formData.participants[0] || {};

		const payload = {
			registration: {
				firstname: firstParticipant.firstname,
				lastname: firstParticipant.lastname,
				email: formData.email,
				amount: totalAmount,
			},
			participants: formData.participants.map((p) => ({
				firstname: p.firstname,
				lastname: p.lastname,
				ticket_id: p.ticket_id,
				fields: p.fields || {},
			})),
		};

		try {
			const res = await fetch(`${API_BASE}/events/${eventId}/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || __("Registration failed", TEXT_DOMAIN));
			}
			setSuccess(true);

			// Optionally, you can redirect to a payment page if needed
			if (data.payment_url) {
				window.location.href = data.payment_url;
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" p={4}>
				<CircularProgress />
			</Box>
		);
	}

	if (error && !info) {
		return <Alert severity="error">{error}</Alert>;
	}

	if (success) {
		return (
			<Alert severity="success" sx={{ mt: 2 }}>
				<Typography variant="h6">
					{__("Registration confirmed!", TEXT_DOMAIN)}
				</Typography>
				<Typography>
					{sprintf(
						/* translators: %s: event title */
						__('Your registration for "%s" has been saved.', TEXT_DOMAIN),
						info?.event?.title,
					)}
				</Typography>
			</Alert>
		);
	}

	const steps = [
		__("Choose tickets", TEXT_DOMAIN),
		__("Your information", TEXT_DOMAIN),
		__("Confirmation", TEXT_DOMAIN),
	];

	return (
		<Box sx={{ maxWidth: 640, mx: "auto", p: 2 }}>
			<Typography variant="h5" gutterBottom>
				{info?.event?.title}
			</Typography>

			<Stepper activeStep={step} sx={{ mb: 3 }}>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>

			{/* ── Step 0 : ticket quantities ── */}
			{step === 0 && (
				<Box>
					<Typography variant="subtitle1" gutterBottom>
						{__("Select your tickets:", TEXT_DOMAIN)}
					</Typography>
					<Box display="flex" flexDirection="column" gap={2}>
						{(info?.tickets || []).map((ticket) => (
							<TicketQuantityCard
								key={ticket.id}
								ticket={ticket}
								quantity={ticketQuantities[ticket.id] || 0}
								onChangeQuantity={(qty) => setTicketQuantity(ticket.id, qty)}
							/>
						))}
					</Box>

					{totalParticipants > 0 && (
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							mt={2}
							p={2}
							bgcolor="action.hover"
							borderRadius={1}
						>
							<Typography>
								{sprintf(
									/* translators: %d: number of participants */
									__("%d participant(s)", TEXT_DOMAIN),
									totalParticipants,
								)}
							</Typography>
							<Typography variant="h6" color="primary">
								{sprintf(
									/* translators: %s: formatted total amount */
									__("Total: %s", TEXT_DOMAIN),
									formatAmount(totalAmount),
								)}
							</Typography>
						</Box>
					)}

					<Box display="flex" justifyContent="flex-end" mt={3}>
						<Button
							variant="contained"
							disabled={totalParticipants === 0}
							onClick={handleGoToStep1}
						>
							{__("Continue", TEXT_DOMAIN)}
						</Button>
					</Box>
				</Box>
			)}

			{/* ── Step 1 : participant info ── */}
			{step === 1 && (
				<Box component="form" onSubmit={handleSubmit(() => setStep(2))}>
					<Typography variant="subtitle2" gutterBottom>
						{__("Contact email", TEXT_DOMAIN)}
					</Typography>
					<Controller
						name="email"
						control={control}
						rules={{
							required: __("Email is required", TEXT_DOMAIN),
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: __("Invalid email address", TEXT_DOMAIN),
							},
						}}
						defaultValue=""
						render={({ field }) => (
							<TextField
								{...field}
								label={__("Email", TEXT_DOMAIN)}
								type="email"
								required
								error={!!errors.email}
								helperText={errors.email?.message}
								fullWidth
								margin="normal"
							/>
						)}
					/>

					<Divider sx={{ my: 2 }} />

					{participantFields.map((pf, index) => {
						const { ticket } = participantList[index];
						const ticketFields = getVisibleFields(ticket);
						return (
							<ParticipantSection
								key={pf.id}
								index={index}
								ticket={ticket}
								ticketFields={ticketFields}
								control={control}
								errors={errors}
							/>
						);
					})}

					{error && (
						<Alert severity="error" sx={{ mt: 2 }}>
							{error}
						</Alert>
					)}

					<Box display="flex" justifyContent="space-between" mt={3}>
						<Button onClick={() => setStep(0)}>
							{__("Back", TEXT_DOMAIN)}
						</Button>
						<Button type="submit" variant="contained">
							{__("Review my registration", TEXT_DOMAIN)}
						</Button>
					</Box>
				</Box>
			)}

			{/* ── Step 2 : summary + submit ── */}
			{step === 2 && (
				<Box>
					<Typography variant="subtitle1" gutterBottom>
						{__("Registration summary", TEXT_DOMAIN)}
					</Typography>
					<Divider sx={{ my: 1 }} />

					{(info?.tickets || [])
						.filter((t) => (ticketQuantities[t.id] || 0) > 0)
						.map((t) => (
							<Box
								key={t.id}
								display="flex"
								justifyContent="space-between"
								py={0.5}
							>
								<Typography>
									{t.title} × {ticketQuantities[t.id]}
								</Typography>
								<Typography>
									{formatAmount(t.amount * ticketQuantities[t.id])}
								</Typography>
							</Box>
						))}

					<Divider sx={{ my: 1 }} />
					<Box display="flex" justifyContent="space-between">
						<Typography variant="h6">{__("Total", TEXT_DOMAIN)}</Typography>
						<Typography variant="h6" color="primary">
							{formatAmount(totalAmount)}
						</Typography>
					</Box>

					{error && (
						<Alert severity="error" sx={{ mt: 2 }}>
							{error}
						</Alert>
					)}

					<Box display="flex" justifyContent="space-between" mt={3}>
						<Button onClick={() => setStep(1)} disabled={submitting}>
							{__("Back", TEXT_DOMAIN)}
						</Button>
						<Button
							variant="contained"
							color="success"
							onClick={handleSubmit(onSubmit)}
							disabled={submitting}
							startIcon={submitting ? <CircularProgress size={18} /> : null}
						>
							{submitting
								? __("Registering…", TEXT_DOMAIN)
								: __("Confirm my registration", TEXT_DOMAIN)}
						</Button>
					</Box>
				</Box>
			)}
		</Box>
	);
}

document
	.querySelectorAll(".wp-block-wolf-events-registration-form")
	.forEach((el) => {
		const eventId = el.dataset.eventId;
		if (eventId) {
			const useStore = createRegistrationStore();
			const root = createRoot(el);
			root.render(<RegistrationForm eventId={eventId} useStore={useStore} />);
		}
	});
