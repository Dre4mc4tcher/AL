/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

function ms_to_next_skill(skill) {
    const next_skill = parent.next_skill[skill]
    if (next_skill == undefined) return 0
    const ms = parent.next_skill[skill].getTime() - Date.now()
    return ms < 0 ? 0 : ms
}
/*
async function moveLoop() {
    try {
        let nearest = get_nearest_monster()
        if (!is_in_range(nearest)) {
            // Move closer
            move(
                character.x + (nearest.x - character.x) / 2,
                character.y + (nearest.y - character.y) / 2
            )
        }
    } catch (e) {
        console.error(e)
    }
    setTimeout(moveLoop, 250)
}
moveLoop()
*/
async function zapperLoop() {
    try {
        if(character.slots.ring1.name == 'zapper' || character.slots.ring2.name == 'zapper'){
            var nearest = Object.values(parent.entities)
            .filter(e => e.target == null)
            .filter(e => distance(character,e) <= 300)
            .filter(e => e.mtype == 'prat')[0]
           
			
			 var targeted = Object.values(parent.entities)
            .filter(e => e.target == 'Schlange')
            
			 
            if (!nearest) {
            } else if (is_in_range(nearest,'zapperzap') && character.mp >= character.max_mp*0.8 && targeted.length < 2) {
                await use_skill('zapperzap',nearest)
                /** NOTE: We're now reducing the cooldown based on the ping */
                reduce_cooldown("zapperzap", Math.min(...parent.pings))
            }

        }
    } catch (e) {
        console.error(e)
    }
    setTimeout(zapperLoop, Math.max(1, ms_to_next_skill("zapperzap")))
}
zapperLoop()

async function lootLoop() {
    try {
        // The built in loot() does pretty much all of the work for us!
        loot()
    } catch (e) {
        console.error(e)
    }
    setTimeout(lootLoop, 250)
}
lootLoop()

setInterval(()=>{consumingPotions ()},250)
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
			if(character.ctype == 'priest' || 'rogue'){ // check if charater is a priest he can heal himself with a better ratio than hp pots so mp is more important
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
//load_code(82)
async function attackLoop() {
    try {
        var nearest; 
		if(get_nearest_monster({target:'Skorpion'||'Schlange'||'Spinne'}) == null){nearest = get_nearest_monster()} 		
		else nearest = get_nearest_monster({target:'Skorpion'||'Schlange'||'Spinne'});
        if (!nearest) {
            set_message("No Monsters")
        } else if (can_attack(nearest)) {
            set_message("Attacking")
            await attack(nearest)
            /** NOTE: We're now reducing the cooldown based on the ping */
            reduce_cooldown("attack", Math.min(...parent.pings))
        }
    } catch (e) {
        console.error(e)
    }
    setTimeout(attackLoop, Math.max(1, ms_to_next_skill("attack")))
}
attackLoop()
async function rspeed() {
    try {
            
            if(!character.s.rspeed){
                set_message("SPEEEEED")
                await use_skill('rspeed',character)
                reduce_cooldown("rspeed", Math.min(...parent.pings))
            }
            
       
    } catch (e) {
        console.error(e)
    }
    setTimeout(rspeed, Math.max(1, ms_to_next_skill("rspeed")))
}
rspeed()
async function mentalBurstLoop() {
    try {
        var nearest; 
		if(get_nearest_monster({target:'Skorpion'||'Schlange'||'Spinne'}) == null){nearest = get_nearest_monster()} 		
		else nearest = get_nearest_monster({target:'Skorpion'||'Schlange'||'Spinne'});
        if (!nearest) {
            set_message("No Monsters")
        } else if (is_in_range(nearest,'mentalburst') && character.name == ('Spinne'||'Skorpion')) {
            set_message("Attacking")
            await use_skill('mentalburst',nearest)
            /** NOTE: We're now reducing the cooldown based on the ping */
            reduce_cooldown("mentalburst", Math.min(...parent.pings))
        }
    } catch (e) {
        console.error(e)
    }
    setTimeout(mentalBurstLoop, Math.max(1, ms_to_next_skill("mentalburst")))
}
mentalBurstLoop()
async function cloaking() {
    try {
            set_message("Cloaking")
            await use_skill('invis')
            /** NOTE: We're now reducing the cooldown based on the ping */
            reduce_cooldown("invis", Math.min(...parent.pings))
       
    } catch (e) {
        console.error(e)
    }
    setTimeout(cloaking, Math.max(1, ms_to_next_skill("invis")))
}
//cloaking()
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
// Accept party invites from characters in group
function on_party_invite(name) 
{
    console.log("Party Invite");

    if (group.indexOf(name) != -1) 
    {
        accept_party_invite(name);
    }
}

//Sells items in whitelist
//Courtesy of: JourneyOver

var sItem = true; //Enable selling of items = true, Disable selling of items = false
var whitelist = ['stramulet','dexamulet','intamulet','wgloves']; //whitelist is for the selling of items

setInterval(function() {

  //sells items in whitelist
  if (sItem) {
    sellItem()
  }

}, 1000 / 4); //Loop every 1/4 seconds.

function sellItem() {
  for (let i = 0; i < character.items.length; i++) {
    let c = character.items[i];
    if (c) {
      if (c && whitelist.includes(c.name)) {

        sell(i);
      }
    }
  }
}
