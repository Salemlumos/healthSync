"use client";
import { Card } from "antd";
import { useEffect, useState } from "react";
export default function Home() {
  const [userData, setUserData] = useState<any>(null);

  // Load data from local storage on the client side
  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData: any = JSON.parse(storedData);
      setUserData(parsedData);
    }
  }, []);

  return (
    <Card className="w-full m-9" title="Menu Principal" bordered={true}>
      <div>
        <h3>Seja bem vindo {userData?.Nome || "n"}!</h3>
      </div>
    </Card>
  );
}
