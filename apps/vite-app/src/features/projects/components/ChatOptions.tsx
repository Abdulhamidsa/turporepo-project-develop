// import { FC } from 'react';

// interface ChatOptionsProps {
//   sendMessage: (msg: string) => void;
// }

// const ChatOptions: FC<ChatOptionsProps> = ({ sendMessage }) => {
//   const options = [
//     'Suggest improvements',
//     'Find similar projects',
//     'How to monetize',
//     'Analyze audience',
//   ];

//   return (
//     <div className="mt-3 space-y-2">
//       <h4 className="font-semibold text-white">What would you like to do?</h4>
//       {options.map((option, idx) => (
//         <button
//           key={idx}
//           onClick={() => sendMessage(option)}
//           className="w-full rounded bg-blue-500 p-2 text-white transition-all hover:bg-blue-600"
//         >
//           {option}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default ChatOptions;
