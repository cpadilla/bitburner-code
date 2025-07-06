import { NS, StockOrderObject } from "@ns";

export async function main(ns: NS): Promise<void> {
    ns.tprint("Hello Remote API!");

    // Make sure we access to the APIs we need
    if (ns.stock.has4SData() &&
        ns.stock.hasWSEAccount() &&
        ns.stock.has4SDataTIXAPI() &&
        ns.stock.hasTIXAPIAccess()) {
        // Review orders and see if we need to sell any
        //let constants = ns.stock.getConstants();
        let orders = ns.stock.getOrders();

        for (const [key, value] of Object.entries(orders)) {
            ns.tprint(`key = ${key}, value = ${value}`);
        }

        // Look at buying new orders
    }
}
