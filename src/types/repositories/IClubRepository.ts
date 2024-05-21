import { ClubDoc } from "../../models/schemas/club.schema";
import { ClubDetailDto } from "../../models/dtos/club/club-detail-dto";
import { ClubForCreate } from "../../models/dtos/club/club-for-create";
import { ClubForUpdateDto } from "../../models/dtos/club/club-for-update-dto";
import { Club } from "../../models/entites/Club";

export interface IClubRepository {
  getClubByName(name: string): Promise<Club>;
  getClubs(): Promise<Club[]>;
  getClubById(id: string): Promise<Club>;
  getById(id: string): Promise<Club>;
  getClubByOrganizerId(organizerId: string): Promise<ClubDoc>;
  createClub(club: ClubForCreate): Promise<ClubForCreate>;
  updateClub(id: string, club: ClubForUpdateDto): Promise<ClubForUpdateDto>;
  updateClubImage(
    id: string,
    logo?: string,
    banner?: string
  ): Promise<ClubForUpdateDto>;
  updateClubPresident(
    id: string,
    updatedPresidentId: string
  ): Promise<ClubForUpdateDto>;
  deleteClub(id: string): Promise<Club>;
}
