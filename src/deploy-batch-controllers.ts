import { NS } from "@ns";
import { findOptimalTarget } from 'find-optimal-target.js'

export async function main(ns: NS): Promise<void> {

    // Get list of servers
    const [target, servers] = findOptimalTarget(ns);

    // Prepare the server for hacking
    ns.exec("prepare-server.js", "home", 1, target);

    // Wait for server to be prepared.
    while (ns.scriptRunning("prepare-server.js", "home")) {
        await ns.sleep(1000);
    }

    for (let i = 0; i < ns.getPurchasedServers().length; i++) {
        const server = ns.getPurchasedServers()[i];

        // Copy scripts over
        ns.scp(["batch-controller.js", "hack.js", "grow.js", "weaken.js"], server);

        // Kill existing scripts
        ns.killall(server);

        // Launch batch controller
        ns.exec("batch-controller.js", server, 1, target, i); // pass instance offset for delay staggering
    }

    ns.tprint("🚀 Batch controllers deployed.");
}
