import type { HydratedDocument, InferSchemaType, Model } from 'mongoose';
import { Schema, model, models } from 'mongoose';

const SLUG_SEPARATOR = '-';

// Clean and stabilize a slug derived from the title for friendly URLs.
const normalizeSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, SLUG_SEPARATOR)
    .replace(new RegExp(`${SLUG_SEPARATOR}+`, 'g'), SLUG_SEPARATOR)
    .replace(new RegExp(`${SLUG_SEPARATOR}$`), '')
    .replace(new RegExp(`^${SLUG_SEPARATOR}`), '');

// Persist only an ISO-8601 calendar date (YYYY-MM-DD).
const normalizeDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid event date');
  }
  return parsed.toISOString().split('T')[0];
};

// Force a consistent 24-hour HH:mm time string, handling optional meridiems.
const normalizeTime = (value: string): string => {
  const match = value.trim().toLowerCase().match(/^([0-9]{1,2})(?::([0-9]{2}))?\s*(am|pm)?$/i);

  if (!match) {
    throw new Error('Invalid event time');
  }

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2] ?? '0', 10);
  const meridiem = match[3]?.toLowerCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error('Invalid event time');
  }

  if (meridiem) {
    hours %= 12;
    if (meridiem === 'pm') {
      hours += 12;
    }
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid event time');
  }

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0 && value.every(isNonEmptyString),
        message: 'Agenda must include at least one item',
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0 && value.every(isNonEmptyString),
        message: 'Tags must include at least one item',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

type EventSchema = InferSchemaType<typeof eventSchema>;
export type EventDocument = HydratedDocument<EventSchema>;

// Guard critical fields, align temporal values, and keep slugs synced with titles.
eventSchema.pre('save', function preSave(next) {
  try {
    const doc = this as EventDocument;

    const requiredFields: Array<keyof EventSchema> = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'date',
      'time',
      'mode',
      'audience',
      'organizer',
    ];

    for (const field of requiredFields) {
      const value = doc[field];
      if (!isNonEmptyString(value)) {
        throw new Error(`Event ${field} is required`);
      }
    }

    if (!Array.isArray(doc.agenda) || doc.agenda.length === 0 || !doc.agenda.every(isNonEmptyString)) {
      throw new Error('Event agenda must include at least one entry');
    }

    if (!Array.isArray(doc.tags) || doc.tags.length === 0 || !doc.tags.every(isNonEmptyString)) {
      throw new Error('Event tags must include at least one entry');
    }

    if (doc.isModified('title') || !isNonEmptyString(doc.slug)) {
      const slug = normalizeSlug(doc.title);
      if (!isNonEmptyString(slug)) {
        throw new Error('Event slug cannot be empty');
      }
      doc.slug = slug;
    }

    doc.date = normalizeDate(doc.date);
    doc.time = normalizeTime(doc.time);

    next();
  } catch (error) {
    next(error as Error);
  }
});

eventSchema.index({ slug: 1 }, { unique: true });

export type Event = EventSchema;
export type EventModel = Model<Event>;

export const Event = (models.Event as EventModel) ?? model<Event>('Event', eventSchema);

export default Event;

