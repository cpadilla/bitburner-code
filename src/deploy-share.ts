import { NS } from "@ns";

export async function main(ns: NS) {

    const script = "share.js";
    const host = "home";

    const serverMaxRam = ns.getServerMaxRam(host);
    const serverUsedRam = ns.getServerUsedRam(host);
    const availableRam = 0.8 * serverMaxRam - serverUsedRam;

    const shareScriptRam = ns.getScriptRam(script);

    const threads = Math.floor(availableRam / shareScriptRam);

    // ns.exec(script, host, threads);

    const bonus = ns.getSharePower();
    ns.tprint(`🤝 Share Power Bonus: ${(bonus * 100).toFixed(2)}%`);
}
