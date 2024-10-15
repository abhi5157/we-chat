import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";

const contacts = [
  {
    id: 1,
    name: "Jasmine Thompson",
    avatar: img1,
    lastMessage: "I hope these articles help.",
  },
  {
    id: 2,
    name: "K2K Group",
    avatar: img2,
    lastMessage: "Lorem ipsum is simply...",
  },
];

function Sidebar({ onSelectContact, activeContactId }) {
  return (
    <div className="w-1/3 bg-white border-r overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Chats</h2>
        <div className="flex space-x-2 mb-4">
          <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
            New
          </button>
          <button className="px-3 py-1 bg-gray-200 rounded-full text-sm">
            Filter
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search contact / chat..."
            className="w-full p-2 pl-8 bg-gray-100 rounded-md"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-2 top-2.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <ul>
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
              activeContactId === contact.id ? "bg-gray-200" : ""
            }`}
            onClick={() => onSelectContact(contact)}
          >
            <div className="flex items-center">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
