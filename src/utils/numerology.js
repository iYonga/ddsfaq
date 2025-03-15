function formatPrice(num = 0) {
  // make 1000 to 1,000 and 1000000 to 1,000,000
  // this is obviously done by AI
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// export as {} module

export { formatPrice };
