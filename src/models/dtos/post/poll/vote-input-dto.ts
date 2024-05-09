import { Schema } from "mongoose";

export type VoteInputDto = {
    pollId: string;
    userId: string;
    option: string;
};
