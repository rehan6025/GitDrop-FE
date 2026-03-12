import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Deployment = () => {
    const { deploymentId } = useParams();

    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState("QUEUED");

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3000/ws/deployments");

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: "subscribe",
                    deploymentId,
                }),
            );
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.event === "deployment-update") {
                const data = msg.data;

                if (data.type === "log") {
                    setLogs((prev) => [...prev, data.log]);
                    console.log(data.log);
                }

                if (data.type === "status") {
                    setStatus(data.status);
                    console.log(data.status);
                }
            }
        };

        return () => ws.close();
    }, [deploymentId]);

    return (
        <div>
            <h1>Status: {status}</h1>

            <div>
                {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>
        </div>
    );
};

export default Deployment;
