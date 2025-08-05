import { NS } from "@ns";

export async function main(ns: NS) {

    ns.ui.openTail();
    ns.disableLog("ALL");

    while (true) {
      const money = ns.getServerMoneyAvailable("n00dles");
      ns.clearLog();
      ns.print(`💰 Money: $${money.toLocaleString()}`);
      await ns.sleep(1000);
    }
}
