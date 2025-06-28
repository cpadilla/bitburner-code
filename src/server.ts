import { NS } from "@ns";

export class Server {
    name: string;
    maxMoney: number;
    minimumSecurityLevel: number;
    requiredHackingLevel: number;
    ratio: number;
    parent: Server;
    children: Server[] = [];

    constructor(name: string, maxMoney: number, minimumSecurityLevel: number, requiredHackingLevel: number) {
            this.name = name;
            this.maxMoney = maxMoney;
            this.minimumSecurityLevel = minimumSecurityLevel;
            this.requiredHackingLevel = requiredHackingLevel;
            this.ratio = maxMoney / minimumSecurityLevel;
    }
}

export function dfs(ns: NS, node: Server, servers: Map<string, Server>) {

    if (servers.has(node.name)) return;

    // Add this Server to the visited list
    servers.set(node.name, node);

    // Get the list of children
    let children = ns.scan(node.name);
    for (let i = 0; i<children.length; ++i) {
        let name = children[i];

        if (servers.has(name)) continue;

        // Create the child node
        let maxMoney = ns.getServerMaxMoney(name);
        let minimumSecurityLevel = ns.getServerMinSecurityLevel(name);
        let requiredHackingLevel = ns.getServerRequiredHackingLevel(name);
        var child = new Server(name, maxMoney, minimumSecurityLevel, requiredHackingLevel);

        // Add the child to the parent
        node.children.push(child);

        dfs(ns, child, servers);
    }

}
