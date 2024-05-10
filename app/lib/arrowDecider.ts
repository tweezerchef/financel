// Assuming global.d.ts has the declaration:
// declare type ResponseNumbers = 1 | 2 | 3 | 4 | 5;

function calculateArrowAmount(difference: number): ResponseNumbers {
    // This function determines the number of arrows based on the difference
    // Here, you define what difference corresponds to 1, 2, 3, 4, or 5 arrows
    // Example thresholds could be set as follows (this is adjustable):
    if (difference <= 0.5) return 1;
    else if (difference <= 1.0) return 2;
    else if (difference <= 1.5) return 3;
    else if (difference <= 2.0) return 4;
    else return 5;
}

export function arrowDecider(guess: number, actual: number): ArrowDeciderReturn {
    const difference = Math.abs(guess - actual);
    const amount: ResponseNumbers = calculateArrowAmount(difference);

    const direction = guess > actual ? '↓' : '↑';

    return {
        direction,
        amount
    };
}
