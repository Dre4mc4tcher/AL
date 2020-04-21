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
