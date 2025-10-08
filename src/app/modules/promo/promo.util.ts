import { Promo } from "./promo.model"

export const generatePromocode = async () => {
    // Find the most recently created promo with generatePromocode: true
    const lastPromo = await Promo.findOne({ generatePromocode: true })
        .sort({ createdAt: -1 })
        .exec();

    // If lastPromo exists and has a promoCode, try to extract the number and increment
    let nextNumber = 1;
    if (lastPromo && lastPromo.promoCode) {
        // Assuming promoCode is in the format 'BG<number>'
        const match = lastPromo.promoCode.match(/^BG(\d+)$/);
        if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1;
        }
    }

    // Ensure nextNumber is at least 4 digits, pad with leading zeros if necessary
    const paddedNumber = String(nextNumber).padStart(4, '0');
    const newPromoCode = `BG${paddedNumber}`;
    return newPromoCode;
}
