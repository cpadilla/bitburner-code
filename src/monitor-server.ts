import { NS } from "@ns";
import { findOptimalTarget } from 'find-optimal-target.js'

export async function main(ns: NS) {
    let [optimalTarget, servers] = findOptimalTarget(ns);
    const target = ns.args[0] as string || optimalTarget;

    const history = [];

    while (true) {
        const security = ns.getServerSecurityLevel(target);
        const minSecurity = ns.getServerMinSecurityLevel(target);
        const money = ns.getServerMoneyAvailable(target);
        const maxMoney = ns.getServerMaxMoney(target);

        history.push({
            timestamp: Date.now(),
            security,
            money,
            minSecurity,
            maxMoney
        });

        if (history.length > 1000) history.shift(); // keep memory light

        // Print to terminal or store to file or port
        ns.print(`${target} $${money.toLocaleString(undefined, { maximumFractionDigits: 2 })}/` +
                 `$${maxMoney.toLocaleString(undefined, { maximumFractionDigits: 2 })}, ` +
                 `security: ${security.toFixed(2)}`);

        await ns.sleep(1000);
    }
}
