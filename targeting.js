targetToHunt =['goo'];
function targeting(){
    var partyMember = partyMembers();
    var MonsterToBetargeted = Object.values(parent.entities)
    .filter(m => m.type == 'monster')
    .filter(m => ((m.target == character.name || partyMember.includes(m.target)) || m.target == null && targetToHunt.includes(m.mtype)));

    for(monsterID in MonsterToBetargeted){
        let currentMonster = MonsterToBetargeted[monsterID];
        if(partyMember.includes(currentMonster.target) || currentMonster.target == character.name){
            currentMonster.targetinUS = 1;
        }
        else{
            currentMonster.targetinUS = 0;
        }
    }
    MonsterToBetargeted.sort(function(current,next){
        if(current.targetinUS > next.targetinUS){
            return -1;
        }
        let distanceCurrent = distance(character,current);
        let distanceNext = distance(character,next);
        if(distanceCurrent < distanceNext){
            return -1;
        }
        else if(distanceCurrent > distanceNext){
            return 1;
        }
        else{
            return 0;
        }
    });
    return MonsterToBetargeted;
}

function partyMembers(){
    people=[];
var partyList = Object.keys(parent.party_lists);
for(i = 0; i< partyList.length; i++){
    let objectkey = partyList[i];
    let partyListA = Object.keys(parent.party_lists[objectkey]);
    for(j = 0; j < partyListA.length; j++){
        people.push(partyListA[j]);
    }
}
return people;
}
