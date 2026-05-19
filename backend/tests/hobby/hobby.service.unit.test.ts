import { describe, expect, it, vi } from 'vitest';
import {
  HobbyAlreadyInProfileError,
  HobbyNotFoundError,
  HobbyNotInProfileError,
} from '@/src/modules/hobby/hobby.errors';
import type { HobbyRepository } from '@/src/modules/hobby/hobby.repository';
import { HobbyService } from '@/src/modules/hobby/hobby.service';

const createRepositoryMock = () => ({
  search: vi.fn(),
  findById: vi.fn(),
  findByUserId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  exists: vi.fn(),
  isUserLinkedToHobby: vi.fn(),
  addUserToHobby: vi.fn(),
  removeUserFromHobby: vi.fn(),
});

describe('HobbyService (unit)', () => {
  it('searches hobbies with default pagination', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.search.mockResolvedValue([{ id: 'h1', name: 'Running' }]);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    const result = await service.search('run');

    expect(result).toEqual([{ id: 'h1', name: 'Running' }]);
    expect(repositoryMock.search).toHaveBeenCalledWith('run', {
      limit: 10,
      offset: 0,
    });
  });

  it('searches hobbies with custom pagination', async () => {
    const repositoryMock = createRepositoryMock();

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    await service.search('run', 5, 20);

    expect(repositoryMock.search).toHaveBeenCalledWith('run', {
      limit: 5,
      offset: 20,
    });
  });

  it('gets hobby by id', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.findById.mockResolvedValue({ id: 'h1', name: 'Reading' });

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    const result = await service.getById('h1');

    expect(result).toEqual({ id: 'h1', name: 'Reading' });
    expect(repositoryMock.findById).toHaveBeenCalledWith('h1');
  });

  it('maps getByUserId result to include sessionCount', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.findByUserId.mockResolvedValue([
      {
        id: 'h1',
        name: 'Chess',
        description: 'Board game',
        _count: { hobbySessions: 4 },
      },
    ]);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    const result = await service.getByUserId('u1');

    expect(result).toEqual([
      {
        id: 'h1',
        name: 'Chess',
        description: 'Board game',
        sessionCount: 4,
      },
    ]);
    expect(repositoryMock.findByUserId).toHaveBeenCalledWith('u1');
  });

  it('creates hobby', async () => {
    const repositoryMock = createRepositoryMock();
    const payload = { name: 'Cycling', description: 'Road rides' };
    repositoryMock.create.mockResolvedValue({ id: 'h1', ...payload });

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    const result = await service.create(payload);

    expect(result).toEqual({ id: 'h1', ...payload });
    expect(repositoryMock.create).toHaveBeenCalledWith(payload);
  });

  it('updates hobby when it exists', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(true);
    repositoryMock.update.mockResolvedValue({ id: 'h1', name: 'New name' });

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    const result = await service.update('h1', { name: 'New name' });

    expect(result).toEqual({ id: 'h1', name: 'New name' });
    expect(repositoryMock.exists).toHaveBeenCalledWith('h1');
    expect(repositoryMock.update).toHaveBeenCalledWith('h1', {
      name: 'New name',
    });
  });

  it('throws HobbyNotFoundError in update when hobby does not exist', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(false);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    await expect(
      service.update('missing', { name: 'New name' }),
    ).rejects.toBeInstanceOf(HobbyNotFoundError);
    expect(repositoryMock.update).not.toHaveBeenCalled();
  });

  it('deletes hobby when it exists', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(true);
    repositoryMock.delete.mockResolvedValue({ id: 'h1' });

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    const result = await service.delete('h1');

    expect(result).toEqual({ id: 'h1' });
    expect(repositoryMock.exists).toHaveBeenCalledWith('h1');
    expect(repositoryMock.delete).toHaveBeenCalledWith('h1');
  });

  it('throws HobbyNotFoundError in delete when hobby does not exist', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(false);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    await expect(service.delete('missing')).rejects.toBeInstanceOf(
      HobbyNotFoundError,
    );
    expect(repositoryMock.delete).not.toHaveBeenCalled();
  });

  it('adds hobby to user profile', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(true);
    repositoryMock.isUserLinkedToHobby.mockResolvedValue(false);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    const result = await service.addToProfile('u1', 'h1');

    expect(result.success).toBe(true);
    expect(repositoryMock.exists).toHaveBeenCalledWith('h1');
    expect(repositoryMock.isUserLinkedToHobby).toHaveBeenCalledWith('u1', 'h1');
    expect(repositoryMock.addUserToHobby).toHaveBeenCalledWith('u1', 'h1');
  });

  it('throws HobbyNotFoundError in addToProfile when hobby is missing', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(false);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    await expect(service.addToProfile('u1', 'missing')).rejects.toBeInstanceOf(
      HobbyNotFoundError,
    );
    expect(repositoryMock.isUserLinkedToHobby).not.toHaveBeenCalled();
    expect(repositoryMock.addUserToHobby).not.toHaveBeenCalled();
  });

  it('throws HobbyAlreadyInProfileError in addToProfile when already linked', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(true);
    repositoryMock.isUserLinkedToHobby.mockResolvedValue(true);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    await expect(service.addToProfile('u1', 'h1')).rejects.toBeInstanceOf(
      HobbyAlreadyInProfileError,
    );
    expect(repositoryMock.addUserToHobby).not.toHaveBeenCalled();
  });

  it('removes hobby from user profile', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(true);
    repositoryMock.isUserLinkedToHobby.mockResolvedValue(true);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    const result = await service.removeFromProfile('u1', 'h1');

    expect(result).toEqual({ success: true });
    expect(repositoryMock.removeUserFromHobby).toHaveBeenCalledWith('u1', 'h1');
  });

  it('throws HobbyNotFoundError in removeFromProfile when hobby is missing', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(false);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    await expect(
      service.removeFromProfile('u1', 'missing'),
    ).rejects.toBeInstanceOf(HobbyNotFoundError);
    expect(repositoryMock.isUserLinkedToHobby).not.toHaveBeenCalled();
    expect(repositoryMock.removeUserFromHobby).not.toHaveBeenCalled();
  });

  it('throws HobbyNotInProfileError in removeFromProfile when not linked', async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.exists.mockResolvedValue(true);
    repositoryMock.isUserLinkedToHobby.mockResolvedValue(false);

    const service = new HobbyService(
      repositoryMock as unknown as HobbyRepository,
    );

    await expect(service.removeFromProfile('u1', 'h1')).rejects.toBeInstanceOf(
      HobbyNotInProfileError,
    );
    expect(repositoryMock.removeUserFromHobby).not.toHaveBeenCalled();
  });
});
