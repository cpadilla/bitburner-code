import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    ns.ui.openTail();

    const windowSize = 30;
    const history: { time: number, moneyPerSec: number, xpPerSec: number }[] = [];

    let lastMoney = ns.getPlayer().money;
    let lastXp = ns.getPlayer().exp.hacking;
    let lastTime = Date.now();

    while (true) {
        await ns.sleep(1000);

        const now = Date.now();
        const currentMoney = ns.getPlayer().money;
        const currentXp = ns.getPlayer().exp.hacking;

        const deltaSec = (now - lastTime) / 1000;
        const moneyPerSec = (currentMoney - lastMoney) / deltaSec;
        const xpPerSec = (currentXp - lastXp) / deltaSec;

        history.push({
            time: now,
            moneyPerSec,
            xpPerSec,
        });

        if (history.length > windowSize) history.shift();

        const graph = (arr: number[]): string => {
            const max = Math.max(...arr);
            return arr.map(v => {
                const height = Math.floor((v / max) * 7);
                return "▁▂▃▄▅▆▇█"[Math.min(height, 7)] || " ";
            }).join("");
        };

        const moneyHistory = history.map(h => h.moneyPerSec);
        const xpHistory = history.map(h => h.xpPerSec);

        const formattedMoney = moneyPerSec.toLocaleString(undefined, { maximumFractionDigits: 2 });
        const formattedXp = xpPerSec.toLocaleString(undefined, { maximumFractionDigits: 2 });
        const timestamp = new Date(now).toLocaleTimeString();

        ns.clearLog();
        ns.print(`🕒 ${timestamp}`);
        ns.print(`💰 Money/sec: $${formattedMoney}`);
        ns.print(`   ${graph(moneyHistory)}`);
        ns.print(`🧠 XP/sec: ${formattedXp}`);
        ns.print(`   ${graph(xpHistory)}`);

        lastMoney = currentMoney;
        lastXp = currentXp;
        lastTime = now;
    }
}
