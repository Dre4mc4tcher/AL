function tryAttack(targets){
    target = targets[0];
    if(new Date > parent.next_skill['attack'] || parent.next_skill['attack'] == null){
      if(target != null){
            if(distance(character,target)<character.range){
                if(character.mp >= character.mp_cost){
                    parent.socket.emit('attack', {id: target.id});
                }
            }
        }  
    } 
}
/// Warrior Skills
var lastCleave;
function tryCleave(){
    var cooldown = parent.G.skills['cleave'].cooldown;
    if(lastCleave == null || new Date() - lastCleave > cooldown){
        var axeLocation = locate_item('bataxe');
        if(character.mp >= parent.G.skills['cleave'].mp){
            if(axeLocation != null){
                if(character.slots.offhand){
                    unequip('offhand');
                }
                equip(axeLocation);
            }
            parent.socket.emit('skill',{name:'cleave'});
            lastCleave = new Date();
        }
    }
}

var lastStomp;
function tryStomp(needsHealingPM){
    let lowestHealthPartyMember = needsHealingPM[0];
    var cooldown = parent.G.skills['stomp'].cooldown;
    if(lowestHealthPartyMember != null && lowestHealthPartyMember.healthRatio < 0.8){
        if(lastStomp == null || new Date() - lastStomp > cooldown){
            var basherLocation = locate_item('basher');
            if(character.mp>=parent.G.skills['stomp'].mp){
                if(basherLocation != null){
                    if(character.slots.offhand){
                        unequip('offhand');
                    }
                    equip(basherLocation);
                }
                parent.socket.emit('skill',{name:'stomp'});
                lastStomp = new Date();
            }
        }
    }   
}

var lastHardshell;
function tryHardshell(){
    var cooldown = parent.G.skills['hardshell'].cooldown;
    if((character.hp/character.max_hp) < 0.7){
        if(lastHardshell == null || new Date() - lastHardshell > cooldown){
            if(character.mp>=parent.G.skills['hardshell'].mp){
                parent.socket.emit('skill',{name:'hardshell'});
                lastHardshell = new Date();
            }
        }
    }
}

var lastCharge;
function tryCharge(){
    var cooldown = parent.G.skills['charge'].cooldown;
    if(lastCharge == null || new Date() - lastCharge > cooldown){
        if(character.mp >= parent.G.skills['charge'].mp){
            parent.socket.emit('skill',{name:'charge'});
            lastCharge = new Date();
        }
    }
}

var lastWarcry;
function tryWarcry(){
    var cooldown = parent.G.skills['warcry'].cooldown;
    if(lastWarcry == null || new Date() - lastWarcry > cooldown){
        if(character.mp>=parent.G.skills['warcry'].mp){
            if(!character.s.warcry){
                parent.socket.emit('skill',{name:'warcry'});
                lastWarcry = new Date();
            }
        }
    }
}

var lastTaunt;
function tryTaunt(){
    var cooldown = parent.G.skills['taunt'].cooldown;
    for(var i in parent.entities){
        ent = parent.entities[i];
        if(ent.target){
            if((Object.keys(parent.party)).indexOf(ent.target) > -1 && ent.target != parent.character.name){
                if(lastTaunt == null || new Date() - lastTaunt > cooldown){
                    if(character.mp>=parent.G.skills['taunt'].mp){
                        parent.socket.emit('skill',{name:'taunt',id:ent.id});
                        lastTaunt = new Date();
                    }
                }
            }
        }
    }
}

var lastAgitate;
function tryAgitate(){
    var cooldown = parent.G.skills['agitate'].cooldown;
    if(lastAgitate == null || new Date() - lastAgitate > cooldown){
        if(character.mp>=parent.G.skills['agitate'].mp){
            parent.socket.emit('skill',{name:'agitate'});
            lastAgitate = new Date();
        }
    }
}
/// Mage Skills
var lastCBurst;
function tryCBurst(partyMembers){
    var cooldown = parent.G.skills['cburst'].cooldown;
    let members = partyMembers;
    let potTarget =[];
    for(var i in parent.entities){
        ent = parent.entities[i];
        if(ent.target){
            if(members.includes(ent.target) || ent.target == character.name){
                potTarget.push({id:ent.id, mp:ent.hp*2,x:ent.real_x,y:ent.real_y})
            }
        }
    }
    
    if(lastCBurst == null || new Date() - lastCBurst > cooldown){
        if(potTarget.length>0){
            if((character.mp > potTarget[0].mp) && potTarget[0].mp < 2000){
                if(distance(character,potTarget[0])<parent.character.range){
                    parent.socket.emit("skill", {
                        name: "cburst",
                        targets: [[potTarget[0].id,potTarget[0].mp]]
                    });
                }
            }
        }
    }
}

var lastEnergize;
function tryEnergize(nameOfChar){
    var cooldown = parent.G.skills['energize'].cooldown;
    let targetToBeEnergized = get_player(nameOfChar);
    if(targetToBeEnergized != null){
        if(!targetToBeEnergized.s.energized){
            if(lastEnergize == null || new Date() - lastEnergize > cooldown){
                if(character.mp > 300){
                    if(distance(character,targetToBeEnergized)<=320){
                        parent.socket.emit('skill',{name:'energize',id:targetToBeEnergized.id,
                        mp: 300});
                        lastEnergize = new Date();
                    }
                    
                }
            }
        }
    }
}


/// Priest Skills


function tryHeal(needsHealingPM,targets){
    let lowestHealthPartyMember = needsHealingPM[0];
    let target = targets[0];
    if(lowestHealthPartyMember){
        if(lowestHealthPartyMember.healthRatio<0.9){
            if(new Date() > parent.next_skill['attack']){
                lHPM = get_player(lowestHealthPartyMember.name);
                if(distance(character,lHPM)<character.range){
                    parent.socket.emit('heal', {id: lHPM.id});
                }
            }
        }
        else{
            if(target){
                if(new Date() > parent.next_skill['attack']){
                    if(distance(character,target)<character.range){
                        parent.socket.emit('attack', {id: target.id});
                    }
                }
            }
        }
    }
}

var lastDarkblessing;
function tryDarkblessing(){
    var cooldown = parent.G.skills['darkblessing'].cooldown;
    if(lastDarkblessing == null || new Date() - lastDarkblessing > cooldown){
        if(character.mp>=parent.G.skills['darkblessing'].mp){
            if(!character.s.darkblessing){
                parent.socket.emit('skill',{name:'darkblessing'});
                lastDarkblessing = new Date();
            }
        }
    }
}

var lastCurse;
function tryCurse(targets){
    var cooldown = parent.G.skills['curse'].cooldown;
    let target = targets[0];
    if(lastCurse == null || new Date() - lastCurse > cooldown){
        if(character.mp >= parent.G.skills['curse'].mp){
            if(!target.s.cursed && target.max_hp >= 6000){
                parent.socket.emit('skill',{name:'curse',id:target.id});
                lastCurse = new Date();
            }
        }
    }
}

var lastPartyHeal;
function tryPartyHeal(){
    var cooldown = parent.G.skills['partyheal'].cooldown;
    var partyHealMember = Object.keys(parent.party);
    var array = [{name:character.name,healthRatio:character.hp/character.max_hp}];
    for(var i in parent.entities){
        ent = parent.entities[i];
        if(partyHealMember.includes(ent.id)){
            array.push({name:ent.name,healthRatio:ent.hp/ent.max_hp})
        }
    }
	var maxRatio = 0;
	for(i =0;i<array.length;i++){
		maxRatio=maxRatio+array[i].healthRatio;
	}
	if(lastPartyHeal == null || new Date() - lastPartyHeal > cooldown){
        if(character.mp > parent.G.skills['partyheal'].mp){
            if((maxRatio/array.length) < 0.9){
                parent.socket.emit('skill',{name:'partyheal'});
            }
        }
    }
}

/// Rogue Skills

var lastQuickStab;
function tryQuickstab(targets){
    let target = targets[0];
    var cooldown = parent.G.skills['quickstab'].cooldown;
    if(parent.G.items[character.slots.mainhand.name].wtype == 'dagger'){
        if(lastQuickStab == null || new Date() - lastQuickStab > cooldown){
            if(character.mp >= parent.G.skills['quickstab'].mp && (character.mp/character.max_mp) > 0.7){
                if(target != null){
                    if(distance(character,target)<character.range){
                        parent.socket.emit('skill',{name:'quickstab',id:target.id});
                        lastCharge = new Date();
                    }
                }   
            }
        }
    }
}

var lastMentalBurst;
function tryMentalburst(targets){
    let target = targets[0];
    var cooldown = parent.G.skills['mentalburst'].cooldown;
    if(target != null){
        var mentalBurstDamage = ((character.attack*0.9)*0.6)*damage_multiplier(target.resistance-character.rpiercing);
        if(character.int >= parent.G.skills['mentalburst'].requirements.int){
            if(lastMentalBurst == null || new Date() - lastMentalBurst > cooldown){
                if(character.mp >= parent.G.skills['mentalburst'].mp){
                    if(target != null){
                        if(distance(character,target) < (character.range*1.2)+32){
                            if(target.hp<mentalBurstDamage){
                                parent.socket.emit('skill',{name:'mentalburst',id:target.id});
                                lastMentalBurst = new Date();
                            }
                        }
                    }
                }
            }
        }
    }      
}

var lastRogueSwiftness;
function tryRogueswiftness(partyMembers){
    var cooldown = parent.G.skills['rspeed'].cooldown;
    var members = partyMembers;
    for(var ident in parent.entities){
        var entity = parent.entities[ident];
        if((members.includes(entity.name)|| entity.name == character.name) && !entity.s.rspeed && distance(character,entity)<parent.G.skills['rspeed'].range){
            if(character.mp>=parent.G.skills['rspeed'].mp){
                if(lastRogueSwiftness == null || new Date() - lastRogueSwiftness > cooldown){
                    parent.socket.emit('skill',{name:'rspeed',id:entity.id});
                    lastRogueSwiftness = new Date();
                }
            }
        }
    }
    if(!character.s.rspeed){
        if(character.mp>=parent.G.skills['rspeed'].mp){
            if(lastRogueSwiftness == null || new Date() - lastRogueSwiftness > cooldown){
                parent.socket.emit('skill',{name:'rspeed',id:character.id});
                lastRogueSwiftness = new Date();
            }
        }
    }
}

var lastInvis;
function tryInvis(targets){
    let target = targets[0];
    var cooldown = parent.G.skills['invis'].reuse_cooldown;
    if(lastInvis == null || new Date() - lastInvis > cooldown){
        if(target != null){
            if(distance(character,target)<character.range){
                parent.socket.emit('skill',{name:'invis'});
                lastInvis = new Date();
            }
        }     
    }    
}

/////////// Ranger SKILLS

var lastHuntersMark;
function tryHuntersmark(targets){
    var cooldown = parent.G.skills['huntersmark'].cooldown;
    let target = targets[0];
    if(lastHuntersMark == null || new Date() - lastHuntersMark > cooldown){
        if(character.mp >= parent.G.skills['huntersmark'].mp){
            if(target != null){
                if(distance(character,target) < character.range){
                    if(target.max_hp >= character.attack*0.9*damage_multiplier(target.armor-character.apiercing)*3 && !target.s.marked){
                        parent.socket.emit('skill',{name:'huntersmark',id:target.id});
                        lastHuntersMark = new Date();
                    }
                }
            }    
        }
    }
}


var lastSuperShot;
function trySupershot(targets){
    var cooldown = parent.G.skills['supershot'].cooldown;
    let target = targets[0];
    if(lastSuperShot == null || new Date() - lastSuperShot > cooldown){
        if(character.mp >= parent.G.skills['supershot'].mp){
            if(target != null){
                if(distance(character,target) < character.range*3){
                    parent.socket.emit('skill',{name:'supershot',id:target.id});
                    lastSuperShot = new Date();
                }
            }       
        }
    }
}

function tryMultishot(partyMembers,targets){
    let members = partyMembers;
    let next = targets[0];
    let target = Object.values(parent.entities)
    .filter(e => e.type == "monster")
    .filter(e => ((members.includes(e.target) || e.taget == character.name) || (character.attack*0.9*0.5*damage_multiplier(e.armor-character.apiercing))>e.hp))
    .filter(e => distanceToPoint(e.real_x,e.real_y)<parent.character.range)
    .map(e => e.id);

    if(target != null){
        if(new Date > parent.next_skill['attack'] || parent.next_skill['attack'] == null){
            if(target.length > 4 && character.mp >= parent.G.skills['5shot'].mp){
                parent.socket.emit('skill', {name:'5shot',ids: target});
            }
            if(target.length <= 4 && target.length >=3 && character.mp >= parent.G.skills['3shot'].mp){           
                parent.socket.emit('skill', {name:'3shot',ids: target});
            }
            else{
                if(next && distance(character,next)<character.range){
                    parent.socket.emit('attack', {id: next.id});
                }
            }
        }
    } 
}

function distanceToPoint(x, y) {
    return Math.sqrt(Math.pow(character.real_x - x, 2) + Math.pow(character.real_y - y, 2));
}

/////////// Supplemental functions

function damage_multiplier(a){
    return min(1.32,max(0.05,1-(max(0,min(100,a))
    *0.001+max(0,min(100,a-100))
    *0.001+max(0,min(100,a-200))
    *0.00095+max(0,min(100,a-300))
    *0.0009+max(0,min(100,a-400))
    *0.00082+max(0,min(100,a-500))
    *0.0007+max(0,min(100,a-600))
    *0.0006+max(0,min(100,a-700))
    *0.0005+max(0,a-800)
    *0.0004)+max(0,min(50,0-a))
    *0.001+max(0,min(50,-50-a))
    *0.00075+max(0,min(50,-100-a))
    *0.0005+max(0,-150-a)*0.00025))
}


function consumingPotions (){
    //RESUPPLY POTIONS
    // only works when sufficient free slots,gold and an ancient computer is available 
    let potionsToBeUsed =['hpot0','hpot1','mpot0','mpot1']; // potions to be supplied
    let lastPotionBuy;
    let resupplyCycle = 60000; // check every min 
    if(lastPotionBuy == null || new Date() - lastPotionBuy > resupplyCycle){ // check once a minute
        for(potionID in potionsToBeUsed){ // check every potion
            let potionType = potionsToBeUsed[potionID]; 
            let numberOfPotions = num_items(potionType); // how many of the potions do we currently have
            if(numberOfPotions < 100){ // if we are below 100 potions buy new ones
                buy(potionType,200);
            }       
        }
        lastPotionBuy = new Date();
    }
    
    // USEAGE BELOW
	if(!character.rip){   // check if the character is dead
		if(new Date() > parent.next_potion){ // check for cooldown on potions
			if(character.ctype == 'priest'){ // check if charater is a priest he can heal himself with a better ratio than hp pots so mp is more important
				if((character.max_mp-character.mp) > 500){ // use big mp pots when needed                     
                    parent.socket.emit("equip", { num: locate_item("mpot1")});
                    console.log(character.name +' restored 500 MP with MP Pot! next Potion ready in '+ parent.next_potion);
                }
				else if((character.max_mp-character.mp) > 300){ // use small mp pots when needed
                    parent.socket.emit("equip", { num: locate_item("mpot0")});
                    console.log(character.name +' restored 300 MP with MP Pot! next Potion ready in '+ parent.next_potion);
                }
				else if((character.max_hp-character.hp) > 400){ // use big hp pots when needed
                    parent.socket.emit("equip", { num: locate_item("hpot1")});
                    console.log(character.name +' restored 400 HP with HP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_hp-character.hp) > 200){ // use small hp pots when needed
                    parent.socket.emit("equip", { num: locate_item("hpot0")});  
                    console.log(character.name +' restored 200 HP with HP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_mp-character.mp) > 100){ // use mp without pots when needed
                    parent.socket.emit("use", { item: "mp"});
                    console.log(character.name +' restored 100 MP with MP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_hp-character.hp) > 50){ // use hp without pots when needed
                    parent.socket.emit("use", { item: "hp"});
                    console.log(character.name +' restored 50 HP with HP Pot! next Potion ready in '+ parent.next_potion);  
				}
			}
            else{ // if the character is not a priest hp is more important as mp
                if((character.hp/character.max_hp)<0.75)
                {
                    if((character.max_hp-character.hp) > 400){  // use big hp pots when needed
                        parent.socket.emit("equip", { num: locate_item("hpot1")});
                        console.log(character.name +' restored 400 HP with HP Pot! next Potion ready in '+ parent.next_potion);
                    }
                    else if((character.max_hp-character.hp) > 200){ // use small hp pots when needed
                        parent.socket.emit("equip", { num: locate_item("hpot0")});
                        console.log(character.name +' restored 200 HP with HP Pot! next Potion ready in '+ parent.next_potion);
                    }
                    else if((character.max_mp-character.mp) > 500){ // use big mp pots when needed
                        parent.socket.emit("equip", { num: locate_item("mpot1")});
                        console.log(character.name +' restored 500 MP with MP Pot! next Potion ready in '+ parent.next_potion); 
                    }
                    else if((character.max_mp-character.mp) > 300){ // use small mp pots when needed
                        parent.socket.emit("equip", { num: locate_item("mpot0")});
                        console.log(character.name +' restored 300 MP with MP Pot! next Potion ready in '+ parent.next_potion);
                    }
                    else if((character.max_hp-character.hp) > 50){ // use hp without pots when needed
                        parent.socket.emit("use", { item: "hp"});
                        console.log(character.name +' restored 50 HP with HP Pot! next Potion ready in '+ parent.next_potion);
                    }
                    else if((character.max_mp-character.mp) > 100){ // use mp without pots when needed
                        parent.socket.emit("use", { item: "mp"});
                        console.log(character.name +' restored 100 MP with MP Pot! next Potion ready in '+ parent.next_potion);
                    }
                }
				else{
                    if((character.max_mp-character.mp) > 500){ // use big mp pots when needed                     
                        parent.socket.emit("equip", { num: locate_item("mpot1")});
                        console.log(character.name +' restored 500 MP with MP Pot! next Potion ready in '+ parent.next_potion);
                    }
                    else if((character.max_mp-character.mp) > 300){ // use small mp pots when needed
                        parent.socket.emit("equip", { num: locate_item("mpot0")});
                        console.log(character.name +' restored 300 MP with MP Pot! next Potion ready in '+ parent.next_potion);
                    }
                    else if((character.max_hp-character.hp) > 400){ // use big hp pots when needed
                        parent.socket.emit("equip", { num: locate_item("hpot1")});
                        console.log(character.name +' restored 400 HP with HP Pot! next Potion ready in '+ parent.next_potion);
                    }
                    else if((character.max_hp-character.hp) > 200){ // use small hp pots when needed
                        parent.socket.emit("equip", { num: locate_item("hpot0")});  
                        console.log(character.name +' restored 200 HP with HP Pot! next Potion ready in '+ parent.next_potion);
                    }
                    else if((character.max_mp-character.mp) > 100){ // use mp without pots when needed
                        parent.socket.emit("use", { item: "mp"});
                        console.log(character.name +' restored 100 MP with MP Pot! next Potion ready in '+ parent.next_potion);
                    }
                    else if((character.max_hp-character.hp) > 50){ // use hp without pots when needed
                        parent.socket.emit("use", { item: "hp"});
                        console.log(character.name +' restored 50 HP with HP Pot! next Potion ready in '+ parent.next_potion);  
                    }    
                }
			}

		}
    }
    // Item count of an item in the characters inventory
    function num_items(name)
    {
	    var item_count = character.items.filter(item => item != null && item.name == name).reduce(function(a,b){ return a + (b["q"] || 1);
	    }, 0);
	
	    return item_count;
    }
}

function needsHealing(partyMembers){
    let partyMember = partyMembers;
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

//var targetToHunt = ['bee'];

function targeting(partyMembers){
    var partyMember = partyMembers;
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


function movement(targets){
    let target = targets[0];
    if(target != null){
        let movePointOne = character.real_x + (target.real_x - character.real_x) - Math.floor(character.range-10);
        let movePointTwo = character.real_y + (target.real_y - character.real_y) - Math.floor(character.range-10);
        if(distance(character,target)<character.range){

        }
        else{
            if(can_move_to(movePointOne,movePointTwo)){
                move(movePointOne,movePointTwo);
            }
            else{
                if(!smart.moving){
                    smart_move({map:target.map,x:target.real_x,y:target.real_y});
                }
            }
        }
    }   
}

function oOo(spot,radius,whoIsCenter){
    var angle = 72*spot;
    var centerX = whoIsCenter.real_x+Math.cos(angle)*radius;
    var centerY = whoIsCenter.real_y+Math.sin(angle)*radius;
    move(centerX,centerY);  
}


/////////////////////// PARTY CODE
function get_party_list() {
    const party_list_path = "https://raw.githubusercontent.com/egehanhk/ALStuff/master/gcta/gcta_groups.json";

    return new Promise((resolve, reject) => {
        const load_time = new Date();

        const xhrObj = new XMLHttpRequest();
        xhrObj.open('GET', party_list_path, true);
        xhrObj.onload = function (e) {
            if (xhrObj.readyState === 4) {
                if (xhrObj.status === 200) {

                    try {
                        const party_lists = JSON.parse(xhrObj.responseText);
                        resolve(party_lists);
                    } catch (e) {
                        reject();
                        return;
                    }
                    game_log("Party list loaded. " + mssince(load_time) + " ms", "gray");
                } else {
                    reject();
                }
            }
        }
        xhrObj.onerror = reject;
        xhrObj.send(null); // This is what initates the request
    })
}

let party_list = {};
function update_party_list() {
    get_party_list().then((party_lists)=>{
        parent.party_lists = party_lists;
        parent.full_party_list = Object.values(party_lists).reduce(((r, c) => Object.assign(r, c)), {});
        for (const group_name in party_lists) {
            if (character.name in party_lists[group_name]) {
                party_list = {...party_lists[group_name]};
                break;
            }
        }
    }).catch(()=>{
        game_log("Error retrieveing party lists", "red");
    });
}

update_party_list();
setInterval(update_party_list, 3600000); // every hour

// Handles incoming players list
function players_handler(event) {
    parent.player_list = event; // Party checking is done on this list
}

// Register event
parent.socket.on("players", players_handler);

// Request player list
setInterval(()=>{parent.socket.emit("players");}, 10000);


setInterval(()=>{
    // Find parties nearby and lonely dudes
    const parties_available = [];
    const loners = [];
    const process_player = (player) => {
        if (player.name in party_list) {
            if (player.party && character.party !== player.party) {
                // If they are in another party
                parties_available.push(player.party);
            } else if (!player.party) {
                // If they are not in party
                loners.push(player.name);
            }
        }
    }
    if (parent.player_list) { // Server player list available
        for (const player of parent.player_list) {
            process_player(player);
        }
    } else {
        for (const name in party_list) {
            if (name in parent.entities) {
                const player = parent.entities[name];
                process_player(player);
            }
        }
    }
    
    // Sort parties_available and join the alphabetically first party
    if (character.party) parties_available.push(character.party);
    parties_available.sort();
    if (parties_available.length && parties_available[0] !== character.party) {
        game_log("Left party to join " + parties_available[0] + "'s party", "gray");
        leave_party();
        send_party_request(parties_available[0]);
    }
    else if (loners.length) {
        // If not joining another party, send invites to characters not in party
        for (const i in loners) {
            send_party_invite(loners[i]);
        }
    }
}, 10000);

// For combining functions like on_destroy, on_party_invite, etc.
function combine_functions(fn_name, new_function) {
    if (!window[fn_name + "_functions"]) {
        window[fn_name + "_functions"] = [];
        if (window[fn_name]) {
            window[fn_name + "_functions"].push(window[fn_name]);
        }
        window[fn_name] = function () {
            window[fn_name + "_functions"].forEach((fn) => fn.apply(window, arguments));
        }
    }
    window[fn_name + "_functions"].push(new_function);
}

// Deregister event on code close
combine_functions("on_destroy", function() {
    parent.socket.removeListener("players", players_handler);
    delete parent.player_list;
});

combine_functions("on_party_invite", function(name) {
    if (name in party_list) {
        accept_party_invite(name);
    }
});

combine_functions("on_party_request", function(name) {
    if (name in party_list) {
        accept_party_request(name);
    }
});

