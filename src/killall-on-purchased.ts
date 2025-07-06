import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {

    let servers = ns.getPurchasedServers();
    servers.forEach((server, index) => {
        ns.killall(server);
    });
}
