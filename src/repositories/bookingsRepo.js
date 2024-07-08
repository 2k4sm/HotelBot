import { Booking } from "../models/bookings";

export const createBooking = async (bookingData) => {
    try {
        const booking = await Booking.create(bookingData);
        return booking;
    } catch (error) {
        console.error('Error creating booking:', error);
    }
};

export const getAllBookings = async () => {
    try {
        const bookings = await Booking.findAll();
        return bookings;
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
};


export const getBookingById = async (id) => {
    try {
        const booking = await Booking.findByPk(id);
        if (booking) {
            return booking;
        } else {
            console.log('Booking not found');
        }
    } catch (error) {
        console.error('Error fetching booking:', error);
    }
};


export const updateBooking = async (id, updateData) => {
    try {
        const [updatedRows] = await Booking.update(updateData, {
            where: { bookingId: id }
        });
        if (updatedRows) {
            const updatedBooking = await getBookingById(id);
            return updatedBooking;
        } else {
            console.log('Booking not found or no changes made');
        }
    } catch (error) {
        console.error('Error updating booking:', error);
    }
};
