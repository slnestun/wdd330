export const productOriginalPriceDetails = (FinalPrice, SuggestedRetailPrice) => {
  if(FinalPrice >= SuggestedRetailPrice) return "";
  const savings = SuggestedRetailPrice.toFixed(2);
  return `<p class="product-card__original_price"><s>$${savings}</s></p>`;
}

export const productDiscountSaveDetails = (FinalPrice, SuggestedRetailPrice) => {
  if(FinalPrice >= SuggestedRetailPrice) return "";
  const savings = Math.round((SuggestedRetailPrice - FinalPrice) * 100) / 100;
  return `<div class="product-card_save_price">Save $${savings}</div>`;
}