import { IClubEventRepository } from "../types/repositories/IClubEventRepository";
import { ClubEventForUpdate } from "../models/dtos/event/club-event-for-update";
import { ClubEventForCreate } from "../models/dtos/event/club-event-for-create";
import { ClubEventDoc, clubEvents } from "../models/schemas/club.event.schema";
import { ClubEvent } from "../models/entites/ClubEvent";
import { ClubEventDetailDto } from "../models/dtos/event/club-event-detail-dto";
import { UserDoc, users } from "../models/schemas/user.schema";
import { ClubDoc, clubs } from "../models/schemas/club.schema";
import { injectable } from "inversify";

@injectable()
export class ClubEventRepository implements IClubEventRepository {
  async create(event: ClubEventForCreate): Promise<ClubEvent> {
    return await clubEvents.create(event);
  }
  async update(
    id: string,
    event: ClubEventForUpdate
  ): Promise<ClubEventForUpdate> {
    return await clubEvents.findByIdAndUpdate(id, event, {
      new: true,
    });
  }
  async delete(id: string): Promise<boolean> {
    const result = await clubEvents.findByIdAndDelete(id);
    return result ? true : false;
  }
  async getById(id: string): Promise<ClubEventDoc> {
    return await clubEvents.findById(id);
  }
  async getEventById(id: string): Promise<ClubEventDetailDto> {
    const clubEvent: ClubEvent = await clubEvents.findById(id);

    const organizer: UserDoc = await users.findById(clubEvent.organizer);

    const attendees: Array<UserDoc> = await users.find({
      _id: { $in: clubEvent.attendees },
    });

    const club: ClubDoc = await clubs.findById(clubEvent.club);

    const detailedEvent: ClubEventDetailDto = {
      title: clubEvent.title,
      description: clubEvent.description,
      image: clubEvent.image,
      location: clubEvent.location,
      date: clubEvent.date,
      time: clubEvent.time,
      club: { _id: club._id, name: club.name },
      organizer: {
        _id: organizer._id,
        firstName: organizer.firstName,
        lastName: organizer.lastName,
      },
      isPublic: clubEvent.isPublic,
      isOnline: clubEvent.isOnline,
      attendees: attendees.map((attendee) => ({
        _id: attendee._id,
        firstName: attendee.firstName,
        lastName: attendee.lastName,
      })),
      posts: clubEvent.posts,
      isUpdated: clubEvent.isUpdated,
    };

    return detailedEvent;
  }
  async getAll(): Promise<Array<ClubEvent>> {
    return await clubEvents
      .find()
      .populate("club", "_id name")
      .populate("attendees", "_id firstName lastName")
      .populate("posts", "_id content")
      .sort({ createdAt: -1 });
  }
}
