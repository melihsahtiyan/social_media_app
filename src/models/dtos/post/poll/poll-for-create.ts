import { UserDoc } from "../../../schemas/user.schema";

export type PollForCreate = {
  creator: UserDoc;
  options: { optionName: Array<String>; totalVotes: Number }[];
  expiresAt: Date;
  content: { caption: string; mediaUrls: Array<string> };
  type: string;
};
