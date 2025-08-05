import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    const CHART_SCRIPT_ID = "chartjs-lib";
    const CONTAINER_ID = "chartjs-container";

    // Inject Chart.js only once
    if (!document.getElementById(CHART_SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = CHART_SCRIPT_ID;
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.async = false;
        document.head.appendChild(script);
    }

    // Wait until Chart is defined
    while (typeof (window as any).Chart === "undefined") {
        ns.print("⏳ Waiting for Chart.js to load...");
        await ns.sleep(100);
    }

    // Create UI container if it doesn't exist
    if (!document.getElementById(CONTAINER_ID)) {
        const div = document.createElement("div");
        div.id = CONTAINER_ID;
        div.style.position = "fixed";
        div.style.top = "60px";
        div.style.right = "30px";
        div.style.zIndex = "1000";
        div.style.background = "black";
        div.style.border = "1px solid white";
        div.style.padding = "10px";

        div.innerHTML = `<canvas id="chart" width="600" height="300"></canvas>`;
        document.body.appendChild(div);
    }

    let div = document.getElementById(CONTAINER_ID) as HTMLDivElement;

    if (!div) {
        div = document.createElement("div");
        div.id = CONTAINER_ID;
        div.style.position = "fixed";
        div.style.top = "60px";
        div.style.right = "30px";
        div.style.zIndex = "1000";
        div.style.background = "black";
        div.style.border = "1px solid white";
        div.style.padding = "10px";

        // Add close button
        const close = document.createElement("button");
        close.textContent = "×";
        close.style.float = "right";
        close.style.background = "transparent";
        close.style.border = "none";
        close.style.color = "white";
        close.style.fontSize = "20px";
        close.style.cursor = "pointer";
        close.onclick = () => div.remove();
        div.appendChild(close);

        // Add chart canvas
        div.innerHTML += `<canvas id="chart" width="600" height="300"></canvas>`;

        document.body.appendChild(div);
    }

    // @ts-ignore
    const Chart = (window as any).Chart as typeof window.Chart;
    const ctx = (document.getElementById("chart") as HTMLCanvasElement).getContext("2d");

    const chart = new Chart(ctx!, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Money/sec",
                    borderColor: "rgb(75, 192, 192)",
                    data: [],
                    fill: false,
                },
                {
                    label: "XP/sec",
                    borderColor: "rgb(255, 99, 132)",
                    data: [],
                    fill: false,
                },
            ],
        },
        options: {
            animation: false,
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    title: {
                        display: true,
                        text: "Time (s)"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Rate"
                    }
                }
            },
        },
    });

    let lastMoney = ns.getPlayer().money;
    let lastXp = ns.getPlayer().exp.hacking;
    let start = Date.now();

    while (true) {
        await ns.sleep(1000);

        const now = Date.now();
        const timeSec = (now - start) / 1000;
        const currentMoney = ns.getPlayer().money;
        const currentXp = ns.getPlayer().exp.hacking;

        const moneyPerSec = currentMoney - lastMoney;
        const xpPerSec = currentXp - lastXp;

        chart.data.labels!.push(timeSec);
        chart.data.datasets[0].data.push(moneyPerSec);
        chart.data.datasets[1].data.push(xpPerSec);
        chart.update();

        lastMoney = currentMoney;
        lastXp = currentXp;
    }
}
