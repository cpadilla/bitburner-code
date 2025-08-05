import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {

    let gangmembernames = [
        "Pusha T",
        "Kanye West",
        "A$AP Rocky",
        "6lack",
        "Travis Scott",
        "Drake",
        "Tyler, The Creator",
        "Kendrick Lamar",
        "Lil Wayne",
        "Future",
        "El P",
        "Killer Mike",
    ]

    let augmentations = [
        "Bionic Arms",
        "Bionic Legs",
        "Bionic Spine",
        "BrachiBlades",
        "Nanofiber Weave",
        "Synthetic Heart",
        "Synfibril Muscle",
        "Bitwire",
        "Neuralstimulator",
        "DataJack",
        "Graphene Bone Lacings",
    ]

    var layLow: boolean = false;

    while (true) {

        let gang = ns.gang.getGangInformation();

        // If we can recruit a new gang member
        if (ns.gang.canRecruitMember()) {
            let gangmembers = ns.gang.getMemberNames()
            if (ns.gang.recruitMember(gangmembernames[gangmembers.length])) {
                // Gang member recruited successfully
            }
        }

        var skillLevel = 200;

        // For each gang member, assign activities
        let gangmembers = ns.gang.getMemberNames();
        gangmembers.forEach((name) => {
            ns.print(`Wanted Penalty: ${(1 - gang.wantedPenalty) * 100}`);
            let wantedPenalty = (1 - gang.wantedPenalty) * 100;
            let member = ns.gang.getMemberInformation(name);
            if (member.hack < skillLevel) {
                ns.gang.setMemberTask(member.name, "Train Hacking");
            } else if (member.str < skillLevel ||
                       member.def < skillLevel ||
                       member.dex < skillLevel ||
                       member.agi < skillLevel) {
                ns.gang.setMemberTask(member.name, "Train Combat");
            } else if (member.cha < skillLevel) {
                ns.gang.setMemberTask(member.name, "Train Charisma");
            } else if (wantedPenalty > 5 || (layLow === true && wantedPenalty > 0.01)) {
                layLow = true;
                ns.gang.setMemberTask(member.name, "Vigilante Justice");
            } else {
                layLow = false;
                ns.gang.setMemberTask(member.name, "Money Laundering");
            }

            // Buy augmentations
            for (let i = 0; i<augmentations.length; i++) {
                if (member.augmentations.includes(augmentations[i]))
                    continue;
                if (ns.gang.getEquipmentCost(augmentations[i]) < ns.getServerMoneyAvailable("home") / 10) {
                    ns.gang.purchaseEquipment(member.name, augmentations[i]);
                }
                break;
            }
        });

        //Make the script wait for a second before looping again.
        await ns.sleep(200);
    }
}
