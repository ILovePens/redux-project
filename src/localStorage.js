
export const loadSessionItems = () => {
	try{
		const serializedItems = sessionStorage.getItem('playerInfos');
		if(serializedItems === null){
			return undefined;
		}

		return JSON.parse(serializedItems)
	} catch (err) {
		return undefined;
	}
}

export const saveSessionItems = (items) => {
	try{
		const serializedItems = JSON.stringify(items)
		sessionStorage.setItem('playerInfos', serializedItems);
	} catch (err) {
		console.log(err)
	}
}