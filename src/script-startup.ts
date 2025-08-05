import { NS } from "@ns";
import { findOptimalTarget } from 'find-optimal-target.js'
import { calculateThreads } from 'util.js'
import { Server, dfs } from "server";

export async function main(ns: NS) {

    let script = "basic-hack.js";
    let [target, servers] = findOptimalTarget(ns);
    if (ns.args.length > 0) {
        target = ns.args[0] as string;
    }
    ns.tprint(`Targeting ${target}`);

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
                            ns.sqlinject(name);
                            break;
                        }
                    }
                }
            }

            // If we have access to the ports
            if (portsRequired <= portsAccessible) {
                // If we don't have root access, nuke it
                if (!ns.hasRootAccess(name) && name !== "home") {
                    if (!ns.nuke(name)) {
                        ns.tprint(`Nuke failed to run on ${name}`);
                    }
                }

                // If we can fit threads on it, run it
                if (threads > 0) {
                    // Run script
                    let pid = ns.exec(script, name, threads, target);
                    if (pid === 0) {
                        ns.tprint(`Failed to run ${script} on ${name}.`);
                    }
                }
            }

        } else {
            // If this is home, check if we have space to run it
            if (threads > 0) {
                // Run script
                let pid = ns.exec(script, name, threads, target);
                if (pid === 0) {
                    ns.tprint(`Failed to run ${script} on ${name}.`);
                }
            }
        }
    });
}
