import { ClubForCreate } from "../../models/dtos/club/club-for-create";
import { ClubForUpdateDto } from "../../models/dtos/club/club-for-update-dto";
import { Club } from "../../models/entites/Club";

export interface IClubRepository {
  getClubByName(name: string): Promise<Club>;
  getClubs(): Promise<Club[]>;
  getClubById(id: string): Promise<Club>;
  getById(id: string): Promise<Club>;
  createClub(club: ClubForCreate): Promise<Club>;
  updateClub(id: string, club: ClubForUpdateDto): Promise<Club>;
  updateClubImage(id: string, logo?: string, banner?: string): Promise<Club>;
  updateClubPresident(id: string, updatedPresidentId: string): Promise<Club>;
  deleteClub(id: string): Promise<Club>;
}
