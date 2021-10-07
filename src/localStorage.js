
export const loadSessionItems = (name) => {
	try{
		const serializedItems = sessionStorage.getItem(name);
		if(serializedItems === null){
			return undefined;
		}

		return JSON.parse(serializedItems)
	} catch (err) {
		return undefined;
	}
}

export const saveSessionItems = (items, name) => {
	try{
		const serializedItems = JSON.stringify(items)
		sessionStorage.setItem(name, serializedItems);
	} catch (err) {
		console.log(err)
	}
}