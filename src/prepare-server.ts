import { NS } from "@ns";

export async function main(ns: NS) {

    const target = ns.args[0] as string;
    const host = ns.getHostname();
    const weakenScript = "weaken.js";
    const growScript = "grow.js";

    const weakenEffectPerThread = ns.weakenAnalyze(1);
    const growScriptRam = ns.getScriptRam(growScript);
    const weakenScriptRam = ns.getScriptRam(weakenScript);

    while (true) {
        const availableRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
        const currentSecurity = ns.getServerSecurityLevel(target);
        const minSecurity = ns.getServerMinSecurityLevel(target);
        const securityDelta = currentSecurity - minSecurity;

        const currentMoney = ns.getServerMoneyAvailable(target);
        const maxMoney = ns.getServerMaxMoney(target);
        const moneyDelta = maxMoney - currentMoney;

        let weakenThreads = 0;
        let growThreads = 0;

        // If security is too high, calculate weaken threads
        if (securityDelta > 0.1) {
            weakenThreads = Math.ceil(securityDelta / weakenEffectPerThread);
        }

        // If money is too low, calculate grow threads
        if (moneyDelta > 1e4) {
            const growthRatio = maxMoney / Math.max(currentMoney, 1);
            growThreads = Math.ceil(ns.growthAnalyze(target, growthRatio));
        }

        // Try to fit as many threads as we can into available RAM
        const totalWeakenRam = weakenThreads * weakenScriptRam;
        const totalGrowRam = growThreads * growScriptRam;

        const canWeaken = weakenThreads > 0 && totalWeakenRam <= availableRam;
        const canGrow = growThreads > 0 && totalGrowRam <= availableRam;

        if (canWeaken) {
            ns.exec(weakenScript, host, weakenThreads, target);
            ns.print(`🔻 Weakening ${target} with ${weakenThreads} threads.`);
        }

        if (canGrow) {
            ns.exec(growScript, host, growThreads, target);
            ns.print(`💹 Growing ${target} with ${growThreads} threads.`);
        }

        if (!canWeaken && !canGrow) {
            ns.print("⏳ Not enough RAM. Waiting...");
        }

        if (securityDelta <= 0.1 && moneyDelta <= 1e4) {
            let securityLevel = ns.getServerSecurityLevel(target);
            let moneyAvailable = ns.getServerMoneyAvailable(target);
            let maxMoney = ns.getServerMaxMoney(target);
            ns.tprint(`✅ Server prepped: ${target}. Security: ${securityLevel}, Money: $${moneyAvailable.toLocaleString()} / $${maxMoney.toLocaleString()}`);
            break;
        }

        await ns.sleep(1000); // Wait a bit for next update cycle
    }

}
