targetToHunt =['boar']
var group = ['Schlange','Spinne','Skorpion','Warrior001','Priest001','Mage001']

setInterval(function () 
{
    if (character.name == group[0]) 
    {
        for (let i = 1; i < group.length; i++) 
        {
            let name = group[i];
            send_party_invite(name);
        }
    }

    else 
    {
        if (character.party) 
        {
            if (character.party != group[0]) 
            {
                parent.socket.emit("party", {event: "leave"});
            }
        } 

        else 
        {
            send_party_request(group[0]);
        }
    }
}, 1000 * 10);

//////////////////
setInterval(()=>
{
	
    let chars = ['Mage001','Rogue002','Spinne','Schlange','Rehkitz','Priest001'];
    let ents=Object.values(parent.entities).filter(e => chars.includes(e.target) && e.type == 'monster' && e.mtype == "plantoid");
	
	//game_log(ents.length)
	let mechagnomes=Object.values(parent.entities)
		.filter(e => e.type == 'monster')
	    .filter(e => e.mtype == "plantoid")
		.filter(e => e.target == null)
		.filter(e => distance(character,e)<200)
		.sort((a,b)=>{return distance(character,a) - distance(character,b)});
		
	if(ents.length <6 && get_player('Priest001')){
		
		if(mechagnomes[0]){
			if((character.hp/character.max_hp)>0.8 && !smart.moving && (character.mp/character.max_mp)>0.8){
				if(!is_on_cooldown('taunt')){
		 		//use_skill('taunt',mechagnomes[0])
				}
				}
		}
	}
 
},200)

//////////////////
function ms_to_next_skill(skill) {
    const next_skill = parent.next_skill[skill]
    if (next_skill == undefined) return 0
    const ms = parent.next_skill[skill].getTime() - Date.now()
    return ms < 0 ? 0 : ms
}
async function stompLoop() {
    try {
        if(character.hp<=character.max_hp*0.8){
            if(character.slots.mainhand.name != "basher"){
                await unequip('mainhand')
                await unequip('offhand')
                await equip(locate_item('basher'),'mainhand')
            }
			if(character.mp>=parent.G.skills.stomp.mp){
            await use_skill('stomp')
			}
				reduce_cooldown("stomp", Math.min(...parent.pings))
        }
        if(character.slots.mainhand.name != "vhammer"){
            await equip(locate_item('vhammer'),'mainhand')
            await equip(locate_item('fireblade'),'offhand')
	
        }
		
        
    } catch (e) {
        console.error(e)
    }
    setTimeout(stompLoop, Math.max(1, ms_to_next_skill("stomp")))
}
stompLoop()
async function scareLoop() {
    try {
        if(character.hp<=character.max_hp*0.6){
            if(character.slots.orb.name != "jacko"){
                await equip(locate_item('jacko'))
            }
			if(character.mp>=parent.G.skills.scare.mp){
            await use_skill('scare')
			}
				reduce_cooldown("scare", Math.min(...parent.pings))
        }
        if(character.slots.orb.name != "orbofstr"){
            await equip(locate_item('orbofstr'))
            
        }
        
    } catch (e) {
        console.error(e)
    }
    setTimeout(scareLoop, Math.max(1, ms_to_next_skill("scare")))
}
scareLoop()
function on_party_invite(name) 
{
    console.log("Party Invite");

    if (group.indexOf(name) != -1) 
    {
        accept_party_invite(name);
    }
}
async function agitateLOOP() {
    try {    
        const plantoidS = Object.values(parent.entities).filter(e => e.target == "Warrior001");
		const priestPresent = get_player('Priest001');
		const dreturn = Object.values(parent.entities)
		.filter(e => e.mtype == 'porcupine')
		.filter(e => distance(character,e)<=320)
		
        if(plantoidS.length <6){
			if(priestPresent && dreturn.length == 0){
            set_message("Agitating")
				if(character.mp>=parent.G.skills.agitate.mp){
            await use_skill('agitate')
				}
				}
		}   
    } catch (e) {
        console.error(e)
    }
    setTimeout(agitateLOOP, Math.max(1, ms_to_next_skill("agitate")))
}
agitateLOOP()

async function movementsloop(){
    try{
        await move(-700,-450)
        await move(-770,-450)
    } catch(e){
        console.log(e)
    }
    setTimeout(movementsloop,500)
}
//movementsloop()

function distanceToPoint(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
} 
setInterval(function(){
    loot();
    consumingPotions();

    switch(parent.character.ctype){
        case "warrior":
            var partyMembers1 = partyMembers();
            var needsHealingPM = needsHealing(partyMembers1);
            var targets = targeting(partyMembers1);
            tryAttack(targets);
           	//tryCleave();
            tryHardshell();
            //tryStomp(needsHealingPM);
            tryTaunt();
            //tryCharge();
            tryWarcry();
			//tryAgitate();
          
            //movement(targets);
			//meleeMovment('boar');
        break;
        case "priest":
            var partyMembers1 = partyMembers();
            var needsHealingPM = needsHealing(partyMembers1);
            var targets = targeting(partyMembers1);
            tryHeal(needsHealingPM,targets);
            tryPartyHeal();
            tryCurse(targets);
            tryDarkblessing();
            //movement(targets);
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


},150)

function tryAttack(targets){
 	
    let target = targets[0];
    if(new Date > parent.next_skill['attack'] || parent.next_skill['attack'] == null){
      if(target != null && get_player('Priest001')){
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
        if(character.mp >= parent.G.skills['cleave'].mp){
			if(character.slots.mainhand.name != 'bataxe'){
			equip(locate_item('bataxe'));
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
            if(character.mp>=parent.G.skills['stomp'].mp){
                if(character.slots.mainhand.name != 'basher'){
                   equip(locate_item('basher'));
                }
                parent.socket.emit('skill',{name:'stomp'});
                lastStomp = new Date();
				
	
				
            }
			if(character.slots.mainhand != 'bataxe'){
	   				equip(locate_item('bataxe'));
	  				 }
        }
    } 
}
var lastHardshell;
function tryHardshell(){
    var cooldown = parent.G.skills['hardshell'].cooldown;
    if((character.hp/character.max_hp) < 0.6){
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
            if(!character.s.warcry && character.s.darkblessing){
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
            if((Object.keys(parent.party)).indexOf(ent.target) > -1 && ent.target != parent.character.name && ent.type != "character" && ent.target != "Biene"){
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

function distanceToPoint(x, y) {
    return Math.sqrt(Math.pow(character.real_x - x, 2) + Math.pow(character.real_y - y, 2));
}
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
                if((character.hp/character.max_hp)<0.01)
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

	people=parent.party_list;

return people;
}
function targeting(){
    var partyMember = partyMembers();
    var MonsterToBetargeted = Object.values(parent.entities)
    .filter(m => m.type == 'monster')
    .filter(m => ((m.target == character.name || partyMember.includes(m.target)) || m.target == null && targetToHunt.includes(m.mtype) || (m.cooperative == true &&targetToHunt.includes(m.mtype))));

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
  let movMod = partyCirclePosition(25);
if(target){
      let movePoint = {x:target.real_x+movMod.x,y:target.real_y+movMod.y}
      if(can_move_to(movePoint.x,movePoint.y) && distance(character,movePoint)>15){
          //if(!character.moving){
              move(movePoint.x,movePoint.y);
         // }
      }
      else{
          if(!smart.moving){
              //smart_move({map:target.map,x:movePoint.x,y:movePoint.y});
          }
      }
  }
}

function partyCirclePosition(radius){
  const positions =[];
  if(parent.party){
    for(i = 0;i<parent.party_list.length;i++){
      positions.push({name:parent.party_list[i],x:radius*(Math.cos((360/parent.party_list.length)*i)),y:radius*(Math.sin((360/parent.party_list.length)*i))})
    }
     return positions.find(e => e.name === character.name);
  }
}

function oOo(spot,radius,whoIsCenter){
    var angle = 72*spot;
    var centerX = whoIsCenter.real_x+Math.cos(angle)*radius;
    var centerY = whoIsCenter.real_y+Math.sin(angle)*radius;
    move(centerX,centerY);  
}
///egehank circle runner
/* Sum two of 2D vectors */
function vector_sum(a, b) {
    return {x: a.x + b.x, y: a.y + b.y};
}

/* Convert polar vector coordiantes to cartesian */
function polar2cartesian(v) {
    return {x: v.r*Math.cos(v.a), y: v.r*Math.sin(v.a)};
}

/* Finds the angle of point p relative to center c */
function angle_to_point(c, p) {
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    return Math.atan2(dy, dx);
}

setInterval(()=>{
	const center = {x: 471, y: 217};
	const radius = 25;
	const angle_speed = -character.speed/radius * 0.2;
	
	const current_angle = angle_to_point(center, character);
	const next_angle = current_angle + angle_speed;

	const next_position = vector_sum(center, polar2cartesian({r: radius, a: next_angle}));
	move(next_position.x, next_position.y);
}, 200);

