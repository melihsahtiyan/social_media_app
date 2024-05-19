import { ClubInputDto } from "../../models/dtos/club/club-input-dto";
import { DataResult } from "../result/DataResult";
import { Result } from "../result/Result";
import { Club } from "../../models/entites/Club";
import { ClubForUpdateDto } from "../../models/dtos/club/club-for-update-dto";

export interface IClubService {
  getAllClubs(): Promise<DataResult<Array<Club>>>;
  getClubById(id: string): Promise<DataResult<Club>>;
  createClub(
    club: ClubInputDto,
    logo: Express.Multer.File
  ): Promise<DataResult<Club>>;
  updateClub(
    id: string,
    club: ClubForUpdateDto,
    organizerId: string
  ): Promise<DataResult<Club>>;
  updateClubLogo(
    id: string,
    logo: Express.Multer.File,
    organizerId: string
  ): Promise<DataResult<Club>>;
  updateClubBanner(
    id: string,
    banner: Express.Multer.File,
    organizerId: string
  ): Promise<DataResult<Club>>;
  updateClubPresident(
    id: string,
    presidentId: string,
    updatedPresidentId: string
  ): Promise<DataResult<Club>>;
  deleteClub(id: string, userId: string): Promise<Result>;
}
