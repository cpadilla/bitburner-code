import { NS } from "@ns";

export async function main(ns: NS) {
    const interval = 1000; // 1 second
    const history: {
        timestamp: number;
        moneyPerSec: number;
        xpPerSec: number;
    }[] = [];

    let prevMoney = ns.getPlayer().money;
    let prevXp = ns.getPlayer().exp.hacking;
    let prevTime = Date.now();

    while (true) {
        await ns.sleep(interval);

        const currMoney = ns.getPlayer().money;
        const currXp = ns.getPlayer().exp.hacking;
        const currTime = Date.now();

        const deltaSec = (currTime - prevTime) / 1000;
        const moneyPerSec = (currMoney - prevMoney) / deltaSec;
        const xpPerSec = (currXp - prevXp) / deltaSec;

        history.push({ timestamp: currTime, moneyPerSec, xpPerSec });
        if (history.length > 1000) history.shift();

        prevMoney = currMoney;
        prevXp = currXp;
        prevTime = currTime;

        // Optional: send to port or write to log
        const record = history[0];
        const formattedTime = new Date(record.timestamp).toLocaleTimeString();
        const formattedMoney = record.moneyPerSec.toLocaleString(undefined, { maximumFractionDigits: 2 });
        const formattedXp = record.xpPerSec.toLocaleString(undefined, { maximumFractionDigits: 2 });

ns.tprint(`${formattedTime}: $${formattedMoney}/s, XP: ${formattedXp}/s`);
    }
}
