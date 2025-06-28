import { NS } from "@ns";
import { Server, dfs } from "server";

export function findOptimalTarget(ns: NS): [string, Map<string, Server>] {

    // Get hacking level
    var hackingLevel = ns.getHackingLevel();

    // Depth first search through the network
    // Create the parent node
    let maxMoney = ns.getServerMaxMoney("home");
    let minimumSecurityLevel = ns.getServerMinSecurityLevel("home");
    let requiredHackingLevel = ns.getServerRequiredHackingLevel("home");
    var home = new Server("home", maxMoney, minimumSecurityLevel, requiredHackingLevel);

    // Save a map of the nodes
    var servers: Map<string, Server> = new Map();

    // traverse the tree
    dfs(ns, home, servers);

    // Go through the list of nodes and find the best target
    // As a rule of thumb, your hacking target should be the Server that has the highest ratio of `MaxMoney / MinimumSecurityLevel` and its `RequiredHackingLevel` is under half of your hacking level.
    let highestRatio = 0;
    let bestServer = home;
    servers.forEach((server: Server, name: string, map: Map<string, Server>) => {
        if (server.ratio > highestRatio && server.requiredHackingLevel < hackingLevel / 2 ) {
            highestRatio = server.ratio;
            bestServer = server;
        }
    });

    ns.tprint("Targeting " + bestServer.name);
    return [bestServer.name, servers];
}
