import db from "../config/dbconn"

import { DataTypes } from "sequelize"

const Booking = db.define('Booking', {
    bookingId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roomName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nights: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

// Sync the model with the database
(async () => {
    await db.sync({ alter: true });
    console.log("The table for the Booking model was just (re)created!");
})();

export const createBooking = async (bookingData) => {
    try {
        const booking = await Booking.create(bookingData);
        console.log('Booking created:', booking.toJSON());
        return booking;
    } catch (error) {
        console.error('Error creating booking:', error);
    }
};

export const getAllBookings = async () => {
    try {
        const bookings = await Booking.findAll();
        console.log('All bookings:', JSON.stringify(bookings, null, 2));
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



export const deleteBooking = async (id) => {
    try {
        const deletedRows = await Booking.destroy({
            where: { bookingId: id }
        });
        if (deletedRows) {
            console.log('Booking deleted');
        } else {
            console.log('Booking not found');
        }
    } catch (error) {
        console.error('Error deleting booking:', error);
    }
};

export const updateBooking = async (id, updateData) => {
    try {
        const [updatedRows] = await Booking.update(updateData, {
            where: { bookingId: id }
        });
        if (updatedRows) {
            const updatedBooking = await getBookingById(id);
            console.log('Booking updated:', updatedBooking.toJSON());
            return updatedBooking;
        } else {
            console.log('Booking not found or no changes made');
        }
    } catch (error) {
        console.error('Error updating booking:', error);
    }
};



export default Booking;
