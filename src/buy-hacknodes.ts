/// <reference path="../NetscriptDefinitions.d.ts" />
import { NS } from "@ns";

enum Upgrade {
    Level = 1,
    RAM,
    Cores
}

class CheapestUpgrade {
    index: number;
    cost: number;
    type: Upgrade;
    constructor() {
        this.index = -1;
        this.cost = Number.MAX_VALUE;
    };
}

export async function main(ns: NS) {

    // Get the number of nodes we own
    let nodes = ns.hacknet.numNodes();

    while (true) {

        let cheapestUpgrade = new CheapestUpgrade();
        // Check each node and save whichever upgrade is cheapest
        for (let i=0; i<nodes; i++) {
            let upgradeLevelCost = ns.hacknet.getLevelUpgradeCost(i);
            let nodeStats = ns.hacknet.getNodeStats(i);
            if (nodeStats.level < 200 && upgradeLevelCost < cheapestUpgrade.cost) {
                cheapestUpgrade.index = i;
                cheapestUpgrade.cost = upgradeLevelCost;
                cheapestUpgrade.type = Upgrade.Level;
            }
            let upgradeRAMCost = ns.hacknet.getRamUpgradeCost(i);
            if (nodeStats.ram < 64 && upgradeRAMCost < cheapestUpgrade.cost) {
                cheapestUpgrade.index = i;
                cheapestUpgrade.cost = upgradeRAMCost;
                cheapestUpgrade.type = Upgrade.RAM;
            }
            let upgradeCoresCost = ns.hacknet.getCoreUpgradeCost(i);
            if (nodeStats.cores < 16 && upgradeCoresCost < cheapestUpgrade.cost) {
                cheapestUpgrade.index = i;
                cheapestUpgrade.cost = upgradeCoresCost;
                cheapestUpgrade.type = Upgrade.Cores;
            }
        }

        // Get the cost of purchasing a new node
        let purchaseNodeCost = ns.hacknet.getPurchaseNodeCost();

        // If there are no nodes, or purchasing a node is cheaper than upgrading,
        // buy a new node
        if (nodes == 0 || purchaseNodeCost < cheapestUpgrade.cost) {
            // Only buy if we have more than 10% the money of the upgrade
            if (purchaseNodeCost <= ns.getServerMoneyAvailable("home") / 10) {
                // ns.tprint("Purchasing hacknet node.");
                ns.hacknet.purchaseNode();
                nodes++;
            }
        } else {
            // Otherwise, upgrade
            // Only buy if we have more than 10% the money of the upgrade
            if (purchaseNodeCost <= ns.getServerMoneyAvailable("home") / 10) {
                switch (cheapestUpgrade.type) {
                    case (Upgrade.Level): {
                        // ns.tprint(`Upgrading hacknet node ${cheapestUpgrade.index} Level.`);
                        ns.hacknet.upgradeLevel(cheapestUpgrade.index, 1);
                        break;
                    }
                    case (Upgrade.RAM): {
                        // ns.tprint(`Upgrading hacknet node ${cheapestUpgrade.index} RAM.`);
                        ns.hacknet.upgradeRam(cheapestUpgrade.index, 1);
                        break;
                    }
                    case (Upgrade.Cores): {
                        // ns.tprint(`Upgrading hacknet node ${cheapestUpgrade.index} Core.`);
                        ns.hacknet.upgradeCore(cheapestUpgrade.index, 1);
                        break;
                    }
                }
            }
        }

        //Make the script wait for a second before looping again.
        //Removing this line will cause an infinite loop and crash the game.
        await ns.sleep(200);
    }
}
