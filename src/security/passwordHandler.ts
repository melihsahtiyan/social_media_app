import bcrypt from 'bcryptjs';

const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 12);
};

const comparePassword = async (providedPassword: string, referencePassword: string): Promise<boolean> => {
	return await bcrypt.compare(providedPassword, referencePassword);
};

export const passwordHandler = { hashPassword, comparePassword };
