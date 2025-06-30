import { NS } from "@ns";

export function calculateThreads(ns: NS, server: string, ramUsage: number): number {

    // Calculate how many threads we can make
    // Take serverRam / ramUsage, rounded down
    let serverRam = ns.getServerMaxRam(server);
    return Math.floor(serverRam / ramUsage);
}
