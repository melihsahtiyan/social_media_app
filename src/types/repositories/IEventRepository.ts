export interface IEventRepository {
  createEvent(event: Event): Promise<Event>;
  getEventById(eventId: string): Promise<Event>;
  getEvents(): Promise<Event[]>;
  getEventsByClubId(clubId: string): Promise<Event[]>;
  updateEvent(eventId: string, event: Event): Promise<Event>;
  deleteEvent(eventId: string): Promise<boolean>;
}
