import { NS } from "@ns";
import { findOptimalTarget } from 'find-optimal-target.js'
import { Server, dfs } from "server";

/** @param {NS} ns */
export async function main(ns) {
    // Array of all servers that don't need any ports opened
    // to gain root access. These have 16 GB of RAM
    const servers0Port = ["sigma-cosmetics",
                        "joesguns",
                        "nectar-net",
                        "hong-fang-tea",
                        "harakiri-sushi"];

    // Array of all servers that only need 1 port opened
    // to gain root access. These have 32 GB of RAM
    const servers1Port = ["neo-net",
                        "zer0",
                        "max-hardware",
                        "iron-gym"];

    let script = "hack.js";
    let [target, servers] = findOptimalTarget(ns);

    // Get the ram usage of the script
    let ramUsage = ns.getScriptRam(script);

    // Figure out how many ports we can open
    let portsAccessible = 0;
    let programs = ["BruteSSH.exe",
                    "FTPCrack.exe",
                    "relaySMTP.exe",
                    "HTTPWorm.exe",
                    "SQLInject.exe"];
    for (let i = 0; i < programs.length; ++i) {
        if (ns.fileExists(programs[i])) portsAccessible++;
    }

    // Copy our scripts onto each server
    servers.forEach(async (server: Server, name: string, map: Map<string, Server>) => {
        let threads = calculateThreads(ns, name, ramUsage);

        // Copy script over
        ns.scp(script, name);

        if (name != "home") {
            // Open ports
            let portsRequired = ns.getServerNumPortsRequired(name);
            if (portsRequired > 0 && portsRequired <= portsAccessible) {
                for (let i = 0; i < portsRequired; ++i) {
                    switch (programs[i]) {
                        case "BruteSSH.exe": {
                            ns.brutessh(name);
                            break;
                        }
                        case "FTPCrack.exe": {
                            ns.tprint("Running FTPCrack.exe on " + name);
                            ns.ftpcrack(name);
                            break;
                        }
                        case "relaySMTP.exe": {
                            ns.relaysmtp(name);
                            break;
                        }
                        case "HTTPWorm.exe": {
                            ns.httpworm(name);
                            break;
                        }
                        case "SQLInject.exe": {
                            ns.httpworm(name);
                            break;
                        }
                    }
                }

                if (!ns.hasRootAccess(name)) {
                    ns.nuke(name);
                }
            }

        }

        if (threads > 0) {
            // Run script
            ns.exec(script, name, threads, target);
        }
    });
}

function calculateThreads(ns: NS, server: string, ramUsage: number): number {

    // Calculate how many threads we can make
    // Take serverRam / ramUsage, rounded down
    let serverRam = ns.getServerMaxRam(server);
    return Math.floor(serverRam / ramUsage);
}
