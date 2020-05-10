targetToHunt =['scorpion'];

setInterval(function(){
    loot();
    consumingPotions();
    switch(parent.character.ctype){
        case "warrior":
            var partyMembers1 = partyMembers();
            var needsHealingPM = needsHealing(partyMembers1);
            var targets = targeting(partyMembers1);
            tryAttack(targets);
            tryCleave();
            tryHardshell();
            tryStomp(needsHealingPM);
            tryTaunt();
            tryCharge();
            tryWarcry();
            //tryAgitate();
            movement(targets);
        break;
        case "priest":
            var partyMembers1 = partyMembers();
            var needsHealingPM = needsHealing(partyMembers1);
            var targets = targeting(partyMembers1);
            tryHeal(needsHealingPM,targets);
            tryPartyHeal();
            tryCurse(targets);
            tryDarkblessing();
            movement(targets);
        break;
        case "ranger":
            var partyMembers1 = partyMembers();
            var targets = targeting(partyMembers1);
            tryHuntersmark(targets);
            tryMultishot(partyMembers1,targets);
            trySupershot(targets);
            movement(targets);
        break;
        case "rogue":
            var partyMembers1 = partyMembers();
            var targets = targeting(partyMembers1);
            tryInvis(targets);
            tryMentalburst(targets);
            tryQuickstab(targets);
            tryRogueswiftness(partyMembers1);
            tryAttack(targets);
            movement(targets);
        break;
        case "mage":
            var partyMembers1 = partyMembers();
            var targets = targeting(partyMembers1);
            tryAttack(targets);
            tryEnergize('Rehkitz');
            tryCBurst(partyMembers1);
            movement(targets);
        break;
    }

},100)
