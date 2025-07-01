import { NS } from "@ns";

export function calculateThreads(ns: NS, server: string, ramUsage: number): number {

    // Calculate how many threads we can make
    // Take serverRam / ramUsage, rounded down
    let serverRamAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    // If this is home server, utilize 80% of ram to leave space for other scripts to run
    if (server === "home")
        serverRamAvailable *= 0.8;
    return Math.floor(serverRamAvailable / ramUsage);
}
