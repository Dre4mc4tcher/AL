function tryAttack(){
    if(new Date > parent.next_skill['attack'] || parent.next_skill['attack'] == null){
      if(target != null){
            if(distance(character,target)<character.range){
                parent.socket.emit('attack', {id: target.id});
            }
        }  
    } 
}

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
function tryStomp(){
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
