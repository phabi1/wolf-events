import { EventDetails } from "../models/event-details";
import { Event } from "../models/event";

class EventService {
  async items(): Promise<{ items: Event[]; total: number }> {
    const res = await fetch("/wp-json/wolf-events/v1/events");
    const data = await res.json();

    return {
      items: data.items.map((item: any) => this.unserialize(item)),
      total: data.total,
    };
  }

  async item(eventId: string): Promise<EventDetails> {
    const res = await fetch(`/wp-json/wolf-events/v1/events/${eventId}`);
    const data = await res.json();
    const entity = this.unserialize(data);
    return entity;
  }

  async create(data: any) {
    const res = await fetch("/wp-json/wolf-events/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async update(eventId: string, data: any) {
    const res = await fetch(`/wp-json/wolf-events/v1/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async delete(eventId: string) {
    await fetch(`/wp-json/wolf-events/v1/events/${eventId}`, {
      method: "DELETE",
    });
  }

  async participants(eventId: string) {
    const res = await fetch(
      `/wp-json/wolf-events/v1/events/${eventId}/participants`,
    );
    const data = await res.json();
    return data.items;
  }

  async printParticipants(eventId: string) {
    const res = await fetch(
      `/wp-json/wolf-events/v1/events/${eventId}/participants/print`,
    );
    const data = await res.json();
    return data;
  }

  private serialize(data: any) {
    return {
      ...data,
      event_start: data.event_start ? data.event_start.toISOString() : null,
      event_end: data.event_end ? data.event_end.toISOString() : null,
    };
  }

  private unserialize(data: any) {
    return {
      ...data,
      event_start: data.event_start ? new Date(data.event_start) : null,
      event_end: data.event_end ? new Date(data.event_end) : null,
      sessions: (data.sessions || []).map((session: any) => ({
        ...session,
        session_start: session.session_start
          ? new Date(session.session_start * 1000)
          : null,
        session_end: session.session_end
          ? new Date(session.session_end * 1000)
          : null,
      })),
      tickets: (data.tickets || []).map((ticket: any) =>
        this.unserialize(ticket),
      ),
    };
  }
}

export default new EventService();
