import mongoose from 'mongoose';
import { FriendshipService } from '../../../src/application/services/friendship.service';
import { User } from '../../../src/models/entities/User';
import { UserRepository } from '../../../src/persistence/repositories/user-repository';
import { friendMocks } from './friends.mocks';
import { UserDoc } from '../../../src/models/schemas/user.schema';

describe('Friendship Service', () => {
	let userRepository: UserRepository;
	let friendshipService: FriendshipService;

	beforeAll(() => {
		userRepository = new UserRepository();
		friendshipService = new FriendshipService(userRepository);
	});

	describe('Send Friend Request', () => {
		it('should return error message when sending request to self', async () => {
			const result = await friendshipService.sendFriendRequest('mockedId', 'mockedId');

			expect(result.message).toBe('You cannot be Friend of yourself!');
			expect(result.success).toBe(false);
		});

		it('should return error message when user not found', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(() => null);

			const result = await friendshipService.sendFriendRequest('mockedId', 'mockedId2');

			expect(result.message).toBe('You must be logged in!');
			expect(result.success).toBe(false);
		});

		it('should return error message when user to friend not found', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.nonFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(() => null);

			const result = await friendshipService.sendFriendRequest('mockedId', 'mockedId2');

			expect(result.message).toBe('User to Friend not found!');
			expect(result.success).toBe(false);
		});

		it('should return error message when already friend', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyFriendUserMocks[1];
			});

			const result = await friendshipService.sendFriendRequest('mockedId', 'mockedId2');

			expect(result.message).toBe('You are already friends!');
			expect(result.success).toBe(false);
		});

		it('should cancel the request when already requested', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyRequestedUserMocks[0];
			});
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyRequestedUserMocks[1];
			});

			jest.spyOn(User.prototype, 'isFriend').mockReturnValueOnce(false);
			jest.spyOn(User.prototype, 'hasFriendRequest').mockReturnValueOnce(true);

			jest.spyOn(userRepository, 'deleteFriendRequest').mockResolvedValue(friendMocks.nonFriendUserMocks[0] as UserDoc);

			const result = await friendshipService.sendFriendRequest('mockedId', 'mockedId2');

			expect(result.message).toBe('Friend request cancelled!');
			expect(result.success).toBe(true);
		});

		it('should send friend request when they are not friend and not requested to be friend', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.nonFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.nonFriendUserMocks[1];
			});

			jest
				.spyOn(userRepository, 'sendFriendRequest')
				.mockResolvedValue(friendMocks.alreadyRequestedUserMocks[0] as UserDoc);

			const result = await friendshipService.sendFriendRequest('mockedId', 'mockedId2');

			expect(result.message).toBe('Friend request sent!');
			expect(result.success).toBe(true);
		});

		it('should return error message when user is not verified', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.nonFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.invalidUserMocks.unverifiedUserMock;
			});

			jest.spyOn(User.prototype, 'isVerifiedUser').mockReturnValueOnce(false);
			jest.spyOn(User.prototype, 'isVerifiedUser').mockReturnValueOnce(true);

			const result = await friendshipService.sendFriendRequest('mockedId', 'mockedId2');

			expect(result.message).toBe('User must be verified to be friend!');
			expect(result.success).toBe(false);
		});
	});

	describe('Handle Friend Request', () => {
		it('should return error message when user not found', async () => {
			jest.spyOn(userRepository, 'get').mockResolvedValue(null);

			const result = await friendshipService.handleFriendRequest('mockedId', 'mockedId2', true);

			expect(result.message).toBe('You must be logged in!');
			expect(result.success).toBe(false);
		});

		it('should return error message when user to friend not found', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.nonFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return null;
			});

			const result = await friendshipService.handleFriendRequest('mockedId', 'mockedId2', true);

			expect(result.message).toBe('User not found!');
			expect(result.success).toBe(false);
		});

		it('should return error message when already friend', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyFriendUserMocks[1];
			});

			const result = await friendshipService.handleFriendRequest('mockedId', 'mockedId2', true);

			expect(result.message).toBe('You are already friends!');
			expect(result.success).toBe(false);
		});

		it('should return error message when not requested to be friend', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.nonFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.nonFriendUserMocks[1];
			});

			const result = await friendshipService.handleFriendRequest('mockedId', 'mockedId2', true);

			expect(result.message).toBe('No follow request found!');
			expect(result.success).toBe(false);
		});

		it('should accept the request when requested to be friend', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyRequestedUserMocks[1];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyRequestedUserMocks[0];
			});

			jest.spyOn(User.prototype, 'isFriend').mockReturnValue(false);
			jest.spyOn(User.prototype, 'hasFriendRequest').mockReturnValue(true);

			jest
				.spyOn(userRepository, 'acceptFriendRequest')
				.mockResolvedValue(friendMocks.alreadyFriendUserMocks[1] as UserDoc);

			const result = await friendshipService.handleFriendRequest('mockedId', 'mockedId2', true);

			expect(result.message).toBe('Friend request accepted!');
			expect(result.success).toBe(true);
		});

		it('should reject the request when requested to be friend', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyRequestedUserMocks[1];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyRequestedUserMocks[0];
			});

			jest.spyOn(User.prototype, 'isFriend').mockReturnValue(false);
			jest.spyOn(User.prototype, 'hasFriendRequest').mockReturnValue(true);

			jest.spyOn(userRepository, 'rejectFriendRequest').mockResolvedValue(friendMocks.nonFriendUserMocks[1] as UserDoc);

			const result = await friendshipService.handleFriendRequest('mockedId', 'mockedId2', false);

			expect(result.message).toBe('Friend request rejected!');
			expect(result.success).toBe(true);
		});
	});

	describe('Unfriend', () => {
		it('should return error message when one of the users not found', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockResolvedValue(null);

			const result = await friendshipService.unfriend('mockedId', 'mockedId2');

			expect(result.message).toBe('User not found!');
			expect(result.success).toBe(false);
		});

		it('should return error message when users are not friend', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.nonFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.nonFriendUserMocks[1];
			});

			jest.spyOn(User.prototype, 'isFriend').mockReturnValue(false);

			const result = await friendshipService.unfriend('mockedId', 'mockedId2');

			expect(result.message).toBe('You are not friends!');
			expect(result.success).toBe(false);
		});

		it('should unfriend the users with valid inputs', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyFriendUserMocks[0];
			});

			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return friendMocks.alreadyFriendUserMocks[1];
			});

			jest.spyOn(User.prototype, 'isFriend').mockReturnValue(true);

			jest.spyOn(userRepository, 'removeFriend').mockResolvedValue(friendMocks.nonFriendUserMocks[0] as UserDoc);

			const result = await friendshipService.unfriend('mockedId', 'mockedId2');

			expect(result.message).toBe('User unfriended!');
			expect(result.success).toBe(true);
		});
	});
});
