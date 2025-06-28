import { NS } from "@ns";
import { findOptimalTarget } from 'find-optimal-target.js'

export async function main(ns: NS): Promise<void> {
    let script = "hack.js";
    let serverArg = ns.args[0];
    ns.tprint(typeof serverArg);
    if (typeof serverArg === "string") {
        let server: string  = serverArg;
        let ramUsage = ns.getScriptRam(script);
        const [target, _] = findOptimalTarget(ns);
        let threads = calculateThreads(ns, server, ramUsage);
        ns.tprint("executing " + script + " on " + server + " with " + threads + "threads");
        ns.exec(script, server, threads, target);
    }
    
    // ns.tprint(ns.getServerMaxRam("home"));
    // let ramUsage = ns.getScriptRam("hack.js");
    // ns.tprint(ramUsage);
}

function calculateThreads(ns: NS, server: string, ramUsage: number): number {

    // Calculate how many threads we can make
    // Take serverRam / ramUsage, rounded down
    let serverRam = ns.getServerMaxRam(server);
    return Math.floor(serverRam / ramUsage);
}
