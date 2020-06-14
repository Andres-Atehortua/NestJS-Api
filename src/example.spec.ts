class FriendsList {
  friends = [];

  addFriend(name: string): void {
    this.friends.push(name);
    this.sayHiToFriend(name);
  }

  sayHiToFriend(name: string): void {
    console.log(`Hi ${name}`);
  }

  deleteFriend(name: string): void {
    const idx = this.friends.indexOf(name);
    if (idx === -1) {
      throw new Error('No existe');
    }
    this.friends.splice(idx, 1);
  }
}

describe('Test para la clase FriendsList', () => {
  let friendsList;
  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('should initialize friends', () => {
    expect(friendsList.friends.length).toEqual(0);
  });
  it('should add new friend', () => {
    friendsList.sayHiToFriend = jest.fn();
    expect(friendsList.sayHiToFriend).not.toHaveBeenCalled();
    friendsList.addFriend('Andres');
    expect(friendsList.friends.length).toEqual(1);
    expect(friendsList.sayHiToFriend).toHaveBeenCalledTimes(1);
  });

  describe('remove friend', () => {
    it('removes a friend from the list', () => {
      friendsList.addFriend('Andres');
      expect(friendsList.friends.length).toEqual(1);
      friendsList.deleteFriend('Andres');
      expect(friendsList.friends.length).toEqual(0);
    });
    it('throw an error', () => {
      expect(() => friendsList.deleteFriend('Andres')).toThrowError(
        new Error('No existe'),
      );
    });
  });
});
