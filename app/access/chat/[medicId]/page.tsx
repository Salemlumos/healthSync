"use client";
import { useEffect, useRef, useState } from "react";
import { Card, Input } from "antd";
// import { io } from "socket.io-client";
import { IoMdSend } from "react-icons/io";
import * as io from "socket.io-client";
import { usePathname } from "next/navigation";
const Chat = () => {
  const path = usePathname();

  const [socket, setSocket] = useState<any>();
  const [userData, setUserData] = useState<any>();
  const [text, setText] = useState<any>();

  async function joinChat(name: any) {
    console.log("joining");
    console.log(path.split("/")[3]);
    const roomId = path.split("/")[3];
    const socket: any = await io.connect("http://localhost:3001");
    socket.emit("set_username", { username: name, roomId });
    setSocket(socket);
  }

  const [messageList, setMessageList] = useState<any>([]);
  useEffect(() => {
    if (socket != undefined) {
      socket.on("receive_message", (data: any) => {
        if (data != undefined && data.author != undefined) {
          if (userData?.Nome !== data.author.username) {
            audioRef.current.play();
          }
          console.log(data);
          setMessageList((prev: any) => [...prev, data]);
        }
      });
    }
    return () => {
      if (socket && socket.off !== undefined) socket.off();
    };
  }, [socket]);

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData: any = JSON.parse(storedData);
      setUserData(parsedData);
      joinChat(parsedData?.Nome);
      // loadEvents(parsedData.id);
    }
  }, []);

  const user = useRef<any>("");
  const messageRef = useRef<any>("");
  const audioRef: any = useRef<any>("");

  const sendMessage = () => {
    const message = text;
    if (!message.trim()) return;
    socket.emit("message", message);
    clearInput();
  };

  const clearInput = () => {
    setText("");
  };

  return (
    <>
      <audio ref={audioRef} src="/noti.mp3" />
      <Card
        className="w-full m-9 overflow-auto"
        title={"Chat com médico"}
        bordered={true}
      >
        {/* <div>
        <input
          style={{ color: "black" }}
          type="text"
          ref={user}
          value={user.current.value}
        />
        <button onClick={joinChat}>Join</button>
      </div> */}
        {socket !== undefined ? (
          <div className="w-full flex justify-center">
            <div className="w-4/5">
              <div className="w-full">
                {messageList.map((message: any, idx: number) => (
                  <p
                    className={` ${
                      userData?.Nome !== message.author.username
                        ? "text-left bg-green-200"
                        : "text-right bg-blue-200"
                    } p-4 `}
                    key={idx}
                  >
                    {/* {message.author.username}: */}
                    {message.text}
                  </p>
                ))}
                {/* <input
              style={{ color: "black" }}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button onClick={sendMessage}>Enviar</button> */}
              </div>
              <Input.Search
                placeholder="Escreva aqui sua mensagem..."
                allowClear
                value={text}
                onChange={(e) => setText(e.target.value)}
                enterButton={<IoMdSend />}
                size="large"
                onSearch={sendMessage}
              />
            </div>
          </div>
        ) : null}
      </Card>
    </>
  );
};

export default Chat;
