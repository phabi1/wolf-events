import { create } from 'zustand';

export const store = () =>
	create( ( set ) => ( {
		info: null,
		ticketQuantities: {}, // { [ticketId]: number }
		step: 0,
		loading: true,
		submitting: false,
		error: null,
		success: false,

		setInfo: ( info ) => set( { info } ),
		setTicketQuantity: ( ticketId, qty ) =>
			set( ( state ) => ( {
				ticketQuantities: {
					...state.ticketQuantities,
					[ ticketId ]: qty,
				},
			} ) ),
		setStep: ( step ) => set( { step } ),
		setLoading: ( loading ) => set( { loading } ),
		setSubmitting: ( submitting ) => set( { submitting } ),
		setError: ( error ) => set( { error } ),
		setSuccess: ( success ) => set( { success } ),
	} ) );