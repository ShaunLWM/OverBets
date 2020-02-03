module.exports = {
	calculateOdds(pool, winIndex, calAllPayout = false, houseCommission = 0) {
		if (pool.length <= 1) throw new Error("poolArray must have more than one element.");
		if (winIndex < 0 || winIndex >= pool.length) throw new RangeError(`winning outcome must be in range 0 - poolArray.length - 1. winningOutcome = ${winIndex}`);
		const poolTotal = pool.reduce(
			(total, bettedOnPosition) => total + bettedOnPosition,
		);
		const poolLeft = poolTotal * (1 - houseCommission / 100);
		const commission = poolTotal * (houseCommission / 100);
		let payoutRatio = [((1000 * (poolLeft / pool[winIndex])) / 1000).toFixed(2)];
		if (calAllPayout) payoutRatio = pool.map((p) => ((1000 * (poolLeft / p)) / 1000).toFixed(2));
		return {
			commission,
			poolTotal,
			poolLeft,
			payoutRatio,
		};
	},
};
