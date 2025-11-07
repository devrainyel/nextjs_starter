import type { HydratedDocument, InferSchemaType, Model } from 'mongoose';
import { Schema, model, models } from 'mongoose';

import { Event } from './event.model';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

type BookingSchema = InferSchemaType<typeof bookingSchema>;
export type BookingDocument = HydratedDocument<BookingSchema>;

// Validate email format and verify the referenced event before committing the booking.
bookingSchema.pre('save', async function preSave(next) {
  try {
    const doc = this as BookingDocument;

    if (!EMAIL_PATTERN.test(doc.email)) {
      throw new Error('Invalid booking email address');
    }

    const eventExists = await Event.exists({ _id: doc.eventId });
    if (!eventExists) {
      throw new Error('Cannot create booking for a missing event');
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

bookingSchema.index({ eventId: 1 });

export type Booking = BookingSchema;
export type BookingModel = Model<Booking>;

export const Booking = (models.Booking as BookingModel) ?? model<Booking>('Booking', bookingSchema);

export default Booking;

