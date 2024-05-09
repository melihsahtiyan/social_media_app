interface PollInputDto {
  content: { caption: string; mediaUrls: Array<string> };
  question: string;
  options: Array<string>;
  expiresAt: Date;
}
export { PollInputDto };
