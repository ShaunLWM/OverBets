export default function calculateOdds(poolArray, winningOutcome, houseCommissionInPercent = 0) {
	if (poolArray.length <= 1) throw new Error("poolArray must have more than one element.");
	if (winningOutcome < 0 || winningOutcome >= poolArray.length) throw new RangeError(`winning outcome must be in range 0 - poolArray.length - 1. winningOutcome = ${winningOutcome}`);
	const poolTotal = poolArray.reduce(
		(total, bettedOnPosition) => total + bettedOnPosition,
	);
	const poolLeft = poolTotal * (1 - houseCommissionInPercent / 100);
	const commission = poolTotal * (houseCommissionInPercent / 100);
	return {
		commission,
		poolTotal,
		poolLeft,
		payoutRatio: (1000 * (poolLeft / poolArray[winningOutcome])) / 1000,
	};
}
