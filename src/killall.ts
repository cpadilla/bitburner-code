import { NS } from "@ns";
import { Server, dfs } from "server";

export async function main(ns: NS): Promise<void> {

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

    servers.forEach((server: Server, name: string, map: Map<string, Server>) => {
        ns.tprint(name);
        if (name != "home") {
            ns.killall(name);
        }
    });
}
