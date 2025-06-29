import { NS } from "@ns";
import { findOptimalTarget } from 'find-optimal-target.js'

export async function main(ns: NS): Promise<void> {

    let server = ns.args[0];
    if (typeof server === "string") {
        ns.singularity.connect(server);
        // ns.singularity.installBackdoor();
    } else {
        ns.tprint("Provide the name of the server to backdoor.");
    }
}
