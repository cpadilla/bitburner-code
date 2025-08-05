import { NS } from "@ns";

export async function main(ns: NS) {
    const startMoney = ns.getPlayer().money;
    const startExp = ns.getPlayer().exp.hacking;
    const startTime = Date.now();

    await ns.sleep(60 * 1000); // Measure over 1 minute

    const endMoney = ns.getPlayer().money;
    const endExp = ns.getPlayer().exp.hacking;
    const endTime = Date.now();
    const durationSec = (endTime - startTime) / 1000;

    const moneyPerSec = (endMoney - startMoney) / durationSec;
    const expPerSec = (endExp - startExp) / durationSec;

    ns.tprint(`💰 Money/sec: $${moneyPerSec.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    ns.tprint(`🧠 XP/sec: ${expPerSec.toFixed(2)}`);
}
