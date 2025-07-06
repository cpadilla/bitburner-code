import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {

    if (!ns.formulas) {
        ns.tprint("❌ You need Formulas.exe for this script to work.");
        return;
    }

    const target = ns.args[0] as string;
    const offsetIndex = parseInt(ns.args[1] as string || "0"); // Used for staggering batches

    const host = ns.getHostname();
    const player = ns.getPlayer();
    const server = ns.getServer(target);

    // Make sure it's a hackable server
    if (!server.hasAdminRights || server.moneyMax === undefined || server.moneyMax === 0) {
        ns.tprint(`❌ Target '${target}' is not a valid hackable server.`);
        return;
    }

    const hackScript = "hack.js";
    const growScript = "grow.js";
    const weakenScript = "weaken.js";

    const hackRam = ns.getScriptRam(hackScript);
    const growRam = ns.getScriptRam(growScript);
    const weakenRam = ns.getScriptRam(weakenScript);

    // Desired hack amount (e.g. 10% of money)
    const hackPercent = 0.1;

    // 1. Calculate threads needed to hack desired % of money
    const hackPercentPerThread = ns.formulas.hacking.hackPercent(server, player);
    const hackThreads = Math.ceil(hackPercent / hackPercentPerThread);

    // 2. Calculate grow threads to restore hacked money
    const newServer = { ...server }; // Clone and simulate after hack
    newServer.moneyAvailable = server.moneyMax * (1 - hackPercent);

    const minGrowthMultiplier = 1.01; // Force at least 1% growth needed
    const actualGrowthMultiplier = server.moneyMax / newServer.moneyAvailable;
    const growthMultiplier = Math.max(actualGrowthMultiplier, minGrowthMultiplier);
    const growThreads = Math.max(1, Math.ceil(ns.formulas.hacking.growThreads(newServer, player, growthMultiplier)));

    // 3. Calculate weaken threads to offset security from hack + grow
    const hackSecurityIncrease = 0.002 * hackThreads;
    const growSecurityIncrease = 0.004 * growThreads;
    const weakenEffectPerThread = ns.weakenAnalyze(1);
    const weakenThreadsHack = Math.ceil(hackSecurityIncrease / weakenEffectPerThread);
    const weakenThreadsGrow = Math.ceil(growSecurityIncrease / weakenEffectPerThread);

    ns.tprint(`📊 Threads for ${target}`);
    ns.tprint(`- hackThreads: ${hackThreads}`);
    ns.tprint(`- growThreads: ${growThreads}`);
    ns.tprint(`- weakenThreadsHack: ${weakenThreadsHack}`);
    ns.tprint(`- weakenThreadsGrow: ${weakenThreadsGrow}`);

    const delayGap = 200; // ms between each step
    const batchSpacing = 4000; // ms between batches
    const staggerDelay = offsetIndex * 500; // Delay to stagger between servers

    await ns.sleep(staggerDelay); // Initial stagger

    while (true) {
        const totalRam = ns.getServerMaxRam(host);
        const usedRam = ns.getServerUsedRam(host);
        let freeRam = totalRam - usedRam;
        if (host === "home") {
            freeRam *= 0.8;
        }

        const ramNeeded =
            hackThreads * hackRam +
            growThreads * growRam +
            (weakenThreadsHack + weakenThreadsGrow) * weakenRam;

        if (ramNeeded > freeRam) {
            ns.print("⏳ Not enough RAM, waiting...");
            await ns.sleep(1000);
            continue;
        }

        const now = Date.now();
        const hackTime = ns.getHackTime(target);
        const growTime = ns.getGrowTime(target);
        const weakenTime = ns.getWeakenTime(target);

        // Calculate delays so scripts finish in this order:
        // hack → weaken1 → grow → weaken2
        const weaken1Delay = weakenTime - hackTime + delayGap;
        const growDelay = weakenTime - growTime + 2 * delayGap;
        const weaken2Delay = 3 * delayGap;

        // Launch batch scripts
        ns.exec(hackScript, host, hackThreads, target, 0);
        ns.exec(weakenScript, host, weakenThreadsHack, target, weaken1Delay);
        ns.exec(growScript, host, growThreads, target, growDelay);
        ns.exec(weakenScript, host, weakenThreadsGrow, target, weaken2Delay);

        ns.print(`🚀 Batch launched at ${new Date(now).toLocaleTimeString()}`);
        await ns.sleep(batchSpacing);
    }
}
