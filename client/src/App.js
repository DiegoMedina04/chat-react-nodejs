import io from 'socket.io-client';
import './App.css';
import { useEffect, useState } from "react";

const socket = io('http://localhost:4000')

function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('client:message', message)
    const newMessages = {
      body: message,
      from: 'Me'
    }
    setMessages([newMessages, ...messages])
    setMessage('')
  }

  useEffect(() => {
    const receiveMessage = message => {
      setMessages([message, ...messages])
    }
    socket.on('server:message', receiveMessage)

    return () => {
      socket.off('server:message', receiveMessage)
    }
  }, [messages])

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">Chat React</h1>
        <input name="message" type="text" placeholder="Write your message..." onChange={(e) => setMessage(e.target.value)}

          className="border-2 border-zinc-500 p-2 w-full text-black"
          value={message}
          autoFocus
        />
        <button>Enviar</button>
        <ul className="h-80 overflow-y-auto">
          {/* {messages.map((message, index) => (
            <div className={index}>
              <p>{message.from}: {message.body}</p>

            </div>
          ))} */}
          {messages.map((message, index) => (
            <li key={index} className={`my-2 p-2 table text-sm rounded-md ${message.from === "Me" ? "bg-sky-700 ml-auto"
              : "bg-black"}`}>
              <b>{message.from}</b>:{message.body}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;