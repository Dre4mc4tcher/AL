function needsHealing(){
    let partyMember = partyMembers();
    let potentialHealTargets = Object.values(parent.entities).filter(pt => partyMember.includes(pt.name));
    let partyHealthRatios = [];
    partyHealthRatios.push({name:character.name,healthRatio:(character.hp/character.max_hp)});
    for(i =0;i < potentialHealTargets.length;i++){
        let healthRatio = potentialHealTargets[i].hp/potentialHealTargets[i].max_hp;
            partyHealthRatios.push({
                name:potentialHealTargets[i].name,
                healthRatio:healthRatio,
            });
    }
    partyHealthRatios.sort(function(current,next){
        return current.healthRatio - next.healthRatio;
    })
    return partyHealthRatios;
}
