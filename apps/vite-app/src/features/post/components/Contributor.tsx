const users = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
];

function Contributor() {
  return (
    <>
      <h2>Contributors</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded-lg shadow-md">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mb-4" />
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Contributor;
